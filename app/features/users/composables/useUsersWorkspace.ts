import type { InjectionKey } from 'vue'
import { toast } from 'vue-sonner'
import { userSchema, type User } from '../schema'
import { INITIAL_USERS } from '../data/users'

export type UsersDialogKey =
  | null
  | 'add'
  | 'edit'
  | 'delete'
  | 'multi-delete'

export interface UsersWorkspace {
  users: Ref<User[]>
  dialogOpen: Ref<UsersDialogKey>
  currentRow: Ref<User | null>
  setOpen: (v: UsersDialogKey | null) => void
  setCurrentRow: (row: User | null) => void
  addUser: (input: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateUser: (id: string, patch: Partial<Omit<User, 'id'>>) => void
  removeUsersByIds: (ids: string[]) => void
  setStatusForIds: (
    ids: string[],
    status: User['status'],
  ) => void
}

const USERS_WORKSPACE_KEY: InjectionKey<UsersWorkspace> = Symbol(
  'users-workspace',
)

export function provideUsersWorkspace(): UsersWorkspace {
  const users = ref<User[]>(structuredClone(INITIAL_USERS))
  const dialogOpen = ref<UsersDialogKey>(null)
  const currentRow = ref<User | null>(null)

  function setOpen(v: UsersDialogKey | null) {
    dialogOpen.value = v
  }

  function setCurrentRow(row: User | null) {
    currentRow.value = row
  }

  function addUser(
    input: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    const now = new Date()
    users.value = [
      ...users.value,
      {
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      },
    ]
    toast.success('已添加用户')
  }

  function updateUser(id: string, patch: Partial<Omit<User, 'id'>>) {
    const ix = users.value.findIndex(u => u.id === id)
    if (ix === -1)
      return

    const merged = { ...users.value[ix], ...patch, updatedAt: new Date() }
    const parsed = userSchema.safeParse(merged)
    if (!parsed.success) {
      toast.error('数据校验失败')
      return
    }
    users.value = users.value.slice()
    users.value[ix] = parsed.data
    toast.success('已更新用户')
  }

  function removeUsersByIds(ids: string[]) {
    const set = new Set(ids)
    users.value = users.value.filter(u => !set.has(u.id))
    toast.success(`已删除 ${ids.length} 个用户`)
  }

  function setStatusForIds(ids: string[], status: User['status']) {
    const set = new Set(ids)
    const now = new Date()
    users.value = users.value.map(u =>
      set.has(u.id) ? { ...u, status, updatedAt: now } : u,
    )
    toast.success('已批量更新状态')
  }

  const ctx: UsersWorkspace = {
    users,
    dialogOpen,
    currentRow,
    setOpen,
    setCurrentRow,
    addUser,
    updateUser,
    removeUsersByIds,
    setStatusForIds,
  }

  provide(USERS_WORKSPACE_KEY, ctx)
  return ctx
}

export function useUsersWorkspace(): UsersWorkspace {
  const injected = inject(USERS_WORKSPACE_KEY)
  if (!injected) {
    throw new Error('useUsersWorkspace() 须在 provideUsersWorkspace() 子树下调用')
  }
  return injected
}
