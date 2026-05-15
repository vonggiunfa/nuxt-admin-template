# Nuxt Settings 对齐 react-template（Profile / Account）— 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务顺序执行。步骤使用 checkbox（`- [ ]`）跟踪。

**Goal:** 落地 spec `docs/superpowers/specs/2026-05-15-nuxt-settings-react-parity-design.md`：新增 `/settings` 与 `/settings/account`（authenticated）、中文文案与交互对齐 React Settings（壳 + `SidebarNav` + `ContentSection` + Profile / Account 表单）、NavUser 选项 A、侧栏设置入口与命令面板导航、`showSubmittedData` toast。

**Architecture:** `pages/settings.vue` 作为嵌套父页渲染 **`AppHeader` + `AppMain layout=\"fixed\"`** 与静态标题栅格，`<NuxtPage />` 承载子路由；业务组件集中于 **`app/features/settings/`**（导航、`ContentSection`、表单）；新增 **`app/lib/showSubmittedData.ts`**；Account 所需 **Calendar / Textarea** 通过 shadcn-vue CLI 引入，`DatePicker.vue` 在 **`modelValue: Date | undefined`** 与 **`Calendar` 的 `DateValue`** 之间桥接；全局 **`utils/authRedirect.ts`** 扩展未登录访问 `/settings` 前缀时的跳转。

**Tech Stack:** Nuxt 4、Vue 3、TypeScript、Tailwind v4、vee-validate、`@vee-validate/zod`、zod 3.x、shadcn-vue / reka-ui、`@internationalized/date`（Calendar 生成物依赖）、**date-fns**（可选：`DateFormatter` 已够用时可不用于展示）、`vue-sonner`、`lucide-vue-next`。

**仓库惯例:** 计划中标注「自行 commit」的步骤由实现者本地执行；**不代用户提交**。

---

## 文件结构（将创建 / 修改）

| 路径 | 职责 |
|------|------|
| 修改 `utils/authRedirect.ts` | `!authed` 时对 **`path === '/settings' || path.startsWith('/settings/')`** 重定向 `/sign-in`，与 `/`、`/users` 同级 |
| 创建 `app/lib/showSubmittedData.ts` | `toast.message` + JSON 描述字符串（对齐 react sonner 展示意图） |
| 创建 `app/lib/settingsSchemas.ts`（或拆分 profile/account 两文件） | Profile / Account 的 **zod** schema + Account **语言常量**（label 中文、value 保留语言代码） |
| 创建 `app/components/DatePicker.vue` | Popover + Button（`w-60`、`outline`、`font-normal`、未选 `text-muted-foreground`）+ Calendar（`layout=\"month-and-year\"`** **等价 React `captionLayout=\"dropdown\"`**）、**禁用 `< 1900-01-01` 与未来日期**、`DateFormatter('zh-CN')` |
| CLI 创建 `app/components/ui/calendar/**`、`app/components/ui/textarea/**` | `pnpm dlx shadcn-vue@latest add calendar textarea` |
| 修改 `package.json` | **`pnpm add date-fns`**（若团队希望在 toast / 调试中与 react 对齐可选用；**展示以 `DateFormatter` 为主**）；CLI 通常会写入 **`@internationalized/date`** |
| 创建 `app/features/settings/components/SettingsContentSection.vue` | 对标 `content-section.tsx` |
| 创建 `app/features/settings/components/SettingsSidebarNav.vue` | 对标 `sidebar-nav.tsx`（两项、`Select` + `ScrollArea` + ghost **RouterLink**） |
| 创建 `app/features/settings/profile/ProfileForm.vue` | vee-validate + `useFieldArray(urls)` + 中文校验与默认占位 |
| 创建 `app/features/settings/account/AccountForm.vue` | 姓名 / DatePicker / 语言 Combobox（Popover + Command + Check） |
| 创建 `app/pages/settings.vue` | 父页壳 + `<NuxtPage />`、`definePageMeta({ layout: 'authenticated' })` |
| 创建 `app/pages/settings/index.vue` | Profile：`SettingsContentSection` + `ProfileForm` |
| 创建 `app/pages/settings/account.vue` | Account：`SettingsContentSection` + `AccountForm` |
| 修改 `app/components/layout/NavUser.vue` | 选项 A：`Sparkles` 升级占位、`BadgeCheck`→`/settings/account`、`CreditCard`→`/settings`、移除 Notifications、`useSidebar().isMobile` 调整 **`DropdownMenuContent` `side`**（对标 react）、退出 **`variant=\"destructive\"`** |
| 修改 `app/components/layout/AppSidebar.vue` | 新 **`SidebarGroup`**：**分组标题「设置」** + **两条** `SidebarMenuButton`/`NuxtLink`（`/settings`、`/settings/account`），**最少偏离**：不设折叠也可接受 |
| 修改 `app/components/layout/CommandMenu.vue` | 「导航」组增加「个人资料」「账户」跳转 |

