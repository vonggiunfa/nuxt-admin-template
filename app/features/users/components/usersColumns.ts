import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import LongText from '@/components/LongText.vue'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import { cn } from '@/lib/utils'
import { callTypes, roles } from '../data/data'
import type { User } from '../schema'
import DataTableRowActions from './DataTableRowActions.vue'

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        'checked':
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false,
        class: 'translate-y-0.5',
        'ariaLabel': '全选',
        'onUpdate:checked': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
        },
      }),
    meta: {
      className: cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
    },
    cell: ({ row }) =>
      h(Checkbox, {
        'checked': row.getIsSelected(),
        class: 'translate-y-0.5',
        'ariaLabel': '选择行',
        'onUpdate:checked': (value: boolean | 'indeterminate') => {
          row.toggleSelected(!!value)
        },
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '用户名' }),
    cell: ({ row }) =>
      h(LongText, { class: 'max-w-36 ps-3' }, () =>
        String(row.getValue('username'))),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none',
      ),
    },
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '姓名' }),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      return h(LongText, { class: 'max-w-36' }, () => `${firstName} ${lastName}`)
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '邮箱' }),
    cell: ({ row }) =>
      h('div', { class: 'w-fit ps-2 text-nowrap' }, String(row.getValue('email'))),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '电话' }),
    cell: ({ row }) =>
      h('div', {}, String(row.getValue('phoneNumber'))),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '状态' }),
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor = callTypes.get(status) ?? ''
      return h('div', { class: 'flex space-x-2' }, [
        h(
          Badge,
          {
            variant: 'outline',
            class: cn('capitalize', badgeColor),
          },
          () => String(row.getValue('status')),
        ),
      ])
    },
    filterFn: (row, id, value) =>
      (value as string[]).includes(row.getValue(id) as string),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: '角色' }),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = roles.find(r => r.value === role)
      if (!userType) {
        return h('span')
      }
      return h('div', { class: 'flex items-center gap-x-2' }, [
        h(userType.icon, { class: 'size-4 text-muted-foreground' }),
        h('span', { class: 'text-sm capitalize' }, String(row.getValue('role'))),
      ])
    },
    filterFn: (row, id, value) =>
      (value as string[]).includes(row.getValue(id) as string),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
