<script setup>
import { computed } from 'vue'
import { DB } from '~/data/db'
import { CAT_LABEL, CAT_TONE, STATUS_LABEL } from '~/data/announce'
import { STATUS_BADGE } from '~/data/constants'

const props = defineProps({ a: Object })
const emit = defineEmits(['close', 'edit', 'flash'])

const meta = computed(() => [
  ['Penulis', props.a.author_name || '—'],
  ['Tanggal Tayang', DB.idDate(props.a.publish_date)],
  ['Tanggal Berakhir', props.a.expiry_date ? DB.idDate(props.a.expiry_date) : 'Tanpa batas'],
  ['Diperbarui', DB.idDate(props.a.updated_at || props.a.publish_date)],
])
const onDownload = (f) => emit('flash', 'URL unduhan dibuat untuk "' + f.original_name + '" (kedaluwarsa 15 menit).')
</script>

<template>
  <UiModal :title="a.title" icon="megaphone" size="lg" @close="emit('close')">
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:18px">
      <UiBadge :kind="STATUS_BADGE[a.status]" dot>{{ STATUS_LABEL[a.status] }}</UiBadge>
      <UiBadge :kind="CAT_TONE[a.category]">{{ CAT_LABEL[a.category] }}</UiBadge>
      <span v-if="a.is_pinned" class="pin-tag"><AppIcon name="pin" :width="13" :height="13" />Tersemat</span>
      <span class="code">WRT-{{ String(a.id).padStart(4, '0') }}</span>
    </div>
    <div class="grid-2" style="gap:16px;margin-bottom:18px">
      <div v-for="[k, v] in meta" :key="k">
        <div class="t-label" style="margin-bottom:5px">{{ k }}</div>
        <div style="font-size:14px;font-weight:600">{{ v }}</div>
      </div>
    </div>
    <hr class="divider" style="margin:4px 0 18px" >
    <div class="t-label" style="margin-bottom:10px">Isi Warta</div>
    <div style="font-size:15px;line-height:1.65;color:var(--on-surface-variant)" v-html="a.content" />
    <div v-if="a.attachment_ids && a.attachment_ids.length" style="margin-top:22px">
      <div class="t-label" style="margin-bottom:10px">{{ a.attachment_ids.length }} Lampiran</div>
      <AttachmentList :ids="a.attachment_ids" @download="onDownload" />
    </div>
    <div v-if="a.is_notification_triggered" style="margin-top:18px">
      <UiNote kind="blue" icon="bell">Notifikasi terpicu — kanal: {{ Object.keys(a.notification_channels).join(', ') }} (pending_integration).</UiNote>
    </div>
    <template #footer>
      <div class="row muted" style="margin-right:auto;gap:8px;font-size:12.5px"><span class="code">GET /admin/announcements/{{ a.id }}</span></div>
      <button class="btn btn-ghost" @click="emit('close')">Tutup</button>
      <button class="btn btn-primary" @click="emit('edit')"><AppIcon name="edit" />Ubah Warta</button>
    </template>
  </UiModal>
</template>
