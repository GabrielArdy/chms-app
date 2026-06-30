<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({ group: Object })
const emit = defineEmits(['close', 'save'])

const f = reactive({ id: props.group ? props.group.id : null, name: props.group ? props.group.name : '', description: props.group ? props.group.description : '' })
const valid = computed(() => f.name.trim().length >= 1 && f.name.length <= 100)
</script>

<template>
  <UiModal :title="group ? 'Ubah Grup' : 'Buat Grup Baru'" icon="group" @close="emit('close')">
    <UiField label="Nama Grup" required hint="1–100 karakter. Harus unik (HTTP 409 bila terpakai).">
      <input class="input" v-model="f.name" placeholder="mis. Tim Media Sosial" autofocus >
    </UiField>
    <UiField label="Deskripsi" hint="Opsional">
      <textarea class="input" rows="3" v-model="f.description" placeholder="Group untuk tim media sosial" />
    </UiField>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button class="btn btn-primary" :disabled="!valid" @click="emit('save', { ...f })"><AppIcon name="check" />{{ group ? 'Simpan' : 'Buat Grup' }}</button>
    </template>
  </UiModal>
</template>
