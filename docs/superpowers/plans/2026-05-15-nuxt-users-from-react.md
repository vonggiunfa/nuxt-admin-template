# Nuxt Users（对标 react-template）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking。

**Goal:** 在 `nuxt-template` 新增 `/users` 页，以对齐意图复刻 `react-template` authenticated Users 列表（无 Invite）、本地 faker 数据集 + 会话内可变 ref、URL query 驱动表格分页与筛选。

**Architecture:** `@tanstack/vue-table` + 组合式封装 URL 同步；`app/features/users` 模块化 schema/data/对话框/表格；`app/components/data-table` 对齐 React data-table primitive；vee-validate + zod 复用项目表单范式；toast 沿用 `vue-sonner`。受 **选型 A**：刷新后丢弃全部会话改动。

**Tech Stack:** Nuxt 4、Vue 3、TypeScript、`@tanstack/vue-table`、`@faker-js/faker`、reka-ui / shadcn-vue、vee-validate、zod、`vue-router`/`navigateTo`。

**参考源码（只读对照，勿在未理解前整文件粘贴）：**

- `react-template/src/features/users/**`
- `react-template/src/hooks/use-table-url-state.ts`
- `react-template/src/components/data-table/**`

---

## 涉及文件图谱（预览）

**新建**

- `app/features/users/schema.ts`
- `app/features/users/data/data.ts`
- `app/features/users/data/users.ts`
- `app/features/users/composables/useUsersDialogs.ts`（provide/inject 或等价）
- `app/features/users/composables/useTableUrlState.ts`
- `app/features/users/components/UsersTable.vue`（或拆分）
- `app/features/users/components/UsersPrimaryButtons.vue`
- `app/features/users/components/UsersDialogs.vue` + Action / SingleDelete / MultiDelete 子对话框
- `app/features/users/components/UsersDataTableBulkActions.vue`（**不含** Invite / Mail 图标）
- `app/features/users/components/usersColumns.ts`（`createColumnHelper` 列工厂，或对等写法）
- `app/pages/users/index.vue`
- `app/components/data-table/*`（对齐 React：`toolbar`、`pagination`、`faceted-filter`、`view-options`、`column-header`、`bulk-actions` 等按需引入 Vue 版）
- `app/components/ui/table/*`、`checkbox`、`badge`、`popover`、`select`…（CLI 补齐后生成）
- `utils/usersTableSearch.ts`（纯函数：route.query ↔ 分页/筛选 patch）
- `tests/usersTableSearch.spec.ts`

**修改**

- `nuxt-template/package.json` — 新增依赖（由 `pnpm add` 写入）
- `utils/authRedirect.ts` — 未登录访问 `/users` 时跳转 `/sign-in`（与 `/` 行为一致）

---

### Task 1: 依赖

**Files:**

- Modify: `nuxt-template/package.json`

- [ ] **Step 1: 安装依赖**

Run（在 `nuxt-template/` 目录）:

```bash
pnpm add @tanstack/vue-table @faker-js/faker
```

- [ ] **Step 2: 校验 lockfile**

```bash
pnpm install
pnpm exec nuxt prepare
```

Expected：`nuxt prepare` 无报错。

- [ ] **Step 3: 用户自行提交**（如需）

不进行代理 commit。

---

### Task 2: shadcn-vue 原子组件补齐

**Files:**

- Create: `app/components/ui/table/*.vue`、`checkbox`、`badge`、`popover`、`select`、`dropdown-menu`（若缺的）、`label`、`alert`、`separator`（若缺的）等——以 **`pnpm dlx shadcn-vue@latest add <name>`** 为准，逐项对照 `react-template/src/components/ui` 与 `@/components/data-table/*` import 的实际依赖）

- [ ] **Step 1: 对照 React data-table bundle 罗列缺失 UI**

grep `react-template/src/components/data-table`、`users-columns.tsx`、`users-invite-dialog`（排除）用到的 `@/components/ui/*`，在 Nuxt 中缺失的一律通过 **shadcn-vue CLI**（`components.json` 已在仓库）补齐。

- [ ] **Step 2: CLI 分批执行**

示例（按需增删，`cd nuxt-template`）:

```bash
pnpm dlx shadcn-vue@latest add table
pnpm dlx shadcn-vue@latest add checkbox
pnpm dlx shadcn-vue@latest add badge
pnpm dlx shadcn-vue@latest add popover
pnpm dlx shadcn-vue@latest add select
```

Expected：`app/components/ui/...` 出现对应 Vue 封装且 `pnpm run build`（或最晚 Task 末尾）能通过。

---

### Task 3: 纯函数 + Vitest（TDD）

**Files:**

- Create: `utils/usersTableSearch.ts`
- Create: `tests/usersTableSearch.spec.ts`

导出以下函数（名称可微调但须稳定被 `useTableUrlState` / 页面 consume）：

