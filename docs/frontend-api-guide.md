# Frontend API Guide — go-chms-services

API reference for frontend developers. Covers every HTTP endpoint, request/response contract, auth, and error handling. Generated from the OpenAPI specs in `api/*.yml` (oapi-codegen + Echo).

> No UI/design content here — wire contracts only.

---

## 1. Conventions

### Base URL
- Most routes mount at root (`/`). RBAC admin routes use the `/api/v1` prefix.
- Default dev server: `http://localhost:8080`.
- Per-module OpenAPI specs live in `api/` (`auth.yml`, `organization.yml`, `announcement.yml`, `rite.yml`, `finance.yml`, `filestorage.yml`, `rbac.yml`, `health.yml`). Swagger UI served at `GET /swagger`.

### Content type
- All request/response bodies: `application/json`.
- File upload: `multipart/form-data` (file storage only).

### Auth
- Bearer token in `Authorization` header: `Authorization: Bearer <token>`.
- Login flow may return a **temporary token** (`token_temporary`) when 2FA required. Exchange it at `/auth/2fa/verify` for a full token.
- Endpoints needing auth are marked **🔒 Auth** below. Public endpoints need no header.

### Standard envelope
Every success response wraps payload in:
```json
{ "status": "success", "message": "<human readable, Indonesian>", "data": { } }
```
`data` shape varies per endpoint (object, array, or null where noted).

### Standard error envelope
```json
{ "status": "error", "message": "<human readable reason>" }
```
Returned for all non-2xx responses (400/401/403/404/409/422/423/500/503).

### Localization (i18n)
- **`message` fields are server-rendered Indonesian strings.** Do not hardcode or assume English.
- **Do not display `message` directly as final UI copy.** Treat it as a fallback/log value. Map to your own i18n catalog instead.
- Branch on machine-stable keys, not message text:
  - HTTP **status code** (200/201/400/401/403/404/409/422/423/500/503).
  - Finance **error codes** in `message` (`ERR_FIN_MFA_INVALID`, `ERR_FIN_DEFICIT_ABORT`, `ERR_FIN_PERIOD_LOCKED`) — parse the code, map to your i18n key.
  - Enum field values (`household_role`, `category`, `transaction_type`, `period_type`, `status`, etc.) — keep raw value as the i18n key; translate via catalog, never display raw.
- Enum values are domain constants (some Indonesian e.g. `Kepala Keluarga`, `Laki-laki`) — use as stable keys, map to localized labels in the frontend.
- Recommend a `locale` resolution layer: `errorCode || httpStatus` → i18n key → localized string. Fall back to server `message` only when no key matches.
- Dates are locale-agnostic on the wire (`YYYY-MM-DD`, RFC3339 UTC). Format for display client-side per user locale/timezone.

### Date formats
- `date` → `YYYY-MM-DD` (e.g. `2026-06-15`).
- `date-time` → RFC3339 / ISO-8601 UTC (e.g. `2026-06-14T08:00:00Z`).

### ID types
- Most IDs are `int32`. Finance `transaction_id` is `int64`. File IDs are UUID strings.

### Pagination
List endpoints that support pagination accept `?page=1&limit=20` and return a `pagination` object in `data`:
```json
{ "page": 1, "limit": 20, "total": 87, "total_pages": 5 }
```
> **Audit Log exception:** uses `page_size` (not `limit`) and returns `total_items`/`total_pages` (not `total`). See section 10.

---

## 2. Endpoint Index

