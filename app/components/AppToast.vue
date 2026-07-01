<script setup lang="ts">
const { toasts } = useToast()
const TONE = {
  success: { bg: '#0f5132', bd: '#1a7a4d', ic: 'check' },
  error: { bg: '#7f1d1d', bd: '#a83232', ic: 'alert' },
  info: { bg: '#1e3a5f', bd: '#2d5a8f', ic: 'info' },
}
</script>

<template>
  <div class="toast-stack">
    <div v-for="t in toasts" :key="t.id" class="toast fade-in"
         :style="{ background: (TONE[t.kind] || TONE.info).bg, borderColor: (TONE[t.kind] || TONE.info).bd }">
      <AppIcon :name="(TONE[t.kind] || TONE.info).ic" :width="17" :height="17" />
      <span>{{ t.msg }}</span>
    </div>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed; right: 20px; bottom: 20px; z-index: 999;
  display: flex; flex-direction: column; gap: 10px; max-width: 380px;
}
.toast {
  display: flex; align-items: center; gap: 10px;
  color: #fff; font-size: 13.5px; font-weight: 500;
  padding: 12px 16px; border-radius: 12px; border: 1px solid;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
@media (max-width: 640px) {
  .toast-stack { right: 12px; left: 12px; bottom: 12px; max-width: none; }
}
</style>
