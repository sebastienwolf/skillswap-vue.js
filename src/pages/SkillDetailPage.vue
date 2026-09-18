<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Sparkles } from '@lucide/vue'

import OwnerLifecycleActions from '@/components/common/OwnerLifecycleActions.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ReservationDialog from '@/components/reservations/ReservationDialog.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { skillsApi } from '@/lib/api/skills'
import { ApiError } from '@/lib/http'
import { formatDate, initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { exchangeTypeLabels, skillLevelLabels } from '@/types/enums'
import type { Skill } from '@/types/models'

const props = defineProps<{ id: number }>()

const auth = useAuthStore()
const skill = ref<Skill | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const isOwner = computed(() => auth.user && skill.value && auth.user.id === skill.value.owner.id)
const canReserve = computed(
  () => auth.isAuthenticated && !isOwner.value && skill.value?.status === 'published',
)

async function load() {
  loading.value = true
  errorMessage.value = null

  try {
    skill.value = await skillsApi.get(props.id)
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Compétence introuvable.'
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

    <div v-else-if="errorMessage || !skill" class="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
      {{ errorMessage ?? 'Compétence introuvable.' }}
    </div>

    <template v-else>
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Sparkles class="size-5" />
          </span>
          <div>
            <h1 class="text-xl font-semibold">{{ skill.title }}</h1>
            <p class="text-sm text-muted-foreground">
              Publié le {{ formatDate(skill.created_at) }} · {{ skill.category.name }}
            </p>
          </div>
        </div>
        <StatusBadge :status="skill.status" />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Badge :variant="skill.type === 'offer' ? 'default' : 'secondary'">{{ exchangeTypeLabels[skill.type] }}</Badge>
        <Badge variant="outline">{{ skillLevelLabels[skill.level] }}</Badge>
      </div>

      <p class="whitespace-pre-line text-foreground/90">{{ skill.description }}</p>

      <div class="flex items-center gap-3 rounded-lg border border-border p-4">
        <Avatar>
          <AvatarFallback>{{ initials(skill.owner.name) }}</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium">{{ skill.owner.name }}</p>
          <p class="text-xs text-muted-foreground">Membre depuis {{ skill.owner.member_since }}</p>
        </div>
      </div>

      <OwnerLifecycleActions
        v-if="isOwner"
        :status="skill.status"
        :edit-to="{ name: 'skill-edit', params: { id: skill.id } }"
        :on-publish="() => skillsApi.publish(skill!.id)"
        :on-archive="() => skillsApi.archive(skill!.id)"
        :on-delete="() => skillsApi.remove(skill!.id)"
        @changed="load"
      />

      <ReservationDialog
        v-else-if="canReserve"
        reservable-type="skill"
        :reservable-id="skill.id"
        :resource-title="skill.title"
      />

      <p v-else-if="!auth.isAuthenticated" class="text-sm text-muted-foreground">
        <RouterLink :to="{ name: 'login' }" class="font-medium text-primary hover:underline">Connectez-vous</RouterLink>
        pour réserver cette compétence.
      </p>
    </template>
  </div>
</template>
