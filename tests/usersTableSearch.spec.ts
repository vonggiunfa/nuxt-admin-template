import { describe, expect, it } from 'vitest'
import {
  mergeUsersTableQueryPatch,
  normalizeToStringArray,
  parseUsersRouteQuery,
} from '../utils/usersTableSearch'

describe('normalizeToStringArray', () => {
  it('空值', () => {
    expect(normalizeToStringArray(undefined)).toEqual([])
    expect(normalizeToStringArray(null)).toEqual([])
  })

  it('单 string', () => {
    expect(normalizeToStringArray('a')).toEqual(['a'])
  })

  it('空 string', () => {
    expect(normalizeToStringArray('')).toEqual([])
  })

  it('string[]', () => {
    expect(normalizeToStringArray(['x', 'y'])).toEqual(['x', 'y'])
  })
})

describe('parseUsersRouteQuery', () => {
  it('默认值', () => {
    expect(parseUsersRouteQuery({})).toEqual({
      page: 1,
      pageSize: 10,
      username: '',
      status: [],
      role: [],
    })
  })

  it('解析数字与筛选', () => {
    expect(
      parseUsersRouteQuery({
        page: '2',
        pageSize: '20',
        username: 'foo',
        status: ['active', 'inactive'],
        role: 'lead',
      }),
    ).toEqual({
      page: 2,
      pageSize: 20,
      username: 'foo',
      status: ['active', 'inactive'],
      role: ['lead'],
    })
  })
})

describe('mergeUsersTableQueryPatch', () => {
  it('覆盖、删除与保留', () => {
    const merged = mergeUsersTableQueryPatch(
      { page: '2', noise: 'keep', status: 'old' },
      { page: undefined, username: 'u', status: ['a'] },
    )
    expect(merged).toEqual({
      noise: 'keep',
      username: 'u',
      status: ['a'],
    })
  })
})
