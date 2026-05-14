import { describe, expect, it } from 'vitest'
import { getAuthRedirect } from '../utils/authRedirect'

describe('getAuthRedirect', () => {
  it('未登录访问 / 时重定向到 /sign-in', () => {
    expect(getAuthRedirect('/', false)).toEqual({ redirect: '/sign-in' })
  })

  it('未登录可访问 /sign-in', () => {
    expect(getAuthRedirect('/sign-in', false)).toBeNull()
  })

  it('未登录可访问 /sign-up', () => {
    expect(getAuthRedirect('/sign-up', false)).toBeNull()
  })

  it('未登录可访问 /forgot-password', () => {
    expect(getAuthRedirect('/forgot-password', false)).toBeNull()
  })

  it('已登录访问 /forgot-password 时重定向到 /', () => {
    expect(getAuthRedirect('/forgot-password', true)).toEqual({ redirect: '/' })
  })

  it('已登录访问 /sign-in 时重定向到 /', () => {
    expect(getAuthRedirect('/sign-in', true)).toEqual({ redirect: '/' })
  })

  it('已登录访问 /sign-up 时重定向到 /', () => {
    expect(getAuthRedirect('/sign-up', true)).toEqual({ redirect: '/' })
  })

  it('已登录访问 / 时不重定向', () => {
    expect(getAuthRedirect('/', true)).toBeNull()
  })
})
