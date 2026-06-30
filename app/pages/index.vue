<script setup>
import { useRouter } from 'vue-router'
import { DB } from '~/data/db'

const router = useRouter()
const go = (p) => router.push(p)

const recentAnn = DB.announcements.filter(a => a.status === 'Published').slice(0, 4)
const newMembersByMonth = [18, 22, 19, 27, 24, 31]
const givingByMonth = [88, 94, 91, 118, 126, 142]

const debitByPost = {}
DB.transactions.filter(t => t.transaction_type === 'Debit').forEach(t => {
  debitByPost[t.budget_post_id] = (debitByPost[t.budget_post_id] || 0) + t.amount
})
const comp = Object.entries(debitByPost).map(([pid, amt]) => ({
  name: DB.budget_posts.find(b => b.id === +pid).name, amt,
})).sort((a, b) => b.amt - a.amt)
const compMax = Math.max(...comp.map(c => c.amt))
const barColor = (i) => i === 0 ? '#1a365d' : i === 1 ? '#2d476f' : '#456089'

const bdays = DB.households.flatMap(h => h.members).map(m => {
  const b = new Date(m.birth_date)
  const md = new Date(2026, b.getMonth(), b.getDate())
  return { ...m, md, day: DB.idDate(`2026-${String(b.getMonth() + 1).padStart(2, '0')}-${String(b.getDate()).padStart(2, '0')}`) }
}).filter(m => m.md >= new Date(2026, 5, 15) && m.md <= new Date(2026, 6, 15)).sort((a, b) => a.md - b.md).slice(0, 4)

const oosPreview = DB.oos.order_of_service.slice(0, 5)
const trunc = (s) => s.length > 26 ? s.slice(0, 24) + '…' : s
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Selamat datang, Aditya" desc="Ringkasan pelayanan jemaat per Minggu, 14 Juni 2026 — Ibadah Umum Raya.">
      <template #actions>
        <button class="btn btn-ghost"><AppIcon name="download" />Unduh Laporan</button>
        <button class="btn btn-primary" @click="go('/finance')"><AppIcon name="plus" />Catat Transaksi</button>
      </template>
    </UiPageHead>

    <div class="kpi-grid">
      <UiKpi label="Total Jemaat" icon="users" :value="String(DB.totalMembers)" trend="+8,2%" trend-dir="up" foot="vs bulan lalu" :spark="newMembersByMonth" spark-color="#1a365d" />
      <UiKpi label="Rumah Tangga" icon="home" :value="String(DB.households.length)" trend="+2" trend-dir="up" foot="baru Juni" :spark="[3,4,4,5,6,7]" spark-color="#1a365d" />
      <UiKpi label="Penerimaan Periode" icon="trending" tone="em" :value="DB.fmtIDRk(DB.totalDebit)" trend="+12,7%" trend-dir="up" foot="PER-JUNI-2026" :spark="givingByMonth" spark-color="#006c49" />
      <UiKpi label="Warta Aktif" icon="megaphone" tone="gd" value="4" trend="3 draf" trend-dir="up" foot="menunggu" :spark="[2,3,2,4,3,4]" spark-color="#b07a00" />
    </div>

    <div class="grid-main">
      <!-- LEFT -->
      <div class="stack">
        <div class="card">
          <div class="card-pad" style="display:flex;align-items:center;gap:18px;padding-bottom:18px">
            <div class="k-icon" style="width:52px;height:52px;border-radius:12px;background:#e2ecfb"><AppIcon name="book" :width="26" :height="26" /></div>
            <div style="flex:1">
              <div class="t-label" style="color:var(--primary-container)">Ibadah Berikutnya</div>
              <div style="font-size:19px;font-weight:700;margin-top:6px;letter-spacing:-0.01em">{{ DB.oos.title }}</div>
              <div class="muted" style="font-size:13.5px;margin-top:3px">Minggu, 14 Juni 2026 • 08.00 WIB • {{ DB.oos.order_of_service.length }} mata acara</div>
            </div>
            <button class="btn btn-ghost" @click="go('/rite')">Buka Susunan Acara<AppIcon name="chevR" /></button>
          </div>
          <hr class="divider" >
          <div style="display:flex;gap:0;padding:4px 8px">
            <div v-for="(o, i) in oosPreview" :key="o.id" style="flex:1;padding:14px 12px" :style="{ borderRight: i < 4 ? '1px solid var(--c-high)' : 'none' }">
              <div style="font-size:11px;font-weight:700;color:var(--on-surface-variant)">{{ o.duration_minutes }} mnt</div>
              <div style="font-size:12.5px;font-weight:600;margin-top:5px;line-height:1.3">{{ trunc(o.activity_name) }}</div>
              <div class="muted" style="font-size:11px;margin-top:4px">{{ o.pic_role }}</div>
            </div>
          </div>
        </div>

        <div class="card card-pad">
          <div class="section-title">
            <h2>Komposisi Penerimaan</h2>
            <span class="more"><button class="btn btn-ghost btn-sm" @click="go('/finance')">Ledger Kas</button></span>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px">
            <div v-for="(c, i) in comp" :key="i">
              <div class="row" style="justify-content:space-between;margin-bottom:7px">
                <span style="font-size:13.5px;font-weight:500">{{ c.name }}</span>
                <span class="tnum" style="font-size:13.5px;font-weight:600">{{ DB.fmtIDR(c.amt) }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: (c.amt / compMax * 100) + '%', background: barColor(i) }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="stack">
        <div class="card">
          <div class="card-pad" style="padding-bottom:14px">
            <div class="section-title" style="margin-bottom:0">
              <h2>Warta Terbaru</h2>
              <button class="more btn btn-ghost btn-sm" @click="go('/announcements')">Semua</button>
            </div>
          </div>
          <hr class="divider" >
          <div>
            <div v-for="(a, i) in recentAnn" :key="a.id" style="padding:14px 22px;cursor:pointer" :style="{ borderBottom: i < recentAnn.length - 1 ? '1px solid var(--c-high)' : 'none' }" @click="go('/announcements')">
              <div class="row" style="justify-content:space-between;margin-bottom:5px">
                <UiBadge kind="blue">{{ a.category }}</UiBadge>
                <span class="muted" style="font-size:12px">{{ DB.idDate(a.publish_date) }}</span>
              </div>
              <div style="font-size:14px;font-weight:600;line-height:1.35">{{ a.title }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-pad" style="padding-bottom:12px">
            <div class="section-title" style="margin-bottom:0">
              <h2>Ulang Tahun Pekan Ini</h2>
              <AppIcon name="cake" :width="20" :height="20" style="color:var(--gold)" />
            </div>
          </div>
          <hr class="divider" >
          <div>
            <template v-if="bdays.length">
              <div v-for="(m, i) in bdays" :key="m.id" class="row" style="padding:12px 22px;gap:12px" :style="{ borderBottom: i < bdays.length - 1 ? '1px solid var(--c-high)' : 'none' }">
                <div class="member-cell"><div class="av">{{ DB.initials(m.full_name) }}</div></div>
                <div style="flex:1">
                  <div style="font-size:13.5px;font-weight:600">{{ m.full_name }}</div>
                  <div class="muted" style="font-size:12px">{{ DB.age(m.birth_date) + 1 }} tahun</div>
                </div>
                <span class="badge badge-gold">{{ m.day }}</span>
              </div>
            </template>
            <div v-else style="padding:22px" class="muted">Tidak ada ulang tahun pekan ini.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
