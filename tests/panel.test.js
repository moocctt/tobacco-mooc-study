// 面板 DOM 断言：进度块在按钮上方、日志在按钮下方、按钮底色即总进度。
const { JSDOM } = require("jsdom");
const { suite } = require("./lib/tap");
const { KINDS, loadPanelFactory } = require("./lib/userscript");

const META = {
  fast: { prefix: "uf", emoji: "⚡", verb: "刷", title: "快速刷课学习助手", fallbackColor: "#b35900" },
  unattended: { prefix: "um", emoji: "▶", verb: "学习", title: "无人值守学习助手", fallbackColor: "#1a7f37" }
};

const t = suite();

function mount(kind) {
  const m = META[kind];
  const dom = new JSDOM(`<!doctype html><html><body><div class="site"></div></body></html>`, { pretendToBeVisual: true });
  const { window } = dom;
  const store = new Map();
  const gm = {
    getValue: (k, d) => (store.has(k) ? store.get(k) : d),
    setValue: (k, v) => store.set(k, v),
    deleteValue: (k) => store.delete(k)
  };
  const createPanel = loadPanelFactory(kind)(
    window.document, window, window.getComputedStyle, () => 0, console,
    { hash: "#/study/course/detail/1&abc" }
  );
  const state = {
    running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0,
    collapsed: false, pinned: false, stacked: false,
    prog: { secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: 0, sectionSec: 0, sectionTotalSec: 0, nestedDone: 0, nestedTotal: 0, etaMs: null }
  };
  let started = 0;
  const panel = createPanel({
    prefix: m.prefix,
    title: m.title,
    fallbackColor: m.fallbackColor,
    emoji: m.emoji,
    verb: m.verb,
    consoleTag: "TEST",
    state,
    lockOwner: () => "",
    currentBid: () => "abc",
    gm,
    onStart: () => { started += 1; }
  });
  panel.mount();
  const box = panel.getBox();
  const q = (sel) => box.querySelector(sel);
  const txt = (sel) => (q(sel) ? q(sel).textContent : "<missing>");
  return { panel, state, box, q, txt, started: () => started, window, p: m.prefix };
}

