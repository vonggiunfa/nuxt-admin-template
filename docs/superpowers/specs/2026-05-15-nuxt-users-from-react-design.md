# Nuxt Users 模块（对标 react-template）— 设计说明

**日期**：2026-05-15  
**状态**：用户已口述「整体认可」  
**输入约束**：不包含 Invite User；数据仅本地、不调接口；会话内可变（选型 **A**：刷新还原）。

---

## 1. 目标

在 `nuxt-template` 中实现与 `react-template` **`/users`  authenticated 体验**等价（在下列非目标删减后）的 **用户列表**：

- 大数据表：`@tanstack/vue-table`，列定义与交互（排序、facet 筛选、列可见性、分页、列级文本筛选等）与 React 实现对齐意图一致。
- **路由 URL query** 与 React `validateSearch` 字段对齐：`page`、`pageSize`、`status`（数组）、`role`（数组）、`username`（字符串），便于分享书签与逐项对比。
- **数据**：仅存于源码模块生成的初始数据集 + **页面级 `ref` 可变副本**；无任何 HTTP/`useFetch`。刷新页面后恢复到初始快照。
- **弹窗**：Add / Edit / Delete、多选批量删除等与 React 同类的交互闭环；表单校验使用项目既有 **vee-validate + zod**。
- **壳**：`layout: authenticated`，沿用 `AppHeader` + `AppMain`；侧栏新增 `/users` 入口（中文）。

---

## 2. 非目标

- **Invite**：不出现主按钮 「Invite User」；不挂载 `UsersInviteDialog`；不提供 `invite` 对话框枚举态。对标 React **`data-table-bulk-actions.tsx` 中与 Mail 图标相关的批量「邀请所选」**，**一并省略**（与「无需邀请流程」一致）。
- **服务端**：不写 API Route、不写 `nitro`、`useAsyncData` 拉取列表。
- **持久化**：不用 `localStorage` / IndexedDB。
- **首版**：不强制 Vitest 覆盖 Vue 视图层（可选仅测纯函数，见实现计划）。

---

## 3. 技术路径（已定案）

- **表格**：**方案 1** — `@tanstack/vue-table` + 等价于 React `use-table-url-state.ts` 的 **Nuxt 组合式函数**（读 `route.query`，写 `navigateTo`/`router.replace`，`merge`/`replace` 策略与 TanStack handlers 对齐）。
- **初始数据**：与 `react-template/src/features/users/data/users.ts` **同逻辑**——`faker.seed(67890)`、500 条、字段一致；需在 `package.json` 增加依赖 `@faker-js/faker`。
- **类型**：Zod schema 对齐 `react-template/src/features/users/data/schema.ts`；`roles` / `callTypes` 等对 `react-template/src/features/users/data/data.ts` 对齐（Lucide → `lucide-vue-next`）。

---

## 4. 目录与分层

建议在 `app/features/users/`（若团队更偏好 `~/features` 且无 `#` alias 冲突，可与现有 `@/` 别名策略统一）安放：

| 单元 | 职责 |
|------|------|
| `schema.ts` | Zod + `User` 等导出类型 |
| `data/data.ts` | `roles`、`callTypes`（Vue 图标组件） |
| `data/users.ts` | `INITIAL_USERS` 常量（/faker 生成） |
| `composables/useTableUrlState.ts` | Query ↔ table 状态（分页、column filters）；可拆出纯函数文件便于测试 |
| `components/*.vue` | 表格、工具栏封装、dialogs、bulk actions（不含 invite） |

**全局可复用** data-table primitive（对齐 `react-template/src/components/data-table/*`）：放在 `app/components/data-table/`（或项目既有约定目录）。

---

## 5. UI 组件缺口（实现阶段补齐）

当前 `nuxt-template` **缺少** Table、Checkbox、Badge、Popover、Select 等与 React data-table/faceted-filter 对齐的底层块。计划中需按 **shadcn-vue** 方式引入或手搬，优先级以跑通 `/users` 为准。

界面文案：**与首页一致使用中文**（列表标题、描述、按钮、表头、`aria-label` 等）。

---

## 6. 状态与可变数据规则

1. **页面**：`const users = ref<User[]>(structuredClone(INITIAL_USERS))`（或等价深拷贝）。
2. **新增**：对话框提交 → `push` 新 `User`（`id` 用 `crypto.randomUUID()` 或既有工具）。
3. **编辑**：按 `id` 替换条目。
4. **单删 / 批删**：`filter` / `splice` 更新 `users`。
5. **批量激活/Inactive / 批量删除**：React 模版里这些操作仅占位 `toast` + `sleep`，列表 prop **不会**变更。选型 **A** 要求会话内可操作：本实现应对 `users` **ref** 做真实插入/修改/筛选移除，可同时 `toast` 提示；这是对 React 占位行为的 **有意偏离**。

---

## 7. 可访问性与依赖

- 表格、Dialog、批量操作控件保持合理 `aria-label` / focus trap（primitive 已由 reka-ui 处理）。
- 新增依赖：**`@tanstack/vue-table`**、**`@faker-js/faker`**（仅构建初始常量）。

---

## 8. 验收标准

1. 访问 `/users`（已登录壳下）能看到与 react 语义一致的表格与分页，且 **修改 query** 后刷新或分享 URL 可恢复筛选/分页（与 React URL 语义一致）。
2. **不存在** Invite 主按钮、Invite 对话框、批量邀请按钮。
3. **无网络请求**加载表格数据。
4. 刷新页面后，所有会话内改动消失，数据回到 `INITIAL_USERS`。
5. 侧栏可从首页导航到 `/users`。

---

## 9. Git 协作

遵循仓库规则：**不**由 Agent 代为 `git commit`；SPEC 落地后用户自行提交。

---

## 10. 后续步骤

- 使用 **writing-plans** 产出 `docs/superpowers/plans/2026-05-15-nuxt-users-from-react.md`。
- 实现阶段按.checkbox 顺序执行；完成后 `pnpm exec nuxt prepare && pnpm run build`（或项目约定命令）自检。
