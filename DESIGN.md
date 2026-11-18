---
name: 烟草网络学院 · 学习助手
description: 复用宿主顶栏色的紧凑型刷课面板视觉系统
colors:
  panel-bg: "rgba(255,255,255,.92)"
  panel-fg: "#1f2328"
  panel-dim: "#59636e"
  panel-line: "#e6eaef"
  log-bg: "rgba(246,248,250,.72)"
  focus-blue: "#0969da"
  accent-fallback: "#57606a"
  on-accent: "#fff"
  progress-track: "rgba(0,0,0,.26)"
  scroll-thumb: "rgba(130,130,130,.32)"
  scroll-thumb-hover: "rgba(130,130,130,.5)"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    lineHeight: 1.5
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
    lineHeight: 1.5
  status:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "11.5px"
    lineHeight: 1.5
  button:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: ".01em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
    fontSize: "11px"
    lineHeight: 1.6
  head-pct:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
rounded:
  panel: "10px"
  control: "7px"
  scrollbar: "4px"
spacing:
  tight: "3px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
components:
  panel-card:
    backgroundColor: "{colors.panel-bg}"
    textColor: "{colors.panel-fg}"
    rounded: "{rounded.panel}"
    padding: "10px"
  button-primary:
    backgroundColor: "{colors.accent-fallback}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "30px"
  log-region:
    backgroundColor: "{colors.log-bg}"
    textColor: "{colors.panel-fg}"
    typography: "{typography.mono}"
    padding: "6px 10px 8px"
---

# Design System: 烟草网络学院 · 学习助手

## Overview

**Creative North Star: "学习助手"**

这不是一个要被欣赏的界面，而是一个贴在浏览器角落、随时交接状态与下一步动作的小工具。它借用宿主页面的顶栏色作为强调色，自己不发明品牌色；信息密度紧凑，读数比装饰优先，日志比氛围重要。用户扫一眼就知道「跑到哪、还要不要点停止」。

整体气质是克制、可信、即时反馈。面板始终待在右下角，可拖拽、可折叠；展开时自上而下是进度区、启动/停止按钮、滚动日志三块。按钮本身就是进度条，不再单独开一行控件；运行态默认显示进度，只有鼠标悬停或键盘聚焦才露出停止动作——工具不催你，但随时让你能刹车。折叠后只留标题栏，但状态与百分比仍钉在右侧，不必展开就知道跑到哪。

明确的视觉反参考：不要营销感渐变，不要大圆角卡片堆叠，不要额外 emoji 装饰。标题里的 ⚡/▶ 是产品标识，保留。

**Key Characteristics:**
- 强调色从宿主页面借来，面板本体保持中性半透明白。
- 按钮即仪表：已完成比例从左往右填亮，文字同步给出状态与百分比。
- 紧凑、等宽、带时间戳的日志区承担全部过程解释。
- 只有一层柔和投影；深度来自半透明与毛玻璃，不来自多重描边。

## Colors

整套色彩围绕「借来的权威色」展开：工具不竞争站点的视觉主权，只借用站点顶栏的颜色来标记自己的可操作部分。中性色负责承载信息，唯一的固定强调是键盘焦点蓝。

### Primary
- **环境同频色（fallback #57606a）**：标题栏与按钮的底色。运行时读取宿主页面顶栏背景覆盖 `accent-fallback`，并按亮度把前景切成 `#fff` 或 `#1f2328`，因此始终与所在页面同频。
- **焦点蓝（#0969da）**：只用于 `:focus-visible` 的 2px 外圈与文本选中底色；不是装饰色。

### Neutral
- **面板白（rgba(255,255,255,.92)）**：面板底色，半透明但不过度透出页面内容。
- **正文墨（#1f2328）**：课程名、状态行与日志正文。
- **次要灰（#59636e）**：元信息、时间戳与副行。
- **分隔线（#e6eaef）**：面板边框与日志区上边线。
- **日志底（rgba(246,248,250,.72)）**：按钮下方的滚动日志区。
- **进度槽（rgba(0,0,0,.26)）**：按钮内未完成部分的压暗底色。

**The Borrowed Signal Rule.** 强调色只从宿主页面顶栏借来；工具自己不发明品牌色。焦点蓝是唯一例外，且只给键盘焦点。

## Typography

**Body Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif`
**Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace`

**Character:** 系统 UI 字体保证中文与数字在任何浏览器里都像“本地控件”；等宽字体只给日志与折叠态百分比，让状态读起来像终端读数而不是营销文案。

### Hierarchy
- **Title**（600, 12px, 1.4）：课程名，最多两行_clamp，允许长标题截断。
- **Body**（400, 12px, 1.5）：面板基线与按钮文字。
- **Status**（400, 11.5px, 1.5）：当前小节状态行，透明度 .8 压低一级。
- **Label**（400, 11px, 1.5）：`小节 x/y`、时间戳、副行；数字启用 `tabular-nums`。
- **Button**（600, 12px/1, letter-spacing .01em）：启动/停止按钮，居中单行。
- **Mono Log**（400, 11px, 1.6）：日志正文；折叠态百分比用 600/11px/1 的等宽字，状态用 11px 系统字。

