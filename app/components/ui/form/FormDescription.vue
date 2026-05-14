<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'

defineProps<{
  class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
  <p
    data-slot="form-description"
    :id="formDescriptionId"
    :class="cn('text-sm text-muted-foreground', $props.class)"
  >
    <slot />
  </p>
</template>
