<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({ ids: { type: Array, default: () => [] } })
const emit = defineEmits(['download'])
const api = useApiClient()
const toast = useToast()

const metas = ref({})
const busy = ref('')
const isImg = (mime) => (mime || '').startsWith('image')

onMounted(async () => {
  for (const id of props.ids) {
    try { metas.value = { ...metas.value, [id]: await api.getFileMeta(id) } }
    catch { metas.value = { ...metas.value, [id]: { file_id: id, original_name: 'Lampiran', mime_type: '', size_bytes: 0 } } }
  }
})

const download = async (id) => {
  busy.value = id
  try {
    const d = await api.getFileDownloadUrl(id)
    if (d?.download_url && import.meta.client) window.open(d.download_url, '_blank')
    emit('download', metas.value[id] || { file_id: id, original_name: 'Lampiran' })
  } catch (e) {
    toast.error(e.message || 'Gagal membuat URL unduhan.')
  } finally {
    busy.value = ''
  }
}
</script>

<template>
  <div v-if="ids && ids.length" style="display:flex;flex-direction:column;gap:8px">
    <div v-for="id in ids" :key="id" class="attach-chip">
      <span :class="'f-ic ' + (isImg(metas[id] && metas[id].mime_type) ? 'img' : 'pdf')">
        <AppIcon :name="isImg(metas[id] && metas[id].mime_type) ? 'image' : 'file'" :width="17" :height="17" />
      </span>
      <div style="flex:1;min-width:0">
        <div class="f-name">{{ (metas[id] && metas[id].original_name) || 'Memuat…' }}</div>
        <div class="f-meta">
          <template v-if="metas[id]">{{ metas[id].mime_type || 'berkas' }} • {{ fmtBytes(metas[id].size_bytes) }}</template>
          <template v-else>{{ String(id).slice(0, 8) }}…</template>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" :disabled="busy === id" @click="download(id)">
        <AppIcon name="download" />{{ busy === id ? '…' : 'Unduh' }}
      </button>
    </div>
  </div>
</template>
