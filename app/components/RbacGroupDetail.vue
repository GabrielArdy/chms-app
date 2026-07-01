<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MOD_ICON } from '~/data/rbac'

const props = defineProps({ groupId: { type: Number, required: true } })
const emit = defineEmits(['back', 'edit', 'changed'])

const api = useApiClient()
const toast = useToast()

const detail = ref(null)
const modules = ref([])
const grantMap = ref({}) // submodule_id -> is_granted
const loading = ref(true)
const error = ref('')
const busy = ref(false)

const addingMember = ref(false)
const addingRole = ref(false)
const confirm = ref(null)
const savedPing = ref(false)

const loadDetail = async () => { detail.value = await api.getGroup(props.groupId) }
const loadPerms = async () => {
  const list = (await api.getGroupPermissions(props.groupId)) || []
  const map = {}
  for (const p of list) map[p.submodule_id] = p.is_granted
  grantMap.value = map
}
const load = async () => {
  loading.value = true; error.value = ''
  try {
    const [, , mods] = await Promise.all([loadDetail(), loadPerms(), api.listModules()])
    modules.value = mods || []
  } catch (e) {
    error.value = e.message || 'Gagal memuat detail grup.'
  } finally {
    loading.value = false
  }
}
onMounted(load)

const g = computed(() => detail.value || {})
const roles = computed(() => g.value.roles || [])
const members = computed(() => g.value.members || [])
const totalSub = computed(() => modules.value.reduce((a, m) => a + (m.submodules || []).length, 0))
const grantedTotal = computed(() => Object.values(grantMap.value).filter(Boolean).length)
const grantedCount = (m) => (m.submodules || []).filter(s => grantMap.value[s.id]).length
const memberName = (u) => u.full_name || u.email || ('User #' + u.user_id)

const ping = () => { savedPing.value = true; setTimeout(() => { savedPing.value = false }, 1600) }

const togglePerm = async (subId, val) => {
  const prev = grantMap.value[subId]
  grantMap.value = { ...grantMap.value, [subId]: val }
  try { await api.setGroupPermission(props.groupId, subId, val); ping() }
  catch (e) { grantMap.value = { ...grantMap.value, [subId]: prev }; toast.error(e.message || 'Gagal menyimpan izin.') }
}

const removeMember = async (uid) => {
  busy.value = true
  try { await api.removeGroupMember(props.groupId, uid); await loadDetail(); emit('changed'); toast.success('Anggota dikeluarkan.') }
  catch (e) { toast.error(e.message || 'Gagal mengeluarkan anggota.') }
  finally { busy.value = false }
}
const removeRole = async (rid) => {
  if (roles.value.length <= 1) { confirm.value = { kind: 'lastrole' }; return }
  busy.value = true
  try { await api.removeGroupRole(props.groupId, rid); await loadDetail(); emit('changed'); toast.success('Peran dilepas.') }
  catch (e) { toast.error(e.message || 'Gagal melepas peran.') }
  finally { busy.value = false }
}
const onAddMember = async (uid) => {
  try { await api.addGroupMember(props.groupId, uid); await loadDetail(); addingMember.value = false; emit('changed'); toast.success('Anggota ditambahkan.') }
  catch (e) { toast.error(e.message || 'Gagal menambah anggota.') }
}
const onAddRole = async (rid) => {
  try { await api.addGroupRole(props.groupId, rid); await loadDetail(); addingRole.value = false; emit('changed'); toast.success('Peran ditambahkan.') }
  catch (e) { toast.error(e.message || 'Gagal menambah peran.') }
}
const confirmDelGroup = async () => {
  try { await api.deleteGroup(props.groupId); emit('changed'); emit('back'); toast.success('Grup dinonaktifkan.') }
  catch (e) { toast.error(e.message || 'Gagal menonaktifkan grup.'); confirm.value = null }
}

const menuItems = computed(() => [
  { label: 'Nonaktifkan Grup', icon: 'userX', danger: true, onClick: () => { confirm.value = { kind: 'delgroup' } } },
])
</script>

