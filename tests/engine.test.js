// 引擎行为：任务模式跑完两门课、跳过考试类小节、总进度单调不回退。
const { suite } = require("./lib/tap");
const { KINDS, loadEngine } = require("./lib/userscript");

const t = suite();

function makePlatform() {
  const courses = {
    c1: { name: "课程一", secs: [{ id: "s1", type: 6, name: "视频一", total: 180 }, { id: "s2", type: 6, name: "视频二", total: 180 }] },
    c2: { name: "课程二", secs: [{ id: "s3", type: 6, name: "视频三", total: 90 }, { id: "s4", type: 9, name: "考试", total: 0 }] }
  };
  const studied = {};
  const logs = [];
  const snaps = [];
  let logIdSeq = 1;
  let currentSec = null;

  const allSecs = () => Object.values(courses).flatMap((c) => c.secs);
  const find = (id) => allSecs().find((s) => s.id === id);

  const api = {
    req: async (method, path, opts) => {
      if (path.endsWith("/human/task")) {
        return [200, {
          items: [
            { id: "t1", businessId: "c1", name: "课程一", status: 1, businessType: 1, finishStatus: 0 },
            { id: "t2", businessId: "c2", name: "课程二", status: 1, businessType: 1, finishStatus: 0 }
          ],
          total: 2
        }];
      }
      if (path.endsWith("/course-front/register")) {
        return [200, { name: courses[opts.data.courseId].name, versionId: "v1", register: true }];
      }
      if (path.endsWith("/subject/chapter-progress")) {
        const c = courses[opts.params.courseId];
        return [200, [{
          courseChapterSections: c.secs.map((s) => ({
            referenceId: s.id, resourceId: s.id, sectionName: s.name, sectionType: s.type,
            progress: { finishStatus: (studied[s.id] || 0) >= s.total && s.total > 0 ? 2 : 0, studyTotalTime: studied[s.id] || 0 }
          }))
        }]];
      }
      if (path.includes("/start-progress/")) {
        const id = path.split("/").pop();
        currentSec = id;
        return [200, { id: logIdSeq++, remainingTime: Math.max(0, find(id).total - (studied[id] || 0)) }];
      }
      if (path.endsWith("/video-progress")) {
        studied[currentSec] = (studied[currentSec] || 0) + Number(opts.data.studyTime || 0);
        return [200, { finishStatus: studied[currentSec] >= find(currentSec).total ? 2 : 0 }];
      }
      return [200, {}];
    }
  };

  return { api, studied, logs, snaps };
}

async function runOne(kind) {
  console.log(`\n[${kind}] engine`);
  const { createEngine } = loadEngine(kind);
  const { api, studied, logs, snaps } = makePlatform();

  const state = {
    running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0,
    collapsed: false, pinned: false, stacked: false,
    prog: { secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: 0, sectionSec: 0, sectionTotalSec: 0, nestedDone: 0, nestedTotal: 0, etaMs: null }
  };

  const engine = createEngine({
    api, state,
    config: {
      getStep: () => 90,
      backdateS: (s) => s,
      roundSleepMs: () => 0,
      roundsSlack: 5,
      taskGapMs: () => 0,
      coursePageLabel: "本课程"
    },
    log: (m) => logs.push(m),
    ui: () => {
      const p = state.prog;
      const cf = p.secTotal ? Math.min(1, (p.secDone + p.curFrac) / p.secTotal) : 0;
      const ov = p.coursesTotal > 1 ? Math.min(1, (p.coursesDone + cf) / p.coursesTotal) : cf;
      snaps.push({ pct: Math.round(ov * 100) });
    },
    sleep: async () => {},
    lock: null,
    currentBid: () => "",
    playSection: null
  });

  const r = await engine.runAll();
  t.check("runAll ok", r.ok, true);
  t.check("coursesTotal", state.prog.coursesTotal, 2);
  t.check("coursesDone", state.prog.coursesDone, 2);
  t.check("末课 secTotal 不含考试", state.prog.secTotal, 1);
  t.check("末课 secDone", state.prog.secDone, 1);
  t.check("curFrac 归零", state.prog.curFrac, 0);
  t.check("小节都刷满了", studied, { s1: 180, s2: 180, s3: 90 });
  t.check("日志有总结", logs.some((l) => l.includes("全部任务处理完毕")), true);

  const p = state.prog;
  const cf = p.secTotal ? Math.min(1, (p.secDone + p.curFrac) / p.secTotal) : 0;
  const overall = p.coursesTotal > 1 ? Math.min(1, (p.coursesDone + cf) / p.coursesTotal) : cf;
  t.check("最终 100%", Math.round(overall * 100), 100);

  const pcts = snaps.map((s) => s.pct);
  let mono = true;
  for (let i = 1; i < pcts.length; i++) if (pcts[i] < pcts[i - 1]) mono = false;
  t.check("进度单调不回退", mono, true);
  t.check("进度收尾 100%", pcts[pcts.length - 1], 100);
  t.check("中途出现 25%", pcts.includes(25), true);
  t.check("中途出现 50%", pcts.includes(50), true);
  t.note("序列: " + pcts.join(","));
}

(async () => {
  for (const kind of KINDS) await runOne(kind);
  process.exit(t.report() ? 1 : 0);
})().catch((e) => {
  console.log("FATAL", (e && e.stack) || e);
  process.exit(1);
});
