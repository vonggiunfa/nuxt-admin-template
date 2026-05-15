# Nuxt Settings 对齐 react-template（仅 Profile / Account）— 设计规格

**日期**：2026-05-15  
**范围**：`nuxt-template` 复刻 `react-template` 的 Settings 体验（路由裁剪 + 中文文案 + 布局/交互对齐）。  
**NavUser 策略**：选项 **A** — 下拉结构与 React **同级对齐**：保留「升级到专业版」占位分组；**账户** → `/settings/account`；**账单** → `/settings`（保留 React 命名与跳转语义）；**移除** Notifications；文案中文。

---

## 1. 路由

| 路径 | 页面 | 备注 |
|------|------|------|
| `/settings` | Profile（默认） | 对标 `routes/_authenticated/settings/index.tsx` |
| `/settings/account` | Account | 对标 `routes/_authenticated/settings/account.tsx` |

**不实现**：`/settings/appearance`、`/settings/notifications`、`/settings/display`。

所有设置页：`definePageMeta({ layout: 'authenticated' })`。

---

## 2. 页面壳（对标 `features/settings/index.tsx`）

父级：`app/pages/settings.vue`（或等价嵌套路由父页），内含 `<NuxtPage />`。

外层 DOM 与 `app/pages/users/index.vue` 一致思路：`flex min-h-0 flex-1 flex-col`，内嵌：

- `AppHeader`
- `AppMain`，**`layout="fixed"`**（对齐 React `Main fixed` → `data-layout="fixed"` + **grow / overflow-hidden** 语义链）

标题区：

- `space-y-0.5`
- `h1`：`text-2xl font-bold tracking-tight md:text-3xl`，文案：**设置**
- `p`：`text-muted-foreground`，中文含义对齐英文 *Manage your account settings and set e-mail preferences.*

`Separator`：`class="my-4 lg:my-6"`。

主体栅格：

```txt
flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12
```

- `aside`：`top-0 lg:sticky lg:w-1/5`，内放侧栏导航组件。
- 右侧：`flex w-full overflow-y-hidden p-1`，内嵌 `<NuxtPage />`。

---

## 3. 侧栏导航（对标 `sidebar-nav.tsx`）

组件建议：`app/features/settings/components/SettingsSidebarNav.vue`。

行为与样式：

- **`< md`**：`Select`，`SelectTrigger` **`h-12 sm:w-48`**；`onValueChange` 调用路由跳转；**`SelectValue` 占位**改为中文（对齐交互，不等同 React 错误文案「Theme」）。
- **`≥ md`**：`ScrollArea` **`orientation="horizontal"`**、`type="always"`、`hidden … md:block`；内部 `nav`：**`flex space-x-2 … lg:flex-col lg:space-y-1 lg:space-x-0`**。
- 链接：`buttonVariants({ variant: 'ghost' })` + 当前路径 **`pathname === href`** 时 **`bg-muted hover:bg-accent`**，否则 **`hover:bg-accent hover:underline`** + **`justify-start`**。
- **两项**：`/settings`（`UserCog`）、`/settings/account`（`Wrench`）。图标 **`lucide-vue-next`**。

路由同步：`Select` 选中值须与 **`route.path`** 同步（进入页、`router.replace` 后更新）。

---

## 4. 内容区块（对标 `content-section.tsx`）

组件建议：`SettingsContentSection.vue`。

结构：

- `flex flex-1 flex-col`
- 头部：`h3` `text-lg font-medium`，`p` `text-sm text-muted-foreground`
- `Separator`：`my-4 flex-none`
- 滚动：`faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12`
- 内层：`-mx-1 px-1.5 lg:max-w-xl`

Profile / Account 各自传入中文 **title / desc**：

- Profile：含义对齐 *This is how others will see you on the site.*
- Account：含义对齐 *Update your account settings. Set your preferred language and timezone.*（表单若无时区字段，文案仍可与 React 保持一致性说明）

---

## 5. Profile 表单（对标 `profile-form.tsx`）

文件建议：`app/features/settings/profile/ProfileForm.vue`（或由薄封装页面引用）。

- **vee-validate + `@vee-validate/zod`**，`toTypedSchema`，校验规则与 React **等价**（用户名 2–30、bio 4–160、urls 可选数组、`email` 必选）。
- 校验提示：**中文**。
- **URLs**：`useFieldArray`；「添加 URL」：`Button variant="outline" size="sm" class="mt-2"`。
- **首个 URL 以外**：`FormLabel` / `FormDescription` 使用 **`sr-only`**，`FormControl` 上添 **`mt-1.5`**（与 React **`cn(index !== 0 && …)`** 一致）。
- **Email**：`Select` + 三个静态选项（与 React 相同 value）。
- **Bio**：**`Textarea`** **`resize-none`** — 若项目尚无 `components/ui/textarea`，按 shadcn-vue 增补。
- **描述中的链接**：`<NuxtLink to="/">` + 中文说明。
- **提交**：调用 **`showSubmittedData`**（见 §7）。

---

## 6. Account 表单（对标 `account-form.tsx`）

