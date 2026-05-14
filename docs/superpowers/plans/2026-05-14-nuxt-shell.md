# Nuxt Shell（对标 react-template）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务顺序执行。步骤使用 checkbox（`- [ ]`）跟踪。

**Goal:** 在 `nuxt-template` 中用 Nuxt 4 + Tailwind + shadcn-vue 复刻 `react-template` 的后台壳与 Dashboard 首页骨架；仅保留 `/`、`/sign-in`、`/sign-up`；鉴权为 cookie 桩，无后端。

**Architecture:** 使用 `useCookie('na_session') === '1'` 作为登录标记；`middleware/auth.global.ts` 在 SSR/客户端统一守 `/` 与 auth 页互斥跳转。主题 token 从 `react-template/src/styles/theme.css` 与 `index.css` 迁入 Nuxt 全局样式。壳层用 shadcn-vue 的 Sidebar 系列组件在 Vue 侧按模板层级拼装；顶栏首版 **不包含 Search**、**不包含 ConfigDrawer**（spec 允许降级），保留 **ThemeSwitch** 与用户下拉（Sign out）。

**Tech Stack:** Nuxt `4.4.x`、Vue 3、Tailwind CSS v4（与 react-template 对齐）、shadcn-vue、lucide-vue-next、`clsx` + `tailwind-merge`、`tw-animate-css`（若 CLI 未自动加入则补装）。

**仓库惯例:** 计划中的「Commit」步骤由实现者 **自行** 执行；本环境不代用户提交。

---

## 文件结构（将创建 / 修改）

| 路径 | 职责 |
|------|------|
| 修改 `nuxt-template/nuxt.config.ts` | Tailwind / 样式入口 / 字体或 `@nuxt/fonts`（若采用） |
| 创建 `nuxt-template/app/assets/css/main.css` | `@import tailwindcss`、`theme` 变量、`@layer base` 规则（自 react-template 迁） |
| 创建 `nuxt-template/app/composables/useAuthSession.ts` | 读写 `na_session` cookie、`login()`、`logout()` |
| 创建 `nuxt-template/utils/authRedirect.ts` | 纯函数：给定 `path` 与是否已登录，返回目标路径或 `null`（可测试） |
| 创建 `nuxt-template/tests/authRedirect.spec.ts` | 覆盖中间件决策表 |
| 创建 `nuxt-template/vitest.config.ts` | Vitest 单测（若项目尚无） |
| 修改 `nuxt-template/package.json` | `test` 脚本指向 vitest |
| 创建 `nuxt-template/app/middleware/auth.global.ts` | 调用 `authRedirect` + `navigateTo` |
| 创建 `nuxt-template/app/layouts/authenticated.vue` | SidebarProvider + AppSidebar + SidebarInset + `<slot />` |
| 创建 `nuxt-template/app/layouts/auth.vue` | 极简，仅 `<slot />`（品牌区在页面内组件完成） |
| 创建 `nuxt-template/app/components/layout/AppSidebar.vue` | 单「Dashboard」项 + 底部用户菜单（Sign out） |
| 创建 `nuxt-template/app/components/layout/AppHeader.vue` | 左侧可选单个 TopNav 链接或 spacer；右侧 ThemeSwitch + UserDropdown |
| 创建 `nuxt-template/app/components/layout/AppMain.vue` | 对标 `Main`：内边距与 `max-w` 习惯 |
| 创建 `nuxt-template/app/components/layout/SkipToMain.vue` | `a href="#main-content"` |
| 创建 `nuxt-template/app/components/auth/AuthLayout.vue` | 对标 `auth-layout.tsx`：container + logo 行 |
| 创建 `nuxt-template/app/components/auth/UserAuthForm.vue` | Email/password + submit → `login()` |
| 创建 `nuxt-template/app/components/auth/SignUpForm.vue` | 注册表单占位字段（email/password/confirm 等最小集）→ `login()` |
| 创建 `nuxt-template/app/components/Logo.vue` | 自 `react-template/src/assets/logo.tsx` 手迁 SVG |
| 创建 `nuxt-template/app/components/ThemeSwitch.vue` | 对标模板：class `dark` 挂到 `document.documentElement` 或与 shadcn 脚手架一致 |
| 创建 `nuxt-template/app/pages/index.vue` | `layout: authenticated`，内含 `AppHeader` + `AppMain` + Dashboard 骨架 |
| 创建 `nuxt-template/app/pages/sign-in.vue` | `layout: auth`，`AuthLayout` + Card 表单 |
| 创建 `nuxt-template/app/pages/sign-up.vue` | 同上 |
| 修改 `nuxt-template/app/app.vue` | 引入全局样式；`<NuxtRouteAnnouncer />` + `<NuxtLayout>` + `<NuxtPage />`（去掉 `NuxtWelcome`） |
| `nuxt-template/components.json` | shadcn-vue CLI 生成（路径以 CLI 为准） |
| `nuxt-template/app/components/ui/*` | shadcn-vue 生成的 Button、Card、Tabs、Input、Label、Sidebar、DropdownMenu 等 |

