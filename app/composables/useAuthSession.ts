export function useAuthSession() {
  /** 演示用登录 cookie；值为 `'1'` 表示已登录 */
  const session = useCookie<string | null>('na_session', {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    default: () => null,
  })

  const authed = computed(() => session.value === '1')

  function login() {
    session.value = '1'
  }

  function logout() {
    session.value = null
  }

  return { session, authed, login, logout }
}
