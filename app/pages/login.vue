<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: false })

const router = useRouter()
const { login } = useAuth()

const step = ref('login') // login | 2fa

// ---- Login ----
const email = ref('bendahara@gereja.org')
const pw = ref('PasswordAm4n!')
const show = ref(false)
const err = ref(false)
const loading = ref(false)

const submitLogin = () => {
  err.value = false; loading.value = true
  setTimeout(() => {
    loading.value = false
    if (pw.value.length < 1 || !email.value.includes('@')) { err.value = true; return }
    step.value = '2fa'
  }, 650)
}

// ---- 2FA ----
const code = reactive(['', '', '', '', '', ''])
const otpErr = ref(false)
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
const submitOtp = () => {
  if (code.join('').length !== 6) { otpErr.value = true; return }
  otpLoading.value = true
  setTimeout(() => { otpLoading.value = false; login(); router.push('/') }, 700)
}
const back = () => { step.value = 'login' }
</script>

<template>
  <div class="auth-stage">
    <AppAuthArt />
    <div class="auth-form-col">
      <!-- LOGIN -->
      <form v-if="step === 'login'" class="auth-card fade-in" @submit.prevent="submitLogin">
        <h1>Masuk ke akun Anda</h1>
        <div class="sub">Gunakan kredensial pelayanan yang terdaftar di sekretariat.</div>
        <div v-if="err" style="margin-bottom:18px">
          <UiNote kind="red" icon="alert">Email atau kata sandi salah. Silakan coba lagi.</UiNote>
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
          <UiNote kind="red" icon="alert">Kode harus terdiri dari 6 digit. ERR_FIN_MFA_INVALID.</UiNote>
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
        <div style="margin-top:18px">
          <UiNote kind="blue" icon="info">Untuk demo, masukkan 6 digit apa saja lalu lanjutkan.</UiNote>
        </div>
      </form>
    </div>
  </div>
</template>
