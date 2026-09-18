<script setup lang="ts">
import { computed } from 'vue'
import { Package, Sparkles } from '@lucide/vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { initials } from '@/lib/utils'
import { exchangeTypeLabels, skillLevelLabels } from '@/types/enums'
import type { Item, Skill } from '@/types/models'

const props = defineProps<{
  resource: Item | Skill
  kind: 'item' | 'skill'
}>()

const isSkill = computed(() => props.kind === 'skill')
const level = computed(() => ('level' in props.resource ? props.resource.level : null))
</script>

<template>
  <RouterLink
    :to="{ name: isSkill ? 'skill-detail' : 'item-detail', params: { id: resource.id } }"
    class="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Card class="h-full transition-shadow hover:shadow-md">
      <CardHeader class="flex-row items-start justify-between gap-2 space-y-0">
        <div class="flex items-center gap-2">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Sparkles v-if="isSkill" class="size-4" />
            <Package v-else class="size-4" />
          </div>
          <Badge variant="outline">{{ resource.category.name }}</Badge>
        </div>
        <StatusBadge :status="resource.status" />
      </CardHeader>

      <CardContent class="space-y-3">
        <div class="space-y-1">
          <h3 class="line-clamp-1 font-semibold">{{ resource.title }}</h3>
          <p class="line-clamp-2 text-sm text-muted-foreground">{{ resource.description }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <Badge :variant="resource.type === 'offer' ? 'default' : 'secondary'">
            {{ exchangeTypeLabels[resource.type] }}
          </Badge>
          <Badge v-if="level" variant="outline">{{ skillLevelLabels[level] }}</Badge>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <Avatar class="size-6">
            <AvatarFallback class="text-[10px]">{{ initials(resource.owner.name) }}</AvatarFallback>
          </Avatar>
          <span class="text-xs text-muted-foreground">{{ resource.owner.name }}</span>
        </div>
      </CardContent>
    </Card>
  </RouterLink>
</template>
