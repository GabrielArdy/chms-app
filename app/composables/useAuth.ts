// Session state backed by localStorage. Token key `chms_token` is what useApi reads.
import type { User } from '~/types/api'

export const useAuth = () => {
  const read = (k: string) => (import.meta.client ? localStorage.getItem(k) : null)

  const user = useState<User | null>('chms_user', () => {
    const raw = read('chms_user')
    try { return raw ? (JSON.parse(raw) as User) : null } catch { return null }
  })
  const authed = useState<boolean>('chms_auth', () => !!read('chms_token'))

  const setSession = (token: string, u: User | null) => {
    if (import.meta.client) {
      localStorage.setItem('chms_token', token)
      localStorage.setItem('chms_user', JSON.stringify(u || null))
    }
    user.value = u || null
    authed.value = true
  }

  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem('chms_token')
      localStorage.removeItem('chms_user')
    }
    user.value = null
    authed.value = false
  }

  return { authed, user, setSession, logout }
}
