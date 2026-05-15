<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { SlidersHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  table: Table<unknown>
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="ms-auto hidden h-8 lg:flex"
      >
        <SlidersHorizontal class="size-4" />
        列显示
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[9.375rem]">
      <DropdownMenuLabel>切换可见列</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="column in props.table
          .getAllColumns()
          .filter(col => typeof col.accessorFn !== 'undefined' && col.getCanHide())"
        :key="column.id"
        class="capitalize"
        :model-value="column.getIsVisible()"
        @update:model-value="
          (v: boolean | 'indeterminate') => column.toggleVisibility(!!v)
        "
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
