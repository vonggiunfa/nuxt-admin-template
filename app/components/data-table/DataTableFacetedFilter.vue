<script setup lang="ts">
import { Check, CirclePlus } from 'lucide-vue-next'
import type { Column } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Component } from 'vue'

const props = defineProps<{
  column?: Column<unknown, unknown>
  title?: string
  options: {
    label: string
    value: string
    icon?: Component
  }[]
}>()

const facets = computed(() => props.column?.getFacetedUniqueValues())

const selectedValues = computed(() => {
  const raw = props.column?.getFilterValue()
  if (Array.isArray(raw))
    return new Set(raw as string[])
  return new Set<string>()
})

function toggle(option: string) {
  const column = props.column
  if (!column)
    return
  const next = new Set(selectedValues.value)
  if (next.has(option))
    next.delete(option)
  else next.add(option)
  const arr = Array.from(next)
  column.setFilterValue(arr.length ? arr : undefined)
}

function clearAll() {
  props.column?.setFilterValue(undefined)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <CirclePlus class="size-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <template v-if="selectedValues.size > 2">
              <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                {{ selectedValues.size }} 项已选
              </Badge>
            </template>
            <template v-else>
              <Badge
                v-for="opt in options.filter(o => selectedValues.has(o.value))"
                :key="opt.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ opt.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[12.5rem] p-0" align="start">
      <Command>
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>无匹配项</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="() => toggle(option.value)"
            >
              <div
                :class="cn(
                  'flex size-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <Check class="h-4 w-4 text-background" />
              </div>
              <component
                :is="option.icon"
                v-if="option.icon"
                class="size-4 text-muted-foreground"
              />
              <span>{{ option.label }}</span>
              <span
                v-if="facets?.get(option.value)"
                class="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem class="justify-center text-center" @select="clearAll">
                清除筛选
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
