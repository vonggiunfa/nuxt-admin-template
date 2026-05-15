import { Shield, User as UserIcon, Users } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { User } from '../schema'

export const callTypes = new Map<User['status'], string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['suspended', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

export type UserRoleMeta = ReadonlyArray<{
  label: string
  value: User['role']
  icon: Component
}>

/** 表格与筛选器展示用（value 仍为枚举字面量） */
export const userStatusLabels = {
  active: '已启用',
  inactive: '未启用',
  suspended: '已暂停',
} as const satisfies Record<User['status'], string>

export const roles = [
  { label: '超级管理员', value: 'superadmin', icon: Shield },
  { label: '组长', value: 'lead', icon: Users },
  { label: '普通员工', value: 'employee', icon: UserIcon },
] satisfies UserRoleMeta
