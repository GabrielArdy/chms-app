<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const api = useApiClient()
const toast = useToast()

const PIC_ICON = { Multimedia: 'monitor', Soundman: 'mic', 'Worship Leader': 'music', Liturgist: 'book' }
const RITE_LABEL = { Sacrament: 'Sakramen', 'Regular Service': 'Ibadah Reguler', 'Special Event': 'Acara Khusus' }
const RITE_TONE = { Sacrament: 'blue', 'Regular Service': 'slate', 'Special Event': 'gold' }

const tab = ref('oos')

// ---- OOS (per service) ----
// No "list services" endpoint exists — the service ID is entered/loaded explicitly.
const serviceId = ref(null)
const serviceInput = ref('')
const svc = ref(null)
const items = ref([])
const loading = ref(false)
const error = ref('')
const saving = ref(false)

const adding = ref(false)
const editing = ref(null)

const totalMin = computed(() => items.value.reduce((a, o) => a + (o.duration_minutes || 0), 0))
const picCount = (role) => items.value.filter(o => o.pic_role === role).length
const sortItems = (arr) => [...arr].sort((a, b) => a.sequence_order - b.sequence_order)

const loadOOS = async (id) => {
  loading.value = true; error.value = ''
  try {
    const d = await api.getOOS(id)
    svc.value = d
    items.value = sortItems(d?.order_of_service || [])
    serviceId.value = id
  } catch (e) {
    error.value = e.message || 'Gagal memuat susunan acara.'
    svc.value = null; items.value = []
  } finally {
    loading.value = false
  }
}
const submitLoad = () => { if (/^\d+$/.test(serviceInput.value)) loadOOS(Number(serviceInput.value)) }

const addItem = async (it) => {
  saving.value = true
  try {
    const created = await api.addOOSItem(serviceId.value, it)
    items.value = sortItems([...items.value, { ...it, ...created }])
    adding.value = false
    toast.success('Mata acara ditambahkan.')
  } catch (e) {
    toast.error(e.message || 'Gagal menambah mata acara.')
  } finally {
    saving.value = false
  }
}
const updateItem = async (it) => {
  saving.value = true
  try {
    const updated = await api.updateOOSItem(serviceId.value, it.id, it)
    items.value = sortItems(items.value.map(x => x.id === it.id ? { ...x, ...it, ...updated } : x))
    editing.value = null
    toast.success('Linimasa diperbarui.')
  } catch (e) {
    toast.error(e.message || 'Gagal memperbarui mata acara.')
  } finally {
    saving.value = false
  }
}

// ---- Liturgy templates ----
const templates = ref([])
const tplLoading = ref(false)
const tplError = ref('')
const openTpl = ref(null)

