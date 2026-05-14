<script setup lang="ts">
import AuthLayout from '@/components/auth/AuthLayout.vue'
import UserAuthForm from '@/components/auth/UserAuthForm.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({ layout: 'auth' })
</script>

<template>
  <AuthLayout>
    <Card class="w-full gap-4">
      <CardHeader>
        <CardTitle class="text-lg tracking-tight">
          登录
        </CardTitle>
        <CardDescription>
          请在下方输入邮箱和密码登录。
          <!-- <br class="max-sm:hidden"> -->
          还没有账号？
          <NuxtLink to="/sign-up" class="text-nowrap underline underline-offset-4 hover:text-primary">
            去注册
          </NuxtLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
      </CardContent>
    </Card>
  </AuthLayout>
</template>
