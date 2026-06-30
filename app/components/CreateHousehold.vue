<script setup>
import { ref, reactive, computed } from 'vue'
import { DB } from '~/data/db'

const emit = defineEmits(['close', 'create'])

const step = ref(0)
const hh = reactive({ household_name: '', address: '' })
const member = reactive({
  full_name: '', household_role: 'Kepala Keluarga', gender: 'Laki-laki', birth_date: '',
  phone_number: '', baptism_status: 'Dewasa', marriage_status: 'Belum Kawin', membership_status: 'Jemaat Tetap',
})

const steps = [
  { title: 'Data Rumah Tangga', desc: 'Nama & alamat keluarga' },
  { title: 'Jemaat Pertama', desc: 'Kepala keluarga / anggota utama' },
  { title: 'Tinjau & Simpan', desc: 'Konfirmasi pendaftaran' },
]
const canNext = computed(() =>
  step.value === 0 ? hh.household_name.trim().length > 0
  : step.value === 1 ? (member.full_name.trim() && member.birth_date)
  : true)

const onScrim = (e) => { if (e.target === e.currentTarget) emit('close') }
const save = () => emit('create', { ...hh, members: [{ ...member, id: Date.now() }] })
</script>

<template>
  <div class="modal-scrim" @mousedown="onScrim">
    <div class="modal lg fade-in" style="max-width:820px">
      <div class="modal-head">
        <div class="k-icon" style="width:38px;height:38px;border-radius:8px"><AppIcon name="home" /></div>
        <h3 style="flex:1">Daftarkan Rumah Tangga Baru</h3>
        <button class="icon-btn" style="border:none;background:none" @click="emit('close')"><AppIcon name="x" /></button>
      </div>
      <div style="display:grid;grid-template-columns:232px 1fr;min-height:420px">
        <div style="border-right:1px solid var(--outline-variant);background:var(--c-low);padding:16px">
          <div class="stepper">
            <div v-for="(s, i) in steps" :key="i" :class="['step', i === step ? 'active' : '', i < step ? 'done' : '']" @click="i < step && (step = i)">
              <div class="s-dot"><AppIcon v-if="i < step" name="check" :width="14" :height="14" /><template v-else>{{ i + 1 }}</template></div>
              <div>
                <div class="s-title">{{ s.title }}</div>
                <div class="s-desc">{{ s.desc }}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="padding:24px 26px;overflow-y:auto;max-height:64vh">
          <div v-if="step === 0" class="fade-in">
            <UiField label="Nama Rumah Tangga" required hint="1–155 karakter">
              <input class="input" v-model="hh.household_name" placeholder="mis. Keluarga Sitorus" autofocus >
            </UiField>
            <UiField label="Alamat" hint="Opsional">
              <textarea class="input" rows="3" v-model="hh.address" placeholder="Jl. Merdeka No. 45, Jakarta Pusat" />
            </UiField>
          </div>
          <div v-else-if="step === 1" class="fade-in">
            <UiNote kind="blue" icon="info">Anggota pertama ini menjadi jemaat utama rumah tangga dan dibuat bersamaan secara atomik.</UiNote>
            <div style="height:18px" />
            <MemberForm :model="member" primary />
          </div>
          <div v-else class="fade-in">
            <UiNote kind="emerald" icon="check">Siap mendaftarkan. Tinjau ringkasan di bawah sebelum menyimpan.</UiNote>
            <div class="card card-pad" style="margin-top:16px">
              <div class="t-label" style="margin-bottom:10px">Rumah Tangga</div>
              <div style="font-size:18px;font-weight:700">{{ hh.household_name || '—' }}</div>
              <div class="muted" style="font-size:13px;margin-top:3px">{{ hh.address || 'Tanpa alamat' }}</div>
              <hr class="divider" style="margin:16px 0" >
              <div class="t-label" style="margin-bottom:10px">Jemaat Pertama</div>
              <div class="row" style="gap:12px">
                <div class="av" style="width:42px;height:42px">{{ DB.initials(member.full_name || '?') }}</div>
                <div>
                  <div style="font-weight:600">{{ member.full_name || '—' }}</div>
                  <div class="muted" style="font-size:13px">{{ member.household_role }} • {{ member.gender }} • Baptis {{ member.baptism_status }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <span class="muted" style="margin-right:auto;font-size:13px;align-self:center">Langkah {{ step + 1 }} dari 3</span>
        <button v-if="step > 0" class="btn btn-ghost" @click="step--"><AppIcon name="chevL" />Kembali</button>
        <button v-if="step < 2" class="btn btn-primary" :disabled="!canNext" @click="step++">Lanjut<AppIcon name="chevR" /></button>
        <button v-else class="btn btn-emerald" @click="save"><AppIcon name="check" />Simpan Rumah Tangga</button>
      </div>
    </div>
  </div>
</template>
