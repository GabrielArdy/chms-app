<script setup lang="ts">
defineProps({ name: String, size: { type: Number, default: 34 } })
</script>

<template>
  <div class="av" :style="{ width: size + 'px', height: size + 'px' }">{{ initials(name) }}</div>
</template>
