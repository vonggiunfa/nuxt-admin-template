<script setup lang="ts">
import { LoaderCircle, UserPlus } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import type { SubmissionHandler } from 'vee-validate'
import { toast } from 'vue-sonner'
import PasswordInput from '@/components/PasswordInput.vue'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { SignUpFormValues } from '@/lib/authSchemas'
import { signUpFormSchema } from '@/lib/authSchemas'
import { cn, sleep } from '@/lib/utils'

const typedSchema = toTypedSchema(signUpFormSchema)

const props = defineProps<{ class?: string }>()

const loading = ref(false)

const onFormSubmit = (values: SignUpFormValues) => {
  loading.value = true
  toast.promise(sleep(2000), {
    loading: '正在创建账号…',
    success: () => {
      return `已为 ${values.email} 创建账号。`
    },
    error: '出错了',
    finally: () => {
      loading.value = false
    },
  })
}
</script>

<template>
  <Form
    data-slot="sign-up-form"
    :validation-schema="typedSchema"
    :initial-values="{ email: '', password: '', confirmPassword: '' }"
    :class="cn('grid gap-3', props.class)"
    :on-submit="onFormSubmit as unknown as SubmissionHandler"
  >
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormControl>
          <Input
            autocomplete="email"
            placeholder="zhangsan@example.com"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>密码</FormLabel>
        <FormControl>
          <PasswordInput
            autocomplete="new-password"
            placeholder="********"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem>
        <FormLabel>确认密码</FormLabel>
        <FormControl>
          <PasswordInput
            autocomplete="new-password"
            placeholder="********"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="mt-2" type="submit" :disabled="loading">
      <LoaderCircle
        v-if="loading"
        class="animate-spin"
        aria-hidden="true"
      />
      <UserPlus v-else aria-hidden="true" />
      注册账号
    </Button>
  </Form>
</template>
