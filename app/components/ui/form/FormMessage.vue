<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ErrorMessage } from 'vee-validate'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { name, formMessageId } = useFormField()
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    as="p"
    data-slot="form-message"
    :name="name"
    :class="cn('text-sm text-destructive', props.class)"
  />
</template>
