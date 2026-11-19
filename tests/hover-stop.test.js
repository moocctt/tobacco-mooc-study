// 运行中的按钮：默认显示进度，悬停/键盘聚焦显示停止，无 hover 设备默认显示停止。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node hover-stop.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const has = (s) => src.includes(s);

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

check("版本升级到 0.0.21", has("// @version      0.0.21"));
check("按钮包含停止文案节点", has('class="${prefix}-stoplabel"'));
check("停止文案默认隐藏", has(".${prefix}-stoplabel{display:none"));
check("运行态由 data-running 标记", has('btnStart.dataset.running = state2.running && !state2.stopFlag ? "1" : "0";'));
check(
  "悬停或键盘聚焦时隐藏进度文案",
  has('#${prefix}-start[data-running="1"]:hover .${prefix}-label,${P} #${prefix}-start[data-running="1"]:focus-visible .${prefix}-label{display:none}'),
);
check(
  "悬停或键盘聚焦时显示停止文案",
  has('#${prefix}-start[data-running="1"]:hover .${prefix}-stoplabel,${P} #${prefix}-start[data-running="1"]:focus-visible .${prefix}-stoplabel{display:block}'),
);
check("无 hover 设备默认显示停止", has("@media (hover:none)"));
check(
  "运行中默认文案是学习状态",
  has("label = `学习中${pctText}`"),
  "expected: 学习中${pctText}",
);
check(
  "运行中不再直接把停止写进默认文案",
  !has("state2.running ? `\\u23F8 \\u505C\\u6B62${pctTxt}`"),
);
check(
  "停止文案仍保留百分比",
  has('const stopText = `停止${pctText}`;'),
);
check(
  "停止中固定文案不变",
  has('label = "正在停止…"') && has("disabled = true"),
);
check(
  "可访问名称包含停止动作",
  has('，${stopText}'),
);

for (const [name, ok, extra] of results) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : "  " + JSON.stringify(extra)}`);
}
const failed = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed ? 1 : 0);
