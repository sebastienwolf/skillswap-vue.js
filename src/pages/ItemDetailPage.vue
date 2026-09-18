<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Package } from '@lucide/vue'

import OwnerLifecycleActions from '@/components/common/OwnerLifecycleActions.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ReservationDialog from '@/components/reservations/ReservationDialog.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { itemsApi } from '@/lib/api/items'
import { ApiError } from '@/lib/http'
import { formatDate, initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { exchangeTypeLabels } from '@/types/enums'
import type { Item } from '@/types/models'

const props = defineProps<{ id: number }>()

const auth = useAuthStore()
const item = ref<Item | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const isOwner = computed(() => auth.user && item.value && auth.user.id === item.value.owner.id)
const canReserve = computed(
  () => auth.isAuthenticated && !isOwner.value && item.value?.status === 'published',
)

async function load() {
  loading.value = true
  errorMessage.value = null

  try {
    item.value = await itemsApi.get(props.id)
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Objet introuvable.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div v-if="loading" class="space-y-4">
      <Skeleton class="h-8 w-2/3" />
      <Skeleton class="h-40" />
    </div>

    <div v-else-if="errorMessage || !item" class="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
      {{ errorMessage ?? 'Objet introuvable.' }}
    </div>

    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Package class="size-5" />
          </span>
          <div>
            <h1 class="text-xl font-semibold">{{ item.title }}</h1>
            <p class="text-sm text-muted-foreground">
              Publié le {{ formatDate(item.created_at) }} · {{ item.category.name }}
            </p>
          </div>
        </div>
        <StatusBadge :status="item.status" />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Badge :variant="item.type === 'offer' ? 'default' : 'secondary'">{{ exchangeTypeLabels[item.type] }}</Badge>
        <Badge variant="outline">Quantité : {{ item.quantity }}</Badge>
      </div>

      <p class="whitespace-pre-line text-foreground/90">{{ item.description }}</p>

      <div class="flex items-center gap-3 rounded-lg border border-border p-4">
        <Avatar>
          <AvatarFallback>{{ initials(item.owner.name) }}</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium">{{ item.owner.name }}</p>
          <p class="text-xs text-muted-foreground">Membre depuis {{ item.owner.member_since }}</p>
        </div>
      </div>

      <OwnerLifecycleActions
        v-if="isOwner"
        :status="item.status"
        :edit-to="{ name: 'item-edit', params: { id: item.id } }"
        :on-publish="() => itemsApi.publish(item!.id)"
        :on-archive="() => itemsApi.archive(item!.id)"
        :on-delete="() => itemsApi.remove(item!.id)"
        @changed="load"
      />

      <ReservationDialog
        v-else-if="canReserve"
        reservable-type="item"
        :reservable-id="item.id"
        :resource-title="item.title"
      />

      <p v-else-if="!auth.isAuthenticated" class="text-sm text-muted-foreground">
        <RouterLink :to="{ name: 'login' }" class="font-medium text-primary hover:underline">Connectez-vous</RouterLink>
        pour réserver cet objet.
      </p>
    </template>
  </div>
</template>
