<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

defineProps({ items: { type: Array, default: () => [] }, align: String })

const open = ref(false)
const wrap = ref(null)

const onDocDown = (e) => { if (wrap.value && !wrap.value.contains(e.target)) open.value = false }
watch(open, (v) => {
  if (v) window.addEventListener('mousedown', onDocDown)
  else window.removeEventListener('mousedown', onDocDown)
})
onUnmounted(() => window.removeEventListener('mousedown', onDocDown))

const toggle = (e) => { e.stopPropagation(); open.value = !open.value }
const run = (it) => { open.value = false; it.onClick && it.onClick() }
</script>

<template>
  <div ref="wrap" class="menu-wrap">
    <button class="icon-btn" :style="{ border: 'none', background: open ? 'var(--c-low)' : 'none', width: '32px', height: '32px' }" @click="toggle">
      <AppIcon name="more" :width="18" :height="18" />
    </button>
    <div v-if="open" :class="['menu', align === 'left' ? 'left' : '']" @click.stop>
      <template v-for="(it, i) in items" :key="i">
        <hr v-if="it.sep" class="menu-sep" />
        <button v-else :class="['menu-item', it.danger ? 'danger' : '']" @click="run(it)">
          <AppIcon v-if="it.icon" :name="it.icon" :width="16" :height="16" />{{ it.label }}
        </button>
      </template>
    </div>
  </div>
</template>
