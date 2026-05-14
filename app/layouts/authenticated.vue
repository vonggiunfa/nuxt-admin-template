<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import CommandMenu from '@/components/layout/CommandMenu.vue'
import SkipToMain from '@/components/layout/SkipToMain.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SHELL_INSET_SCROLL_EL } from '~/composables/shellScroll'

const insetScrollEl = ref<HTMLElement | null>(null)
provide(SHELL_INSET_SCROLL_EL, insetScrollEl)

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
      class="@container/content flex max-h-svh min-h-svh min-w-0 flex-1 flex-col overflow-hidden"
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <div
          ref="insetScrollEl"
          class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          <slot />
        </div>
        <CommandMenu />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
