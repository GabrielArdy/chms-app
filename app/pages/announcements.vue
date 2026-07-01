<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CATEGORIES, CAT_LABEL, CAT_TONE, STATUS_LABEL, TODAY, PAGE_SIZE, sortFeed } from '~/data/announce'
import { STATUS_BADGE } from '~/data/constants'

const api = useApiClient()
const toast = useToast()

const items = ref([])
const publicItems = ref([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)

const view = ref('admin')
const editing = ref(null) // 'new' | item | null
const detail = ref(null)
const confirm = ref(null)
const statusFilter = ref('Semua')
const catFilter = ref('Semua')
const from = ref('')
const to = ref('')
const page = ref(1)

const flash = (msg) => toast.info(msg)

// Admin list — pull up to 100 and filter/paginate client-side (max limit per docs).
const loadAdmin = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await api.listAnnouncements({ page: 1, limit: 100 })
    items.value = (res?.announcements || []).sort(sortFeed)
  } catch (e) {
    error.value = e.message || 'Gagal memuat daftar warta.'
  } finally {
    loading.value = false
  }
}
const loadPublic = async () => {
  try {
    const res = await api.listPublicAnnouncements({ page: 1, limit: 100 })
    publicItems.value = (res?.announcements || []).sort(sortFeed)
  } catch (e) {
    toast.error(e.message || 'Gagal memuat pratinjau publik.')
  }
}
onMounted(() => { loadAdmin(); loadPublic() })

const statuses = ['Semua', 'Published', 'Draft', 'Archived']
const statusChip = (s) => s === 'Published' ? 'Tayang' : s === 'Draft' ? 'Draf' : s === 'Archived' ? 'Arsip' : 'Semua'

const filtered = computed(() => items.value.filter(a =>
  (statusFilter.value === 'Semua' || a.status === statusFilter.value) &&
  (catFilter.value === 'Semua' || a.category === catFilter.value) &&
  (!from.value || a.publish_date >= from.value) && (!to.value || a.publish_date <= to.value)))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const countStatus = (s) => items.value.filter(i => i.status === s).length
const countPinned = computed(() => items.value.filter(i => i.is_pinned).length)

const resetPage = () => { page.value = 1 }

// Build the full-replacement body PUT/POST expect from a form or list item.
const toBody = (a) => ({
  title: a.title, content: a.content, category: a.category, status: a.status,
  publish_date: a.publish_date, expiry_date: a.expiry_date,
  is_pinned: !!a.is_pinned, attachment_ids: a.attachment_ids || [],
})

const upsert = async (ann) => {
  saving.value = true
  try {
    if (ann.id) {
      const updated = await api.updateAnnouncement(ann.id, toBody(ann))
      items.value = items.value.map(i => i.id === ann.id ? { ...i, ...updated } : i).sort(sortFeed)
      flash('Warta "' + ann.title + '" berhasil diperbarui.')
    } else {
      const created = await api.createAnnouncement({
        ...toBody(ann),
        trigger_notification: !!ann.trigger_notification,
        target_channels: ann.target_channels || [],
      })
      items.value = [{ ...ann, ...created }, ...items.value].sort(sortFeed)
      flash('Warta berhasil disimpan.')
    }
    editing.value = null
    loadPublic()
  } catch (e) {
    toast.error(e.message || 'Gagal menyimpan warta.')
  } finally {
    saving.value = false
  }
}
const patchStatus = async (a, status) => {
  try {
    const updated = await api.setAnnouncementStatus(a.id, status)
    items.value = items.value.map(i => i.id === a.id ? { ...i, ...updated } : i).sort(sortFeed)
    flash('Status "' + a.title + '" → ' + status + '.')
    loadPublic()
  } catch (e) { toast.error(e.message || 'Gagal mengubah status.') }
}
const togglePin = async (a) => {
  try {
    const updated = await api.updateAnnouncement(a.id, { ...toBody(a), is_pinned: !a.is_pinned })
    items.value = items.value.map(i => i.id === a.id ? { ...i, ...updated } : i).sort(sortFeed)
    flash(a.is_pinned ? 'Sematan dilepas.' : 'Warta disematkan ke atas.')
    loadPublic()
  } catch (e) { toast.error(e.message || 'Gagal mengubah sematan.') }
}
const del = async (a) => {
  try {
    await api.deleteAnnouncement(a.id)
    items.value = items.value.filter(i => i.id !== a.id)
    flash('Warta "' + a.title + '" dihapus permanen.')
    loadPublic()
  } catch (e) { toast.error(e.message || 'Gagal menghapus warta.') }
}

const rowMenu = (a) => [
  { label: 'Lihat Detail', icon: 'external', onClick: () => { detail.value = a } },
  { label: 'Ubah Warta', icon: 'edit', onClick: () => { editing.value = a } },
  { label: a.is_pinned ? 'Lepas Sematan' : 'Sematkan', icon: 'pin', onClick: () => togglePin(a) },
  { sep: true },
  ...(a.status !== 'Published' ? [{ label: 'Publikasikan', icon: 'check', onClick: () => patchStatus(a, 'Published') }] : []),
  ...(a.status !== 'Draft' ? [{ label: 'Jadikan Draf', icon: 'edit', onClick: () => patchStatus(a, 'Draft') }] : []),
  ...(a.status !== 'Archived' ? [{ label: 'Arsipkan', icon: 'folder', onClick: () => patchStatus(a, 'Archived') }] : []),
  { sep: true },
  { label: 'Hapus', icon: 'trash', danger: true, onClick: () => { confirm.value = a } },
]

