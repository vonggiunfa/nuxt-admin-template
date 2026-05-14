# Nuxt 主栏顶栏 / Search / 登出 / 滚动 对齐 react-template — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务顺序执行。步骤使用 checkbox（`- [ ]`）跟踪。

**Goal:** 落地 spec `docs/superpowers/specs/2026-05-15-nuxt-shell-header-parity-design.md`：顶栏 outline 触发器、竖分隔、去默认 `border-b`、滚动容器内 sticky + 阈值阴影/模糊、Search + ⌘K 命令面板（静态数据）、退出确认框；滚动监听附着在 `SidebarInset` 内滚动层而非 `document`（与 spec 一致）。

**Architecture:** `authenticated` 布局在 `SidebarInset` 内增加 **`flex-1 min-h-0 overflow-y-auto`** 单层滚动包裹 `<slot />`，`provide` 该元素 `ref`；`AppHeader` `inject` 后用 `@vueuse/core` 的 `useEventListener` 监听 `scrollTop`，复制 `react-template/src/components/layout/header.tsx` 的 class 组合逻辑。**Search** 用 Nuxt `useState` 做全局 `open`，`SearchRoot`（或布局内联）渲染 `<slot/>` + `<CommandMenu/>`。退出用 shadcn-vue **Alert Dialog** 封装 **`ConfirmDialog`**，再包 **`SignOutDialog`**。

**Tech Stack:** Nuxt 4、Vue 3、Tailwind v4、shadcn-vue、reka-ui、`@vueuse/core`、Vitest（本计划以 **人工验收** 为主，不要求为新 UI 写单测）。

**仓库惯例:** 计划中「Commit」步骤由实现者 **自行** 执行；本环境不代用户提交。

---

## 文件结构（将创建 / 修改）

| 路径 | 职责 |
|------|------|
| 修改 `app/layouts/authenticated.vue` | `SidebarInset` 内双层 flex + 滚动 `ref` + `provide` + 挂载 `CommandMenu`（或包裹 `SearchRoot`） |
| 创建 `app/composables/shellScroll.ts` | `ShellScrollKey` 符号 + `provide/inject` 类型辅助（可选，或直接 `inject` 字符串 key） |
| 创建 `app/composables/useSearchMenu.ts` | `useState('command-menu-open')` + `setOpen`；注册全局 `Ctrl/Cmd+K`（`onMounted` + `onBeforeUnmount`） |
| 修改 `app/components/layout/AppHeader.vue` | 对标 `header.tsx`：内层 wrapper、`SidebarTrigger` outline、`Separator h-6`、去掉默认 `border-b`、滚动偏移样式、`Search` 插槽区、登出改为打开 `SignOutDialog` |
| 修改 `app/components/ui/sidebar/SidebarTrigger.vue` | 支持透传 `variant`（及与 `Button` 一致的 props），默认维持 `ghost` 时由调用方覆盖为 `outline` |
| 创建 `app/components/layout/Search.vue` | 对标 `react-template/src/components/search.tsx`（placeholder 中文可写「搜索…」） |
| 创建 `app/components/layout/CommandMenu.vue` | 对标 `command-menu.tsx` 结构简化：静态 `CommandGroup`（如「导航」仅「仪表盘」、`Theme` 下 Light/Dark 调用 `document.documentElement.classList.toggle('dark', …)` 与 `ThemeSwitch` 一致） |
| 创建 `app/components/ui/alert-dialog/*` 等 | 若尚无：(`pnpm dlx shadcn-vue@latest add alert-dialog`) |
| 创建 `app/components/ui/dialog/*`、`command/*`、`scroll-area/*` | 若尚无：CLI `add dialog command scroll-area`（以 CLI 实际生成路径为准） |
| 创建 `app/components/layout/ConfirmDialog.vue` | 对标 `confirm-dialog.tsx`：AlertDialog + 取消 + 确认按钮 |
| 创建 `app/components/layout/SignOutDialog.vue` | 对标 `sign-out-dialog.tsx`：`logout()` + `navigateTo('/sign-in')`；可选 `redirect` query |
| 修改 `app/pages/index.vue` | 去掉根级 `overflow-hidden` 等阻挡唯一滚动条的 class；保证仍可 `flex-1 min-h-0` 参与列布局 |
| 可选 修改 `app/pages/sign-in.vue` | 若实现 `redirect`：读 `useRoute().query.redirect` 登录成功后跳转 |