---

### Task 1: 初始化 Tailwind v4 + shadcn-vue

**Files:**
- 修改: `nuxt-template/nuxt.config.ts`
- 修改: `nuxt-template/package.json`
- 创建: `nuxt-template/app/assets/css/main.css`（可先放占位 import，Task 2 填满）
- 修改: `nuxt-template/app/app.vue`（引入 `~/assets/css/main.css`）

- [ ] **Step 1:** 在 `nuxt-template` 目录执行官方脚手架（按执行当日 shadcn-vue 文档为准）。示例命令：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm dlx shadcn-vue@latest init
```

交互项建议：**Style:** New York（若可选且与 react-template 接近）；**Base color:** Neutral 或 Slate（与 react 版对齐者优先）；确认 CLI 写入 Tailwind v4 + `components.json`。

- [ ] **Step 2:** 添加 shell 所需组件（一次或分批执行，以 CLI 支持为准）：

```bash
pnpm dlx shadcn-vue@latest add sidebar button card tabs input label dropdown-menu separator sheet tooltip collapsible skeleton
```

- [ ] **Step 3:** 修改 `app/app.vue` 为：

```vue
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 4:** 在 `nuxt.config.ts` 中确保存在 CSS 数组项 `~/assets/css/main.css`（若 CLI 已添加则跳过重复）。

- [ ] **Step 5:** 运行 dev 冒烟：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm dev
```

预期：能启动；首页可能 404 直至 Task 7 完成属正常，以无构建错误为准。

- [ ] **Step 6（自行 commit）:** `git add` 相关文件并提交，信息示例：`chore(nuxt): tailwind and shadcn-vue init`

---

### Task 2: 迁入主题 token 与 base 样式

**Files:**
- 修改: `nuxt-template/app/assets/css/main.css`
- 参考只读: `react-template/src/styles/theme.css`
- 参考只读: `react-template/src/styles/index.css`

- [ ] **Step 1:** 将 `react-template/src/styles/theme.css` 全文合并进 `main.css` 的适当位置（保持 `:root`、`.dark`、`@theme inline` 块与 react 版一致）。

- [ ] **Step 2:** 将 `react-template/src/styles/index.css` 中除重复 `theme` 外的规则迁入，包括：

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  html {
    @apply overflow-x-hidden;
  }
  body {
    @apply min-h-svh w-full bg-background text-foreground has-[div[data-variant='inset']]:bg-sidebar;
  }
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
  @media screen and (max-width: 767px) {
    input,
    select,
    textarea {
      font-size: 16px !important;
    }
  }
}
```

若 `index.css` 末尾尚有 utilities（如 `@layer utilities` 中的工具类），一并复制。

- [ ] **Step 3:** 若包缺失则安装：

```bash
pnpm add tw-animate-css
```

- [ ] **Step 4:** `pnpm dev`，在浏览器切换 `:root` 与 `.dark`（待 ThemeSwitch 完成后复测）；预期无明显编译错误。

- [ ] **Step 5（自行 commit）:** 例：`style(nuxt): port shadcn theme tokens from react-template`

---

### Task 3: 可测试的鉴权重定向逻辑

