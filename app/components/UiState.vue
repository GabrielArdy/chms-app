<script setup lang="ts">
defineProps({
  loading: Boolean,
  error: { type: String, default: '' },
  empty: Boolean,
  emptyText: { type: String, default: 'Belum ada data.' },
  emptyIcon: { type: String, default: 'inbox' },
})
defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="ui-state">
    <div class="spinner" />
    <span>Memuat…</span>
  </div>
  <div v-else-if="error" class="ui-state">
    <div class="k-icon" style="background:var(--error-container,#fde8e8);color:var(--error)">
      <AppIcon name="alert" :width="20" :height="20" />
    </div>
    <span>{{ error }}</span>
    <button class="btn btn-ghost btn-sm" @click="$emit('retry')"><AppIcon name="refresh" />Coba lagi</button>
  </div>
  <div v-else-if="empty" class="ui-state">
    <div class="k-icon"><AppIcon :name="emptyIcon" :width="20" :height="20" /></div>
    <span>{{ emptyText }}</span>
  </div>
  <slot v-else />
</template>

<style scoped>
.ui-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 56px 24px; text-align: center;
  color: var(--on-surface-variant); font-size: 14px;
}
.ui-state .k-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: #e2ecfb; color: var(--primary-container); }
.spinner {
  width: 28px; height: 28px; border-radius: 99px;
  border: 3px solid var(--outline-variant); border-top-color: var(--primary-container);
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
