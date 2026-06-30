<script setup>
import { DB } from '~/data/db'
</script>

<template>
  <div class="auth-art">
    <div class="auth-grid-overlay" />
    <div class="glow g1" />
    <div class="glow g2" />
    <div class="a-brand">
      <div class="brand-mark" style="width:44px;height:44px">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#adc7f7" stroke-width="2" stroke-linecap="round">
          <path d="M12 2v8M8 6h8" />
          <path d="M5 21V11l7-4 7 4v10" stroke="#fff" />
          <path d="M10 21v-5h4v5" stroke="#6cf8bb" />
        </svg>
      </div>
      <div>
        <div style="font-weight:700;font-size:17px;color:#fff">ChurchMS</div>
        <div style="font-size:12px;color:var(--on-primary-container);letter-spacing:.04em">Sanctuary OS</div>
      </div>
    </div>
    <div class="a-quote">
      <div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--inverse-primary);margin-bottom:18px;font-weight:600">Sistem Manajemen Gereja</div>
      <div class="t-display">Melayani dengan tertib, mengelola dengan hikmat.</div>
      <p style="color:#c3d2ea;margin-top:18px;font-size:15px;line-height:1.6;max-width:34ch">Satu pusat data untuk jemaat, ibadah, warta, dan keuangan gereja — terlindungi dan dapat dipertanggungjawabkan.</p>
    </div>
    <div class="a-meta">
      <div><b>{{ DB.totalMembers }}</b>Jemaat aktif</div>
      <div><b>{{ DB.households.length }}</b>Rumah tangga</div>
      <div><b>2FA</b>Keamanan Bendahara</div>
    </div>
  </div>
</template>
