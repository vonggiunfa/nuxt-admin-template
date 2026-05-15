<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

defineProps<{
  title: string
  desc: string
}>()
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    <div class="shrink-0">
      <h3 class="text-lg font-medium">
        {{ title }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ desc }}
      </p>
    </div>
    <Separator class="my-4 shrink-0" />
    <div class="faded-bottom min-h-0 flex-1 overflow-y-auto scroll-smooth pe-4 pb-12">
      <div class="-mx-1 px-1.5 lg:max-w-xl">
        <slot />
      </div>
    </div>
  </div>
</template>
