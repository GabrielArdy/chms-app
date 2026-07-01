<script setup lang="ts">
defineProps({ kind: { type: String, default: 'slate' }, dot: Boolean })
</script>

<template>
  <span :class="'badge badge-' + kind">
    <span v-if="dot" class="led" />
    <slot />
  </span>
</template>
