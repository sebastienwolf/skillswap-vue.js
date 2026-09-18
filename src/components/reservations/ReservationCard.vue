<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Package, Sparkles, X } from '@lucide/vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { reservationsApi } from '@/lib/api/reservations'
import { ApiError } from '@/lib/http'
import { formatDateTime, initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { Reservation } from '@/types/models'

const props = defineProps<{ reservation: Reservation }>()
const emit = defineEmits<{ changed: [] }>()

const auth = useAuthStore()
const toast = useToastStore()
const actionLoading = ref<'accept' | 'decline' | 'cancel' | 'complete' | null>(null)

// Chaînage optionnel sur toute la profondeur : une seule réservation dont
// les relations `reservable`/`owner`/`requester` seraient incomplètes côté
// API (donnée orpheline, chargement manquant sur un endpoint qu'on aurait
// oublié) ne doit jamais faire planter tout l'affichage de la liste.
const isOwner = computed(() => auth.user?.id === props.reservation.reservable?.owner?.id)
const isRequester = computed(() => auth.user?.id === props.reservation.requester?.id)

const canRespond = computed(() => isOwner.value && props.reservation.status === 'pending')
const canCancel = computed(
  () => (isOwner.value || isRequester.value) && ['pending', 'accepted'].includes(props.reservation.status),
)
const canComplete = computed(() => isOwner.value && props.reservation.status === 'accepted')

async function run(action: 'accept' | 'decline' | 'cancel' | 'complete') {
  actionLoading.value = action

  try {
    await reservationsApi[action](props.reservation.id)
    emit('changed')
  } catch (error) {
    toast.error('Action impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    actionLoading.value = null
  }
}

const detailRoute = computed(() => ({
  name: props.reservation.reservable_type === 'item' ? 'item-detail' : 'skill-detail',
  params: { id: props.reservation.reservable?.id },
}))
</script>

<template>
  <Card>
    <CardContent class="space-y-3 p-4">
      <div class="flex items-start justify-between gap-3">
        <RouterLink :to="detailRoute" class="flex items-center gap-2 font-medium hover:underline">
          <component :is="reservation.reservable_type === 'item' ? Package : Sparkles" class="size-4 text-muted-foreground" />
          {{ reservation.reservable?.title ?? 'Annonce supprimée' }}
        </RouterLink>
        <StatusBadge :status="reservation.status" />
      </div>

      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Avatar class="size-6">
          <AvatarFallback class="text-[10px]">{{ initials(reservation.requester?.name ?? '?') }}</AvatarFallback>
        </Avatar>
        <span>{{ reservation.requester?.name ?? 'Utilisateur inconnu' }} · {{ formatDateTime(reservation.created_at) }}</span>
      </div>

      <p v-if="reservation.message" class="rounded-md bg-muted px-3 py-2 text-sm">{{ reservation.message }}</p>

      <div v-if="canRespond || canCancel || canComplete" class="flex flex-wrap gap-2 pt-1">
        <Button v-if="canRespond" size="sm" :disabled="!!actionLoading" @click="run('accept')">
          <Spinner v-if="actionLoading === 'accept'" />
          <Check v-else />
          Accepter
        </Button>
        <Button v-if="canRespond" size="sm" variant="outline" :disabled="!!actionLoading" @click="run('decline')">
          <Spinner v-if="actionLoading === 'decline'" />
          <X v-else />
          Refuser
        </Button>
        <Button v-if="canComplete" size="sm" variant="outline" :disabled="!!actionLoading" @click="run('complete')">
          <Spinner v-if="actionLoading === 'complete'" />
          Marquer terminée
        </Button>
        <Button v-if="canCancel" size="sm" variant="ghost" class="text-destructive hover:text-destructive" :disabled="!!actionLoading" @click="run('cancel')">
          <Spinner v-if="actionLoading === 'cancel'" />
          Annuler
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
