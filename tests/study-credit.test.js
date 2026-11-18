// 服务端入账回归：剩余时长归零但服务端学时不动时，必须停下并给出诊断，而不是继续空转。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node study-credit.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const a = src.indexOf("  // src/token.js");
const b = src.indexOf("  // src/panel.js");
if (a < 0 || b < 0) throw new Error("engine block not found");

function makeEngine({ remAt, studyAt, finishAt = () => 0, roundHardCap = 5000 }) {
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
    req: async (method, p) => {
      if (p.endsWith("/course-front/register")) return [200, { name: "课程一", versionId: "v1", register: true }];
      if (p.endsWith("/subject/chapter-progress")) {
        return [200, [{ courseChapterSections: [{
          referenceId: "s1", resourceId: "s1", sectionName: "视频一", sectionType: 6,
          progress: { finishStatus: finishAt(clock, reportCalls), studyTotalTime: studyAt(clock, reportCalls) }
        }] }]];
      }
      if (p.includes("/start-progress/")) return [200, { id: "log-" + String(reportCalls), remainingTime: remAt(clock, reportCalls) }];
      if (p.endsWith("/video-progress")) { reportCalls += 1; return [200, { finishStatus: 0 }]; }
      if (p.endsWith("/course-progress-update") || p.endsWith("/course-section-progress")) return [200, {}];
      throw new Error("unexpected path " + p);
    }
  };
  const createEngine = factory(
    { addEventListener: noop, querySelector: () => null, querySelectorAll: [], documentElement: null, body: null, elementsFromPoint: () => [] },
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
      getStep: () => 90, backdateS: (s) => s, roundSleepMs: () => 0, roundsSlack: 5,
      roundHardCap, taskGapMs: () => 0, coursePageLabel: "本课程"
    },
    log: (m) => logs.push(m),
    ui: noop,
    sleep: async (ms) => { clock += Math.max(0, Number(ms) || 0); },
    lock: null,
    currentBid: () => "c1",
    playSection: null
  });
  return { engine, state, logs, reportCalls: () => reportCalls };
}

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

(async () => {
  {
    const { engine, logs } = makeEngine({
      remAt: (t, n) => (n < 2 ? 180 : 0),
      studyAt: (t, n) => (n < 2 ? 0 : 180)
    });
    const r = await engine.runAll();
    check("学时增长时正常完成", r.ok === true && r.creditHit === false, JSON.stringify(r));
    check("完成核验确认已入账", logs.some((m) => /核验/.test(m) && /已入账/.test(m)), logs.join(" | "));
  }

  {
    const { engine, logs, reportCalls } = makeEngine({
      remAt: () => 360,
      studyAt: () => 0
    });
    const r = await engine.runAll();
    check("停滞不入账时停下", r.creditHit === true && r.ok === false, JSON.stringify(r));
    check("停在十轮而非五千轮", reportCalls() === 10, JSON.stringify({ r, reportCalls: reportCalls() }));
    check("日志给出未入账诊断", logs.some((m) => /未入账/.test(m)) && logs.some((m) => /诊断/.test(m)), logs.join(" | "));
  }

  {
    const { engine, logs, reportCalls } = makeEngine({
      remAt: (t, n) => (n < 3 ? 360 : 0),
      studyAt: () => 0
    });
    const r = await engine.runAll();
    check("rem归零但学时不涨也停", r.creditHit === true && r.ok === false, JSON.stringify(r));
    check("完成前做服务端核验", reportCalls() === 3 && logs.some((m) => /服务端学时未增长/.test(m)), JSON.stringify({ r, reportCalls: reportCalls(), logs }));
  }

  {
    const { engine, logs } = makeEngine({
      remAt: (t, n) => (n < 3 ? 360 : 0),
      studyAt: () => 0,
      finishAt: (t, n) => (n >= 3 ? 2 : 0)
    });
    const r = await engine.runAll();
    check("finishStatus完成时不误停", r.ok === true && r.creditHit === false, JSON.stringify(r));
    check("完成时不再报未入账", !logs.some((m) => /服务端学时未增长/.test(m)), logs.join(" | "));
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