---

### Spec 覆盖自检（编写后）

| Spec § | 对应任务 |
|--------|-----------|
| 路由 | Task 8、Task 9 |
| 页面壳 | Task 8 |
| 侧栏导航 | Task 4 |
| ContentSection | Task 3 |
| Profile | Task 5、Task 8 |
| Account + DatePicker | Task 2、Task 6、Task 8 |
| showSubmittedData | Task 1 |
| NavUser A | Task 10 |
| AppSidebar | Task 11 |
| CommandMenu | Task 12 |
| auth `/settings` | Task 9 |
| 手工验收 | Task 13 |

---

### Task 1: `showSubmittedData`

**Files:**

- 创建: `nuxt-template/app/lib/showSubmittedData.ts`

- [ ] **Step 1:** 新建 `showSubmittedData.ts`：

```ts
import { toast } from 'vue-sonner'

const DEFAULT_TITLE = '您提交了以下数据：'

/** 对标 react-template `show-submitted-data.tsx`：toast 展示提交负载（MOCK）。 */
export function showSubmittedData(data: unknown, title: string = DEFAULT_TITLE) {
  const description = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
  toast.message(title, { description })
}
```

- [ ] **Step 2:** `pnpm exec vue-tsc --noEmit`（在 `nuxt-template` 目录）。

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm exec vue-tsc --noEmit
```

预期：无新增类型错误。

- [ ] **Step 3（自行 commit）:** `feat(nuxt): add showSubmittedData helper`

---

### Task 2: shadcn-vue `calendar` + `textarea`

**Files:**

- 创建: `nuxt-template/app/components/ui/calendar/`（CLI）
- 创建: `nuxt-template/app/components/ui/textarea/`（CLI）
- 修改: `nuxt-template/package.json`、`pnpm-lock.yaml`

- [ ] **Step 1:** 执行 CLI：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm dlx shadcn-vue@latest add calendar textarea
```

预期：无报错；`app/components/ui/calendar`、`textarea` 目录存在。

- [ ] **Step 2:** 运行：

```bash
cd /Users/wangjh/Desktop/shadcn-admin/nuxt-template && pnpm exec nuxt prepare && pnpm build
```

预期：`build` 成功。

- [ ] **Step 3（自行 commit）:** `chore(nuxt): add calendar and textarea ui`

---

### Task 3: `SettingsContentSection.vue`

**Files:**

- 创建: `nuxt-template/app/features/settings/components/SettingsContentSection.vue`

- [ ] **Step 1:** 新建组件（完整文件）：

```vue
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

defineProps<{
  title: string
  desc: string
}>()
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex-none">
      <h3 class="text-lg font-medium">
        {{ title }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ desc }}
      </p>
    </div>
    <Separator class="my-4 flex-none" />
    <div class="faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12">
      <div class="-mx-1 px-1.5 lg:max-w-xl">
        <slot />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 3（自行 commit）:** `feat(nuxt): add SettingsContentSection`

---

### Task 4: `SettingsSidebarNav.vue`

**Files:**

- 创建: `nuxt-template/app/features/settings/components/SettingsSidebarNav.vue`

- [ ] **Step 1:** 新建组件（完整文件）。说明：`SelectItem` 的 **`value`** 必须与 **`href`** 完全一致（`/settings`、`/settings/account`），便于 `router.push`。

```vue
<script setup lang="ts">
import type { Component } from 'vue'
import { UserCog, Wrench } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Item = { title: string; href: string; icon: Component }

