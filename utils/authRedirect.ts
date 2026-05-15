/** 根据路径与登录态决定是否需要重定向（与 react-template 行为对齐） */
export type AuthRedirectResult = { redirect: string } | null

export function getAuthRedirect(path: string, authed: boolean): AuthRedirectResult {
  const isAuthPage =
    path === '/sign-in' || path === '/sign-up' || path === '/forgot-password'

  if (
    !authed
    && (
      path === '/'
      || path === '/users'
      || path === '/settings'
      || path.startsWith('/settings/')
    )
  )
    return { redirect: '/sign-in' }

  if (authed && isAuthPage) return { redirect: '/' }

  return null
}
