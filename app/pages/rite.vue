<script setup>
import { ref, computed } from 'vue'
import { DB } from '~/data/db'

const PIC_ICON = { Multimedia: 'monitor', Soundman: 'mic', 'Worship Leader': 'music', Liturgist: 'book' }
const RITE_LABEL = { Sacrament: 'Sakramen', 'Regular Service': 'Ibadah Reguler', 'Special Event': 'Acara Khusus' }
const RITE_TONE = { Sacrament: 'blue', 'Regular Service': 'slate', 'Special Event': 'gold' }

const tab = ref('oos')
const items = ref([...DB.oos.order_of_service])
const adding = ref(false)
const editing = ref(null)
const nowIdx = 4

const totalMin = computed(() => items.value.reduce((a, o) => a + o.duration_minutes, 0))
const picCount = (role) => items.value.filter(o => o.pic_role === role).length

const addItem = (it) => { items.value = [...items.value, { ...it, id: Date.now() }].sort((a, b) => a.sequence_order - b.sequence_order); adding.value = false }
const updateItem = (it) => { items.value = items.value.map(x => x.id === it.id ? it : x).sort((a, b) => a.sequence_order - b.sequence_order); editing.value = null }

// liturgy templates
const openTpl = ref(null)
</script>

<template>
  <div class="fade-in">
    <UiPageHead title="Ibadah & Liturgi" desc="Susunan acara minute-by-minute untuk ruang kontrol (multimedia & soundman) serta panduan liturgi baku.">
      <template #actions>
        <div class="seg">
          <button :class="tab === 'oos' ? 'on' : ''" @click="tab = 'oos'">Susunan Acara</button>
          <button :class="tab === 'templates' ? 'on' : ''" @click="tab = 'templates'">Template Liturgi</button>
        </div>
        <button v-if="tab === 'oos'" class="btn btn-primary" @click="adding = true"><AppIcon name="plus" />Tambah Mata Acara</button>
      </template>
    </UiPageHead>

    <!-- OOS -->
    <div v-if="tab === 'oos'" class="grid-main">
      <div>
        <div class="card" style="padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;gap:18px;background:linear-gradient(120deg,#0a2548,#1a365d);color:#fff;border:none">
          <div class="brand-mark" style="width:50px;height:50px;background:rgba(173,199,247,.15)"><AppIcon name="book" :width="26" :height="26" style="color:#fff" /></div>
          <div style="flex:1">
            <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--inverse-primary);font-weight:600">Service #{{ DB.oos.service_id }}</div>
            <div style="font-size:21px;font-weight:700;margin-top:4px">{{ DB.oos.title }}</div>
            <div style="font-size:13.5px;color:#c3d2ea;margin-top:3px">Minggu, 14 Juni 2026 • 08.00 WIB</div>
          </div>
          <div style="text-align:right">
            <div class="row" style="gap:8px;justify-content:flex-end"><span class="live-dot" /><span style="font-size:13px;font-weight:600">SEDANG BERLANGSUNG</span></div>
            <div style="font-size:13px;color:#c3d2ea;margin-top:6px">{{ totalMin }} menit • {{ items.length }} mata acara</div>
          </div>
        </div>

        <div class="tbl-wrap">
          <div style="display:grid;grid-template-columns:56px 70px 1fr 150px 90px;gap:16px;padding:11px 18px;background:var(--c-low);border-bottom:1px solid var(--outline-variant)">
            <div v-for="(h, i) in ['No', 'Durasi', 'Aktivitas', 'PIC', '']" :key="i" class="t-label">{{ h }}</div>
          </div>
          <div v-for="(o, i) in items" :key="o.id" :class="['oos-row', i === nowIdx ? 'oos-now' : '']" @click="editing = o">
            <div class="oos-seq">{{ o.sequence_order }}</div>
            <div class="oos-dur">{{ o.duration_minutes }}<span class="muted" style="font-size:11px;font-weight:400"> mnt</span></div>
            <div style="min-width:0">
              <div class="row" style="gap:8px">
                <span style="font-weight:600;font-size:14.5px">{{ o.activity_name }}</span>
                <span v-if="i === nowIdx" class="badge badge-emerald"><span class="led" />Live</span>
                <span v-if="o.song_id" class="badge badge-slate" :title="'Lagu #' + o.song_id"><AppIcon name="music" :width="11" :height="11" />#{{ o.song_id }}</span>
              </div>
              <div v-if="o.description" class="muted" style="font-size:12.5px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ o.description }}</div>
            </div>
            <div class="row" style="gap:8px">
              <span class="k-icon" style="width:28px;height:28px"><AppIcon :name="PIC_ICON[o.pic_role] || 'user'" :width="15" :height="15" /></span>
              <span style="font-size:13px;font-weight:500">{{ o.pic_role }}</span>
            </div>
            <button class="icon-btn" style="border:none;background:none;width:32px;height:32px" @click.stop="editing = o"><AppIcon name="edit" :width="16" :height="16" /></button>
          </div>
        </div>
      </div>

      <!-- Right rail -->
      <div class="stack">
        <div class="card card-pad" style="text-align:center">
          <div class="t-label" style="margin-bottom:10px">Berlangsung Sekarang</div>
          <div style="font-size:17px;font-weight:700">{{ items[nowIdx].activity_name }}</div>
          <div class="tnum" style="font-size:44px;font-weight:700;letter-spacing:-0.03em;margin:10px 0;color:var(--primary-container)">18:42</div>
          <div class="bar-track" style="margin-bottom:8px"><div class="bar-fill" style="width:62%;background:var(--secondary)" /></div>
          <div class="muted" style="font-size:12.5px">Estimasi sisa 11 menit • PIC {{ items[nowIdx].pic_role }}</div>
        </div>
        <div class="card">
          <div class="card-pad" style="padding-bottom:12px"><div class="section-title" style="margin-bottom:0"><h2>Penanggung Jawab</h2></div></div>
          <hr class="divider" >
          <div v-for="(role, i) in ['Multimedia', 'Soundman', 'Worship Leader', 'Liturgist']" :key="role" class="row" style="padding:13px 22px;gap:12px" :style="{ borderBottom: i < 3 ? '1px solid var(--c-high)' : 'none' }">
            <span class="k-icon" style="width:34px;height:34px"><AppIcon :name="PIC_ICON[role]" :width="17" :height="17" /></span>
            <span style="flex:1;font-size:14px;font-weight:500">{{ role }}</span>
            <span class="badge badge-slate">{{ picCount(role) }} tugas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates -->
    <div v-else class="fade-in">
      <div class="grid-3">
        <div v-for="t in DB.liturgy_templates" :key="t.id" class="card card-pad" style="cursor:pointer" @click="openTpl = t">
          <div class="row" style="justify-content:space-between;margin-bottom:14px">
            <div class="k-icon" style="width:44px;height:44px;border-radius:10px"><AppIcon name="book" :width="22" :height="22" /></div>
            <UiBadge :kind="RITE_TONE[t.rite_type]">{{ RITE_LABEL[t.rite_type] }}</UiBadge>
          </div>
          <div style="font-size:17px;font-weight:700;letter-spacing:-0.01em">{{ t.name }}</div>
          <div class="muted" style="font-size:13.5px;margin-top:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">{{ t.standard_guide }}</div>
          <div class="row" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--c-high);justify-content:space-between">
            <span class="code">LIT-{{ String(t.id).padStart(3, '0') }}</span>
            <span class="row" style="gap:5px;font-size:13px;font-weight:600;color:var(--primary-container)">Lihat panduan<AppIcon name="chevR" :width="15" :height="15" /></span>
          </div>
        </div>
      </div>
      <UiModal v-if="openTpl" :title="openTpl.name" icon="book" @close="openTpl = null">
        <div class="row" style="gap:10px;margin-bottom:16px">
          <UiBadge :kind="RITE_TONE[openTpl.rite_type]">{{ RITE_LABEL[openTpl.rite_type] }}</UiBadge>
          <span class="code">LIT-{{ String(openTpl.id).padStart(3, '0') }}</span>
        </div>
        <div class="t-label" style="margin-bottom:8px">Panduan Baku</div>
        <p class="t-body" style="color:var(--on-surface-variant)">{{ openTpl.standard_guide }}</p>
        <template #footer>
          <button class="btn btn-ghost" @click="openTpl = null">Tutup</button>
          <button class="btn btn-primary"><AppIcon name="plus" />Terapkan ke Susunan Acara</button>
        </template>
      </UiModal>
    </div>

    <OOSItemModal v-if="adding" :next-seq="items.length + 1" @close="adding = false" @save="addItem" />
    <OOSItemModal v-if="editing" :item="editing" @close="editing = null" @save="updateItem" />
  </div>
</template>
