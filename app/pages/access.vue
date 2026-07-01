<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const api = useApiClient()
const toast = useToast()

const groups = ref([])
const modules = ref([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)

const tab = ref('groups')
const selId = ref(null)
const editing = ref(null) // group obj | 'new' | null

const loadGroups = async () => { groups.value = (await api.listGroups()) || [] }
const load = async () => {
  loading.value = true; error.value = ''
  try {
    await loadGroups()
    try { modules.value = (await api.listModules()) || [] } catch { /* KPI only */ }
  } catch (e) {
    error.value = e.message || 'Gagal memuat data kontrol akses.'
  } finally {
    loading.value = false
  }
}
onMounted(load)

const activeCount = computed(() => groups.value.filter(g => g.is_active).length)
const totalMembers = computed(() => groups.value.reduce((a, g) => a + (g.member_count || 0), 0))
const totalSub = computed(() => modules.value.reduce((a, m) => a + (m.submodules || []).length, 0))

const saveGroup = async (data) => {
  saving.value = true
  try {
    if (data.id) {
      await api.updateGroup(data.id, { name: data.name, description: data.description || null })
      toast.success('Grup diperbarui.')
    } else {
      await api.createGroup({ name: data.name, description: data.description || null })
      toast.success('Grup dibuat.')
    }
    await loadGroups()
    editing.value = null
  } catch (e) {
    toast.error(e.message || 'Gagal menyimpan grup.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <!-- Detail view -->
  <div v-if="selId">
    <RbacGroupDetail :group-id="selId" @back="selId = null" @edit="editing = $event" @changed="loadGroups" />
    <RbacGroupForm v-if="editing && typeof editing === 'object'" :group="editing" :saving="saving" @close="editing = null" @save="saveGroup" />
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
        <UiKpi label="Grup Aktif" icon="check" tone="em" :value="String(activeCount)" foot="berstatus aktif" />
        <UiKpi label="Total Anggota" icon="users" :value="String(totalMembers)" foot="di seluruh grup" />
        <UiKpi label="Submodul Terlindungi" icon="sliders" tone="gd" :value="String(totalSub)" :foot="modules.length + ' modul'" />
      </div>
      <UiState :loading="loading" :error="error" :empty="!groups.length" empty-text="Belum ada grup." empty-icon="group" @retry="load">
        <div class="group-grid">
          <RbacGroupCard v-for="g in groups" :key="g.id" :g="g" @open="selId = g.id" />
        </div>
      </UiState>
    </div>
    <RbacModules v-else />

    <RbacGroupForm v-if="editing === 'new'" :group="null" :saving="saving" @close="editing = null" @save="saveGroup" />
  </div>
</template>
