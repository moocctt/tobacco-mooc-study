// 配额策略：第一次全程不入账 → 触发「等到次日」→ 跨过午夜 → 第二次入账完成。
const { suite } = require("./lib/tap");
const { KINDS, loadEngine } = require("./lib/userscript");

const t = suite();
const realNow = Date.now;

async function runOne(kind) {
  console.log(`\n[${kind}] quota`);
  const { createEngine } = loadEngine(kind);

  // 假时钟：sleep 直接把时间推过去，15 小时的等待瞬间结束
  let fakeNow = new Date(2026, 10, 16, 9, 0, 0).getTime();
  Date.now = () => fakeNow;
  const sleep = (ms) => { fakeNow += ms; return Promise.resolve(); };

  const courses = { c1: { name: "课程一", secs: [{ id: "s1", type: 6, name: "视频一", total: 180 }] } };
  const studied = {};
  const logs = [];
  let taskHits = 0;
  let logIdSeq = 1;

  const api = {
    req: async (method, path, opts) => {
      if (path.endsWith("/human/task")) {
        taskHits += 1;
        return [200, { items: [{ id: "t1", businessId: "c1", name: "课程一", status: 1, businessType: 1, finishStatus: 0 }], total: 1 }];
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
        const sec = courses.c1.secs.find((s) => s.id === id);
        return [200, { id: logIdSeq++, remainingTime: Math.max(0, sec.total - (studied[id] || 0)) }];
      }
      if (path.endsWith("/video-progress")) {
        // 第一次运行平台一分不给；第二次（跨过午夜后）才开始入账
        if (taskHits >= 2) studied.s1 = Math.min(180, (studied.s1 || 0) + Number(opts.data.studyTime || 0));
        return [200, { errorCode: 0 }];
      }
      return [200, {}];
    }
  };

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
      roundSleepMs: () => 1000,
      roundsSlack: 10,
      taskGapMs: () => 1000,
      coursePageLabel: "刷本课程",
      quotaPolicy: () => "wait"
    },
    log: (m) => logs.push(m),
    ui: () => {},
    sleep,
    lock: { acquire() {}, release() {}, lockOwner: () => "" },
    currentBid: () => "",
    playSection: null
  });

  const res = await engine.runAll();

  t.ok("重试确实发生", taskHits >= 2, `taskHits=${taskHits}`);
  t.ok("打了等待日志", logs.some((l) => l.includes("后自动继续")), logs.join(" | ").slice(0, 200));
  t.ok("打了恢复日志", logs.some((l) => l.includes("开始继续")), "");
  t.ok("最终成功", res.ok === true, JSON.stringify(res));
  t.ok("时钟越过午夜", fakeNow > new Date(2026, 10, 17, 0, 0, 0).getTime(), new Date(fakeNow).toString());
  t.ok("小节刷满", studied.s1 === 180, `studied=${studied.s1}`);

  Date.now = realNow;
}

(async () => {
  for (const kind of KINDS) await runOne(kind);
  process.exit(t.report() ? 1 : 0);
})().catch((e) => {
  Date.now = realNow;
  console.log("FATAL", (e && e.stack) || e);
  process.exit(1);
});
