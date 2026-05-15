<script setup lang="ts">
import type { InferType } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { SubmissionHandler } from 'vee-validate'
import * as z from 'zod'
import PasswordInput from '@/components/PasswordInput.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { roles } from '../data/data'
import { useUsersWorkspace } from '../composables/useUsersWorkspace'
import type { User } from '../schema'

const props = defineProps<{
  open: boolean
  currentRow?: User | null
}>()

const emits = defineEmits<{
  'update:open': [boolean]
}>()

const { addUser, updateUser } = useUsersWorkspace()

const isEdit = computed(() => !!props.currentRow)

const roleValues = roles.map(r => r.value) as unknown as readonly [User['role'], ...User['role'][]]

const formSchema = z
  .object({
    firstName: z.string().min(1, '请输入名字'),
    lastName: z.string().min(1, '请输入姓氏'),
    username: z.string().min(1, '请输入用户名'),
    phoneNumber: z.string().min(1, '请输入电话'),
    email: z.string().min(1, '必填').email('邮箱格式不正确'),
    password: z.string().transform(v => v.trim()),
    confirmPassword: z.string().transform(v => v.trim()),
    role: z.enum(roleValues),
    isEdit: z.boolean(),
  })
  .refine(
    d => (d.isEdit && !d.password) || d.password.length > 0,
    { message: '请输入密码', path: ['password'] },
  )
  .refine(
    (d) => {
      if (d.isEdit && !d.password)
        return true
      return d.password.length >= 8
    },
    { message: '密码至少 8 位', path: ['password'] },
  )
  .refine(
    (d) => {
      if (d.isEdit && !d.password)
        return true
      return /[a-z]/.test(d.password)
    },
    { message: '密码需包含小写字母', path: ['password'] },
  )
  .refine(
    (d) => {
      if (d.isEdit && !d.password)
        return true
      return /\d/.test(d.password)
    },
    { message: '密码需包含数字', path: ['password'] },
  )
  .refine(
    (d) => {
      if (d.isEdit && !d.password)
        return true
      return d.password === d.confirmPassword
    },
    { message: '两次密码不一致', path: ['confirmPassword'] },
  )

type FormValues = InferType<typeof formSchema>

const typedSchema = toTypedSchema(formSchema)

const formKey = computed(
  () => (props.currentRow ? `edit-${props.currentRow!.id}` : 'add-new'),
)

const initialValues = computed(() => {
  const row = props.currentRow
  if (row) {
    return {
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      email: row.email,
      phoneNumber: row.phoneNumber,
      password: '',
      confirmPassword: '',
      role: row.role,
      isEdit: true,
    } satisfies Partial<FormValues>
  }

  return {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'cashier',
    isEdit: false,
  }
})

const onFormSubmit = (values: unknown) => {
  const v = values as FormValues

  if (isEdit.value && props.currentRow) {
    updateUser(props.currentRow.id, {
      firstName: v.firstName,
      lastName: v.lastName,
      username: v.username,
      email: v.email,
      phoneNumber: v.phoneNumber,
      role: v.role,
    })
    emits('update:open', false)
    return
  }

  addUser({
    firstName: v.firstName,
    lastName: v.lastName,
    username: v.username,
    email: v.email,
    phoneNumber: v.phoneNumber,
    role: v.role,
    status: 'active',
  })

  emits('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(v: boolean) => emits('update:open', v)">
    <DialogContent class="flex max-h-[min(105vh,var(--breakpoint-sm))] flex-col sm:max-w-lg">
      <DialogHeader class="text-start">
        <DialogTitle>{{ isEdit ? '编辑用户' : '新建用户' }}</DialogTitle>
        <DialogDescription>
          {{ isEdit ? '在此处更新用户信息。' : '创建新用户。' }}完成后点击保存。
        </DialogDescription>
      </DialogHeader>

      <Form
        :key="formKey"
        :validation-schema="typedSchema"
        :initial-values="initialValues"
        class="flex min-h-0 flex-col"
        :on-submit="onFormSubmit as SubmissionHandler"
      >
        <div class="mb-4 max-h-[60vh] space-y-3 overflow-y-auto pe-3">
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem class="grid gap-2">
              <FormLabel>名字</FormLabel>
              <FormControl>
                <Input v-bind="componentField" autocomplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem class="grid gap-2">
              <FormLabel>姓氏</FormLabel>
              <FormControl>
                <Input v-bind="componentField" autocomplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="username">
            <FormItem class="grid gap-2">
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input v-bind="componentField" autocomplete="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="grid gap-2">
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="email" autocomplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem class="grid gap-2">
              <FormLabel>电话</FormLabel>
              <FormControl>
                <Input v-bind="componentField" autocomplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="role">
            <FormItem class="grid gap-2">
              <FormLabel>角色</FormLabel>
              <Select :model-value="value" @update:model-value="handleChange">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="r in roles" :key="r.value" :value="r.value">
                    {{ r.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem class="grid gap-2">
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput v-bind="componentField" autocomplete="new-password" />
              </FormControl>
              <FormMessage />
              <p v-if="isEdit" class="text-xs text-muted-foreground">
                编辑时留空表示不修改密码（当前为演示字段，不会改变用户数据）。
              </p>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem class="grid gap-2">
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <PasswordInput v-bind="componentField" autocomplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <DialogFooter>
          <Button type="submit">
            保存
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>
