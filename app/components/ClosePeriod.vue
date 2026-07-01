<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = defineProps({ period: Object })
const emit = defineEmits(['close', 'done'])
const api = useApiClient()

const step = ref(0)
const next = reactive({ next_period_code: '', next_start_date: '', next_end_date: '', period_type: 'Monthly' })
const otp = reactive(['', '', '', '', '', ''])
const loading = ref(false)
const err = ref('')
const boxes = ref([])
const result = ref(null)

const nextValid = computed(() => next.next_period_code.trim() && next.next_start_date && next.next_end_date)

const setDigit = (i, v) => {
  if (!/^\d?$/.test(v)) return
  otp[i] = v; err.value = ''
  if (v && i < 5) boxes.value[i + 1]?.focus()
}
const onKey = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) boxes.value[i - 1]?.focus() }

const doClose = async () => {
  if (otp.join('').length !== 6) { err.value = 'Kode harus 6 digit.'; return }
  loading.value = true; err.value = ''
  try {
    result.value = await api.closePeriod({
      target_period_id: props.period.id,
      next_period_code: next.next_period_code,
      next_start_date: next.next_start_date,
      next_end_date: next.next_end_date,
      period_type: next.period_type,
      two_factor_auth_token: otp.join(''),
    })
    step.value = 2
  } catch (e) {
    err.value = e.message || 'Penutupan gagal.'
  } finally {
    loading.value = false
  }
}

const summary = computed(() => {
  const r = result.value || {}
  return [
    ['Periode ditutup', '#' + (r.closed_period_id ?? props.period.id)],
    ['Saldo akhir', fmtIDR(r.calculated_ending_balance)],
    ['Periode baru', next.next_period_code + (r.initialized_next_period_id ? ' (#' + r.initialized_next_period_id + ')' : '')],
    ['Saldo awal rollover', fmtIDR(r.rollover_beginning_balance)],
    ['Status kunci', r.database_lock_status || 'LOCKED_PERMANENT'],
  ]
})
</script>

<template>
  <UiModal :title="step === 2 ? 'Penutupan Berhasil' : 'Tutup Periode Keuangan'" :icon="step === 2 ? 'check' : 'lock'" @close="emit('close')">
    <!-- step 0 -->
    <div v-if="step === 0">
      <UiNote kind="amber" icon="alert">
        <span><b>Tindakan permanen & tidak dapat dibatalkan.</b> Periode akan dikunci selamanya (LOCKED_PERMANENT), saldo akhir dihitung oleh server, dan periode berikutnya dibuka otomatis.</span>
      </UiNote>
      <div class="card card-pad" style="margin:18px 0;background:var(--c-low)">
        <div class="row" style="justify-content:space-between">
          <span class="muted">Periode ditutup</span><span style="font-weight:600">{{ period.code }} (#{{ period.id }})</span>
        </div>
      </div>
      <div class="t-label" style="margin:6px 0 12px">Inisialisasi Periode Berikutnya</div>
      <UiField label="Kode Periode Baru" required hint="unik, 1–50 karakter">
        <input class="input" v-model="next.next_period_code" placeholder="PER-CHMS-JULI-2026" >
      </UiField>
      <div class="field-row-3">
        <UiField label="Mulai" required><input class="input" type="date" v-model="next.next_start_date" ></UiField>
        <UiField label="Selesai" required><input class="input" type="date" v-model="next.next_end_date" ></UiField>
        <UiField label="Tipe">
          <select class="select" v-model="next.period_type"><option v-for="t in ['Monthly', 'Quarterly', 'Annually']" :key="t">{{ t }}</option></select>
        </UiField>
      </div>
    </div>

    <!-- step 1 -->
    <div v-else-if="step === 1" style="text-align:center;padding:8px 0">
      <div class="k-icon" style="width:52px;height:52px;border-radius:14px;margin:0 auto 16px"><AppIcon name="shield" :width="26" :height="26" /></div>
      <h3 style="font-size:19px;font-weight:700">Verifikasi Bendahara</h3>
      <p class="muted" style="font-size:14px;margin:8px auto 22px;max-width:36ch">Masukkan 6 digit kode TOTP untuk mengonfirmasi penutupan buku kas permanen.</p>
      <div v-if="err" style="margin-bottom:16px"><UiNote kind="red" icon="alert">{{ err }}</UiNote></div>
      <div class="otp-row" style="max-width:360px;margin:0 auto">
        <input v-for="(d, i) in otp" :key="i" :ref="el => boxes[i] = el" :class="['otp-box', d ? 'filled' : '']" :value="d" inputmode="numeric" maxlength="1" @input="setDigit(i, $event.target.value)" @keydown="onKey(i, $event)" >
      </div>
    </div>

    <!-- step 2 -->
    <div v-else style="text-align:center;padding:12px 0">
      <div class="k-icon em" style="width:64px;height:64px;border-radius:16px;margin:0 auto 18px"><AppIcon name="check" :width="34" :height="34" /></div>
      <h3 style="font-size:20px;font-weight:700">Buku Kas Berhasil Ditutup</h3>
      <p class="muted" style="margin:8px auto 20px;max-width:40ch">Prosedur penutupan berstatus Hard Closed berhasil dijalankan.</p>
      <div class="card card-pad" style="text-align:left;background:var(--c-low)">
        <div v-for="([k, v], i) in summary" :key="k" class="row" style="justify-content:space-between;padding:9px 0" :style="{ borderBottom: i < summary.length - 1 ? '1px solid var(--c-high)' : 'none' }">
          <span class="muted" style="font-size:13.5px">{{ k }}</span>
          <span style="font-weight:600;font-size:13.5px">
            <span v-if="i === 4" class="badge badge-red"><AppIcon name="lock" :width="11" :height="11" />{{ v }}</span>
            <template v-else>{{ v }}</template>
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <template v-if="step === 0">
        <button class="btn btn-ghost" @click="emit('close')">Batal</button>
        <button class="btn btn-danger" :disabled="!nextValid" @click="step = 1"><AppIcon name="lock" />Lanjut ke Verifikasi 2FA</button>
      </template>
      <template v-else-if="step === 1">
        <button class="btn btn-ghost" @click="step = 0"><AppIcon name="chevL" />Kembali</button>
        <button class="btn btn-danger" :disabled="loading" @click="doClose">{{ loading ? 'Memverifikasi…' : 'Tutup Buku Permanen' }}</button>
      </template>
      <template v-else>
        <button class="btn btn-primary" @click="emit('done', result)">Selesai</button>
      </template>
    </template>
  </UiModal>
</template>