文件建议：`app/features/settings/account/AccountForm.vue`。

- Schema：姓名 2–30、`dob` **必填 Date**、`language` 必填字符串。
- **DatePicker**（对齐 `react-template/src/components/date-picker.tsx`）：
  - **Popover + Button + Calendar**
  - Button：**`variant="outline"`**、**`w-60`**、**`justify-start`**、**`font-normal`**、未选中日期的 **`text-muted-foreground`**（可用 **`data-empty`** 或等价绑定）
  - Calendar：**`mode="single"`**、`captionLayout="dropdown"`、`disabled`：**禁止未来日期**与 **`1900-01-01`** 之前
  - 展示格式：与 React 一致采用 **`date-fns` `format`**；**locale 默认 `zh-CN`**（全局中文策略），以便界面日期可读。
- **语言**：**Popover + Button（combobox）+ Command**，选项 **`label` 中文化**，**`value` 保留语言代码**；选中 **`Check`** 显隐逻辑与 React **一致**。
- 图标：**Lucide `ChevronsUpDown` / `Check`**（对标 Radix `CaretSortIcon` / `CheckIcon`）。
- **提交**：`showSubmittedData`。

实现前置：**新增 Calendar + DatePicker 封装组件**；按需 **`pnpm add date-fns`**。

---

## 7. `showSubmittedData`（对标 `show-submitted-data.tsx`）

新建：`app/lib/showSubmittedData.ts`。

- 使用 **`vue-sonner`**：`toast.message(标题, { description })`。
- **标题默认**：中文，语义对齐 *You submitted the following values:*
- **description**：含格式化后的 **`JSON.stringify(data, null, 2)`** 的 `<pre>`（Tailwind：`mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4` + `code text-white`）；若 sonner 描述仅接受字符串，则用 **`\`\`\`json\`\`\``** 包裹字符串作为降级（实现计划在落地时选定其一并在代码评审中确认可读性）。

---

## 8. NavUser（选项 A）

文件：`app/components/layout/NavUser.vue`。

结构与 React **`nav-user.tsx`** 对齐：

1. **DropdownMenuGroup**：「升级到专业版」+ `Sparkles`（无 `asChild`，纯占位点击，与 React 一致）。
2. **Separator**
3. **DropdownMenuGroup**：
   - **账户**：`BadgeCheck`，`<NuxtLink to="/settings/account">`
   - **账单**：`CreditCard`，`<NuxtLink to="/settings">`**（刻意对齐 React 标签与路径错位）**
4. **移除** Notifications。
5. **Separator** + **退出登录**（destructive 样式对标 React `variant='destructive'` 若组件支持）。

侧边 **`side`** / **`align`**：在可与 React **一致**的前提下使用现有 **`useSidebar`**（若 Nuxt Sidebar 已暴露 `isMobile`）；否则保留当前底部对齐行为并在实现计划中标注差距。

---

## 9. 主导航 AppSidebar

在 `AppSidebar.vue` 增加 **Settings** 分组（对标 `sidebar-data` 子集）：

- **仅子项**：个人资料 → `/settings`，账户 → `/settings/account`
- 交互形态与现有侧边栏组件能力一致（折叠子菜单或单列链接 —— 实现计划选择最少偏离现有组件的模式）。

---

## 10. CommandMenu（推荐）

`CommandMenu.vue` 的「导航」组增加：

- 个人资料 → `/settings`
- 账户 → `/settings/account`

---

## 11. 与 React 顶栏差异（非本 spec 强制）

React Settings **`Header`** 含 **Search / ThemeSwitch / ConfigDrawer / ProfileDropdown**。Nuxt 当前 **`AppHeader`** 遵循既有壳规格：**不包含 ConfigDrawer**（参见 `docs/superpowers/specs/2026-05-15-nuxt-shell-header-parity-design.md`）。设置页 **沿用现有 `AppHeader`**，不为本任务引入 ConfigDrawer。

---

## 12. 验收标准（手可测）

1. **`/settings`**、**`/settings/account`** 在 **authenticated** 壳内渲染；**移动端** Select、**桌面端**纵向 ghost 导航；激活态样式符合 §3。
2. **Profile**：校验、动态 URL、「添加 URL」、邮箱下拉、Bio **`Textarea`**、提交 toast JSON。
3. **Account**：日期约束、语言 combobox、提交 toast JSON。
4. **NavUser**：第 8 节结构与跳转正确；无 Notifications。
5. **AppSidebar** 可见设置入口且仅有 **两项**子路由。
6. **全文中文**（含校验、占位、按钮：如「更新资料」「更新账户」）。

---

## 13. 自检记录

- **占位符**：无 TBD。
- **一致性**：NavUser「账单」指向 `/settings` 为 **刻意对齐 React**，已在 §8 写明。
- **范围**：单实现计划可覆盖；Calendar/Textarea/DatePicker 为必要增量。
- **歧义**：日期格式默认 **`zh-CN`**；若要求与英文 **`MMM d, yyyy`** 完全一致，可在实现计划中改为 `en-US`。
