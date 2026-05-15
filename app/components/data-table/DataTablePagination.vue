<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  /** eslint-disable vue/prop-name-casing — 对齐 tanstack Table 用语 */
  table: Table<unknown>
  class?: string
}

const props = defineProps<Props>()

const tanstackTable = computed(() => props.table)

const currentPage = computed(
  () => tanstackTable.value.getState().pagination.pageIndex + 1,
)
const totalPages = computed(() => tanstackTable.value.getPageCount())
const pageNumbers = computed(() =>
  getPageNumbers(currentPage.value, totalPages.value),
)

const pageSizeModel = computed({
  get: () => String(tanstackTable.value.getState().pagination.pageSize),
  set: (v) => {
    tanstackTable.value.setPageSize(Number(v))
  },
})
</script>

<template>
  <div :class="cn(
    'flex items-center justify-between py-2',
    '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
    props.class,
  )">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-25 items-center justify-center text-sm font-medium @2xl/content:hidden">
        {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
        <Select v-model="pageSizeModel">
          <SelectTrigger class="h-8 w-[4.375rem]" size="sm">
            <SelectValue placeholder="分页" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in [10, 20, 30, 40, 50]" :key="size" :value="`${size}`">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p class="hidden text-sm font-medium sm:block">
          每页行数
        </p>
      </div>
    </div>

    <div class="flex items-center sm:space-x-6 lg:space-x-8">
      <div class="flex w-25 items-center justify-center text-sm font-medium @max-3xl/content:hidden">
        {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="size-8 p-0 @max-md/content:hidden"
          :disabled="!tanstackTable.getCanPreviousPage()" @click="tanstackTable.setPageIndex(0)">
          <span class="sr-only">第一页</span>
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="size-8 p-0" :disabled="!tanstackTable.getCanPreviousPage()"
          @click="tanstackTable.previousPage()">
          <span class="sr-only">上一页</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>

        <div v-for="(pageNumber, index) in pageNumbers" :key="`${pageNumber}-${index}`" class="flex items-center">
          <span v-if="pageNumber === '...'" class="px-1 text-sm text-muted-foreground">
            ...
          </span>
          <Button v-else :variant="currentPage === pageNumber ? 'default' : 'outline'" class="h-8 min-w-8 px-2"
            @click="tanstackTable.setPageIndex((pageNumber as number) - 1)">
            <span class="sr-only">{{ pageNumber }} 页</span>
            {{ pageNumber }}
          </Button>
        </div>

        <Button variant="outline" class="size-8 p-0" :disabled="!tanstackTable.getCanNextPage()"
          @click="tanstackTable.nextPage()">
          <span class="sr-only">下一页</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button variant="outline" class="size-8 p-0 @max-md/content:hidden" :disabled="!tanstackTable.getCanNextPage()"
          @click="tanstackTable.setPageIndex(tanstackTable.getPageCount() - 1)">
          <span class="sr-only">最后一页</span>
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