| Method | Path | Auth | Module | Operation |
|--------|------|------|--------|-----------|
| POST | `/auth/login` | — | auth | Login |
| POST | `/auth/2fa/verify` | 🔒 temp token | auth | Verify2FA |
| PUT | `/profile` | 🔒 | auth | UpdateProfile |
| POST | `/organization/households` | — | organization | CreateHousehold |
| GET | `/organization/households` | — | organization | ListHouseholds |
| POST | `/organization/households/{id}/members` | — | organization | AddHouseholdMember |
| GET | `/announcements` | — | announcement | ListActiveAnnouncements |
| GET | `/announcements/{id}` | — | announcement | GetPublicAnnouncement |
| GET | `/admin/announcements` | 🔒 staff | announcement | ListAllAnnouncements |
| POST | `/admin/announcements` | 🔒 staff | announcement | CreateAnnouncement |
| GET | `/admin/announcements/{id}` | 🔒 staff | announcement | GetAnnouncement |
| PUT | `/admin/announcements/{id}` | 🔒 staff | announcement | UpdateAnnouncement |
| PATCH | `/admin/announcements/{id}/status` | 🔒 staff | announcement | UpdateAnnouncementStatus |
| DELETE | `/admin/announcements/{id}` | 🔒 staff | announcement | DeleteAnnouncement |
| POST | `/files/upload` | 🔒 | file-storage | UploadFile |
| GET | `/files/{id}` | 🔒 | file-storage | GetFileMetadata |
| GET | `/files/{id}/download` | 🔒 | file-storage | GetFileDownloadURL |
| DELETE | `/admin/files/{id}` | 🔒 admin | file-storage | DeleteFile |
| GET | `/services/{serviceId}/oos` | 🔒 | rite | GetServiceOrderOfService |
| POST | `/services/{serviceId}/oos` | 🔒 | rite | CreateOrderOfServiceItem |
| PUT | `/services/{serviceId}/oos/{itemId}` | 🔒 | rite | UpdateOrderOfServiceItem |
| GET | `/liturgy-templates` | 🔒 | rite | ListLiturgyTemplates |
| POST | `/financials/transactions` | 🔒 Bendahara | finance | CreateFinancialTransaction |
| POST | `/financials/periods/close` | 🔒 Bendahara + 2FA | finance | CloseFinancialPeriod |
| GET | `/api/v1/admin/rbac/groups` | 🔒 Super Admin | rbac | ListGroups |
| POST | `/api/v1/admin/rbac/groups` | 🔒 Super Admin | rbac | CreateGroup |
| GET | `/api/v1/admin/rbac/groups/{groupId}` | 🔒 Super Admin | rbac | GetGroup |
| PUT | `/api/v1/admin/rbac/groups/{groupId}` | 🔒 Super Admin | rbac | UpdateGroup |
| DELETE | `/api/v1/admin/rbac/groups/{groupId}` | 🔒 Super Admin | rbac | DeleteGroup |
| POST | `/api/v1/admin/rbac/groups/{groupId}/roles` | 🔒 Super Admin | rbac | AddRoleToGroup |
| DELETE | `/api/v1/admin/rbac/groups/{groupId}/roles/{roleId}` | 🔒 Super Admin | rbac | RemoveRoleFromGroup |
| POST | `/api/v1/admin/rbac/groups/{groupId}/members` | 🔒 Super Admin | rbac | AddUserToGroup |
| DELETE | `/api/v1/admin/rbac/groups/{groupId}/members/{userId}` | 🔒 Super Admin | rbac | RemoveUserFromGroup |
| GET | `/api/v1/admin/rbac/modules` | 🔒 Super Admin | rbac | ListModules |
| GET | `/api/v1/admin/rbac/groups/{groupId}/permissions` | 🔒 Super Admin | rbac | GetGroupPermissions |
| PUT | `/api/v1/admin/rbac/groups/{groupId}/permissions/{submoduleId}` | 🔒 Super Admin | rbac | UpsertGroupPermission |
| GET | `/admin/audit-logs` | 🔒 Super Admin | audit-log | ListAuditLogs |
| GET | `/admin/audit-logs/{id}` | 🔒 Super Admin | audit-log | GetAuditLog |
| GET | `/health` | — | health | HealthCheck |

---

## 3. Auth Module

### POST `/auth/login`
Validate credentials. May trigger 2FA for Bendahara/Administrator roles.

**Request**
```json
{ "email": "bendahara@gereja.org", "password": "PasswordAm4n!" }
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string(email) | yes | |
| password | string | yes | minLength 1 |

**Response 200** — `data.requires_2fa` drives branch:
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "token": "<full JWT, when 2FA NOT required>",
    "token_temporary": "<short-lived, when 2FA required>",
    "requires_2fa": false,
    "method": "authenticator_app",
    "user": { "id": 15, "email": "bendahara@gereja.org", "roles": ["Bendahara"] }
  }
}
```
- `requires_2fa: false` → use `token`.
- `requires_2fa: true` → use `token_temporary`, call `/auth/2fa/verify`.

**Errors:** 400, 401 (`Email atau kata sandi salah`), 500.

---

### POST `/auth/2fa/verify` 🔒
Exchange temporary token + OTP for full token. Send temp token in `Authorization` header.