---

### Task 1: 补全 shadcn-vue  primitives（Alert Dialog / Dialog / Command / ScrollArea）

**Files:**

- 修改: `nuxt-template/package.json`（仅当 CLI 增加依赖时）
- 创建: `nuxt-template/app/components/ui/alert-dialog/`、`dialog/`、`command/`、`scroll-area/`（以 CLI 输出为准）

- [ ] **Step 1:** 在 `nuxt-template` 目录执行（若某项已存在则跳过）：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm dlx shadcn-vue@latest add alert-dialog dialog command scroll-area
```

预期：CLI 无报错；`app/components/ui/` 下出现对应组件目录。

- [ ] **Step 2:** 运行 `pnpm exec nuxt prepare` 与 `pnpm build`。

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm exec nuxt prepare && pnpm build
```

预期：`build` 成功（若 command 对 dialog 有额外 export 问题，本节内修到通过）。

- [ ] **Step 3（自行 commit）:** `git add app/components/ui` 等并提交，信息示例：`chore(nuxt): add alert-dialog dialog command scroll-area`

---

### Task 2: 全局 Search 状态与快捷键

**Files:**

- 创建: `nuxt-template/app/composables/useSearchMenu.ts`

- [ ] **Step 1:** 新建 `useSearchMenu.ts`（**仅状态**，不在此注册全局 keydown，避免 SSR / 多次调用 composable 时重复监听）：

```ts
export function useSearchMenu() {
  const open = useState('command-menu-open', () => false)

  function setOpen(value: boolean) {
    open.value = value
  }

  function toggle() {
    open.value = !open.value
  }

  return { open, setOpen, toggle }
}
```

- [ ] **Step 2（自行 commit）:** `feat(nuxt): add useSearchMenu composable`

**注意：** 全局 `Ctrl/Cmd+K` 的注册放在 **Task 3** 的 `authenticated.vue` 中，与滚动 `provide` 同一文件编辑，避免重复打开布局。

---

### Task 3: 滚动容器 provide + `AppHeader` 监听

**Files:**

- 创建: `nuxt-template/app/composables/shellScroll.ts`
- 修改: `nuxt-template/app/layouts/authenticated.vue`
- 修改: `nuxt-template/app/components/layout/AppHeader.vue`（接通监听与 class 逻辑）

- [ ] **Step 1:** 新建 `shellScroll.ts`：

```ts
import type { InjectionKey, Ref } from 'vue'

export const SHELL_INSET_SCROLL_EL: InjectionKey<Ref<HTMLElement | null>> = Symbol('shellInsetScrollEl')
```

- [ ] **Step 2:** 修改 `authenticated.vue` — `SidebarInset` **保留** `overflow-hidden`（裁剪 inset 圆角）；**内层**增加 `flex min-h-0 flex-1 flex-col`，滚动层：

```vue
<script setup lang="ts">
import { SHELL_INSET_SCROLL_EL } from '~/composables/shellScroll'

const insetScrollEl = ref<HTMLElement | null>(null)
provide(SHELL_INSET_SCROLL_EL, insetScrollEl)

const { toggle } = useSearchMenu()

function onKey(e: KeyboardEvent) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <SidebarProvider>
    <SkipToMain />
    <AppSidebar />
    <SidebarInset class="@container/content flex max-h-svh min-h-svh min-w-0 flex-1 flex-col overflow-hidden">
      <div class="flex min-h-0 flex-1 flex-col">
        <div
          ref="insetScrollEl"
          class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          <slot />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
```

（`CommandMenu` 在 Task 4 再加在 `SidebarInset` 内、滚动层外 sibling，见 Task 4。）

- [ ] **Step 3:** 在 `AppHeader.vue` 顶部增加：

