<script setup lang="ts">
import { reactive, computed } from 'vue'

const props = defineProps({ period: Object, existingRefs: { type: Array, default: () => [] }, saving: Boolean })
const emit = defineEmits(['close', 'save'])

const f = reactive({ period_id: props.period?.id || null, budget_post_id: null, transaction_type: 'Debit', amount: '', description: '', reference_code: '' })
const dupRef = computed(() => f.reference_code && props.existingRefs.includes(f.reference_code))
const valid = computed(() => f.period_id > 0 && f.budget_post_id > 0 && f.amount > 0 && f.description.trim() && f.reference_code.trim() && !dupRef.value)

const types = [
  { v: 'Debit', l: 'Penerimaan (Masuk)', ic: 'arrowDn', tone: 'em' },
  { v: 'Credit', l: 'Pengeluaran (Keluar)', ic: 'arrowUp', tone: '' },
]
const tStyle = (v) => ({
  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left',
  background: f.transaction_type === v ? (v === 'Debit' ? 'var(--emerald-bg)' : '#fdeceb') : 'var(--c-lowest)',
  border: '1.5px solid ' + (f.transaction_type === v ? (v === 'Debit' ? 'var(--secondary)' : 'var(--error)') : 'var(--outline-variant)'),
})
const save = () => emit('save', { ...f, amount: +f.amount })
</script>

<template>
  <UiModal title="Catat Transaksi Keuangan" icon="wallet" size="lg" @close="emit('close')">
    <UiNote kind="amber" icon="lock">Periode <b>{{ period.code }}</b> akan terkunci pesimistik selama penulisan. Entri pertama mengubah status Draft → Open.</UiNote>
    <div style="height:18px" />
    <UiField label="Tipe Transaksi" required>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <button v-for="t in types" :key="t.v" type="button" :style="tStyle(t.v)" @click="f.transaction_type = t.v">
          <span :class="'k-icon ' + t.tone" style="width:36px;height:36px"><AppIcon :name="t.ic" :width="18" :height="18" /></span>
          <span>
            <span style="display:block;font-weight:600;font-size:14px">{{ t.v }}</span>
            <span class="muted" style="font-size:12px">{{ t.l }}</span>
          </span>
        </button>
      </div>
    </UiField>
    <div class="field-row-3">
      <UiField label="Period ID" required hint="tidak ada endpoint daftar">
        <input class="input" type="number" min="1" v-model.number="f.period_id" placeholder="4" >
      </UiField>
      <UiField label="Pos Anggaran ID" required hint="budget_post_id">
        <input class="input" type="number" min="1" v-model.number="f.budget_post_id" placeholder="2" >
      </UiField>
      <UiField label="Jumlah" required hint="> 0">
        <div class="input-group">
          <span class="pre">Rp</span>
          <input type="number" v-model="f.amount" placeholder="7.500.000" >
        </div>
      </UiField>
    </div>
    <UiField label="Deskripsi" required :hint="f.transaction_type === 'Debit' ? 'Sebutkan kanal dana (QRIS / Transfer / Tunai)' : 'Sebutkan alokasi pengeluaran'">
      <textarea class="input" rows="2" v-model="f.description" :placeholder="f.transaction_type === 'Debit' ? 'Penerimaan persembahan persepuluhan via QRIS Bank Mandiri' : 'Alokasi pembayaran…'" />
    </UiField>
    <UiField label="Kode Referensi" required :hint="dupRef ? null : 'Unik, 1–100 karakter'">
      <input class="input" v-model="f.reference_code" placeholder="TX-MNDR-20260615-09412" :style="dupRef ? { borderColor: 'var(--error)' } : {}" >
      <div v-if="dupRef" class="hint" style="color:var(--error)">Kode referensi sudah digunakan (HTTP 409 — duplicate reference_code).</div>
    </UiField>
    <template #footer>
      <span class="row muted" style="margin-right:auto;gap:7px;font-size:13px"><AppIcon name="shield" :width="15" :height="15" />Entri bersifat permanen &amp; tidak dapat diubah</span>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button class="btn btn-emerald" :disabled="!valid || props.saving" @click="save"><AppIcon name="check" />{{ props.saving ? 'Mencatat…' : 'Catat ke Ledger' }}</button>
    </template>
  </UiModal>
</template>
