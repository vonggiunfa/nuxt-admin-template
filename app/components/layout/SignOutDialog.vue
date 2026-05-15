<script setup lang="ts">
import ConfirmDialog from '@/components/layout/ConfirmDialog.vue'

const open = defineModel<boolean>('open', { required: true })

const route = useRoute()
const { logout } = useAuthSession()

async function handleConfirm() {
  logout()
  const path = route.fullPath
  const redirect
    = typeof path === 'string'
      && path.startsWith('/')
      && !path.startsWith('//')
      && path !== '/sign-in'
      ? path
      : undefined
  await navigateTo({
    path: '/sign-in',
    query: redirect ? { redirect } : undefined,
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    content-class="sm:max-w-sm"
    title="退出登录"
    description="确定要退出吗？你需要重新登录才能访问账户。"
    confirm-text="退出登录"
    cancel-text="取消"
    destructive
    @confirm="handleConfirm"
  />
</template>
