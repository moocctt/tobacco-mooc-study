// 可感知 ETA：保留精确值，同时按估计时长给出生活化参照。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node eta.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const a = src.indexOf("    function etaSense(ms) {");
const b = src.indexOf("    function ui() {", a);
if (a < 0 || b < 0) throw new Error("eta functions not found");
const snippet = src.slice(a, b);
const { etaSense, fmtEta } = new Function(snippet + "\n; return { etaSense, fmtEta };")();

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

check("8 秒是一眨眼", etaSense(8e3) === "一眨眼", etaSense(8e3));
check("30 秒是喝口水的功夫", etaSense(30e3) === "喝口水的功夫", etaSense(30e3));
check("4 分钟是一首歌", etaSense(4 * 60e3) === "一首歌", etaSense(4 * 60e3));
check("10 分钟是一杯咖啡", etaSense(10 * 60e3) === "一杯咖啡", etaSense(10 * 60e3));
check("40 分钟是一集短剧", etaSense(40 * 60e3) === "一集短剧", etaSense(40 * 60e3));
check("80 分钟是一集电视剧", etaSense(80 * 60e3) === "一集电视剧", etaSense(80 * 60e3));
check("150 分钟是一场电影", etaSense(150 * 60e3) === "一场电影", etaSense(150 * 60e3));
check("10 小时是睡一觉", etaSense(10 * 3600e3) === "睡一觉", etaSense(10 * 3600e3));
check("47 分钟同时显示数字和参照", fmtEta(47 * 60e3) === "约 47 分 · 一集电视剧", fmtEta(47 * 60e3));
check("8 秒同时显示数字和参照", fmtEta(8e3) === "约 8 秒 · 一眨眼", fmtEta(8e3));
check("不足 1 秒仍不显示", fmtEta(500) === "", fmtEta(500));
check("宽度不足可悬停看完整副行", /subEl\.title = subEl\.textContent/.test(src));

for (const [name, ok, extra] of results) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : "  " + JSON.stringify(extra)}`);
}
const failed = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed ? 1 : 0);