**The Tabular Rule.** 所有会跳动的数字都用 `tabular-nums`，避免进度刷新时文字左右抖动。

## Layout

面板是固定用途的覆盖层，不是响应式栅格页面；没有断点，只有一个不随窗口尺寸变化的紧凑卡片。标题栏 `padding: 7px 10px`，进度区 `9px 10px 8px`，按钮外框 `0 10px 9px`，日志区 `6px 10px 8px`；标题栏内部 `gap: 8px`，标题右侧 `gap: 7px`。日志区固定 `height: 180px`，滚动保留最近 60 行。折叠后只留标题栏，右侧显示简短状态与百分比。

间距尺度取 `3px / 4px / 6px / 8px / 10px` 五档：3px 给副行与标题的微调，4px 给元信息上边距，6px 给状态行上边距与日志行间距，8px 给标题栏间距，10px 是全局水平内边距。

## Elevation & Depth

只有一层柔和投影配合毛玻璃；不用多重阴影、不用内阴影、不用描边堆叠来制造层次。

### Shadow Vocabulary
- **panel-float**（`box-shadow: 0 10px 30px -8px rgba(0,0,0,.32), 0 2px 8px rgba(0,0,0,.06)`）：面板整体离页一层；第一层负责悬浮感，第二层负责近距离接触阴影。
- **glass**（`backdrop-filter: blur(10px) saturate(1.15)`）：半透明白底后的页面内容柔化，不额外加深颜色。

**The One-Layer Rule.** 面板只有一层投影；更深的层级用半透明和毛玻璃表达，不用再叠一层阴影。

## Shapes

面板是 `10px` 圆角的矩形卡片，按钮是 `7px` 圆角的全宽胶囊，滚动条拇指是 `4px` 圆角。边框只有 `1px solid var(--p-line)` 一道，不做双线或渐变描边。折叠箭头是唯一几何符号：展开向下、折叠旋转 -90°，用 `transform .18s ease` 过渡。

## Components

### Buttons
- **Shape:** 全宽、30px 高、7px 圆角、无边框（`padding: 0 10px`）。
- **Primary:** 背景取环境同频色，文字取 `on-accent`；600/12px 系统字体。
- **Hover / Focus / Active:** hover `filter: brightness(1.07)`，active `brightness(.96)`，`:focus-visible` 用 2px `#0969da` 外圈并偏移 2px；不用颜色变化当唯一状态提示。
- **Running:** 按钮内嵌 `.track`（未完成压暗）和 `.fill`（已完成按环境同频色从左往右填充，`width .35s cubic-bezier(.22,.61,.36,1)`）；默认文案 `进行中 45%`，悬停/聚焦切换 `⏸ 停止 45%`。`@media (hover:none)` 下直接显示停止。停止中固定 `⏸ 停止中…`，完成态 `✓ 已完成 100%`。

### Header
- **Shape:** 7px/10px 内边距的一行 flex，右侧为状态 + 百分比 + 折叠箭头。
- **Color:** 环境同频色底、`on-accent` 字；状态用 11px 系统字并降到 .85 透明度，百分比用等宽 600/11px 同透明度。
- **Behavior:** 整条可点折叠；箭头默认 .75 透明度，hover 升到 1；折叠时旋转 -90°并露出状态。状态取 `▶ 播放中` / `⏸ 停止中` / `✓ 已完成` / `■ 已暂停` / `■ 已停止`，与百分比同显；展开时状态节点隐藏。

### Progress & Meta Lines
- **Course:** 600/12px、1.4 行高、最多两行截断。
- **Meta / Sub:** 11px 次要灰、`tabular-nums`、单行省略。
- **Status:** 11.5px 正文色、透明度 .8、单行省略。

### Log Region
- **Shape:** 上边线 `1px solid #e6eaef`，固定 180px 高，内部 `padding: 6px 10px 8px`。
- **Color:** `rgba(246,248,250,.72)` 底、等宽 11px/1.6；时间戳用次要灰本体，不再额外压暗，课程分隔行 600。
- **Scrollbar:** 8px 宽，拇指 `rgba(130,130,130,.32)` / hover `.5`，4px 圆角，轨道透明。

## Do's and Don'ts

### Do:
- **Do** 从宿主页面顶栏取强调色，并按亮度切黑/白字。
- **Do** 让按钮自己承担进度反馈，文字同时给状态与百分比。
- **Do** 在悬停/键盘聚焦时才把运行态按钮切成停止，触屏无 hover 时直接显示停止。
- **Do** 折叠后仍在标题栏给出状态与百分比。
- **Do** 用 `tabular-nums` 固定所有跳动的数字宽度。
- **Do** 保持一层投影 + 毛玻璃的轻悬浮感。

### Don't:
- **Don't** 发明固定品牌色覆盖宿主页面，或用渐变做营销感强调。
- **Don't** 为进度再开一行独立进度条。
- **Don't** 用 `title` 当按钮名称，或用颜色变化作为唯一状态提示。
- **Don't** 叠多重阴影、内阴影或大圆角卡片来制造层次。
- **Don't** 在标题之外再加 emoji 装饰。
