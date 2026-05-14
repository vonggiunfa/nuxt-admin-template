<script setup lang="ts">
import { computed } from 'vue'
import { Slot } from 'reka-ui'
import { useFormField } from './useFormField'

const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

const ariaDescribedby = computed(() => {
  if (error.value)
    return `${formDescriptionId} ${formMessageId}`
  return formDescriptionId
})
</script>

<template>
  <Slot
    data-slot="form-control"
    :id="formItemId"
    :aria-describedby="ariaDescribedby"
    :aria-invalid="error ? true : undefined"
  >
    <slot />
  </Slot>
</template>