const items: Item[] = [
  { title: '个人资料', href: '/settings', icon: UserCog },
  { title: '账户', href: '/settings/account', icon: Wrench },
]

const route = useRoute()
const router = useRouter()

const selectModel = ref(route.path)

watch(
  () => route.path,
  (p) => {
    selectModel.value = p
  },
)

function onSelect(href: string) {
  selectModel.value = href
  router.push(href)
}
</script>

<template>
  <div>
    <div class="p-1 md:hidden">
      <Select :model-value="selectModel" @update:model-value="onSelect">
        <SelectTrigger class="h-12 sm:w-48">
          <SelectValue placeholder="选择设置小节" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in items" :key="item.href" :value="item.href">
            <div class="flex gap-x-4 px-2 py-1">
              <span class="scale-125">
                <component :is="item.icon" class="size-[18px]" />
              </span>
              <span class="text-md">
                {{ item.title }}
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <ScrollArea
      orientation="horizontal"
      type="always"
      class="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
    >
      <nav class="flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0">
        <NuxtLink
          v-for="item in items"
          :key="item.href"
          :to="item.href"
          :class="cn(
            buttonVariants({ variant: 'ghost' }),
            route.path === item.href
              ? 'bg-muted hover:bg-accent'
              : 'hover:bg-accent hover:underline',
            'justify-start',
          )"
        >
          <span class="me-2">
            <component :is="item.icon" class="size-[18px]" />
          </span>
          {{ item.title }}
        </NuxtLink>
      </nav>
    </ScrollArea>
  </div>
</template>
```

- [ ] **Step 2:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 3（自行 commit）:** `feat(nuxt): add SettingsSidebarNav`

---

### Task 5: Profile schema + `ProfileForm.vue`

**Files:**

- 创建: `nuxt-template/app/lib/settingsSchemas.ts`
- 创建: `nuxt-template/app/features/settings/profile/ProfileForm.vue`

- [ ] **Step 1:** 新建 `settingsSchemas.ts`：

```ts
import * as z from 'zod'

