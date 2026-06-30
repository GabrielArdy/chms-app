<script setup>
import { DB } from '~/data/db'
import { MOD_ICON } from '~/data/rbac'
</script>

<template>
  <div class="fade-in">
    <UiNote kind="blue" icon="info">
      <span>Katalog modul &amp; submodul dari <span class="code">GET /api/v1/admin/rbac/modules</span>. Gunakan <span class="code">submodule_id</span> untuk mengatur izin tiap grup.</span>
    </UiNote>
    <div style="height:18px" />
    <div v-for="m in DB.modules" :key="m.id" class="perm-mod">
      <div class="perm-mod-head">
        <div class="m-ic"><AppIcon :name="MOD_ICON[m.code] || 'layers'" :width="18" :height="18" /></div>
        <div style="flex:1">
          <div class="m-name">{{ m.name }}</div>
          <span class="m-code">{{ m.code }} • #{{ m.id }}</span>
        </div>
        <span class="muted" style="font-size:12.5px">{{ m.description }}</span>
      </div>
      <div v-for="s in m.submodules" :key="s.id" class="perm-row">
        <span class="code" style="flex:0 0 auto">#{{ s.id }}</span>
        <div style="flex:1;min-width:0">
          <div class="p-name">{{ s.name }}</div>
          <div class="p-code">{{ s.code }}</div>
          <div v-if="s.description" class="muted" style="font-size:12px;margin-top:3px">{{ s.description }}</div>
        </div>
        <span v-if="s.is_view" class="badge badge-slate"><AppIcon name="search" :width="11" :height="11" />is_view</span>
        <span v-else class="badge badge-blue">aksi</span>
      </div>
    </div>
  </div>
</template>