```vue
<script setup lang="ts">
import { SHELL_INSET_SCROLL_EL } from '~/composables/shellScroll'

const scrollRoot = inject(SHELL_INSET_SCROLL_EL, ref(null))
const offset = ref(0)

useEventListener(scrollRoot, 'scroll', () => {
  offset.value = scrollRoot.value?.scrollTop ?? 0
}, { passive: true })
</script>
```

模板中外层 `<header>` class 拼入（与 react 一致思想，Tailwind 字符串可从 `header.tsx` 抄写）：

- 基础：`z-50 h-16`
- 固定行为（本 spec 默认开）：`sticky top-0 w-[inherit] header-fixed peer/header`（若项目未定义 `header-fixed`，可仅用 `sticky top-0` + `w-full` 至 `SidebarInset` 内容宽一致即可）
- `offset > 10`：`shadow` vs `shadow-none`
- 内层 `div`：`relative flex h-full items-center gap-3 p-4 sm:gap-4`；条件与 react 相同：若 `offset > 10` 则追加 `after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg`

- [ ] **Step 4:** 浏览器打开 `/`：仅 **一条**纵向滚动条（在 inset 内）；滚动后顶栏出现阴影与模糊。

- [ ] **Step 5（自行 commit）:** `feat(nuxt): shell inset scroll + sticky header blur`

---

### Task 4: `Search` + `CommandMenu` + 布局挂载

**Files:**

- 创建: `nuxt-template/app/components/layout/Search.vue`
- 创建: `nuxt-template/app/components/layout/CommandMenu.vue`
- 修改: `nuxt-template/app/layouts/authenticated.vue`
- 修改: `nuxt-template/app/components/layout/AppHeader.vue`（插入 `<Search />`）

- [ ] **Step 1:** `Search.vue` — 使用 `Button variant="outline"`，class 字符串对齐 `react-template/src/components/search.tsx`（`h-8`、`bg-muted/25`、`sm:w-40` … `xl:w-64`、`group`、`kbd` 等）；`const { setOpen } = useSearchMenu()`，`@click="setOpen(true)"`。

- [ ] **Step 2:** `CommandMenu.vue` — 使用 shadcn-vue 的 `CommandDialog`（或 `Dialog` + `Command` 组合，以 CLI 生成物为准）。`const { open, setOpen } = useSearchMenu()`，绑定 `v-model:open` 或 `:open` + `@update:open`。内置静态项：「仪表盘」→ `navigateTo('/')`；Theme：Light / Dark 通过 `document.documentElement.classList.toggle('dark', false|true)`。占位文案「无结果」与 react `CommandEmpty` 对齐。

- [ ] **Step 3:** 在 `authenticated.vue` 的 `SidebarInset` 内、**滚动 `div` 外**、`flex col` 内添加 `<CommandMenu />`。（全局 ⌘K 已在 **Task 3** 的 `authenticated.vue` `onMounted` 注册，此处不要重复注册。）

```vue
<div class="flex min-h-0 flex-1 flex-col">
  <div ref="insetScrollEl" class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
    <slot />
  </div>
  <CommandMenu />
</div>
```

- [ ] **Step 4:** `AppHeader` 中在 `Separator` 后、`ThemeSwitch` 前加入 `<Search class="..." />`（class 默认可 `me-auto` 前的区域与 react Dashboard 节奏一致：若有 `TopNav` link 则用 flex 与 `me-auto` 分配空间）。

- [ ] **Step 5:** 手动验证 ⌘K / Ctrl+K 打开/关闭；点击 Search 按钮打开。

- [ ] **Step 6（自行 commit）:** `feat(nuxt): search trigger and command menu`

---

### Task 5: `SidebarTrigger` 透传 `variant` + 顶栏细节对齐

**Files:**

- 修改: `nuxt-template/app/components/ui/sidebar/SidebarTrigger.vue`
- 修改: `nuxt-template/app/components/layout/AppHeader.vue`

- [ ] **Step 1:** `SidebarTrigger.vue` — `defineProps` 继承或显式列出 `Button` 的 `variant` / `size` / `class`，模板 `<Button>` 上 `v-bind="$attrs"` 或显式 `:variant="variant"`，默认值 `variant: 'ghost'` **或** 不设默认让 Button 用自身默认（与 shadcn 一致）。