const loadTemplates = async () => {
  tplLoading.value = true; tplError.value = ''
  try { templates.value = (await api.listLiturgyTemplates())?.liturgy_templates || [] }
  catch (e) { tplError.value = e.message || 'Gagal memuat template liturgi.' }
  finally { tplLoading.value = false }
}
onMounted(loadTemplates)
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Ibadah & Liturgi" desc="Susunan acara minute-by-minute untuk ruang kontrol (multimedia & soundman) serta panduan liturgi baku.">
      <template #actions>
        <div class="seg">
          <button :class="tab === 'oos' ? 'on' : ''" @click="tab = 'oos'">Susunan Acara</button>
          <button :class="tab === 'templates' ? 'on' : ''" @click="tab = 'templates'">Template Liturgi</button>
        </div>
        <button v-if="tab === 'oos' && svc" class="btn btn-primary" @click="adding = true"><AppIcon name="plus" />Tambah Mata Acara</button>
      </template>
    </UiPageHead>

    <!-- OOS -->
    <div v-if="tab === 'oos'">
      <!-- Service loader -->
      <div class="card card-pad" style="margin-bottom:20px;display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
        <UiField label="Service ID" hint="GET /services/{serviceId}/oos — tidak ada endpoint daftar layanan." style="margin-bottom:0">
          <input class="input" v-model="serviceInput" inputmode="numeric" placeholder="mis. 10" style="width:160px" @keyup.enter="submitLoad" >
        </UiField>
        <button class="btn btn-primary" :disabled="!/^\d+$/.test(serviceInput) || loading" @click="submitLoad">
          <AppIcon name="search" />{{ loading ? 'Memuat…' : 'Muat Susunan' }}
        </button>
      </div>

      <UiState :loading="loading" :error="error" :empty="!svc" empty-text="Masukkan Service ID untuk memuat susunan acara." empty-icon="book" @retry="serviceId && loadOOS(serviceId)">
        <div class="grid-main">
          <div>
            <div class="card" style="padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;gap:18px;background:linear-gradient(120deg,#0a2548,#1a365d);color:#fff;border:none">
              <div class="brand-mark" style="width:50px;height:50px;background:rgba(173,199,247,.15)"><AppIcon name="book" :width="26" :height="26" style="color:#fff" /></div>
              <div style="flex:1">
                <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--inverse-primary);font-weight:600">Service #{{ svc.service_id }}</div>
                <div style="font-size:21px;font-weight:700;margin-top:4px">{{ svc.title }}</div>
                <div style="font-size:13.5px;color:#c3d2ea;margin-top:3px">{{ idDateTime(svc.service_date) }} WIB</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:13px;color:#c3d2ea">{{ totalMin }} menit • {{ items.length }} mata acara</div>
              </div>
            </div>

            <div class="tbl-wrap">
              <div style="display:grid;grid-template-columns:56px 70px 1fr 150px 90px;gap:16px;padding:11px 18px;background:var(--c-low);border-bottom:1px solid var(--outline-variant)">
                <div v-for="(h, i) in ['No', 'Durasi', 'Aktivitas', 'PIC', '']" :key="i" class="t-label">{{ h }}</div>
              </div>
              <div v-if="!items.length" class="empty-ph" style="padding:28px">Belum ada mata acara pada susunan ini.</div>
              <div v-for="o in items" :key="o.id" class="oos-row" @click="editing = o">
                <div class="oos-seq">{{ o.sequence_order }}</div>
                <div class="oos-dur">{{ o.duration_minutes }}<span class="muted" style="font-size:11px;font-weight:400"> mnt</span></div>
                <div style="min-width:0">
                  <div class="row" style="gap:8px">
                    <span style="font-weight:600;font-size:14.5px">{{ o.activity_name }}</span>
                    <span v-if="o.song_id" class="badge badge-slate" :title="'Lagu #' + o.song_id"><AppIcon name="music" :width="11" :height="11" />#{{ o.song_id }}</span>
                  </div>
                  <div v-if="o.description" class="muted" style="font-size:12.5px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ o.description }}</div>
                </div>
                <div class="row" style="gap:8px">
                  <span class="k-icon" style="width:28px;height:28px"><AppIcon :name="PIC_ICON[o.pic_role] || 'user'" :width="15" :height="15" /></span>
                  <span style="font-size:13px;font-weight:500">{{ o.pic_role }}</span>
                </div>
                <button class="icon-btn" style="border:none;background:none;width:32px;height:32px" @click.stop="editing = o"><AppIcon name="edit" :width="16" :height="16" /></button>
              </div>
            </div>
          </div>

          <!-- Right rail -->
          <div class="stack">
            <div class="card">
              <div class="card-pad" style="padding-bottom:12px"><div class="section-title" style="margin-bottom:0"><h2>Penanggung Jawab</h2></div></div>
              <hr class="divider" >
              <div v-for="(role, i) in ['Multimedia', 'Soundman', 'Worship Leader', 'Liturgist']" :key="role" class="row" style="padding:13px 22px;gap:12px" :style="{ borderBottom: i < 3 ? '1px solid var(--c-high)' : 'none' }">
                <span class="k-icon" style="width:34px;height:34px"><AppIcon :name="PIC_ICON[role]" :width="17" :height="17" /></span>
                <span style="flex:1;font-size:14px;font-weight:500">{{ role }}</span>
                <span class="badge badge-slate">{{ picCount(role) }} tugas</span>
              </div>
            </div>
          </div>
        </div>
      </UiState>
    </div>

    <!-- Templates -->
    <div v-else class="fade-in">
      <UiState :loading="tplLoading" :error="tplError" :empty="!templates.length" empty-text="Belum ada template liturgi." empty-icon="book" @retry="loadTemplates">
        <div class="grid-3">
          <div v-for="t in templates" :key="t.id" class="card card-pad" style="cursor:pointer" @click="openTpl = t">
            <div class="row" style="justify-content:space-between;margin-bottom:14px">
              <div class="k-icon" style="width:44px;height:44px;border-radius:10px"><AppIcon name="book" :width="22" :height="22" /></div>
              <UiBadge :kind="RITE_TONE[t.rite_type]">{{ RITE_LABEL[t.rite_type] || t.rite_type }}</UiBadge>
            </div>
            <div style="font-size:17px;font-weight:700;letter-spacing:-0.01em">{{ t.name }}</div>
            <div class="muted" style="font-size:13.5px;margin-top:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">{{ t.standard_guide }}</div>
            <div class="row" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--c-high);justify-content:space-between">
              <span class="code">LIT-{{ String(t.id).padStart(3, '0') }}</span>
              <span class="row" style="gap:5px;font-size:13px;font-weight:600;color:var(--primary-container)">Lihat panduan<AppIcon name="chevR" :width="15" :height="15" /></span>
            </div>
          </div>
        </div>
      </UiState>
      <UiModal v-if="openTpl" :title="openTpl.name" icon="book" @close="openTpl = null">
        <div class="row" style="gap:10px;margin-bottom:16px">
          <UiBadge :kind="RITE_TONE[openTpl.rite_type]">{{ RITE_LABEL[openTpl.rite_type] || openTpl.rite_type }}</UiBadge>
          <span class="code">LIT-{{ String(openTpl.id).padStart(3, '0') }}</span>
        </div>
        <div class="t-label" style="margin-bottom:8px">Panduan Baku</div>
        <p class="t-body" style="color:var(--on-surface-variant)">{{ openTpl.standard_guide }}</p>
        <template #footer>
          <button class="btn btn-ghost" @click="openTpl = null">Tutup</button>
        </template>
      </UiModal>
    </div>

    <OOSItemModal v-if="adding" :next-seq="items.length + 1" :saving="saving" @close="adding = false" @save="addItem" />
    <OOSItemModal v-if="editing" :item="editing" :saving="saving" @close="editing = null" @save="updateItem" />
  </div>
</template>
