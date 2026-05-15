<script setup lang="ts">
import { Paperclip, Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'vue-sonner'

/** 与设计约定一致的下拉档位 */
const PAGE_OPTIONS = [1, 5, 10, 20] as const

const prompt = ref('')
/** Select 的值使用字符串便于与 Radix/Reka Select 对齐 */
const pageCount = ref<string>('10')

function pageCountNum(): number {
  const n = Number(pageCount.value)
  return PAGE_OPTIONS.includes(n as (typeof PAGE_OPTIONS)[number])
    ? n
    : PAGE_OPTIONS[Math.floor(PAGE_OPTIONS.length / 2)]
}

function onFileChange(ev: Event) {
  const el = ev.target as HTMLInputElement
  const files = el.files ? Array.from(el.files) : []
  if (files.length === 0)
    return
  toast.success(files.length === 1 ? `已选择 1 个文件` : `已选择 ${files.length} 个文件`)
  el.value = ''
}

function onSubmit() {
  const pages = pageCountNum()
  pageCount.value = String(pages)
  toast.message('采集任务（演示）', {
    description:
      `${prompt.value.trim() ? `"${prompt.value.trim().slice(0, 80)}${prompt.value.length > 80 ? '…' : ''}" · ` : ''}页数 ${pages}`,
  })
}
</script>

<template>
  <InputGroup :class="cn('min-h-16 min-w-0 w-full')">
    <InputGroupTextarea
      v-model="prompt"
      placeholder="描述要采集的内容或粘贴链接…"
      rows="2"
      :class="
        cn(
          'min-h-16 max-h-48 overflow-y-auto field-sizing-content',
        )
      "
      @keydown.enter.exact.ctrl.prevent="onSubmit"
    />
    <InputGroupAddon
      align="block-end"
      :class="
        cn(
          'flex flex-row flex-wrap items-center gap-2 px-3 pt-1 pb-3 justify-between!',
        )
      "
    >
      <Button variant="outline" size="icon" class="size-8 shrink-0" as-child>
        <label class="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-md">
          <input
            type="file"
            class="absolute inset-0 cursor-pointer opacity-0"
            multiple
            aria-label="上传资源"
            @change="onFileChange"
          >
          <Paperclip class="pointer-events-none size-4" aria-hidden="true" />
        </label>
      </Button>

      <div class="flex min-w-0 shrink-0 items-center gap-2">
        <Select v-model="pageCount">
          <SelectTrigger
            size="sm"
            aria-label="采集页数"
            class="min-w-23"
          >
            <SelectValue placeholder="选择页数" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem
              v-for="n in PAGE_OPTIONS"
              :key="n"
              :value="String(n)"
            >
              {{ n }} 页
            </SelectItem>
          </SelectContent>
        </Select>
        <InputGroupButton
          size="sm"
          variant="default"
          type="button"
          @click="onSubmit"
        >
          <Send class="size-3.5" />
          <span>发送</span>
        </InputGroupButton>
      </div>
    </InputGroupAddon>
  </InputGroup>
</template>
