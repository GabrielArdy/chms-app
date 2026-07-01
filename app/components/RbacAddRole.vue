<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({ g: Object })
const emit = defineEmits(['close', 'add'])

const roleId = ref('')
const valid = computed(() => /^\d+$/.test(roleId.value))
</script>

<template>
  <UiModal :title="'Tambah Peran ke ' + g.name" icon="shield" @close="emit('close')">
    <UiNote kind="blue" icon="info">
      <span>Masukkan <span class="code">role_id</span>. Katalog peran tidak tersedia sebagai endpoint tersendiri di API.</span>
    </UiNote>
    <div style="height:14px" />
    <UiField label="Role ID" required hint="POST /groups/{id}/roles → { role_id }">
      <input class="input" v-model="roleId" inputmode="numeric" placeholder="mis. 2" autofocus >
    </UiField>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button class="btn btn-primary" :disabled="!valid" @click="emit('add', Number(roleId))"><AppIcon name="plus" />Tambah Peran</button>
    </template>
  </UiModal>
</template>
