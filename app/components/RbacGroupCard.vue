<script setup>
import { computed } from 'vue'
import { DB } from '~/data/db'

const props = defineProps({ g: Object })
defineEmits(['open'])
const roles = computed(() => props.g.role_ids.map(id => DB.roles.find(r => r.id === id)).filter(Boolean))
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
        <div class="g-desc">{{ g.description }}</div>
      </div>
      <AppIcon name="chevR" :width="18" :height="18" style="color:var(--outline);flex:0 0 auto" />
    </div>
    <div class="row" style="gap:7px;flex-wrap:wrap;min-height:26px">
      <template v-if="roles.length">
        <span v-for="r in roles" :key="r.id" class="role-pill"><AppIcon name="shield" :width="12" :height="12" />{{ r.name }}</span>
      </template>
      <span v-else class="muted" style="font-size:12.5px">Belum ada peran</span>
    </div>
    <div class="g-stats">
      <div class="g-stat"><div class="n tnum">{{ g.role_ids.length }}</div><div class="l">Peran</div></div>
      <div class="g-stat"><div class="n tnum">{{ g.member_ids.length }}</div><div class="l">Anggota</div></div>
      <div class="g-stat"><div class="n tnum">{{ g.granted.length }}</div><div class="l">Izin</div></div>
    </div>
  </div>
</template>
