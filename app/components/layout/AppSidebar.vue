<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import {
  LayoutDashboard,
  Settings,
  UserCog,
  Users,
  Wrench,
} from 'lucide-vue-next'
import NavUser from '@/components/layout/NavUser.vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

const route = useRoute()

const { state, isMobile, setOpenMobile } = useSidebar()

const SETTINGS_CHILDREN = [
  { title: '个人资料', to: '/settings', icon: UserCog },
  { title: '账户', to: '/settings/account', icon: Wrench },
] as const

function isSettingsSectionActive(): boolean {
  const p = route.path
  return p === '/settings' || p.startsWith('/settings/')
}

function isSettingsChildActive(to: string): boolean {
  return route.path === to
}

/** 对标 react `nav-group`：`defaultOpen` 初次挂载；路由进入设置后再展开 */
const settingsCollapsibleOpen = ref(isSettingsSectionActive())

watch(
  () => route.path,
  () => {
    if (isSettingsSectionActive())
      settingsCollapsibleOpen.value = true
  },
)
</script>

<template>
  <Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Logo class="!size-4 text-sidebar-primary-foreground" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Shadcn 管理后台</span>
                <span class="truncate text-xs text-muted-foreground">Nuxt</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>菜单</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              tooltip="仪表盘"
              :is-active="route.path === '/'"
            >
              <NuxtLink to="/">
                <LayoutDashboard />
                <span>仪表盘</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              tooltip="用户管理"
              :is-active="route.path === '/users' || route.path.startsWith('/users/')"
            >
              <NuxtLink to="/users">
                <Users />
                <span>用户管理</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>其它</SidebarGroupLabel>
        <SidebarMenu>
          <!-- 折叠图标栏：下拉对标 react SidebarMenuCollapsedDropdown -->
          <SidebarMenuItem v-if="state === 'collapsed' && !isMobile">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  tooltip="设置"
                  :is-active="isSettingsSectionActive()"
                >
                  <Settings />
                  <span>设置</span>
                  <ChevronRight class="ms-auto opacity-70 rtl:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="min-w-56" side="right" align="start" :side-offset="4">
                <DropdownMenuLabel>设置</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-for="sub in SETTINGS_CHILDREN"
                  :key="sub.to"
                  as-child
                  class="p-0"
                >
                  <NuxtLink
                    :to="sub.to"
                    class="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
                    :class="isSettingsChildActive(sub.to) ? 'bg-secondary' : ''"
                    @click="setOpenMobile(false)"
                  >
                    <component :is="sub.icon" class="size-4 text-muted-foreground" />
                    <span class="max-w-52 text-wrap">{{ sub.title }}</span>
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <!-- 展开侧栏：Collapsible + SubMenu 对标 react SidebarMenuCollapsible -->
          <SidebarMenuItem v-else>
            <Collapsible v-model:open="settingsCollapsibleOpen" class="group/collapsible w-full">
              <CollapsibleTrigger as-child>
                <SidebarMenuButton tooltip="设置" :is-active="isSettingsSectionActive()">
                  <Settings />
                  <span>设置</span>
                  <ChevronRight class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent class="CollapsibleContent">
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="sub in SETTINGS_CHILDREN" :key="sub.to">
                    <SidebarMenuSubButton
                      as-child
                      size="md"
                      :is-active="isSettingsChildActive(sub.to)"
                    >
                      <NuxtLink :to="sub.to" @click="setOpenMobile(false)">
                        <component :is="sub.icon" />
                        <span>{{ sub.title }}</span>
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