**Request**
```json
{ "code": "481902" }
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| code | string | yes | exactly 6 chars |

**Response 200**
```json
{
  "status": "success",
  "message": "Verifikasi 2FA berhasil.",
  "data": {
    "token": "<full JWT>",
    "user": { "id": 15, "email": "...", "roles": ["Bendahara"] }
  }
}
```
**Errors:** 400, 401, 500.

---

### PUT `/profile` 🔒
Update own profile + notification preferences.

**Request**
```json
{
  "full_name": "Aditya Pratama",
  "phone_number": "+6281234567890",
  "notification_preferences": { "allow_push_notification": true, "allow_whatsapp_gateway": false }
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| full_name | string | yes | 1–255 |
| phone_number | string | no | max 20 |
| notification_preferences | object | no | free-form JSONB, any keys |

**Response 200**
```json
{
  "status": "success",
  "message": "Profil dan preferensi notifikasi berhasil diperbarui.",
  "data": { "id": 15, "full_name": "Aditya Pratama", "phone_number": "+6281234567890",
            "notification_preferences": { } }
}
```
**Errors:** 400, 401, 500.

---

## 4. Organization Module

### POST `/organization/households`
Create household + its first (primary) member atomically.

**Request**
```json
{
  "household_name": "Keluarga Sitorus",
  "address": "Jl. Merdeka No. 45, Jakarta",
  "primary_member": {
    "full_name": "Jonathan Sitorus",
    "household_role": "Kepala Keluarga",
    "gender": "Laki-laki",
    "birth_date": "1985-05-14",
    "phone_number": "+628123456780",
    "baptism_status": "Dewasa",
    "marriage_status": "Kawin",
    "membership_status": "Jemaat Tetap"
  }
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| household_name | string | yes | 1–155 |
| address | string | no | |
| primary_member | MemberInput | yes | see below |

**MemberInput**
| Field | Type | Required | Enum / Notes |
|-------|------|----------|--------------|
| full_name | string | yes | 1–255 |
| household_role | string | yes | `Kepala Keluarga`, `Istri`, `Anak`, `Orang Tua`, `Lainnya` |
| gender | string | yes | `Laki-laki`, `Perempuan` |
| birth_date | date | yes | `YYYY-MM-DD` |
| phone_number | string | no | max 20, nullable |
| baptism_status | string | no | `Belum`(default), `Anak`, `Dewasa` |
| marriage_status | string | no | `Belum Kawin`(default), `Kawin`, `Cerai Hidup`, `Cerai Mati` |
| membership_status | string | no | `Jemaat Tetap`, `Simpatisan`(default), `Pindah` |

**Response 201** — `data` is a `Household`:
```json
{
  "status": "success",
  "message": "Rumah tangga dan jemaat pertama berhasil didaftarkan.",
  "data": {
    "id": 1, "household_name": "Keluarga Sitorus", "address": "...",
    "members": [ { /* Member */ } ]
  }
}
```
**Errors:** 400, 500.

**Member object** (response only)
| Field | Type | Notes |
|-------|------|-------|
| id | int32 | |
| household_id | int32 | |
| household_role | string | |
| user_id | int32 | optional — linked app account (volunteers/system users) |
| full_name | string | |
| gender | string | |
| birth_date | date | |
| phone_number | string | |
| baptism_status | string | |
| marriage_status | string | |
| membership_status | string | |

---

### GET `/organization/households`
List every household with members.

**Response 200** — `data` is an array of `Household`:
```json
{ "status": "success", "message": "Daftar rumah tangga berhasil diambil.",
  "data": [ { "id": 1, "household_name": "...", "address": "...", "members": [ ] } ] }
```
**Errors:** 500.

---

### POST `/organization/households/{id}/members`
Add member to existing household.

**Path param:** `id` (int32) — household ID.

**Request:** `MemberInput` (same schema as above).

**Response 201** — `data` is a `Member`:
```json
{ "status": "success", "message": "Anggota keluarga berhasil ditambahkan.", "data": { /* Member */ } }
```
**Errors:** 400, 404 (`Rumah tangga tidak ditemukan`), 500.

---

## 5. Announcement Module

### Categories
Announcement categories (use exact string as i18n key):
`General`, `Youth`, `Sunday School`, `Social`, `Ministry`, `Wedding`, `Baptism`, `Bereavement`, `Finance`, `Special Service`, `Prayer`

### Attachment flow
1. Upload files first via `POST /files/upload` — get `file_id` UUID per file.
2. Pass UUIDs as `attachment_ids` when creating/updating an announcement.
3. To display: call `GET /files/{id}/download` per UUID to get a 15-min presigned URL.

---

### GET `/announcements`
Public feed. Only `Published` announcements whose publish/expiry window contains today. Pinned items appear first. Supports pagination.

**Query params:** `?page=1&limit=20`

**Response 200**
```json
{
  "status": "success",
  "message": "Daftar warta aktif berhasil diambil.",
  "data": {
    "announcements": [
      {
        "id": 1,
        "title": "...",
        "content": "<html>",
        "category": "Youth",
        "publish_date": "2026-06-15",
        "expiry_date": "2026-06-22",
        "is_pinned": true,
        "author_name": "Aditya Pratama",
        "attachment_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "total_pages": 1 }
  }
}
```

**PublicAnnouncement fields:**
| Field | Type | Notes |
|-------|------|-------|
| id | int32 | |
| title | string | |
| content | string | HTML |
| category | string | |
| publish_date | date | |
| expiry_date | date | nullable |
| is_pinned | bool | pinned items sort first |
| author_name | string | nullable — display name of author |
| attachment_ids | uuid[] | nullable — fetch download URL per ID via `GET /files/{id}/download` |

**Errors:** 500.

---

### GET `/announcements/{id}`
Get single active (Published) announcement by ID.

**Path param:** `id` (int32).

**Response 200** — `data` is `PublicAnnouncement` (same schema as above).

**Errors:** 404, 500.

---

### GET `/admin/announcements` 🔒
Staff/Sekretariat/Administrator. Lists ALL announcements. Supports filters and pagination.

**Query params:**
| Param | Type | Notes |
|-------|------|-------|
| page | int | default 1 |
| limit | int | default 20, max 100 |
| status | string | `Draft`, `Published`, `Archived` |
| category | string | any category value |
| from_date | date | filter by publish_date ≥ |
| to_date | date | filter by publish_date ≤ |

**Response 200**
```json
{
  "status": "success",
  "message": "Daftar seluruh warta berhasil diambil.",
  "data": {
    "announcements": [ { /* Announcement (full) */ } ],
    "pagination": { "page": 1, "limit": 20, "total": 42, "total_pages": 3 }
  }
}
```

**Announcement (full admin view)**
| Field | Type | Notes |
|-------|------|-------|
| id | int32 | |
| title | string | |
| content | string | HTML |
| category | string | |
| status | string | `Draft`/`Published`/`Archived` |
| publish_date | date | |
| expiry_date | date | |
| author_id | int32 | |
| author_name | string | nullable |
| is_pinned | bool | |
| is_notification_triggered | bool | |
| notification_channels | object\<string,string\> | e.g. `{ "whatsapp": "pending_integration" }` |
| attachment_ids | uuid[] | nullable |
| created_at | date-time | |
| updated_at | date-time | |

**Errors:** 401, 403, 500.

---

### POST `/admin/announcements` 🔒
Create announcement. Upload attachments first via file storage, then pass their UUIDs here.

**Request**
```json
{
  "title": "Ibadah Padang Pemuda 2026",
  "content": "<p>Diberitahukan kepada seluruh pemuda...</p>",
  "category": "Youth",
  "status": "Published",
  "publish_date": "2026-06-15",
  "expiry_date": "2026-06-22",
  "is_pinned": false,
  "attachment_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
  "trigger_notification": false,
  "target_channels": ["whatsapp", "push_notification"]
}
```
| Field | Type | Required | Enum / Notes |
|-------|------|----------|--------------|
| title | string | yes | 1–255 |
| content | string | yes | HTML, minLength 1 |
| category | string | yes | see categories list above |
| status | string | no | `Draft`(default), `Published`, `Archived` |
| publish_date | date | yes | |
| expiry_date | date | yes | |
| is_pinned | bool | no | default false |
| attachment_ids | uuid[] | no | file UUIDs from file storage |
| trigger_notification | bool | no | default false — scaffold flag, no dispatch |
| target_channels | string[] | no | scaffold, stored as `pending_integration` |

**Response 201**
```json
{
  "status": "success",
  "message": "Pengumuman berhasil disimpan.",
  "data": {
    "id": 12,
    "title": "...",
    "is_notification_triggered": false,
    "notification_channels": { "whatsapp": "pending_integration" }
  }
}
```
**Errors:** 400, 401, 403, 500.

---

### GET `/admin/announcements/{id}` 🔒
Get full detail of any announcement by ID (including drafts).

**Path param:** `id` (int32).

**Response 200** — `data` is `Announcement` (full admin view, same schema as list).

**Errors:** 401, 403, 404, 500.

---

### PUT `/admin/announcements/{id}` 🔒
Full replacement update. All fields in request body required.

**Path param:** `id` (int32).

**Request**
```json
{
  "title": "...",
  "content": "<p>...</p>",
  "category": "General",
  "status": "Published",
  "publish_date": "2026-06-15",
  "expiry_date": "2026-06-29",
  "is_pinned": false,
  "attachment_ids": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | 1–255 |
| content | string | yes | HTML |
| category | string | yes | see categories list above |
| status | string | yes | `Draft`, `Published`, `Archived` |
| publish_date | date | yes | |
| expiry_date | date | yes | |
| is_pinned | bool | no | default false |
| attachment_ids | uuid[] | no | **replaces** full attachment list |

**Response 200** — `data` is `Announcement` (full admin view).

**Errors:** 400, 401, 403, 404, 500.

---

### PATCH `/admin/announcements/{id}/status` 🔒
Update status only. Use for Draft → Published → Archived transitions.

**Path param:** `id` (int32).

**Request**
```json
{ "status": "Published" }
```
| Field | Type | Required | Enum |
|-------|------|----------|------|
| status | string | yes | `Draft`, `Published`, `Archived` |

**Response 200** — `data` is `Announcement` (full admin view).

**Errors:** 400, 401, 403, 404, 500.

---

### DELETE `/admin/announcements/{id}` 🔒
Permanently delete announcement.

**Path param:** `id` (int32).

**Response 204** — no body.

**Errors:** 401, 403, 404, 500.

---

## 6. File Storage Module

All endpoints 🔒 (Bearer access token). File IDs are UUID strings.

**Allowed MIME types:** images (`image/jpeg`, `image/png`, `image/webp`, etc.) and `application/pdf`. Other types return 422.

---

### POST `/files/upload` 🔒
Upload a file. `multipart/form-data` body with a single `file` field.

**Request:** `Content-Type: multipart/form-data`
```
file: <binary>
```

**Response 201**
```json
{
  "status": "success",
  "message": "File berhasil diunggah.",
  "data": {
    "file_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "original_name": "pengumuman.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 204800,
    "created_at": "2026-06-15T08:00:00Z"
  }
}
```
> Save `file_id` — pass it as `attachment_ids` in announcement create/update.

**Errors:** 400, 401, 422 (type not allowed), 500.

---

### GET `/files/{id}` 🔒
Get file metadata without downloading content.

**Path param:** `id` (UUID string).

**Response 200**
```json
{
  "status": "success",
  "message": "Metadata file berhasil diambil.",
  "data": {
    "file_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "original_name": "pengumuman.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 204800,
    "uploaded_by": 15,
    "created_at": "2026-06-15T08:00:00Z"
  }
}
```

**FileMetadata fields:**
| Field | Type | Notes |
|-------|------|-------|
| file_id | string (UUID) | |
| original_name | string | |
| mime_type | string | |
| size_bytes | int64 | |
| uploaded_by | int32 | user ID |
| created_at | date-time | |

**Errors:** 401, 404, 500.

---

### GET `/files/{id}/download` 🔒
Generate a pre-signed S3 download URL. Valid for 15 minutes.

**Path param:** `id` (UUID string).

**Response 200**
```json
{
  "status": "success",
  "message": "URL unduhan berhasil dibuat.",
  "data": {
    "file_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "download_url": "https://s3.example.com/...",
    "expires_in_seconds": 900
  }
}
```
> URL expires in 900 seconds (15 min). Do not cache it — fetch a fresh URL per download action.

**Errors:** 401, 404, 500.

---

### DELETE `/admin/files/{id}` 🔒 admin
Soft-delete metadata record and hard-delete object from S3. Admin-only.

**Path param:** `id` (UUID string).

**Response 200**
```json
{ "status": "success", "message": "File berhasil dihapus." }
```
**Errors:** 401, 403, 404, 500.

---

## 7. Rite Module (Order of Service / Liturgy)

All endpoints 🔒 (Bearer access token).

### GET `/services/{serviceId}/oos` 🔒
Full minute-by-minute Order of Service. Used by control-room monitors (multimedia/soundman).

**Path param:** `serviceId` (int32).

**Response 200**
```json
{
  "status": "success",
  "message": "Susunan acara ibadah berhasil diambil.",
  "data": {
    "service_id": 10,
    "title": "Ibadah Umum Raya I",
    "service_date": "2026-06-14T08:00:00Z",
    "order_of_service": [ { /* OrderOfServiceItem */ } ]
  }
}
```
**OrderOfServiceItem**
| Field | Type | Notes |
|-------|------|-------|
| id | int32 | |
| sequence_order | int32 | |
| duration_minutes | int32 | |
| activity_name | string | |
| pic_role | string | Multimedia / Soundman / Worship Leader / Liturgist |
| song_id | int32 | nullable |
| description | string | nullable |

**Errors:** 401, 404, 500.

---

### POST `/services/{serviceId}/oos` 🔒
Add activity row to timeline.

**Path param:** `serviceId` (int32).

**Request**
```json
{
  "sequence_order": 3,
  "duration_minutes": 15,
  "activity_name": "Ritus Sakramen Perjamuan Kudus",
  "pic_role": "Liturgist",
  "song_id": null,
  "description": "Menggunakan template Liturgi Perjamuan Kudus Baku."
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| sequence_order | int32 | yes | min 1 |
| duration_minutes | int32 | yes | min 1 |
| activity_name | string | yes | 1–150 |
| pic_role | string | yes | 1–50 |
| song_id | int32 | no | nullable |
| description | string | no | |

**Response 201**
```json
{
  "status": "success",
  "message": "Aktivitas ibadah berhasil ditambahkan ke dalam susunan linimasa.",
  "data": { "id": 43, "service_id": 10, "sequence_order": 3, "activity_name": "..." }
}
```
**Errors:** 400, 401, 404, 409 (sequence_order taken), 500.

---

### PUT `/services/{serviceId}/oos/{itemId}` 🔒
Partial update — omitted fields keep current values.

**Path params:** `serviceId` (int32), `itemId` (int32).

**Request** (all optional)
```json
{ "sequence_order": 3, "duration_minutes": 12, "activity_name": "...", "pic_role": "Liturgist",
  "song_id": 105, "description": "..." }
```
Constraints: `sequence_order` min 1, `duration_minutes` min 1, `activity_name` 1–150, `pic_role` 1–50.

**Response 200**
```json
{
  "status": "success",
  "message": "Linimasa berhasil diperbarui secara real-time.",
  "data": { "id": 43, "sequence_order": 3, "duration_minutes": 12, "activity_name": "..." }
}
```
**Errors:** 400, 401, 404, 409, 500.

---

### GET `/liturgy-templates` 🔒
List standard sacrament/liturgy blueprints.

**Response 200**
```json
{
  "status": "success",
  "message": "Daftar panduan liturgi baku berhasil diambil.",
  "data": { "liturgy_templates": [
    { "id": 1, "name": "Perjamuan Kudus", "rite_type": "Sacrament", "standard_guide": "Panduan baku..." }
  ] }
}
```
**LiturgyTemplate:** `id`, `name`, `rite_type` (`Sacrament`/`Regular Service`/`Special Event`), `standard_guide`.
**Errors:** 401, 500.

---

## 8. Finance Module (Safe Ledger)

Append-only ledger. **Bendahara role required.** Period close also requires 2FA TOTP. Errors carry coded messages (see error table).

### POST `/financials/transactions` 🔒 Bendahara
Append immutable mutation entry. A `Draft` period activates to `Open` on its first transaction. Period row pessimistically locked during write.

**Request**
```json
{
  "period_id": 4,
  "budget_post_id": 2,
  "transaction_type": "Debit",
  "amount": 7500000.00,
  "description": "Penerimaan persembahan persepuluhan via QRIS Bank Mandiri",
  "reference_code": "TX-MNDR-20260612-09412"
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| period_id | int32 | yes | |
| budget_post_id | int32 | yes | |
| transaction_type | string | yes | `Debit` or `Credit` |
| amount | number(double) | yes | > 0 (exclusive) |
| description | string | yes | Debit: state funding channel (QRIS/Transfer/Tunai); Credit: state allocation |
| reference_code | string | yes | 1–100, unique |

**Response 201**
```json
{
  "status": "success",
  "message": "Entri catatan transaksi keuangan sukses ditambahkan ke ledger kas.",
  "data": {
    "transaction_id": 7891204,
    "reference_code": "TX-MNDR-20260612-09412",
    "record_status": "COMMITTED_IMMUTABLE",
    "timestamp": "2026-06-12T23:10:00Z"
  }
}
```
> `transaction_id` is **int64**.

**Errors:** 400, 401, 403 (not Bendahara), 404 (period/budget_post), 409 (dup reference_code), 423 (period locked), 500.

---

### POST `/financials/periods/close` 🔒 Bendahara + 2FA
Hard-close period: locks permanently, computes ending balance, opens next period seeded with it.

**Request**
```json
{
  "target_period_id": 4,
  "next_period_code": "PER-CHMS-JULI-2026",
  "next_start_date": "2026-07-01",
  "next_end_date": "2026-07-31",
  "period_type": "Monthly",
  "two_factor_auth_token": "495102"
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| target_period_id | int32 | yes | |
| next_period_code | string | yes | 1–50, unique |
| next_start_date | date | yes | |
| next_end_date | date | yes | |
| period_type | string | yes | `Monthly`, `Quarterly`, `Annually` |
| two_factor_auth_token | string | yes | TOTP code |

**Response 200**
```json
{
  "status": "success",
  "message": "Prosedur penutupan buku kas berstatus Hard Closed berhasil dijalankan.",
  "data": {
    "closed_period_id": 4,
    "calculated_ending_balance": 142500000.00,
    "initialized_next_period_id": 5,
    "rollover_beginning_balance": 142500000.00,
    "database_lock_status": "LOCKED_PERMANENT"
  }
}
```

**Errors:** 400, 401 (invalid token / `ERR_FIN_MFA_INVALID`), 403, 404, 409 (dup `period_code`), 422 (deficit guard `ERR_FIN_DEFICIT_ABORT`), 423 (`ERR_FIN_PERIOD_LOCKED`), 500.

#### Finance error codes
| HTTP | Code | Meaning |
|------|------|---------|
| 401 | ERR_FIN_MFA_INVALID | Bad/missing 2FA TOTP token |
| 403 | — | Authenticated but not Bendahara |
| 409 | — | Duplicate `reference_code` / `period_code` |
| 422 | ERR_FIN_DEFICIT_ABORT | Closing aborted by deficit guard |
| 423 | ERR_FIN_PERIOD_LOCKED | Target period already hard closed |

---

## 9. RBAC Module

Dynamic role-based access control. **Super Admin (Administrator role) required for all endpoints.** All paths prefixed `/api/v1/admin/rbac/`.

A **Group** bundles one or more Roles and one or more Users. **Permissions** are granted per Group per Submodule (binary `is_granted`). Use `GET /api/v1/admin/rbac/modules` to discover all Modules and Submodules and their IDs.

---

### GET `/api/v1/admin/rbac/groups` 🔒 Super Admin
List all groups with role and member counts.

**Response 200** — `data` is `GroupSummary[]`
```json
{
  "status": "success",
  "message": "...",
  "data": [
    {
      "id": 1, "name": "Tim Keuangan", "description": "...",
      "is_active": true, "role_count": 2, "member_count": 5,
      "created_at": "2026-06-01T00:00:00Z"
    }
  ]
}
```
**GroupSummary fields:** `id`, `name`, `description` (nullable), `is_active`, `role_count`, `member_count`, `created_at`.

**Errors:** 401, 403, 500.

---

### POST `/api/v1/admin/rbac/groups` 🔒 Super Admin
Create a new group.

**Request**
```json
{ "name": "Tim Media", "description": "Group untuk tim media sosial" }
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | 1–100 |
| description | string | no | nullable |

**Response 201** — `data` is `GroupSummary`.

**Errors:** 400, 401, 403, 409 (name taken), 500.

---

### GET `/api/v1/admin/rbac/groups/{groupId}` 🔒 Super Admin
Get group detail with all roles and member list.

**Path param:** `groupId` (int32).

**Response 200** — `data` is `GroupDetail`:
```json
{
  "status": "success",
  "message": "...",
  "data": {
    "id": 1, "name": "Tim Keuangan", "description": "...", "is_active": true,
    "roles": [ { "id": 2, "name": "Bendahara", "description": "..." } ],
    "members": [ { "user_id": 15, "email": "...", "is_active": true, "assigned_at": "..." } ],
    "created_at": "...", "updated_at": "..."
  }
}
```
**GroupDetail fields:** `id`, `name`, `description`, `is_active`, `roles` (`RoleSummary[]`), `members` (`GroupMember[]`), `created_at`, `updated_at`.

**RoleSummary:** `id`, `name`, `description` (nullable).

**GroupMember:** `user_id`, `email`, `is_active`, `assigned_at`.

**Errors:** 401, 403, 404, 500.

---

### PUT `/api/v1/admin/rbac/groups/{groupId}` 🔒 Super Admin
Update group name and description.

**Path param:** `groupId` (int32).

**Request:** same as `CreateGroup` (`name` required, `description` optional).

**Response 200** — `data` is `GroupSummary`.

**Errors:** 400, 401, 403, 404, 409, 500.

---

### DELETE `/api/v1/admin/rbac/groups/{groupId}` 🔒 Super Admin
Deactivate a group. Fails with 400 if group still has active members.

**Path param:** `groupId` (int32).

**Response 200**
```json
{ "status": "success", "message": "..." }
```
**Errors:** 400 (has active members), 401, 403, 404, 500.

---

### POST `/api/v1/admin/rbac/groups/{groupId}/roles` 🔒 Super Admin
Assign a role to a group.

**Path param:** `groupId` (int32).

**Request**
```json
{ "role_id": 2 }
```

**Response 200** — `{ "status": "success", "message": "..." }`

**Errors:** 400, 401, 403, 404, 409 (already assigned), 500.

---

### DELETE `/api/v1/admin/rbac/groups/{groupId}/roles/{roleId}` 🔒 Super Admin
Remove a role from a group. Fails with 400 if it's the group's last role.

**Path params:** `groupId` (int32), `roleId` (int32).

**Response 200** — `{ "status": "success", "message": "..." }`

**Errors:** 400 (last role), 401, 403, 404, 500.

---

### POST `/api/v1/admin/rbac/groups/{groupId}/members` 🔒 Super Admin
Add a user to a group.

**Path param:** `groupId` (int32).

**Request**
```json
{ "user_id": 15 }
```

**Response 200** — `{ "status": "success", "message": "..." }`

**Errors:** 400, 401, 403, 404, 409 (already member), 500.

---

### DELETE `/api/v1/admin/rbac/groups/{groupId}/members/{userId}` 🔒 Super Admin
Remove a user from a group.

**Path params:** `groupId` (int32), `userId` (int32).

**Response 200** — `{ "status": "success", "message": "..." }`

**Errors:** 401, 403, 404, 500.

---

### GET `/api/v1/admin/rbac/modules` 🔒 Super Admin
List all Modules with their Submodules. Use this to discover `submodule_id` values for permission management.

**Response 200** — `data` is `ModuleSummary[]`:
```json
{
  "status": "success",
  "message": "...",
  "data": [
    {
      "id": 1, "code": "FINANCE", "name": "Keuangan", "description": "...",
      "sort_order": 1, "is_active": true,
      "submodules": [
        {
          "id": 1, "code": "FINANCE_TRANSACTION_VIEW", "name": "Lihat Transaksi",
          "sort_order": 1, "is_active": true, "is_view": true
        }
      ]
    }
  ]
}
```

**ModuleSummary fields:** `id`, `code`, `name`, `description` (nullable), `sort_order`, `is_active`, `submodules` (`SubmoduleSummary[]`).

**SubmoduleSummary fields:** `id`, `code`, `name`, `description` (nullable), `sort_order`, `is_active`, `is_view` (`true` = read-only submodule).

**Errors:** 401, 403, 500.

---

### GET `/api/v1/admin/rbac/groups/{groupId}/permissions` 🔒 Super Admin
Get the full permission matrix for a group — one entry per submodule.

**Path param:** `groupId` (int32).

**Response 200** — `data` is `PermissionEntry[]`:
```json
{
  "status": "success",
  "message": "...",
  "data": [
    {
      "submodule_id": 1, "submodule_code": "FINANCE_TRANSACTION_VIEW",
      "submodule_name": "Lihat Transaksi", "module_code": "FINANCE",
      "module_name": "Keuangan", "is_granted": true,
      "granted_by": 1, "granted_at": "2026-06-01T00:00:00Z"
    }
  ]
}
```

**PermissionEntry fields:** `submodule_id`, `submodule_code`, `submodule_name`, `module_code`, `module_name`, `is_granted`, `granted_by` (nullable int32), `granted_at` (nullable date-time).

**Errors:** 401, 403, 404, 500.

---

### PUT `/api/v1/admin/rbac/groups/{groupId}/permissions/{submoduleId}` 🔒 Super Admin
Grant or revoke access for a group on a specific submodule (upsert).

**Path params:** `groupId` (int32), `submoduleId` (int32).

**Request**
```json
{ "is_granted": true }
```

**Response 200** — `data` is `PermissionEntry` (same schema as above).

**Errors:** 400, 401, 403, 404, 500.

---

## 10. Audit Log Module

Read-only immutable audit trail. **Super Admin (Administrator role) required.** All entries stored in MongoDB; IDs are MongoDB ObjectID hex strings. No write/delete operations are exposed.

---

### GET `/admin/audit-logs` 🔒 Super Admin
Search audit trail, paginated, newest first.

**Query params:**
| Param | Type | Notes |
|-------|------|-------|
| page | int32 | default 1 |
| page_size | int32 | default 20, max 100 |
| actor_id | string | filter by user ID who performed action |
| entity | string | filter by entity type (e.g. `user`, `period`, `announcement`) |
| action | string | filter by action code (e.g. `user.login`, `finance.period.closed`) |
| date_from | date-time | inclusive lower bound on `created_at` (RFC3339) |
| date_to | date-time | inclusive upper bound on `created_at` (RFC3339) |

**Response 200**
```json
{
  "status": "success",
  "message": "Daftar log audit berhasil diambil.",
  "data": {
    "logs": [
      {
        "id": "6673a1bc2f4e3d00a1b2c3d4",
        "action": "finance.period.closed",
        "entity": "period",
        "entity_id": "4",
        "actor_id": "15",
        "actor_name": "Aditya Pratama",
        "ip_address": "192.168.1.10",
        "created_at": "2026-06-15T08:00:00Z"
      }
    ],
    "pagination": { "page": 1, "page_size": 20, "total_items": 342, "total_pages": 18 }
  }
}
```

> **Note:** pagination key is `page_size` (not `limit`) and item count is `total_items` (not `total`).

**AuditLog (list view) fields:**
| Field | Type | Notes |
|-------|------|-------|
| id | string | MongoDB ObjectID hex |
| action | string | dot-notation action code |
| entity | string | affected entity type |
| entity_id | string | affected record ID |
| actor_id | string | nullable |
| actor_name | string | nullable |
| ip_address | string | nullable |
| created_at | date-time | |

**Errors:** 401, 403, 500.

---

### GET `/admin/audit-logs/{id}` 🔒 Super Admin
Get single audit entry with full forensic context.

**Path param:** `id` (MongoDB ObjectID hex string).

**Response 200**
```json
{
  "status": "success",
  "message": "Detail log audit berhasil diambil.",
  "data": {
    "id": "6673a1bc2f4e3d00a1b2c3d4",
    "action": "finance.period.closed",
    "entity": "period",
    "entity_id": "4",
    "actor_id": "15",
    "actor_name": "Aditya Pratama",
    "ip_address": "192.168.1.10",
    "user_agent": "Mozilla/5.0 ...",
    "metadata": { "closed_period_id": 4, "ending_balance": 142500000 },
    "created_at": "2026-06-15T08:00:00Z"
  }
}
```

**AuditLogDetail extra fields** (beyond list view):
| Field | Type | Notes |
|-------|------|-------|
| user_agent | string | nullable |
| metadata | object | free-form, action-specific payload |

**Errors:** 401, 403, 404, 500.

---

## 11. Health Module

### GET `/health`
Service + dependency health. No auth.

**Response 200 (healthy) / 503 (degraded)** — same schema:
```json
{ "status": "ok", "dependencies": { "postgres": "ok", "mongodb": "ok", "redis": "ok" } }
```
| Field | Type | Notes |
|-------|------|-------|
| status | string | `ok` or `degraded` |
| dependencies | object\<string,string\> | per-dependency status |

- 200 → healthy. 503 → one+ dependency unhealthy. Same body shape both ways; branch on HTTP status.

---

## 12. HTTP Status Reference

| Code | Meaning (this API) |
|------|--------------------|
| 200 | OK |
| 201 | Created |
| 204 | Deleted (no body) |
| 400 | Invalid request payload |
| 401 | Missing/invalid credentials or token |
| 403 | Authenticated but not allowed (role) |
| 404 | Referenced resource not found |
| 409 | Conflict (duplicate unique value / sequence taken) |
| 422 | Business rule rejection (finance deficit guard / unsupported file type) |
| 423 | Resource locked (finance period hard closed) |
| 500 | Internal server error |
| 503 | Health: a dependency is unhealthy |

All errors use the `{ "status": "error", "message": "..." }` envelope.
