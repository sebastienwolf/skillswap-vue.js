<script setup lang="ts">
import { computed } from 'vue'

import { Badge, type BadgeVariants } from '@/components/ui/badge'
import {
  type ExchangeStatus,
  type ReservationStatus,
  exchangeStatusLabels,
  reservationStatusLabels,
} from '@/types/enums'

const props = defineProps<{ status: ExchangeStatus | ReservationStatus }>()

/** Associe chaque statut (annonce ou réservation) à une variante de couleur cohérente. */
const variants: Record<ExchangeStatus | ReservationStatus, NonNullable<BadgeVariants['variant']>> = {
  published: 'success',
  reserved: 'warning',
  completed: 'secondary',
  archived: 'outline',
  pending: 'warning',
  accepted: 'success',
  declined: 'destructive',
  cancelled: 'outline',
}

const label = computed(
  () =>
    (exchangeStatusLabels as Record<string, string>)[props.status] ??
    (reservationStatusLabels as Record<string, string>)[props.status],
)
</script>

<template>
  <Badge :variant="variants[status]">{{ label }}</Badge>
</template>
