<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'
import { CATEGORIES, CAT_LABEL, CAT_TONE, STATUS_LABEL, TODAY, PAGE_SIZE, sortFeed } from '~/data/announce'
import { STATUS_BADGE } from '~/data/constants'

const items = ref([...DB.announcements].sort(sortFeed))
const view = ref('admin')
const editing = ref(null) // 'new' | item | null
const detail = ref(null)
const confirm = ref(null)
const statusFilter = ref('Semua')
const catFilter = ref('Semua')
const from = ref('')
const to = ref('')
const page = ref(1)
const toast = ref(null)

const flash = (msg) => { toast.value = msg; setTimeout(() => { toast.value = null }, 3200) }
const statuses = ['Semua', 'Published', 'Draft', 'Archived']
const statusChip = (s) => s === 'Published' ? 'Tayang' : s === 'Draft' ? 'Draf' : s === 'Archived' ? 'Arsip' : 'Semua'

const filtered = computed(() => items.value.filter(a =>
  (statusFilter.value === 'Semua' || a.status === statusFilter.value) &&
  (catFilter.value === 'Semua' || a.category === catFilter.value) &&
  (!from.value || a.publish_date >= from.value) && (!to.value || a.publish_date <= to.value)))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
const publicItems = computed(() => items.value.filter(a => a.status === 'Published' && a.publish_date <= TODAY && (!a.expiry_date || a.expiry_date >= TODAY)).sort(sortFeed))

const countStatus = (s) => items.value.filter(i => i.status === s).length
const countPinned = computed(() => items.value.filter(i => i.is_pinned).length)

const resetPage = () => { page.value = 1 }

const upsert = (ann) => {
  if (ann.id) {
    items.value = items.value.map(i => i.id === ann.id ? { ...i, ...ann, updated_at: TODAY + 'T09:00:00Z' } : i).sort(sortFeed)
    flash('Warta "' + ann.title + '" berhasil diperbarui (PUT).')
  } else {
    const id = Math.max(...items.value.map(i => i.id)) + 1
    items.value = [{ ...ann, id, author_id: 15, author_name: DB.user.full_name, created_at: TODAY + 'T09:00:00Z', updated_at: TODAY + 'T09:00:00Z' }, ...items.value].sort(sortFeed)
    flash('Warta berhasil disimpan (POST).')
  }
  editing.value = null
}
const patchStatus = (a, status) => { items.value = items.value.map(i => i.id === a.id ? { ...i, status } : i).sort(sortFeed); flash('Status "' + a.title + '" → ' + status + ' (PATCH).') }
const togglePin = (a) => { items.value = items.value.map(i => i.id === a.id ? { ...i, is_pinned: !i.is_pinned } : i).sort(sortFeed); flash(a.is_pinned ? 'Sematan dilepas.' : 'Warta disematkan ke atas.') }
const del = (a) => { items.value = items.value.filter(i => i.id !== a.id); flash('Warta "' + a.title + '" dihapus permanen (DELETE 204).') }

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

    <div v-if="toast" class="fade-in" style="margin-bottom:18px"><UiNote kind="emerald" icon="check">{{ toast }}</UiNote></div>

    <div v-if="view === 'admin'">
      <div class="kpi-grid">
        <UiKpi label="Total Warta" icon="megaphone" :value="String(items.length)" foot="sepanjang waktu" />
        <UiKpi label="Tayang Aktif" icon="check" tone="em" :value="String(publicItems.length)" foot="terlihat publik" />
        <UiKpi label="Draf" icon="edit" tone="gd" :value="String(countStatus('Draft'))" foot="menunggu publikasi" />
        <UiKpi label="Tersemat" icon="pin" :value="String(countPinned)" foot="pinned di feed" />
      </div>

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
              <td class="muted" style="font-size:13px">{{ DB.idDate(a.publish_date) }} – {{ a.expiry_date ? DB.idDate(a.expiry_date) : '∞' }}</td>
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
    </div>

    <PublicFeed v-else :items="publicItems" @open="detail = $event" />

    <AnnForm v-if="editing" :item="editing === 'new' ? null : editing" @close="editing = null" @save="upsert" />
    <AnnDetail v-if="detail" :a="detail" @close="detail = null" @edit="editFromDetail" @flash="flash" />
    <UiConfirm v-if="confirm" title="Hapus Warta" danger icon="trash" confirm-label="Hapus Permanen" @close="confirm = null" @confirm="del(confirm)">
      <span>Warta <b>"{{ confirm.title }}"</b> akan dihapus permanen (<span class="code">DELETE /admin/announcements/{{ confirm.id }}</span> → 204). Tindakan ini tidak dapat dibatalkan.</span>
    </UiConfirm>
  </div>
</template>
