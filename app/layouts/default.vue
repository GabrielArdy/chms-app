<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
</script>

<template>
  <div class="app">
    <AppSidebar />
    <div class="main">
      <AppTopbar :crumbs="crumbs" />
      <div class="content"><slot /></div>
    </div>
  </div>
</template>
