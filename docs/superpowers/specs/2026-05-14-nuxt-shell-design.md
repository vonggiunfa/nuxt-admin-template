# Nuxt 复刻 react-template 后台壳与首页 — 设计说明

**日期**：2026-05-14  
**状态**：已确认（用户「全部 OK」）  
**范围**：`nuxt-template`（Nuxt）实现；视觉与页面结构对标仓库内 `react-template`（Vite + React）；仅保留首页（Dashboard 骨架）+ 登录/注册占位 UI；不接后端。

---

## 1. 目标

- 在 **Nuxt** 中复刻 `react-template` 的 **排版、间距、主题 token、后台壳层（侧栏 + 顶栏 + 主内容区）** 与 **Dashboard 首页区块结构**。
- **业务全删**：无多路由业务、无真实数据表/API、无 Clerk 等第三方鉴权。
- **鉴权**：仅 **Sign in / Sign up** 静态表单 + 本地标记 + 跳转（不接后端）。

---

## 2. 关键决策（已确认）

| 项 | 决策 |
|----|------|
| 目标栈 | **A**：`nuxt-template`（Nuxt） |
| 壳层 | **1**：完整后台壳（Sidebar + Header + Main），主内容区为 Dashboard 式骨架 |
| 鉴权 | **C**：仅登录/注册 UI + 静态提交后跳转 |
| 注册页 | **B**：Sign in + Sign up 两页均保留（占位） |
| 默认入口 | **A**：首次打开未登录 → `/sign-in`；静态登录成功后进入带壳首页 `/` |

---

## 3. 技术方案（推荐）

**推荐方案**：Nuxt + **Tailwind CSS（与 react-template 对齐 v4 / token 思路）** + **shadcn-vue（或同类 Radix 风格 Vue 组件）**。

- **优点**：Card、Tabs、Sidebar 等交互与 DOM 层级最容易对齐 `react-template`；后续扩展真实业务清晰。
- **未选**：以 Nuxt UI 为主（易出现组件形态差异，需大量 CSS 覆盖）；纯自写组件（工作量最大）。

---

## 4. 路由与页面

| 路径 | 布局 | 说明 |
|------|------|------|
| `/sign-in` | 无侧栏（全屏 auth 版式对标模板） | 静态表单 → 写本地鉴权标记 → `navigateTo('/')` |
| `/sign-up` | 同上 | 静态表单；与登录页互链 |
| `/` | **Authenticated 布局**（Sidebar + Inset + Header + Main） | Dashboard 骨架页（唯一业务主页） |

**重定向与中间件（逻辑要求）**：

- 无鉴权标记：允许 `/sign-in`、`/sign-up`；访问 `/` **重定向至** `/sign-in`。
- 有鉴权标记：访问 `/sign-in`、`/sign-up` **可重定向至** `/`（避免重复进入登录态）。
- **Sign out**：清除标记并跳转 `/sign-in`。

**实现注意**：本地标记可用 `localStorage` 或 `useCookie`。若用 cookie，需明确 **SSR 与中间件读取时机**（建议与 Nuxt 文档推荐的 `middleware` + cookie 组合一致，避免 hydration 不一致）。

---

## 5. UI 对标策略

### 5.1 主题与设计 token

- 自 `react-template` 的 `src/styles/theme.css`、`src/styles/index.css` **迁移 CSS 变量**（含 light/dark、`muted`、`border`、`radius` 等）至 Nuxt 全局样式入口。
- **ThemeSwitch**、若模板中存在 **ConfigDrawer（布局/方向等）**：以实现成本为准——优先保证 **主题切换**；配置抽屉可对照模板 **逐段落地**，无法在首版对齐时可降级为占位，但须在实现计划中注明。

### 5.2 壳层结构（概念对齐 `AuthenticatedLayout`）

对齐 `react-template` 中 `SearchProvider` / `LayoutProvider` / `SidebarProvider` / `AppSidebar` / `SidebarInset` / 主区 `Outlet` 的职责拆分（在 Vue 中可用 composable + 组件树等价实现）：

- **侧栏**：仅 **「Dashboard / 首页」单导航项** + 底部用户区（下拉占位，含 Sign out）。
- **顶栏 Header**：保留与模板一致的 **左右节奏**（如 ThemeSwitch、配置入口、用户区）。**TopNav**：链接收束为 **0–1 条**，避免空洞占用；若去掉 TopNav，需仍保持 Header 视觉平衡（实现阶段定稿）。
- **Search**：可选——**保留搜索框 UI 空壳**或首版移除；须在实现时二选一并写入 PLAN。
- **SkipToMain**：优先保留以满足可访问性与模板一致性（若排期紧可记录为后续项）。

### 5.3 首页主内容（Dashboard 骨架）

对标 `react-template` 的 `features/dashboard` 结构：

- 标题行（如 `Dashboard` + 主 CTA 按钮占位）。
- **Tabs**：`Overview` / `Analytics` 可用；`Reports` / `Notifications` **disabled**（与模板一致）。
- **指标区**：响应式栅格 Card（数量与断点对标模板，文案可为静态）。
- **下方两列**：图表区域 **占位**（静态灰块、简化图或 Vue 侧图表库另选）；**Recent sales / activity** 区 **占位列表**。
- 图表库 **不强制** 与 React 版相同；以视觉与布局对齐为准。

---

## 6. 明确不在范围

- 真实后端、Clerk、会话刷新、权限模型。
- 除 `/`、`/sign-in`、`/sign-up` 外的业务路由。
- 真实表格、Command palette 数据、全局搜索数据。

---

## 7. 验证标准（完成即通过）

1. 开发启动后：无鉴权标记时打开 `/` → **必须**跳转 `/sign-in`。
2. 静态登录/注册提交后 → 进入 `/`，可见 **完整后台壳 + Dashboard 骨架**。
3. Sign out → 标记清除 → `/sign-in`。
4. Light/Dark 切换后，壳与首页关键区块 **与 react-template 观感无明显跳变**（允许组件库 DOM 差异）。

---

## 8. 后续步骤

- 用户审阅本文档定稿后，使用 **writing-plans** 产出实现计划（任务拆分、依赖安装、文件结构、middleware 与样式入口顺序等）。
- 本文档 **不代用户执行 git commit**；由用户本地 `git add` / `git commit` 自行保存。

---

## 9. 自检记录（spec self-review）

- **占位扫描**：无 TBD/TODO。
- **一致性**：路由、鉴权桩、壳层与首页骨架与上文决策一致。
- **范围**：单实现计划可覆盖；过大模块已排除。
- **歧义**：Search 与 ConfigDrawer 首版粒度在 §5.1 / §5.2 已标明「实现计划定稿」或降级说明，避免双解。
