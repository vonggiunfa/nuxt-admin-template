# Nuxt 认证表单校验与交互 — 对标 react-template — 设计说明

**日期**：2026-05-14  
**状态**：已实现（vee-validate + `@vee-validate/zod`，zod **3.x** 以满足 `@vee-validate/zod` peer）  
**范围**：`nuxt-template` 的 **`/sign-in` + `/sign-up`** 表单：**校验文案、字段级报错、异步提交反馈（toast / loading）、控件与版面结构**，以仓库内 **`react-template`** 的 `user-auth-form.tsx`、`sign-up-form.tsx` 为**行为规范基准**（非视觉 token 的唯一权威；视觉仍以 `docs/design-system.md` + `main.css` 为准）。  
**不包含**：真实后端/API、OAuth 真实对接、Forgot password 完整业务流（见 §4）。

---

## 1. 现状差异（已对读代码）

| 维度 | react-template | nuxt-template（对齐前基线） |
|------|----------------|----------------------|
| 校验 | `zod` + `react-hook-form`，`FormMessage` 英文字段错误 | HTML `required`，浏览器原生提示 |
| Sign up 密码一致性 | `.refine` + `confirmPassword` 下展示 **Passwords don't match.** | 不一致时 **静默 return**，无反馈 |
| 提交反馈 | `toast.promise(sleep(2000), …)`，按钮 **loading / disabled** | 无 toast、无 loading |
| 密码输入 | `PasswordInput`（显隐切换 + a11y 文案） | 普通 `<Input type="password">` |
| Sign in 版面 | Forgot password、`Or continue with` + OAuth 占位按钮 | 无 |
| Sign in 跳转 | `redirect` search 传给表单，成功 `navigate` 目标路径 | 无 query |
| Sign up 成功 | Mock：仅 toast **无**写入 auth、无跳转 | Mock：直接 `login()` + 跳转 `/` |

---

## 2. 备选实现路径（2～3）

| 方案 | 做法 | 优点 | 缺点 |
|------|------|------|------|
| **A（推荐）** | **vee-validate** + **`@vee-validate/zod`** + **zod 3.x**（`@vee-validate/zod` 当前 peer 为 zod v3），接入 shadcn-vue 形态的 **Form* 封装**（与官方组件树一致：`FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormMessage`）； **`vue-sonner`** 做 toast | 与 shadcn-vue / Vue 社区惯例一致；后续业务表单可复制同一套边界 | 需新增依赖 + 增补 `components/ui/form` |
| **B** | 手写 `watch`/`ref`，仅在 `submit` 时 **zod** `safeParse`，自行渲染错误 | 依赖少 | 与 React 侧重「声明式字段状态」分叉大，后续表单维护成本高 |
| **C** | **@tanstack/vue-form** + zod | API 现代化 | shadcn-vue 生态示例少，对齐成本偏高 |

**推荐**：**方案 A**，作为 Nuxt 侧「可复制模板」的起点。

---

## 3. 目标行为（对齐 react-template）

### 3.1 共用规则

1. **Schema 与英文字符串**：与 react 两处表单 **语义一致**；Nuxt 端因 **zod v3** 使用 `z.string().min(1, …).email()` 等写法（与 react 的 `z.email({ error: … })` 效果等价：空串 / 非法邮箱均有可见英文错误）。
2. **校验触发**：与 react-hook-form 默认心智一致：**提交时**校验并展示字段错误（若 vee 默认与 RHF 有细微差异，以「首次提交后立即在字段下方见 `FormMessage`」为准）。
3. **异步 MOCK**：沿用 **`sleep(2000)`** 语义（可在 `~/utils/index` 或现有 `cn` 同文件导出，与 react `lib/utils` 对齐）。
4. **Toast**：`toast.promise(delay, { loading / success / error })` **文案对齐** react（Sign in：**Signing in…** / **Welcome back, ${email}!**；Sign up：**Creating account…** / **Account created for ${email}.**）。
5. **加载态**：提交进行中主按钮 **disabled**，内联 **Lucide spinner**（与 react Loader2 + 图标区布局一致）。
6. **控件**：Vue 侧新增 **`PasswordInput.vue`**（结构/语义对齐 `password-input.tsx`：`Button type="button"`、`sr-only`、`Eye`/`EyeOff`）。
7. **版面**：Sign in 增补 **Forgot password?** 链到 **`/forgot-password`**，以及 **「Or continue with」分隔 + OAuth 双按钮（type="button"，loading 同 disabled）**；栅格/`gap`、`class` **对标** react（`gap-3`、`mt-2` 等与现有 Tailwind 一致处照抄）。
8. **OAuth / Forgot**：仍为 **占位**（不入真实 SSO）；Forgot **首版仅占位页**，避免外链 404（见 §4）。

