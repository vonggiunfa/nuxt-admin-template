<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { AlertTriangle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { User } from '../schema'

const CONFIRM_WORD = 'DELETE'

const props = defineProps<{
  table: Table<User>
}>()

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  confirm: []
}>()

const confirmInput = ref('')

watch(open, (o) => {
  if (!o)
    confirmInput.value = ''
})

const selectedCount = computed(() =>
  props.table.getFilteredSelectedRowModel().rows.length,
)

function submit() {
  if (confirmInput.value.trim() !== CONFIRM_WORD) {
    toast.error(`请输入 「${CONFIRM_WORD}」 以确认删除`)
    return
  }

  emits('confirm')
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader class="text-start">
        <DialogTitle class="text-destructive">
          <AlertTriangle class="me-1 inline-block size-[18px] stroke-destructive" />
          删除 {{ selectedCount }} 名用户
        </DialogTitle>
      </DialogHeader>

      <form id="users-multi-delete-form" class="space-y-4" @submit.prevent="submit">
        <p class="text-sm text-muted-foreground">
          确认删除所选用户？此操作无法撤销。
        </p>

        <Label class="flex flex-col items-start gap-1.5 text-sm">
          <span>输入 「{{ CONFIRM_WORD }}」 确认：</span>
          <Input
            v-model="confirmInput"
            :placeholder="`请输入 ${CONFIRM_WORD}`"
            autofocus
          />
        </Label>

        <Alert variant="destructive">
          <AlertTitle>警告</AlertTitle>
          <AlertDescription>
            删除后不可恢复，请谨慎操作。
          </AlertDescription>
        </Alert>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button type="button" variant="outline" @click="open = false">
            取消
          </Button>
          <Button
            type="submit"
            form="users-multi-delete-form"
            variant="destructive"
            :disabled="confirmInput.trim() !== CONFIRM_WORD"
          >
            删除
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
