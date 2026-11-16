// 互斥语义：两个脚本只有「另一个真的在跑」时才互相挡，跑完/关页立刻放行。
const { suite } = require("./lib/tap");
const { KINDS, loadGuard, loadLock } = require("./lib/userscript");

const t = suite();

function makeGm() {
  const store = new Map();
  return {
    store,
    getValue: (k, d) => (store.has(k) ? store.get(k) : d),
    setValue: (k, v) => store.set(k, v),
    deleteValue: (k) => store.delete(k)
  };
}

for (const kind of KINDS) {
  console.log(`\n[${kind}] guard`);
  const createSessionGuard = loadGuard(kind);
  const createLock = loadLock(kind);

  // ---- 会话锁 ----
  const gm = makeGm();
  let clock = 1e12;
  const now = () => clock;
  const A = createSessionGuard(gm, { ttlMs: 45e3, now });
  const B = createSessionGuard(gm, { ttlMs: 45e3, now });

  t.check("空闲时无人持有", B.held("b"), false);
  t.check("空闲时 holder 为 null", B.holder("b"), null);
  t.check("空闲时可以占住", B.hold("b", "realtime"), true);
  B.release("b");

  t.check("A 占住", A.hold("a", "fast"), true);
  t.check("B 看到有人在跑", B.held("b"), true);
  t.check("B 能说出是谁", B.holder("b") && B.holder("b").kind, "fast");
  t.check("B 抢不走", B.hold("b", "realtime"), false);
  t.check("A 自己不算被挡", A.held("a"), false);
  t.check("A 续期成功", A.hold("a", "fast"), true);

  t.check("A 释放", (A.release("a"), B.held("b")), false);
  t.check("A 释放后 B 能占", B.hold("b", "realtime"), true);
  t.check("B 占住后 A 被挡", A.held("a"), true);
  t.check("B 能说出是谁", A.holder("a") && A.holder("a").kind, "realtime");
  B.release("b");

  // 非持有者释放无效
  A.hold("a", "fast");
  B.release("b");
  t.check("非持有者释放无效", A.held("b"), true);
  A.release("a");

  // 过期即放行（关页/崩溃没来得及释放的情况）
  A.hold("a", "fast");
  clock += 45e3 + 1;
  t.check("过期后不再挡人", B.held("b"), false);
  t.check("过期后 holder 为 null", B.holder("b"), null);
  t.check("过期后可以接手", B.hold("b", "realtime"), true);
  B.release("b");

  // ---- 同标签页锁 ----
  console.log(`[${kind}] lock`);
  const win = {};
  const fast = createLock("fast", win);
  const real = createLock("realtime", win);

  t.check("未启动时互不干扰", [fast.lockOwner(), real.lockOwner()], ["", ""]);
  fast.acquire();
  t.check("fast 跑起来后 realtime 被挡", real.lockOwner(), "另一个脚本");
  t.check("fast 自己不算被挡", fast.lockOwner(), "");
  fast.release();
  t.check("fast 停后 realtime 放行", real.lockOwner(), "");
  real.acquire();
  t.check("realtime 跑起来后 fast 被挡", fast.lockOwner(), "另一个脚本");
  real.release();
  t.check("realtime 停后 fast 放行", fast.lockOwner(), "");
}

const failed = t.report();
process.exit(failed ? 1 : 0);
