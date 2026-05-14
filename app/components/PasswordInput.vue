<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useVModel } from '@vueuse/core'
import { computed, ref, useAttrs } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  /** 与 vee Field / Input 对齐 */
  defaultValue?: string
  modelValue?: string
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  'update:modelValue': [v: string]
}>()

const attrs = useAttrs()

const mergedClass = computed(() =>
  cn(
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pe-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    attrs.class as string | undefined,
    props.class,
  ),
)

const isDisabled = computed(
  () => attrs.disabled !== undefined && attrs.disabled !== false,
)

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue ?? '',
})

const showPassword = ref(false)

const delegatedAttrs = computed(() => {
  const rest = Object.assign({}, attrs)
  Reflect.deleteProperty(rest, 'class')
  return rest
})
</script>

<template>
  <div class="relative">
    <input
      v-model="modelValue"
      data-slot="password-input"
      :type="showPassword ? 'text' : 'password'"
      :class="mergedClass"
      v-bind="delegatedAttrs"
    >
    <Button
      type="button"
      variant="ghost"
      tabindex="-1"
      :disabled="isDisabled"
      class="pointer-events-auto absolute inset-y-1 end-1 top-1/2 size-8 min-h-6 min-w-6 shrink-0 -translate-y-1/2 rounded-md p-0 text-muted-foreground"
      @click.prevent="showPassword = !showPassword"
    >
      <Eye v-if="showPassword" :size="18" />
      <EyeOff v-else :size="18" />
      <span class="sr-only">{{ showPassword ? '隐藏密码' : '显示密码' }}</span>
    </Button>
  </div>
</template>
