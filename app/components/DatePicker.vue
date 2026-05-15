<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  CalendarDate,
  DateFormatter,
  fromDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const props = defineProps<{
  modelValue?: Date | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date | undefined]
}>()

const tz = getLocalTimeZone()
const defaultPlaceholder = today(tz)
const minValue = new CalendarDate(1900, 1, 1)
const maxValue = today(tz)

const df = new DateFormatter('zh-CN', { dateStyle: 'medium' })

const inner = ref<DateValue | undefined>()

watch(
  () => props.modelValue,
  (d) => {
    inner.value = d ? fromDate(d, tz) : undefined
  },
  { immediate: true },
)

function onInnerUpdate(v: DateValue | undefined, close: () => void) {
  inner.value = v
  emit('update:modelValue', v ? v.toDate(tz) : undefined)
  close()
}

function formatButtonLabel(): string {
  if (!props.modelValue)
    return ''
  return df.format(fromDate(props.modelValue, tz))
}
</script>

<template>
  <!-- 不用 v-model:open：与 PopoverRoot 内部 useVModel 叠在一起时易导致点击无法切换 -->
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :data-empty="modelValue ? undefined : true"
        :class="cn(
          'w-60 justify-start text-start font-normal',
          !modelValue && 'text-muted-foreground',
        )"
      >
        <span v-if="modelValue">{{ formatButtonLabel() }}</span>
        <span v-else>选择日期</span>
        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        :model-value="inner"
        locale="zh-CN"
        layout="month-and-year"
        :default-placeholder="defaultPlaceholder"
        :min-value="minValue"
        :max-value="maxValue"
        initial-focus
        @update:model-value="(v: DateValue | undefined) => onInnerUpdate(v, close)"
      />
    </PopoverContent>
  </Popover>
</template>