### 3.2 Sign in 专有

- 成功 MOCK：继续写入现有 **`useAuthSession`**（cookie `na_session === '1'`），再 **`navigateTo`**：`useRoute().query.redirect` **字符串**，若为相对站内路径则用其，否则回退 **`/`**（对标 `redirectTo`，防开放重定向：**仅允许以 `/` 开头的 pathname**）。
- 若表单实现需要「用户占位信息」才能把欢迎语写满：可仅存于 composable toast 文案中的 `email`；**不要求**看齐 React **zustand** 的用户结构。

### 3.3 Sign up 专有

- 成功 MOCK：与 react **一致** — **仅** success toast；**不写 session、不 navigate**（需在规格实现时 **改写**现有 `SignUpForm` 成功后 `login()` 行为）。
- 失败 / 校验失败：不出现 success toast。

---

## 4. Forgot password 范围

| 首期 | 说明 |
|------|------|
| 新增 **`/forgot-password` 占位页** | 沿用 `AuthLayout` + Card，文案说明为占位，`NuxtLink` 返回 `/sign-in`；不要求复制 react 的 **`forgot-password-form` 全流程**。 |

远期可选：对齐 `react-template/src/features/auth/forgot-password`。

---

## 5. 依赖与挂载

- **`zod` 3.x**（与 `@vee-validate/zod` peer 一致）、**`vee-validate`**、**`@vee-validate/zod`**。
- **`vue-sonner`**：`app/app.vue` 根级挂载 **`Toaster`**（或库文档推荐布局），必要时在 `assets/css` 中与主题兼容。

---

## 6. 文档与 Cursor 规则（实现阶段落盘）

### 6.1 增补 `docs/design-system.md`

- 在 §2「双模板统一结论」增加一行：**表单字段校验与用户可见错误、提交后的 toast/loading MOCK 语义，对标 `react-template` 中与该页对应的表单实现；视觉 token 仍以本文 + `main.css` 为准。**

### 6.2 新增 `.cursor/rules/forms-paradigm.mdc`

**建议 globs**：`**/components/**/*Form*.vue`、`**/pages/**/*.vue`、`**/features/**`（若无则仅用前两段）。

**硬性摘要**：

1. **新表单 / 中大改**：优先 **vee-validate + zod**，字段错误用 **`FormMessage`**（或项目内等价），**禁止**仅依赖原生 `required` + 无障碍缺失的控件完成业务校验 UX。
2. **文案**：与 **`react-template` 同源页面**对齐时 **英文字符串保持一致**（含 zod `.message`/email `error` 回调）。
3. **异步提交**：破坏性/主按钮在 pending 时应 **禁用 + 可见 loading**；长操作使用 **`toast.promise`** 范式（loading/success/error 三态）。
4. **密码**：需显隐时使用统一 **`PasswordInput`**，勿重复造仅样式不同的密码框。
5. **Sign in 成功**：须写会话并导航；**Sign up MOCK 成功**不得自动登录 — 与 react 一致。

---

## 7. 测试与验收

| 验收项 | 说明 |
|--------|------|
| `pnpm run build` | Nuxt 工程根通过 |
| Sign in | 空/错格式 email、短密码 → 英文字段错误，无导航无 success toast |
| Sign in | 合法提交 → loading ≈ 2s → success toast、`na_session` 写入、跳转（含合法 `?redirect=`） |
| Sign up | 不一致密码 → confirm 字段下错误文案 |
| Sign up | 合法提交 → toast 成功，**未**写入 session |
| 链接 | `/forgot-password` 可访问，Sign in 外链不 404 |

---

## 8. 与既有壳层 spec 的关系

`2026-05-14-nuxt-shell-design.md` 写明「静态提交后跳转」：本 spec **收窄** Sign up 的 MOCK 行为以匹配 react-template；**不改变** middleware 允许的公开路由集合（按需将 `/forgot-password` 加入 **公开路径**）。

---

**下一步**：请你审读本文件；确认无歧义后，再按 brainstorming 流程进入 **implementation plan**（writing-plans），再动代码。**不会**在本次由 agent 替你执行 git commit。
