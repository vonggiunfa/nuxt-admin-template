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
      <div class="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden lg:flex-row lg:gap-12">
        <aside class="top-0 shrink-0 lg:sticky lg:w-1/5 lg:self-start">
          <SettingsSidebarNav />
        </aside>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-1">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <NuxtPage />
          </div>
        </div>
      </div>
    </AppMain>
  </div>
</template>
