<script setup>
import { ref, reactive, computed } from 'vue'
import { DB } from '~/data/db'
import { MEMBERSHIP_BADGE } from '~/data/constants'

const households = ref([...DB.households])
const selected = ref(null)
const creating = ref(false)
const addMemberFor = ref(null)
const density = ref('spacious')
const filter = ref('Semua')

const filters = ['Semua', 'Jemaat Tetap', 'Simpatisan', 'Pindah']
const rows = computed(() => households.value.filter(h => filter.value === 'Semua' || h.members.some(m => m.membership_status === filter.value)))

const countMembership = (s) => households.value.flatMap(h => h.members).filter(m => m.membership_status === s).length
const headOf = (h) => h.members.find(m => m.household_role === 'Kepala Keluarga') || h.members[0]
const statusOf = (h) => h.members.some(m => m.membership_status === 'Jemaat Tetap') ? 'Jemaat Tetap' : headOf(h).membership_status

const addHousehold = (hh) => {
  const id = households.value.length + 1
  const members = hh.members.map(m => ({ ...m, household_id: id }))
  households.value = [{ ...hh, id, members }, ...households.value]
  creating.value = false
}

const MEMBER_DEFAULT = { full_name: '', household_role: 'Anak', gender: 'Laki-laki', birth_date: '', phone_number: '', baptism_status: 'Belum', marriage_status: 'Belum Kawin', membership_status: 'Simpatisan' }
const newMember = reactive({ ...MEMBER_DEFAULT })
const openAddMember = (h) => { Object.assign(newMember, MEMBER_DEFAULT); addMemberFor.value = h }
const newMemberValid = computed(() => newMember.full_name.trim() && newMember.birth_date)

