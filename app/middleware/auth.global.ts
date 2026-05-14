import { getAuthRedirect } from '../../utils/authRedirect'

/** 未登录访问首页则跳转登录；已登录访问认证页则回首页 */
export default defineNuxtRouteMiddleware((to) => {
  const { authed } = useAuthSession()
  const next = getAuthRedirect(to.path, authed.value)
  if (next)
    return navigateTo(next.redirect)
})
