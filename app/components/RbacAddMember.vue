<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({ g: Object })
const emit = defineEmits(['close', 'add'])

const userId = ref('')
const valid = computed(() => /^\d+$/.test(userId.value))
</script>

<template>
  <UiModal :title="'Tambah Anggota ke ' + g.name" icon="userPlus" @close="emit('close')">
    <UiNote kind="blue" icon="info">
      <span>Masukkan <span class="code">user_id</span>. Katalog pengguna tidak tersedia sebagai endpoint tersendiri di API.</span>
    </UiNote>
    <div style="height:14px" />
    <UiField label="User ID" required hint="POST /groups/{id}/members → { user_id }">
      <input class="input" v-model="userId" inputmode="numeric" placeholder="mis. 15" autofocus >
    </UiField>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button class="btn btn-primary" :disabled="!valid" @click="emit('add', Number(userId))"><AppIcon name="plus" />Tambah Anggota</button>
    </template>
  </UiModal>
</template>
