<script setup lang="ts">
import { LoaderCircle, LogIn } from 'lucide-vue-next'
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
import type { SignInFormValues } from '@/lib/authSchemas'
import { signInFormSchema } from '@/lib/authSchemas'
import { cn, sleep } from '@/lib/utils'

const typedSchema = toTypedSchema(signInFormSchema)

const route = useRoute()
const { login } = useAuthSession()

function getRedirectTarget(): string {
  const r = route.query.redirect
  if (typeof r === 'string' && r.startsWith('/') && !r.startsWith('//'))
    return r
  return '/'
}

const props = defineProps<{ class?: string }>()

const loading = ref(false)

const onFormSubmit = (values: SignInFormValues) => {
  loading.value = true
  toast.promise(sleep(2000), {
    loading: '正在登录…',
    success: () => {
      login()
      navigateTo(getRedirectTarget())
      return `欢迎回来，${values.email}！`
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
    data-slot="user-auth-form"
    :validation-schema="typedSchema"
    :initial-values="{ email: '', password: '' }"
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
      <FormItem class="relative">
        <FormLabel>密码</FormLabel>
        <FormControl>
          <PasswordInput
            autocomplete="current-password"
            placeholder="********"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
        <NuxtLink
          class="absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75"
          tabindex="-1"
          to="/forgot-password"
        >
          忘记密码？
        </NuxtLink>
      </FormItem>
    </FormField>

    <Button class="mt-2" type="submit" :disabled="loading">
      <LoaderCircle
        v-if="loading"
        class="animate-spin"
        aria-hidden="true"
      />
      <LogIn v-else aria-hidden="true" />
      登录
    </Button>
  </Form>
</template>
