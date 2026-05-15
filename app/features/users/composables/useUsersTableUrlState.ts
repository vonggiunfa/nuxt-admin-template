import type {
  ColumnFiltersState,
  PaginationState,
  Updater,
} from '@tanstack/vue-table'
import { mergeUsersTableQueryPatch, parseUsersRouteQuery } from '../../../../utils/usersTableSearch'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(prev)
    : updater
}

/** 对齐 react use-table-url-state.ts（本项目 users 表格：无 globalFilter） */
export function useUsersTableUrlState() {
  const route = useRoute()

  const pagination = shallowRef<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const columnFilters = shallowRef<ColumnFiltersState>([])

  function hydrateFromRoute() {
    const q = parseUsersRouteQuery(route.query as Record<string, unknown>)
    pagination.value = {
      pageIndex: Math.max(0, q.page - 1),
      pageSize: q.pageSize,
    }
    const f: ColumnFiltersState = []
    if (q.username.trim())
      f.push({ id: 'username', value: q.username })
    if (q.status.length > 0)
      f.push({ id: 'status', value: q.status })
    if (q.role.length > 0)
      f.push({ id: 'role', value: q.role })

    columnFilters.value = f
  }

  watch(
    () => route.fullPath,
    () => {
      hydrateFromRoute()
    },
    { immediate: true },
  )

  function navigateQuery(
    patch: Partial<Record<string, string | string[] | undefined>>,
    replace = false,
  ) {
    const merged = mergeUsersTableQueryPatch(
      route.query as Record<string, unknown>,
      patch,
    )
    return navigateTo({ path: route.path, query: merged, replace })
  }

  function onPaginationChange(updater: Updater<PaginationState>) {
    const next = resolveUpdater(updater, pagination.value)
    const nextPage = next.pageIndex + 1

    navigateQuery({
      page: nextPage <= DEFAULT_PAGE ? undefined : String(nextPage),
      pageSize:
        next.pageSize === DEFAULT_PAGE_SIZE
          ? undefined
          : String(next.pageSize),
    })
  }

  function onColumnFiltersChange(updater: Updater<ColumnFiltersState>) {
    const next = resolveUpdater(updater, columnFilters.value)

    let username = ''
    let status: string[] = []
    let role: string[] = []

    for (const fl of next) {
      if (fl.id === 'username' && typeof fl.value === 'string')
        username = fl.value
      if (
        fl.id === 'status'
        && Array.isArray(fl.value)
        && fl.value.every((v) => typeof v === 'string')
      )
        status = [...(fl.value as string[])]
      if (
        fl.id === 'role'
        && Array.isArray(fl.value)
        && fl.value.every((v) => typeof v === 'string')
      )
        role = [...(fl.value as string[])]
    }

    navigateQuery({
      page: undefined,
      username: username.trim() !== '' ? username : undefined,
      status: status.length ? status : undefined,
      role: role.length ? role : undefined,
    })
  }

  function ensurePageInRange(
    pageCount: number,
    opts?: { resetTo?: 'first' | 'last' },
  ) {
    const parsed = parseUsersRouteQuery(route.query as Record<string, unknown>)
    const resetTo = opts?.resetTo ?? 'first'

    if (pageCount > 0 && parsed.page > pageCount) {
      navigateQuery(
        {
          page:
            resetTo === 'last' ? String(pageCount) : undefined,
        },
        true,
      )
    }
  }

  return {
    pagination,
    columnFilters,
    onPaginationChange,
    onColumnFiltersChange,
    ensurePageInRange,
  }
}
