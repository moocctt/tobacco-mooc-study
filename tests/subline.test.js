// 无人值守副行用「已播」、进度取播放器当前位置、ETA 按 1:1 剩余秒数。
const fs = require("fs");
const file = process.argv[2] || "tobacco-mooc-unattended.user.js";
const src = fs.readFileSync(file, "utf8");
// unattended 独有：syncProgress 每 1 秒跟随播放器
const isUnattended = /\bsyncProgress\(depth2\)/.test(src);
const out = [];
const check = (label, ok) => out.push(`${ok ? "PASS" : "FAIL"} ${label}`);

check("createPanel 接受 submittedWord 参数", /submittedWord = "已记录"/.test(src));
check("副行使用 submittedWord 变量", /bits\.push\(`\$\{submittedWord\} \$\{/.test(src));
check("格式化时长函数存在", /function fmtDuration\(/.test(src));
check("不再用上报速度外推 ETA", !/\(dur - loc\) \/ \(loc \/ el\)/.test(src));
check("删掉不再使用的 playT0", !/playT0/.test(src));

if (isUnattended) {
  check("无人值守传入「已播」", /submittedWord: "已播放"/.test(src));
  check("进度取播放器 currentTime", /state\.prog\.sectionSec = Math\.trunc\(c\)/.test(src));
  check("每秒刷新一次面板", /for \(let t = 0; t < 10; t\+\+\)/.test(src));
  check("ETA 用播放器剩余秒数", /\(d - c\) \* 1e3/.test(src));
  check("副行不再直接用平台 lessonLocation", !/state\.prog\.sectionSec = loc;/.test(src));
  check("完成判定同时认播放器位置", /loc >= dur - 5 \|\| cur >= dur - 5/.test(src));
}

console.log(out.join("\n"));
const failed = out.filter((l) => l.startsWith("FAIL")).length;
console.log(`\n${out.length - failed}/${out.length} passed  (unattended=${isUnattended})`);
process.exit(failed ? 1 : 0);
