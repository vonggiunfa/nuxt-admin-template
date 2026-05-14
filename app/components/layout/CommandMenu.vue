<script setup lang="ts">
import { ArrowRight, Moon, Sun } from 'lucide-vue-next'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const { open, setOpen } = useSearchMenu()

const dialogOpen = computed({
  get: () => open.value,
  set: v => setOpen(v),
})

function runCommand(fn: () => void) {
  setOpen(false)
  fn()
}

function setDark(value: boolean) {
  document.documentElement.classList.toggle('dark', value)
}
</script>

<template>
  <CommandDialog
    v-model:open="dialogOpen"
    modal
    title="命令面板"
    description="搜索命令或输入关键词"
  >
    <CommandInput placeholder="输入命令或搜索…" />
    <CommandList>
      <CommandEmpty>无结果。</CommandEmpty>
      <CommandGroup heading="导航">
        <CommandItem
          value="仪表盘"
          @select="runCommand(() => navigateTo('/'))"
        >
          <div class="flex size-4 items-center justify-center">
            <ArrowRight class="size-2 text-muted-foreground/80" />
          </div>
          仪表盘
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="主题">
        <CommandItem @select="runCommand(() => setDark(false))">
          <Sun />
          <span>浅色</span>
        </CommandItem>
        <CommandItem @select="runCommand(() => setDark(true))">
          <Moon class="scale-90" />
          <span>深色</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