export const profileFormSchema = z.object({
  username: z
    .string({ required_error: '请输入用户名' })
    .min(2, '用户名至少 2 个字符')
    .max(30, '用户名不能超过 30 个字符'),
  email: z.string({ required_error: '请选择展示邮箱' }).min(1, '请选择展示邮箱').email('邮箱格式不正确'),
  bio: z.string().min(4, '简介至少 4 个字符').max(160, '简介不能超过 160 个字符'),
  urls: z
    .array(
      z.object({
        value: z.string().url('请输入有效 URL'),
      }),
    )
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const profileDefaultValues: Partial<ProfileFormValues> = {
  bio: '我拥有一台电脑。',
  urls: [{ value: 'https://shadcn.com' }, { value: 'http://twitter.com/shadcn' }],
}
```

- [ ] **Step 2:** 新建 `ProfileForm.vue`（完整代码见下方代码块）。要点：**`FieldArray`** 必须从 **`vee-validate`** 导入（**`@/components/ui/form`** 未导出 **`FieldArray`**）；**`Form`** 使用 `:validation-schema="toTypedSchema(profileFormSchema)"`**；**首个 URL 项外** **`FormLabel` / `FormDescription` 加 `sr-only`**，`FormControl` 加 **`mt-1.5`**；邮箱描述中含 **`NuxtLink to="/"`**；提交调用 **`showSubmittedData`**。

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { SubmissionHandler } from 'vee-validate'
import { FieldArray } from 'vee-validate'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { profileDefaultValues, profileFormSchema, type ProfileFormValues } from '@/lib/settingsSchemas'
import { showSubmittedData } from '@/lib/showSubmittedData'

const typedSchema = toTypedSchema(profileFormSchema)

const onSubmit: SubmissionHandler<ProfileFormValues> = (values) => {
  showSubmittedData(values)
}
</script>

<template>
  <Form
    :validation-schema="typedSchema"
    :initial-values="profileDefaultValues"
    class="space-y-8"
    :on-submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>用户名</FormLabel>
        <FormControl>
          <Input placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          这是对外展示的昵称，可使用真实姓名或化名。每 30 天仅可修改一次。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <Select :model-value="componentField.modelValue" @update:model-value="componentField['onUpdate:modelValue']">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="选择用于展示的已验证邮箱" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">
              m@example.com
            </SelectItem>
            <SelectItem value="m@google.com">
              m@google.com
            </SelectItem>
            <SelectItem value="m@support.com">
              m@support.com
            </SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          你可以在<NuxtLink class="underline underline-offset-4" to="/">
            邮箱设置
          </NuxtLink>中管理已验证邮箱。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="bio">
      <FormItem>
        <FormLabel>简介</FormLabel>
        <FormControl>
          <Textarea
            placeholder="简单介绍一下你自己"
            class="resize-none"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          你可以使用 <span>@mention</span> 提及用户或组织以链接到对方。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FieldArray v-slot="{ fields, push }" name="urls">
      <div>
        <template v-for="(f, index) in fields" :key="f.key">
          <FormField v-slot="{ componentField }" :name="`urls.${index}.value`">
            <FormItem>
              <FormLabel :class="cn(index !== 0 && 'sr-only')">
                链接
              </FormLabel>
              <FormDescription :class="cn(index !== 0 && 'sr-only')">
                添加你的网站、博客或社交媒体链接。
              </FormDescription>
              <FormControl :class="cn(index !== 0 && 'mt-1.5')">
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </template>
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="mt-2"
          @click="push({ value: '' })"
        >
          添加 URL
        </Button>
      </div>
    </FieldArray>

    <Button type="submit">
      更新资料
    </Button>
  </Form>
</template>
```

- [ ] **Step 3:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 4（自行 commit）:** `feat(nuxt): add profile settings form`

---

### Task 6: `DatePicker.vue`

**Files:**

- 创建: `nuxt-template/app/components/DatePicker.vue`

依赖 Task 2 已生成的 **`Calendar`**。下列实现以 **`@internationalized/date`** 的 **`CalendarDate`、`DateValue`、`fromDate`、`getLocalTimeZone`、`today`、`DateFormatter`** 为准；若本地 **`Calendar`** 的 **`v-model`** 类型与 **`DateValue`** 不一致，以实现者 **`pnpm exec vue-tsc`** 报错为准微调 **`ref` 泛型**。

- [ ] **Step 1:** 新建 **`DatePicker.vue`**：

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  CalendarDate,
  DateFormatter,
  fromDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const props = defineProps<{
  /** 与 react-hook-form 一致：JS `Date`，便于 zod `z.date()` */
  modelValue?: Date | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date | undefined]
}>()

const tz = getLocalTimeZone()
const defaultPlaceholder = today(tz)
const minValue = new CalendarDate(1900, 1, 1)
const maxValue = today(tz)

const df = new DateFormatter('zh-CN', { dateStyle: 'medium' })

const inner = ref<DateValue | undefined>()

watch(
  () => props.modelValue,
  (d) => {
    inner.value = d ? fromDate(d, tz) : undefined
  },
  { immediate: true },
)

function onInnerUpdate(v: DateValue | undefined) {
  inner.value = v
  emit('update:modelValue', v ? v.toDate(tz) : undefined)
}

function disabledCalendarDate(d: DateValue) {
  const cal = d as CalendarDate
  return cal.compare(minValue) < 0 || cal.compare(maxValue) > 0
}
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :data-empty="!modelValue"
        :class="cn(
          'w-60 justify-start text-start font-normal',
          !modelValue && 'text-muted-foreground',
        )"
      >
        <span v-if="modelValue">{{ df.format(fromDate(modelValue, tz).toDate(tz)) }}</span>
        <span v-else>选择日期</span>
        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        :model-value="inner"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
        initial-focus
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-disabled="disabledCalendarDate"
        @update:model-value="(v: DateValue | undefined) => { onInnerUpdate(v); close() }"
      />
    </PopoverContent>
  </Popover>
