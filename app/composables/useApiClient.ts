// Typed API surface over useApi().request — one method per documented endpoint.
// Paths verbatim from docs/frontend-api-guide.md. All return the unwrapped `data`.
import type {
  LoginData, Verify2faData, User, ProfileInput,
  Household, HouseholdInput, Member, MemberInput,
  PublicAnnouncement, Announcement, AnnouncementInput,
  AnnouncementListData, PublicAnnouncementListData, AnnouncementQuery,
  FileMeta, FileDownload,
  ServiceOOS, OOSItem, OOSItemInput, LiturgyTemplateListData,
  TransactionInput, TransactionResult, ClosePeriodInput, ClosePeriodResult,
  GroupSummary, GroupDetail, ModuleSummary, PermissionEntry, HealthStatus,
} from '~/types/api'

export const useApiClient = () => {
  const { request } = useApi()

  const qs = (params: Record<string, unknown> = {}): string => {
    const s = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')
    return s ? `?${s}` : ''
  }

  return {
    // ---- Auth (§3) ----
    login: (body: { email: string; password: string }) => request<LoginData>('/auth/login', { method: 'POST', body }),
    verify2fa: (code: string, tempToken: string) =>
      request<Verify2faData>('/auth/2fa/verify', { method: 'POST', body: { code }, headers: { Authorization: `Bearer ${tempToken}` } }),
    updateProfile: (body: ProfileInput) => request<User>('/profile', { method: 'PUT', body }),

    // ---- Organization (§4) ----
    listHouseholds: () => request<Household[]>('/organization/households'),
    createHousehold: (body: HouseholdInput) => request<Household>('/organization/households', { method: 'POST', body }),
    addMember: (householdId: number, body: MemberInput) =>
      request<Member>(`/organization/households/${householdId}/members`, { method: 'POST', body }),

    // ---- Announcement (§5) ----
    listPublicAnnouncements: (params?: AnnouncementQuery) => request<PublicAnnouncementListData>(`/announcements${qs(params)}`),
    getPublicAnnouncement: (id: number) => request<PublicAnnouncement>(`/announcements/${id}`),
    listAnnouncements: (params?: AnnouncementQuery) => request<AnnouncementListData>(`/admin/announcements${qs(params)}`),
    createAnnouncement: (body: AnnouncementInput) => request<Announcement>('/admin/announcements', { method: 'POST', body }),
    getAnnouncement: (id: number) => request<Announcement>(`/admin/announcements/${id}`),
    updateAnnouncement: (id: number, body: AnnouncementInput) => request<Announcement>(`/admin/announcements/${id}`, { method: 'PUT', body }),
    setAnnouncementStatus: (id: number, status: string) =>
      request<Announcement>(`/admin/announcements/${id}/status`, { method: 'PATCH', body: { status } }),
    deleteAnnouncement: (id: number) => request<void>(`/admin/announcements/${id}`, { method: 'DELETE' }),

    // ---- File storage (§6) ----
    uploadFile: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return request<FileMeta>('/files/upload', { method: 'POST', body: fd })
    },
    getFileMeta: (id: string) => request<FileMeta>(`/files/${id}`),
    getFileDownloadUrl: (id: string) => request<FileDownload>(`/files/${id}/download`),
    deleteFile: (id: string) => request<void>(`/admin/files/${id}`, { method: 'DELETE' }),

    // ---- Rite (§7) ----
    getOOS: (serviceId: number) => request<ServiceOOS>(`/services/${serviceId}/oos`),
    addOOSItem: (serviceId: number, body: OOSItemInput) => request<OOSItem>(`/services/${serviceId}/oos`, { method: 'POST', body }),
    updateOOSItem: (serviceId: number, itemId: number, body: Partial<OOSItemInput>) =>
      request<OOSItem>(`/services/${serviceId}/oos/${itemId}`, { method: 'PUT', body }),
    listLiturgyTemplates: () => request<LiturgyTemplateListData>('/liturgy-templates'),

    // ---- Finance (§8) ----
    createTransaction: (body: TransactionInput) => request<TransactionResult>('/financials/transactions', { method: 'POST', body }),
    closePeriod: (body: ClosePeriodInput) => request<ClosePeriodResult>('/financials/periods/close', { method: 'POST', body }),

    // ---- RBAC (§9) — prefix /api/v1/admin/rbac ----
    listGroups: () => request<GroupSummary[]>('/api/v1/admin/rbac/groups'),
    createGroup: (body: { name: string; description?: string | null }) => request<GroupSummary>('/api/v1/admin/rbac/groups', { method: 'POST', body }),
    getGroup: (id: number) => request<GroupDetail>(`/api/v1/admin/rbac/groups/${id}`),
    updateGroup: (id: number, body: { name: string; description?: string | null }) => request<GroupSummary>(`/api/v1/admin/rbac/groups/${id}`, { method: 'PUT', body }),
    deleteGroup: (id: number) => request<void>(`/api/v1/admin/rbac/groups/${id}`, { method: 'DELETE' }),
    addGroupRole: (id: number, roleId: number) =>
      request<void>(`/api/v1/admin/rbac/groups/${id}/roles`, { method: 'POST', body: { role_id: roleId } }),
    removeGroupRole: (id: number, roleId: number) =>
      request<void>(`/api/v1/admin/rbac/groups/${id}/roles/${roleId}`, { method: 'DELETE' }),
    addGroupMember: (id: number, userId: number) =>
      request<void>(`/api/v1/admin/rbac/groups/${id}/members`, { method: 'POST', body: { user_id: userId } }),
    removeGroupMember: (id: number, userId: number) =>
      request<void>(`/api/v1/admin/rbac/groups/${id}/members/${userId}`, { method: 'DELETE' }),
    listModules: () => request<ModuleSummary[]>('/api/v1/admin/rbac/modules'),
    getGroupPermissions: (id: number) => request<PermissionEntry[]>(`/api/v1/admin/rbac/groups/${id}/permissions`),
    setGroupPermission: (id: number, submoduleId: number, isGranted: boolean) =>
      request<PermissionEntry>(`/api/v1/admin/rbac/groups/${id}/permissions/${submoduleId}`, { method: 'PUT', body: { is_granted: isGranted } }),

    // ---- Health (§11) ----
    health: () => request<HealthStatus>('/health'),
  }
}
