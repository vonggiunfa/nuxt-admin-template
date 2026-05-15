<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
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

const props = defineProps<{
  user: User
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

function submit() {
  if (confirmInput.value.trim() !== props.user.username)
    return

  emits('confirm')
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader class="text-start">
        <DialogTitle class="text-destructive">
          <AlertTriangle class="me-1 inline-block size-[18px] stroke-destructive" />
          删除用户
        </DialogTitle>
      </DialogHeader>

      <form id="users-delete-form" class="space-y-4" @submit.prevent="submit">
        <p class="text-sm text-muted-foreground">
          确定要删除用户
          <span class="font-semibold text-foreground">{{ user.username }}</span>
          吗？该用户角色为
          <span class="font-semibold text-foreground">{{ user.role.toUpperCase() }}</span>
          ，操作不可恢复。
        </p>

        <Label class="flex flex-col gap-1.5 text-sm">
          <span>请输入用户名以确认：</span>
          <Input
            v-model="confirmInput"
            placeholder="输入用户名"
            autofocus
          />
        </Label>

        <Alert variant="destructive">
          <AlertTitle>警告</AlertTitle>
          <AlertDescription>
            该操作无法回滚。
          </AlertDescription>
        </Alert>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button type="button" variant="outline" @click="open = false">
            取消
          </Button>
          <Button
            type="submit"
            variant="destructive"
            :disabled="confirmInput.trim() !== user.username"
          >
            删除
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