</template>
```

- [ ] **Step 2:** 对照 **`Calendar.vue`** 实际 API：若组件使用 **`disabled`** Matcher 而非 **`is-date-disabled`**，或 **`min-value`/`max-value`** 命名不同，**以实现文件为准**替换等价 props（目标是：**禁止未来**与 **1900-01-01 之前**）。

- [ ] **Step 3:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 4（自行 commit）:** `feat(nuxt): add DatePicker component`

---

### Task 7: Account schema + `AccountForm.vue`

**Files:**

- 修改: `nuxt-template/app/lib/settingsSchemas.ts`
- 创建: `nuxt-template/app/features/settings/account/AccountForm.vue`

- [ ] **Step 1:** 在 **`settingsSchemas.ts`** 追加：

```ts
export const LANGUAGE_OPTIONS = [
  { label: '英语', value: 'en' },
  { label: '法语', value: 'fr' },
  { label: '德语', value: 'de' },
  { label: '西班牙语', value: 'es' },
  { label: '葡萄牙语', value: 'pt' },
  { label: '俄语', value: 'ru' },
  { label: '日语', value: 'ja' },
  { label: '韩语', value: 'ko' },
  { label: '中文', value: 'zh' },
] as const

export const accountFormSchema = z.object({
  name: z
    .string({ required_error: '请输入姓名' })
    .min(2, '姓名至少 2 个字符')
    .max(30, '姓名不能超过 30 个字符'),
  dob: z.date({ required_error: '请选择出生日期', invalid_type_error: '请选择出生日期' }),
  language: z.string({ required_error: '请选择语言' }).min(1, '请选择语言'),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>
```

- [ ] **Step 2:** 新建 **`AccountForm.vue`**（语言组合框对标 **`account-form.tsx`**：**Popover + Button `role=\"combobox\"` + Command**，选中 **`Check`** 显隐）。

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { SubmissionHandler } from 'vee-validate'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import DatePicker from '@/components/DatePicker.vue'
import { cn } from '@/lib/utils'
import { LANGUAGE_OPTIONS, accountFormSchema, type AccountFormValues } from '@/lib/settingsSchemas'
import { showSubmittedData } from '@/lib/showSubmittedData'

const typedSchema = toTypedSchema(accountFormSchema)

const languageOpen = ref(false)

const onSubmit: SubmissionHandler<AccountFormValues> = (values) => {
  showSubmittedData(values)
}
</script>

<template>
  <Form
    :validation-schema="typedSchema"
    :initial-values="{ name: '', dob: undefined, language: '' }"
    class="space-y-8"
    :on-submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>姓名</FormLabel>
        <FormControl>
          <Input placeholder="你的姓名" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          该姓名将展示在个人资料与邮件中。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>出生日期</FormLabel>
        <DatePicker
          :model-value="componentField.modelValue"
          @update:model-value="componentField['onUpdate:modelValue']"
        />
        <FormDescription>
          出生日期用于计算年龄。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="language">
      <FormItem class="flex flex-col">
        <FormLabel>语言</FormLabel>
        <Popover v-model:open="languageOpen">
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                :class="cn(
                  'w-50 justify-between',
                  !componentField.modelValue && 'text-muted-foreground',
                )"
              >
                {{
                  LANGUAGE_OPTIONS.find(l => l.value === componentField.modelValue)?.label
                    ?? '选择语言'
                }}
                <ChevronsUpDown class="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-50 p-0">
            <Command>
              <CommandInput placeholder="搜索语言…" />
              <CommandEmpty>未找到语言。</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  <CommandItem
                    v-for="lang in LANGUAGE_OPTIONS"
                    :key="lang.value"
                    :value="lang.label"
                    @select="() => {
                      componentField['onUpdate:modelValue'](lang.value)
                      languageOpen = false
                    }"
                  >
                    <Check
                      :class="cn(
                        'size-4',
                        lang.value === componentField.modelValue ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                    {{ lang.label }}
                  </CommandItem>
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <FormDescription>
          仪表盘中使用的界面语言。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">
      更新账户
    </Button>
  </Form>
