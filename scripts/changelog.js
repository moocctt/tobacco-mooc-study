#!/usr/bin/env node
// 从 conventional commits 生成 CHANGELOG.md，并推导下一个语义化版本号。
//
//   node scripts/changelog.js           # 只打印，不写文件
//   node scripts/changelog.js --write   # 写 CHANGELOG.md + package.json + 两个 userscript 的 @version
//
// 版本来源是 package.json 的 version，改动会同步到：
//   package.json / userscript/tobacco-mooc-fast.user.js / userscript/tobacco-mooc-unattended.user.js
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");
const NOTES_AT = process.argv.indexOf("--notes");
const NOTES_FILE = NOTES_AT > 0 ? process.argv[NOTES_AT + 1] : "";
const PKG = path.join(ROOT, "package.json");
const CHANGELOG = path.join(ROOT, "CHANGELOG.md");
const USERSCRIPTS = [
  path.join(ROOT, "userscript", "tobacco-mooc-fast.user.js"),
  path.join(ROOT, "userscript", "tobacco-mooc-unattended.user.js")
];

const GROUPS = [
  ["feat", "新功能"],
  ["fix", "修复"],
  ["perf", "性能"],
  ["refactor", "重构"],
  ["style", "界面"],
  ["docs", "文档"],
  ["test", "测试"],
  ["ci", "构建与 CI"],
  ["build", "构建与 CI"],
  ["chore", "杂项"],
  ["other", "其他"]
];

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function lastTag() {
  try {
    return git(["describe", "--tags", "--abbrev=0"]);
  } catch {
    return "";
  }
}

function readCommits(range) {
  const args = ["log", "--pretty=format:%s%x1f%b%x1e"];
  if (range) args.push(range);
  const raw = execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
  return raw.split("\x1e").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
    const [subject, body] = chunk.split("\x1f");
    return { subject: (subject || "").trim(), body: (body || "").trim() };
  });
}

function parse(commit) {
  const m = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/.exec(commit.subject);
  const breaking = !!(m && m[3]) || /BREAKING[ -]CHANGE/.test(commit.body);
  if (!m) return { type: "other", scope: "", text: commit.subject, breaking, subject: commit.subject };
  return { type: m[1].toLowerCase(), scope: m[2] || "", text: m[4].trim(), breaking, subject: commit.subject };
}

function bump(current, commits) {
  const [major, minor, patch] = current.split(".").map((n) => parseInt(n, 10) || 0);
  // 0.x 阶段按 0.0.x 递进（与既有发布节奇一致）；到 1.0 之后才走标准语义化
  if (major === 0) {
    if (commits.some((c) => c.breaking)) return `0.${minor + 1}.0`;
    return `0.${minor}.${patch + 1}`;
  }
  if (commits.some((c) => c.breaking)) return `${major + 1}.0.0`;
  if (commits.some((c) => c.type === "feat")) return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function render(version, date, commits) {
  const lines = [`## [${version}] - ${date}`, ""];
  const breaking = commits.filter((c) => c.breaking);
  if (breaking.length) {
    lines.push("### 破坏性变更", "");
    for (const c of breaking) lines.push(`- ${c.scope ? `**${c.scope}**: ` : ""}${c.text}`);
    lines.push("");
  }
  for (const [type, title] of GROUPS) {
    const list = commits.filter((c) => c.type === type && !c.breaking);
    if (!list.length) continue;
    lines.push(`### ${title}`, "");
    for (const c of list) lines.push(`- ${c.scope ? `**${c.scope}**: ` : ""}${c.text}`);
    lines.push("");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
  const current = pkg.version || "0.0.0";
  const tag = lastTag();
  const range = tag ? `${tag}..HEAD` : "";
  const commits = readCommits(range).map(parse)
    .filter((c) => !/^chore\(release\)/.test(c.subject));

  const MEANINGFUL = new Set(["feat", "fix", "perf", "refactor", "style", "docs", "test", "ci", "build"]);
  // 只改文档 / 测试 / CI 的提交不单独发版（否则改个错字就抬一次 @version，脚本站会白拉一次）
  const SHIPPABLE = new Set(["feat", "fix", "perf", "refactor", "style"]);
  const releasable = commits.filter((c) => c.breaking || MEANINGFUL.has(c.type));
  if (!releasable.some((c) => c.breaking || SHIPPABLE.has(c.type))) {
    console.log(`当前版本 ${current}，没有需要发布的提交`);
    return;
  }

  const next = bump(current, releasable);
  const date = new Date().toISOString().slice(0, 10);
  const section = render(next, date, releasable);

  console.log(`当前版本 ${current}${tag ? ` (上一个 tag ${tag})` : " (还没有 tag)"}`);
  console.log(`提交 ${releasable.length} 条 → 下一个版本 ${next}`);
  console.log("");
  console.log(section);

  if (NOTES_FILE) {
    fs.writeFileSync(NOTES_FILE, section, "utf8");
    console.log(`\n发布说明写入 ${NOTES_FILE}`);
  }

  if (!WRITE) {
    console.log(`\n(dry run，加 --write 才会写文件)`);
    return;
  }

  const head = fs.existsSync(CHANGELOG) ? fs.readFileSync(CHANGELOG, "utf8") : "# 更新日志\n\n本文件由 `npm run release` 从提交记录自动生成，请勿手改。\n\n";
  if (!head.includes(section.trim())) {
    const marker = head.indexOf("\n## ");
    const merged = marker < 0
      ? `${head.trimEnd()}\n\n${section}`
      : `${head.slice(0, marker)}\n${section}${head.slice(marker)}`;
    fs.writeFileSync(CHANGELOG, merged.replace(/\r\n/g, "\n"), "utf8");
    console.log(`写入 ${path.relative(ROOT, CHANGELOG)}`);
  }

  pkg.version = next;
  fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + "\n", "utf8");

  for (const file of USERSCRIPTS) {
    const src = fs.readFileSync(file, "utf8");
    const out = src.replace(/(\/\/ @version\s+)(\S+)/, `$1${next}`);
    if (out !== src) fs.writeFileSync(file, out, "utf8");
  }
  console.log(`版本号已更新为 ${next}`);
}

main();