for (const kind of KINDS) {
  console.log(`\n[${kind}] panel`);
  const { panel, state, q, txt, started, window, p } = mount(kind);
  const sel = (s) => `.${p}-${s}`;
  const id = (s) => `#${p}-${s}`;

  // 1. 空闲
  panel.ui();
  t.check("idle pwrap hidden", q(sel("pwrap")).style.display, "none");
  t.check("idle status", txt(id("status")), "■ 已停止 · 当前页课程/专题");
  t.check("idle sub hidden", q(sel("sub")).style.display, "none");
  t.check("idle fill 0", q(sel("fill")).style.width, "0px");
  t.check("idle button", txt(id("start")), `${META[kind].emoji} ${META[kind].verb}本课程/专题`);

  // 2. 运行中（任务模式，5 门课，小节 3/7，当前小节过半）
  state.running = true;
  state.course = "烟草专卖管理";
  state.section = "4/7 (video) 第三章 专卖内管";
  state.round = 4;
  state.submitted = 240;
  Object.assign(state.prog, {
    coursesDone: 1, coursesTotal: 5, secDone: 3, secTotal: 7, curFrac: 0.5,
    sectionSec: 240, sectionTotalSec: 390, etaMs: 150000
  });
  panel.ui();
  t.check("running pwrap shown", q(sel("pwrap")).style.display, "");
  t.check("course row", txt(sel("course")), "烟草专卖管理");
  t.check("pct in button", txt(id("start")), "⏸ 停止 30%");
  t.check("fill width", q(sel("fill")).style.width, "30%");
  t.check("meta", txt(sel("meta")), "小节 3/7 · 课程 2/5");
  t.check("status", txt(id("status")), "4/7 (video) 第三章 专卖内管");
  t.check("sub", txt(sel("sub")), "第 4 轮 · 已报 240/390s · 约 3 分");

  // 3. 折叠后标题栏显示百分比
  panel.setCollapsed(true);
  t.check("collapsed headpct", txt(sel("headpct")), "30%");
  t.check("collapsed body hidden", q(sel("body")).style.display, "none");
  panel.setCollapsed(false);
  t.check("expanded headpct", txt(sel("headpct")), "");

  // 4. 单课程模式：纯小节占比
  Object.assign(state.prog, { coursesDone: 0, coursesTotal: 1, secDone: 3, curFrac: 0.5, secTotal: 7 });
  panel.ui();
  t.check("single course pct", txt(id("start")), "⏸ 停止 50%");
  t.check("single course meta", txt(sel("meta")), "小节 3/7");

  // 5. 全部完成
  Object.assign(state.prog, { coursesDone: 5, coursesTotal: 5, secDone: 7, curFrac: 0, secTotal: 7 });
  panel.ui();
  t.check("done pct", txt(id("start")), "⏸ 停止 100%");
  t.check("done meta", txt(sel("meta")), "小节 7/7 · 课程 5/5");
  state.running = false;
  panel.ui();
  t.check("done stopped label", txt(id("start")), "✓ 已完成 100%");
  Object.assign(state.prog, { coursesDone: 1, coursesTotal: 5, secDone: 3, curFrac: 0.5, secTotal: 7 });
  panel.ui();
  t.check("stopped label", txt(id("start")), "▶ 继续 30%");
  state.running = true;
  panel.ui();

  // 6. ETA 文案
  const eta = (ms) => {
    Object.assign(state.prog, { etaMs: ms, sectionSec: 10, sectionTotalSec: 100 });
    panel.ui();
    return txt(sel("sub"));
  };
  t.check("eta seconds", eta(8000), "第 4 轮 · 已报 10/100s · 约 8 秒");
  t.check("eta minutes", eta(150000), "第 4 轮 · 已报 10/100s · 约 3 分");
  t.check("eta hours", eta(4980000), "第 4 轮 · 已报 10/100s · 约 1 小时 23 分");
  t.check("eta exact hour", eta(7200000), "第 4 轮 · 已报 10/100s · 约 2 小时");
  t.check("eta none", eta(null), "第 4 轮 · 已报 10/100s");

  // 7. 还不知道总时长时退回已报秒数
  Object.assign(state.prog, { sectionSec: 0, sectionTotalSec: 0, etaMs: null });
  state.submitted = 90;
  panel.ui();
  t.check("sub no total", txt(sel("sub")), "第 4 轮 · 已报 90s");

  // 8. 点按钮
  q(id("start")).dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  t.check("start clicked", started(), 1);

  // 9. 日志上限 60 行
  for (let i = 0; i < 80; i++) panel.log(`line ${i}`);
  t.check("log capped", q(id("log")).children.length, 60);

  // 10. 布局：进度块在按钮上方，日志在按钮下方
  Object.assign(state.prog, { secDone: 3, secTotal: 6, curFrac: 0.5, coursesDone: 1, coursesTotal: 5, sectionSec: 90, sectionTotalSec: 180, etaMs: 9e4 });
  panel.ui();
  {
    const kids = Array.from(q(sel("body")).children);
    const iProg = kids.findIndex((el) => el.classList.contains(`${p}-prog`));
    const iBtn = kids.findIndex((el) => el.querySelector(id("start")));
    const iLog = kids.findIndex((el) => el.id === `${p}-log`);
    t.check("prog block exists", iProg, 0);
    t.check("prog above button", iProg < iBtn, true);
    t.check("log below button", iLog > iBtn, true);
    t.check("fill width == pct", q(sel("fill")).style.width, "32%");
    t.check("pct in button", txt(id("start")), "⏸ 停止 32%");
    t.check("meta text", txt(sel("meta")), "小节 3/6 · 课程 2/5");
    t.check("course name", txt(sel("course")), "烟草专卖管理");
  }

  // 11. 销毁
  panel.destroy();
  t.check("destroyed", panel.getBox(), null);
}

const failed = t.report();
process.exit(failed ? 1 : 0);
