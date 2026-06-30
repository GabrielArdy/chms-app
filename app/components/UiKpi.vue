<script setup>
defineProps({
  label: String,
  icon: String,
  tone: { type: String, default: '' },
  value: [String, Number],
  trend: String,
  trendDir: String,
  foot: String,
  spark: Array,
  sparkColor: String,
})
</script>

<template>
  <div class="kpi">
    <div class="k-label">
      <span :class="'k-icon ' + tone"><AppIcon :name="icon" /></span>
      {{ label }}
    </div>
    <div class="k-val tnum">{{ value }}</div>
    <div class="k-foot">
      <span v-if="trend" :class="'k-trend ' + trendDir">
        <AppIcon :name="trendDir === 'up' ? 'arrowUp' : 'arrowDn'" :width="13" :height="13" />{{ trend }}
      </span>
      <span>{{ foot }}</span>
    </div>
    <UiSparkline v-if="spark" :data="spark" :color="sparkColor || '#1a365d'" />
  </div>
</template>
