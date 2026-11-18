// 点击停止时同步暂停播放，并阻止续播把视频重新拉起来。
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) throw new Error("usage: node stop-pause.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const has = (s) => src.includes(s);

const results = [];
const check = (name, cond) => results.push([name, !!cond]);

check("版本升级到 0.0.19", has("// @version      0.0.19"));
check("停止时查询 video 与 audio", has('document.querySelectorAll("video, audio").forEach((x) => {'));
check("停止时同步调用 pause", has("if (!x.paused && !x.ended) x.pause();"));
check("停止日志说明已暂停播放", has('panel.log("\\u6B63\\u5728\\u505C\\u6B62\\u5E76\\u6682\\u505C\\u64AD\\u653E\\u2026")'));
check("续播前再次检查 stopFlag", has('if (state.stopFlag) return [false, "\\u5DF2\\u505C\\u6B62"];') && has("if (stalls >= 2 && m && m.paused && !m.ended)"));
check("自动续播在停止请求期间跳过", has("if (!state.running || state.stopFlag) return;"));

for (const [name, ok] of results) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
}
const failed = results.filter((r) => !r[1]).length;
console.log(`\n${results.length - failed}/${results.length} passed  ${path.basename(file)}`);
process.exit(failed ? 1 : 0);
