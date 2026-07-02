<script setup lang="ts">
import { ref, reactive, nextTick, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: false })

const router = useRouter()
const { setSession } = useAuth()
const api = useApiClient()

// ---- API health status (dev helper) ----
// /health is un-enveloped and returns 503 (with body) when degraded — raw $fetch, not the unwrap client.
const { apiBaseUrl } = useRuntimeConfig().public as { apiBaseUrl: string }
const apiStatus = ref<'checking' | 'ok' | 'degraded' | 'down'>('checking')
const checkApi = async () => {
  apiStatus.value = 'checking'
  try {
    const d = await $fetch<{ status?: string }>('/health', { baseURL: apiBaseUrl, ignoreResponseError: true, timeout: 5000 })
    apiStatus.value = d?.status === 'ok' ? 'ok' : 'degraded'
  } catch {
    apiStatus.value = 'down'
  }
}
onMounted(checkApi)

const apiStatusUi = computed(() => ({
  checking: { dot: 'var(--on-surface-variant)', label: 'Memeriksa API…', pulse: true },
  ok: { dot: 'var(--emerald)', label: 'API Siap', pulse: false },
  degraded: { dot: 'var(--gold)', label: 'API Degradasi', pulse: false },
  down: { dot: 'var(--error)', label: 'API Tidak Terhubung', pulse: false },
}[apiStatus.value]))

const step = ref('login') // login | 2fa
let tempToken = ''

// ---- Login ----
const email = ref('')
const pw = ref('')
const show = ref(false)
const err = ref('')
const loading = ref(false)

