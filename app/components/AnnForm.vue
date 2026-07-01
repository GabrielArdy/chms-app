<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { CATEGORIES, CAT_LABEL } from '~/data/announce'

const props = defineProps({ item: Object, saving: Boolean })
const emit = defineEmits(['close', 'save'])
const api = useApiClient()
const toast = useToast()

const editing = computed(() => !!props.item)
const it = props.item
const f = reactive(it
  ? { id: it.id, title: it.title, content: it.content, category: it.category, status: it.status, publish_date: it.publish_date, expiry_date: it.expiry_date || '2026-06-30', is_pinned: !!it.is_pinned, attachment_ids: [...(it.attachment_ids || [])], trigger_notification: !!it.is_notification_triggered, target_channels: Object.keys(it.notification_channels || {}).length ? Object.keys(it.notification_channels) : ['whatsapp', 'push_notification'] }
  : { title: '', content: '', category: 'General', status: 'Draft', publish_date: '2026-06-15', expiry_date: '2026-06-30', is_pinned: false, attachment_ids: [], trigger_notification: false, target_channels: ['whatsapp', 'push_notification'] })

const uploads = ref([])
const uploading = ref(false)
const fileInput = ref(null)
const valid = computed(() => f.title.trim() && f.content.trim() && f.publish_date && f.expiry_date)

// Known meta comes from this session's uploads; pre-existing UUIDs render a stub chip.
const newIds = ref(new Set())
const lookup = (id) => uploads.value.find(u => u.file_id === id) || { file_id: id, original_name: 'Lampiran ' + String(id).slice(0, 8), mime_type: '', size_bytes: 0 }
const isImg = (mime) => (mime || '').startsWith('image')

const toggleCh = (ch) => { f.target_channels = f.target_channels.includes(ch) ? f.target_channels.filter(c => c !== ch) : [...f.target_channels, ch] }

const onPick = async (e) => {
  const files = Array.from(e.target.files || [])
  const ok = files.filter(file => ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type))
  e.target.value = ''
  if (!ok.length) return
  uploading.value = true
  try {
    for (const file of ok) {
      const rec = await api.uploadFile(file) // { file_id, original_name, mime_type, size_bytes }
      uploads.value = [...uploads.value, rec]
      newIds.value.add(rec.file_id)
      f.attachment_ids = [...f.attachment_ids, rec.file_id]
    }
  } catch (err) {
    toast.error(err.message || 'Gagal mengunggah berkas.')
  } finally {
    uploading.value = false
  }
}
const removeAttach = (id) => { f.attachment_ids = f.attachment_ids.filter(x => x !== id) }
const metaLine = (id) => { const file = lookup(id); return fmtBytes(file.size_bytes) + (newIds.value.has(id) ? ' • baru diunggah' : ' • ' + String(id).slice(0, 8)) }

const submit = (status) => emit('save', { ...f, status, is_notification_triggered: f.trigger_notification, notification_channels: f.trigger_notification ? Object.fromEntries(f.target_channels.map(c => [c, 'pending_integration'])) : {} })

const onScrim = (e) => { if (e.target === e.currentTarget) emit('close') }
const toolbar = ['B', 'I', '“ ”', '• List', 'H']
const statusOpts = [['Draft', 'Draf'], ['Published', 'Tayang'], ['Archived', 'Arsip']]
const channels = [['whatsapp', 'WhatsApp Gateway'], ['push_notification', 'Push Notification']]
</script>

