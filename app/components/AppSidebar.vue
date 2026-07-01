<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { logout, user } = useAuth()

const isActive = (path) => route.path === path

const displayName = computed(() => user.value?.full_name || user.value?.email || 'Pengguna')
const roleLabel = computed(() => (user.value?.roles || []).join(' · ') || '—')

const doLogout = () => { logout(); router.push('/login') }
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#adc7f7" stroke-width="2" stroke-linecap="round">
          <path d="M12 2v8M8 6h8" />
          <path d="M5 21V11l7-4 7 4v10" stroke="#fff" />
          <path d="M10 21v-5h4v5" stroke="#6cf8bb" />
        </svg>
      </div>
      <div>
        <div class="brand-name">ChurchMS</div>
        <div class="brand-sub">Sanctuary OS</div>
      </div>
    </div>

    <nav class="nav-scroll">
      <div class="nav-section">
        <NuxtLink to="/" :class="['nav-item', isActive('/') ? 'active' : '']">
          <AppIcon name="grid" /><span>Dasbor</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Pelayanan</div>
        <NuxtLink to="/households" :class="['nav-item', isActive('/households') ? 'active' : '']">
          <AppIcon name="users" /><span>Jemaat</span>
        </NuxtLink>
        <NuxtLink to="/announcements" :class="['nav-item', isActive('/announcements') ? 'active' : '']">
          <AppIcon name="megaphone" /><span>Warta</span>
        </NuxtLink>
        <NuxtLink to="/rite" :class="['nav-item', isActive('/rite') ? 'active' : '']">
          <AppIcon name="book" /><span>Ibadah &amp; Liturgi</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Administrasi</div>
        <NuxtLink to="/finance" :class="['nav-item', isActive('/finance') ? 'active' : '']">
          <AppIcon name="wallet" /><span>Keuangan</span>
        </NuxtLink>
        <NuxtLink to="/access" :class="['nav-item', isActive('/access') ? 'active' : '']">
          <AppIcon name="shield" /><span>Kontrol Akses</span>
        </NuxtLink>
        <NuxtLink to="/health" :class="['nav-item', isActive('/health') ? 'active' : '']">
          <AppIcon name="activity" /><span>Status Sistem</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <div class="nav-section-label">Akun</div>
        <NuxtLink to="/profile" :class="['nav-item', isActive('/profile') ? 'active' : '']">
          <AppIcon name="settings" /><span>Profil &amp; Preferensi</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="sidebar-foot">
      <div class="avatar">{{ initials(displayName) }}</div>
      <div style="min-width:0;flex:1">
        <div class="who">{{ displayName }}</div>
        <div class="role">{{ roleLabel }}</div>
      </div>
      <button class="nav-item" style="width:auto;padding:8px" title="Keluar" @click="doLogout">
        <AppIcon name="logout" />
      </button>
    </div>
  </aside>
</template>
