// 鉴权路径回归：只用页面登录态，不再有账密重登
const fs = require("fs");

const file = process.argv[2];
if (!file) throw new Error("usage: node auth.test.js <userscript>");
const src = fs.readFileSync(file, "utf8");
const a = src.indexOf("  // src/token.js");
const b = src.indexOf("  // src/engine.js");
if (a < 0 || b < 0) throw new Error("markers not found");
const block = src.slice(a, b);

function makeMod(win = {}) {
  const g = { get: () => undefined, set: () => {}, del: () => {} };
  const doc = {
    cookie: "",
    dispatchEvent: () => {},
    createEvent: () => ({ initCustomEvent: () => {} }),
    head: { appendChild: () => {} },
    querySelector: () => null,
  };
  const body = `"use strict";\nreturn (() => {\n${block}\nreturn { createTokenHunter, createApi, API, ORIGIN };\n})();`;
  const fn = new Function("gm", "myFetch", "window", "document", "localStorage", "XMLHttpRequest", body);
  return fn(g, win.fetch, win, doc, win.localStorage || { getItem: () => null }, function () {});
}

function storageWith(token) {
  return {
    getItem: (k) => (k === "token" && token ? JSON.stringify(token) : null),
  };
}

const results = [];
const check = (name, cond, extra) => results.push([name, !!cond, extra]);

