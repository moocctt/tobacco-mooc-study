// ==UserScript==
// @name         烟草网络学院 · 快速刷课学习助手
// @namespace    https://github.com/moocctt/tobacco-mooc-study
// @version      0.0.13
// @license      MIT
// @homepageURL  https://github.com/moocctt/tobacco-mooc-study
// @supportURL   https://github.com/moocctt/tobacco-mooc-study/issues
// @description  快速模式刷课：按单档秒数回填开始时间、快速批量上报（600s/轮、轮间仅歇 1 秒），一门课几分钟刷完。与「无人值守学习助手」互斥运行。非官方工具，使用风险自担。
// @author       tobacco-mooc-study
// @match        https://mooc.ctt.cn/*
// @noframes
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+DQogIDwhLS0g5a2m5Lmg6L+b5bqm5Yqp5omLOiDlpb3lpYfnmoTkuabmnKwgKyDov5vluqbkuabnrb4gKOWvueixoS/liqjkvZwv5oOF57uqID0g5LmmICsg5ZCR5LiK6L+b5bqmICsg5aW95aWH5b6u56yRKSAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMC40IiB5Mj0iMSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxMjRBMzEiLz4NCiAgICAgIDxzdG9wIG9mZnNldD0iMC41NSIgc3RvcC1jb2xvcj0iIzFGNkY0QSIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMkU4QjVGIi8+DQogICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InJpYmJvbiIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjRkREQTM0Ii8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNDOThBM0UiLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQoNCiAgPCEtLSDog4zmma86IOWTgeeJjOe7vyAoZWRnZS10by1lZGdlLCDlnIbop5IpIC0tPg0KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgcng9IjI4IiBmaWxsPSJ1cmwoI2JnKSIvPg0KDQogIDwhLS0g5Lmm5pysOiDkuKTniYflpKflnIbop5LlnZcgKyDph43mj4/ovrksIOi9u+W+ruWAvuaWnCAtLT4NCiAgPGcgdHJhbnNmb3JtPSJyb3RhdGUoLTcgNjQgNjgpIj4NCiAgICA8IS0tIOS5puiEiihwYWdlIGJsb2NrKSAtLT4NCiAgICA8cmVjdCB4PSIzMCIgeT0iMzQiIHdpZHRoPSI3MCIgaGVpZ2h0PSI2MiIgcng9IjE2IiBmaWxsPSIjRThGMkVDIiBzdHJva2U9IiMxNjIxMUMiIHN0cm9rZS13aWR0aD0iNyIvPg0KICAgIDwhLS0g5bCB6Z2iIC0tPg0KICAgIDxyZWN0IHg9IjI0IiB5PSIyOCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjYyIiByeD0iMTYiIGZpbGw9IiNGOEY2RjUiIHN0cm9rZT0iIzE2MjExQyIgc3Ryb2tlLXdpZHRoPSI3Ii8+DQogICAgPCEtLSDkuabpobXnur86IOS4gOadoeWuvee6v+WNs+WPr+WcqCAxNnB4IOWtmOa0uyAtLT4NCiAgICA8cGF0aCBkPSJNMzggNzYgaDMwIiBzdHJva2U9IiM4RkJGQTYiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQogIDwvZz4NCg0KICA8IS0tIOi/m+W6puS5puetvijllK/kuIDphY3ku7YpOiAzLzQg6auYLCDlupXpg6jnh5XlsL4gLS0+DQogIDxnIHRyYW5zZm9ybT0icm90YXRlKC03IDY0IDY4KSI+DQogICAgPHBhdGggZD0iTTgwIDIyIGgxNiB2MzQgbC04IC03IC04IDcgeiIgZmlsbD0idXJsKCNyaWJib24pIiBzdHJva2U9IiMxNjIxMUMiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KICA8L2c+DQoNCiAgPCEtLSDooajmg4U6IOWPjOecvCArIOWwj+W+rueskSjnlaXlgY8sIOW4puS4gOeCueWlveWlhykgLS0+DQogIDxnIHRyYW5zZm9ybT0icm90YXRlKC03IDY0IDY4KSI+DQogICAgPGNpcmNsZSBjeD0iNDkiIGN5PSI1MyIgcj0iNi40IiBmaWxsPSIjMTYyMTFDIi8+DQogICAgPGNpcmNsZSBjeD0iNzIiIGN5PSI1MSIgcj0iNi40IiBmaWxsPSIjMTYyMTFDIi8+DQogICAgPGNpcmNsZSBjeD0iNTEiIGN5PSI1MSIgcj0iMi4xIiBmaWxsPSIjRjhGNkY1Ii8+DQogICAgPGNpcmNsZSBjeD0iNzQiIGN5PSI0OSIgcj0iMi4xIiBmaWxsPSIjRjhGNkY1Ii8+DQogICAgPHBhdGggZD0iTTUyIDY1IHE3IDYgMTQgMiIgc3Ryb2tlPSIjMTYyMTFDIiBzdHJva2Utd2lkdGg9IjUuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJub25lIi8+DQogIDwvZz4NCjwvc3ZnPg0K
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
(() => {
  // src/token.js
  function createTokenHunter({ log = () => {
  }, storage = typeof localStorage !== "undefined" ? localStorage : null } = {}) {
    const st = storage || { getItem: () => null };
    let token = null;
    let tokenOrigin = "manual";
    let tokenWaiters = [];
    function setToken(v, origin = "manual") {
      if (!v || v === token) return;
      token = v;
      tokenOrigin = origin;
      log(`\u4EE4\u724C\u5DF2\u6355\u83B7 (${v.slice(-8)})`);
      const ws = tokenWaiters;
      tokenWaiters = [];
      ws.forEach((w) => w());
    }
    function waitToken(ms = 3e4) {
      if (token) return Promise.resolve();
      tokenFromStorage();
      if (token) return Promise.resolve();
      return new Promise((resolve, reject) => {
        let entry = null;
        const t = setTimeout(() => {
          tokenWaiters = tokenWaiters.filter((w) => w !== entry);
          const e = new Error("\u672A\u6355\u83B7\u5230\u4EE4\u724C: \u9875\u9762\u672A\u53D1\u51FA\u5E26\u6388\u6743\u5934\u7684\u8BF7\u6C42, \u4E14 localStorage \u65E0\u4EE4\u724C");
          // 这就是「登录态失效」的一种：打上 auth 标记，runAll 才会报 authFailed，入口才不会误走自动刷新分支
          e.auth = true;
          reject(e);
        }, ms);
        entry = () => {
          clearTimeout(t);
          resolve();
        };
        tokenWaiters.push(entry);
      });
    }
    function tokenFromStorage() {
      try {
        const raw = st.getItem("token");
        if (!raw) return false;
        const obj = JSON.parse(raw);
        if (!obj || !obj.access_token) return false;
        const v = `${obj.token_type || "Bearer"}__${obj.access_token}`;
        if (v === token) return false;
        setToken(v, "storage");
        return true;
      } catch {
        return false;
      }
    }
    function installHooks(args = {}) {
      const win = args.win || globalThis;
      const XHR = args.XMLHttpRequest || win.XMLHttpRequest;
      const origFetch = args.fetch || win.fetch;
      if (!XHR || !origFetch) return;
      const origSetHeader = XHR.prototype.setRequestHeader;
      XHR.prototype.setRequestHeader = function(k, v) {
        try {
          if (/^authorization$/i.test(k) && /^Bearer/.test(String(v))) setToken(String(v), "hook");
        } catch {
        }
        return origSetHeader.call(this, k, v);
      };
      win.fetch = function(input, init) {
        try {
          const h = init && init.headers || input && input.headers;
          if (h) {
            const get = (k) => typeof h.get === "function" ? h.get(k) : h[k];
            const v = get("Authorization") || get("authorization");
            if (v && /^Bearer/.test(String(v))) setToken(String(v), "hook");
          }
        } catch {
        }
        return origFetch.apply(this, arguments);
      };
    }
    return { getToken: () => token, tokenOrigin: () => tokenOrigin, setToken, waitToken, tokenFromStorage, installHooks };
  }

  // src/constants.js
  var ORIGIN = "https://mooc.ctt.cn";
  var API = {
    TASKS: "/api/v1/human/task",
    START: "/api/v1/course-study/course-front/start-progress",
    VIDEO: "/api/v1/course-study/course-front/video-progress",
    DOC: "/api/v1/course-study/course-front/doc-progress",
    PROGRESS_UPD: "/api/v1/course-study/course-front/course-progress-update",
    CHAPTERS: "/api/v1/course-study/subject/chapter-progress",
    REGISTER: "/api/v1/course-study/course-front/register",
    SECTION_PROGRESS: "/api/v1/course-study/course-front/course-section-progress",
    INFO: "/api/v1/course-study/course-front/info",
    REGISTER_STUDY: "/api/v1/course-study/course-front/registerStudy",
    MAX_STEP: 90
    // 单步上报上限（实测 ≥120s 会被平台静默丢弃）
  };
  var MEDIA = /* @__PURE__ */ new Set([5, 6]);
  var NESTED = 10;
  var SKIP = /* @__PURE__ */ new Set([4, 8, 9, 12, 13, 15]);
  var DONE = /* @__PURE__ */ new Set([2, 4]);
  var TYPE_NAME = { 1: "pdf", 2: "\u56FE\u7247", 3: "\u5916\u94FE", 4: "scorm", 5: "mp3", 6: "mp4", 7: "epub", 8: "\u4EFB\u52A1", 9: "\u8003\u8BD5", 10: "\u5173\u8054\u8BFE\u7A0B", 12: "\u95EE\u5377", 13: "\u8BC4\u4F30", 15: "\u8BFE\u4EF6" };

  // src/util.js
  var rand = (a, b) => a + Math.random() * (b - a);
  var pystr = (v) => v === true ? "True" : v === false ? "False" : v === null || v === void 0 ? "" : String(v);
  function toParams(data) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(data || {})) if (v !== null && v !== void 0) sp.append(k, pystr(v));
    return sp;
  }
  var qs = (params) => toParams(params).toString();
  var form = (data) => toParams(data);

  // src/api.js
  var AUTH_CODES = /* @__PURE__ */ new Set([90901, 90902]);
  function createApi({ hunter: hunter2, fetchImpl, log = () => {
  }, origin = ORIGIN, timeoutMs = 2e4 }) {
    const doFetch = fetchImpl || ((...a) => fetch(...a));
    // 全链路无超时会让整批永远卡在一个请求上，这里统一加硬超时
    async function doFetchWithTimeout(url, init, ms = timeoutMs) {
      const ctl = typeof AbortController === "function" ? new AbortController() : null;
      let timer = null;
      const guard = new Promise((_r, reject) => {
        timer = setTimeout(() => {
          if (ctl) ctl.abort();
          const e = new Error(`请求超时（${Math.round(ms / 1e3)}s）: ${url}`);
          e.timeout = true;
          reject(e);
        }, ms);
      });
      try {
        return await Promise.race([doFetch(url, ctl ? Object.assign({}, init, { signal: ctl.signal }) : init), guard]);
      } finally {
        clearTimeout(timer);
      }
    }
    async function req(method, path, { params, data } = {}, retried = false) {
      await hunter2.waitToken();
      const url = origin + path + (params ? `?${qs(params)}` : "");
      const res = await doFetchWithTimeout(url, {
        method: method.toUpperCase(),
        body: data ? form(data) : void 0,
        credentials: "include",
        headers: { Authorization: hunter2.getToken(), Accept: "application/json;charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }
      });
      const text = await res.text();
      let body = null;
      if (text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
        try {
          body = JSON.parse(text);
        } catch {
        }
      }
      const authError = res.status === 401 || body && AUTH_CODES.has(body.errorCode);
      if (authError && !retried) {
        const before = hunter2.getToken();
        // 页面自己请求里捕获的令牌比 localStorage 新，不能回读旧值把它降级
        if (!hunter2.tokenOrigin || hunter2.tokenOrigin() !== "hook") hunter2.tokenFromStorage();
        if (hunter2.getToken() && hunter2.getToken() !== before) {
          log("\u5DF2\u6355\u83B7\u5230\u65B0\u4EE4\u724C, \u91CD\u8BD5\u8BF7\u6C42");
          return req(method, path, { params, data }, true);
        }
        log("\u767B\u5F55\u6001\u5931\u6548, \u8BF7\u5237\u65B0\u9875\u9762\u91CD\u65B0\u767B\u5F55");
        const err = new Error("\u767B\u5F55\u6001\u5DF2\u5931\u6548 \u2014\u2014 \u811A\u672C\u53EA\u4F7F\u7528\u4F60\u5F53\u524D\u9875\u9762\u7684\u767B\u5F55\u6001, \u8BF7\u5237\u65B0\u9875\u9762\u91CD\u65B0\u767B\u5F55\u540E\u518D\u542F\u52A8");
        err.auth = true;
        throw err;
      }
      if (authError) {
        const err = new Error(body && body.errorCode ? `登录态失效 (errorCode ${body.errorCode}) —— 已重试仍失败, 请刷新页面重新登录` : `登录态失效 (HTTP ${res.status}) —— 已重试仍失败, 请刷新页面重新登录`);
        err.auth = true;
        throw err;
      }
      return [res.status, body];
    }
    return { req };
  }

  // src/engine.js
  var QuotaExhausted = class extends Error {
  };
  function buildStartParams(backdateS, clientType, nowMs = Date.now()) {
    return { clientType, createTime: nowMs - Math.trunc(backdateS * 1e3) };
  }
  function parseRemaining(v) {
    if (v === null || v === void 0 || v === "") return { kind: "missing", value: null };
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return { kind: "invalid", value: v };
    return { kind: "number", value: n };
  }
  function normalizeReport(code, body) {
    const raw = body && body.errorCode;
    const ec = raw === null || raw === void 0 ? 0 : Number(raw);
    const qh = quotaHint(body);
    if (qh) return { status: "quota", reason: `\u5E73\u53F0\u660E\u786E\u63D0\u793A\u914D\u989D\u9650\u5236: ${qh}` };
    if (ec === 40909) return { status: "conflict", errorCode: ec };
    if (code !== 200) return { status: "fail", errorCode: ec, reason: `\u4E0A\u62A5\u5931\u8D25 HTTP ${code}` };
    if (!Number.isFinite(ec)) return { status: "fail", errorCode: raw, reason: `\u4E0A\u62A5\u5931\u8D25 errorCode ${raw}` };
    if (ec !== 0) return { status: "fail", errorCode: ec, reason: `\u4E0A\u62A5\u5931\u8D25 errorCode ${ec}` };
    return { status: "ok", errorCode: 0 };
  }
  function quotaHint(body) {
    if (!body || typeof body !== "object") return "";
    const parts = [body.message, body.msg, body.errorMsg, body.errorMessage, body.description];
    const text = parts.filter((v) => typeof v === "string").join(" ");
    return /\u914D\u989D|\u5B66\u65F6[^\s]{0,8}(\u5DF2\u6EE1|\u4E0A\u9650|\u7528\u5B8C)|\u6BCF\u65E5[^\s]{0,8}(\u4E0A\u9650|\u9650\u5236)|quota|daily.?limit/i.test(text) ? text.slice(0, 120) : "";
  }
  function computeMaxRounds(total, step0, slack) {
    const t = Number(total), per = Math.min(Number(step0) || 0, API.MAX_STEP);
    const n = Math.ceil(t / per) + (Number(slack) || 0);
    return Number.isFinite(n) && n > 0 ? n : 5000;
  }
  function taskFilter(all) {
    return (all || []).filter((t) => [1, 2].includes(t.status) && [1, 2].includes(t.businessType) && !DONE.has(t.finishStatus) && !t.expired);
  }
  function sectionSkipped(type) {
    return SKIP.has(type);
  }
  function createEngine({ api: api2, state: state2, config: config2, log = () => {
  }, ui = () => {
  }, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), lock: lock2 = null, currentBid: currentBid2 = () => "", playSection = null }) {
    function setSectionProgress(submitted, total, t0, depth) {
      const p = state2.prog;
      if (!p) return;
      p.sectionSec = Math.max(0, Number(submitted) || 0);
      p.sectionTotalSec = Math.max(0, Number(total) || 0);
      const frac = p.sectionTotalSec ? Math.min(1, p.sectionSec / p.sectionTotalSec) : 0;
      const nt = Math.max(0, Number(p.nestedTotal) || 0);
      p.curFrac = depth > 0 && nt ? Math.min(1, ((Number(p.nestedDone) || 0) + frac) / nt) : frac;
      const elapsed = t0 ? Date.now() - t0 : 0;
      p.etaMs = p.sectionTotalSec && p.sectionSec > 0 && elapsed > 1500 ? Math.max(0, (p.sectionTotalSec - p.sectionSec) / (p.sectionSec / elapsed)) : null;
    }
    function resetCourseProgress(secTotal) {
      const p = state2.prog;
      if (!p) return;
      p.secDone = 0;
      p.secTotal = Math.max(0, Number(secTotal) || 0);
      p.curFrac = 0;
      p.sectionSec = 0;
      p.sectionTotalSec = 0;
      p.nestedDone = 0;
      p.nestedTotal = 0;
      p.etaMs = null;
    }
    async function undoneTasks() {
      const all = [];
      const seen = /* @__PURE__ */ new Set();
      for (let page = 1; page <= 50; page++) {
        const [code, body] = await api2.req("GET", API.TASKS, { params: { page, pageSize: 500, status: "", filterAuthExam: 1 } });
        if (code !== 200 || !body) throw new Error(`\u4EFB\u52A1\u5217\u8868\u8BF7\u6C42\u5931\u8D25 (HTTP ${code})`);
        const items = body.items || [];
        const before = all.length;
        for (const t of items) if (!seen.has(t.id)) {
          seen.add(t.id);
          all.push(t);
        }
        if (!items.length) break;
        if (page > 1 && all.length === before) break;
        if (body.total && all.length >= Number(body.total)) break;
      }
      return taskFilter(all);
    }
    async function sections(courseId, versionId, register) {
      const [code, body] = await api2.req("GET", API.CHAPTERS, { params: { courseId, versionId, isRegister: register } });
      if (code !== 200 || !Array.isArray(body)) throw new Error(`\u7AE0\u8282\u5217\u8868\u8BF7\u6C42\u5931\u8D25 (HTTP ${code})`);
      const out = [];
      for (const ch of body) {
        for (const sec of ch.courseChapterSections || []) {
          const p = sec.progress || {};
          out.push({
            id: sec.referenceId,
            rid: sec.resourceId,
            name: sec.sectionName || sec.name || "",
            type: sec.sectionType,
            finish: p.finishStatus ?? 0,
            studied: p.studyTotalTime || 0
          });
        }
      }
      return out;
    }
    async function sectionStudyTime(courseId, sec) {
      if (!courseId) return null;
      const list = await sections(courseId, state2.versionId, state2.isRegister);
      const hit = list.find((s) => String(s.id) === String(sec.id) || (sec.rid && String(s.rid) === String(sec.rid)));
      return hit ? Number(hit.studied) || 0 : null;
    }
    async function openCourse(courseId) {
      const [code, det] = await api2.req("POST", API.REGISTER, { data: { courseId } });
      if (code !== 200 || typeof det !== "object" || !det) return openLibraryCourse(courseId);
      state2.versionId = det.versionId || "";
      state2.isRegister = !!det.register;
      return [det, await sections(courseId, det.versionId || "", det.register || false), false];
    }
    async function openLibraryCourse(courseId) {
      await api2.req("POST", API.REGISTER_STUDY, { data: { courseId, type: 1, isRequired: 0 } });
      state2.versionId = "";
      state2.isRegister = false;
      const [infoCode, det] = await api2.req("GET", `${API.INFO}/${courseId}`, { params: { source: 1, type: 1 } });
      if (infoCode !== 200 || !det) throw new Error(`\u8BFE\u7A0B\u4FE1\u606F\u8BF7\u6C42\u5931\u8D25 (HTTP ${infoCode})`);
      const secs = [];
      const map = { pdf: 1, image: 2, url: 3, scorm: 4, mp3: 5, mp4: 6, epub: 7, task: 8, exam: 9, other: 10, survey: 12, assessment: 13, kj: 15 };
      for (const ch of det && det.courseChapters || []) {
        for (const sec of ch.courseChapterSections || []) {
          const ft = String(sec.fileType || "").toLowerCase();
          secs.push({ id: sec.id, rid: sec.attachmentId, name: sec.name || sec.sectionName || "", type: map[ft] ?? 0, finish: 0, studied: 0 });
        }
      }
      return [Object.assign(det || {}, { _library: true }), secs, true];
    }
    async function startProgress(sectionId, backdateS, clientType) {
      const [code, body] = await api2.req("GET", `${API.START}/${sectionId}`, { params: buildStartParams(backdateS, clientType) });
      if (code !== 200 || !body || !body.id) return { ok: false, logId: null, rem: null, reason: `start-progress \u5931\u8D25 (HTTP ${code})` };
      return { ok: true, logId: body.id, rem: parseRemaining(body.remainingTime) };
    }
    async function progressUpdate(courseId) {
      await api2.req("POST", API.PROGRESS_UPD, { data: { encrypt: "false", courseId } });
    }
    async function settleNested(parentId, childId, sectionId, tries = 4) {
      await api2.req("POST", API.SECTION_PROGRESS, { data: { courseId: parentId, resourceIds: childId } });
      for (let i = 0; i < tries; i++) {
        if (state2.stopFlag) return false;
        const sp = await startProgress(sectionId, 300, 1);
        if (sp.ok) {
          const [, body] = await api2.req("POST", API.DOC, { data: { encrypt: "false", logId: sp.logId, lessonLocation: 999 } });
          if (body && DONE.has(body.finishStatus)) return true;
        }
        await sleep(rand(2500, 4e3));
      }
      const [, rows] = await api2.req("POST", API.SECTION_PROGRESS, { data: { courseId: parentId, resourceIds: childId } });
      return Array.isArray(rows) && rows.length ? DONE.has(rows[0].finishStatus) : false;
    }
    async function doSection(sec, { depth = 0, courseId, library = false } = {}) {
      if (SKIP.has(sec.type)) {
        const human = [9, 12, 13].includes(sec.type);
        return [false, `${TYPE_NAME[sec.type] || sec.type} ${human ? "\u9700\u771F\u5B9E\u4F5C\u7B54" : "\u6682\u65E0\u4E0A\u62A5\u534F\u8BAE"}, \u8DF3\u8FC7`];
      }
      if (DONE.has(sec.finish)) return [true, "\u5DF2\u5B8C\u6210, \u8DF3\u8FC7"];
      if (MEDIA.has(sec.type) && playSection) {
        state2.section = sec.name;
        return await playSection(sec, { courseId });
      }
      if (sec.type === NESTED) {
        if (depth >= 2) return [false, "\u5D4C\u5957\u8FC7\u6DF1, \u8DF3\u8FC7"];
        const parentCourse = state2.course;
        const parentVid = state2.versionId, parentReg = state2.isRegister;
        log(`\u21B3 \u5173\u8054\u8BFE\u7A0B ${sec.rid}`);
        const [done, total2] = await runCourse(sec.rid, depth + 1);
        state2.course = parentCourse;
        state2.versionId = parentVid;
        state2.isRegister = parentReg;
        if (done < total2) return [false, `\u5B50\u8BFE\u7A0B\u672A\u5B8C\u6210 ${done}/${total2}`];
        const settled = await settleNested(courseId, sec.rid, sec.id);
        return [settled, settled ? "\u5B50\u8BFE\u7A0B\u5B8C\u6210, \u7236\u8BB0\u5F55\u5DF2\u7ED3\u7B97" : "\u5B50\u8BFE\u7A0B\u5B8C\u6210, \u7236\u8BB0\u5F55\u7ED3\u7B97\u672A\u786E\u8BA4(\u7A0D\u540E\u590D\u6838)"];
      }
      const step0 = config2.getStep();
      const secT0 = Date.now();
      let total = null, submitted = 0, prevRem = null, maxRounds = 0, conflicts = 0;
      let stallSince = null, stallBaseStudy = null, stallLastPoll = 0;
      const STALL_POLL_MS = 3e4, STALL_CONFIRM_MS = 18e4;
      for (let i = 0; ; i++) {
        if (state2.stopFlag) return [false, "\u5DF2\u505C\u6B62"];
        if (maxRounds && i >= maxRounds) return [false, `\u8F6E\u6B21\u7528\u5B8C (\u5DF2\u63D0\u4EA4 ${submitted}s)`];
        state2.round = i + 1;
        // 记录本轮起点：本轮网络耗时要从等待里扣掉，否则节奏不是 1:1（越慢的网络睡得越久）
        const roundStart = Date.now();
        const sp = await startProgress(sec.id, config2.backdateS(step0), library ? 0 : 1);
        if (!sp.ok) return [false, sp.reason];
        const logId = sp.logId;
        if (sp.rem.kind === "missing") {
          const progress = submitted || Number(sec.studied) || 0;
          return progress ? [true, `\u5B8C\u6210\uFF08\u5DF2\u4E0A\u62A5 ${progress}s\uFF0C\u65E0\u5269\u4F59\u65F6\u957F\uFF09`] : [false, "start-progress \u65E0 remainingTime \u5B57\u6BB5"];
        }
        if (sp.rem.kind === "invalid") return [false, `remainingTime \u5F02\u5E38: ${String(sp.rem.value)}`];
        const rem = sp.rem.value;
        if (rem <= 0) {
          if (submitted || sec.studied) return [true, `\u65F6\u957F\u5DF2\u7528\u5B8C\uFF08\u5171 ${submitted}s\uFF09`];
          return [true, "\u8BE5\u5C0F\u8282\u65E0\u5269\u4F59\u65F6\u957F"];
        }
        const previousRem = prevRem;
        prevRem = rem;
        if (previousRem !== null && rem > previousRem) {
          if (stallSince !== null) log("\u21BA \u5269\u4F59\u65F6\u957F\u56DE\u5347, \u64A4\u9500\u914D\u989D\u89C2\u5BDF");
          stallSince = null;
          stallBaseStudy = null;
          stallLastPoll = 0;
        } else if (previousRem !== null && rem === previousRem) {
          if (stallSince === null) {
            stallSince = Date.now();
            stallLastPoll = stallSince;
            try { stallBaseStudy = await sectionStudyTime(courseId, sec); } catch { stallBaseStudy = null; }
            log("\u23F3 \u5269\u4F59\u65F6\u957F\u672A\u4E0B\u964D, \u5F00\u59CB\u89C2\u5BDF (\u5E73\u53F0\u805A\u5408\u53EF\u80FD\u5EF6\u8FDF)");
          }
          const waited = Date.now() - stallSince;
          if (waited - stallLastPoll >= STALL_POLL_MS || waited >= STALL_CONFIRM_MS) {
            stallLastPoll = Date.now();
            let nowStudy = null;
            try { nowStudy = await sectionStudyTime(courseId, sec); } catch { nowStudy = null; }
            if (nowStudy !== null && stallBaseStudy !== null && nowStudy > stallBaseStudy) {
              log(`\u2713 \u670D\u52A1\u7AEF\u5B66\u65F6\u5DF2\u589E\u957F (${stallBaseStudy}\u2192${nowStudy}), \u64A4\u9500\u914D\u989D\u89C2\u5BDF`);
              stallSince = null;
              stallBaseStudy = null;
              stallLastPoll = 0;
            } else if (waited >= STALL_CONFIRM_MS) {
              const detail = nowStudy !== null && stallBaseStudy !== null ? `\u670D\u52A1\u7AEF\u5B66\u65F6\u672A\u589E\u957F (${nowStudy}s)` : "\u65E0\u6CD5\u8BFB\u53D6\u670D\u52A1\u7AEF\u5B66\u65F6";
              throw new QuotaExhausted(`\u5269\u4F59\u65F6\u957F\u8FDE\u7EED ${Math.round(waited / 1e3)}s \u672A\u4E0B\u964D (${rem}s), \u4E14${detail} \u2014\u2014 \u5224\u5B9A\u5F53\u65E5\u5B66\u65F6\u914D\u989D\u5DF2\u6EE1`);
            } else {
              log(`\u23F3 \u4ECD\u5728\u89C2\u5BDF: \u5269\u4F59\u65F6\u957F ${rem}s, \u5DF2\u7B49\u5F85 ${Math.round(waited / 1e3)}s`);
            }
          }
          if (stallSince !== null) {
            await sleep(STALL_POLL_MS);
            i -= 1;
            continue;
          }
        } else if (previousRem !== null && stallSince !== null) {
          log("\u2713 \u5269\u4F59\u65F6\u957F\u5DF2\u6062\u590D\u4E0B\u964D, \u64A4\u9500\u914D\u989D\u89C2\u5BDF");
          stallSince = null;
          stallBaseStudy = null;
          stallLastPoll = 0;
        }
        if (total === null) {
          total = rem + (Number(sec.studied) || 0);
          maxRounds = computeMaxRounds(total, step0, config2.roundsSlack);
        }
        const step = Math.min(step0, rem, API.MAX_STEP);
        const isMedia = MEDIA.has(sec.type);
        const [code, body] = isMedia ? await api2.req("POST", API.VIDEO, { data: { encrypt: "false", logId, studyTime: Math.trunc(step), lessonLocation: Math.trunc(Math.min(total, total - rem + step)), resourceTotalTime: Math.trunc(total), flush: "false" } }) : await api2.req("POST", API.DOC, { data: { encrypt: "false", logId, lessonLocation: 999 } });
        const rep = normalizeReport(code, body);
        if (rep.status === "conflict") {
          conflicts += 1;
          if (conflicts > 20) return [false, "\u5E76\u53D1\u51B2\u7A81(40909)\u91CD\u8BD5\u8FC7\u591A, \u5DF2\u653E\u5F03\u8BE5\u5C0F\u8282"];
          i -= 1;
          await sleep(Math.min(1e3 * conflicts, 5e3));
          continue;
        }
        if (rep.status === "quota") throw new QuotaExhausted(rep.reason);
        if (rep.status !== "ok") return [false, rep.reason];
        conflicts = 0;
        submitted += step;
        state2.submitted = submitted;
        setSectionProgress(submitted, total, secT0, depth);
        if (courseId) await progressUpdate(courseId);
        ui();
        await sleep(Math.max(0, config2.roundSleepMs(step) - (Date.now() - roundStart)));
      }
    }
    async function runCourse(courseId, depth = 0) {
      const managed = !state2.running;
      if (managed) {
        state2.running = true;
        state2.stopFlag = false;
      }
      try {
        return await runCourseInner(courseId, depth);
      } finally {
        if (managed) state2.running = false;
      }
    }
    async function runCourseInner(courseId, depth = 0) {
      if (config2.canStart && !config2.canStart()) {
        log(`\u26D4 \u68C0\u6D4B\u5230\u5176\u4ED6\u6807\u7B7E\u9875\u6B63\u5728\u5B66\u4E60, \u8DF3\u8FC7\u300C${String(courseId).slice(0, 8)}\u2026\u300D(\u9632\u591A\u5F00)`);
        return [0, 1];
      }
      const [det, secs, library] = await openCourse(courseId);
      const name = det && det.name || courseId;
      state2.course = name;
      log(`===== ${name} =====`);
      const todo = secs.filter((s) => !DONE.has(s.finish));
      const countable = todo.filter((s) => !SKIP.has(s.type)).length;
      if (depth === 0) resetCourseProgress(countable);
      else if (state2.prog) {
        state2.prog.nestedDone = 0;
        state2.prog.nestedTotal = countable;
      }
      ui();
      log(`\u5C0F\u8282 ${secs.length} \u4E2A, \u5F85\u5904\u7406 ${todo.length}`);
      if (!secs.length) {
        log("\u26A0 \u7AE0\u8282\u5217\u8868\u4E3A\u7A7A(\u63A5\u53E3\u5F02\u5E38\u6216\u8BFE\u7A0B\u65E0\u5C0F\u8282), \u6309\u672A\u5B8C\u6210\u5904\u7406");
        return [0, 1];
      }
      let ok = 0, skipped = 0;
      for (let i = 0; i < todo.length; i++) {
        if (state2.stopFlag) break;
        const sec = todo[i];
        state2.section = `${i + 1}/${todo.length} (${TYPE_NAME[sec.type] || sec.type}) ${String(sec.name).slice(0, 30)}`;
        state2.round = 0;
        state2.submitted = 0;
        ui();
        log(`[${i + 1}/${todo.length}] ${state2.section}`);
        try {
          const [good, msg] = await doSection(sec, { depth, courseId, library });
          if (good) {
            ok += 1;
            if (state2.prog) {
              if (depth === 0) {
                state2.prog.secDone += 1;
                state2.prog.curFrac = 0;
                state2.prog.etaMs = null;
              } else {
                state2.prog.nestedDone = (Number(state2.prog.nestedDone) || 0) + 1;
              }
            }
          } else if (SKIP.has(sec.type)) skipped += 1;
          log(`   \u2192 ${msg}`);
          ui();
        } catch (e) {
          if (e instanceof QuotaExhausted) {
            if (depth === 0) log("[\u914D\u989D] " + e.message + ", \u7EC8\u6B62\u5168\u90E8");
            throw e;
          }
          if (e.auth) throw e;
          log(`   \u2717 ${e.message}`);
        }
      }
      return [ok, todo.length - skipped];
    }
    async function runAll() {
      const owner = lock2 ? lock2.lockOwner() : "";
      if (owner || state2.running) {
        log(`\u2717 ${owner || "\u5F53\u524D\u4EFB\u52A1"}\u6B63\u5728\u8FD0\u884C, \u8BF7\u5148\u505C\u6B62\u5B83`);
        return { quotaHit: false, ok: false, authFailed: false };
      }
      if (lock2) lock2.acquire();
      state2.running = true;
      state2.stopFlag = false;
      ui();
      let failCount = 0, quotaHit = false;
      const bid = currentBid2();
      const mode = bid ? "course" : "tasks";
      state2.prog = { secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: bid ? 1 : 0, sectionSec: 0, sectionTotalSec: 0, nestedDone: 0, nestedTotal: 0, etaMs: null };
      ui();
      try {
        if (bid) {
          log(`\u5F53\u524D\u4E3A\u8BFE\u7A0B/\u4E13\u9898\u9875 \u2192 ${config2.coursePageLabel}`);
          try {
            const [ok, total] = await runCourse(bid);
            if (state2.stopFlag) log(`\u25A0 \u5DF2\u505C\u6B62 (${ok}/${total})`);
            else if (ok < total) {
              failCount += 1;
              log(`\u26A0 \u672A\u5B8C\u6210 (${ok}/${total})`);
            }
          } catch (e) {
            if (e instanceof QuotaExhausted) quotaHit = true;
            else if (e.auth) throw e;
            else {
              failCount += 1;
              log(`\u2717 \u8BFE\u7A0B\u5931\u8D25: ${e.message}`);
            }
          }
        } else {
          const tasks = await undoneTasks();
          state2.prog.coursesTotal = tasks.length;
          ui();
          log(`\u5F53\u524D\u4E0D\u662F\u8BFE\u7A0B/\u4E13\u9898\u9875 \u2192 \u6267\u884C\u4E2A\u4EBA\u5B66\u4E60\u4EFB\u52A1: \u672A\u5B8C\u6210 ${tasks.length} \u95E8`);
          if (!tasks.length) log("\u6CA1\u6709\u672A\u5B8C\u6210\u7684\u5B66\u4E60\u4EFB\u52A1");
          for (const t of tasks) {
            if (state2.stopFlag) {
              log("\u5DF2\u505C\u6B62");
              break;
            }
            try {
              const [ok, total] = await runCourse(t.businessId);
              if (ok < total) {
                failCount += 1;
                log(`\u26A0 ${String(t.name || "").slice(0, 20)} \u672A\u5B8C\u6210 (${ok}/${total})`);
              }
            } catch (e) {
              if (e instanceof QuotaExhausted) {
                quotaHit = true;
                break;
              }
              if (e.auth) throw e;
              failCount += 1;
              log(`\u2717 \u8BFE\u7A0B\u5931\u8D25: ${e.message}`);
            }
            state2.prog.coursesDone += 1;
            if (state2.prog.coursesTotal > 1 && state2.prog.coursesDone < state2.prog.coursesTotal) {
              state2.prog.secDone = 0;
              state2.prog.secTotal = 0;
              state2.prog.curFrac = 0;
              state2.prog.sectionSec = 0;
              state2.prog.sectionTotalSec = 0;
              state2.prog.etaMs = null;
            }
            ui();
            await sleep(config2.taskGapMs());
          }
        }
        if (quotaHit) log("\u26A0 \u5B66\u65F6\u914D\u989D\u5DF2\u6EE1, \u5DF2\u505C\u6B62 (\u6B21\u65E5\u518D\u8BD5)");
        else if (!state2.stopFlag) {
          if (mode === "course") log(failCount ? `\u26A0 \u672C\u8BFE\u7A0B/\u4E13\u9898\u5904\u7406\u5B8C\u6BD5 (\u5931\u8D25 ${failCount} \u5904)` : "\u2705 \u672C\u8BFE\u7A0B/\u4E13\u9898\u5904\u7406\u5B8C\u6BD5");
          else log(failCount ? `\u26A0 \u5168\u90E8\u4EFB\u52A1\u5904\u7406\u5B8C\u6BD5 (\u5931\u8D25 ${failCount} \u95E8)` : "\u2705 \u5168\u90E8\u4EFB\u52A1\u5904\u7406\u5B8C\u6BD5");
        }
        return { quotaHit, ok: !quotaHit && !state2.stopFlag && failCount === 0, authFailed: false };
      } catch (e) {
        log(`\u2717 ${e.message}`);
        return { quotaHit, ok: false, authFailed: !!(e && e.auth) };
      } finally {
        state2.running = false;
        state2.course = "";
        state2.section = "";
        if (lock2) lock2.release();
        ui();
      }
    }
    return { undoneTasks, sections, openCourse, startProgress, settleNested, doSection, runCourse, runAll };
  }

  // src/lock.js
  function createLock(kind, win = globalThis) {
    const MY = `${kind}#${Math.random().toString(36).slice(2, 8)}`;
    const other = kind === "fast" ? "realtime" : "fast";
    const lockOwner = () => {
      const cur = win.__MOOC_US_LOCK;
      if (!cur || cur === MY) return "";
      return String(cur).startsWith(other) ? "\u53E6\u4E00\u4E2A\u811A\u672C" : "\u53E6\u4E00\u6761\u4EFB\u52A1";
    };
    const acquire = () => {
      win.__MOOC_US_LOCK = MY;
    };
    const release = () => {
      if (win.__MOOC_US_LOCK === MY) win.__MOOC_US_LOCK = null;
    };
    return { MY, lockOwner, acquire, release };
  }

  // src/guard.js
  var KEY2 = "__MOOC_US_SESSION__";
  var mem = /* @__PURE__ */ new Map();
  function createSessionGuard(gm2, { ttlMs = 45e3, now = () => Date.now() } = {}) {
    const read = () => {
      if (!gm2) return mem.get(KEY2) || null;
      try {
        return JSON.parse(gm2.getValue(KEY2) || "null");
      } catch {
        return null;
      }
    };
    const write = (v) => {
      if (!gm2) {
        if (v) mem.set(KEY2, v);
        else mem.delete(KEY2);
        return;
      }
      if (v) gm2.setValue(KEY2, JSON.stringify(v));
      else gm2.deleteValue(KEY2);
    };
    return {
      // 占住会话; 已被其他 owner 占用且未过期时返回 false
      hold(owner) {
        const cur = read();
        if (cur && cur.owner !== owner && now() - cur.ts < ttlMs) return false;
        write({ owner, ts: now() });
        const back = read();
        return !!(back && back.owner === owner);
      },
      held(owner) {
        const cur = read();
        return !!(cur && now() - cur.ts < ttlMs && (owner ? cur.owner !== owner : true));
      },
      release(owner) {
        const cur = read();
        if (cur && cur.owner === owner) write(null);
      }
    };
  }

  // src/panel.js
  const FONT_UI = '-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif';
  const FONT_MONO = 'ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace';
  function panelCss(prefix) {
    const P = `#${prefix}-box`;
    return `
${P}{--p-bg:rgba(255,255,255,.92);--p-fg:#1f2328;--p-dim:#59636e;--p-line:#e6eaef;--p-log:rgba(246,248,250,.72);--p-focus:#0969da;--p-accent:#57606a;--p-on-accent:#fff;background:var(--p-bg);backdrop-filter:blur(10px) saturate(1.15);border:1px solid var(--p-line);border-radius:10px;overflow:hidden;box-shadow:0 10px 30px -8px rgba(0,0,0,.32),0 2px 8px rgba(0,0,0,.06);font:12px/1.5 ${FONT_UI};color:var(--p-fg);-webkit-font-smoothing:antialiased}
${P} ::selection{background:rgba(9,105,218,.22)}
${P} .${prefix}-head{padding:7px 10px;display:flex;justify-content:space-between;align-items:center;gap:8px;cursor:pointer;user-select:none;background:var(--p-accent);color:var(--p-on-accent)}
${P} .${prefix}-title{font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${P} .${prefix}-headright{display:flex;align-items:center;gap:7px;flex:0 0 auto}
${P} .${prefix}-headpct{font:600 11px/1 ${FONT_MONO};font-variant-numeric:tabular-nums;opacity:.85}
${P} .${prefix}-chev{display:block;opacity:.75;transition:transform .18s ease,opacity .18s ease}
${P} .${prefix}-head:hover .${prefix}-chev{opacity:1}
${P}[data-collapsed="1"] .${prefix}-chev{transform:rotate(-90deg)}
${P} .${prefix}-prog{padding:9px 10px 8px}
${P} .${prefix}-course{font-weight:600;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
${P} .${prefix}-meta{margin-top:4px;font-size:11px;color:var(--p-dim);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${P} #${prefix}-status{margin-top:6px;font-size:11.5px;color:var(--p-fg);opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${P} .${prefix}-sub{margin-top:3px;font-size:11px;color:var(--p-dim);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${P} .${prefix}-btnwrap{padding:0 10px 9px}
${P} #${prefix}-start{position:relative;overflow:hidden;display:flex;width:100%;align-items:center;justify-content:center;height:30px;padding:0 10px;border:0;border-radius:7px;background:var(--p-accent);color:var(--p-on-accent);font:600 12px/1 ${FONT_UI};letter-spacing:.01em;cursor:pointer;transition:filter .15s ease}
${P} #${prefix}-start:hover{filter:brightness(1.07)}
${P} #${prefix}-start:active{filter:brightness(.96)}
${P} #${prefix}-start:focus-visible{outline:2px solid var(--p-focus);outline-offset:2px}
${P} .${prefix}-track{position:absolute;inset:0;background:rgba(0,0,0,.26);opacity:0;transition:opacity .2s ease;pointer-events:none}
${P} .${prefix}-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--p-accent);transition:width .35s cubic-bezier(.22,.61,.36,1);pointer-events:none}
${P} .${prefix}-label{position:relative;z-index:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${P} #${prefix}-log{height:180px;overflow-y:auto;overscroll-behavior:contain;padding:6px 10px 8px;border-top:1px solid var(--p-line);background:var(--p-log);font:11px/1.6 ${FONT_MONO}}
${P} #${prefix}-log>div{display:flex;gap:6px;align-items:baseline}
${P} .${prefix}-ts{color:var(--p-dim);opacity:.7;flex:0 0 auto;font-variant-numeric:tabular-nums}
${P} .${prefix}-tx{flex:1 1 auto;min-width:0;white-space:pre-wrap;word-break:break-word}
${P} .${prefix}-tx.is-banner{font-weight:600}
${P} #${prefix}-log::-webkit-scrollbar{width:8px}
${P} #${prefix}-log::-webkit-scrollbar-thumb{background:rgba(130,130,130,.32);border-radius:4px}
${P} #${prefix}-log::-webkit-scrollbar-thumb:hover{background:rgba(130,130,130,.5)}
${P} #${prefix}-log::-webkit-scrollbar-track{background:transparent}
`;
  }
  function createPanel({
    prefix,
    title,
    fallbackColor,
    emoji,
    verb,
    consoleTag,
    submittedWord = "\u5DF2\u62A5",
    state: state2,
    lockOwner,
    currentBid: currentBid2,
    gm: gm2,
    onStart
  }) {
    let box, logEl, statusEl, btnStart, progEl, courseEl, fillEl, trackEl, labelEl, metaEl, subEl, headPct;
    const pendingLogs = [];
    function appendLine(t, msg) {
      const line = document.createElement("div");
      const ts = document.createElement("span");
      ts.className = `${prefix}-ts`;
      ts.textContent = t;
      const tx = document.createElement("span");
      tx.className = `${prefix}-tx` + (/^={3,}/.test(msg) ? " is-banner" : "");
      tx.textContent = msg;
      line.appendChild(ts);
      line.appendChild(tx);
      logEl.appendChild(line);
      while (logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
      logEl.scrollTop = logEl.scrollHeight;
    }
    function log(msg) {
      const t = (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour12: false });
      if (logEl) appendLine(t, msg);
      else {
        // boot 先于 mount 时（如 tokenFromStorage 的「令牌已捕获」），暂存起来等面板挂上再补显
        pendingLogs.push([t, msg]);
        if (pendingLogs.length > 60) pendingLogs.shift();
      }
      console.log(`[${consoleTag}] ${msg}`);
    }
    function pctInfo() {
      const p = state2.prog || {};
      const secTotal = Math.max(0, Number(p.secTotal) || 0);
      const coursesTotal = Math.max(0, Number(p.coursesTotal) || 0);
      const courseFrac = secTotal ? Math.min(1, ((Number(p.secDone) || 0) + (Number(p.curFrac) || 0)) / secTotal) : 0;
      const overall = coursesTotal > 1 ? Math.min(1, ((Number(p.coursesDone) || 0) + courseFrac) / coursesTotal) : courseFrac;
      return { pct: Math.round(overall * 100), secTotal, coursesTotal };
    }
    function etaSense(ms) {
      const m = ms / 6e4;
      if (m < 0.15) return "\u4E00\u7728\u773C";
      if (m < 1) return "\u559D\u53E3\u6C34\u7684\u529F\u592B";
      if (m < 5) return "\u4E00\u9996\u6B4C";
      if (m < 15) return "\u4E00\u676F\u5496\u5561";
      if (m < 45) return "\u4E00\u96C6\u77ED\u5267";
      if (m < 100) return "\u4E00\u96C6\u7535\u89C6\u5267";
      if (m < 180) return "\u4E00\u573A\u7535\u5F71";
      if (m < 480) return "\u5927\u534A\u5929";
      return "\u7761\u4E00\u89C9";
    }
    function fmtEta(ms) {
      if (!(ms > 1e3)) return "";
      const s = Math.round(ms / 1e3);
      let exact;
      if (s < 60) exact = `\u7EA6 ${s} \u79D2`;
      else {
        const m = Math.round(s / 60);
        if (m < 60) exact = `\u7EA6 ${m} \u5206`;
        else {
          const h = Math.floor(m / 60), rm = m % 60;
          exact = rm ? `\u7EA6 ${h} \u5C0F\u65F6 ${rm} \u5206` : `\u7EA6 ${h} \u5C0F\u65F6`;
        }
      }
      return `${exact} \xB7 ${etaSense(ms)}`;
    }
    function ui() {
      if (!statusEl) return;
      const p = state2.prog || {};
      const { pct, secTotal, coursesTotal } = pctInfo();
      const hasProg = !!(secTotal || coursesTotal);
      if (progEl) progEl.style.display = hasProg ? "" : "none";
      if (fillEl) fillEl.style.width = hasProg ? pct + "%" : "0";
      if (trackEl) trackEl.style.opacity = hasProg && pct > 0 ? "1" : "0";
      if (courseEl) {
        courseEl.textContent = state2.course || "";
        courseEl.style.display = state2.course ? "" : "none";
      }
      if (metaEl) {
        const bits = [];
        if (secTotal) bits.push(`\u5C0F\u8282 ${Math.min(Number(p.secDone) || 0, secTotal)}/${secTotal}`);
        if (coursesTotal > 1) bits.push(`\u8BFE\u7A0B ${Math.min((Number(p.coursesDone) || 0) + (state2.running ? 1 : 0), coursesTotal)}/${coursesTotal}`);
        metaEl.textContent = bits.join(" \xB7 ");
      }
      statusEl.textContent = state2.running ? state2.section || "\u51C6\u5907\u4E2D" : lockOwner() ? "\u25A0 \u5DF2\u505C\u6B62 (\u53E6\u4E00\u4EFB\u52A1/\u811A\u672C\u8FD0\u884C\u4E2D)" : currentBid2() ? "\u25A0 \u5DF2\u505C\u6B62 \xB7 \u5F53\u524D\u9875\u8BFE\u7A0B/\u4E13\u9898" : "\u25A0 \u5DF2\u505C\u6B62 \xB7 \u4E2A\u4EBA\u5B66\u4E60\u4EFB\u52A1";
      statusEl.title = statusEl.textContent;
      if (subEl) {
        const bits = [];
        if (state2.running) {
          if (state2.round) bits.push(`\u7B2C ${state2.round} \u8F6E`);
          const tot = Math.trunc(Number(p.sectionTotalSec) || 0);
          const sub = Math.trunc(Number(state2.submitted) || 0);
          if (tot) bits.push(`${submittedWord} ${Math.trunc(Number(p.sectionSec) || 0)}/${tot}s`);
          else if (sub) bits.push(`${submittedWord} ${sub}s`);
          const eta = fmtEta(p.etaMs);
          if (eta) bits.push(eta);
        }
        subEl.textContent = bits.join(" \xB7 ");
        subEl.title = subEl.textContent;
        subEl.style.display = bits.length ? "" : "none";
      }
      if (headPct) headPct.textContent = state2.collapsed && hasProg ? pct + "%" : "";
      if (labelEl) {
        const pctTxt = hasProg ? ` ${pct}%` : "";
        labelEl.textContent = state2.stopFlag && state2.running ? "\u23F8 \u505C\u6B62\u4E2D\u2026" : state2.running ? `\u23F8 \u505C\u6B62${pctTxt}` : pct >= 100 ? "\u2713 \u5DF2\u5B8C\u6210 100%" : pct > 0 ? `\u25B6 \u7EE7\u7EED${pctTxt}` : currentBid2() ? `${emoji} ${verb}\u672C\u8BFE\u7A0B/\u4E13\u9898` : `${emoji} \u6267\u884C\u5B66\u4E60\u4EFB\u52A1`;
      }
    }
    function headerColor(fallback) {
      try {
        const els = document.elementsFromPoint(1, 1);
        const top = els.find((el) => {
          if (el === document.documentElement || el === document.body) return false;
          const cs = getComputedStyle(el);
          return (cs.position === "fixed" || cs.position === "sticky") && el.offsetHeight > 0 && el.offsetHeight < 200;
        });
        if (top) {
          for (const el of [top, ...top.querySelectorAll("*")]) {
            const bg = getComputedStyle(el).backgroundColor;
            const m = bg.match(/^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)$/);
            if (!m) continue;
            if (m[4] !== void 0 && parseFloat(m[4]) < 1) continue;
            const [r, g, b] = [+m[1], +m[2], +m[3]];
            if (r > 246 && g > 246 && b > 246) continue;
            return { bg, light: 0.299 * r + 0.587 * g + 0.114 * b < 160 };
          }
        }
      } catch {
      }
      return { bg: fallback, light: true };
    }
    function makeDraggable(head, panel2, onToggle) {
      let sx = 0, sy = 0, px = 0, py = 0, moved = false;
      head.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        const r = panel2.getBoundingClientRect();
        sx = e.clientX;
        sy = e.clientY;
        px = r.left;
        py = r.top;
        moved = false;
        const mv = (ev) => {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          if (!moved && Math.hypot(dx, dy) < 4) return;
          moved = true;
          state2.pinned = true;
          const w = panel2.offsetWidth, h = panel2.offsetHeight;
          const left = Math.min(Math.max(0, px + dx), window.innerWidth - w);
          const top = Math.min(Math.max(0, py + dy), window.innerHeight - h);
          panel2.style.left = left + "px";
          panel2.style.top = top + "px";
          panel2.style.right = "auto";
          panel2.style.bottom = "auto";
        };
        const up = () => {
          document.removeEventListener("mousemove", mv);
          document.removeEventListener("mouseup", up);
          if (moved) {
            state2.pinned = true;
            gm2.setValue("pos", { left: parseFloat(panel2.style.left), top: parseFloat(panel2.style.top), v: 2 });
          } else onToggle();
        };
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
      });
      head.addEventListener("click", (e) => e.preventDefault());
    }
    function setCollapsed(c) {
      state2.collapsed = c;
      gm2.setValue("collapsed", c);
      if (!box) return;
      const body = box.querySelector(`.${prefix}-body`);
      body.style.display = c ? "none" : "";
      box.style.width = c ? "auto" : "340px";
      box.dataset.collapsed = c ? "1" : "0";
      box.title = c ? "\u70B9\u51FB\u6807\u9898\u680F\u5C55\u5F00" : "\u70B9\u51FB\u6807\u9898\u680F\u6298\u53E0";
      ui();
    }
    function mount() {
      if (box && (!document.contains || document.contains(box))) return;
      const buddy = document.querySelector(".um-head, .uf-head");
      if (buddy) state2.stacked = true;
      const posCss = state2.stacked ? `top:${Math.round(buddy.parentElement.getBoundingClientRect().bottom + 12)}px` : "bottom:16px";
      box = document.createElement("div");
      box.id = `${prefix}-box`;
      box.style.cssText = `position:fixed;${posCss};right:12px;z-index:999999;width:340px;`;
      box.innerHTML = `
      <style>${panelCss(prefix)}</style>
      <div class="${prefix}-head">
        <span class="${prefix}-title">${title}</span>
        <span class="${prefix}-headright"><span class="${prefix}-headpct"></span><svg class="${prefix}-chev" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.75 4.5 6 7.75 9.25 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
      <div class="${prefix}-body">
        <div class="${prefix}-prog">
          <div class="${prefix}-pwrap">
            <div class="${prefix}-course"></div>
            <div class="${prefix}-meta"></div>
          </div>
          <div id="${prefix}-status"></div>
          <div class="${prefix}-sub"></div>
        </div>
        <div class="${prefix}-btnwrap">
          <button id="${prefix}-start" type="button"><i class="${prefix}-track"></i><i class="${prefix}-fill"></i><span class="${prefix}-label"></span></button>
        </div>
        <div id="${prefix}-log"></div>
      </div>`;
      const root = document.documentElement || document.body;
      if (!root) return;
      root.appendChild(box);
      const pos = gm2.getValue("pos");
      if (pos && pos.v === 2) {
        box.style.left = Math.min(Math.max(0, pos.left), Math.max(0, window.innerWidth - box.offsetWidth)) + "px";
        box.style.top = Math.min(Math.max(0, pos.top), Math.max(0, window.innerHeight - box.offsetHeight)) + "px";
        box.style.right = "auto";
        box.style.bottom = "auto";
        state2.pinned = true;
      }
      logEl = box.querySelector(`#${prefix}-log`);
      statusEl = box.querySelector(`#${prefix}-status`);
      btnStart = box.querySelector(`#${prefix}-start`);
      progEl = box.querySelector(`.${prefix}-pwrap`);
      courseEl = box.querySelector(`.${prefix}-course`);
      fillEl = box.querySelector(`.${prefix}-fill`);
      trackEl = box.querySelector(`.${prefix}-track`);
      labelEl = box.querySelector(`.${prefix}-label`);
      metaEl = box.querySelector(`.${prefix}-meta`);
      subEl = box.querySelector(`.${prefix}-sub`);
      headPct = box.querySelector(`.${prefix}-headpct`);
      if (pendingLogs.length) {
        for (const [t, msg] of pendingLogs.splice(0)) appendLine(t, msg);
      }
      makeDraggable(box.querySelector(`.${prefix}-head`), box, () => setCollapsed(!state2.collapsed));
      btnStart.onclick = (e) => {
        e.stopPropagation();
        onStart();
      };
      setCollapsed(!!gm2.getValue("collapsed", false));
      ui();
      watchTheme();
    }
    function watchTheme() {
      let last = "";
      const tick = () => {
        if (!box) return;
        ui();
        if (state2.stacked && !state2.pinned) {
          const buddy = Array.from(document.querySelectorAll(".um-head, .uf-head")).find((el) => el.parentElement !== box);
          const rect = buddy && buddy.parentElement.getBoundingClientRect();
          if (rect && rect.height > 0) {
            const top = Math.min(Math.round(rect.bottom + 12), Math.max(0, window.innerHeight - box.offsetHeight));
            box.style.top = top + "px";
          }
        }
        const theme = headerColor(fallbackColor);
        const key = `${theme.bg}|${theme.light ? "L" : "D"}`;
        if (key === last) return;
        last = key;
        box.style.setProperty("--p-accent", theme.bg);
        box.style.setProperty("--p-on-accent", theme.light ? "#fff" : "#1f2328");
        if (!state2.pinned && !state2.stacked) {
          box.style.top = "auto";
          box.style.bottom = "16px";
        }
      };
      tick();
      setInterval(tick, 2e3);
      window.addEventListener("hashchange", tick);
    }
    function destroy() {
      if (box && box.remove) box.remove();
      box = null;
    }
    return { log, ui, mount, setCollapsed, destroy, getBox: () => box };
  }

  // src/routes.js
  function currentBidFromHash(hash) {
    try {
      const h = decodeURIComponent(hash || "");
      const m = h.match(/course\/detail\/\d+&([^&/]+)/) || h.match(/subject\/detail\/([^&/?#]+)/) || h.match(/course\/detail\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
      return m ? m[1] : "";
    } catch {
      return "";
    }
  }
  var AUTH_PAGE_RE = /#\/(?:login|register|forget|auth)\b/i;
  var isAuthPage = (hash) => AUTH_PAGE_RE.test(hash || "");

  // src/entry-fast.js
  var gm = {
    getValue: (k, d) => {
      try {
        const v = GM_getValue(k);
        return v === void 0 ? d : v;
      } catch {
        return d;
      }
    },
    setValue: (k, v) => {
      try {
        GM_setValue(k, v);
      } catch {
      }
    },
    deleteValue: (k) => {
      try {
        GM_deleteValue(k);
      } catch {
      }
    }
  };
  var state = { running: false, stopFlag: false, course: "", section: "", round: 0, submitted: 0, collapsed: false, pinned: false, stacked: false, prog: { secDone: 0, secTotal: 0, curFrac: 0, coursesDone: 0, coursesTotal: 0, sectionSec: 0, sectionTotalSec: 0, nestedDone: 0, nestedTotal: 0, etaMs: null } };
  var hunter = createTokenHunter({ log: (m) => panel.log(m) }); // panel.log lazy ref: panel exists by boot time, so storage-restored token shows in panel too
  var api = createApi({ hunter, log: (m) => panel.log(m) });
  // 旧版本把明文账密存进了 GM；脚本已不再使用，启动即清除
  gm.deleteValue("account");
  gm.deleteValue("companyName");
  var normalizeChunk = (raw) => Math.min(86400, Math.max(30, Number(raw) || 600)); // cap 24h: bigger values backdate createTime to 1970
  var chunk = () => normalizeChunk(gm.getValue("chunk"));
  var config = {
    getStep: () => chunk(),
    backdateS: (step) => step + Math.trunc(rand(60, 300)),
    roundSleepMs: () => rand(600, 1600),
    roundsSlack: 5,
    taskGapMs: () => rand(1500, 3e3),
    coursePageLabel: "\u5FEB\u901F\u5237\u672C\u8BFE\u7A0B/\u4E13\u9898"
  };
  var TAB = (() => { try { const k = "__MOOC_US_TAB__"; let v = sessionStorage.getItem(k); if (!v) { v = Math.random().toString(36).slice(2, 10); sessionStorage.setItem(k, v); } return v; } catch { return Math.random().toString(36).slice(2, 10); } })();
  var lock = createLock("fast");
  var INSTANCE = "fast#" + TAB;
  var guard = createSessionGuard(gm);
  config.canStart = () => guard.hold(INSTANCE);
  var currentBid = () => currentBidFromHash(location.hash);
  var engine;
  var panel = createPanel({
    prefix: "uf",
    title: "\u5FEB\u901F\u5237\u8BFE\u5B66\u4E60\u52A9\u624B",
    fallbackColor: "#b35900",
    emoji: "\u26A1",
    verb: "\u5237",
    consoleTag: "\u5FEB\u901F\u5237\u8BFE",
    state,
    lockOwner: lock.lockOwner,
    currentBid,
    gm,
    onStart: () => {
      if (state.running) {
        state.stopFlag = true;
        panel.log("\u6B63\u5728\u505C\u6B62(\u7B49\u5F53\u524D\u8F6E\u7ED3\u675F)\u2026");
        panel.ui();
      } else if (guard.held(INSTANCE)) {
        panel.log("\u26D4 \u53E6\u4E00\u4E2A\u6807\u7B7E\u9875\u7684\u5B66\u4E60\u811A\u672C\u6B63\u5728\u8FD0\u884C, \u4E0D\u542F\u52A8(\u9632\u591A\u5F00)");
      } else {
        panel.setCollapsed(false);
        guard.hold(INSTANCE);
        engine.runAll().then((r) => {
          if (r && r.ok && !state.stopFlag) {
            panel.log("\u21BB 2 \u79D2\u540E\u5237\u65B0\u9875\u9762\u4EE5\u66F4\u65B0\u8FDB\u5EA6\u2026");
            setTimeout(() => location.reload(), 2e3);
          } else if (r && r.authFailed) {
            panel.log("\u2717 \u767B\u5F55\u6001\u5931\u6548, \u5DF2\u505C\u6B62(\u4E0D\u81EA\u52A8\u5237\u65B0)");
          }
        }).catch((e) => panel.log(`\u2717 ${e && e.message || e}`)).finally(() => guard.release(INSTANCE));
      }
    }
  });
  engine = createEngine({ api, state, config, log: panel.log, ui: panel.ui, lock, currentBid });
  setInterval(() => {
    if (state.running) guard.hold(INSTANCE);
  }, 15e3);
  window.addEventListener("pagehide", () => guard.release(INSTANCE));
  hunter.installHooks({});
  (function boot() {
    hunter.tokenFromStorage();
    const mountPanel = () => { if (!isAuthPage(location.hash)) panel.mount(); };
    if (document.documentElement) mountPanel();
    else document.addEventListener("DOMContentLoaded", mountPanel, { once: true });
    window.addEventListener("hashchange", () => {
      if (!isAuthPage(location.hash)) {
        if (!panel.getBox()) panel.mount();
      } else if (panel.getBox()) {
        panel.destroy();
      }
    });
    window.__MOOC_US_DEBUG__ = Object.assign(window.__MOOC_US_DEBUG__ || {}, {
      fast: {
        state,
        runCourse: (id) => engine.runCourse(id),
        runAll: () => engine.runAll(),
        currentBidFromHash: () => currentBid(),
        log: panel.log,
        core: {
          pystr,
          toParams,
          qs,
          form,
          createTokenHunter,
          createApi,
          createEngine,
          createLock,
          createSessionGuard,
          QuotaExhausted,
          buildStartParams,
          parseRemaining,
          normalizeReport,
          computeMaxRounds,
          normalizeChunk,
          currentBidFromHash: (hash) => currentBidFromHash(hash),
          isAuthPage,
          taskFilter,
          sectionSkipped,
          getStep: () => config.getStep(),
          roundsSlack: config.roundsSlack,
          engine,
          constants: { API, MEDIA, NESTED, SKIP, DONE, TYPE_NAME }
        }
      }
    });
  })();
  GM_registerMenuCommand("\u663E\u793A/\u9690\u85CF\u9762\u677F", () => {
    if (!panel.getBox()) {
      panel.mount();
      return;
    }
    const b = panel.getBox();
    b.style.display = b.style.display === "none" ? "" : "none";
  });
  GM_registerMenuCommand("\u8BBE\u7F6E\u5355\u6863\u79D2\u6570(\u226530)", () => {
    const v = Number(prompt("\u6BCF\u4E2A\u5C0F\u8282\u6BCF\u6B21\u4E0A\u62A5\u7684\u79D2\u6570(\u226530, \u9ED8\u8BA4600):", String(gm.getValue("chunk") || 600)));
    if (Number.isFinite(v) && v >= 30 && v <= 86400) {
      gm.setValue("chunk", Math.trunc(v));
      panel.log(`\u5355\u6863\u79D2\u6570 \u2192 ${Math.trunc(v)}`);
    } else if (v) panel.log("\u79D2\u6570\u65E0\u6548(\u987B 30\u201586400)");
  });
})();
