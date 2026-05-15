<script setup lang="ts">
import { useUsersWorkspace } from '../composables/useUsersWorkspace'
import UsersActionDialog from './UsersActionDialog.vue'
import UsersDeleteDialog from './UsersDeleteDialog.vue'

const {
  dialogOpen,
  currentRow,
  setOpen,
  setCurrentRow,
  removeUsersByIds,
} = useUsersWorkspace()

function clearRowSoon() {
  setTimeout(() => setCurrentRow(null), 450)
}

function onUpdateAdd(open: boolean) {
  if (!open)
    setOpen(null)
}

function onUpdateEdit(open: boolean) {
  if (!open) {
    setOpen(null)
    clearRowSoon()
  }
}

function onUpdateDelete(open: boolean) {
  if (!open) {
    setOpen(null)
    clearRowSoon()
  }
}

function confirmDeleteSingle() {
  if (!currentRow.value)
    return
  removeUsersByIds([currentRow.value.id])
  setOpen(null)
  setCurrentRow(null)
}
</script>

<template>
  <UsersActionDialog
    :open="dialogOpen === 'add'"
    :current-row="null"
    @update:open="onUpdateAdd"
  />

  <UsersActionDialog
    :key="`edit-${currentRow?.id ?? 'x'}`"
    :open="dialogOpen === 'edit' && !!currentRow"
    :current-row="currentRow ?? undefined"
    @update:open="onUpdateEdit"
  />

  <UsersDeleteDialog
    v-if="currentRow"
    :key="`${currentRow.id}-delete`"
    :open="dialogOpen === 'delete'"
    :user="currentRow"
    @update:open="onUpdateDelete"
    @confirm="confirmDeleteSingle"
  />
</template>