**Files:**
- 创建: `nuxt-template/utils/authRedirect.ts`
- 创建: `nuxt-template/tests/authRedirect.spec.ts`
- 修改: `nuxt-template/package.json`（`test` 脚本）
- 创建: `nuxt-template/vitest.config.ts`

- [ ] **Step 1:** 新增 `utils/authRedirect.ts`：

```ts
export type AuthRedirectResult = { redirect: string } | null

export function getAuthRedirect(path: string, authed: boolean): AuthRedirectResult {
  const isAuthPage = path === '/sign-in' || path === '/sign-up'

  if (!authed && path === '/') return { redirect: '/sign-in' }

  if (authed && isAuthPage) return { redirect: '/' }

  return null
}
```

- [ ] **Step 2:** 新增 `tests/authRedirect.spec.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { getAuthRedirect } from '../utils/authRedirect'

describe('getAuthRedirect', () => {
  it('sends unauthenticated users from / to /sign-in', () => {
    expect(getAuthRedirect('/', false)).toEqual({ redirect: '/sign-in' })
  })

  it('allows unauthenticated users on /sign-in', () => {
    expect(getAuthRedirect('/sign-in', false)).toBeNull()
  })

  it('allows unauthenticated users on /sign-up', () => {
    expect(getAuthRedirect('/sign-up', false)).toBeNull()
  })

  it('sends authenticated users away from /sign-in', () => {
    expect(getAuthRedirect('/sign-in', true)).toEqual({ redirect: '/' })
  })

  it('sends authenticated users away from /sign-up', () => {
    expect(getAuthRedirect('/sign-up', true)).toEqual({ redirect: '/' })
  })

  it('does not redirect authenticated /', () => {
    expect(getAuthRedirect('/', true)).toBeNull()
  })
})
```

- [ ] **Step 3:** 安装 vitest 并写最小配置（若 CLI 未生成）：

```bash
pnpm add -D vitest @vitejs/plugin-vue vue
```

`vitest.config.ts`：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
})
```

- [ ] **Step 4:** 在 `package.json` 的 `scripts` 中加：

```json
"test": "vitest run"
```

- [ ] **Step 5:** 运行：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm test
```

预期：**全部 PASS**。

- [ ] **Step 6（自行 commit）:** 例：`test(nuxt): auth redirect helper`

---

### Task 4: `useAuthSession` 与全局路由中间件

**Files:**
- 创建: `nuxt-template/app/composables/useAuthSession.ts`
- 创建: `nuxt-template/app/middleware/auth.global.ts`

- [ ] **Step 1:** 新增 `useAuthSession.ts`：

```ts
export function useAuthSession() {
  const session = useCookie('na_session', {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  })

  const authed = computed(() => session.value === '1')

  function login() {
    session.value = '1'
  }

  function logout() {
    session.value = null
  }

  return { session, authed, login, logout }
}
```

- [ ] **Step 2:** 新增 `auth.global.ts`（从 `app/middleware` 到仓库根目录的 `utils` 使用相对路径，避免 Nuxt 将 `~/utils` 解析到 `app/utils`）：

```ts
import { getAuthRedirect } from '../../utils/authRedirect'

export default defineNuxtRouteMiddleware((to) => {
  const { authed } = useAuthSession()
  const next = getAuthRedirect(to.path, authed.value)
  if (next) return navigateTo(next.redirect)
})
```

- [ ] **Step 3:** `pnpm dev`，手动清 cookie 后访问 `/`，应跳到 `/sign-in`；设置 `na_session=1` 后访问 `/sign-in` 应到 `/`。（实现表单前可用浏览器 Application 面板设 cookie。）

- [ ] **Step 4（自行 commit）:** 例：`feat(nuxt): auth cookie and global middleware`

---

### Task 5: 壳层布局组件（Sidebar + Header + Main）

