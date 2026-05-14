<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "@/components/ui/button"
import { PanelLeft } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}>(), {
  variant: "ghost",
  size: "icon",
})

const attrs = useAttrs()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    v-bind="attrs"
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    :variant="props.variant"
    :size="props.size"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft />
    <span class="sr-only">展开或收起侧边栏</span>
  </Button>
</template>
