<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppMain from '@/components/layout/AppMain.vue'
import { provideUsersWorkspace } from '@/features/users/composables/useUsersWorkspace'
import UsersDialogs from '@/features/users/components/UsersDialogs.vue'
import UsersPrimaryButtons from '@/features/users/components/UsersPrimaryButtons.vue'
import UsersTable from '@/features/users/components/UsersTable.vue'

definePageMeta({ layout: 'authenticated' })

provideUsersWorkspace()
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain>
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            用户管理
          </h2>
        </div>
        <UsersPrimaryButtons />
      </div>

      <UsersTable />
      <UsersDialogs />
    </AppMain>
  </div>
</template>
