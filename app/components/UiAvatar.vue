<script setup>
import { DB } from '~/data/db'
defineProps({ name: String, size: { type: Number, default: 34 } })
</script>

<template>
  <div class="av" :style="{ width: size + 'px', height: size + 'px' }">{{ DB.initials(name) }}</div>
</template>
