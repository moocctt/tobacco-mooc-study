// 折叠后标题栏仍显示简短状态与百分比。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node collapsed-status.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const has = (s) => src.includes(s);

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

check("版本升级到 0.0.22", has("// @version      0.0.22"));
check("标题栏包含状态节点", has('class="${prefix}-headstatus"'));
check("状态节点默认隐藏", has(".${prefix}-headstatus{display:none"));
check("折叠时显示状态节点", has('[data-collapsed="1"] .${prefix}-headstatus{display:block}'));
check("查询状态节点", has("headStatus = box.querySelector(`.${prefix}-headstatus`);"));
check("展开时清空状态节点", has('headStatus.textContent = state2.collapsed ? compact : "";'));
check("折叠时仍显示百分比", has('state2.collapsed && hasProg ? pct + "%"'));
check("折叠状态含学习中", has('state2.running ? "学习中"'));
check("折叠状态含正在停止", has('stopping ? "正在停止"'));
check("折叠状态含已完成", has('complete ? "已完成"'));
check("折叠状态含已暂停", has('pct > 0 ? "已暂停"'));
check("折叠状态含尚未开始", has('"尚未开始"'));

for (const [name, ok, extra] of results) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : "  " + JSON.stringify(extra)}`);
}
const failed = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed ? 1 : 0);
