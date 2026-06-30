<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: { type: Object, required: true },
  primary: Boolean,
})

const ROLES = ['Kepala Keluarga', 'Istri', 'Anak', 'Orang Tua', 'Lainnya']
const BAPTISM = ['Belum', 'Anak', 'Dewasa']
const MARRIAGE = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']
const MEMBERSHIP = ['Jemaat Tetap', 'Simpatisan', 'Pindah']

const roleOptions = computed(() => props.primary
  ? ['Kepala Keluarga', ...ROLES.filter(r => r !== 'Kepala Keluarga')]
  : ROLES)
</script>

<template>
  <div>
    <UiField label="Nama Lengkap" required>
      <input class="input" v-model="model.full_name" placeholder="mis. Jonathan Sitorus" >
    </UiField>
    <div class="field-row">
      <UiField label="Peran dalam Keluarga" required>
        <select class="select" v-model="model.household_role">
          <option v-for="r in roleOptions" :key="r">{{ r }}</option>
        </select>
      </UiField>
      <UiField label="Jenis Kelamin" required>
        <div class="seg" style="width:100%">
          <button v-for="g in ['Laki-laki', 'Perempuan']" :key="g" type="button" :class="model.gender === g ? 'on' : ''" style="flex:1" @click="model.gender = g">{{ g }}</button>
        </div>
      </UiField>
    </div>
    <div class="field-row">
      <UiField label="Tanggal Lahir" required>
        <input class="input" type="date" v-model="model.birth_date" >
      </UiField>
      <UiField label="Nomor Telepon" hint="Opsional — maks 20 karakter">
        <input class="input" v-model="model.phone_number" placeholder="+62 812-…" >
      </UiField>
    </div>
    <div class="field-row-3">
      <UiField label="Status Baptis">
        <select class="select" v-model="model.baptism_status"><option v-for="b in BAPTISM" :key="b">{{ b }}</option></select>
      </UiField>
      <UiField label="Status Pernikahan">
        <select class="select" v-model="model.marriage_status"><option v-for="b in MARRIAGE" :key="b">{{ b }}</option></select>
      </UiField>
      <UiField label="Keanggotaan">
        <select class="select" v-model="model.membership_status"><option v-for="b in MEMBERSHIP" :key="b">{{ b }}</option></select>
      </UiField>
    </div>
  </div>
</template>
