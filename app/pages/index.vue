<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sortFeed } from '~/data/announce'

const router = useRouter()
const go = (p) => router.push(p)

const api = useApiClient()
const { user } = useAuth()

const households = ref([])
const announcements = ref([])
const loading = ref(true)
const error = ref('')

const load = async () => {
  loading.value = true; error.value = ''
  try {
    const [hh, ann] = await Promise.all([
      api.listHouseholds().catch(() => []),
      api.listPublicAnnouncements({ page: 1, limit: 100 }).catch(() => ({ announcements: [] })),
    ])
    households.value = hh || []
    announcements.value = (ann?.announcements || []).sort(sortFeed)
  } catch (e) {
    error.value = e.message || 'Gagal memuat ringkasan.'
  } finally {
    loading.value = false
  }
}
onMounted(load)

const firstName = computed(() => (user.value?.full_name || user.value?.email || 'Pengguna').split(' ')[0])
const allMembers = computed(() => households.value.flatMap(h => h.members || []))
const totalMembers = computed(() => allMembers.value.length)
const simpatisan = computed(() => allMembers.value.filter(m => m.membership_status === 'Simpatisan').length)
const recentAnn = computed(() => announcements.value.slice(0, 5))

// Birthdays within the reference week (today = 2026-06-15 per fmt util).
const bdays = computed(() => allMembers.value.map(m => {
  if (!m.birth_date) return null
  const b = new Date(m.birth_date)
  const md = new Date(2026, b.getMonth(), b.getDate())
  return { ...m, md, day: idDate(`2026-${String(b.getMonth() + 1).padStart(2, '0')}-${String(b.getDate()).padStart(2, '0')}`) }
}).filter(m => m && m.md >= new Date(2026, 5, 8) && m.md <= new Date(2026, 6, 15)).sort((a, b) => a.md - b.md).slice(0, 5))
</script>

<template>
  <div class="fade-in">
    <UiPageHead :title="'Selamat datang, ' + firstName" desc="Ringkasan pelayanan jemaat dari data langsung API.">
      <template #actions>
        <button class="btn btn-ghost" :disabled="loading" @click="load"><AppIcon name="refresh" />Muat Ulang</button>
        <button class="btn btn-primary" @click="go('/households')"><AppIcon name="plus" />Daftarkan Jemaat</button>
      </template>
    </UiPageHead>

    <UiState :loading="loading" :error="error" @retry="load">
      <div class="kpi-grid">
        <UiKpi label="Total Jemaat" icon="users" :value="String(totalMembers)" foot="di seluruh rumah tangga" />
        <UiKpi label="Rumah Tangga" icon="home" :value="String(households.length)" foot="terdaftar" />
        <UiKpi label="Simpatisan" icon="star" tone="gd" :value="String(simpatisan)" foot="dalam pembinaan" />
        <UiKpi label="Warta Aktif" icon="megaphone" tone="em" :value="String(announcements.length)" foot="tayang publik" />
      </div>

      <div class="grid-main">
        <!-- LEFT: recent announcements -->
        <div class="stack">
          <div class="card">
            <div class="card-pad" style="padding-bottom:14px">
              <div class="section-title" style="margin-bottom:0">
                <h2>Warta Terbaru</h2>
                <button class="more btn btn-ghost btn-sm" @click="go('/announcements')">Semua</button>
              </div>
            </div>
            <hr class="divider" >
            <div v-if="recentAnn.length">
              <div v-for="(a, i) in recentAnn" :key="a.id" style="padding:16px 22px;cursor:pointer" :style="{ borderBottom: i < recentAnn.length - 1 ? '1px solid var(--c-high)' : 'none' }" @click="go('/announcements')">
                <div class="row" style="justify-content:space-between;margin-bottom:6px">
                  <div class="row" style="gap:8px">
                    <span v-if="a.is_pinned" class="pin-tag"><AppIcon name="pin" :width="12" :height="12" />Tersemat</span>
                    <UiBadge kind="blue">{{ a.category }}</UiBadge>
                  </div>
                  <span class="muted" style="font-size:12px">{{ idDate(a.publish_date) }}</span>
                </div>
                <div style="font-size:14.5px;font-weight:600;line-height:1.35">{{ a.title }}</div>
                <div v-if="a.author_name" class="muted" style="font-size:12px;margin-top:4px">oleh {{ a.author_name }}</div>
              </div>
            </div>
            <div v-else class="empty-ph" style="padding:28px">Belum ada warta tayang.</div>
          </div>
        </div>

        <!-- RIGHT: birthdays -->
        <div class="stack">
          <div class="card">
            <div class="card-pad" style="padding-bottom:12px">
              <div class="section-title" style="margin-bottom:0">
                <h2>Ulang Tahun Terdekat</h2>
                <AppIcon name="cake" :width="20" :height="20" style="color:var(--gold)" />
              </div>
            </div>
            <hr class="divider" >
            <div v-if="bdays.length">
              <div v-for="(m, i) in bdays" :key="m.id" class="row" style="padding:12px 22px;gap:12px" :style="{ borderBottom: i < bdays.length - 1 ? '1px solid var(--c-high)' : 'none' }">
                <div class="member-cell"><div class="av">{{ initials(m.full_name) }}</div></div>
                <div style="flex:1">
                  <div style="font-size:13.5px;font-weight:600">{{ m.full_name }}</div>
                  <div class="muted" style="font-size:12px">{{ (age(m.birth_date) || 0) + 1 }} tahun</div>
                </div>
                <span class="badge badge-gold">{{ m.day }}</span>
              </div>
            </div>
            <div v-else class="empty-ph" style="padding:22px">Tidak ada ulang tahun terdekat.</div>
          </div>

          <div class="card card-pad">
            <div class="section-title"><h2>Akses Cepat</h2></div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-ghost btn-block" style="justify-content:flex-start" @click="go('/rite')"><AppIcon name="book" />Susunan Ibadah & Liturgi</button>
              <button class="btn btn-ghost btn-block" style="justify-content:flex-start" @click="go('/finance')"><AppIcon name="wallet" />Ledger Kas</button>
              <button class="btn btn-ghost btn-block" style="justify-content:flex-start" @click="go('/access')"><AppIcon name="shield" />Kontrol Akses</button>
              <button class="btn btn-ghost btn-block" style="justify-content:flex-start" @click="go('/health')"><AppIcon name="activity" />Status Sistem</button>
            </div>
          </div>
        </div>
      </div>
    </UiState>
  </div>
</template>
