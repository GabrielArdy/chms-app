<script setup>
import { computed } from 'vue'
import { DB } from '~/data/db'

const props = defineProps({ g: Object })
const emit = defineEmits(['close', 'add'])

const candidates = computed(() => DB.roles.filter(r => !props.g.role_ids.includes(r.id)))
</script>

<template>
  <UiModal :title="'Tambah Peran ke ' + g.name" icon="shield" @close="emit('close')">
    <div v-if="candidates.length" style="display:flex;flex-direction:column;gap:8px">
      <div v-for="r in candidates" :key="r.id" class="row" style="gap:12px;padding:12px 14px;border:1px solid var(--outline-variant);border-radius:6px">
        <span class="k-icon" style="width:36px;height:36px;border-radius:8px"><AppIcon name="shield" :width="18" :height="18" /></span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:14px">{{ r.name }}</div>
          <div class="muted" style="font-size:12.5px">{{ r.description }}</div>
        </div>
        <button class="btn btn-primary btn-sm" @click="emit('add', r.id)"><AppIcon name="plus" />Tambah</button>
      </div>
    </div>
    <div v-else class="empty-ph" style="padding:24px">Semua peran sudah ditetapkan</div>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Tutup</button>
    </template>
  </UiModal>
</template>
