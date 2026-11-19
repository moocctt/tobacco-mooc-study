---
name: 烟草网络学院 · 学习助手
description: 暖纸底、宿主导航栏取色强调的学习状态面板
colors:
  panel-bg: "#fbf8f3"
  panel-fg: "#2a2521"
  panel-dim: "#6e645a"
  panel-line: "#e5ddd3"
  panel-header: "#f2ece3"
  log-bg: "#f6f1e9"
  accent: "#b35900"
  accent-fallback-fast: "#b35900"
  accent-fallback-unattended: "#1a7f37"
  accent-hover: "color-mix(in srgb, var(--p-accent) 88%, black)"
  accent-active: "color-mix(in srgb, var(--p-accent) 80%, black)"
  on-accent: "#fff"
  track: "rgba(0,0,0,.28)"
  scroll-thumb: "rgba(110,100,90,.32)"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    lineHeight: 1.55
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.4
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    lineHeight: 1.5
  button:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
    fontSize: "11px"
    lineHeight: 1.65
rounded:
  panel: "12px"
  control: "10px"
  scrollbar: "4px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
components:
  panel-card:
    backgroundColor: "{colors.panel-bg}"
    textColor: "{colors.panel-fg}"
    rounded: "{rounded.panel}"
    padding: "0"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "44px"
  log-region:
    backgroundColor: "{colors.log-bg}"
    textColor: "{colors.panel-fg}"
    typography: "{typography.mono}"
---

# Design System

## Overview

学习助手是一个停在页面右下角的轻量工具，不是独立后台。它要同时回答三件事：现在在学什么、进行到哪、下一步能做什么。视觉因此偏“纸面记录”：暖白底、深褐字、强调色取自宿主导航栏，没有玻璃、发光和多层阴影。

面板可拖拽、可折叠。展开时自上而下是进度区、按钮、日志；折叠后只留标题栏，但状态和百分比仍在右侧。按钮本身就是进度条：完成比例从左往右填充，文字同时给出状态与百分比。运行中默认显示学习状态，鼠标悬停或键盘聚焦才露出停止动作；触屏没有 hover，则直接显示停止。

两种模式共用同一套视觉与交互，只在标题和动词上区分：快速模式叫“快速学习助手”，无人值守叫“自动学习助手”。

## Colors

- **暖纸底（`#fbf8f3`）**：面板底色。比纯白柔和，长时间阅读日志不刺眼。
- **主文字（`#2a2521`）**：正文、标题、按钮文字。偏暖的深褐，不用纯黑。
- **次文字（`#6e645a`）**：课程计数、副行、时间戳、折叠状态。对暖纸底对比度 5.46:1。
- **分隔线（`#e5ddd3`）**：面板边框、标题栏下边线、日志上边线。只做结构，不做装饰。
- **标题栏（`#f2ece3`）**：比面板底色略深一层，靠明度区分层级，不靠阴影。
- **日志底（`#f6f1e9`）**：按钮下方滚动区，和正文区分但不跳色。
- **强调色（取自宿主导航栏）**：按钮、进度填充、焦点环、折叠百分比都跟随宿主页面顶部导航/固定栏的第一个非浅色背景；取不到时快速刷课回退 `#b35900`，无人值守回退 `#1a7f37`。按钮文字按背景明度自动选 `#fff` 或 `#1f2328`。
- **按钮文字（`#fff` / `#1f2328`）**：随强调色明度切换，保证对比度。
- **进度槽（`rgba(0,0,0,.28)`）**：按钮内未完成部分的压暗层。

不硬编码品牌强调色，也不为了“安全”而完全脱离宿主页面。宿主顶部是什么颜色，面板就借什么颜色；其余部分仍保持纸面质感。

## Typography

全面板最多四种字号：

- **标题 14px / 650**：面板标题。
- **正文 13px / 1.55**：课程名、当前小节、按钮文字。
- **辅助 12px / 1.5**：小节/课程计数、副行、折叠状态、空日志提示。
- **日志 11px / 1.65**：等宽字体，只用于时间戳和日志正文；数字用 `font-variant-numeric: tabular-nums`。