const editFromDetail = () => { editing.value = detail.value; detail.value = null }
const showReset = computed(() => from.value || to.value || catFilter.value !== 'Semua')
const resetFilters = () => { from.value = ''; to.value = ''; catFilter.value = 'Semua'; page.value = 1 }
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Warta Jemaat" desc='Kelola pengumuman gereja. Tampilan publik hanya menampilkan warta berstatus "Published" yang masih dalam masa tayang; warta tersemat tampil paling atas.'>
      <template #actions>
        <div class="seg">
          <button :class="view === 'admin' ? 'on' : ''" @click="view = 'admin'">Kelola (Staf)</button>
          <button :class="view === 'public' ? 'on' : ''" @click="view = 'public'">Pratinjau Publik</button>
        </div>
        <button class="btn btn-ghost" @click="view = 'public'"><AppIcon name="monitor" />Papan Pengumuman</button>
        <button class="btn btn-primary" @click="editing = 'new'"><AppIcon name="plus" />Tulis Warta</button>
      </template>
    </UiPageHead>

    <div v-if="view === 'admin'">
      <div class="kpi-grid">
        <UiKpi label="Total Warta" icon="megaphone" :value="String(items.length)" foot="sepanjang waktu" />
        <UiKpi label="Tayang Aktif" icon="check" tone="em" :value="String(publicItems.length)" foot="terlihat publik" />
        <UiKpi label="Draf" icon="edit" tone="gd" :value="String(countStatus('Draft'))" foot="menunggu publikasi" />
        <UiKpi label="Tersemat" icon="pin" :value="String(countPinned)" foot="pinned di feed" />
      </div>

      <UiState :loading="loading" :error="error" :empty="!items.length"
               empty-text="Belum ada warta." empty-icon="megaphone" @retry="loadAdmin">
      <div class="tbl-wrap">
        <div class="tbl-toolbar" style="flex-wrap:wrap">
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <button v-for="s in statuses" :key="s" :class="['chip', statusFilter === s ? 'on' : '']" @click="statusFilter = s; resetPage()">{{ statusChip(s) }}</button>
          </div>
          <div class="grow" />
          <select class="select" style="width:auto;font-size:13px;padding:7px 11px" v-model="catFilter" @change="resetPage">
            <option value="Semua">Semua kategori</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ CAT_LABEL[c] }}</option>
          </select>
          <input class="input" type="date" title="publish_date dari" style="width:auto;font-size:13px;padding:7px 11px" v-model="from" @change="resetPage" >
          <span class="muted" style="font-size:13px">–</span>
          <input class="input" type="date" title="publish_date sampai" style="width:auto;font-size:13px;padding:7px 11px" v-model="to" @change="resetPage" >
          <button v-if="showReset" class="chip" @click="resetFilters"><AppIcon name="x" :width="13" :height="13" />Reset</button>
        </div>

        <table class="tbl">
          <thead>
            <tr>
              <th>Judul</th><th>Kategori</th><th>Status</th><th>Penulis</th><th>Masa Tayang</th><th style="text-align:center">Lampiran</th><th style="width:50px" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in pageRows" :key="a.id" class="clickable" @click="detail = a">
              <td>
                <div class="row" style="gap:8px">
                  <AppIcon v-if="a.is_pinned" name="pin" :width="14" :height="14" style="color:var(--gold);flex:0 0 auto" />
                  <span class="cell-strong" style="max-width:300px;display:inline-block">{{ a.title }}</span>
                </div>
                <div class="cell-sub">WRT-{{ String(a.id).padStart(4, '0') }}</div>
              </td>
              <td><UiBadge :kind="CAT_TONE[a.category]">{{ CAT_LABEL[a.category] }}</UiBadge></td>
              <td><UiBadge :kind="STATUS_BADGE[a.status]" dot>{{ STATUS_LABEL[a.status] }}</UiBadge></td>
              <td class="muted" style="font-size:13px">{{ a.author_name || '—' }}</td>
              <td class="muted" style="font-size:13px">{{ idDate(a.publish_date) }} – {{ a.expiry_date ? idDate(a.expiry_date) : '∞' }}</td>
              <td style="text-align:center">
                <span v-if="a.attachment_ids && a.attachment_ids.length" class="badge badge-slate"><AppIcon name="paperclip" :width="12" :height="12" />{{ a.attachment_ids.length }}</span>
                <span v-else class="muted">—</span>
              </td>
              <td @click.stop><UiMenu :items="rowMenu(a)" /></td>
            </tr>
          </tbody>
        </table>
        <div class="tbl-foot">
          <span>Menampilkan <b>{{ pageRows.length }}</b> dari <b>{{ filtered.length }}</b> warta</span>
          <div class="pager">
            <button :disabled="page <= 1" @click="page--"><AppIcon name="chevL" :width="15" :height="15" /></button>
            <button v-for="n in totalPages" :key="n" :class="page === n ? 'on' : ''" @click="page = n">{{ n }}</button>
            <button :disabled="page >= totalPages" @click="page++"><AppIcon name="chevR" :width="15" :height="15" /></button>
          </div>
        </div>
      </div>
      </UiState>
    </div>

    <PublicFeed v-else :items="publicItems" @open="detail = $event" />

    <AnnForm v-if="editing" :item="editing === 'new' ? null : editing" :saving="saving" @close="editing = null" @save="upsert" />
    <AnnDetail v-if="detail" :a="detail" @close="detail = null" @edit="editFromDetail" @flash="flash" />
    <UiConfirm v-if="confirm" title="Hapus Warta" danger icon="trash" confirm-label="Hapus Permanen" @close="confirm = null" @confirm="del(confirm)">
      <span>Warta <b>"{{ confirm.title }}"</b> akan dihapus permanen (<span class="code">DELETE /admin/announcements/{{ confirm.id }}</span> → 204). Tindakan ini tidak dapat dibatalkan.</span>
    </UiConfirm>
  </div>
</template>
