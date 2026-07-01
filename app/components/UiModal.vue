<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: String,
  icon: String,
  size: String,
})
const emit = defineEmits(['close'])

const onKey = (e) => { if (e.key === 'Escape') emit('close') }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

const onScrim = (e) => { if (e.target === e.currentTarget) emit('close') }
</script>

<template>
  <div class="modal-scrim" @mousedown="onScrim">
    <div :class="['modal', size === 'lg' ? 'lg' : '', 'fade-in']">
      <div class="modal-head">
        <div v-if="icon" class="k-icon" style="width:38px;height:38px;border-radius:8px">
          <AppIcon :name="icon" />
        </div>
        <h3 style="flex:1">{{ title }}</h3>
        <button class="icon-btn" style="border:none;background:none" @click="emit('close')">
          <AppIcon name="x" />
        </button>
      </div>
      <div class="modal-body"><slot /></div>
      <div v-if="$slots.footer" class="modal-foot"><slot name="footer" /></div>
    </div>
  </div>
</template>