说明文字不用斜体、不用全大写、不用中间点连接。动词统一：开始、继续、停止、已完成。按钮和标签不写“立即”“马上”这类催促词。

## Layout

面板宽 `min(360px, calc(100vw - 24px))`，默认距右 18px、距底 18px；底部叠加 `env(safe-area-inset-bottom)`。360px 视口下实际宽 336px，左右各 12px；390px 视口下宽 360px，左右各 18px。没有横向滚动。

展开态：

- 标题栏 `9px 12px`，标题与右侧状态/百分比之间 `gap: 8px`。
- 进度区 `12px 12px 0`：课程名、计数行、当前小节、副行。
- 按钮区 `12px 12px 10px`，按钮高 44px。
- 日志区 `8px 12px 10px`，`min-height: 96px`，`max-height: clamp(140px, 26vh, 180px)`。

折叠态只保留标题栏，右侧依次是状态、百分比、箭头。长标题省略，不换行。

## Elevation & Depth

默认平面。面板只有 `1px` 边框和标题栏/日志区的明度差，没有 `box-shadow`，没有 `backdrop-filter`，没有渐变描边。层级靠底色、间距和字重表达。真正浮起的只有浏览器原生弹窗，不在这里造第二层“浮卡”。

## Shapes

面板 12px 圆角，按钮 10px 圆角，滚动条拇指 4px 圆角。嵌套元素同心：按钮距面板边 12px，圆角比面板小 2px。分割线只有 1px 实线，不做双线、虚线或渐变。

## Components

### Panel Card

暖纸底、1px 暖灰边框、12px 圆角、`overflow: hidden`。标题栏和日志区用底色区分，不使用阴影。

### Header

整条可点击折叠，`role="button"`、`tabindex="0"`、`aria-expanded` 随状态更新。键盘 Enter/Space 可折叠，`:focus-visible` 用 2px 强调色内描边。箭头展开朝下、折叠旋转 -90°。

### Primary Button

44px 高、10px 圆角、全宽、13px/600。按钮内部分三层：

- `.track`：未完成部分压暗。
- `.fill`：已完成部分用强调色填充，宽度过渡 `0.35s cubic-bezier(.22,.61,.36,1)`。
- `.label` / `.stoplabel`：相对定位的文字层。

运行中默认显示 `学习中 45%`；hover 或 `:focus-visible` 时标签切换为 `停止 45%`。`@media (hover: none)` 下直接显示停止。停止请求期间固定 `正在停止…`，按钮禁用。完成态隐藏整个按钮区，只留“已完成”。

未登录时按钮显示“去登录”，点击进入登录页；进度填充隐藏，不显示一个看似可运行的空壳。

### Progress & Meta

课程名 13px/650；计数行 `小节 1/4，课程 2/3`；当前小节 13px；副行 `第 3 轮，已记录 4 分 30 秒 / 共 10 分钟`。数字和单位之间留空格，时长超过 60 秒自动换成“分 秒”，超过 60 分钟换成“小时 分钟”。

### Log Region

等宽 11px，时间戳用次文字色，正文用主文字色。课程分隔行加粗。空态只显示一行“开始后会显示学习记录”，不占一整块空白。滚动条 8px，拇指暖灰半透明。

## Do's and Don'ts

- **Do** 让按钮同时承担操作和进度，不再单独放一条进度条。
- **Do** 运行中默认显示学习状态，把停止藏在 hover / 键盘聚焦之后；触屏直接显示停止。
- **Do** 用“小节 1/4，课程 2/3”“4 分 30 秒”这种带单位和上下文的写法。
- **Do** 保持暖纸底 + 宿主取色强调 + 平面层级。
- **Do** 折叠后仍显示状态和百分比。
- **Don't** 硬编码固定强调色，或让强调色与宿主页面完全无关。
- **Don't** 叠阴影、毛玻璃、发光、渐变描边，或卡片套卡片。
- **Don't** 用中间点连接信息，或把“令牌”“上报”“轮次”这类技术词直接丢给普通用户。
- **Don't** 用 `title` 当按钮名称，或用颜色变化作为唯一状态提示。
- **Don't** 在未登录时让按钮看起来可运行，或让用户空等 30 秒才看到错误。