<template>
  <div class="fade-in">
    <button class="btn btn-ghost btn-sm" style="margin-bottom:16px" @click="emit('back')"><AppIcon name="chevL" />Semua Grup</button>

    <UiState :loading="loading" :error="error" @retry="load">
      <UiPageHead :title="g.name" :desc="g.description">
        <template #actions>
          <span v-if="savedPing" class="badge badge-emerald fade-in"><AppIcon name="check" :width="12" :height="12" />Izin disimpan</span>
          <button class="btn btn-ghost" @click="emit('edit', g)"><AppIcon name="edit" />Ubah Grup</button>
          <UiMenu :items="menuItems" />
        </template>
      </UiPageHead>

      <div class="row" style="gap:10px;margin-bottom:22px;flex-wrap:wrap">
        <UiBadge :kind="g.is_active ? 'emerald' : 'slate'" dot>{{ g.is_active ? 'Aktif' : 'Nonaktif' }}</UiBadge>
        <span class="code">GROUP #{{ g.id }}</span>
        <span class="muted" style="font-size:13px">Dibuat {{ idDate(g.created_at) }} • diperbarui {{ idDate(g.updated_at) }}</span>
      </div>

      <div class="grid-main">
        <!-- LEFT: permission matrix -->
        <div class="stack">
          <div>
            <div class="section-title">
              <AppIcon name="sliders" :width="18" :height="18" style="color:var(--primary-container)" />
              <h2>Matriks Izin</h2>
              <span class="more muted" style="font-size:13px">{{ grantedTotal }} dari {{ totalSub }} submodul diberikan</span>
            </div>
            <div v-for="m in modules" :key="m.id" class="perm-mod">
              <div class="perm-mod-head">
                <div class="m-ic"><AppIcon :name="MOD_ICON[m.code] || 'layers'" :width="18" :height="18" /></div>
                <div style="flex:1">
                  <div class="m-name">{{ m.name }}</div>
                  <span class="m-code">{{ m.code }}</span>
                </div>
                <span class="muted" style="font-size:12.5px">{{ grantedCount(m) }}/{{ (m.submodules || []).length }}</span>
              </div>
              <div v-for="s in (m.submodules || [])" :key="s.id" class="perm-row">
                <div style="flex:1;min-width:0">
                  <div class="row" style="gap:8px">
                    <span class="p-name">{{ s.name }}</span>
                    <span v-if="s.is_view" class="badge badge-slate" title="Submodul baca-saja"><AppIcon name="search" :width="11" :height="11" />View</span>
                  </div>
                  <div class="p-code">{{ s.code }}</div>
                </div>
                <span :class="'badge ' + (grantMap[s.id] ? 'badge-emerald' : 'badge-slate')" style="margin-right:4px">{{ grantMap[s.id] ? 'is_granted' : 'revoked' }}</span>
                <UiToggle :model-value="!!grantMap[s.id]" @update:model-value="togglePerm(s.id, $event)" />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: roles + members -->
        <div class="stack">
          <div class="card card-pad">
            <div class="section-title" style="margin-bottom:14px">
              <h2>Peran</h2>
              <button class="more btn btn-ghost btn-sm" @click="addingRole = true"><AppIcon name="plus" />Tambah</button>
            </div>
            <div v-if="roles.length" style="display:flex;flex-direction:column;gap:10px">
              <div v-for="r in roles" :key="r.id" class="row" style="gap:11px;align-items:flex-start">
                <span class="k-icon" style="width:34px;height:34px;border-radius:8px;flex:0 0 auto"><AppIcon name="shield" :width="17" :height="17" /></span>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;font-size:14px">{{ r.name }}</div>
                  <div class="muted" style="font-size:12.5px;line-height:1.4">{{ r.description }}</div>
                </div>
                <button class="icon-btn" style="border:none;background:none;width:30px;height:30px" title="Lepas peran" :disabled="busy" @click="removeRole(r.id)"><AppIcon name="x" :width="16" :height="16" /></button>
              </div>
            </div>
            <div v-else class="empty-ph" style="padding:20px">Belum ada peran</div>
          </div>

          <div class="card card-pad">
            <div class="section-title" style="margin-bottom:6px">
              <h2>Anggota</h2>
              <button class="more btn btn-ghost btn-sm" @click="addingMember = true"><AppIcon name="userPlus" />Tambah</button>
            </div>
            <div v-if="members.length">
              <div v-for="u in members" :key="u.user_id" class="member-strip">
                <div class="av" style="width:36px;height:36px;border-radius:99px;background:var(--c-high);color:var(--primary-container);display:grid;place-items:center;font-weight:700;font-size:13px;flex:0 0 auto">{{ initials(memberName(u)) }}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;font-size:13.5px">{{ memberName(u) }}</div>
                  <div class="muted" style="font-size:12px">{{ u.email }}</div>
                </div>
                <span v-if="!u.is_active" class="badge badge-slate">Nonaktif</span>
                <button class="icon-btn" style="border:none;background:none;width:30px;height:30px" title="Keluarkan anggota" :disabled="busy" @click="removeMember(u.user_id)"><AppIcon name="userX" :width="16" :height="16" /></button>
              </div>
            </div>
            <div v-else class="empty-ph" style="padding:20px">Belum ada anggota</div>
          </div>
        </div>
      </div>

      <RbacAddMember v-if="addingMember" :g="g" @close="addingMember = false" @add="onAddMember" />
      <RbacAddRole v-if="addingRole" :g="g" @close="addingRole = false" @add="onAddRole" />

      <UiConfirm v-if="confirm && confirm.kind === 'delgroup'" title="Nonaktifkan Grup" danger icon="userX" confirm-label="Nonaktifkan Grup" @close="confirm = null" @confirm="confirmDelGroup">
        <UiNote v-if="members.length" kind="red" icon="alert"><span>Grup masih memiliki <b>{{ members.length }} anggota</b>. API menolak (HTTP 400) bila ada anggota aktif.</span></UiNote>
        <span v-else>Grup akan dinonaktifkan (DELETE = soft deactivate).</span>
      </UiConfirm>
      <UiConfirm v-if="confirm && confirm.kind === 'lastrole'" title="Tidak Dapat Melepas Peran" icon="alert" confirm-label="Mengerti" @close="confirm = null" @confirm="confirm = null">
        <UiNote kind="amber" icon="alert">Ini adalah peran terakhir grup. API menolak penghapusan peran terakhir (HTTP 400 — last role).</UiNote>
      </UiConfirm>
    </UiState>
  </div>
</template>
