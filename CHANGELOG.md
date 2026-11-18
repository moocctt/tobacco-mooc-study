# 更新日志

> 本文件由 `scripts/changelog.js` 从 git 提交历史自动生成，请勿手工编辑。
> 版本号取自 userscript 的 `@version`：脚本靠它触发脚本站更新，所以升版之后的改动归入「未发布」。

## 0.0.20 — 2026-11-19

### 修复

- 核验服务端学时，未入账停止空转 (#30) ([c2db443](https://github.com/moocctt/tobacco-mooc-study/commit/c2db4435c3fce6497941cf00a9288b451d175084))

## 0.0.19 — 2026-11-18

### 修复

- 快刷剩余时长停滞不再观察阻塞 (#29) ([7e9d7cb](https://github.com/moocctt/tobacco-mooc-study/commit/7e9d7cbc718a6c35db4d27a05466779836f96ffb))

## 0.0.18 — 2026-11-18

### 修复

- 快刷停滞不再停，无人值守停止同步暂停播放 (#28) ([6f48405](https://github.com/moocctt/tobacco-mooc-study/commit/6f48405366deb46a08e427e9e572f5d9e583a23c))

## 0.0.17 — 2026-11-18

### 新功能

- **ui**: 折叠面板仍显示状态与进度 (#27) ([7d0daa1](https://github.com/moocctt/tobacco-mooc-study/commit/7d0daa15f02fd4dcef1ff66acdd890a0f9951394))

## 0.0.16 — 2026-11-18

### 新功能

- **ui**: 运行时按钮悬停显示停止 (#26) ([ee4fb40](https://github.com/moocctt/tobacco-mooc-study/commit/ee4fb4093a757e8cac37fc14a46ed4d98c0b2c77))

## 0.0.15 — 2026-11-18

### 新功能

- **ui**: 快刷脚本不显示剩余时间 (#25) ([7fc8867](https://github.com/moocctt/tobacco-mooc-study/commit/7fc886713bc2588e21acd0fbe2c1c86526d39a1c))

## 0.0.14 — 2026-11-18

### 修复

- **ui**: 快速模式首轮也显示 ETA (#24) ([0e10b14](https://github.com/moocctt/tobacco-mooc-study/commit/0e10b145293d5fc5963690836ca143323602b87a))

## 0.0.13 — 2026-11-18

### 新功能

- **ui**: 剩余时间加上生活化参照 (#23) ([e5a510a](https://github.com/moocctt/tobacco-mooc-study/commit/e5a510ad31aedd014fd411bbc4780dc1c583fbb9))

## 0.0.12 — 2026-11-18

### 修复

- **auth**: review-loop 修复与鉴权回归测试 (#22) ([97539b4](https://github.com/moocctt/tobacco-mooc-study/commit/97539b449d8fdc169233622575cf16532b2db635))

## 0.0.11 — 2026-11-18

### 重构

- **auth**: 移除账密保存与自动重登，只用页面登录态 (#21) ([81866dd](https://github.com/moocctt/tobacco-mooc-study/commit/81866dd5c5163ca08503c65b6a45ba9b1e664193))

## 0.0.10 — 2026-11-18

### 杂务

- **panel**: 移除面板深色主题 (#20) ([e9b8ea0](https://github.com/moocctt/tobacco-mooc-study/commit/e9b8ea09fcf0cdac4cbe9d3861fe0e6b8937ba78))

## 0.0.9 — 2026-11-18

### 修复

- **unattended**: 从课程详情页启动时不再跳过播放页，播到底后等平台结算 (#19) ([e612371](https://github.com/moocctt/tobacco-mooc-study/commit/e61237156005c1117a7c02358f91bab88ad39c53))

## 0.0.8 — 2026-11-18

### 修复

- **unattended**: 副行进度跟随播放器而不是平台记录位置 (#18) ([2b752ff](https://github.com/moocctt/tobacco-mooc-study/commit/2b752ff5a98f84611de2b68cc638bb96356e43f1))

## 0.0.7 — 2026-11-17

### 修复

- **unattended**: 副行改「已播」并按 1:1 剩余时间显示 ETA (#17) ([ce8bd0e](https://github.com/moocctt/tobacco-mooc-study/commit/ce8bd0ece62e01049d67c9579dce51a080de0844))

## 0.0.6 — 2026-11-17

### 新功能

- **unattended**: 只驱动页面真实播放，不代报任何进度 (#16) ([3bf4e1a](https://github.com/moocctt/tobacco-mooc-study/commit/3bf4e1a84d7b8a55fec903f60d7123c66f4a4f62))

## 0.0.5 — 2026-11-16

### 新功能

- **ci**: 用 GitHub Actions 自动生成 CHANGELOG (#14) ([c12043a](https://github.com/moocctt/tobacco-mooc-study/commit/c12043a4bf37096dd3b42f9cf9671932310734b2))

### 修复

- **ci**: 修 changelog 的两处误判 (#15) ([34634be](https://github.com/moocctt/tobacco-mooc-study/commit/34634bed1f3a4bc3c8aa13cdab1382aeafd99a29))
- 修幽灵锁误报与停止按钮文案滞后 (#13) ([0ae6287](https://github.com/moocctt/tobacco-mooc-study/commit/0ae62871f60ff490e81d9c7f1580d4068a814bc9))

### 样式

- **panel**: 精修面板视觉与信息层级 (#6) ([91b780d](https://github.com/moocctt/tobacco-mooc-study/commit/91b780d46d0d08e8e6610cc177de355f5f0d8c0a))

## 0.0.4 — 2026-11-16

### 其他

- 面板改版：去掉进度条，按钮底色直接表示总进度 (#5) ([c56a1f3](https://github.com/moocctt/tobacco-mooc-study/commit/c56a1f3af38fbeb1c4d5ef4462966ce1935ba97d))

## 0.0.1 — 2026-11-14

### 新功能

- **panel**: 面板改为「进度区 / 按钮 / 日志区」三段布局 (#3) ([4be071a](https://github.com/moocctt/tobacco-mooc-study/commit/4be071a737c9288fff87dffcdde03085ae1e931f))

### 其他

- Initial commit ([65f0b3a](https://github.com/moocctt/tobacco-mooc-study/commit/65f0b3a54b0a5da00aea18a327d9ac78506fdb7a))
