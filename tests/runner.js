// 依次跑 tests/*.test.js，每个文件独立进程，互不污染（有的会改全局 Date.now）。
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const skip = new Set(["runner.js"]);
const files = fs.readdirSync(dir)
  .filter((f) => f.endsWith(".test.js") && !skip.has(f))
  .sort();

const only = process.argv.slice(2);
const picked = only.length ? files.filter((f) => only.some((o) => f.includes(o))) : files;

if (!picked.length) {
  console.log("没有匹配的测试文件");
  process.exit(1);
}

const results = [];
for (const file of picked) {
  const started = Date.now();
  console.log(`\n=== ${file} ${"=".repeat(Math.max(0, 50 - file.length))}`);
  const r = spawnSync(process.execPath, [path.join(dir, file)], { stdio: "inherit" });
  results.push({ file, code: r.status, ms: Date.now() - started });
}

console.log("\n=== 汇总 " + "=".repeat(44));
let failed = 0;
for (const r of results) {
  const bad = r.code !== 0;
  if (bad) failed += 1;
  console.log(`${bad ? "FAIL" : "PASS"}  ${r.file}  (${r.ms} ms)`);
}
console.log(`\n${results.length - failed}/${results.length} 个测试文件通过`);
process.exit(failed ? 1 : 0);
