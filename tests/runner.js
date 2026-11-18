// 零依赖测试入口：node tests/runner.js
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scripts = {
  fast: path.join(root, "userscript", "tobacco-mooc-fast.user.js"),
  unattended: path.join(root, "userscript", "tobacco-mooc-unattended.user.js"),
};

let failed = 0;
for (const [kind, file] of Object.entries(scripts)) {
  const tests = ["auth.test.js", "authflow.test.js", "engine.test.js", "subline.test.js", "eta.test.js", "hover-stop.test.js", "collapsed-status.test.js"];
  if (kind === "fast") tests.push("quota.test.js");
  if (kind === "unattended") tests.push("noreport.test.js", "stop-pause.test.js");
  for (const t of tests) {
    const r = spawnSync(process.execPath, [path.join(__dirname, t), file], {
      encoding: "utf8",
      cwd: root,
    });
    if (r.stdout) process.stdout.write(`[${kind}/${t}] ${r.stdout}`);
    if (r.stderr) process.stderr.write(r.stderr);
    if (r.status !== 0) failed++;
  }
}

console.log(failed ? `\n${failed} 个测试文件失败` : "\n全部测试通过");
process.exit(failed ? 1 : 0);
