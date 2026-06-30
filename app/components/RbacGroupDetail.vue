<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'
import { MOD_ICON } from '~/data/rbac'

const props = defineProps({ g: Object })
const emit = defineEmits(['back', 'update', 'edit'])

const addingMember = ref(false)
const addingRole = ref(false)
const confirm = ref(null)
const savedPing = ref(false)

const roles = computed(() => props.g.role_ids.map(id => DB.roles.find(r => r.id === id)).filter(Boolean))
const members = computed(() => props.g.member_ids.map(id => DB.users.find(u => u.user_id === id)).filter(Boolean))
const totalSub = DB.modules.reduce((a, m) => a + m.submodules.length, 0)

const ping = () => { savedPing.value = true; setTimeout(() => { savedPing.value = false }, 1600) }
const togglePerm = (subId) => {
  emit('update', { granted: props.g.granted.includes(subId) ? props.g.granted.filter(s => s !== subId) : [...props.g.granted, subId] })
  ping()
}
const removeMember = (uid) => emit('update', { member_ids: props.g.member_ids.filter(m => m !== uid) })
const removeRole = (rid) => {
  if (props.g.role_ids.length <= 1) { confirm.value = { kind: 'lastrole' }; return }
  emit('update', { role_ids: props.g.role_ids.filter(r => r !== rid) })
}
const grantedCount = (m) => m.submodules.filter(s => props.g.granted.includes(s.id)).length

const menuItems = computed(() => [
  { label: props.g.is_active ? 'Nonaktifkan Grup' : 'Aktifkan Grup', icon: props.g.is_active ? 'userX' : 'check', onClick: () => emit('update', { is_active: !props.g.is_active }) },
  { sep: true },
  { label: 'Hapus Grup', icon: 'trash', danger: true, onClick: () => { confirm.value = { kind: 'delgroup' } } },
])

const onAddMember = (uid) => { emit('update', { member_ids: [...props.g.member_ids, uid] }); addingMember.value = false }
const onAddRole = (rid) => { emit('update', { role_ids: [...props.g.role_ids, rid] }); addingRole.value = false }
const confirmDelGroup = () => { emit('update', { is_active: false }); emit('back') }
</script>

