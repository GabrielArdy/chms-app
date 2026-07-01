<script setup lang="ts">
defineProps({
  title: String,
  body: String,
  confirmLabel: { type: String, default: 'Konfirmasi' },
  danger: Boolean,
  icon: { type: String, default: 'alert' },
})
const emit = defineEmits(['close', 'confirm'])
const doConfirm = () => { emit('confirm'); emit('close') }
</script>

<template>
  <UiModal :title="title" :icon="icon" @close="emit('close')">
    <slot>
      <p style="font-size:14.5px;line-height:1.55;color:var(--on-surface-variant)">{{ body }}</p>
    </slot>
    <template #footer>
      <button class="btn btn-ghost" @click="emit('close')">Batal</button>
      <button :class="['btn', danger ? 'btn-danger' : 'btn-primary']" @click="doConfirm">{{ confirmLabel }}</button>
    </template>
  </UiModal>
</template>
