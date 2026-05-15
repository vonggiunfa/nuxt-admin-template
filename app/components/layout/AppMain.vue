<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(
  defineProps<{
    /** 对标 react `Main`：`fixed` 时在祖先链上输出 `data-layout=fixed`，触发 SidebarInset 条件高度 */
    layout?: 'fixed' | 'auto'
  }>(),
  { layout: 'auto' },
)
</script>

<template>
  <main
    id="main-content"
    :data-layout="layout === 'fixed' ? 'fixed' : 'auto'"
    :class="
      cn(
        'flex flex-1 flex-col p-4 md:p-6 @7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
        layout === 'fixed'
          ? 'min-h-0 overflow-hidden'
          : 'gap-4 md:gap-6',
      )
    "
  >
    <slot />
  </main>
</template>
