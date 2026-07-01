<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navOpen = useNav()

const CRUMBS = {
  '/': ['Dasbor'],
  '/households': ['Pelayanan', 'Jemaat'],
  '/announcements': ['Pelayanan', 'Warta'],
  '/rite': ['Pelayanan', 'Ibadah & Liturgi'],
  '/finance': ['Administrasi', 'Keuangan'],
  '/access': ['Administrasi', 'Kontrol Akses'],
  '/health': ['Administrasi', 'Status Sistem'],
  '/profile': ['Akun', 'Profil & Preferensi'],
}

const crumbs = computed(() => CRUMBS[route.path] || ['Dasbor'])

// Close drawer whenever route changes (mobile nav tap).
watch(() => route.path, () => { navOpen.value = false })
</script>

<template>
  <div class="app" :class="{ 'nav-open': navOpen }">
    <div class="nav-scrim" @click="navOpen = false" />
    <AppSidebar />
    <div class="main">
      <AppTopbar :crumbs="crumbs" />
      <div class="content"><slot /></div>
    </div>
    <AppToast />
  </div>
</template>
