# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- 主要用户：在 `mooc.ctt.cn` 上有必修学时任务、希望按自己可接受的时间与风险偏好清完课程的学员。
- 发行范围：**公开脚本**。用户通过 Tampermonkey / Violentmonkey / ScriptCat 安装；README 提供 GreasyFork（快速刷课 604497、无人值守 604496）与 ScriptCat（9059 / 9058）安装页，并提供 GitHub raw 源码复制安装方式。
- 用户使用自己已在网页上登录好的会话；脚本不接管账号。

## Product Purpose

让学员在同一站点上有两条明确路径完成必修学时，并始终看见代价：

- **快速刷课**：回填 `createTime`、批量上报，一门 4 学时课约几分钟走完。
- **无人值守**：只驱动页面真实播放，不代报进度，学时与真实时间 1:1 增长。

成功 = 面板进度走到 100%、平台完成记账，且用户理解所选路径的时间成本与账号风险。

## Positioning

两条路径互斥，差异在机制而非界面：

- 快刷利用 `createTime` 由客户端提供这一缺口——服务端只校验本次上报时长不超过日志年龄；把开始时间挪到过去后，每轮都有整档额度，轮间只歇 0.6–1.6 秒。
- 无人值守不调用 `start-progress` / `video-progress` / `doc-progress` 任何上报接口，只打开课件、驱动播放器，学时由平台自己记。
- 单一账号同时只启用一个脚本；两者共用同一把会话锁。

## Operating Context

- 运行在 `mooc.ctt.cn` 页面内，`@match https://mooc.ctt.cn/*`，`@run-at document-start`，`@noframes`。
- 用户需先在浏览器正常登录；Chrome 138 起还需在扩展详情里打开「允许运行用户脚本」，否则脚本不执行且不报错。
- 启动入口为右下角悬浮面板的「执行学习任务」。停在课程/专题详情页时只处理当前一门；否则拉取「我的任务」列表逐课推进。
- 令牌来源：`localStorage.token` 拼 `Bearer__<access_token>`（双下划线），或挂钩页面自身的 `XMLHttpRequest` / `fetch` 截 `Bearer` 头；遇到 401 或 `errorCode ∈ {90901, 90902}` 时回读 localStorage 重试一次，失败则停下并提示重新登录。
- 全部处理完且非配额耗尽时，2 秒后自动刷新页面，让面板落到新值。
- 无人值守支持油猴菜单「自动续跑」；快刷支持菜单设置单档秒数（≥30）。
- 项目是公开仓库；两个 `.user.js` 是单文件 IIFE 打包产物，内部按 `// src/xxx.js` 分 9 个共用模块（token、constants、util、api、engine、lock、guard、panel、routes）。

## Capabilities and Constraints

- 可处理：`mp4`(6)、`mp3`(5)、`pdf`(1)、`epub`(7)、外链(3)、图片(2)、关联课程(10，递归两层)。
- 跳过：考试(9)、问卷(12)、评估(13) 需真实作答；`scorm`(4)、任务(8)、课件(15) 暂无上报协议；已完成小节（`finishStatus ∈ {2,4}`）直接略过。
- 单轮实际上报 ≤90s；≥120s 会被平台静默丢弃（HTTP 200 但不入账），单档秒数不可当作上报上限调大。
- 学时按日累计上限 24 小时；快刷到顶判定配额耗尽并停下，无人值守到顶仅平台不再记账。
- 平台开启 `enableUnique=1` 时检测多端同时学习；同一账号不得在多设备、多浏览器同时跑。
- 同页互斥、跨标签页 45 秒防多开；两个脚本同时启用会直接拒启动。
- 不收集、不保存账号密码，不调用任何登录接口。
- 当前版本 `0.0.16`；零依赖回归测试在 `tests/`，`npm test` 与 4 矩阵 CI 覆盖语法与测试。
- 平台规则与接口随时可能收紧：`createTime` 改为服务端时钟或接口变更会导致方案失效。

## Brand Commitments

- 名称固定为「烟草网络学院 · 学习助手」，两个模式分别叫「⚡ 快速刷课学习助手」与「▶ 无人值守学习助手」。
- 对外一律标注**非官方工具**与风险自担；不得宣称官方背书。
- 用途边界固定：仅供个人账号的学习进度管理与协议研究；不得用于代刷、售卖或商业用途。
- 语气直陈代价与边界：README 与发布页明确写清时间差、静默丢弃、风控、互斥与失效条件。

## Evidence on Hand

- `C:\Users\user\Desktop\tobacco-mooc-study\README.md`：产品说明、模式对比、机制、接口清单、边界风险。
- `C:\Users\user\Desktop\tobacco-mooc-study\docs\tobacco-mooc-fast.additional-info.md`：快刷发布页文案。
- `C:\Users\user\Desktop\tobacco-mooc-study\docs\tobacco-mooc-unattended.additional-info.md`：无人值守发布页文案。
- `C:\Users\user\Desktop\tobacco-mooc-study\userscript\tobacco-mooc-fast.user.js`：快刷实现，版本 0.0.16。
- `C:\Users\user\Desktop\tobacco-mooc-study\userscript\tobacco-mooc-unattended.user.js`：无人值守实现，版本 0.0.16。
- `C:\Users\user\Desktop\tobacco-mooc-study\assets\readme\hero.svg`、`pacing.svg`、`flow.svg`：官方示意图。
- `C:\Users\user\Desktop\tobacco-mooc-study\assets\shots\live-16-panel-running.png`、`live-17-panel-unattended.png`：实机面板截图。
- `C:\Users\user\Desktop\tobacco-mooc-study\tests\`：零依赖回归测试。
- 无用户访谈、案例、评价、数据或背书材料；后续工作不得虚构。

## Product Principles

1. **身份最小化**：只借用页面已有登录态；不收账密、不保存、不代登录。
2. **两条路径，二选一**：快刷与无人值守机制不同、互斥运行；用户按时间与风险偏好明确选择，不混用。
3. **不越过平台硬边界**：90s 单轮上限、24h 日配额、多端检测、互斥锁；触发即停或明确提示，不静默硬刷。
4. **失败必须可诊断**：日志保留最近 60 行；登录态失效、配额耗尽、多开冲突、平台未记账都给明确提示。
5. **公开但有限定**：公开分发，但始终随附非官方声明、风险自担与用途限制。

## Accessibility & Inclusion

未设立超出 web 基线的产品级无障碍要求（用户明确表示无额外需求）。现有交互路径已支持键盘聚焦与触屏无 hover 回退，并由 README 与回归测试记录。