```ts
// utils/usersTableSearch.ts
/** 规范化 vue-router LocationQuery[string] → string[] */
export function normalizeToStringArray(raw: unknown): string[] {}

/** route.query → 与 React validateSearch 同字段的解构对象（page 默认为 1 等） */
export function parseUsersRouteQuery(query: Record<string, unknown>): {
  page: number
  pageSize: number
  username: string
  status: string[]
  role: string[]
} {}

/** 将分页/筛选 patch 合并进当前序列化前的 query map（扁平 string | string[]） */
export function mergeUsersTableQueryPatch(
  currentQuery: Record<string, unknown>,
  patch: Partial<Record<string, string | string[] | undefined>>
): Record<string, string | string[] | undefined> {}
```

- [ ] **Step 1: 写出失败测试**（填入具体断言，`tests/usersTableSearch.spec.ts`）

```ts
import { describe, expect, it } from 'vitest'
import {
  mergeUsersTableQueryPatch,
  normalizeToStringArray,
  parseUsersRouteQuery,
} from '../utils/usersTableSearch'

describe('normalizeToStringArray', () => {
  it('单 string', () => {
    expect(normalizeToStringArray('a')).toEqual(['a'])
  })
  it('string[] 原样拷贝', () => {
    expect(normalizeToStringArray(['x', 'y'])).toEqual(['x', 'y'])
  })
})

describe('parseUsersRouteQuery', () => {
  it('默认值', () => {
    expect(parseUsersRouteQuery({})).toMatchObject({
      page: 1,
      pageSize: 10,
      username: '',
      status: [],
      role: [],
    })
  })
})
```

按需补充：`page`、`pageSize` 从字符串解析、`status`/`role` 为多值 query。

- [ ] **Step 2: 运行失败**

Run: `pnpm exec vitest run tests/usersTableSearch.spec.ts -v`

Expected: FAIL — 导出未实现。

- [ ] **Step 3: 最小实现**

在 `utils/usersTableSearch.ts` 写满 `normalizeToStringArray`、`parseUsersRouteQuery`、`mergeUsersTableQueryPatch`，合并结果须与 `navigateTo({ query })` 可接受的格式一致（推荐 **重复的 query key**：`status=active&role=admin`）。

- [ ] **Step 4: 测试通过**

Run: `pnpm exec vitest run tests/usersTableSearch.spec.ts -v`

Expected: PASS

---

### Task 4: `useTableUrlState` 组合函数

**Files:**

- Create: `app/features/users/composables/useTableUrlState.ts`

实现与 `react-template/src/hooks/use-table-url-state.ts` **同行为**的子集：**仅**分页 + `columnFilters`（本项目 `globalFilter.enabled: false`，与 react users-table 对齐）。使用 `watch`/`computed`：

- **读：**`parseUsersRouteQuery(route.query)` → `PaginationState`、`ColumnFiltersState` 初始推导。
- **写：** `onPaginationChange`、`onColumnFiltersChange` → `navigateTo({ query: merged, replace })`，并在列筛选变动时清空 `page`（与 react L184-189）。
- **`ensurePageInRange(pageCount)`**：页码越界时用 `replace: true` 修正（等价 react L193-207）。

导出类型与 vue-table `@tanstack/vue-table` 兼容。

无需在此 Task 附带 Vitest（依赖 mock router）；以页面手工验证 + Task 3 纯函数兜底。

---

### Task 5: Data-table 共用组件（Vue）

**Files:**

- Create: `app/components/data-table/` 下列组件（结构与 React 对等，按需改名适配 Vue：`FlexRender`、`useVueTable` props）

对齐文件：

| React | Vue 职责 |
|--------|----------|
| `pagination.tsx` | `DataTablePagination.vue` |
| `toolbar.tsx` | `DataTableToolbar.vue`，Reset 图标改 `lucide-vue-next` `X` |
| `faceted-filter.tsx` | `DataTableFacetedFilter.vue` |
| `view-options.tsx` | `DataTableViewOptions.vue` |
| `column-header.tsx` | `DataTableColumnHeader.vue` |
| `bulk-actions.tsx` | `DataTableBulkActions.vue`（slot 批量按钮——users 专有按钮放外层）|

- [ ] **Step:** 逐项移植 UI class 名称与布局，文案改中文（例如 Reset →「重置筛选」占位可保留英文若设计系统要求——以 design-system.mdc 为准）。

---

### Task 6: Users 模型与常量

**Files:**

- Create: `app/features/users/schema.ts` — Zod schema 等价 `react-template/src/features/users/data/schema.ts`
- Create: `app/features/users/data/data.ts` — `roles`/`callTypes`；icon 改用 `Component` from vue + `lucide-vue-next`
- Create: `app/features/users/data/users.ts` — **逐行等价** faker seed `67890`、500 rows

```ts
// users.ts — 必须与 React 对齐字段集合
import { faker } from '@faker-js/faker'
faker.seed(67890)

export function buildInitialUsers(): User[] {
  return Array.from({ length: 500 }, () => ({ /* … */ }))
}
export const INITIAL_USERS = buildInitialUsers()
```

