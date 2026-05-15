<script setup lang="ts">
import type { Component } from 'vue'
import { UserCog, Wrench } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Item = { title: string; href: string; icon: Component }

const items: Item[] = [
  { title: '个人资料', href: '/settings', icon: UserCog },
  { title: '账户', href: '/settings/account', icon: Wrench },
]

const route = useRoute()
const router = useRouter()

const selectModel = ref(route.path)

watch(
  () => route.path,
  (p) => {
    selectModel.value = p
  },
)

function onSelect(href: string | undefined) {
  if (!href)
    return
  selectModel.value = href
  router.push(href)
}

const navLinkClass = (href: string) =>
  cn(
    buttonVariants({ variant: 'ghost' }),
    route.path === href
      ? 'bg-muted hover:bg-accent'
      : 'hover:bg-accent hover:underline',
    'justify-start',
  )
</script>

<template>
  <div>
    <div class="p-1 md:hidden">
      <Select :model-value="selectModel" @update:model-value="onSelect">
        <SelectTrigger class="h-12 sm:w-48">
          <SelectValue placeholder="选择设置小节" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in items" :key="item.href" :value="item.href">
            <div class="flex gap-x-4 px-2 py-1">
              <span class="scale-125">
                <component :is="item.icon" class="size-[18px]" />
              </span>
              <span class="text-md">
                {{ item.title }}
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- tablet：横向 pills；滚动条 hover 显隐（对标 ScrollArea hover），避免常驻滚动轨道 -->
    <ScrollArea
      orientation="horizontal"
      type="hover"
      class="hidden w-full min-w-40 bg-background px-1 py-2 md:block lg:hidden"
    >
      <nav class="flex w-max min-w-full space-x-2 py-1">
        <NuxtLink
          v-for="item in items"
          :key="item.href"
          :to="item.href"
          :class="navLinkClass(item.href)"
        >
          <span class="me-2">
            <component :is="item.icon" class="size-[18px]" />
          </span>
          {{ item.title }}
        </NuxtLink>
      </nav>
    </ScrollArea>

    <!-- desktop：纵向链接，不使用横向 ScrollArea，避免 lg 仍出现横向滚动条 -->
    <nav class="hidden bg-background px-1 py-2 lg:flex lg:flex-col lg:gap-1">
      <NuxtLink
        v-for="item in items"
        :key="item.href"
        :to="item.href"
        :class="navLinkClass(item.href)"
      >
        <span class="me-2">
          <component :is="item.icon" class="size-[18px]" />
        </span>
        {{ item.title }}
      </NuxtLink>
    </nav>
  </div>
</template>
