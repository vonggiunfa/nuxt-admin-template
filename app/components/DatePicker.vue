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
  /** vee-validate 可能传入 Date / ISO 字符串 / 空值 */
  modelValue?: Date | string | number | null
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

/** 统一把表单值转成合法 JS Date；无效则 undefined（Invalid Date 也是无效的） */
function toJsDate(value: unknown): Date | undefined {
  if (value == null || value === '')
    return undefined
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? undefined : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}

/** Calendar / DateFormatter 使用的日历日期；任意步骤失败返回 undefined，禁止向外抛错 */
function toCalendarDateSafe(value: unknown): DateValue | undefined {
  const d = toJsDate(value)
  if (!d)
    return undefined
  try {
    return fromDate(d, tz)
  }
  catch {
    return undefined
  }
}

watch(
  () => props.modelValue,
  (v) => {
    inner.value = toCalendarDateSafe(v)
  },
  { immediate: true },
)

/** 按钮展示文案；无效日期返回 ''，绝不抛错（避免 Invalid Date / 字符串 schema 导致 RangeError） */
const buttonLabel = computed(() => {
  const cal = toCalendarDateSafe(props.modelValue)
  if (!cal)
    return ''
  try {
    return df.format(cal)
  }
  catch {
    return ''
  }
})

function onInnerUpdate(v: DateValue | undefined, close: () => void) {
  inner.value = v
  emit('update:modelValue', v ? v.toDate(tz) : undefined)
  close()
}
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :data-empty="buttonLabel ? undefined : true"
        :class="cn(
          'w-60 justify-start text-start font-normal',
          !buttonLabel && 'text-muted-foreground',
        )"
      >
        <span v-if="buttonLabel">{{ buttonLabel }}</span>
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
