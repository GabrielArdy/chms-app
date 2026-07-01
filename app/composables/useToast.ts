// Minimal transient toast queue (auto-imported).
export type ToastKind = 'success' | 'error' | 'info'
export interface Toast { id: number; msg: string; kind: ToastKind }

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])
  const push = (msg: string, kind: ToastKind = 'info', ms = 3800) => {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, msg, kind }]
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, ms)
  }
  return {
    toasts,
    success: (m: string) => push(m, 'success'),
    error: (m: string) => push(m, 'error', 5000),
    info: (m: string) => push(m, 'info'),
  }
}