</template>
```

- [ ] **Step 3:** **`w-50`** 为 Tailwind **任意值类**（对齐 react **`w-50`**）；若构建报错未识别，在 **`main.css`** 或 **`tailwind`** 配置中确认 **`w-50`** 已启用（或改用 **`w-[12.5rem]`**）。

- [ ] **Step 4:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 5（自行 commit）:** `feat(nuxt): add account settings form`

---

### Task 8: 页面路由 `pages/settings*.vue`

**Files:**

- 创建: `nuxt-template/app/pages/settings.vue`
- 创建: `nuxt-template/app/pages/settings/index.vue`
- 创建: `nuxt-template/app/pages/settings/account.vue`

- [ ] **Step 1:** 新建 **`settings.vue`**：

```vue
<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppMain from '@/components/layout/AppMain.vue'
import { Separator } from '@/components/ui/separator'
import SettingsSidebarNav from '@/features/settings/components/SettingsSidebarNav.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain layout="fixed">
      <div class="space-y-0.5">
        <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
          设置
        </h1>
        <p class="text-muted-foreground">
          管理账户信息与邮件偏好。
        </p>
      </div>
      <Separator class="my-4 lg:my-6" />
      <div class="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside class="top-0 lg:sticky lg:w-1/5">
          <SettingsSidebarNav />
        </aside>
        <div class="flex w-full overflow-y-hidden p-1">
          <NuxtPage />
        </div>
      </div>
    </AppMain>
  </div>
</template>
```

- [ ] **Step 2:** 新建 **`settings/index.vue`**：

```vue
<script setup lang="ts">
import SettingsContentSection from '@/features/settings/components/SettingsContentSection.vue'
import ProfileForm from '@/features/settings/profile/ProfileForm.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <SettingsContentSection
    title="个人资料"
    desc="此处展示的信息将对站内其他用户可见。"
  >
    <ProfileForm />
  </SettingsContentSection>
</template>
```

- [ ] **Step 3:** 新建 **`settings/account.vue`**：

```vue
<script setup lang="ts">
import SettingsContentSection from '@/features/settings/components/SettingsContentSection.vue'
import AccountForm from '@/features/settings/account/AccountForm.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <SettingsContentSection
    title="账户"
    desc="更新账户设置，设置首选语言与时区。"
  >
    <AccountForm />
  </SettingsContentSection>
</template>
```

- [ ] **Step 4:** `pnpm build`

预期：`build` 成功。

- [ ] **Step 5（自行 commit）:** `feat(nuxt): add settings pages shell`

---

### Task 9: 扩展 `authRedirect`（守卫 `/settings`）

**Files:**

- 修改: `nuxt-template/utils/authRedirect.ts`

- [ ] **Step 1:** 将 **`!authed`** 分支改为（保留原有 `/`、`/users` 逻辑）：

```ts
  if (
    !authed
    && (path === '/' || path === '/users' || path === '/settings' || path.startsWith('/settings/'))
  )
    return { redirect: '/sign-in' }
```

- [ ] **Step 2:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 3（自行 commit）:** `fix(nuxt): protect settings routes when logged out`

---

### Task 10: `NavUser.vue`（选项 A）

**Files:**

- 修改: `nuxt-template/app/components/layout/NavUser.vue`

- [ ] **Step 1:** 引入 **`BadgeCheck`、`CreditCard`、`Sparkles`**（**lucide-vue-next**）、**`DropdownMenuGroup`**、**`useSidebar`**（**`@/components/ui/sidebar`**）。

- [ ] **Step 2:** 在 **`DropdownMenuLabel`** 与 **退出** 之间插入：

  - **`DropdownMenuGroup`**：**「升级到专业版」** + **`Sparkles`**（无 **`as-child`**，纯 **`DropdownMenuItem`**）。
  - **`DropdownMenuSeparator`**
  - **`DropdownMenuGroup`**：
    - **`DropdownMenuItem as-child`** + **`NuxtLink`** **`to=\"/settings/account\"`**：**账户** + **`BadgeCheck`**
    - **`DropdownMenuItem as-child`** + **`NuxtLink`** **`to=\"/settings\"`**：**账单** + **`CreditCard`**
  - **`DropdownMenuSeparator`**

- [ ] **Step 3:** **`DropdownMenuContent`** 增加 **`:side=\"isMobile ? 'bottom' : 'right'\"`**（从 **`useSidebar()`** 解构 **`isMobile`**），**`align=\"end\"`**、**`:side-offset=\"4\"`**（与 react **`nav-user.tsx`** 对齐意图）。

