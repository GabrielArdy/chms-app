<script setup lang="ts">
import { reactive, computed } from 'vue'

const props = defineProps({ item: Object, nextSeq: Number, saving: Boolean })
const emit = defineEmits(['close', 'save'])

const PIC_ROLES = ['Multimedia', 'Soundman', 'Worship Leader', 'Liturgist']

const f = reactive(props.item
  ? { ...props.item }
  : { sequence_order: props.nextSeq, duration_minutes: 5, activity_name: '', pic_role: 'Liturgist', song_id: null, description: '' })

const valid = computed(() => f.activity_name.trim() && f.duration_minutes >= 1 && f.sequence_order >= 1)
const save = () => emit('save', { ...f, song_id: f.song_id || null })
</script>

<template>
  <UiModal :title="item ? 'Sunting Mata Acara' : 'Tambah Mata Acara'" icon="book" @close="emit('close')">
    <div v-if="item" style="margin-bottom:16px">
      <UiNote kind="blue" icon="refresh">Perubahan tersinkron real-time ke monitor ruang kontrol.</UiNote>
    </div>
    <div class="field-row">
      <UiField label="Urutan" required hint="min. 1">
        <input class="input" type="number" min="1" v-model.number="f.sequence_order" >
      </UiField>
      <UiField label="Durasi (menit)" required hint="min. 1">
        <input class="input" type="number" min="1" v-model.number="f.duration_minutes" >
      </UiField>
    </div>
    <UiField label="Nama Aktivitas" required hint="1–150 karakter">
      <input class="input" v-model="f.activity_name" placeholder="mis. Ritus Sakramen Perjamuan Kudus" >
    </UiField>
    <div class="field-row">
      <UiField label="Penanggung Jawab (PIC)" required>
        <select class="select" v-model="f.pic_role"><option v-for="r in PIC_ROLES" :key="r">{{ r }}</option></select>
      </UiField>
      <UiField label="ID Lagu" hint="Opsional — nullable">
        <input class="input" type="number" :value="f.song_id || ''" placeholder="mis. 105" @input="f.song_id = $event.target.value ? +$event.target.value : null" >
      </UiField>
    </div>
    <UiField label="Deskripsi / Catatan" hint="Opsional">
      <textarea class="input" rows="2" v-model="f.description" placeholder="Catatan teknis untuk pelayan…" />
    </UiField>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button class="btn btn-primary" :disabled="!valid || props.saving" @click="save"><AppIcon name="check" />{{ props.saving ? 'Menyimpan…' : (item ? 'Simpan Perubahan' : 'Tambahkan') }}</button>
    </template>
  </UiModal>
</template>
