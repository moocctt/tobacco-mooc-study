// 真机冒烟测试：只读，不提交任何学习进度，不消耗学时配额。
// 需要环境变量 MOOC_USERNAME / MOOC_PASSWORD；没有就跳过（fork 和 PR 上不会失败）。
const { suite } = require("./lib/tap");
const { KINDS, loadEngine } = require("./lib/userscript");

const t = suite();

const USER = process.env.MOOC_USERNAME || "";
const PASS = process.env.MOOC_PASSWORD || "";

if (!USER || !PASS) {
  console.log("SKIP 未设置 MOOC_USERNAME / MOOC_PASSWORD，跳过真机测试");
  process.exit(0);
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function makeGm(account) {
  const store = new Map([["account", account]]);
  return {
    getValue: (k, d) => (store.has(k) ? store.get(k) : d),
    setValue: (k, v) => store.set(k, v),
    deleteValue: (k) => store.delete(k)
  };
}

function makeStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k)
  };
}

async function runOne(kind) {
  console.log(`\n[${kind}] live`);
  const { createApi, createTokenHunter, API, ORIGIN } = loadEngine(kind);

  const log = [];
  const hunter = createTokenHunter({ log: (m) => log.push(m), storage: makeStorage() });
  const gm = makeGm({ username: USER, password: PASS });
  const api = createApi({
    hunter, gm,
    log: (m) => log.push(m),
    origin: ORIGIN,
    timeoutMs: 25e3,
    fetchImpl: (url, init) => fetch(url, Object.assign({}, init, {
      headers: Object.assign({ "User-Agent": UA, Referer: ORIGIN + "/" }, (init && init.headers) || {})
    }))
  });

  const ok = await api.relogin();
  t.ok("登录成功", !!ok, JSON.stringify(ok).slice(0, 200));
  if (!ok) {
    // 失败时把内部日志打出来，否则 CI 里只看到一句 null，无从判断是密码错还是被 WAF 拦
    console.log("  内部日志：");
    for (const line of log) console.log("    " + line);
    return;
  }

  const [code, body] = await api.req("GET", API.TASKS, { params: { page: 1, pageSize: 5, status: "", filterAuthExam: 1 } });
  t.check("任务列表 HTTP 200", code, 200);
  t.ok("任务列表返回 items 数组", body && Array.isArray(body.items), JSON.stringify(body).slice(0, 200));

  const items = (body && body.items) || [];
  t.ok("任务列表非空", items.length > 0, `items=${items.length}`);
  if (!items.length) return;

  const first = items.find((x) => !x.expired && [1, 2].includes(x.businessType)) || items[0];
  t.ok("任务带 businessId", !!first.businessId, JSON.stringify(first).slice(0, 200));

  const [rc, reg] = await api.req("POST", API.REGISTER, { data: { courseId: first.businessId } });
  t.check("报名/取版本 HTTP 200", rc, 200);
  const versionId = reg && (reg.versionId || reg.data && reg.data.versionId);
  t.ok("拿到 versionId", !!versionId, JSON.stringify(reg).slice(0, 200));

  const [hc, chs] = await api.req("GET", API.CHAPTERS, { params: { courseId: first.businessId, versionId, isRegister: 1 } });
  t.check("章节 HTTP 200", hc, 200);
  t.ok("章节是数组", Array.isArray(chs), JSON.stringify(chs).slice(0, 200));

  const secs = (Array.isArray(chs) ? chs : []).flatMap((c) => c.courseChapterSections || []);
  t.ok("章节里有小节", secs.length > 0, `sections=${secs.length}`);
  const sample = secs[0] || {};
  t.ok("小节带 sectionType", typeof sample.sectionType === "number", JSON.stringify(sample).slice(0, 200));
  t.ok("小节带 referenceId", !!sample.referenceId, JSON.stringify(sample).slice(0, 200));

  t.note(`课程「${first.name}」小节 ${secs.length} 个`);
}

(async () => {
  for (const kind of KINDS) {
    try {
      await runOne(kind);
    } catch (e) {
      t.ok(`${kind} 真机调用未抛异常`, false, (e && e.message) || String(e));
    }
  }
  process.exit(t.report() ? 1 : 0);
})().catch((e) => {
  console.log("FATAL", (e && e.stack) || e);
  process.exit(1);
});