- [ ] **Step 4:** **退出登录**项：**`variant=\"destructive\"`**，保留 **`SignOutDialog`** 行为。

- [ ] **Step 5:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 6（自行 commit）:** `feat(nuxt): align NavUser with settings links`

---

### Task 11: `AppSidebar.vue` 设置分组

**Files:**

- 修改: `nuxt-template/app/components/layout/AppSidebar.vue`

- [ ] **Step 1:** 在 **`SidebarContent`** 内现有 **`SidebarGroup`（菜单）之后**，追加 **`SidebarGroup`**：**`SidebarGroupLabel`** 文案 **「设置」**；其下 **`SidebarMenu`** 两条 **`SidebarMenuItem`**：**`NuxtLink`** **`/`settings`**（**个人资料**，图标 **`UserCog`**）、**`/settings/account`**（**账户**，图标 **`Wrench`**）；**`:is-active`** 分别 **`route.path === '/settings'`**（或按需 **`startsWith`**，避免后续子路由误判）、**`route.path === '/settings/account'`**。

- [ ] **Step 2:** `pnpm exec vue-tsc --noEmit`

- [ ] **Step 3（自行 commit）:** `feat(nuxt): add settings links to AppSidebar`

---

### Task 12: `CommandMenu.vue` 导航项

**Files:**

- 修改: `nuxt-template/app/components/layout/CommandMenu.vue`

- [ ] **Step 1:** 在 **「导航」** **`CommandGroup`** 增加两项 **`CommandItem`**：

```vue
        <CommandItem
          value="个人资料"
          @select="runCommand(() => navigateTo('/settings'))"
        >
          <div class="flex size-4 items-center justify-center">
            <ArrowRight class="size-2 text-muted-foreground/80" />
          </div>
          个人资料
        </CommandItem>
        <CommandItem
          value="账户"
          @select="runCommand(() => navigateTo('/settings/account'))"
        >
          <div class="flex size-4 items-center justify-center">
            <ArrowRight class="size-2 text-muted-foreground/80" />
          </div>
          账户
        </CommandItem>
```

- [ ] **Step 2:** `pnpm build`

- [ ] **Step 3（自行 commit）:** `feat(nuxt): add settings to command menu`

---

### Task 13: 手工验收（对标 spec §12）

- [ ] **Step 1:** `pnpm dev`，登录态访问 **`/settings`**、**`/settings/account`**：移动端 **`Select`**、桌面端 **`SidebarNav`** 激活态与 **`Router`** 切换正确。
- [ ] **Step 2:** Profile：**校验文案中文**、**动态 URL**、**邮箱下拉**、**简介 Textarea**、提交 **toast** 含 JSON。
- [ ] **Step 3：** Account：**日期不可选未来 / 1900 前**、语言检索与勾选样式、提交 toast。
- [ ] **Step 4：** **`NavUser`**：升级占位、账户 / 账单跳转、无 Notifications；未登录访问 **`/settings`** → **`/sign-in`**。
- [ ] **Step 5：** **CommandPalette**：两项导航可达。

---

## 计划自检（编写者）

1. **Spec coverage：** spec §1–§12 均已映射到 Task 1–13 与文件表；§11（ConfigDrawer）明确不在范围。
2. **占位符扫描：** 无 TBD；「以实现文件为准」仅出现在 Calendar API 对齐处，且附带 **`vue-tsc`** 纠错路径。
3. **类型一致性：** **`ProfileFormValues` / `AccountFormValues`** 均出自 **`settingsSchemas.ts`**；**`showSubmittedData`** 接收表单 **`values`**。
4. **已知风险：** **`Calendar`** 的禁用 / min-max / **`is-date-disabled`** props 命名；均以 **`vue-tsc`** 与 **`pnpm build`** 为门禁在现场收敛。

---

**Plan complete，已保存至 `docs/superpowers/plans/2026-05-15-nuxt-settings-react-parity.md`。**

执行方式任选其一：

**1. Subagent-Driven（推荐）** — 每个 Task 单独派生子代理，Task 间人工复核，迭代快。  
**2. Inline Execution** — 本会话按 Task 顺序直接改代码，批次检查点复核。

你要用哪一种？
