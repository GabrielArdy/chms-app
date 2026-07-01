<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  color: { type: String, default: '#1a365d' },
  w: { type: Number, default: 70 },
  h: { type: Number, default: 26 },
})

const id = 'g' + Math.random().toString(36).slice(2, 7)

const geom = computed(() => {
  const { data, w, h } = props
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return [x, y]
  })
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  return { d, area: d + ` L${w} ${h} L0 ${h} Z` }
})
</script>

<template>
  <svg class="spark" :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`">
    <defs>
      <linearGradient :id="id" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.18" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="geom.area" :fill="`url(#${id})`" />
    <path :d="geom.d" fill="none" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
