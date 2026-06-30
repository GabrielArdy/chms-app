<script setup>
import { DB } from '~/data/db'

defineProps({ ids: { type: Array, default: () => [] } })
const emit = defineEmits(['download'])

const isImg = (mime) => (mime || '').startsWith('image')
</script>

<template>
  <div v-if="ids && ids.length" style="display:flex;flex-direction:column;gap:8px">
    <template v-for="id in ids" :key="id">
      <div v-if="DB.fileById(id)" class="attach-chip">
        <span :class="'f-ic ' + (isImg(DB.fileById(id).mime_type) ? 'img' : 'pdf')">
          <AppIcon :name="isImg(DB.fileById(id).mime_type) ? 'image' : 'file'" :width="17" :height="17" />
        </span>
        <div style="flex:1;min-width:0">
          <div class="f-name">{{ DB.fileById(id).original_name }}</div>
          <div class="f-meta">{{ DB.fileById(id).mime_type }} • {{ DB.fmtBytes(DB.fileById(id).size_bytes) }}</div>
        </div>
        <button class="btn btn-ghost btn-sm" @click="emit('download', DB.fileById(id))"><AppIcon name="download" />Unduh</button>
      </div>
    </template>
  </div>
</template>
