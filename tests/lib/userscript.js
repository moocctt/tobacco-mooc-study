// 从打包好的 userscript 里切出某个 src/*.js 段，供测试单独加载。
// 两个脚本都是单文件产物，段与段之间用 `  // src/<name>.js` 注释分隔。
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const FILES = {
  fast: path.join(ROOT, "userscript", "tobacco-mooc-fast.user.js"),
  unattended: path.join(ROOT, "userscript", "tobacco-mooc-unattended.user.js")
};
const KINDS = Object.keys(FILES);

function read(kind) {
  const file = FILES[kind];
  if (!file) throw new Error(`未知脚本: ${kind}`);
  return fs.readFileSync(file, "utf8");
}

function slice(src, from, to) {
  const a = src.indexOf(from);
  if (a < 0) throw new Error(`找不到分段标记: ${from}`);
  if (!to) return src.slice(a);
  const b = src.indexOf(to, a + from.length);
  if (b < 0) throw new Error(`找不到分段标记: ${to}`);
  return src.slice(a, b);
}

const block = (kind, from, to) => slice(read(kind), from, to);

const panelSource = (kind) => block(kind, "  // src/panel.js", "  // src/");
const engineSource = (kind) => block(kind, "  // src/token.js", "  // src/panel.js");
const guardSource = (kind) => block(kind, "  // src/guard.js", "  // src/");
const lockSource = (kind) => block(kind, "  // src/lock.js", "  // src/");
const darkSource = (kind) => block(kind, "  // src/dark.js", "  // src/");

const noop = () => {};

// userscript 段里会碰到这些浏览器全局，测试时给最小桩。
const ENGINE_PARAMS = [
  "document", "window", "console", "location", "localStorage",
  "XMLHttpRequest", "fetch", "navigator", "setTimeout", "clearTimeout"
];

function engineGlobals() {
  return {
    document: {
      addEventListener: noop, querySelector: () => null, querySelectorAll: () => [],
      documentElement: null, body: null, elementsFromPoint: () => []
    },
    window: { addEventListener: noop, innerWidth: 1200, innerHeight: 800 },
    console: { log: noop, warn: noop, error: noop },
    location: { hash: "", reload: noop },
    localStorage: null,
    XMLHttpRequest: function () {
      this.setRequestHeader = noop; this.open = noop; this.send = noop; this.addEventListener = noop;
    },
    fetch: async () => ({ ok: false, status: 0 }),
    navigator: { wakeLock: { request: async () => ({ addEventListener: noop }) } },
    setTimeout, clearTimeout
  };
}

function compile(src, params, exportExpr) {
  const factory = new Function(...params, `${src}\n; return ${exportExpr};`);
  return factory;
}

function loadEngine(kind) {
  const g = engineGlobals();
  const factory = compile(
    engineSource(kind),
    ENGINE_PARAMS,
    "{ createEngine, createApi, createTokenHunter, API, ORIGIN, DONE, SKIP, MEDIA, NESTED }"
  );
  return factory(...ENGINE_PARAMS.map((k) => g[k]));
}

function loadPanelFactory(kind) {
  return compile(panelSource(kind), ["document", "window", "getComputedStyle", "setInterval", "console", "location"], "createPanel");
}

function loadGuard(kind) {
  return compile(guardSource(kind), [], "createSessionGuard")();
}

function loadLock(kind) {
  return compile(lockSource(kind), [], "createLock")();
}

function loadDark(kind, g) {
  g = g || {};
  g.location = g.location || { hash: "" };
  function makeRoot() {
    return { getAttribute: () => null, setAttribute() {}, removeAttribute() {}, hasAttribute: () => false, appendChild() {} };
  }
  g.document = g.document || { documentElement: makeRoot(), getElementById: () => null, createElement: () => ({ style: {}, textContent: "", setAttribute() {}, appendChild() {} }) };
  g.window = g.window || { addEventListener: noop };
  g.setInterval = g.setInterval || (() => 0);
  g.clearTimeout = g.clearTimeout || noop;
  g.setTimeout = g.setTimeout || (() => 0);
  g.console = g.console || { log: noop };
  g.Image = g.Image || function () {};
  const params = ["document", "window", "location", "setInterval", "clearTimeout", "setTimeout", "console", "Image", "URL", "MutationObserver"];
  g.URL = g.URL || URL;
  g.MutationObserver = g.MutationObserver || function () { this.observe = noop; };
  const factory = compile(darkSource(kind), params, "createDarkMode");
  const createDarkMode = factory(...params.map((k) => g[k]));
  return createDarkMode({ gm: g.gm || { getValue: () => undefined, setValue: noop }, log: g.log || noop, prefix: g.prefix || "uf" });
}

module.exports = {
  ROOT, FILES, KINDS, read, slice, block,
  panelSource, engineSource, guardSource, lockSource, darkSource,
  loadEngine, loadPanelFactory, loadGuard, loadLock, loadDark,
  engineGlobals, ENGINE_PARAMS
};
