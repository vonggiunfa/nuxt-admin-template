<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = withDefaults(defineProps<{
  class?: string
}>(), { class: '' })
</script>

<template>
  <Tooltip :delay-duration="300">
    <TooltipTrigger as-child>
      <div :class="cn('truncate', props.class)">
        <slot />
      </div>
    </TooltipTrigger>
    <TooltipContent class="max-w-sm">
      <slot />
    </TooltipContent>
  </Tooltip>
</template>
