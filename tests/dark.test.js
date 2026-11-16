// 暗黑模式：自动时段（含跨午夜）、常亮/关闭、考试页跳过、顶栏不反相。
const { suite } = require("./lib/tap");
const { KINDS, loadDark } = require("./lib/userscript");

const t = suite();

function makeGm(store) {
  return {
    getValue: (k, d) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : d),
    setValue: (k, v) => { store[k] = v; }
  };
}

function at(h) {
  const d = new Date(2026, 0, 1, h, 0, 0);
  return d;
}

for (const kind of KINDS) {
  console.log(`\n[${kind}] dark`);
  const store = {};
  const gm = makeGm(store);
  const logs = [];
  const d = loadDark(kind, { gm, log: (m) => logs.push(m) });

  // 默认自动 19-7, 跨午夜
  t.check("默认 auto", d.mode(), "auto");
  t.check("默认时段 19-7", d.hours(), { from: 19, to: 7 });
  t.ok("18 点不暗", !d.isDarkNow(at(18)));
  t.ok("19 点暗", d.isDarkNow(at(19)));
  t.ok("23 点暗", d.isDarkNow(at(23)));
  t.ok("0 点暗", d.isDarkNow(at(0)));
  t.ok("6 点暗", d.isDarkNow(at(6)));
  t.ok("7 点不暗", !d.isDarkNow(at(7)));
  t.ok("12 点不暗", !d.isDarkNow(at(12)));

  // 常亮 / 关闭
  d.setMode("on");
  t.check("切常亮", d.mode(), "on");
  t.ok("常亮时中午也暗", d.isDarkNow(at(12)));
  d.setMode("off");
  t.ok("关闭时夜里不暗", !d.isDarkNow(at(23)));
  d.setMode("auto");

  // 同日区间
  d.setHour("from", 9);
  d.setHour("to", 17);
  t.ok("9-17 区间: 10 点暗", d.isDarkNow(at(10)));
  t.ok("9-17 区间: 18 点不暗", !d.isDarkNow(at(18)));
  t.check("非法小时被拒", d.setHour("from", 99), false);

  // 相等视作 from 之后全天
  d.setHour("from", 12);
  d.setHour("to", 12);
  t.ok("from==to: 12 点暗", d.isDarkNow(at(12)));
  t.ok("from==to: 11 点不暗", !d.isDarkNow(at(11)));

  // 跳过页
  const loc = { hash: "#/login" };
  const d2 = loadDark(kind, { gm, location: loc });
  t.check("登录页跳过", d2.shouldStyle(), false);
  loc.hash = "#/exam/detail/1";
  t.check("考试页跳过", d2.shouldStyle(), false);
  loc.hash = "#/home";
  t.check("首页不跳过", d2.shouldStyle(), true);

  // CSS: 顶栏单独处理, 不在反相 ROOTS 里
  const css = d2.apply ? (function () {
    const g = {};
    const store2 = {};
    const el = { style: {}, setAttribute() {}, appendChild() {} };
    const doc = { documentElement: { getAttribute: () => null, setAttribute() {}, removeAttribute() {}, appendChild() {}, hasAttribute: () => false }, getElementById: () => null, createElement: () => el };
    const gm3 = { getValue: (k, d) => (k === "darkMode" ? "on" : d), setValue() {} };
    const d3 = loadDark(kind, { document: doc, gm: gm3, location: { hash: "#/home" } });
    d3.apply();
    return el.textContent || "";
  })() : "";
  t.ok("顶栏有独立底色规则", css.indexOf(".header") >= 0 && css.indexOf("#0b2419") >= 0);
  t.ok("顶栏不被反相", /\.header\{background:#0b2419!important;filter:none/.test(css));
  t.ok("内容区仍整体反相", css.indexOf("filter:invert(1) hue-rotate(180deg)") >= 0);
}

const failed = t.report();
process.exit(failed ? 1 : 0);