(async () => {
  // A: 令牌过期 + localStorage 无新令牌 -> auth 错误；且全程没有请求登录接口
  const urlsA = [];
  const hunterA = makeMod().createTokenHunter({ log: () => {}, storage: storageWith(null) });
  hunterA.setToken("Bearer__stale");
  const fetchA = async (u) => {
    urlsA.push(String(u));
    return { status: 401, text: async () => "{}" };
  };
  const apiA = makeMod({ fetch: fetchA }).createApi({ hunter: hunterA, fetchImpl: fetchA, log: () => {} });
  let errA = null;
  try {
    await apiA.req("GET", "/api/v1/x");
  } catch (e) {
    errA = e;
  }
  check("A 401 无新令牌抛错", errA && /登录态已失效/.test(errA.message), errA && errA.message);
  check("A 错误带 auth 标记", errA && errA.auth === true);
  check("A api 不再暴露 relogin", !("relogin" in apiA));
  check(
    "A 没有请求 app-login",
    !urlsA.some((u) => /app-login/.test(u)),
    urlsA.join(" | "),
  );

  // B: 401 后 localStorage 有新令牌 -> 重试一次成功，共 2 次请求，URL 一致
  const urlsB = [];
  const hunterB = makeMod().createTokenHunter({
    log: () => {},
    storage: storageWith({ token_type: "Bearer", access_token: "fresh" }),
  });
  hunterB.setToken("Bearer__stale");
  const fetchB = async (u) => {
    urlsB.push(String(u));
    if (urlsB.length === 1) return { status: 401, text: async () => "{}" };
    return { status: 200, text: async () => JSON.stringify({ ok: 1 }) };
  };
  const apiB = makeMod({ fetch: fetchB }).createApi({ hunter: hunterB, fetchImpl: fetchB, log: () => {} });
  const rB = await apiB.req("GET", "/api/v1/x");
  check("B 回读新令牌后重试成功", rB && rB[0] === 200 && rB[1] && rB[1].ok === 1, JSON.stringify(rB));
  check("B 共请求 2 次", urlsB.length === 2, String(urlsB.length));
  check(
    "B 重试的是同一个 URL，没有跑登录接口",
    urlsB.length === 2 && urlsB[0] === urlsB[1] && !urlsB.some((u) => /app-login/.test(u)),
    urlsB.join(" | "),
  );

  // C: 业务码 90901 -> 同一条 auth 分支
  const hunterC = makeMod().createTokenHunter({ log: () => {}, storage: storageWith(null) });
  hunterC.setToken("Bearer__stale");
  const fetchC = async () => ({ status: 200, text: async () => JSON.stringify({ errorCode: 90901 }) });
  const apiC = makeMod({ fetch: fetchC }).createApi({ hunter: hunterC, fetchImpl: fetchC, log: () => {} });
  let errC = null;
  try {
    await apiC.req("GET", "/api/v1/x");
  } catch (e) {
    errC = e;
  }
  check("C 90901 抛 auth 错误", errC && errC.auth === true && /登录态已失效/.test(errC.message));

  // D: 换新令牌后重试，第二次仍鉴权失败 -> 只重试一次就抛，绝不无限循环
  let callsD = 0;
  const hunterD = makeMod().createTokenHunter({
    log: () => {},
    storage: storageWith({ token_type: "Bearer", access_token: "fresh" }),
  });
  hunterD.setToken("Bearer__stale");
  const fetchD = async () => {
    callsD++;
    return { status: 401, text: async () => "{}" };
  };
  const apiD = makeMod({ fetch: fetchD }).createApi({ hunter: hunterD, fetchImpl: fetchD, log: () => {} });
  let errD = null;
  try {
    await apiD.req("GET", "/api/v1/x");
  } catch (e) {
    errD = e;
  }
  check("D 两次都失败后抛错", errD && errD.auth === true);
  check("D 恰好请求 2 次", callsD === 2, String(callsD));

  // E: 500 不是鉴权错误 -> 原样返回，不能被吞也不能改判
  const hunterE = makeMod().createTokenHunter({ log: () => {}, storage: storageWith(null) });
  hunterE.setToken("Bearer__stale");
  const fetchE = async () => ({ status: 500, text: async () => JSON.stringify({ errorCode: 123 }) });
  const apiE = makeMod({ fetch: fetchE }).createApi({ hunter: hunterE, fetchImpl: fetchE, log: () => {} });
  let errE = null;
  let rE = null;
  try {
    rE = await apiE.req("GET", "/api/v1/x");
  } catch (e) {
    errE = e;
  }
  check(
    "E 500 原样返回且不带 auth 标记",
    !errE && rE && rE[0] === 500 && !(errE && errE.auth),
    errE ? errE.message : JSON.stringify(rE),
  );

  // F: waitToken 超时也要带 auth 标记（入口靠它区分「未登录」和「网络错」）
  const hunterF = makeMod().createTokenHunter({ log: () => {}, storage: storageWith(null) });
  let errF = null;
  try {
    await hunterF.waitToken(20);
  } catch (e) {
    errF = e;
  }
  check("F waitToken 超时抛 auth 错误", errF && errF.auth === true && /未捕获到令牌/.test(errF.message));

  // G: 主路径——挂钩 XHR/fetch 从页面请求里截 Authorization
  const hunterG = makeMod().createTokenHunter({ log: () => {}, storage: storageWith(null) });
  let recorded = null;
  function FakeXHR() {}
  FakeXHR.prototype.setRequestHeader = function (k, v) {
    recorded = [k, v];
  };
  const fakeWin = {
    XMLHttpRequest: FakeXHR,
    fetch: () => Promise.resolve({ ok: true }),
  };
  hunterG.installHooks({ win: fakeWin, XMLHttpRequest: FakeXHR, fetch: fakeWin.fetch });
  new FakeXHR().setRequestHeader("authorization", "Bearer from-xhr");
  check("G XHR 钩子截到令牌", hunterG.getToken() === "Bearer from-xhr", String(hunterG.getToken()));
  await fakeWin.fetch("/x", { headers: { Authorization: "Bearer from-fetch" } });
  check("G fetch 钩子截到令牌", hunterG.getToken() === "Bearer from-fetch", String(hunterG.getToken()));
  check("G 原始 setRequestHeader 仍被调用", recorded && recorded[0] === "authorization");

  let pass = 0;
  for (const [name, ok, extra] of results) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra && !ok ? "  → " + extra : ""}`);
    if (ok) pass++;
  }
  console.log(`${pass}/${results.length} passed  ${file.split("/").pop()}`);
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => {
  console.error("THROW", e && e.message);
  process.exit(1);
});
