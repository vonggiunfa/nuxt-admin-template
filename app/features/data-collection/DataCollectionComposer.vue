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
/** Select：`undefined` 表示未选择（占位「选择页数」） */
const pageCount = ref<string | undefined>(undefined)

const fileInputEl = ref<HTMLInputElement | null>(null)

const selectedPageCount = computed(() => {
  const raw = pageCount.value
  if (raw === undefined || raw === '')
    return undefined
  const n = Number(raw)
  return PAGE_OPTIONS.find((x) => x === n)
})

const sendDisabled = computed(() => selectedPageCount.value === undefined)

function openFilePicker() {
  fileInputEl.value?.click()
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
  const pages = selectedPageCount.value
  if (pages === undefined)
    return
  toast.message('采集任务（演示）', {
    description:
      `${prompt.value.trim() ? `"${prompt.value.trim().slice(0, 80)}${prompt.value.length > 80 ? '…' : ''}" · ` : ''}页数 ${pages}`,
  })
}

function submitIfReady() {
  if (!sendDisabled.value)
    onSubmit()
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
      @keydown.enter.exact.ctrl.prevent="submitIfReady"
    />
    <InputGroupAddon
      align="block-end"
      :class="
        cn(
          'flex flex-row flex-wrap items-center gap-2 px-3 pt-1 pb-3 justify-between!',
        )
      "
    >
      <input
        ref="fileInputEl"
        type="file"
        class="sr-only"
        tabindex="-1"
        multiple
        @change="onFileChange"
      >
      <Button
        variant="outline"
        size="icon"
        type="button"
        class="size-8 shrink-0"
        aria-label="上传资源"
        @click="openFilePicker"
      >
        <Paperclip class="size-4" aria-hidden="true" />
      </Button>

      <div class="flex min-w-0 shrink-0 items-center gap-2">
        <Select v-model="pageCount">
          <SelectTrigger
            size="sm"
            aria-label="采集页数"
            :class="
              cn(
                'min-w-23 font-medium text-foreground data-placeholder:text-foreground',
              )
            "
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
          :disabled="sendDisabled"
          @click="onSubmit"
        >
          <Send class="size-3.5" />
          <span>发送</span>
        </InputGroupButton>
      </div>
    </InputGroupAddon>
  </InputGroup>
</template>