**Files:**
- 创建: `nuxt-template/app/layouts/authenticated.vue`
- 创建: `nuxt-template/app/components/layout/SkipToMain.vue`
- 创建: `nuxt-template/app/components/layout/AppSidebar.vue`
- 创建: `nuxt-template/app/components/layout/AppHeader.vue`
- 创建: `nuxt-template/app/components/layout/AppMain.vue`
- 创建: `nuxt-template/app/components/ThemeSwitch.vue`
- 依赖: shadcn-vue `Sidebar*`、`DropdownMenu`、`Button`

- [ ] **Step 1:** `SkipToMain.vue`：

```vue
<template>
  <a
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-3 focus:py-2 focus:text-foreground"
    href="#main-content"
  >
    Skip to Main
  </a>
</template>
```

- [ ] **Step 2:** 实现 `AppSidebar.vue`：使用官方 Sidebar 示例中 `Sidebar`、`SidebarHeader`、`SidebarContent`、`SidebarFooter`、`SidebarMenu`、`SidebarMenuItem`、`SidebarMenuButton`；**仅一个** `Dashboard` 链到 `/`；Footer 放用户头像 + `DropdownMenu`，一项 **Sign out** 调用 `logout()` 后 `navigateTo('/sign-in')`。（具体 import 路径以生成后的 `components/ui/sidebar` 为准。）

- [ ] **Step 3:** `AppHeader.vue`：**不渲染 Search**。`div` 使用 `flex`：`me-auto` 侧放单个 `NuxtLink`（文案 `Dashboard`，`to="/"`）或留 `flex-1` spacer + 面包屑占位；右侧：`ThemeSwitch` + 用户 `DropdownMenu`（与侧栏一致时可抽共享小组件避免重复）。

- [ ] **Step 4:** `AppMain.vue`：外包一层，设 `id="main-content"`，class 对标 react `Main`（如 `flex-1 overflow-auto p-4 md:p-6`、`@container/content` 若需）。

- [ ] **Step 5:** `ThemeSwitch.vue`：实现 dark/light 切换（与 shadcn-vue / Tailwind `class` 策略一致：切 `document.documentElement.classList` 或 `useColorMode` 若已引入 nuxt-color-mode；首版以 **无额外模块** 的 class 切换为优先，避免 scope creep）。

- [ ] **Step 6:** `authenticated.vue` 布局拼装顺序参考 react `AuthenticatedLayout`：`SkipToMain` → `SidebarProvider` → `AppSidebar` → `SidebarInset` → `<slot />`（子页再放 Header/Main）。

- [ ] **Step 7:** `pnpm dev` 建临时页验证 Sidebar 折叠无报错（可在 Task 7 一并验）。

- [ ] **Step 8（自行 commit）:** 例：`feat(nuxt): authenticated shell components`

---

### Task 6: Auth 版面与表单页

**Files:**
- 创建: `nuxt-template/app/layouts/auth.vue`
- 创建: `nuxt-template/app/components/auth/AuthLayout.vue`
- 创建: `nuxt-template/app/components/Logo.vue`
- 创建: `nuxt-template/app/components/auth/UserAuthForm.vue`
- 创建: `nuxt-template/app/components/auth/SignUpForm.vue`
- 创建: `nuxt-template/app/pages/sign-in.vue`
- 创建: `nuxt-template/app/pages/sign-up.vue`

- [ ] **Step 1:** `auth.vue`：

```vue
<template>
  <slot />
</template>
```

- [ ] **Step 2:** `AuthLayout.vue`：结构对标 `auth-layout.tsx`（container、`h-svh`、居中、`Logo` + 标题「Shadcn Admin」）。

- [ ] **Step 3:** `UserAuthForm.vue`：`<form @submit.prevent="onSubmit">`，字段 email、password（`Input` + `Label`），`Button type="submit"`。`onSubmit`：`login()` 后 `await navigateTo('/')`。

- [ ] **Step 4:** `SignUpForm.vue`：至少 email、password、confirm password；`onSubmit` 同样 `login()` + `navigateTo('/')`（不接校验库首版可只做 HTML5 `required` + 简易相等判断）。