const submitLogin = async () => {
  err.value = ''; loading.value = true
  try {
    const d = await api.login({ email: email.value, password: pw.value })
    if (d.requires_2fa) { tempToken = d.token_temporary; step.value = '2fa' }
    else { setSession(d.token, d.user); router.push('/') }
  } catch (e) {
    err.value = e.message || 'Email atau kata sandi salah. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

// ---- 2FA ----
const code = reactive(['', '', '', '', '', ''])
const otpErr = ref(false)
const otpMsg = ref('')
const otpLoading = ref(false)
const boxes = ref([])

const setDigit = (i, v) => {
  if (!/^\d?$/.test(v)) return
  code[i] = v; otpErr.value = false
  if (v && i < 5) boxes.value[i + 1]?.focus()
}
const onKey = (i, e) => {
  if (e.key === 'Backspace' && !code[i] && i > 0) boxes.value[i - 1]?.focus()
}
const onPaste = (e) => {
  const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6).split('')
  if (d.length) {
    for (let i = 0; i < 6; i++) code[i] = d[i] || ''
    nextTick(() => boxes.value[Math.min(d.length, 5)]?.focus())
    e.preventDefault()
  }
}
const submitOtp = async () => {
  otpMsg.value = ''
  if (code.join('').length !== 6) { otpErr.value = true; otpMsg.value = 'Kode harus terdiri dari 6 digit.'; return }
  otpLoading.value = true
  try {
    const d = await api.verify2fa(code.join(''), tempToken)
    setSession(d.token, d.user); router.push('/')
  } catch (e) {
    otpErr.value = true; otpMsg.value = e.message || 'Verifikasi gagal. Coba lagi.'
  } finally {
    otpLoading.value = false
  }
}
const back = () => { step.value = 'login'; otpErr.value = false; otpMsg.value = '' }
</script>

<template>
  <div class="auth-stage">
    <button
      type="button"
      :title="'GET ' + (apiBaseUrl || '(apiBaseUrl kosong)') + '/health — klik untuk cek ulang'"
      style="position:fixed;top:14px;right:14px;z-index:60;display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;border:1px solid var(--outline-variant);background:var(--surface);color:var(--on-surface-variant);font-size:12px;font-weight:600;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.08)"
      @click="checkApi"
    >
      <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: apiStatusUi.dot, animation: apiStatusUi.pulse ? 'fade .9s ease-in-out infinite alternate' : 'none' }" />
      {{ apiStatusUi.label }}
    </button>
    <AppAuthArt />
    <div class="auth-form-col">
      <!-- LOGIN -->
      <form v-if="step === 'login'" class="auth-card fade-in" @submit.prevent="submitLogin">
        <h1>Masuk ke akun Anda</h1>
        <div class="sub">Gunakan kredensial pelayanan yang terdaftar di sekretariat.</div>
        <div v-if="err" style="margin-bottom:18px">
          <UiNote kind="red" icon="alert">{{ err }}</UiNote>
        </div>
        <UiField label="Email">
          <div class="input-group">
            <span class="pre"><AppIcon name="mail" :width="17" :height="17" /></span>
            <input v-model="email" type="email" placeholder="nama@gereja.org" >
          </div>
        </UiField>
        <UiField label="Kata Sandi">
          <div class="input-group">
            <span class="pre"><AppIcon name="lock" :width="17" :height="17" /></span>
            <input v-model="pw" :type="show ? 'text' : 'password'" placeholder="••••••••" >
            <button type="button" class="pre" style="cursor:pointer;border-right:none;border-left:1px solid var(--outline-variant)" @click="show = !show">{{ show ? 'Sembunyi' : 'Lihat' }}</button>
          </div>
        </UiField>
        <div class="row" style="justify-content:space-between;margin-bottom:22px;margin-top:-4px">
          <label class="row" style="gap:8px;font-size:13px;cursor:pointer">
            <input type="checkbox" checked >Ingat perangkat ini
          </label>
          <a href="#" style="font-size:13px;color:var(--primary-container);font-weight:600;text-decoration:none">Lupa kata sandi?</a>
        </div>
        <button class="btn btn-primary btn-lg btn-block" type="submit" :disabled="loading">
          {{ loading ? 'Memeriksa…' : 'Masuk' }}<AppIcon v-if="!loading" name="chevR" />
        </button>
        <div style="margin-top:18px">
          <UiNote kind="amber" icon="shield"><b>Akun Bendahara &amp; Administrator</b> memerlukan verifikasi 2 langkah (2FA) setelah masuk.</UiNote>
        </div>
        <div style="text-align:center;margin-top:26px;font-size:13px;color:var(--on-surface-variant)">
          Belum punya akun pelayanan? <a href="#" style="color:var(--primary-container);font-weight:600;text-decoration:none">Hubungi Sekretariat</a>
        </div>
      </form>

      <!-- 2FA -->
      <form v-else class="auth-card fade-in" @submit.prevent="submitOtp">
        <button type="button" class="btn btn-ghost btn-sm" style="margin-bottom:22px" @click="back">
          <AppIcon name="chevL" />Kembali
        </button>
        <div class="k-icon" style="width:48px;height:48px;border-radius:12px;margin-bottom:18px"><AppIcon name="shield" :width="24" :height="24" /></div>
        <h1>Verifikasi 2 Langkah</h1>
        <div class="sub">Masukkan 6 digit kode dari aplikasi <b>Authenticator</b> Anda untuk melanjutkan sebagai Bendahara.</div>
        <div v-if="otpErr" style="margin-bottom:16px">
          <UiNote kind="red" icon="alert">{{ otpMsg }}</UiNote>
        </div>
        <div class="otp-row" @paste="onPaste">
          <input
            v-for="(d, i) in code" :key="i" :ref="el => boxes[i] = el"
            :class="['otp-box', d ? 'filled' : '']"
            :value="d" inputmode="numeric" maxlength="1"
            @input="setDigit(i, $event.target.value)" @keydown="onKey(i, $event)"
          >
        </div>
        <div class="row" style="justify-content:space-between;margin:14px 2px 24px;font-size:13px;color:var(--on-surface-variant)">
          <span>Tidak menerima kode?</span>
          <a href="#" style="color:var(--primary-container);font-weight:600;text-decoration:none">Kirim ulang (0:42)</a>
        </div>
        <button class="btn btn-primary btn-lg btn-block" type="submit" :disabled="otpLoading">
          {{ otpLoading ? 'Memverifikasi…' : 'Verifikasi & Masuk' }}<AppIcon v-if="!otpLoading" name="check" />
        </button>
      </form>
    </div>
  </div>
</template>
