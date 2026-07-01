export const CATEGORIES = ['General', 'Youth', 'Sunday School', 'Social', 'Ministry', 'Wedding', 'Baptism', 'Bereavement', 'Finance', 'Special Service', 'Prayer']
export const CAT_LABEL = { General: 'Umum', Youth: 'Pemuda', 'Sunday School': 'Sekolah Minggu', Social: 'Sosial', Ministry: 'Pelayanan', Wedding: 'Pernikahan', Baptism: 'Baptisan', Bereavement: 'Dukacita', Finance: 'Keuangan', 'Special Service': 'Ibadah Khusus', Prayer: 'Doa' }
export const CAT_TONE = { General: 'slate', Youth: 'gold', 'Sunday School': 'blue', Social: 'emerald', Ministry: 'blue', Wedding: 'gold', Baptism: 'blue', Bereavement: 'slate', Finance: 'emerald', 'Special Service': 'gold', Prayer: 'blue' }
export const STATUS_LABEL = { Published: 'Tayang', Draft: 'Draf', Archived: 'Arsip' }
export const TODAY = '2026-06-15'
export const PAGE_SIZE = 8
type FeedSortable = { is_pinned?: boolean; publish_date: string }
export const sortFeed = (a: FeedSortable, b: FeedSortable) =>
  (Number(b.is_pinned) - Number(a.is_pinned)) || (a.publish_date < b.publish_date ? 1 : -1)
