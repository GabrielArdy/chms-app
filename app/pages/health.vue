<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Health endpoint is NOT enveloped and returns 503 (with body) when degraded,
// so bypass the unwrapping client and read the raw body regardless of status.
const { apiBaseUrl } = useRuntimeConfig().public

const data = ref(null)
const loading = ref(true)
const error = ref('')
const checkedAt = ref(null)

const load = async () => {
  loading.value = true; error.value = ''
  try {
    data.value = await $fetch('/health', { baseURL: apiBaseUrl, ignoreResponseError: true })
    checkedAt.value = new Date()
  } catch (e) {
    error.value = 'Gagal menghubungi layanan.'
    data.value = null
  } finally {
    loading.value = false
  }
}
onMounted(load)

const deps = computed(() => data.value?.dependencies || {})
const depEntries = computed(() => Object.entries(deps.value))
const allOk = computed(() => data.value?.status === 'ok')
const raw = computed(() => (data.value ? JSON.stringify(data.value, null, 2) : ''))

const meta = {
  postgres: { label: 'PostgreSQL', sub: 'Basis data transaksional utama', icon: 'server' },
  mongodb: { label: 'MongoDB', sub: 'Penyimpanan dokumen warta & liturgi', icon: 'layers' },
  redis: { label: 'Redis', sub: 'Cache sesi & antrean notifikasi', icon: 'activity' },
}
const metaOf = (k) => meta[k] || { label: k, sub: 'Dependensi layanan', icon: 'server' }
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Status Sistem" desc="Pemantauan kesehatan layanan dan dependensi — endpoint GET /health (tanpa autentikasi).">
      <template #actions>
        <button class="btn btn-ghost" :disabled="loading" @click="load"><AppIcon name="refresh" />Periksa Ulang</button>
      </template>
    </UiPageHead>

    <UiState :loading="loading" :error="error" @retry="load">
      <div class="card card-pad" style="margin-bottom:24px;display:flex;align-items:center;gap:18px"
           :style="{ borderColor: allOk ? '#a8e6c8' : 'var(--error-container)', background: allOk ? 'linear-gradient(90deg,#f0fbf5,#ffffff)' : '#fff6f5' }">
        <div :class="['k-icon', allOk ? 'em' : '']" style="width:56px;height:56px;border-radius:14px"><AppIcon name="shield" :width="28" :height="28" /></div>
        <div style="flex:1">
          <div style="font-size:22px;font-weight:700;letter-spacing:-0.01em">{{ allOk ? 'Semua Sistem Beroperasi Normal' : 'Layanan Terdegradasi' }}</div>
          <div class="muted" style="margin-top:4px">status: "{{ data?.status || '—' }}"{{ checkedAt ? ' • terakhir diperiksa ' + checkedAt.toLocaleTimeString('id-ID') : '' }}</div>
        </div>
        <span :class="['badge', allOk ? 'badge-emerald' : 'badge-red']" style="font-size:14px;padding:6px 14px"><span class="led" />{{ allOk ? 'OK' : 'DEGRADED' }}</span>
      </div>

      <div class="grid-3">
        <div v-for="[k, v] in depEntries" :key="k" class="card card-pad">
          <div class="row" style="justify-content:space-between">
            <div class="k-icon" style="width:42px;height:42px;border-radius:10px"><AppIcon :name="metaOf(k).icon" :width="22" :height="22" /></div>
            <span :class="'dep-status ' + (v === 'ok' ? 'ok' : 'bad')" style="width:12px;height:12px" />
          </div>
          <div style="font-size:17px;font-weight:700;margin-top:16px">{{ metaOf(k).label }}</div>
          <div class="muted" style="font-size:13px;margin-top:4px">{{ metaOf(k).sub }}</div>
          <div class="row" style="justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid var(--c-high)">
            <span :class="['badge', v === 'ok' ? 'badge-emerald' : 'badge-red']">{{ v }}</span>
          </div>
        </div>
      </div>

      <div class="card card-pad" style="margin-top:24px">
        <div class="t-label" style="margin-bottom:12px">Respons Mentah — GET /health</div>
        <pre style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--inverse-surface);color:#d6e3ff;padding:18px;border-radius:8px;overflow:auto;line-height:1.6">{{ raw }}</pre>
      </div>
    </UiState>
  </div>
</template>
