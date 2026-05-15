import { CreditCard, Shield, UserCheck, Users } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { User } from '../schema'

export const callTypes = new Map<User['status'], string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  ['suspended', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

export type UserRoleMeta = ReadonlyArray<{
  label: string
  value: User['role']
  icon: Component
}>

export const roles = [
  { label: '超级管理员', value: 'superadmin', icon: Shield },
  { label: '管理员', value: 'admin', icon: UserCheck },
  { label: '经理', value: 'manager', icon: Users },
  { label: '收银员', value: 'cashier', icon: CreditCard },
] satisfies UserRoleMeta
