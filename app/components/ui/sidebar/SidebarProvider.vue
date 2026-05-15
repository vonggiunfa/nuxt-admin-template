<script setup lang="ts">
import type { HTMLAttributes, Ref } from "vue"
import { useEventListener, useMediaQuery, useVModel } from "@vueuse/core"
import { TooltipProvider } from "reka-ui"
import { computed, onMounted, ref, shallowRef, watch } from "vue"
import { cn } from "@/lib/utils"
import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_KEYBOARD_SHORTCUT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./utils"

const sidebarCookie = useCookie<string | undefined>(SIDEBAR_COOKIE_NAME, {
  path: "/",
  maxAge: SIDEBAR_COOKIE_MAX_AGE,
})

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  open?: boolean
  class?: HTMLAttributes["class"]
}>(), {
  defaultOpen: true,
  open: undefined,
})

const emits = defineEmits<{
  "update:open": [open: boolean]
}>()

function seedOpenFromCookie(): boolean {
  const c = sidebarCookie.value
  if (c === "false")
    return false
  if (c === "true")
    return true
  return props.defaultOpen ?? true
}

const mqMatches = useMediaQuery("(max-width: 768px)")
const isMobile = shallowRef(false)

onMounted(() => {
  isMobile.value = mqMatches.value
  watch(mqMatches, v => {
    isMobile.value = v
  })
})
const openMobile = ref(false)

const open = useVModel(props, "open", emits, {
  defaultValue: seedOpenFromCookie(),
  passive: (props.open === undefined) as false,
}) as Ref<boolean>

function setOpen(value: boolean) {
  open.value = value
  sidebarCookie.value = String(value)
  if (typeof document !== "undefined") {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open.value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }
}

function setOpenMobile(value: boolean) {
  openMobile.value = value
}

// Helper to toggle the sidebar.
function toggleSidebar() {
  return isMobile.value ? setOpenMobile(!openMobile.value) : setOpen(!open.value)
}

useEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    toggleSidebar()
  }
})

// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
const state = computed(() => open.value ? "expanded" : "collapsed")

provideSidebarContext({
  state,
  open,
  setOpen,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
})
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      data-slot="sidebar-wrapper"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      }"
      :class="cn('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', props.class)"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </TooltipProvider>
</template>
