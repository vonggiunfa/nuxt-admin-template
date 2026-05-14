<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggle() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="relative"
    type="button"
    aria-label="切换浅色/深色主题"
    @click="toggle"
  >
    <Sun class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    <Moon class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  </Button>
</template>
