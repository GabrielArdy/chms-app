<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'

const props = defineProps({ g: Object })
const emit = defineEmits(['close', 'add'])

const q = ref('')
const candidates = computed(() => DB.users.filter(u =>
  !props.g.member_ids.includes(u.user_id) &&
  (u.full_name.toLowerCase().includes(q.value.toLowerCase()) || u.email.toLowerCase().includes(q.value.toLowerCase()))))
</script>

<template>
  <UiModal :title="'Tambah Anggota ke ' + g.name" icon="userPlus" @close="emit('close')">
    <UiField label="Cari pengguna">
      <div class="search" style="width:100%">
        <AppIcon name="search" :width="17" :height="17" />
        <input v-model="q" placeholder="Nama atau email…" autofocus >
      </div>
    </UiField>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;max-height:320px;overflow-y:auto">
      <template v-if="candidates.length">
        <div v-for="u in candidates" :key="u.user_id" class="row" style="gap:12px;padding:10px 12px;border:1px solid var(--outline-variant);border-radius:6px">
          <div class="av" style="width:36px;height:36px;border-radius:99px;background:var(--c-high);color:var(--primary-container);display:grid;place-items:center;font-weight:700;font-size:13px">{{ DB.initials(u.full_name) }}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:13.5px">{{ u.full_name }}</div>
            <div class="muted" style="font-size:12px">{{ u.email }} • {{ u.roles.join(', ') }}</div>
          </div>
          <button class="btn btn-primary btn-sm" @click="emit('add', u.user_id)"><AppIcon name="plus" />Tambah</button>
        </div>
      </template>
      <div v-else class="empty-ph" style="padding:24px">Tidak ada pengguna cocok</div>
    </div>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Tutup</button>
    </template>
  </UiModal>
</template>
