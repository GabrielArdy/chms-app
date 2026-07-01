// Pure display formatters (auto-imported by Nuxt from app/utils).
// Extracted from the former mock DB so pages keep formatting after API cutover.

type Num = number | string | null | undefined
type DateLike = string | number | Date | null | undefined

export const fmtIDR = (n: Num): string => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID')

export const fmtIDRk = (input: Num): string => {
  const n = Number(input) || 0
  if (n >= 1e9) return 'Rp ' + (n / 1e9).toFixed(1).replace('.', ',') + ' M'
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1).replace('.', ',') + ' jt'
  return 'Rp ' + n.toLocaleString('id-ID')
}

const TODAY = new Date('2026-06-15')

export const age = (d: DateLike): number | null => {
  if (!d) return null
  const b = new Date(d)
  let a = TODAY.getFullYear() - b.getFullYear()
  if (TODAY.getMonth() < b.getMonth() || (TODAY.getMonth() === b.getMonth() && TODAY.getDate() < b.getDate())) a--
  return a
}

export const initials = (name: string | null | undefined): string =>
  (name || '?').split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase()

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const idDate = (s: DateLike): string => {
  if (!s) return '—'
  const d = new Date(s)
  return d.getDate() + ' ' + MONTHS_ID[d.getMonth()] + ' ' + d.getFullYear()
}

export const idDateTime = (s: DateLike): string => {
  if (!s) return '—'
  const d = new Date(s)
  return idDate(s) + ' • ' + String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0')
}

export const fmtBytes = (input: Num): string => {
  const b = Number(input) || 0
  if (b >= 1048576) return (b / 1048576).toFixed(1).replace('.', ',') + ' MB'
  if (b >= 1024) return Math.round(b / 1024) + ' KB'
  return b + ' B'
}
