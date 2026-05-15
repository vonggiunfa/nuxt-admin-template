<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface Props {
  table: Table<unknown>
  entityName?: string
}

const props = withDefaults(defineProps<Props>(), {
  entityName: '项',
})

const selectedCount = computed(
  () => props.table.getFilteredSelectedRowModel().rows.length,
)

function clearSelection() {
  props.table.resetRowSelection()
}
</script>

<template>
  <div v-if="selectedCount > 0">
    <div
      role="toolbar"
      :aria-label="`已选中 ${selectedCount} 个批量操作工具栏`"
      tabindex="-1"
      :class="cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
        'transition-all delay-100 duration-300 ease-out hover:scale-105',
      )"
    >
      <div
        class="rounded-xl border border-border bg-background/95 shadow-xl backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 flex items-center gap-x-2 p-2 dark:border-border"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="size-6 rounded-full"
              aria-label="清除选择"
              @click="clearSelection"
            >
              <X class="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>清除选择</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" class="h-5" aria-hidden="true" />

        <div class="flex items-center gap-x-1 text-sm">
          <Badge variant="default" class="min-w-8 rounded-lg">
            {{ selectedCount }}
          </Badge>
          <span class="hidden sm:inline">{{ props.entityName }}</span>
          <span>已选</span>
        </div>

        <Separator orientation="vertical" class="h-5" aria-hidden="true" />

        <slot />
      </div>
    </div>
  </div>
</template>