- [ ] **Step 2:** `AppHeader` 内改为 `<SidebarTrigger variant="outline" class="max-md:scale-125 -ms-1" />`（class 以 react `header.tsx` 为准合并）。

- [ ] **Step 3:** `Separator` 改为 `class="h-6"`，**去掉** `hidden md:block`；**去掉** header 最外层 `border-b`（除非加 prop `bordered`）。

- [ ] **Step 4（自行 commit）:** `fix(nuxt): align sidebar trigger and separator with react`

---

### Task 6: `ConfirmDialog` + `SignOutDialog` + 用户菜单接线

**Files:**

- 创建: `nuxt-template/app/components/layout/ConfirmDialog.vue`
- 创建: `nuxt-template/app/components/layout/SignOutDialog.vue`
- 修改: `nuxt-template/app/components/layout/AppHeader.vue`

- [ ] **Step 1:** `ConfirmDialog.vue` — props：`open: boolean`、`title`、`description`（string）、`confirmText`、`cancelText`（默认「取消」）、`destructive?: boolean`、`onConfirm: () => void`、`onUpdateOpen: (v: boolean) => void`。用 `AlertDialog` + `AlertDialogContent` + `AlertDialogHeader` + Footer 内 `AlertDialogCancel` + `Button :variant="destructive ? 'destructive' : 'default'"`。

- [ ] **Step 2:** `SignOutDialog.vue` — `const { logout } = useAuthSession()`，`handleConfirm`：`logout()`；`await navigateTo({ path: '/sign-in', query: redirect ? { redirect } : undefined })`（`redirect` 从 `useRouter().currentRoute.value.fullPath` 读取可选）。

- [ ] **Step 3:** `AppHeader` 下拉「退出登录」：`@click.prevent` → `signOutOpen = true`，不直接 `logout`。模板内 `<SignOutDialog v-model:open="signOutOpen" />`。

- [ ] **Step 4:** 手动验证：取消不关会话；确认后 cookie 清除并到登录页。

- [ ] **Step 5（自行 commit）:** `feat(nuxt): sign-out confirm dialog`

---

### Task 7: 首页布局 class 清理与 redirect（可选）

**Files:**

- 修改: `nuxt-template/app/pages/index.vue`
- 可选 修改: `nuxt-template/app/pages/sign-in.vue`

- [ ] **Step 1:** `index.vue` 根节点：删除 `overflow-hidden`；改为 `class="flex min-h-0 flex-1 flex-col"`（或等价），保证在滚动容器内占满宽度且不阻止子级增高。

- [ ] **Step 2（可选）：** `sign-in.vue` 登录成功后 `navigateTo(route.query.redirect as string || '/')`。

- [ ] **Step 3（自行 commit）:** `fix(nuxt): dashboard root flex for inset scroll`

---

### Task 8: 规格对照验收（发布前）

- [ ] **Step 1:** 逐项打勾 `2026-05-15-nuxt-shell-header-parity-design.md` 第 8 节验收标准。

- [ ] **Step 2:** `pnpm build` 无报错。

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm build
```

---

## Self-review（计划相对 spec）

| Spec 章节 | 对应 Task |
|-----------|-----------|
| 单一滚动容器 + provide ref | Task 3 |
| 顶栏 sticky / 模糊 / 阴影 | Task 3 + 5 |
| Search + ⌘K | Task 2 + 4 |
| SidebarTrigger outline、Separator、去 border-b | Task 5 |
| 退出确认 | Task 6 |
| index 根不去挡滚动 | Task 7 |

无 TBD；ConfigDrawer 明确非本计划强制项。

---

## Execution handoff

**计划已保存至** `nuxt-template/docs/superpowers/plans/2026-05-15-nuxt-shell-header-parity.md`。

**Spec 已保存至** `nuxt-template/docs/superpowers/specs/2026-05-15-nuxt-shell-header-parity-design.md`（请自行 `git add` / `commit`）。

**执行方式二选一：**

1. **Subagent-Driven（推荐）** — 每任务新开 subagent，任务间 review；需配合 superpowers:subagent-driven-development。  
2. **Inline Execution** — 本会话按任务顺序改代码；需配合 superpowers:executing-plans。

你要用哪一种？
