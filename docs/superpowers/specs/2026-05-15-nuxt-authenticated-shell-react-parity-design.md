# Nuxt authenticated 壳与 react-template 全面对齐 — 设计说明

**日期**：2026-05-15  
**状态**：已实现（代码：`layouts/authenticated.vue`、`AppHeader`、`AppMain`、`app.vue`、`Users*`、`DataTableFacetedFilter`、`users/data`）
**修订说明**： supersede `2026-05-15-nuxt-shell-header-parity-design.md` §3 / §4 中「**仅在 SidebarInset 内做唯一滚动容器**」的策略；改为 **authenticated 壳在高度与滚动根上与 react-template 一致**（用户明确要求「整个 authenticated 壳统一对齐 React」）。

---

## 1. 目标

在 `nuxt-template` 内，使 **认证布局（authenticated shell）** 及依赖壳层行为的页面与 `react-template` **同源行为对齐**，并顺带修复 Users 模块上与 React 不一致的细节：

| # | 范围 | 对齐要点 |
|---|------|----------|
| A | **滚动与高度** | 与 react `AuthenticatedLayout` + `SidebarInset` + `Main`/`Header` 组合一致：**内容不足一屏时不出现无意义滚动条**；滚动根（document vs 局部容器）与 react **同一套路**，不因 Nuxt 额外施加 `max-h-svh min-h-svh` + 无条件 inset `overflow-y-auto` 而偏离。 |
| B | **顶栏滚动阈值** | `AppHeader` 的阴影/blur 阈值逻辑绑定 **真实滚动根**（若改为 window/document 滚动，则监听 `window`/`document`，对标 react `header.tsx`）。 |
| C | **路由加载条** | 对标 react `NavigationProgress`（`react-top-loading-bar` + TanStack Router `pending`）：路由切换时出现顶部细进度条（参数：`color`≈muted、`height`≈2px，可有阴影）。实现首选 **`NuxtLoadingIndicator`** + 样式逼近；若验收不达标再收紧为自建 composable。 |
| D | **Users — 筛选勾选** | `DataTableFacetedFilter.vue` 勾选图标与 react `CheckIcon` 同级：**Lucide `Check`**、`h-4 w-4`，外层 `size-4` flex 居中；去掉文本 `✓`。 |
| E | **Users — 新建/编辑表单** | `UsersActionDialog.vue`：表单项 **`grid grid-cols-6`**，标签 **`col-span-2 text-end`**，控件 **`col-span-4`**，`FormMessage` **`col-span-4 col-start-3`**；滚动外壳对齐 react **`h-105`**、`w-[calc(100%+0.75rem)]`、`overflow-y-auto`、`py-1 pe-3`。 |
| F | **本地数据条数** | **仅** `nuxt-template`：`buildInitialUsers` / `INITIAL_USERS` 生成 **`50`** 条；**不改** `react-template`。Seed 保持固定；不要求与「原 500 条的前 50」一致（演示数据）。 |

---

## 2. 非目标

- 不重写 react-template（除文档引用外不改其行为）。
- 不扩展 Profile / Command 真实检索等业务功能。
- **不**由助手执行 `git commit`（仓库规则）。

---

## 3. React 参照行为（实现时必须对齐）

### 3.1 AuthenticatedLayout / SidebarInset

- `SidebarProvider` 外层：`flex min-h-svh w-full`。
- `SidebarInset` **默认**：`relative flex w-full flex-1 flex-col bg-background`，**不**无条件等价于「钉死视口高度」。
- **条件高度**：仅当存在 `[data-layout=fixed]` 后代时，`SidebarInset` 增加 `has-data-[layout=fixed]:h-svh` 及 inset peer 下的 `h-[calc(100svh-…)]`（见 react `authenticated-layout.tsx`）。
- **Users 页**：`Header fixed`（样式）但 **`Main` 未传 `fixed`** → `data-layout` 为 **auto** → **上述 `h-svh` 条件不触发**，整页高度随内容增长，**偏文档滚动**。

### 3.2 Nuxt 当前偏离（待消除）

- `layouts/authenticated.vue` 对 `SidebarInset` 使用 **`max-h-svh min-h-svh`** + 内层 **`overflow-y-auto`**，使认证区 **始终** 为「视口框 + inset 内滚动」，与 react Users **不一致**，且在短内容时易产生多余滚动体感。
- `main.css` 中 **`body { min-h-svh }`** 可能与 inset margin（`md:m-2`）等叠加，推高 **`document`** 可滚动高度；实现时需一并验证。

---

## 4. 推荐实现路径（authenticated 壳）

**方案（已定）**：拆除「无条件 inset 滚动容器」模型，改为 **mirror react**：

1. **SidebarInset class**：对齐 react 默认类；仅在有 **`Main` 等价物声明 fixed layout** 时追加 react 同款条件高度类（需在 Nuxt 侧引入与 `data-layout` 语义一致的标记方式，例如在 `AppMain` 或页面根上输出 `data-layout="fixed"|"auto"`，由 Users/Dashboard 等按 parity 传递）。
2. **滚动容器**：主内容区 **默认不与 react 强加第二层滚动**；若个别路由需要 `overflow-hidden` + 内部滚动（对标 react `Main fixed`），在该路由 subtree 处理，而非 authenticated 全局 wrapper。
3. **`provide(SHELL_INSET_SCROLL_EL)`**：若滚动根迁至 `window`，则改为传递 **`null`** 或可选 **`window` 占位语义**，**AppHeader** 监听逻辑分支：**元素滚动 vs window 滚动**，保证阈值行为一致。
4. **验收**：在 **仪表盘 + Users（少量行）** 下：`document.documentElement` 与 inset（若仍存在）**不应同时**出现无必要的双滚动条；内容不满一屏时 **无明显纵向滚动条**（允许 OS 叠加滚动行为差异，但以 DevTools `scrollHeight vs clientHeight` 为准）。

---

## 5. 路由加载条

- 挂载位置：对标 react `__root` 顶层 → Nuxt 推荐 **`app.vue`**（或 layout 根）挂载 **`NuxtLoadingIndicator`**。
- `nuxt.config` / 组件 props：`color`、`height`、`throttle` 调至接近 react（`var(--muted-foreground)`、`2`）。
- SSR：`ClientOnly` 包裹若可避免 hydration 闪烁则采用（以官方惯例为准）。

---

## 6. Users 细分（壳对齐后的组件级修改）

- **DataTableFacetedFilter**：勾选方块内改用 **Lucide `Check`**，class 对齐 react `faceted-filter.tsx`。
- **UsersActionDialog**：表单网格与滚动容器 class 对齐 react `users-action-dialog.tsx`（文案可保留中文）。

---

## 7. 验证清单

1. **壳**：`/sign-in` 登录后，`/` 与 `/users` 在 **少量数据** 下纵向无多余滚动；长页面（如日后大表格）仅在 **单一滚动根** 上滚动。
2. **顶栏**：滚动超过阈值出现阴影/backdrop（与 react 阈值观感一致）。
3. **路由**：客户端切换路由时出现顶部加载细条。
4. **Users**：筛选勾选垂直居中；新建用户表单为左右网格布局。
5. **数据**：`INITIAL_USERS.length === 50`（仅 Nuxt）。

---

## 8. 自检

- 无 TBD/TODO。
- 与 `2026-05-15-nuxt-shell-header-parity-design.md` 冲突处以 **本文 §3–§4** 为准。
- 范围限定 authenticated 壳 + 所列 Users 组件与数据生成；无额外重构。

---

## 9. 后续

用户书面认可本 spec 后，按仓库流程编写 implementation plan（`writing-plans`），再编码。
