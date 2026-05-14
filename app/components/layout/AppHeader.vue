<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
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

const { logout } = useAuthSession()

async function onSignOut() {
  logout()
  await navigateTo('/sign-in')
}
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6 md:gap-4">
    <SidebarTrigger class="-ms-1" />
    <Separator orientation="vertical" class="me-2 hidden h-4 md:block" />
    <div class="flex flex-1 items-center gap-2">
      <NuxtLink
        to="/"
        class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        仪表盘
      </NuxtLink>
    </div>
    <div class="flex items-center gap-2">
      <ThemeSwitch />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="rounded-full" aria-label="用户菜单">
            <div class="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              DU
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="min-w-56" align="end" side="bottom" :side-offset="8">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
              <div class="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                DU
              </div>
              <div class="grid flex-1 leading-tight">
                <span class="truncate font-semibold">演示用户</span>
                <span class="truncate text-xs text-muted-foreground">demo@example.com</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="onSignOut">
            <LogOut class="mr-2 size-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
