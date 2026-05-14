# Nuxt 主栏顶栏与滚动对齐 react-template — 设计说明

**日期**：2026-05-15  
**状态**：已验收（用户「整体验收 OK」）  
**前置**：`2026-05-14-nuxt-shell-design.md`（壳层总规）；本 spec **收紧** 顶栏、Search、退出确认与滚动行为，对标 `react-template`。

---

## 1. 目标

在 `nuxt-template` 中复刻 `react-template` **右侧主栏**顶部与滚动体感，并采用用户选定策略 **B**：

- 顶栏默认 **吸顶（sticky）**，滚动超过阈值后 **阴影 + 背景半透明 + backdrop 模糊**，与 react `Header` 传 `fixed` 时的行为一致（含类名与阈值逻辑）。
- **伸缩按钮**：与 react 一致 — `SidebarTrigger` 使用 **`outline`**，移动端缩放类对齐。
- **分隔线**：竖向 `Separator` **`h-6`**，**始终渲染**（去掉当前仅 `md:block` 的隐藏策略）。
- **横线**：去掉 `AppHeader` 默认 **`border-b`**（避免相对 react 多一条整宽底边）；若个别页需要底边线，通过可选 prop（对标 react `errors` 路由上的 `className='border-b'`）。
- **Search**：顶栏展示与 react `Search` 同结构的触发条；**⌘K / Ctrl+K** 打开命令面板；首版可为 **无真实数据的静态 Command 菜单**。
- **退出登录**：点击后 **先弹出确认框**，确认后再清会话并跳转（对标 `SignOutDialog` + `ConfirmDialog`）。

---

## 2. 非目标

- 不复刻 react 全量 `ProfileDropdown` 菜单项（Profile / Billing / Settings 等多项），除非后续单独开 spec；**Sign out 确认**必须本次落地。
- Command 菜单内不接后端、不做全应用检索；静态占位即可。
- **不**代用户执行 `git commit`（仓库协作规则）。

---

## 3. 推荐实现路径（已定案）

采用 **方案 1：单一滚动容器**（`SidebarInset` 内 `flex-1 min-h-0 overflow-y-auto` 包裹 **Header + Main**）：

- **优点**：与现有 `min-h-svh` / `max-h-svh`、侧栏并列布局兼容，避免 `document` 与壳层双滚动条。
- **与 react 差异**：react `header.tsx` 监听 **`document`** 滚动；Nuxt 监听 **该滚动容器** 的 `scrollTop`。**观感与阈值一致即视为通过**，在实现计划中注明。

---

## 4. 架构与结构

### 4.1 布局 (`authenticated.vue`)

- `SidebarInset` 保持列 flex、高度约束（与现有 `@container/content`、`min-h-svh` / `max-h-svh` 一致，具体 class 以实现阶段与现有文件对齐为准）。
- **在 `<slot />` 外包一层滚动容器**：`flex min-h-0 flex-1 flex-col overflow-y-auto`（可加 `ref` 供顶栏或 composable 订阅 scroll）。
- 页面根组件 **不再** 使用拦截滚动的 `overflow-hidden` 包裹整块「Header + Main」（与当前 `index.vue` 对比调整），保证 **唯一纵向滚动条** 落在上述容器内。

### 4.2 顶栏 (`AppHeader` 或等价拆分)

对标 `react-template/src/components/layout/header.tsx`：

- 外层 `<header>`：`z-50 h-16`；**默认启用** `fixed` 语义（`sticky top-0 w-[inherit]`、`header-fixed peer/header` 等与 react 一致的 class）。
- 使用 **滚动偏移**（如 `scrollTop > 10`）：切换 `shadow` / `shadow-none`；内层在超过阈值时加 `after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg`（与 react 一致）。
- 内层容器：`relative flex h-full items-center gap-3 p-4 sm:gap-4`。
- 子节点顺序：**`SidebarTrigger`（outline）→ `Separator`（vertical, h-6）→ 槽位内容**（中间导航 + Search + `ThemeSwitch` + … + 用户区）。

### 4.3 中间区槽位（对标 Dashboard）

- **TopNav**：链接数量 **0～1** 仍可保留「仪表盘」及 `me-auto`，避免顶栏右侧挤作一团。
- **Search**：`Search` 组件紧接在 TopNav 区域之后，类名与 react `search.tsx` 对齐（`outline`、`h-8`、宽度断点、`⌘K` 提示等）。
- **ThemeSwitch**：保留。
- **ConfigDrawer**：react 有而 Nuxt 若无，**不在本 spec 强制**；若在实现计划中引入成本过高，可注明「后续 PR」，但不得影响 Search / 退出 / 滚动三项验收。

---

## 5. Search 与快捷键

- **`SearchProvider`**（或等价）：状态 `open` / `setOpen`；`onMounted` 注册全局 `keydown`：`k` + meta/control 时 `preventDefault` 并切换打开（与 `react-template/src/context/search-provider.tsx` 行为一致）。
- **`CommandMenu`**：以 Dialog + Command（reka-ui / shadcn-vue）呈现；首版 **静态** `CommandGroup` / `CommandItem` 即可。
- 在 **已登录布局**根上挂载 Provider，保证顶栏 `Search` 与 `CommandMenu` 同上下文。

---

## 6. 退出登录

- 引入 **`SignOutDialog`**（或通用 `ConfirmDialog` + 封装）：标题/描述/确认 copy **中文**；**destructive** 确认按钮。
- 流程：下拉项「退出登录」→ `setOpen(true)` → 用户确认 → `useAuthSession().logout()` → `navigateTo('/sign-in')`；可选：query `redirect` 与当前路径对齐 react `sign-out-dialog.tsx`（若 sign-in 页已支持则接上，否则实现计划注明预留）。
- 取消或关闭：不执行登出。

---

## 7. 可访问性

- Search 按钮：`aria-keyshortcuts` 与屏幕阅读说明与 react 对齐思路。
- 确认框：标题与描述可被读屏识别；焦点管理交给 Dialog  primitive。

---

## 8. 验收标准（完成即通过）

1. **顶栏**：侧栏触发器为 **outline**；竖分隔 **始终可见**（`h-6`）；默认 **无** 顶栏 `border-b`。
2. **Search**：视觉上与 react 搜索条一致；**⌘K / Ctrl+K** 能打开命令面板（内容可为占位）。
3. **退出**：必须经过 **确认框** 才能完成登出。
4. **滚动**：壳层内 **仅一个**纵向滚动条；内容下滚超过阈值时，顶栏出现 **阴影 + 背景模糊**（与 react `Header fixed` 一致）。
5. 与 react **固定主栏页**对比，交互节奏一致；允许 scroll 监听附着 DOM 与 react 不同（见第 3 节）。

---

## 9. 后续步骤

- 按仓库流程使用 **writing-plans** 生成实现计划（任务分解：布局滚动、`AppHeader`、SidebarTrigger、`SearchProvider` + `Search` + `CommandMenu`、确认 Dialog、`index.vue` 结构调整等）。
- 用户自行 `git add` / `git commit` 本 spec（代理不代提交）。
