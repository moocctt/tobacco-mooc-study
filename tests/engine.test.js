const fs = require("fs");

const file = process.argv[2];
const src = fs.readFileSync(file, "utf8");
const start = src.indexOf("  // src/token.js");
const end = src.indexOf("  // src/panel.js");
if (start < 0 || end < 0) throw new Error("engine block not found");
const engineSrc = src.slice(start, end);

const factory = new Function(
  "document", "window", "console", "location", "localStorage", "XMLHttpRequest", "fetch", "navigator", "setTimeout", "clearTimeout",
  engineSrc + "\n; return { createEngine, API, DONE, SKIP, MEDIA };"
);

const noop = () => {};
const createEngine = factory(
  { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], documentElement: null, body: null, elementsFromPoint: () => [] },
  { addEventListener: noop, innerWidth: 1200, innerHeight: 800 },
  { log: noop, warn: noop, error: noop },
  { hash: "", reload: noop },
  null,
  function () { this.setRequestHeader = noop; this.open = noop; this.send = noop; this.addEventListener = noop; },
  async () => ({ ok: false, status: 0 }),
  { wakeLock: { request: async () => ({ addEventListener: noop }) } },
  setTimeout, clearTimeout
).createEngine;

// ---- fake platform ----
const courses = {
  c1: { name: "课程一", secs: [{ id: "s1", type: 6, name: "视频一", total: 180 }, { id: "s2", type: 6, name: "视频二", total: 180 }] },
  c2: { name: "课程二", secs: [{ id: "s3", type: 6, name: "视频三", total: 90 }, { id: "s4", type: 9, name: "考试", total: 0 }] }
};
const state = {
  running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0,
  collapsed: false, pinned: false, stacked: false,
  prog: { courseName: "", secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: 0, sectionSec: 0, sectionTotalSec: 0, etaMs: null }
};
const studied = {};
let logIdSeq = 1;
const logs = [];

const api = {
  req: async (method, path, opts) => {
    const p = path;
    if (p.endsWith("/human/task")) return [200, { items: [{ id: "t1", businessId: "c1", name: "课程一", status: 1, businessType: 1, finishStatus: 0 }, { id: "t2", businessId: "c2", name: "课程二", status: 1, businessType: 1, finishStatus: 0 }], total: 2 }];
    if (p.endsWith("/course-front/register")) return [200, { name: courses[opts.data.courseId].name, versionId: "v1", register: true }];
    if (p.endsWith("/subject/chapter-progress")) {
      const c = courses[opts.params.courseId];
      return [200, [{ courseChapterSections: c.secs.map((s) => ({ referenceId: s.id, resourceId: s.id, sectionName: s.name, sectionType: s.type, progress: { finishStatus: (studied[s.id] || 0) >= s.total && s.total > 0 ? 2 : 0, studyTotalTime: studied[s.id] || 0 } })) }]];
    }
    if (p.includes("/start-progress/")) {
      const id = p.split("/").pop();
      const sec = Object.values(courses).flatMap((c) => c.secs).find((s) => s.id === id);
      const rem = Math.max(0, sec.total - (studied[id] || 0));
      return [200, { id: logIdSeq++, remainingTime: rem }];
    }
    if (p.endsWith("/video-progress")) {
      const sec = Object.values(courses).flatMap((c) => c.secs).find((s) => s.id === currentSec);
      studied[currentSec] = (studied[currentSec] || 0) + opts.data.studyTime;
      return [200, { finishStatus: studied[currentSec] >= sec.total ? 2 : 0 }];
    }
    if (p.endsWith("/course-progress-update") || p.endsWith("/course-section-progress")) return [200, {}];
    throw new Error("unexpected path " + p);
  }
};
let currentSec = null;
const snaps = [];
const origReq = api.req;
api.req = async (method, path, opts) => {
  if (path.includes("/start-progress/")) currentSec = path.split("/").pop();
  return origReq(method, path, opts);
};

const config = {
  getStep: () => 90,
  backdateS: (s) => s,
  roundSleepMs: () => 0,
  roundsSlack: 5,
  taskGapMs: () => 0,
  coursePageLabel: "本课程"
};

const engine = createEngine({
  api, state, config,
  log: (m) => logs.push(m),
  ui: () => {
    const p = state.prog;
    const cf = p.secTotal ? Math.min(1, (p.secDone + p.curFrac) / p.secTotal) : 0;
    const ov = p.coursesTotal > 1 ? Math.min(1, (p.coursesDone + cf) / p.coursesTotal) : cf;
    snaps.push({ pct: Math.round(ov * 100), secDone: p.secDone, secTotal: p.secTotal });
  },
  sleep: async () => {},
  lock: null,
  currentBid: () => "",
  playSection: null
});

const out = [];
const check = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  out.push(`${ok ? "PASS" : "FAIL"} ${label}: got ${JSON.stringify(got)}${ok ? "" : ` want ${JSON.stringify(want)}`}`);
};

(async () => {
  const r = await engine.runAll();
  check("runAll ok", r.ok, true);
  check("coursesTotal", state.prog.coursesTotal, 2);
  check("coursesDone", state.prog.coursesDone, 2);
  check("last course secTotal excludes exam", state.prog.secTotal, 1);
  check("last course secDone", state.prog.secDone, 1);
  check("curFrac reset", state.prog.curFrac, 0);
  check("all sections studied", studied, { s1: 180, s2: 180, s3: 90 });
  check("log has completion", logs.some((l) => l.includes("全部任务处理完毕")), true);

  // overall pct using panel formula
  const p = state.prog;
  const courseFrac = p.secTotal ? Math.min(1, (p.secDone + p.curFrac) / p.secTotal) : 0;
  const overall = p.coursesTotal > 1 ? Math.min(1, (p.coursesDone + courseFrac) / p.coursesTotal) : courseFrac;
  check("final pct", Math.round(overall * 100), 100);

  const pcts = snaps.map((s) => s.pct);
  let mono = true;
  for (let i = 1; i < pcts.length; i++) if (pcts[i] < pcts[i - 1]) mono = false;
  check("pct monotonic", mono, true);
  check("pct last", pcts[pcts.length - 1], 100);
  check("pct saw 25", pcts.includes(25), true);
  check("pct saw 50", pcts.includes(50), true);
  out.push("pct series: " + pcts.join(","));

  console.log(out.join("\n"));
  const failed = out.filter((l) => l.startsWith("FAIL")).length;
  console.log(`\n${out.length - failed}/${out.length} passed`);
  process.exit(failed ? 1 : 0);
})();
