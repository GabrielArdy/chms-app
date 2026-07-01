<script setup lang="ts">
defineProps({ kind: { type: String, default: 'blue' }, icon: { type: String, default: 'info' } })
</script>

<template>
  <div :class="'note note-' + kind">
    <AppIcon :name="icon" />
    <div><slot /></div>
  </div>
</template>
