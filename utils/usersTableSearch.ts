/** 与 users 列表 URL 同步相关的纯函数（不含 Vue / Router 副作用） */

export function normalizeToStringArray(raw: unknown): string[] {
  if (raw == null)
    return []
  if (Array.isArray(raw)) {
    return raw
      .flatMap((v) => (typeof v === 'string' ? v : String(v)))
      .filter((s) => s.length > 0)
  }
  if (typeof raw === 'string')
    return raw.trim() === '' ? [] : [raw]
  return []
}

function parsePositiveInt(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw))
    return Math.max(1, Math.floor(raw))
  if (typeof raw === 'string') {
    const n = Number.parseInt(raw, 10)
    if (!Number.isNaN(n))
      return Math.max(1, n)
  }
  return fallback
}

function parseUsername(raw: unknown): string {
  if (typeof raw === 'string')
    return raw
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string')
    return raw[0]
  return ''
}

export function parseUsersRouteQuery(query: Record<string, unknown>): {
  page: number
  pageSize: number
  username: string
  status: string[]
  role: string[]
} {
  return {
    page: parsePositiveInt(query.page, 1),
    pageSize: parsePositiveInt(query.pageSize, 10),
    username: parseUsername(query.username),
    status: normalizeToStringArray(query.status),
    role: normalizeToStringArray(query.role),
  }
}

/** 产出 `navigateTo({ query })` 可用的扁平 query；`patch` 中显式 `undefined` 表示删除该键 */
export function mergeUsersTableQueryPatch(
  currentQuery: Record<string, unknown>,
  patch: Partial<Record<string, string | string[] | undefined>>,
): Record<string, string | string[]> {
  const keys = new Set([
    ...Object.keys(currentQuery),
    ...Object.keys(patch),
  ])
  const out: Record<string, string | string[]> = {}

  for (const key of keys) {
    const inPatch = Object.prototype.hasOwnProperty.call(patch, key)
    if (inPatch) {
      const v = patch[key]
      if (v === undefined)
        continue

      out[key] = Array.isArray(v) ? [...v] : v
      continue
    }

    const cur = currentQuery[key]
    if (cur == null)
      continue
    if (Array.isArray(cur)) {
      const arr = cur.map((x) => String(x)).filter((s) => s.length > 0)
      if (arr.length > 0)
        out[key] = arr
    }
    else if (typeof cur === 'string' && cur !== '') {
      out[key] = cur
    }
    else if (typeof cur === 'number' || typeof cur === 'boolean') {
      out[key] = String(cur)
    }
  }

  return out
}
