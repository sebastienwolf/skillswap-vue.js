<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CalendarClock, FolderTree, Package, Sparkles, UserCheck, Users } from '@lucide/vue'

import StatCard from '@/components/common/StatCard.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { adminApi } from '@/lib/api/admin'
import { ApiError } from '@/lib/http'
import type { AdminDashboardStats } from '@/types/models'

const stats = ref<AdminDashboardStats | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    stats.value = await adminApi.dashboard.summary()
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Impossible de charger le tableau de bord.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
      <p class="text-muted-foreground">Vue d'ensemble de l'activité de la plateforme.</p>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Skeleton v-for="n in 8" :key="n" class="h-24" />
    </div>

    <p v-else-if="errorMessage || !stats" class="text-destructive">{{ errorMessage }}</p>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Utilisateurs" :value="stats.users.total" :icon="Users" />
        <StatCard label="Comptes actifs" :value="stats.users.active" :icon="UserCheck" />
        <StatCard label="Réservations en attente" :value="stats.reservations.pending" :icon="CalendarClock" />
        <StatCard label="Réservations terminées" :value="stats.reservations.completed" :icon="CalendarClock" />

        <StatCard label="Objets publiés" :value="stats.items.published" :icon="Package" />
        <StatCard label="Objets réservés" :value="stats.items.reserved" :icon="Package" />
        <StatCard label="Compétences publiées" :value="stats.skills.published" :icon="Sparkles" />
        <StatCard label="Compétences réservées" :value="stats.skills.reserved" :icon="Sparkles" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <FolderTree class="size-4" />
            Catégories les plus actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="divide-y divide-border">
            <li
              v-for="category in stats.top_categories"
              :key="category.id"
              class="flex items-center justify-between py-2 text-sm"
            >
              <span>{{ category.name }}</span>
              <span class="text-muted-foreground">
                {{ category.items_count }} objet(s) · {{ category.skills_count }} compétence(s)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