<template>
  <div class="modal-scrim" @mousedown="onScrim">
    <div class="modal lg fade-in" style="max-width:900px">
      <div class="modal-head">
        <div class="k-icon" style="width:38px;height:38px;border-radius:8px"><AppIcon name="megaphone" /></div>
        <h3 style="flex:1">{{ editing ? 'Ubah Warta' : 'Tulis Warta Baru' }}</h3>
        <span v-if="editing" class="code" style="margin-right:8px">PUT /admin/announcements/{{ f.id }}</span>
        <button class="icon-btn" style="border:none;background:none" @click="emit('close')"><AppIcon name="x" /></button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 320px;max-height:74vh">
        <!-- LEFT -->
        <div style="padding:24px 26px;overflow-y:auto;border-right:1px solid var(--outline-variant)">
          <UiField label="Judul Warta" required hint="1–255 karakter">
            <input class="input" v-model="f.title" placeholder="mis. Ibadah Padang Pemuda 2026" autofocus >
          </UiField>
          <UiField label="Isi Warta" required hint="Mendukung HTML sederhana — paragraf, penekanan, daftar.">
            <div style="border:1px solid var(--outline-variant);border-radius:4px;overflow:hidden">
              <div class="row" style="gap:4px;padding:8px;border-bottom:1px solid var(--outline-variant);background:var(--c-low)">
                <button v-for="t in toolbar" :key="t" type="button" class="chip" style="padding:5px 9px;font-weight:700">{{ t }}</button>
              </div>
              <textarea class="input" style="border:none;border-radius:0;min-height:150px" v-model="f.content" placeholder="<p>Diberitahukan kepada seluruh pemuda…</p>" />
            </div>
          </UiField>
          <div class="field-row">
            <UiField label="Tanggal Tayang" required><input class="input" type="date" v-model="f.publish_date" ></UiField>
            <UiField label="Tanggal Berakhir" required><input class="input" type="date" v-model="f.expiry_date" ></UiField>
          </div>

          <UiField label="Lampiran" hint="Unggah dulu via POST /files/upload, lalu UUID disimpan sebagai attachment_ids. PDF & gambar, maks tipe didukung.">
            <input ref="fileInput" type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp" style="display:none" @change="onPick" >
            <div v-if="f.attachment_ids.length" style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">
              <div v-for="id in f.attachment_ids" :key="id" class="attach-chip">
                <template v-if="lookup(id)">
                  <span :class="'f-ic ' + (isImg(lookup(id).mime_type) ? 'img' : 'pdf')"><AppIcon :name="isImg(lookup(id).mime_type) ? 'image' : 'file'" :width="17" :height="17" /></span>
                  <div style="flex:1;min-width:0">
                    <div class="f-name">{{ lookup(id).original_name }}</div>
                    <div class="f-meta">{{ metaLine(id) }}</div>
                  </div>
                  <button class="icon-btn" type="button" style="border:none;background:none;width:30px;height:30px" @click="removeAttach(id)"><AppIcon name="trash" :width="16" :height="16" /></button>
                </template>
              </div>
            </div>
            <div class="dropzone" @click="!uploading && fileInput && fileInput.click()">
              <AppIcon name="upload" :width="22" :height="22" style="color:var(--primary-container)" />
              <div style="font-size:13.5px;font-weight:600;margin-top:8px">{{ uploading ? 'Mengunggah…' : 'Klik untuk mengunggah berkas' }}</div>
              <div class="muted" style="font-size:12px;margin-top:3px">PDF, PNG, JPG, WebP • multipart/form-data</div>
            </div>
          </UiField>
        </div>

        <!-- RIGHT -->
        <div style="padding:24px 22px;overflow-y:auto;background:var(--c-low)">
          <UiField label="Kategori" required>
            <div style="display:flex;flex-wrap:wrap;gap:7px">
              <button v-for="c in CATEGORIES" :key="c" type="button" :class="['chip', f.category === c ? 'on' : '']" @click="f.category = c">{{ CAT_LABEL[c] }}</button>
            </div>
          </UiField>
          <UiField label="Status Publikasi">
            <div class="seg" style="width:100%">
              <button v-for="[v, l] in statusOpts" :key="v" type="button" :class="f.status === v ? 'on' : ''" style="flex:1" @click="f.status = v">{{ l }}</button>
            </div>
          </UiField>
          <div class="row" style="justify-content:space-between;padding:4px 0 14px">
            <div>
              <label style="font-size:13px;font-weight:600;display:block">Sematkan ke Atas</label>
              <span class="hint">is_pinned — tampil paling atas</span>
            </div>
            <UiToggle v-model="f.is_pinned" />
          </div>
          <hr class="divider" style="margin:4px 0 16px" >
          <div class="row" style="justify-content:space-between;margin-bottom:6px">
            <label style="font-size:13px;font-weight:600">Picu Notifikasi</label>
            <UiToggle v-model="f.trigger_notification" />
          </div>
          <div class="hint" style="margin-bottom:12px">Pengiriman masih scaffolded — disimpan sebagai pending_integration.</div>
          <div v-if="f.trigger_notification" class="fade-in" style="display:flex;flex-direction:column;gap:8px">
            <label v-for="[ch, l] in channels" :key="ch" class="row" style="gap:9px;font-size:13.5px;cursor:pointer;padding:8px 10px;border:1px solid var(--outline-variant);border-radius:4px;background:#fff">
              <input type="checkbox" :checked="f.target_channels.includes(ch)" @change="toggleCh(ch)" >{{ l }}
            </label>
          </div>
          <div style="margin-top:16px"><UiNote kind="amber" icon="info">Notifikasi tidak benar-benar dikirim pada fase ini (scaffolded).</UiNote></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" @click="emit('close')">Batal</button>
        <button v-if="!editing" class="btn btn-ghost" :disabled="props.saving || uploading" @click="submit('Draft')">Simpan Draf</button>
        <button class="btn btn-primary" :disabled="!valid || props.saving || uploading" @click="submit(f.status)"><AppIcon name="check" />{{ props.saving ? 'Menyimpan…' : (editing ? 'Simpan Perubahan' : 'Simpan Warta') }}</button>
      </div>
    </div>
  </div>
</template>
