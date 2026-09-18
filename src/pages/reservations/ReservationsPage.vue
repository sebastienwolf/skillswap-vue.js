<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { CalendarClock } from '@lucide/vue'

import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import ReservationCard from '@/components/reservations/ReservationCard.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { reservationsApi, type ReservationListParams } from '@/lib/api/reservations'
import { ApiError } from '@/lib/http'
import type { PaginatedResponse } from '@/types/api'
import type { Reservation } from '@/types/models'

/** Un seul état de liste, réutilisé pour les deux onglets (même API, seul `scope` change). */
function useReservationList(scope: ReservationListParams['scope']) {
  const filters = reactive({ scope, page: 1 })
  const results = ref<Reservation[]>([])
  const meta = ref<PaginatedResponse<Reservation>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null

    try {
      const response = await reservationsApi.list(filters)
      results.value = response.data
      meta.value = response.meta
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Impossible de charger les réservations.'
    } finally {
      loading.value = false
    }
  }

  watch(() => filters.page, load, { immediate: true })

  return { results, meta, loading, error, goToPage: (page: number) => (filters.page = page), refresh: load }
}

const sent = useReservationList('mine')
const received = useReservationList('received')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Réservations</h1>
      <p class="text-muted-foreground">Suivez vos demandes envoyées et celles reçues sur vos annonces.</p>
    </div>

    <Tabs default-value="received">
      <TabsList>
        <TabsTrigger value="received">Reçues</TabsTrigger>
        <TabsTrigger value="sent">Envoyées</TabsTrigger>
      </TabsList>

      <TabsContent value="received" class="space-y-3">
        <div v-if="received.loading.value" class="space-y-3">
          <Skeleton v-for="n in 3" :key="n" class="h-28" />
        </div>
        <EmptyState
          v-else-if="received.results.value.length === 0"
          :icon="CalendarClock"
          title="Aucune réservation reçue"
          description="Les demandes des autres membres sur vos annonces apparaîtront ici."
        />
        <template v-else>
          <ReservationCard
            v-for="reservation in received.results.value"
            :key="reservation.id"
            :reservation="reservation"
            @changed="received.refresh"
          />
          <Pagination :meta="received.meta.value" @update:page="received.goToPage" />
        </template>
      </TabsContent>

      <TabsContent value="sent" class="space-y-3">
        <div v-if="sent.loading.value" class="space-y-3">
          <Skeleton v-for="n in 3" :key="n" class="h-28" />
        </div>
        <EmptyState
          v-else-if="sent.results.value.length === 0"
          :icon="CalendarClock"
          title="Aucune réservation envoyée"
          description="Vos demandes sur les annonces d'autres membres apparaîtront ici."
        />
        <template v-else>
          <ReservationCard
            v-for="reservation in sent.results.value"
            :key="reservation.id"
            :reservation="reservation"
            @changed="sent.refresh"
          />
          <Pagination :meta="sent.meta.value" @update:page="sent.goToPage" />
        </template>
      </TabsContent>
    </Tabs>
  </div>
</template>
