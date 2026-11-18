// 配额误判回归：剩余时长因平台聚合延迟而不下降时，不能立刻判定配额耗尽。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node quota.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const a = src.indexOf("  // src/token.js");
const b = src.indexOf("  // src/panel.js");
if (a < 0 || b < 0) throw new Error("engine block not found");

function makeEngine({ remAt, studyAt, reportBody, roundHardCap = 5000 }) {
  let clock = 0;
  let reportCalls = 0;
  const FakeDate = { now: () => clock };
  const factory = new Function(
    "document", "window", "console", "location", "localStorage", "XMLHttpRequest", "fetch", "navigator", "setTimeout", "clearTimeout", "Date",
    src.slice(a, b) + "\n; return { createEngine };"
  );
  const noop = () => {};
  const logs = [];
  const state = {
    running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0,
    prog: { secDone: 0, secTotal: 1, curFrac: 0, coursesDone: 0, coursesTotal: 1, sectionSec: 0, sectionTotalSec: 0, nestedDone: 0, nestedTotal: 0, etaMs: null }
  };
  const api = {
    req: async (method, p, opts) => {
      if (p.endsWith("/course-front/register")) return [200, { name: "课程一", versionId: "v1", register: true }];
      if (p.endsWith("/subject/chapter-progress")) {
        return [200, [{ courseChapterSections: [{
          referenceId: "s1", resourceId: "s1", sectionName: "视频一", sectionType: 6,
          progress: { finishStatus: 0, studyTotalTime: studyAt(clock) }
        }] }]];
      }
      if (p.includes("/start-progress/")) return [200, { id: "log-" + String(clock), remainingTime: remAt(clock) }];
      if (p.endsWith("/video-progress")) { reportCalls += 1; return [200, reportBody || { finishStatus: 0 }]; }
      if (p.endsWith("/course-progress-update") || p.endsWith("/course-section-progress")) return [200, {}];
      throw new Error("unexpected path " + p);
    }
  };
  const createEngine = factory(
    { addEventListener: noop, querySelector: () => null, querySelectorAll: [] , documentElement: null, body: null, elementsFromPoint: () => [] },
    { addEventListener: noop, innerWidth: 1200, innerHeight: 800 },
    { log: noop, warn: noop, error: noop },
    { hash: "", reload: noop },
    { getItem: () => null },
    function () { this.setRequestHeader = noop; this.open = noop; this.send = noop; this.addEventListener = noop; },
    async () => ({ ok: false }),
    { userAgent: "node" },
    setTimeout, clearTimeout,
    FakeDate
  ).createEngine;
  const engine = createEngine({
    api, state,
    config: {
      getStep: () => 90,
      backdateS: (s) => s,
      roundSleepMs: () => 0,
      roundsSlack: 5,
      roundHardCap,
      taskGapMs: () => 0,
      coursePageLabel: "本课程"
    },
    log: (m) => logs.push(m),
    ui: noop,
    sleep: async (ms) => { clock += Math.max(0, Number(ms) || 0); },
    lock: null,
    currentBid: () => "c1",
    playSection: null
  });
  return { engine, state, logs, clock: () => clock, reportCalls: () => reportCalls };
}

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

(async () => {
  // 平台聚合延迟：前两分钟 studyTotalTime 会涨，remainingTime 却不涨；之后一起恢复。
  {
    const { engine, state, logs } = makeEngine({
      remAt: (t) => (t < 135e3 ? 360 : 0),
      studyAt: (t) => (t < 60e3 ? 0 : 90)
    });
    const r = await engine.runAll();
    check("延迟增长不判配额", r.quotaHit === false, JSON.stringify(r));
    check("延迟增长能完成", r.ok === true && state.prog.secDone === 1, JSON.stringify({ r, secDone: state.prog.secDone }));
    check("延迟增长日志有观察提示", logs.some((m) => /未下降|观察|复核|聚合/.test(m)), logs.join(" | "));
  }

  // 剩余时长回升说明服务端重算，不应沿用旧的停滞计时。
  {
    const { engine, logs } = makeEngine({
      remAt: (t) => (t < 30e3 ? 360 : t < 60e3 ? 370 : 0),
      studyAt: () => 0
    });
    const r = await engine.runAll();
    check("回升不判配额", r.quotaHit === false && r.ok === true, JSON.stringify(r));
    check("回升有重新计时日志", logs.some((m) => /\u56DE\u5347/.test(m)), logs.join(" | "));
  }

  // 平台明确回配额文案时，优先按显式信号停下，不再靠猜测。
  {
    const { engine, logs } = makeEngine({
      remAt: () => 360,
      studyAt: () => 0,
      reportBody: { errorCode: 40999, message: "\u5F53\u65E5\u5B66\u65F6\u914D\u989D\u5DF2\u6EE1" }
    });
    const r = await engine.runAll();
    check("显式配额提示立即停下", r.quotaHit === true, JSON.stringify(r));
    check("显式配额提示写入日志", logs.some((m) => /\u914D\u989D/.test(m)), logs.join(" | "));
  }

  // 剩余时长长期不动也不能按配额停：继续上报，只有安全上限才结束。
  {
    const { engine, logs, reportCalls } = makeEngine({
      remAt: () => 360,
      studyAt: () => 0,
      roundHardCap: 8
    });
    const r = await engine.runAll();
    check("剩余时长不动不判配额", r.quotaHit === false, JSON.stringify(r));
    check("剩余时长不动仍持续上报", reportCalls() === 8, JSON.stringify({ r, reportCalls: reportCalls() }));
    check("停止原因不是配额猜测", logs.some((m) => /安全上限/.test(m)) && !logs.some((m) => /判定当日学时配额已满/.test(m)), logs.join(" | "));
  }

  for (const [name, ok, extra] of results) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : "  " + JSON.stringify(extra)}`);
  }
  const failed = results.filter((r) => !r[1]).length;
  console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("THROW", e && e.stack || e);
  process.exit(1);
});
