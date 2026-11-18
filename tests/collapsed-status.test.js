// 折叠后标题栏仍显示简短状态与百分比。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node collapsed-status.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const has = (s) => src.includes(s);

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

check("版本升级到 0.0.18", has("// @version      0.0.18"));
check("标题栏包含状态节点", has('class="${prefix}-headstatus"'));
check("状态节点默认隐藏", has(".${prefix}-headstatus{display:none"));
check("折叠时显示状态节点", has('[data-collapsed="1"] .${prefix}-headstatus{display:block}'));
check("查询状态节点", has("headStatus = box.querySelector(`.${prefix}-headstatus`);"));
check("展开时清空状态节点", has('headStatus.textContent = state2.collapsed ? compact : "";'));
check("折叠时仍显示百分比", has('state2.collapsed && hasProg ? pct + "%"'));
check("折叠状态含播放中", has('state2.running ? "\\u25B6 \\u64AD\\u653E\\u4E2D"'));
check("折叠状态含停止中", has('state2.stopFlag && state2.running ? "\\u23F8 \\u505C\\u6B62\\u4E2D"'));
check("折叠状态含已完成", has('pct >= 100 ? "\\u2713 \\u5DF2\\u5B8C\\u6210"'));
check("折叠状态含已暂停", has('pct > 0 ? "\\u25A0 \\u5DF2\\u6682\\u505C"'));
check("折叠状态含已停止", has('"\\u25A0 \\u5DF2\\u505C\\u6B62";'));

for (const [name, ok, extra] of results) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : "  " + JSON.stringify(extra)}`);
}
const failed = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed ? 1 : 0);
