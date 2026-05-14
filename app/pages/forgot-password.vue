<script setup lang="ts">
import AuthLayout from '@/components/auth/AuthLayout.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
          忘记密码
        </CardTitle>
        <CardDescription>
          此流程尚未接通（占位页，与 react-template 路由对齐）。
          <NuxtLink
            to="/sign-in"
            class="text-nowrap underline underline-offset-4 hover:text-primary"
          >
            返回登录
          </NuxtLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          邮件重置表单将在后续步骤中提供。
        </p>
      </CardContent>
      <CardFooter class="justify-center">
        <NuxtLink to="/sign-in">
          <span class="text-sm font-medium text-primary underline-offset-4 hover:underline">返回登录</span>
        </NuxtLink>
      </CardFooter>
    </Card>
  </AuthLayout>
</template>
