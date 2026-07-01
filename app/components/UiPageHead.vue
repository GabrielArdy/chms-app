<script setup lang="ts">
defineProps({ title: String, desc: String })
</script>

<template>
  <div class="page-head">
    <div class="titles">
      <h1>{{ title }}</h1>
      <p v-if="desc">{{ desc }}</p>
    </div>
    <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
  </div>
</template>
