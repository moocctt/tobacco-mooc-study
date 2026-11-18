// 鉴权失败端到端：引擎把 auth 标转换成 authFailed，入口不自动刷新页面。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node authflow.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const out = [];
const check = (label, ok) => out.push(`${ok ? "PASS" : "FAIL"} ${label}`);

function makeEngine() {
  const a = src.indexOf("  // src/token.js");
  const b = src.indexOf("  // src/panel.js");
  if (a < 0 || b < 0) throw new Error("engine block not found");
  const factory = new Function(
    "document", "window", "console", "location", "localStorage", "XMLHttpRequest", "fetch", "navigator", "setTimeout", "clearTimeout",
    src.slice(a, b) + "\n; return { createEngine };"
  );
  const noop = () => {};
  const doc = { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], documentElement: null, body: null, elementsFromPoint: () => [] };
  const win = { addEventListener: noop, innerWidth: 1200, innerHeight: 800 };
  const loc = { hash: "", reload: noop };
  const store = { getItem: () => null };
  const xhr = function () { this.setRequestHeader = noop; this.open = noop; this.send = noop; this.addEventListener = noop; };
  return factory(doc, win, { log: noop, warn: noop, error: noop }, loc, store, xhr, async () => ({ ok: false }), { userAgent: "node" }, setTimeout, clearTimeout).createEngine;
}

(async () => {
  // 1) engine.runAll() 的 catch 必须把 err.auth 变成 authFailed
  const createEngine = makeEngine();
  const state = { running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0, prog: {} };
  const authErr = Object.assign(new Error("登录态失效"), { auth: true });
  let reqCalls = 0;
  const api = {
    req: async () => {
      reqCalls++;
      throw authErr;
    },
  };
  const engine = createEngine({
    api, state,
    config: { getStep: () => 30, backdateS: (s) => s, roundSleepMs: () => 0, roundsSlack: 0, taskGapMs: () => 0 },
    log: () => {}, ui: () => {}, sleep: async () => {}, lock: null, currentBid: () => "",
  });
  let result = null;
  try {
    result = await engine.runAll();
  } catch {
  }
  check("runAll 不把 auth 错误继续抛出", result !== null);
  check("runAll 返回 authFailed", result && result.authFailed === true && result.ok === false, JSON.stringify(result && { ok: result.ok, authFailed: result.authFailed }));
  check("auth 错误不触发重试风暴", reqCalls <= 2, String(reqCalls));

  // 2) 入口的 .then 结果处理：authFailed 分支不能安排 reload
  const start = src.indexOf("engine.runAll().then((r) => {");
  const end = src.indexOf("}).catch(", start);
  if (start < 0 || end < 0) throw new Error("entry result handler not found");
  const body = src.slice(start + "engine.runAll().then((r) => {".length, end);
  const runHandler = new Function("r", "panel", "state", "setTimeout", "location", body);
  for (const [name, r, wantReload] of [
    ["authFailed 不刷新", { ok: false, authFailed: true }, false],
    ["正常完成才刷新", { ok: true }, true],
  ]) {
    const logs = [];
    const timers = [];
    let reloaded = false;
    runHandler(r, { log: (m) => logs.push(m) }, { stopFlag: false }, (fn, ms) => { timers.push(ms); if (typeof fn === "function") fn(); }, { reload: () => { reloaded = true; } });
    check(name, reloaded === wantReload, JSON.stringify({ timers, logs, reloaded }));
    if (name === "authFailed 不刷新") check("authFailed 给出提示", logs.some((m) => /不自动刷新/.test(m)), JSON.stringify(logs));
  }

  // 3) unattended 的 autoContinue 成功/失败计数里没有 reload
  if (/createEngine\(.*playSection/.test(src)) {
    const s = src.indexOf("  function autoContinue() {");
    const e = src.indexOf("\n  autoContinue();", s);
    if (s < 0 || e < 0) throw new Error("autoContinue not found");
    const fnSrc = src.slice(s, e);
    check("autoContinue 不调用 location.reload", !/location\.reload\s*\(/.test(fnSrc));
    const makeAuto = new Function("gm", "isStudyPage", "state", "sessionStorage", "panel", "setTimeout", "engine", "location", fnSrc + "\nreturn autoContinue;");
    const runAuto = async (r, fails) => {
      const saved = [];
      let removed = false;
      let reloaded = false;
      const autoLogs = [];
      const auto = makeAuto(
        { getValue: () => true },
        () => true,
        { running: false },
        { getItem: () => fails, setItem: (k, v) => saved.push(v), removeItem: () => { removed = true; } },
        { log: (m) => autoLogs.push(m) },
        (fn) => fn(),
        { runAll: async () => r },
        { reload: () => { reloaded = true; } },
      );
      await auto();
      for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0));
      return { reloaded, saved, removed, autoLogs };
    };
    const bad = await runAuto({ ok: false, authFailed: true }, "2");
    check("autoContinue 的 auth 失败只计数不刷新", !bad.reloaded && bad.saved.includes("3"), JSON.stringify(bad));
    const good = await runAuto({ ok: true }, "2");
    check("autoContinue 成功后清除失败计数且不刷新", !good.reloaded && good.removed && good.saved.length === 0, JSON.stringify(good));
  }

  console.log(out.join("\n"));
  const failed = out.filter((l) => l.startsWith("FAIL")).length;
  console.log(`\n${out.length - failed}/${out.length} passed  ${path.basename(file)}`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("THROW", e && e.stack || e);
  process.exit(1);
});
