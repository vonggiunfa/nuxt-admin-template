<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { useUsersWorkspace } from '../composables/useUsersWorkspace'

const { setOpen, setCurrentRow } = useUsersWorkspace()

function openAdd() {
  setCurrentRow(null)
  setOpen('add')
}
</script>

<template>
  <Button class="space-x-1" @click="openAdd">
    <span>新建用户</span>
    <Plus :size="18" />
  </Button>
</template>
