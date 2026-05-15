<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Ellipsis, Trash2, UserPen } from 'lucide-vue-next'
import type { User } from '@/features/users/schema'
import { useUsersWorkspace } from '@/features/users/composables/useUsersWorkspace'

const props = defineProps<{
  row: Row<User>
}>()

const { setOpen, setCurrentRow } = useUsersWorkspace()

function edit() {
  setCurrentRow(props.row.original)
  setOpen('edit')
}

function del() {
  setCurrentRow(props.row.original)
  setOpen('delete')
}
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex size-8 p-0 data-[state=open]:bg-muted"
      >
        <Ellipsis class="size-4" />
        <span class="sr-only">打开菜单</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem @click="edit">
        <span>编辑</span>
        <DropdownMenuShortcut><UserPen :size="16" /></DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-red-600 focus:text-red-600" @click="del">
        <span>删除</span>
        <DropdownMenuShortcut><Trash2 :size="16" /></DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
