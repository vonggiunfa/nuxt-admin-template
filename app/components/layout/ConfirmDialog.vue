<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  /** 样式类加到 AlertDialogContent 上（如 max-w）。 */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确认',
  destructive: false,
  contentClass: '',
})

const open = defineModel<boolean>({ required: true })

const emits = defineEmits<{
  confirm: []
}>()

function handleConfirm() {
  emits('confirm')
  open.value = false
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent :class="cn(props.contentClass)">
      <AlertDialogHeader class="text-start">
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription as-child>
          <div>{{ description }}</div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ props.cancelText }}</AlertDialogCancel>
        <Button
          type="button"
          :variant="props.destructive ? 'destructive' : 'default'"
          @click="handleConfirm"
        >
          {{ props.confirmText }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
