<script setup lang="ts">
defineProps({ crumbs: { type: Array, default: () => [] } })
const navOpen = useNav()
</script>

<template>
  <header class="topbar">
    <button class="icon-btn nav-toggle" title="Menu" @click="navOpen = !navOpen">
      <AppIcon name="menu" :width="20" :height="20" />
    </button>
    <div class="crumb">
      <template v-for="(c, i) in crumbs" :key="i">
        <span v-if="i > 0" style="margin:0 8px;color:var(--outline)">/</span>
        <b v-if="i === crumbs.length - 1">{{ c }}</b>
        <template v-else>{{ c }}</template>
      </template>
    </div>
    <div class="topbar-spacer" />
    <div class="search">
      <AppIcon name="search" :width="17" :height="17" />
      <input placeholder="Cari jemaat, warta, transaksi…" >
    </div>
    <button class="icon-btn" title="Notifikasi">
      <AppIcon name="bell" :width="18" :height="18" /><span class="dot" />
    </button>
    <button class="icon-btn" title="Bantuan">
      <AppIcon name="info" :width="18" :height="18" />
    </button>
  </header>
</template>
