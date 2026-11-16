// 极简断言收集器：不抛异常，跑完所有用例再汇总，方便一次看到全部失败点。
function suite() {
  const rows = [];

  const api = {
    check(label, got, want) {
      const ok = JSON.stringify(got) === JSON.stringify(want);
      rows.push({ ok, label, detail: ok ? "" : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}` });
      return ok;
    },
    ok(label, cond, detail) {
      rows.push({ ok: !!cond, label, detail: cond ? "" : String(detail === void 0 ? "" : detail) });
      return !!cond;
    },
    note(text) {
      rows.push({ note: text });
    },
    report() {
      let failed = 0;
      let total = 0;
      for (const r of rows) {
        if (r.note) {
          console.log(`  · ${r.note}`);
          continue;
        }
        total += 1;
        if (!r.ok) failed += 1;
        console.log(`  ${r.ok ? "PASS" : "FAIL"} ${r.label}${r.detail ? `  — ${r.detail}` : ""}`);
      }
      console.log(`  ${total - failed}/${total} passed`);
      return failed;
    }
  };
  return api;
}

module.exports = { suite };
