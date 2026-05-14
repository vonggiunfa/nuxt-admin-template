<script setup lang="ts">
import AuthLayout from '@/components/auth/AuthLayout.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'
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
          注册
        </CardTitle>
        <CardDescription>
          创建账号。已有账号？
          <NuxtLink
            to="/sign-in"
            class="text-nowrap underline underline-offset-4 hover:text-primary"
          >
            去登录
          </NuxtLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  </AuthLayout>
</template>
