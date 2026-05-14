<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import Label from '@/components/ui/label/Label.vue'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    data-slot="form-label"
    :for="formItemId"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive', props.class)"
  >
    <slot />
  </Label>
</template>
