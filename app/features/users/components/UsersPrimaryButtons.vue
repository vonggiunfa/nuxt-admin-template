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
  <Button @click="openAdd">
    <span>新建用户</span>
    <Plus :size="18" class="shrink-0" />
  </Button>
</template>
