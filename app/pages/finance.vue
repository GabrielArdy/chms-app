<script setup lang="ts">
import { ref, computed } from 'vue'

const api = useApiClient()
const toast = useToast()

// The finance API is append-only: it exposes POST transactions + POST close,
// but NO read endpoint for the ledger/periods/budget posts. So this view holds
// only the transactions recorded in the current session, and the period is
// identified by an ID entered by the Bendahara.
const periodId = ref(4)
const txns = ref([])
const creating = ref(false)
const closing = ref(false)
const saving = ref(false)
const typeFilter = ref('Semua')

const period = computed(() => ({ id: periodId.value, code: 'PER #' + periodId.value }))

const debit = computed(() => txns.value.filter(t => t.transaction_type === 'Debit').reduce((a, t) => a + t.amount, 0))
const credit = computed(() => txns.value.filter(t => t.transaction_type === 'Credit').reduce((a, t) => a + t.amount, 0))
const net = computed(() => debit.value - credit.value)
const rows = computed(() => txns.value.filter(t => typeFilter.value === 'Semua' || t.transaction_type === typeFilter.value))
const countType = (t) => txns.value.filter(x => x.transaction_type === t).length

const addTxn = async (t) => {
  saving.value = true
  try {
    const res = await api.createTransaction(t)
    txns.value = [{
      ...t,
      transaction_id: res.transaction_id,
      reference_code: res.reference_code || t.reference_code,
      record_status: res.record_status || 'COMMITTED_IMMUTABLE',
      timestamp: res.timestamp || new Date().toISOString(),
    }, ...txns.value]
    creating.value = false
    toast.success('Entri transaksi berhasil dicatat ke ledger (COMMITTED_IMMUTABLE).')
  } catch (e) {
    toast.error(e.message || 'Gagal mencatat transaksi.')
  } finally {
    saving.value = false
  }
}
const onClosed = (result) => {
  closing.value = false
  txns.value = []
  if (result?.initialized_next_period_id) periodId.value = result.initialized_next_period_id
  toast.success('Periode ditutup (LOCKED_PERMANENT). Periode baru diinisialisasi.')
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

    <UiNote kind="amber" icon="info">
      <span>API keuangan bersifat <b>append-only</b> — tidak ada endpoint baca untuk ledger/periode. Daftar di bawah menampilkan transaksi yang dicatat pada <b>sesi ini</b> saja.</span>
    </UiNote>
    <div style="height:18px" />

    <div class="card" style="padding:18px 24px;margin-bottom:22px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
      <div class="k-icon" style="width:48px;height:48px;border-radius:12px"><AppIcon name="wallet" :width="24" :height="24" /></div>
      <div class="row" style="gap:12px;align-items:flex-end">
        <UiField label="Period ID aktif" style="margin-bottom:0">
          <input class="input" type="number" min="1" v-model.number="periodId" style="width:120px" >
        </UiField>
        <UiBadge kind="emerald" dot>Aktif (sesi)</UiBadge>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div class="t-label">Net Sesi (Debit − Credit)</div>
        <div class="tnum" style="font-size:28px;font-weight:700;letter-spacing:-0.02em;margin-top:4px">{{ fmtIDR(net) }}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <UiKpi label="Total Debit (Masuk)" icon="arrowDn" tone="em" :value="fmtIDRk(debit)" :foot="countType('Debit') + ' transaksi'" />
      <UiKpi label="Total Credit (Keluar)" icon="arrowUp" :value="fmtIDRk(credit)" :foot="countType('Credit') + ' transaksi'" />
      <UiKpi label="Net Arus Kas" icon="trending" :value="fmtIDRk(net)" foot="sesi berjalan" />
      <UiKpi label="Entri Tercatat" icon="wallet" tone="gd" :value="String(txns.length)" foot="sesi ini" />
    </div>

    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <div class="row" style="gap:8px">
          <button v-for="t in typeFilters" :key="t" :class="['chip', typeFilter === t ? 'on' : '']" @click="typeFilter = t">{{ filterLabel(t) }}</button>
        </div>
        <div class="grow" />
        <span class="badge badge-slate"><AppIcon name="lock" :width="12" :height="12" />Append-only</span>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Waktu</th><th>Kode Referensi</th><th>Deskripsi</th><th>Pos Anggaran</th><th>Tipe</th><th style="text-align:right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td colspan="6"><div class="empty-ph" style="padding:28px">Belum ada transaksi tercatat pada sesi ini.</div></td>
          </tr>
          <tr v-for="t in rows" :key="t.transaction_id">
            <td class="muted" style="font-size:13px">{{ idDateTime(t.timestamp) }}</td>
            <td><span class="code">{{ t.reference_code }}</span></td>
            <td style="max-width:300px"><div style="font-size:13.5px;line-height:1.4">{{ t.description }}</div></td>
            <td><UiBadge kind="slate">#{{ t.budget_post_id }}</UiBadge></td>
            <td><UiBadge :kind="t.transaction_type === 'Debit' ? 'emerald' : 'red'">{{ t.transaction_type }}</UiBadge></td>
            <td style="text-align:right">
              <span :class="'ledger-amt ' + (t.transaction_type === 'Debit' ? 'debit' : 'credit')">{{ (t.transaction_type === 'Debit' ? '+ ' : '− ') + fmtIDR(t.amount) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tbl-foot">
        <span><b>{{ rows.length }}</b> entri • semua berstatus <span class="code">COMMITTED_IMMUTABLE</span></span>
        <span class="muted" style="margin-left:auto">transaction_id bertipe int64</span>
      </div>
    </div>

    <NewTransaction v-if="creating" :period="period" :saving="saving" :existing-refs="txns.map(t => t.reference_code)" @close="creating = false" @save="addTxn" />
    <ClosePeriod v-if="closing" :period="period" @close="closing = false" @done="onClosed" />
  </div>
</template>