导出 `User` 类型自 `schema` 推断。

---

### Task 7: 列定义

**Files:**

- Create: `app/features/users/components/usersColumns.ts`

将 `react-template/src/features/users/components/users-columns.tsx` 迁至 TS（无 JSX）：Checkbox、下拉 Row actions、`DataTableColumnHeader` meta.className、`Badge`/`callTypes` 等。**保持 accessorKey / id** 以便 URL `columnFilters` ids 仍为 `username`/`status`/`role`。

---

### Task 8: 对话框上下文与表单

**Files:**

- Create: `app/features/users/composables/useUsersDialogs.ts`

```ts
export type UsersDialog = 'add' | 'edit' | 'delete' | null
export interface UsersDialogsContext {
  open: UsersDialog | 'multi-delete'
  currentRow: User | null
  setOpen: (v: UsersDialog | 'multi-delete' | null) => void
  setCurrentRow: (u: User | null) => void
}
```

- `UsersActionDialog.vue`：**移植** react `users-action-dialog.tsx` form schema；使用 `vee-validate` `@vee-validate/zod` `toTypedSchema`；Select/Radio roles 对齐；edit 模式下密码可不填逻辑与 refine 等价。

提交时 **调用父级传入回调** `(payload) =>`，由页面：`add`/`update`。

- `UsersDeleteDialog.vue`：单删确认 — 同上回调 `onConfirm(id)`。
- `UsersMultiDeleteDialog.vue`：**移植** 「输入 DELETE」校验；成功后 `emit('confirm', ids: string[])`。

**不写** invite 相关任何东西。

---

### Task 9: `UsersTable.vue` + 批量操作条

**Files:**

- Create: `app/features/users/components/UsersTable.vue`

Props：`data: Ref<User[]> | User[]`、`search`/`navigate` 可通过 composable `useRouter()` 内化（推荐：父只传 `users` ref，表格内部调用 `useTableUrlState`）。

- `useVueTable({ get data() { return ... }, columns, ... })` 与 react `users-table.tsx` options 对等。

- `<FlexRender>` 渲染 header/cell。
- `:deep`/`meta` Tailwind classes 与原表一致。
- 嵌入 `UsersDataTableBulkActions.vue`：仅 **Activate / Deactivate / Delete**（与 react 删减 Mail）；操作成功应 **修改传入的 users ref** 并 toast（见 spec §6）。
- Watch `pageCount` 调 `ensurePageInRange`。

---

### Task 10: 组装页与侧边栏 + 守卫

**Files:**

- Create: `app/pages/users/index.vue`
- Modify: `app/components/layout/AppSidebar.vue` — 追加 `NuxtLink` to `/users`（图标 `Users`），`is-active` 判断 `route.path.startsWith('/users')`
- Modify: `utils/authRedirect.ts`

```vue
<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })
const users = ref(structuredClone(INITIAL_USERS))

function handleAdd(/* User */) { /* push */ }
function handleUpdate(/* partial */) { /* find + replace */ }
function handleRemoveIds(/* string[] */) { /* filter */ }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain>
      <!-- 标题描述 + UsersPrimaryButtons 仅 「添加用户」 -->
      <UsersTable :users />
      <UsersDialogs :users-ref="users" />
    </AppMain>
  </div>
</template>
```

`utils/authRedirect.ts` 增补：

```ts
if (!authed && path === '/users') return { redirect: '/sign-in' }
```

或抽象为公用 `requiresProtectedShell(path)` 以免重复——**任一实现通过验收即可**。

---

### Task 11: 集成自检

- [ ] **Step 1: 类型检查 + 构建**

```bash
pnpm exec vue-tsc --noEmit
pnpm run build
```

Expected：无报错。

- [ ] **Step 2: 手工冒烟**

Dev server（`pnpm dev`）：未登录直访 `/users` → `/sign-in`；登录后批量删、单删、`username`/`status`/`role` 筛选、`page`、`pageSize` 改 URL、`Cmd+单击` 新标签应保持状态。

---

## Plan self-review（已执行）

1. **Spec 覆盖：** Invite / API / persistence 禁令、侧边栏、`faker`/`INITIAL_USERS`、`/users`、`URL`、对话框、批量（无 Invite）均有对应 Task。
2. **占位：** 已无 TBD/TODO。
3. **一致性：** TanStack Vue 导入名、列 id、query key 与前文图谱一致。

---

## 执行移交

Plan 已保存：`nuxt-template/docs/superpowers/plans/2026-05-15-nuxt-users-from-react.md`.

**两种方式：**

**1. Subagent-Driven（推荐）—** 每项 Task 派发新 subagent，`superpowers:subagent-driven-development` 流程，Task 间隙人工 review。

**2. Inline Execution —** 本会话逐项执行，`superpowers:executing-plans`，按 checkpoint 复核。

请告知选用哪种方式再继续写代码。
