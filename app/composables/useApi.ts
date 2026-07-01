// Central HTTP client. Base URL from runtimeConfig (env: NUXT_PUBLIC_API_BASE_URL).
// Unwraps the standard envelope { status, message, data } -> returns data.
// Throws ApiError { status, code, message, httpStatus } on error (frontend-api-guide §1).
import type { ApiError } from '~/types/api'

export const useApi = () => {
  const { apiBaseUrl } = useRuntimeConfig().public as { apiBaseUrl: string }

  const token = () => (import.meta.client ? localStorage.getItem('chms_token') || '' : '')

  const client = $fetch.create({
    baseURL: apiBaseUrl,
    onRequest({ options }) {
      const t = token()
      if (t) options.headers = { ...(options.headers as Record<string, string>), Authorization: `Bearer ${t}` } as HeadersInit
    },
    onResponseError({ response }) {
      const body = (response._data || {}) as { message?: string }
      const msg = body.message || ''
      const code = (msg.match(/ERR_[A-Z_]+/) || [])[0] || null // finance error codes
      const err: ApiError = { httpStatus: response.status, code, message: msg, status: 'error' }
      throw err
    },
  })

  // Call an endpoint; returns the unwrapped `data` field.
  const request = async <T = unknown>(path: string, opts: Record<string, unknown> = {}): Promise<T> => {
    const res = await client(path, opts as Parameters<typeof client>[1])
    return ((res as { data?: T })?.data ?? res) as T
  }

  return { request, baseUrl: apiBaseUrl }
}
