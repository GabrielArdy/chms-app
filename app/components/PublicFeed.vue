<script setup>
import { DB } from '~/data/db'
import { CAT_LABEL, CAT_TONE } from '~/data/announce'

defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['open'])

const pinnedStyle = { borderColor: '#e9c879', boxShadow: '0 0 0 1px #f0d490 inset, var(--e1)' }
</script>

<template>
  <div class="fade-in">
    <div style="max-width:760px;margin:0 auto">
      <div class="card" style="padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px;background:linear-gradient(90deg,#eef4fd,#fff)">
        <AppIcon name="external" :width="18" :height="18" style="color:var(--primary-container)" />
        <span style="font-size:13.5px;font-weight:500">Pratinjau seperti yang dilihat jemaat — GET /announcements (tersemat tampil dahulu)</span>
        <span class="badge badge-emerald" style="margin-left:auto">{{ items.length }} tayang</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <article v-for="a in items" :key="a.id" class="card card-pad" :style="a.is_pinned ? pinnedStyle : {}">
          <div class="row" style="justify-content:space-between;margin-bottom:12px">
            <div class="row" style="gap:8px">
              <span v-if="a.is_pinned" class="pin-tag"><AppIcon name="pin" :width="13" :height="13" />Tersemat</span>
              <UiBadge :kind="CAT_TONE[a.category]">{{ CAT_LABEL[a.category] }}</UiBadge>
            </div>
            <span class="muted" style="font-size:13px"><AppIcon name="calendar" :width="14" :height="14" style="vertical-align:-2px;margin-right:5px" />{{ DB.idDate(a.publish_date) }}</span>
          </div>
          <h2 style="font-size:21px;font-weight:700;letter-spacing:-0.01em;line-height:1.25;cursor:pointer" @click="emit('open', a)">{{ a.title }}</h2>
          <div v-if="a.author_name" class="muted" style="font-size:13px;margin-top:6px">oleh {{ a.author_name }}</div>
          <div style="color:var(--on-surface-variant);font-size:15px;line-height:1.6;margin-top:10px" v-html="a.content" />
          <div v-if="a.attachment_ids && a.attachment_ids.length" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--c-high)">
            <div class="t-label" style="margin-bottom:10px">{{ a.attachment_ids.length }} Lampiran</div>
            <AttachmentList :ids="a.attachment_ids" />
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
