<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Trash2, Users } from '@lucide/vue'

import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Switch } from '@/components/ui/switch'
import { adminApi } from '@/lib/api/admin'
import { ApiError } from '@/lib/http'
import { initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { userRoleLabels, type UserRole } from '@/types/enums'
import type { PaginatedResponse } from '@/types/api'
import type { User } from '@/types/models'

const auth = useAuthStore()
const toast = useToastStore()

const filters = reactive<{ role: UserRole | undefined; page: number }>({ role: undefined, page: 1 })
const users = ref<User[]>([])
const meta = ref<PaginatedResponse<User>['meta'] | null>(null)
const loading = ref(true)
const rowLoading = ref<number | null>(null)
const deleteTarget = ref<User | null>(null)

async function load() {
  loading.value = true

  try {
    const response = await adminApi.users.list(filters)
    users.value = response.data
    meta.value = response.meta
  } catch {
    toast.error('Impossible de charger les utilisateurs.')
  } finally {
    loading.value = false
  }
}

watch(() => ({ ...filters }), load, { deep: true, immediate: true })

async function toggleActive(user: User) {
  rowLoading.value = user.id

  try {
    const updated = await adminApi.users.update(user.id, { is_active: !user.is_active })
    Object.assign(user, updated)
  } catch (error) {
    toast.error('Action impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    rowLoading.value = null
  }
}

async function changeRole(user: User, role: UserRole) {
  rowLoading.value = user.id

  try {
    const updated = await adminApi.users.update(user.id, { role })
    Object.assign(user, updated)
    toast.success('Rôle mis à jour.')
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
    await adminApi.users.remove(deleteTarget.value.id)
    toast.success('Utilisateur supprimé.')
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
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Utilisateurs</h1>
        <p class="text-muted-foreground">Gérez les rôles et l'accès des membres.</p>
      </div>

      <Select :model-value="filters.role ?? 'all'" @update:model-value="filters.role = $event === 'all' ? undefined : (String($event) as UserRole)">
        <SelectTrigger class="w-44">
          <SelectValue placeholder="Rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="member">{{ userRoleLabels.member }}</SelectItem>
          <SelectItem value="admin">{{ userRoleLabels.admin }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="n in 5" :key="n" class="h-16" />
    </div>

    <EmptyState v-else-if="users.length === 0" :icon="Users" title="Aucun utilisateur trouvé" />

    <div v-else class="space-y-2">
      <div
        v-for="user in users"
        :key="user.id"
        class="flex flex-wrap items-center gap-4 rounded-lg border border-border p-3"
      >
        <Avatar>
          <AvatarFallback>{{ initials(user.name) }}</AvatarFallback>
        </Avatar>

        <div class="min-w-40 flex-1">
          <p class="text-sm font-medium">{{ user.name }}</p>
          <p class="text-xs text-muted-foreground">{{ user.email }}</p>
        </div>

        <Select
          :model-value="user.role"
          :disabled="user.id === auth.user?.id || rowLoading === user.id"
          @update:model-value="changeRole(user, $event as UserRole)"
        >
          <SelectTrigger class="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">{{ userRoleLabels.member }}</SelectItem>
            <SelectItem value="admin">{{ userRoleLabels.admin }}</SelectItem>
          </SelectContent>
        </Select>

        <label class="flex items-center gap-2 text-sm">
          <Switch
            :model-value="user.is_active"
            :disabled="user.id === auth.user?.id || rowLoading === user.id"
            @update:model-value="toggleActive(user)"
          />
          Actif
        </label>

        <Button
          size="icon"
          variant="ghost"
          class="text-destructive hover:text-destructive"
          :disabled="user.id === auth.user?.id"
          aria-label="Supprimer"
          @click="deleteTarget = user"
        >
          <Trash2 class="size-4" />
        </Button>
      </div>

      <Pagination :meta="meta" @update:page="filters.page = $event" />
    </div>

    <Dialog :open="!!deleteTarget" @update:open="(value) => !value && (deleteTarget = null)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer « {{ deleteTarget?.name }} » ?</DialogTitle>
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
