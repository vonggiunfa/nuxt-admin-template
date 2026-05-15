# Nuxt authenticated 壳对标 react-template — Implementation Plan

> **For agentic workers:** 可按 checkbox 逐项执行；**请勿由助手代 `git commit`**（仓库规则）。

**Goal:** 将 `nuxt-template` 认证壳滚动/高度、`AppHeader` 滚动源、`NuxtLoadingIndicator`、Users 筛选勾选、新建用户表单布局及本地用户数对齐 `docs/superpowers/specs/2026-05-15-nuxt-authenticated-shell-react-parity-design.md`。

**Architecture:** 移除 `layouts/authenticated.vue` 内无条件 inset `overflow-y-auto` 滚动层；`SidebarInset` class 对齐 react `authenticated-layout`（含 `has-data-[layout=fixed]:h-svh`）。`AppMain` 输出 `data-layout`；`AppHeader` 在 inset 注入为空时监听 `window` 滚动。`app.vue` 挂载 `NuxtLoadingIndicator`。

**Tech Stack:** Nuxt 4、Tailwind v4、Vue 3、shadcn-vue、lucide-vue-next。

---

### Task 1: authenticated 布局与 SidebarInset

**Files:**
- Modify: `nuxt-template/app/layouts/authenticated.vue`

- [ ] **Step 1:** 删除 `insetScrollEl`、`provide(SHELL_INSET_SCROLL_EL)` 及包裹 `<slot />` 的内层 `overflow-y-auto` div；`<SidebarInset>` 直接包住 `<slot />` + `<CommandMenu />`。
- [ ] **Step 2:** `SidebarInset` 追加 class（与 react `authenticated-layout.tsx` 同源语义）：`@container/content`、`has-data-[layout=fixed]:h-svh`、`peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]`；移除 `max-h-svh`、`min-h-svh`、`overflow-hidden` 及对 slot 的多余 flex 包裹。
- [ ] **验证:** DevTools 在 `/`、`/users` 短内容下 `document.documentElement.scrollHeight` 不大于视口高度（或无明显纵向条）。

---

### Task 2: AppHeader 滚动监听

**Files:**
- Modify: `nuxt-template/app/components/layout/AppHeader.vue`

- [ ] **Step 1:** `inject(SHELL_INSET_SCROLL_EL)` 仍为可选；若 `scrollRoot.value == null`，`useEventListener` 目标为 `window`，`scrollTop` 取自 `document.documentElement` / `document.body`（对标 react `document` scroll）。
- [ ] **验证:** 向下滚动页面时顶栏阴影/backdrop 仍约在 `scrollTop > 10` 时出现。

---

### Task 3: AppMain `data-layout`

**Files:**
- Modify: `nuxt-template/app/components/layout/AppMain.vue`

- [ ] **Step 1:** 增加可选 prop `layout?: 'fixed' | 'auto'`，默认 `'auto'`；根 `<main>` 设置 `:data-layout="layout === 'fixed' ? 'fixed' : 'auto'"`。
- [ ] **Step 2:** 当前仅有仪表盘与用户页时可不传 prop（默认 auto）；日后对标 react `Main fixed` 的页面传入 `layout="fixed"`。
- [ ] **验证:** DOM 中存在 `<main data-layout="auto" id="main-content">`。

---

### Task 4: 路由加载条

**Files:**
- Modify: `nuxt-template/app/app.vue`

- [ ] **Step 1:** 在 `<NuxtLayout>` 之上增加 `<NuxtLoadingIndicator color="var(--muted-foreground)" :height="2" />`（可按需微调 `throttle`）。
- [ ] **验证:** 客户端切换 `/` ↔ `/users` 时出现顶部细进度条。

---

### Task 5: Users 本地数据 50 条

**Files:**
- Modify: `nuxt-template/app/features/users/data/users.ts`

- [ ] **Step 1:** `Array.from({ length: 500 })` 改为 `length: 50`，注释同步。
- [ ] **验证:** 控制台或临时断言 `INITIAL_USERS.length === 50`。

---

### Task 6: FacetedFilter 勾选图标

**Files:**
- Modify: `nuxt-template/app/components/data-table/DataTableFacetedFilter.vue`

- [ ] **Step 1:** `import { Check } from 'lucide-vue-next'`，方块内渲染 `<Check class="h-4 w-4 text-background" />`，删除文本 `✓`。

---

### Task 7: UsersActionDialog 表单网格

**Files:**
- Modify: `nuxt-template/app/features/users/components/UsersActionDialog.vue`

- [ ] **Step 1:** `DialogContent` 对齐 react：`sm:max-w-lg`，表单区外层 `div`：`h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3`。
- [ ] **Step 2:** 每个字段：`FormItem` 使用 `grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0`；`FormLabel` `col-span-2 text-end`；控件 `col-span-4`；`FormMessage` `col-span-4 col-start-3`；`form` `space-y-4 px-0.5`。
- [ ] **Step 3:** `DialogFooter` 挪至滚动区外、与 react 同级结构。
- [ ] **验证:** 新建用户对话框为左右两列表单项排版。

---

### Task 8: 构建与类型检查

**Files:**
- Shell: `cd nuxt-template && pnpm run build`

- [ ] **Step 1:** `pnpm run build` 成功；必要时 `pnpm exec vue-tsc --noEmit`。

---

## Spec 对照自检

| Spec 条目 | Task |
|-----------|------|
| A–B 滚动与顶栏 | 1–3 |
| C 加载条 | 4 |
| D FacetedFilter | 6 |
| E UsersActionDialog | 7 |
| F 50 条数据 | 5 |
