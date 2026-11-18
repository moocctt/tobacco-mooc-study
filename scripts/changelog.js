#!/usr/bin/env node
/**
 * 从 git 提交历史生成 CHANGELOG.md。
 *
 * 分节规则（以 userscript 的 `@version` 为发布钥匙）：
 *   - 比「最新一次升版提交」更新的提交 → 归入「未发布」。脚本的 @version 没变，
 *     脚本站就不会推新版本，所以这些改动确实还没到用户手里。
 *   - 其余提交 → 归入它所在提交里 @version 的版本。
 *   - 纯升版提交（`chore(release)`）不单独列条，只用来定版本号与日期。
 *
 * 用法:
 *   node scripts/changelog.js            写 CHANGELOG.md
 *   node scripts/changelog.js --check    只校验（过期时退出码 1），CI 用
 *   node scripts/changelog.js --stdout   打到标准输出
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "CHANGELOG.md");
const FILES = [
  "userscript/tobacco-mooc-fast.user.js",
  "userscript/tobacco-mooc-unattended.user.js",
];

const SECTION_ORDER = ["新功能", "修复", "性能", "重构", "样式", "文档", "测试", "构建与 CI", "杂务", "回滚", "其他"];
const TYPE_TO_SECTION = {
  feat: "新功能",
  fix: "修复",
  perf: "性能",
  refactor: "重构",
  style: "样式",
  docs: "文档",
  test: "测试",
  ci: "构建与 CI",
  build: "构建与 CI",
  chore: "杂务",
  revert: "回滚",
};
const UNRELEASED = "未发布";

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch (e) {
    if (allowFail) return "";
    throw e;
  }
}

function repoUrl() {
  const raw = git(["remote", "get-url", "origin"], { allowFail: true }).trim();
  const m = raw.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  return m ? `https://github.com/${m[1]}/${m[2]}` : "";
}

function readCommits() {
  const raw = git(["log", "--no-merges", "--date=short", "--pretty=format:%H%x1f%ad%x1f%s%x1f%b%x1e"]);
  return raw
    .split("\x1e")
    .map((rec) => rec.replace(/^\n/, ""))
    .filter(Boolean)
    .map((rec) => {
      const [hash, date, subject, body = ""] = rec.split("\x1f");
      return { hash, date, subject: (subject || "").trim(), body: (body || "").trim() };
    });
}

const versionCache = new Map();
function versionAt(hash) {
  if (versionCache.has(hash)) return versionCache.get(hash);
  let out = "";
  for (const f of FILES) {
    const text = git(["show", `${hash}:${f}`], { allowFail: true });
    const m = text.match(/@version\s+([\w.\-+]+)/);
    if (m) { out = m[1]; break; }
  }
  versionCache.set(hash, out);
  return out;
}

function parseCommit(c) {
  const m = c.subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);
  const breaking = Boolean(m && m[3]) || /^BREAKING[ -]CHANGE:/im.test(c.body);
  const type = m ? m[1].toLowerCase() : "";
  return {
    ...c,
    type,
    scope: m ? m[2] || "" : "",
    text: m ? m[4] : c.subject,
    breaking,
    section: TYPE_TO_SECTION[type] || "其他",
    isReleaseChore: /^chore\(release\)/i.test(c.subject),
  };
}

function build() {
  const commits = readCommits().map(parseCommit);
  const url = repoUrl();

  // 每个提交所在版本的快照
  for (const c of commits) c.version = versionAt(c.hash);

  // 找出升版提交（与父提交版本不同），并记下最新一次升版的位置
  let newestBumpIdx = Infinity;
  let newestBumpVersion = "";
  for (let i = 0; i < commits.length; i++) {
    const parent = git(["rev-parse", `${commits[i].hash}^`], { allowFail: true }).trim();
    if (!parent) continue; // 根提交不算升版
    const pv = versionAt(parent);
    if (commits[i].version && commits[i].version !== pv) {
      commits[i].isBump = true;
      if (i < newestBumpIdx) { newestBumpIdx = i; newestBumpVersion = commits[i].version; }
    }
  }

  // 每个版本分节的日期 = 引入该版本的那次升版提交的日期
  const versionDate = new Map();
  for (let i = commits.length - 1; i >= 0; i--) {
    if (commits[i].isBump) versionDate.set(commits[i].version, commits[i].date);
  }

  const buckets = new Map();
  const order = [];
  const push = (version, c) => {
    if (!buckets.has(version)) {
      buckets.set(version, []);
      order.push(version);
    }
    buckets.get(version).push(c);
  };

  for (let i = 0; i < commits.length; i++) {
    const c = commits[i];
    if (c.isReleaseChore) continue; // 纯升版提交不列条
    if (/^docs\(changelog\)/i.test(c.subject)) continue; // 机器人自己写的更新日志提交
    if (/^test(?:\([^)]*\))?:/i.test(c.subject)) continue; // 纯测试提交不改变发布内容
    const version = i < newestBumpIdx ? UNRELEASED : (c.version || UNRELEASED);
    push(version, c);
  }

  const lines = [];
  lines.push("# 更新日志");
  lines.push("");
  lines.push("> 本文件由 `scripts/changelog.js` 从 git 提交历史自动生成，请勿手工编辑。");
  lines.push("> 版本号取自 userscript 的 `@version`：脚本靠它触发脚本站更新，所以升版之后的改动归入「未发布」。");
  lines.push("");

  if (!order.length) {
    lines.push("暂无记录。");
    lines.push("");
  }

  for (const version of order) {
    const list = buckets.get(version);
    if (!list.length) continue;
    if (version === UNRELEASED) {
      lines.push("## 未发布");
      if (newestBumpVersion) lines.push("");
      if (newestBumpVersion) lines.push(`> 已合并但尚未升版（当前发布版为 ${newestBumpVersion}）。`);
    } else {
      const date = versionDate.get(version) || list[list.length - 1].date;
      lines.push(date ? `## ${version} — ${date}` : `## ${version}`);
    }
    lines.push("");

    const breaking = list.filter((c) => c.breaking);
    if (breaking.length) {
      lines.push("### 破坏性变更");
      lines.push("");
      for (const c of breaking) lines.push(`- ${bullet(c, url)}`);
      lines.push("");
    }

    for (const name of SECTION_ORDER) {
      const group = list.filter((c) => c.section === name);
      if (!group.length) continue;
      lines.push(`### ${name}`);
      lines.push("");
      for (const c of group) lines.push(`- ${bullet(c, url)}`);
      lines.push("");
    }
  }

  return lines.join("\n").replace(/\n+$/, "\n");
}

function bullet(c, url) {
  const scope = c.scope ? `**${c.scope}**: ` : "";
  const sha = url
    ? `[${c.hash.slice(0, 7)}](${url}/commit/${c.hash})`
    : `\`${c.hash.slice(0, 7)}\``;
  return `${scope}${c.text} (${sha})`;
}

function main() {
  const args = process.argv.slice(2);
  let content;
  try {
    content = build();
  } catch (e) {
    console.error("生成失败:", e && e.message ? e.message : e);
    process.exit(2);
  }

  if (args.includes("--stdout")) {
    process.stdout.write(content);
    return;
  }

  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  const normalize = (s) => s.replace(/\r\n/g, "\n");

  if (args.includes("--check")) {
    if (normalize(current) !== normalize(content)) {
      console.error("CHANGELOG.md 与 git 历史不一致，请运行 `npm run changelog` 后提交。");
      process.exit(1);
    }
    console.log("CHANGELOG.md 是最新的。");
    return;
  }

  if (normalize(current) === normalize(content)) {
    console.log("CHANGELOG.md 无变化。");
    return;
  }
  fs.writeFileSync(OUT, content, "utf8");
  console.log(`已写入 CHANGELOG.md（${content.split("\n").length} 行）`);
}

main();
