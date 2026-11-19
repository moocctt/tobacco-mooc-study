// 强调色恢复为宿主导航栏取色，并保留暖纸底/平面层级。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node theme-color.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const has = (s) => src.includes(s);
const isFast = path.basename(file).includes("fast");

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

check("版本升级到 0.0.21", has("// @version      0.0.21"));
check("保留暖纸底", has("--p-bg:#fbf8f3"));
check("保留平面面板", !has("backdrop-filter:blur"));
check("存在导航栏取色函数", has("function headerColor(fallback)"));
check("从页面左上角取元素", has("document.elementsFromPoint(1, 1)"));
check("读取固定/粘性元素背景", has('cs.position === "fixed" || cs.position === "sticky"'));
check("读取计算后的背景色", has("getComputedStyle(el).backgroundColor"));
check("跳过近白背景", has("r > 246 && g > 246 && b > 246"));
check("watchTheme 调用 headerColor", has("const theme = headerColor(fallbackColor);"));
check("动态写入强调色", has('box.style.setProperty("--p-accent", theme.bg)'));
check("动态写入前景色", has('box.style.setProperty("--p-on-accent", theme.light ? "#fff" : "#1f2328")'));
check(
  "保留脚本回退色",
  has(isFast ? 'fallbackColor: "#b35900"' : 'fallbackColor: "#1a7f37"'),
);

const failed = results.filter(([, ok]) => !ok);
for (const [name, ok, extra] of results) console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? ` ${extra}` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed.length ? 1 : 0);