const addMember = () => {
  const hid = addMemberFor.value.id
  const m = { ...newMember, id: Date.now(), household_id: hid }
  households.value = households.value.map(h => h.id === hid ? { ...h, members: [...h.members, m] } : h)
  if (selected.value && selected.value.id === hid) selected.value = { ...selected.value, members: [...selected.value.members, m] }
  addMemberFor.value = null
}
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Jemaat & Rumah Tangga" desc="Basis data keanggotaan gereja. Setiap rumah tangga memuat satu atau lebih anggota jemaat.">
      <template #actions>
        <button class="btn btn-ghost"><AppIcon name="download" />Ekspor</button>
        <button class="btn btn-primary" @click="creating = true"><AppIcon name="plus" />Daftarkan Rumah Tangga</button>
      </template>
    </UiPageHead>

    <div class="kpi-grid">
      <UiKpi label="Total Jemaat" icon="users" :value="String(DB.totalMembers)" foot="di seluruh rumah tangga" />
      <UiKpi label="Jemaat Tetap" icon="check" tone="em" :value="String(countMembership('Jemaat Tetap'))" foot="status aktif" />
      <UiKpi label="Simpatisan" icon="star" tone="gd" :value="String(countMembership('Simpatisan'))" foot="dalam pembinaan" />
      <UiKpi label="Rumah Tangga" icon="home" :value="String(households.length)" foot="terdaftar" />
    </div>

    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <div class="row" style="gap:8px">
          <button v-for="ff in filters" :key="ff" :class="['chip', filter === ff ? 'on' : '']" @click="filter = ff">{{ ff }}</button>
        </div>
        <div class="grow" />
        <div class="seg">
          <button :class="density === 'compact' ? 'on' : ''" @click="density = 'compact'">Padat</button>
          <button :class="density === 'spacious' ? 'on' : ''" @click="density = 'spacious'">Lega</button>
        </div>
      </div>
      <table :class="['tbl', density === 'compact' ? 'compact' : '']">
        <thead>
          <tr>
            <th>Rumah Tangga</th><th>Kepala Keluarga</th><th>Anggota</th><th>Alamat</th><th>Status</th><th style="width:50px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in rows" :key="h.id" class="clickable" @click="selected = h">
            <td>
              <div class="cell-strong">{{ h.household_name }}</div>
              <div class="cell-sub">HH-{{ String(h.id).padStart(4, '0') }}</div>
            </td>
            <td>
              <div class="member-cell">
                <UiAvatar :name="headOf(h).full_name" />
                <div>
                  <div style="font-weight:500">{{ headOf(h).full_name }}</div>
                  <div class="cell-sub">{{ headOf(h).gender }} • {{ DB.age(headOf(h).birth_date) }} th</div>
                </div>
              </div>
            </td>
            <td><span class="badge badge-slate">{{ h.members.length }} orang</span></td>
            <td class="muted" style="max-width:240px">
              <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ h.address }}</div>
            </td>
            <td><UiBadge :kind="MEMBERSHIP_BADGE[statusOf(h)]" dot>{{ statusOf(h) }}</UiBadge></td>
            <td><AppIcon name="chevR" :width="18" :height="18" style="color:var(--outline)" /></td>
          </tr>
        </tbody>
      </table>
      <div class="tbl-foot">
        <span>Menampilkan <b>{{ rows.length }}</b> dari {{ households.length }} rumah tangga</span>
        <div class="pager">
          <button><AppIcon name="chevL" :width="15" :height="15" /></button>
          <button class="on">1</button><button>2</button>
          <button><AppIcon name="chevR" :width="15" :height="15" /></button>
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <UiModal v-if="selected" :title="selected.household_name" icon="home" size="lg" @close="selected = null">
      <div class="row" style="gap:10px;margin-bottom:18px">
        <span class="code">HH-{{ String(selected.id).padStart(4, '0') }}</span>
        <span class="row muted" style="gap:6px;font-size:13.5px"><AppIcon name="mapPin" :width="15" :height="15" />{{ selected.address }}</span>
      </div>
      <div class="t-label" style="margin-bottom:12px">{{ selected.members.length }} Anggota Keluarga</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div v-for="m in selected.members" :key="m.id" class="card" style="padding:14px;display:flex;gap:14px;align-items:center">
          <div class="av" style="width:44px;height:44px;font-size:15px">{{ DB.initials(m.full_name) }}</div>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:8px">
              <span style="font-weight:600;font-size:15px">{{ m.full_name }}</span>
              <span v-if="m.user_id" class="badge badge-blue" title="Memiliki akun aplikasi"><AppIcon name="key" :width="11" :height="11" />Akun</span>
            </div>
            <div class="muted" style="font-size:12.5px;margin-top:3px">
              {{ m.household_role }} • {{ m.gender }} • {{ DB.age(m.birth_date) }} tahun{{ m.phone_number ? ' • ' + m.phone_number : '' }}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
            <UiBadge :kind="MEMBERSHIP_BADGE[m.membership_status]" dot>{{ m.membership_status }}</UiBadge>
            <div class="row" style="gap:6px">
              <span class="badge badge-slate">Baptis: {{ m.baptism_status }}</span>
              <span class="badge badge-slate">{{ m.marriage_status }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-ghost" @click="selected = null">Tutup</button>
        <button class="btn btn-ghost"><AppIcon name="edit" />Sunting</button>
        <button class="btn btn-primary" @click="openAddMember(selected)"><AppIcon name="plus" />Tambah Anggota</button>
      </template>
    </UiModal>

    <!-- Create household -->
    <CreateHousehold v-if="creating" @close="creating = false" @create="addHousehold" />

    <!-- Add member -->
    <UiModal v-if="addMemberFor" :title="'Tambah Anggota — ' + addMemberFor.household_name" icon="user" size="lg" @close="addMemberFor = null">
      <MemberForm :model="newMember" />
      <template #footer>
        <button class="btn btn-ghost" @click="addMemberFor = null">Batal</button>
        <button class="btn btn-primary" :disabled="!newMemberValid" @click="addMember"><AppIcon name="plus" />Tambahkan Anggota</button>
      </template>
    </UiModal>
  </div>
</template>
