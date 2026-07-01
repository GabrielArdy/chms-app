<script setup lang="ts">
const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button type="button" :class="['toggle', modelValue ? 'on' : '']" @click="emit('update:modelValue', !modelValue)">
    <span class="knob" />
  </button>
</template>
