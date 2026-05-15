<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { Trash2, UserCheck, UserX } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import DataTableBulkActions from '@/components/data-table/DataTableBulkActions.vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUsersWorkspace } from '../composables/useUsersWorkspace'
import type { User } from '../schema'
import UsersMultiDeleteDialog from './UsersMultiDeleteDialog.vue'

const props = defineProps<{
  table: Table<User>
}>()

const { removeUsersByIds, setStatusForIds } = useUsersWorkspace()

const multiOpen = ref(false)

function selectedIds(): string[] {
  return props.table
    .getFilteredSelectedRowModel()
    .rows.map(r => r.original.id)
}

function bulkActive() {
  const ids = selectedIds()
  if (!ids.length)
    return
  setStatusForIds(ids, 'active')
  props.table.resetRowSelection()
}

function bulkInactive() {
  const ids = selectedIds()
  if (!ids.length)
    return
  setStatusForIds(ids, 'inactive')
  props.table.resetRowSelection()
}

function openMultiDelete() {
  if (!selectedIds().length) {
    toast.error('请先选择用户')
    return
  }
  multiOpen.value = true
}

function onMultiDeleteConfirmed() {
  const ids = selectedIds()
  removeUsersByIds(ids)
  props.table.resetRowSelection()
  multiOpen.value = false
}
</script>

<template>
  <DataTableBulkActions :table="props.table" entity-name="用户">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          aria-label="激活所选"
          @click="bulkActive"
        >
          <UserCheck class="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>激活所选</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          aria-label="停用所选"
          @click="bulkInactive"
        >
          <UserX class="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>停用所选</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="destructive"
          size="icon"
          class="size-8"
          aria-label="删除所选"
          @click="openMultiDelete"
        >
          <Trash2 class="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>删除所选</p>
      </TooltipContent>
    </Tooltip>
  </DataTableBulkActions>

  <UsersMultiDeleteDialog
    v-model:open="multiOpen"
    :table="props.table"
    @confirm="onMultiDeleteConfirmed"
  />
</template>
