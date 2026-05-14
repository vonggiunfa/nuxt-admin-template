<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SkipToMain from '@/components/layout/SkipToMain.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <SkipToMain />
    <AppSidebar />
    <SidebarInset
      class="@container/content flex max-h-svh min-h-svh flex-1 flex-col overflow-hidden"
    >
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
