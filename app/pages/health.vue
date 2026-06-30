<script setup>
import { DB } from '~/data/db'

const deps = DB.dependencies
const allOk = Object.values(deps).every(v => v === 'ok')
const meta = {
  postgres: { label: 'PostgreSQL', sub: 'Basis data transaksional utama', icon: 'server' },
  mongodb: { label: 'MongoDB', sub: 'Penyimpanan dokumen warta & liturgi', icon: 'layers' },
  redis: { label: 'Redis', sub: 'Cache sesi & antrean notifikasi', icon: 'activity' },
}
const depEntries = Object.entries(deps)
const p99 = (k) => k === 'redis' ? '3ms' : k === 'postgres' ? '18ms' : '11ms'
const raw = JSON.stringify({ status: allOk ? 'ok' : 'degraded', dependencies: deps }, null, 2)
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Status Sistem" desc="Pemantauan kesehatan layanan dan dependensi — endpoint GET /health (tanpa autentikasi).">
      <template #actions>
        <button class="btn btn-ghost"><AppIcon name="refresh" />Periksa Ulang</button>
      </template>
    </UiPageHead>

    <div class="card card-pad" style="margin-bottom:24px;display:flex;align-items:center;gap:18px" :style="{ borderColor: allOk ? '#a8e6c8' : 'var(--error-container)', background: allOk ? 'linear-gradient(90deg,#f0fbf5,#ffffff)' : '#fff6f5' }">
      <div class="k-icon em" style="width:56px;height:56px;border-radius:14px"><AppIcon name="shield" :width="28" :height="28" /></div>
      <div style="flex:1">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.01em">{{ allOk ? 'Semua Sistem Beroperasi Normal' : 'Layanan Terdegradasi' }}</div>
        <div class="muted" style="margin-top:4px">HTTP 200 • status: "{{ allOk ? 'ok' : 'degraded' }}" • terakhir diperiksa 12 detik lalu</div>
      </div>
      <span class="badge badge-emerald" style="font-size:14px;padding:6px 14px"><span class="led" />OK</span>
    </div>

    <div class="grid-3">
      <div v-for="[k, v] in depEntries" :key="k" class="card card-pad">
        <div class="row" style="justify-content:space-between">
          <div class="k-icon" style="width:42px;height:42px;border-radius:10px"><AppIcon :name="meta[k].icon" :width="22" :height="22" /></div>
          <span :class="'dep-status ' + (v === 'ok' ? 'ok' : 'bad')" style="width:12px;height:12px" />
        </div>
        <div style="font-size:17px;font-weight:700;margin-top:16px">{{ meta[k].label }}</div>
        <div class="muted" style="font-size:13px;margin-top:4px">{{ meta[k].sub }}</div>
        <div class="row" style="justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid var(--c-high)">
          <span class="badge badge-emerald">{{ v }}</span>
          <span class="muted tnum" style="font-size:12.5px">p99 {{ p99(k) }}</span>
        </div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:24px">
      <div class="t-label" style="margin-bottom:12px">Respons Mentah — GET /health</div>
      <pre style="font-family:'JetBrains Mono',monospace;font-size:13px;background:var(--inverse-surface);color:#d6e3ff;padding:18px;border-radius:8px;overflow:auto;line-height:1.6">{{ raw }}</pre>
    </div>
  </div>
</template>