<template>
  <div class="fade-in">
    <button class="btn btn-ghost btn-sm" style="margin-bottom:16px" @click="emit('back')"><AppIcon name="chevL" />Semua Grup</button>
    <UiPageHead :title="g.name" :desc="g.description">
      <template #actions>
        <span v-if="savedPing" class="badge badge-emerald fade-in"><AppIcon name="check" :width="12" :height="12" />Izin disimpan</span>
        <button class="btn btn-ghost" @click="emit('edit')"><AppIcon name="edit" />Ubah Grup</button>
        <UiMenu :items="menuItems" />
      </template>
    </UiPageHead>

    <div class="row" style="gap:10px;margin-bottom:22px;flex-wrap:wrap">
      <UiBadge :kind="g.is_active ? 'emerald' : 'slate'" dot>{{ g.is_active ? 'Aktif' : 'Nonaktif' }}</UiBadge>
      <span class="code">GROUP #{{ g.id }}</span>
      <span class="muted" style="font-size:13px">Dibuat {{ DB.idDate(g.created_at) }} • diperbarui {{ DB.idDate(g.updated_at) }}</span>
    </div>

    <div class="grid-main">
      <!-- LEFT: permission matrix -->
      <div class="stack">
        <div>
          <div class="section-title">
            <AppIcon name="sliders" :width="18" :height="18" style="color:var(--primary-container)" />
            <h2>Matriks Izin</h2>
            <span class="more muted" style="font-size:13px">{{ g.granted.length }} dari {{ totalSub }} submodul diberikan</span>
          </div>
          <div v-for="m in DB.modules" :key="m.id" class="perm-mod">
            <div class="perm-mod-head">
              <div class="m-ic"><AppIcon :name="MOD_ICON[m.code] || 'layers'" :width="18" :height="18" /></div>
              <div style="flex:1">
                <div class="m-name">{{ m.name }}</div>
                <span class="m-code">{{ m.code }}</span>
              </div>
              <span class="muted" style="font-size:12.5px">{{ grantedCount(m) }}/{{ m.submodules.length }}</span>
            </div>
            <div v-for="s in m.submodules" :key="s.id" class="perm-row">
              <div style="flex:1;min-width:0">
                <div class="row" style="gap:8px">
                  <span class="p-name">{{ s.name }}</span>
                  <span v-if="s.is_view" class="badge badge-slate" title="Submodul baca-saja"><AppIcon name="search" :width="11" :height="11" />View</span>
                </div>
                <div class="p-code">{{ s.code }}</div>
              </div>
              <span :class="'badge ' + (g.granted.includes(s.id) ? 'badge-emerald' : 'badge-slate')" style="margin-right:4px">{{ g.granted.includes(s.id) ? 'is_granted' : 'revoked' }}</span>
              <UiToggle :model-value="g.granted.includes(s.id)" @update:model-value="togglePerm(s.id)" />
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
              <button class="icon-btn" style="border:none;background:none;width:30px;height:30px" title="Lepas peran" @click="removeRole(r.id)"><AppIcon name="x" :width="16" :height="16" /></button>
            </div>
          </div>
          <div v-else class="empty-ph" style="padding:20px">GET /groups/{{ g.id }} → roles: []</div>
        </div>

        <div class="card card-pad">
          <div class="section-title" style="margin-bottom:6px">
            <h2>Anggota</h2>
            <button class="more btn btn-ghost btn-sm" @click="addingMember = true"><AppIcon name="userPlus" />Tambah</button>
          </div>
          <div v-if="members.length">
            <div v-for="u in members" :key="u.user_id" class="member-strip">
              <div class="av" style="width:36px;height:36px;border-radius:99px;background:var(--c-high);color:var(--primary-container);display:grid;place-items:center;font-weight:700;font-size:13px;flex:0 0 auto">{{ DB.initials(u.full_name) }}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13.5px">{{ u.full_name }}</div>
                <div class="muted" style="font-size:12px">{{ u.email }}</div>
              </div>
              <span v-if="!u.is_active" class="badge badge-slate">Nonaktif</span>
              <button class="icon-btn" style="border:none;background:none;width:30px;height:30px" title="Keluarkan anggota" @click="removeMember(u.user_id)"><AppIcon name="userX" :width="16" :height="16" /></button>
            </div>
          </div>
          <div v-else class="empty-ph" style="padding:20px">Belum ada anggota</div>
        </div>
      </div>
    </div>

    <RbacAddMember v-if="addingMember" :g="g" @close="addingMember = false" @add="onAddMember" />
    <RbacAddRole v-if="addingRole" :g="g" @close="addingRole = false" @add="onAddRole" />

    <UiConfirm v-if="confirm && confirm.kind === 'delgroup'" title="Hapus Grup" danger icon="trash" confirm-label="Nonaktifkan Grup" @close="confirm = null" @confirm="confirmDelGroup">
      <UiNote v-if="members.length" kind="red" icon="alert"><span>Grup masih memiliki <b>{{ members.length }} anggota aktif</b>. API menolak penghapusan (HTTP 400). Grup akan dinonaktifkan sebagai gantinya.</span></UiNote>
      <span v-else>Grup akan dinonaktifkan. Tindakan ini dapat dibatalkan dengan mengaktifkan kembali.</span>
    </UiConfirm>
    <UiConfirm v-if="confirm && confirm.kind === 'lastrole'" title="Tidak Dapat Melepas Peran" icon="alert" confirm-label="Mengerti" @close="confirm = null" @confirm="() => {}">
      <UiNote kind="amber" icon="alert">Ini adalah peran terakhir grup. API menolak penghapusan peran terakhir (HTTP 400 — last role).</UiNote>
    </UiConfirm>
  </div>
</template>
