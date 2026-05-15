<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import DataTablePagination from '@/components/data-table/DataTablePagination.vue'
import DataTableToolbar from '@/components/data-table/DataTableToolbar.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roles, userStatusLabels } from '../data/data'
import { useUsersTableUrlState } from '../composables/useUsersTableUrlState'
import { useUsersWorkspace } from '../composables/useUsersWorkspace'
import UsersDataTableBulkActions from './UsersDataTableBulkActions.vue'
import { usersColumns } from './usersColumns'

const { users } = useUsersWorkspace()

const {
  pagination,
  columnFilters,
  onPaginationChange,
  onColumnFiltersChange,
  ensurePageInRange,
} = useUsersTableUrlState()

const sorting = ref([])
const rowSelection = ref<Record<string, boolean>>({})
const columnVisibility = ref({})

const table = useVueTable({
  data: users,
  columns: usersColumns,
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
  },
  enableRowSelection: true,
  onPaginationChange,
  onColumnFiltersChange,
  onRowSelectionChange: (up) => {
    rowSelection.value
      = typeof up === 'function' ? up(rowSelection.value) : up
  },
  onSortingChange: (up) => {
    sorting.value = typeof up === 'function' ? up(sorting.value) : up
  },
  onColumnVisibilityChange: (up) => {
    columnVisibility.value = typeof up === 'function'
      ? up(columnVisibility.value)
      : up
  },
  getPaginationRowModel: getPaginationRowModel(),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})

watchEffect(() => {
  ensurePageInRange(table.getPageCount())
})
</script>

<template>
  <div
    :class="cn(
      'max-sm:has-[div[role=toolbar]]:mb-16',
      'flex flex-1 flex-col gap-4',
    )"
  >
    <DataTableToolbar
      :table="table"
      search-placeholder="筛选用户…"
      search-key="username"
      :filters="[
        {
          columnId: 'status',
          title: '状态',
          options: (Object.keys(userStatusLabels) as Array<keyof typeof userStatusLabels>).map(
            key => ({ label: userStatusLabels[key], value: key }),
          ),
        },
        {
          columnId: 'role',
          title: '角色',
          options: roles.map(r => ({ label: r.label, value: r.value, icon: r.icon })),
        },
      ]"
    />

    <div class="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="group/row"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan > 1 ? header.colSpan : undefined"
              :class="cn(
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                header.column.columnDef.meta?.className,
                header.column.columnDef.meta?.thClassName,
              )"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="group/row"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="cn(
                  'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                  cell.column.columnDef.meta?.className,
                  cell.column.columnDef.meta?.tdClassName,
                )"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :col-span="usersColumns.length" class="h-24 text-center">
              无结果
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination :table="table" class="mt-auto" />
    <UsersDataTableBulkActions :table="table" />
  </div>
</template>
