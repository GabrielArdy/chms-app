<script setup lang="ts">
defineProps({ label: String, hint: String, required: Boolean })
</script>

<template>
  <div class="field">
    <label v-if="label">{{ label }}<span v-if="required" style="color:var(--error)"> *</span></label>
    <slot />
    <div v-if="hint" class="hint">{{ hint }}</div>
  </div>
</template>
