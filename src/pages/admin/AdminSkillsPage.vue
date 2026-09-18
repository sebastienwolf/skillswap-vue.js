<script setup lang="ts">
import AdminModerationList from '@/components/admin/AdminModerationList.vue'
import { adminApi } from '@/lib/api/admin'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Modération des compétences</h1>
      <p class="text-muted-foreground">Toutes les annonces de compétences, tous membres confondus.</p>
    </div>

    <AdminModerationList detail-route-name="skill-detail" :api="adminApi.skills" />
  </div>
</template>
