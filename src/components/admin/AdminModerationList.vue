<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Archive, PackageSearch, Trash2 } from '@lucide/vue'

import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { ApiError } from '@/lib/http'
import type { PaginatedResponse } from '@/types/api'
import { exchangeStatusLabels, type ExchangeStatus } from '@/types/enums'
import type { Item, Skill } from '@/types/models'
import { useToastStore } from '@/stores/toast'

/**
 * Vue de modération partagée par Objets et Compétences côté admin : les
 * deux endpoints (App\Http\Controllers\Api\Admin\{Item,Skill}Controller)
 * exposent exactement les mêmes opérations (list/archive/destroy), d'où un
 * seul composant piloté par les props plutôt qu'une copie par ressource.
 */
const props = defineProps<{
  detailRouteName: string
  api: {
    list: (params: {
      status?: ExchangeStatus
      page?: number
    }) => Promise<PaginatedResponse<Item | Skill>>
    archive: (id: number) => Promise<unknown>
    remove: (id: number) => Promise<unknown>
  }
}>()

const toast = useToastStore()
const filters = reactive<{ status: ExchangeStatus | undefined; page: number }>({ status: undefined, page: 1 })
const results = ref<(Item | Skill)[]>([])
const meta = ref<PaginatedResponse<Item | Skill>['meta'] | null>(null)
const loading = ref(true)
const rowLoading = ref<number | null>(null)
const deleteTarget = ref<Item | Skill | null>(null)

async function load() {
  loading.value = true

  try {
    const response = await props.api.list(filters)
    results.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Impossible de charger les annonces.')
  } finally {
    loading.value = false
  }
}

watch(() => ({ ...filters }), load, { deep: true, immediate: true })

async function archive(resource: Item | Skill) {
  rowLoading.value = resource.id

  try {
    await props.api.archive(resource.id)
    resource.status = 'archived'
    toast.success('Annonce archivée.')
  } catch (error) {
    toast.error('Action impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    rowLoading.value = null
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return

  rowLoading.value = deleteTarget.value.id

  try {
    await props.api.remove(deleteTarget.value.id)
    toast.success('Annonce supprimée.')
    deleteTarget.value = null
    await load()
  } catch (error) {
    toast.error('Suppression impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    rowLoading.value = null
  }
}
</script>

<template>
  <div class="space-y-4">
    <Select
      :model-value="filters.status ?? 'all'"
      @update:model-value="filters.status = $event === 'all' ? undefined : (String($event) as ExchangeStatus)"
    >
      <SelectTrigger class="w-48">
        <SelectValue placeholder="Statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        <SelectItem v-for="(label, value) in exchangeStatusLabels" :key="value" :value="value">
          {{ label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <div v-if="loading" class="space-y-2">
      <Skeleton v-for="n in 5" :key="n" class="h-16" />
    </div>

    <EmptyState v-else-if="results.length === 0" :icon="PackageSearch" title="Aucune annonce" />

    <div v-else class="space-y-2">
      <div v-for="resource in results" :key="resource.id" class="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
        <RouterLink :to="{ name: detailRouteName, params: { id: resource.id } }" class="min-w-48 flex-1 truncate text-sm font-medium hover:underline">
          {{ resource.title }}
        </RouterLink>
        <span class="text-xs text-muted-foreground">{{ resource.owner.name }}</span>
        <StatusBadge :status="resource.status" />

        <div class="ml-auto flex gap-1">
          <Button
            v-if="resource.status !== 'archived'"
            size="icon"
            variant="ghost"
            :disabled="rowLoading === resource.id"
            aria-label="Archiver"
            @click="archive(resource)"
          >
            <Spinner v-if="rowLoading === resource.id" />
            <Archive v-else class="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            class="text-destructive hover:text-destructive"
            aria-label="Supprimer"
            @click="deleteTarget = resource"
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>

      <Pagination :meta="meta" @update:page="filters.page = $event" />
    </div>

    <Dialog :open="!!deleteTarget" @update:open="(value) => !value && (deleteTarget = null)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer « {{ deleteTarget?.title }} » ?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteTarget = null">Annuler</Button>
          <Button variant="destructive" :disabled="rowLoading === deleteTarget?.id" @click="confirmDelete">
            <Spinner v-if="rowLoading === deleteTarget?.id" />
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
