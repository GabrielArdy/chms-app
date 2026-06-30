<script setup>
import { reactive, ref } from 'vue'
import { DB } from '~/data/db'

const u = DB.user
const f = reactive({ full_name: u.full_name, phone_number: u.phone_number })
// PUT /profile → notification_preferences (free-form JSONB). Keys per frontend-api-guide §3.
const notif = reactive({ allow_push_notification: true, allow_whatsapp_gateway: false })
const saved = ref(false)
const touch = () => { saved.value = false }

const prefs = [
  ['allow_push_notification', 'Push Notification', 'Terima notifikasi langsung di aplikasi ChurchMS', 'bell'],
  ['allow_whatsapp_gateway', 'WhatsApp Gateway', 'Terima warta penting melalui pesan WhatsApp', 'phone'],
]
const identity = () => [['ID Pengguna', '#' + u.id], ['Telepon', f.phone_number], ['Status Akun', 'Aktif']]
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Profil & Preferensi" desc="Perbarui data diri dan preferensi notifikasi akun pelayanan Anda." />
    <div style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start;max-width:1000px">
      <div class="stack">
        <div class="card card-pad">
          <div class="section-title"><h2>Data Diri</h2></div>
          <UiField label="Nama Lengkap" required hint="1–255 karakter">
            <input class="input" v-model="f.full_name" @input="touch" >
          </UiField>
          <div class="field-row">
            <UiField label="Email" hint="Tidak dapat diubah sendiri">
              <input class="input" :value="u.email" disabled style="background:var(--c-low);color:var(--on-surface-variant)" >
            </UiField>
            <UiField label="Nomor Telepon" hint="Opsional — maks 20 karakter">
              <input class="input" v-model="f.phone_number" @input="touch" >
            </UiField>
          </div>
        </div>

        <div class="card card-pad">
          <div class="section-title"><h2>Preferensi Notifikasi</h2></div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <div v-for="(p, i) in prefs" :key="p[0]" class="row" style="gap:14px;padding:16px 0" :style="{ borderBottom: i === 0 ? '1px solid var(--c-high)' : 'none' }">
              <span class="k-icon" style="width:40px;height:40px;border-radius:10px"><AppIcon :name="p[3]" :width="20" :height="20" /></span>
              <div style="flex:1">
                <div style="font-weight:600;font-size:14.5px">{{ p[1] }}</div>
                <div class="muted" style="font-size:13px;margin-top:2px">{{ p[2] }}</div>
              </div>
              <UiToggle v-model="notif[p[0]]" @update:model-value="touch" />
            </div>
          </div>
          <div style="margin-top:16px"><UiNote kind="blue" icon="info">Preferensi disimpan sebagai JSONB bebas — kanal WhatsApp masih pending_integration.</UiNote></div>
          <div class="row" style="margin-top:20px;gap:10px">
            <button class="btn btn-primary" @click="saved = true"><AppIcon name="check" />Simpan Perubahan</button>
            <span v-if="saved" class="badge badge-emerald fade-in"><AppIcon name="check" :width="12" :height="12" />Profil &amp; preferensi berhasil diperbarui</span>
          </div>
        </div>

        <div class="card card-pad">
          <div class="section-title"><h2>Keamanan</h2></div>
          <div class="row" style="gap:14px;padding:4px 0">
            <span class="k-icon em" style="width:40px;height:40px;border-radius:10px"><AppIcon name="shield" :width="20" :height="20" /></span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14.5px">Autentikasi 2 Langkah (2FA)</div>
              <div class="muted" style="font-size:13px;margin-top:2px">Aktif via Authenticator App — wajib untuk peran Bendahara</div>
            </div>
            <span class="badge badge-emerald"><span class="led" />Aktif</span>
          </div>
          <hr class="divider" style="margin:14px 0" >
          <button class="btn btn-ghost"><AppIcon name="key" />Ubah Kata Sandi</button>
        </div>
      </div>

      <!-- Right rail -->
      <div class="card card-pad" style="text-align:center">
        <div class="avatar" style="width:84px;height:84px;font-size:30px;margin:4px auto 16px">{{ DB.initials(f.full_name) }}</div>
        <div style="font-size:19px;font-weight:700">{{ f.full_name }}</div>
        <div class="muted" style="font-size:13.5px;margin-top:3px">{{ u.email }}</div>
        <div class="row" style="justify-content:center;gap:6px;margin-top:14px;flex-wrap:wrap">
          <span v-for="r in u.roles" :key="r" class="badge badge-blue"><AppIcon name="shield" :width="12" :height="12" />{{ r }}</span>
        </div>
        <hr class="divider" style="margin:20px 0" >
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
          <div v-for="[k, v] in identity()" :key="k" class="row" style="justify-content:space-between">
            <span class="muted" style="font-size:13px">{{ k }}</span>
            <span style="font-size:13px;font-weight:600">{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
