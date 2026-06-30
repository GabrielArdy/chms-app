<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'

const groups = ref(DB.groups.map(g => ({ ...g, role_ids: [...g.role_ids], member_ids: [...g.member_ids], granted: [...g.granted] })))
const tab = ref('groups')
const selId = ref(null)
const editing = ref(null) // group obj | 'new' | null

const sel = computed(() => groups.value.find(g => g.id === selId.value))
const totalSub = DB.modules.reduce((a, m) => a + m.submodules.length, 0)
const activeCount = computed(() => groups.value.filter(g => g.is_active).length)
const activeUsers = DB.users.filter(u => u.is_active).length

const upd = (id, patch) => { groups.value = groups.value.map(g => g.id === id ? { ...g, ...patch } : g) }
const saveGroup = (data) => {
  if (data.id) upd(data.id, { name: data.name, description: data.description })
  else groups.value = [...groups.value, { id: Math.max(...groups.value.map(g => g.id)) + 1, name: data.name, description: data.description, is_active: true, created_at: '2026-06-15T00:00:00Z', updated_at: '2026-06-15T00:00:00Z', role_ids: [], member_ids: [], granted: [] }]
  editing.value = null
}
const editingSel = computed(() => editing.value && typeof editing.value === 'object' && sel.value && editing.value.id === sel.value.id)
</script>

<template>
  <!-- Detail view -->
  <div v-if="sel">
    <RbacGroupDetail :g="sel" @back="selId = null" @update="upd(sel.id, $event)" @edit="editing = sel" />
    <RbacGroupForm v-if="editingSel" :group="editing" @close="editing = null" @save="saveGroup" />
  </div>

  <!-- List view -->
  <div v-else class="fade-in">
    <UiPageHead title="Kontrol Akses" desc="Manajemen RBAC dinamis — khusus Administrator (Super Admin). Grup memetakan sekumpulan peran dan pengguna; izin diberikan per submodul.">
      <template #actions>
        <div class="seg">
          <button :class="tab === 'groups' ? 'on' : ''" @click="tab = 'groups'">Grup</button>
          <button :class="tab === 'modules' ? 'on' : ''" @click="tab = 'modules'">Modul &amp; Submodul</button>
        </div>
        <button v-if="tab === 'groups'" class="btn btn-primary" @click="editing = 'new'"><AppIcon name="plus" />Buat Grup</button>
      </template>
    </UiPageHead>

    <div v-if="tab === 'groups'">
      <div class="kpi-grid">
        <UiKpi label="Total Grup" icon="group" :value="String(groups.length)" :foot="activeCount + ' aktif'" />
        <UiKpi label="Peran Tersedia" icon="shield" :value="String(DB.roles.length)" foot="role katalog" />
        <UiKpi label="Pengguna Sistem" icon="users" tone="em" :value="String(DB.users.length)" :foot="activeUsers + ' akun aktif'" />
        <UiKpi label="Submodul Terlindungi" icon="sliders" tone="gd" :value="String(totalSub)" :foot="DB.modules.length + ' modul'" />
      </div>
      <div class="group-grid">
        <RbacGroupCard v-for="g in groups" :key="g.id" :g="g" @open="selId = g.id" />
      </div>
    </div>
    <RbacModules v-else />

    <RbacGroupForm v-if="editing === 'new'" :group="null" @close="editing = null" @save="saveGroup" />
  </div>
</template>
