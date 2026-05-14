<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useEventListener } from '@vueuse/core'
import Search from '@/components/layout/Search.vue'
import SignOutDialog from '@/components/layout/SignOutDialog.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SHELL_INSET_SCROLL_EL } from '~/composables/shellScroll'

const props = withDefaults(defineProps<{ bordered?: boolean }>(), {
  bordered: false,
})

const scrollRoot = inject(SHELL_INSET_SCROLL_EL, ref<HTMLElement | null>(null))
const offset = ref(0)

useEventListener(
  scrollRoot,
  'scroll',
  () => {
    offset.value = scrollRoot.value?.scrollTop ?? 0
  },
  { passive: true },
)

const scrollEffect = computed(() => offset.value > 10)

const signOutOpen = ref(false)

function requestSignOut() {
  signOutOpen.value = true
}
</script>

<template>
  <SignOutDialog v-model:open="signOutOpen" />
  <header
    :class="
      cn(
        'peer/header header-fixed sticky top-0 z-50 h-16 w-[inherit]',
        scrollEffect ? 'shadow' : 'shadow-none',
        props.bordered && 'border-b',
      )
    "
  >
    <div
      :class="
        cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          scrollEffect
            && 'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg',
        )
      "
    >
      <SidebarTrigger variant="outline" class="max-md:scale-125 -ms-1" />
      <Separator orientation="vertical" class="h-6" />
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <NuxtLink
          to="/"
          class="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          仪表盘
        </NuxtLink>
        <Search class="me-auto min-w-0" />
      </div>
      <div class="flex items-center gap-2">
        <ThemeSwitch />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="rounded-full" aria-label="用户菜单">
              <div class="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                DU
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="min-w-56" align="end" side="bottom" :side-offset="8">
            <DropdownMenuLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                <div class="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                  DU
                </div>
                <div class="grid flex-1 leading-tight">
                  <span class="truncate font-semibold">演示用户</span>
                  <span class="truncate text-xs text-muted-foreground">demo@example.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click.prevent="requestSignOut">
              <LogOut class="mr-2 size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
