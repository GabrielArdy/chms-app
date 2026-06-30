<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'

const txns = ref([...DB.transactions])
const creating = ref(false)
const closing = ref(false)
const typeFilter = ref('Semua')
const toast = ref(null)

const p = DB.period
const debit = computed(() => txns.value.filter(t => t.transaction_type === 'Debit').reduce((a, t) => a + t.amount, 0))
const credit = computed(() => txns.value.filter(t => t.transaction_type === 'Credit').reduce((a, t) => a + t.amount, 0))
const balance = computed(() => p.beginning_balance + debit.value - credit.value)
const rows = computed(() => txns.value.filter(t => typeFilter.value === 'Semua' || t.transaction_type === typeFilter.value))
const countType = (t) => txns.value.filter(x => x.transaction_type === t).length
const postName = (id) => { const b = DB.budget_posts.find(b => b.id === id); return b ? b.name : '—' }

const flash = (kind, msg, ms = 4000) => { toast.value = { kind, msg }; setTimeout(() => { toast.value = null }, ms) }

const addTxn = (t) => {
  txns.value = [{ ...t, transaction_id: Math.max(...txns.value.map(x => x.transaction_id)) + 1, record_status: 'COMMITTED_IMMUTABLE', timestamp: new Date().toISOString() }, ...txns.value]
  creating.value = false
  flash('emerald', 'Entri transaksi berhasil dicatat ke ledger kas (COMMITTED_IMMUTABLE).')
}
const closed = () => {
  closing.value = false
  flash('emerald', 'Periode ' + p.code + ' berhasil ditutup (LOCKED_PERMANENT). Periode baru diinisialisasi.', 5000)
}
const typeFilters = ['Semua', 'Debit', 'Credit']
const filterLabel = (t) => t === 'Debit' ? 'Debit (Masuk)' : t === 'Credit' ? 'Credit (Keluar)' : 'Semua'
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Keuangan — Ledger Kas" desc="Buku kas append-only yang tidak dapat diubah. Akses khusus Bendahara; penutupan periode memerlukan verifikasi 2FA.">
      <template #actions>
        <button class="btn btn-danger" @click="closing = true"><AppIcon name="lock" />Tutup Periode</button>
        <button class="btn btn-primary" @click="creating = true"><AppIcon name="plus" />Catat Transaksi</button>
      </template>
    </UiPageHead>

    <div v-if="toast" class="fade-in" style="margin-bottom:18px"><UiNote :kind="toast.kind" icon="check">{{ toast.msg }}</UiNote></div>

    <div class="card" style="padding:18px 24px;margin-bottom:22px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
      <div class="k-icon" style="width:48px;height:48px;border-radius:12px"><AppIcon name="wallet" :width="24" :height="24" /></div>
      <div>
        <div class="row" style="gap:10px">
          <span style="font-size:17px;font-weight:700">{{ p.code }}</span>
          <UiBadge kind="emerald" dot>Open</UiBadge>
        </div>
        <div class="muted" style="font-size:13px;margin-top:3px">Periode {{ p.type }} • {{ DB.idDate(p.start_date) }} – {{ DB.idDate(p.end_date) }}</div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div class="t-label">Saldo Berjalan</div>
        <div class="tnum" style="font-size:28px;font-weight:700;letter-spacing:-0.02em;margin-top:4px">{{ DB.fmtIDR(balance) }}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <UiKpi label="Saldo Awal" icon="wallet" :value="DB.fmtIDRk(p.beginning_balance)" foot="rollover periode lalu" />
      <UiKpi label="Total Debit (Masuk)" icon="arrowDn" tone="em" :value="DB.fmtIDRk(debit)" :foot="countType('Debit') + ' transaksi'" />
      <UiKpi label="Total Credit (Keluar)" icon="arrowUp" :value="DB.fmtIDRk(credit)" :foot="countType('Credit') + ' transaksi'" />
      <UiKpi label="Saldo Akhir Proyeksi" icon="trending" :value="DB.fmtIDRk(balance)" trend="+20,4%" trend-dir="up" foot="vs saldo awal" />
    </div>

    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <div class="row" style="gap:8px">
          <button v-for="t in typeFilters" :key="t" :class="['chip', typeFilter === t ? 'on' : '']" @click="typeFilter = t">{{ filterLabel(t) }}</button>
        </div>
        <div class="grow" />
        <span class="badge badge-slate"><AppIcon name="lock" :width="12" :height="12" />Append-only</span>
        <button class="btn btn-ghost btn-sm"><AppIcon name="download" />Ekspor CSV</button>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Waktu</th><th>Kode Referensi</th><th>Deskripsi</th><th>Pos Anggaran</th><th>Tipe</th><th style="text-align:right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="t.transaction_id">
            <td class="muted" style="font-size:13px">{{ DB.idDateTime(t.timestamp) }}</td>
            <td><span class="code">{{ t.reference_code }}</span></td>
            <td style="max-width:300px"><div style="font-size:13.5px;line-height:1.4">{{ t.description }}</div></td>
            <td><UiBadge kind="slate">{{ postName(t.budget_post_id) }}</UiBadge></td>
            <td><UiBadge :kind="t.transaction_type === 'Debit' ? 'emerald' : 'red'">{{ t.transaction_type }}</UiBadge></td>
            <td style="text-align:right">
              <span :class="'ledger-amt ' + (t.transaction_type === 'Debit' ? 'debit' : 'credit')">{{ (t.transaction_type === 'Debit' ? '+ ' : '− ') + DB.fmtIDR(t.amount) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tbl-foot">
        <span><b>{{ rows.length }}</b> entri • semua berstatus <span class="code">COMMITTED_IMMUTABLE</span></span>
        <span class="muted" style="margin-left:auto">transaction_id bertipe int64</span>
      </div>
    </div>

    <NewTransaction v-if="creating" :period="p" :existing-refs="txns.map(t => t.reference_code)" @close="creating = false" @save="addTxn" />
    <ClosePeriod v-if="closing" :period="p" :balance="balance" @close="closing = false" @done="closed" />
  </div>
</template>
