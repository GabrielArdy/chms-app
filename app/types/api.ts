// Wire types mirroring docs/frontend-api-guide.md (go-chms-services).

export interface ApiEnvelope<T> {
  status: 'success' | 'error'
  message: string
  data: T
}

export interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiError {
  httpStatus: number
  code: string | null
  message: string
  status: 'error'
}

// ---- Auth (§3) ----
export interface User {
  id: number
  email: string
  roles: string[]
  full_name?: string
  phone_number?: string | null
  notification_preferences?: Record<string, unknown>
}

export interface LoginData {
  token?: string
  token_temporary?: string
  requires_2fa: boolean
  method?: string
  user?: User
}

export interface Verify2faData {
  token: string
  user: User
}

export interface NotificationPreferences {
  allow_push_notification?: boolean
  allow_whatsapp_gateway?: boolean
  [k: string]: unknown
}

export interface ProfileInput {
  full_name: string
  phone_number?: string | null
  notification_preferences?: NotificationPreferences
}

// ---- Organization (§4) ----
export interface MemberInput {
  full_name: string
  household_role: string
  gender: string
  birth_date: string
  phone_number?: string | null
  baptism_status?: string
  marriage_status?: string
  membership_status?: string
}

export interface Member extends MemberInput {
  id: number
  household_id: number
  user_id?: number
}

export interface HouseholdInput {
  household_name: string
  address?: string | null
  primary_member: MemberInput
}

export interface Household {
  id: number
  household_name: string
  address?: string | null
  members: Member[]
}

// ---- Announcement (§5) ----
export interface PublicAnnouncement {
  id: number
  title: string
  content: string
  category: string
  publish_date: string
  expiry_date?: string | null
  is_pinned: boolean
  author_name?: string | null
  attachment_ids?: string[] | null
}

export interface Announcement extends PublicAnnouncement {
  status: string
  author_id?: number
  is_notification_triggered?: boolean
  notification_channels?: Record<string, string>
  created_at?: string
  updated_at?: string
}

export interface AnnouncementInput {
  title: string
  content: string
  category: string
  status?: string
  publish_date: string
  expiry_date: string
  is_pinned?: boolean
  attachment_ids?: string[]
  trigger_notification?: boolean
  target_channels?: string[]
}

export interface AnnouncementListData {
  announcements: Announcement[]
  pagination: Pagination
}

export interface PublicAnnouncementListData {
  announcements: PublicAnnouncement[]
  pagination: Pagination
}

export interface AnnouncementQuery {
  page?: number
  limit?: number
  status?: string
  category?: string
  from_date?: string
  to_date?: string
}

// ---- File storage (§6) ----
export interface FileMeta {
  file_id: string
  original_name: string
  mime_type: string
  size_bytes: number
  uploaded_by?: number
  created_at?: string
}

export interface FileDownload {
  file_id: string
  download_url: string
  expires_in_seconds: number
}

// ---- Rite (§7) ----
export interface OOSItemInput {
  sequence_order: number
  duration_minutes: number
  activity_name: string
  pic_role: string
  song_id?: number | null
  description?: string | null
}

export interface OOSItem extends OOSItemInput {
  id: number
  service_id?: number
}

export interface ServiceOOS {
  service_id: number
  title: string
  service_date: string
  order_of_service: OOSItem[]
}

export interface LiturgyTemplate {
  id: number
  name: string
  rite_type: string
  standard_guide: string
}

export interface LiturgyTemplateListData {
  liturgy_templates: LiturgyTemplate[]
}

// ---- Finance (§8) ----
export interface TransactionInput {
  period_id: number
  budget_post_id: number
  transaction_type: 'Debit' | 'Credit'
  amount: number
  description: string
  reference_code: string
}

export interface TransactionResult {
  transaction_id: number
  reference_code: string
  record_status: string
  timestamp: string
}

export interface ClosePeriodInput {
  target_period_id: number
  next_period_code: string
  next_start_date: string
  next_end_date: string
  period_type: string
  two_factor_auth_token: string
}

export interface ClosePeriodResult {
  closed_period_id: number
  calculated_ending_balance: number
  initialized_next_period_id: number
  rollover_beginning_balance: number
  database_lock_status: string
}

// ---- RBAC (§9) ----
export interface GroupSummary {
  id: number
  name: string
  description?: string | null
  is_active: boolean
  role_count: number
  member_count: number
  created_at: string
}

export interface RoleSummary {
  id: number
  name: string
  description?: string | null
}

export interface GroupMember {
  user_id: number
  email: string
  is_active: boolean
  assigned_at: string
  full_name?: string
}

export interface GroupDetail {
  id: number
  name: string
  description?: string | null
  is_active: boolean
  roles: RoleSummary[]
  members: GroupMember[]
  created_at: string
  updated_at: string
}

export interface SubmoduleSummary {
  id: number
  code: string
  name: string
  description?: string | null
  sort_order: number
  is_active: boolean
  is_view: boolean
}

export interface ModuleSummary {
  id: number
  code: string
  name: string
  description?: string | null
  sort_order: number
  is_active: boolean
  submodules: SubmoduleSummary[]
}

export interface PermissionEntry {
  submodule_id: number
  submodule_code: string
  submodule_name: string
  module_code: string
  module_name: string
  is_granted: boolean
  granted_by?: number | null
  granted_at?: string | null
}

// ---- Health (§11) ----
export interface HealthStatus {
  status: 'ok' | 'degraded'
  dependencies: Record<string, string>
}
