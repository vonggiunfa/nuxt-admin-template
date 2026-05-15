<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DataTableFacetedFilter from '@/components/data-table/DataTableFacetedFilter.vue'
import DataTableViewOptions from '@/components/data-table/DataTableViewOptions.vue'

type FilterOpt = {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?: object
  }[]
}

interface Props {
  table: Table<unknown>
  searchPlaceholder?: string
  searchKey?: string
  filters?: FilterOpt[]
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: '筛选…',
  searchKey: undefined,
  filters: () => [],
})

function tableFiltered(tbl: Table<unknown>) {
  return (
    tbl.getState().columnFilters.length > 0
    || !!(tbl.getState().globalFilter as string | undefined)
  )
}

function resetTable(tbl: Table<unknown>) {
  tbl.resetColumnFilters()
  tbl.setGlobalFilter('')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
      <Input
        v-if="props.searchKey"
        class="h-8 w-37.5 lg:w-62.5"
        :placeholder="props.searchPlaceholder"
        :model-value="(props.table.getColumn(props.searchKey)?.getFilterValue() as string) ?? ''"
        @update:model-value="(v: string | number) =>
          props.table.getColumn(props.searchKey!)?.setFilterValue(String(v))"
      />
      <Input
        v-else
        class="h-8 w-37.5 lg:w-62.5"
        :placeholder="props.searchPlaceholder"
        :model-value="props.table.getState().globalFilter ?? ''"
        @update:model-value="props.table.setGlobalFilter"
      />

      <div class="flex gap-x-2">
        <template v-for="filter in props.filters" :key="filter.columnId">
          <DataTableFacetedFilter
            v-if="props.table.getColumn(filter.columnId)"
            :column="props.table.getColumn(filter.columnId)!"
            :title="filter.title"
            :options="filter.options"
          />
        </template>
      </div>

      <Button
        v-if="tableFiltered(props.table)"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="resetTable(props.table)"
      >
        重置筛选
        <X class="ms-2 h-4 w-4" />
      </Button>

      <DataTableViewOptions :table="props.table" />
    </div>
  </div>
</template>