- [ ] **Step 5:** `sign-in.vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>

<template>
  <AuthLayout>
    <Card class="max-w-sm gap-4">
      <!-- CardHeader / CardDescription 内含 NuxtLink to=/sign-up -->
      <CardContent>
        <UserAuthForm />
      </CardContent>
      <CardFooter>… Terms / Privacy 可与 react 相同为静态 href="#" 或占位路径 …</CardFooter>
    </Card>
  </AuthLayout>
</template>
```

（`Card*` 从 `~/components/ui/card` 导入。）

- [ ] **Step 6:** `sign-up.vue`：对称实现，`NuxtLink` 指向 `/sign-in`。

- [ ] **Step 7:** 手动验证：未登录 `/` → `/sign-in`；提交后进 `/`；Sign out 回 `/sign-in`。

- [ ] **Step 8（自行 commit）:** 例：`feat(nuxt): sign-in and sign-up placeholders`

---

### Task 7: Dashboard 首页骨架

**Files:**
- 创建: `nuxt-template/app/pages/index.vue`

- [ ] **Step 1:** `index.vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain>
      <div class="mb-2 flex items-center justify-between space-y-2">
        <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div class="flex items-center space-x-2">
          <Button variant="outline">Download</Button>
        </div>
      </div>

      <Tabs default-value="overview" class="space-y-4" orientation="horizontal">
        <div class="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
            <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- 4x Card KPI 占位，文案静态，对标 react Dashboard -->
          </div>
          <div class="grid gap-4 lg:grid-cols-7">
            <Card class="col-span-4">
              <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
              <CardContent class="h-[280px] rounded-md bg-muted/40" />
            </Card>
            <Card class="col-span-3">
              <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
              <CardContent>
                <!-- 静态列表项若干 -->
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" class="space-y-4">
          <Card>
            <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
            <CardContent class="h-[240px] rounded-md bg-muted/40" />
          </Card>
        </TabsContent>
      </Tabs>
    </AppMain>
  </div>
</template>
```

 orientation 以 shadcn-vue `Tabs` API 为准；若仅支持水平则删 `orientation` 属性。

- [ ] **Step 2:** 对照 `react-template/src/features/dashboard/index.tsx` 补齐 Card 数量与 SVG 图标（可改为 `lucide-vue-next` 图标以减样板代码）。

- [ ] **Step 3:** 跑 `pnpm dev`，完成 spec §7 四条验证标准。

- [ ] **Step 4（自行 commit）:** 例：`feat(nuxt): dashboard home skeleton`

---

### Task 8: 字体与扫尾

**Files:**
- 修改: `nuxt-template/nuxt.config.ts` 或 `app/app.vue` / `main.css`

- [ ] **Step 1:** 若 react 使用 Inter / Manrope，择一：通过 `main.css` `@import url(...)` 或 `@nuxt/fonts` 模块加载；保证 `body` 字体与模板接近。

- [ ] **Step 2:** `pnpm run build`（或 `nuxi build`）无错误。

- [ ] **Step 3（自行 commit）:** 例：`chore(nuxt): fonts and build sanity`

---

## Spec 覆盖核对（自检）

| Spec 章节 | 对应任务 |
|-----------|----------|
| §4 路由与守卫 | Task 3–4、6–7 |
| §5.1 主题 token | Task 2、8 |
| §5.2 壳层（Search 省略、ConfigDrawer 省略、ThemeSwitch 保留） | Task 5 |
| §5.3 Dashboard 骨架 | Task 7 |
| §6 非目标 | 未安排 Command/Clerk/API |
| §7 验证标准 | Task 4 Step 3、Task 6–7 |

**Placeholder 扫描:** 计划内无 TBD/TODO 式模糊步骤；具体组件 import 以 shadcn-vue 生成路径为准属环境差异，执行时按 IDE 提示修正。

**命名一致性:** cookie 名全程 `na_session`，取值 `'1'`；`getAuthRedirect` 与中间件共用。

---

## 执行交接

计划已保存到 `docs/superpowers/plans/2026-05-14-nuxt-shell.md`。执行方式可选：

1. **Subagent-Driven（推荐）** — 每任务派生子代理，任务间审查，迭代快  
2. **Inline Execution** — 本会话用 executing-plans 批量执行并设检查点  

请选择 **1** 或 **2**。
