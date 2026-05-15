<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import CommandMenu from '@/components/layout/CommandMenu.vue'
import SkipToMain from '@/components/layout/SkipToMain.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const { toggle } = useSearchMenu()

function onKey(e: KeyboardEvent) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <SidebarProvider>
    <SkipToMain />
    <AppSidebar />
    <SidebarInset
      class="@container/content min-w-0 has-data-[layout=fixed]:h-svh peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
    >
      <slot />
      <CommandMenu />
    </SidebarInset>
  </SidebarProvider>
</template>
