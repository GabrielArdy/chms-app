export const useAuth = () => {
  const authed = useState('chms_auth', () => import.meta.client && localStorage.getItem('chms_auth') === '1')
  const setAuth = (v) => {
    authed.value = v
    if (import.meta.client) localStorage.setItem('chms_auth', v ? '1' : '0')
  }
  return {
    authed,
    login: () => setAuth(true),
    logout: () => setAuth(false),
  }
}
