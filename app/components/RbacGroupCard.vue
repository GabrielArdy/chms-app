<script setup lang="ts">
defineProps({ g: Object })
defineEmits(['open'])
</script>

<template>
  <div :class="['group-card', g.is_active ? '' : 'inactive']" @click="$emit('open')">
    <div class="g-top">
      <div class="g-ic"><AppIcon name="group" :width="22" :height="22" /></div>
      <div style="flex:1;min-width:0">
        <div class="row" style="gap:8px">
          <span class="g-name">{{ g.name }}</span>
          <UiBadge v-if="!g.is_active" kind="slate">Nonaktif</UiBadge>
        </div>
        <div class="g-desc">{{ g.description || 'Tanpa deskripsi' }}</div>
      </div>
      <AppIcon name="chevR" :width="18" :height="18" style="color:var(--outline);flex:0 0 auto" />
    </div>
    <div class="g-stats">
      <div class="g-stat"><div class="n tnum">{{ g.role_count ?? 0 }}</div><div class="l">Peran</div></div>
      <div class="g-stat"><div class="n tnum">{{ g.member_count ?? 0 }}</div><div class="l">Anggota</div></div>
      <div class="g-stat"><div class="n tnum">#{{ g.id }}</div><div class="l">Group ID</div></div>
    </div>
  </div>
</template>
