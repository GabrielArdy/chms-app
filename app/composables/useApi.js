// Central HTTP client. Base URL from runtimeConfig (env: NUXT_PUBLIC_API_BASE_URL).
// Unwraps the standard envelope { status, message, data } -> returns data.
// Throws { status, code, message, httpStatus } on error (see frontend-api-guide §1).
export const useApi = () => {
  const { apiBaseUrl } = useRuntimeConfig().public

  const token = () => import.meta.client ? (localStorage.getItem('chms_token') || '') : ''

  const client = $fetch.create({
    baseURL: apiBaseUrl,
    onRequest({ options }) {
      const t = token()
      if (t) options.headers = { ...options.headers, Authorization: `Bearer ${t}` }
    },
    onResponseError({ response }) {
      const body = response._data || {}
      const msg = body.message || ''
      const code = (msg.match(/ERR_[A-Z_]+/) || [])[0] || null // finance error codes
      throw { httpStatus: response.status, code, message: msg, status: 'error' }
    },
  })

  // Call an endpoint; returns the unwrapped `data` field.
  const request = async (path, opts = {}) => {
    const res = await client(path, opts)
    return res?.data ?? res
  }

  return { request, baseUrl: apiBaseUrl }
}
