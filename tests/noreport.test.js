// 验证「无人值守不代报进度」：接上 playSection / playDoc / settleWith 之后，
// 引擎不应再碰 start-progress / video-progress / doc-progress / course-section-progress。
const fs = require("fs");

const file = process.argv[2] || "tobacco-mooc-unattended.user.js";
const src = fs.readFileSync(file, "utf8");
const start = src.indexOf("  // src/token.js");
const end = src.indexOf("  // src/panel.js");
if (start < 0 || end < 0) throw new Error("engine block not found");
const engineSrc = src.slice(start, end);

const factory = new Function(
  "document", "window", "console", "location", "localStorage", "XMLHttpRequest", "fetch", "navigator", "setTimeout", "clearTimeout",
  engineSrc + "\n; return { createEngine, API, DONE, SKIP, MEDIA, NESTED };"
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

// 课程：视频一 + 文档一 + 关联课程（子课里有视频二）
const courses = {
  c1: {
    name: "父课程",
    secs: [
      { id: "v1", rid: "v1", type: 6, name: "视频一", total: 60 },
      { id: "d1", rid: "d1", type: 3, name: "文档一", total: 0 },
      { id: "n1", rid: "child1", type: 10, name: "关联课程", total: 0 }
    ]
  },
  child1: { name: "子课程", secs: [{ id: "v2", rid: "v2", type: 6, name: "视频二", total: 60 }] }
};

const state = {
  running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0,
  collapsed: false, pinned: false, stacked: false,
  prog: { secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: 0, sectionSec: 0, sectionTotalSec: 0, etaMs: null, nestedDone: 0, nestedTotal: 0 }
};

const calls = [];
const done = {};      // 已完成的 section（模拟平台自己记账）
const logs = [];

const api = {
  req: async (method, path, opts) => {
    calls.push(path);
    if (path.endsWith("/human/task")) {
      return [200, { items: [{ id: "t1", businessId: "c1", name: "父课程", status: 1, businessType: 1, finishStatus: 0 }] }];
    }
    if (path.endsWith("/course-front/register")) {
      const c = courses[opts.data.courseId];
      return [200, { name: c.name, versionId: "v1", register: true }];
    }
    if (path.endsWith("/subject/chapter-progress")) {
      const c = courses[opts.params.courseId];
      return [200, [{ courseChapterSections: c.secs.map((s) => ({
        referenceId: s.id, resourceId: s.rid, sectionName: s.name, sectionType: s.type,
        progress: { finishStatus: done[s.id] ? 2 : 0, studyTotalTime: done[s.id] ? s.total : 0, lessonLocation: done[s.id] ? s.total : 0 }
      })) }]];
    }
    throw new Error("引擎不应调用 " + path);
  }
};

const config = {
  getStep: () => 30,
  backdateS: (s) => s,
  roundSleepMs: () => 0,
  roundsSlack: 10,
  taskGapMs: () => 0,
  coursePageLabel: "本课程"
};

const played = [];
const engine = createEngine({
  api, state, config,
  log: (m) => logs.push(m),
  ui: noop,
  sleep: async () => {},
  lock: null,
  currentBid: () => "",
  // 真实播放：直接标记完成（等价于平台自己记上）
  playSection: async (sec) => { played.push(["play", sec.name]); done[sec.id] = true; return [true, "播放完成"]; },
  // 非视频小节：只打开，等平台记录
  playDoc: async (sec) => { played.push(["doc", sec.name]); done[sec.id] = true; return [true, "平台已记录完成"]; },
  // 关联课程结算：不 POST，只打开父页等平台
  settleWith: async (parentId, childId, sectionId) => { played.push(["settle", parentId, childId]); done[sectionId] = true; return true; }
});

const out = [];
const check = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  out.push(`${ok ? "PASS" : "FAIL"} ${label}: got ${JSON.stringify(got)}${ok ? "" : ` want ${JSON.stringify(want)}`}`);
};

(async () => {
  const r = await engine.runAll();
  check("runAll ok", r.ok, true);
  check("视频走真实播放", played.filter((p) => p[0] === "play").map((p) => p[1]), ["视频一", "视频二"]);
  check("文档走打开等待", played.filter((p) => p[0] === "doc").map((p) => p[1]), ["文档一"]);
  check("关联课程走 UI 结算", played.filter((p) => p[0] === "settle").map((p) => p[2]), ["child1"]);

  const reportish = calls.filter((p) => /start-progress|video-progress|doc-progress|course-section-progress|course-progress-update/.test(p));
  check("零上报请求", reportish, []);
  out.push("api 调用: " + [...new Set(calls)].join(" | "));

  console.log(out.join("\n"));
  const failed = out.filter((l) => l.startsWith("FAIL")).length;
  console.log(`\n${out.length - failed}/${out.length} passed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("THROW", e && e.message); process.exit(1); });
