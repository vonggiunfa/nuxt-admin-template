<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <svg
    id="shadcn-admin-logo"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="cn('size-6', props.class)"
  >
    <title>Shadcn 管理后台</title>
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
  </svg>
</template>
