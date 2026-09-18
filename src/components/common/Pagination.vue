<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import type { PaginatedResponse } from '@/types/api'

const props = defineProps<{ meta: PaginatedResponse<unknown>['meta'] | null }>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const hasPrevious = computed(() => (props.meta ? props.meta.current_page > 1 : false))
const hasNext = computed(() => (props.meta ? props.meta.current_page < props.meta.last_page : false))
</script>

<template>
  <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between gap-4">
    <p class="text-sm text-muted-foreground">
      {{ meta.from }}–{{ meta.to }} sur {{ meta.total }}
    </p>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        :disabled="!hasPrevious"
        aria-label="Page précédente"
        @click="emit('update:page', meta.current_page - 1)"
      >
        <ChevronLeft />
      </Button>
      <span class="text-sm font-medium">{{ meta.current_page }} / {{ meta.last_page }}</span>
      <Button
        variant="outline"
        size="icon"
        :disabled="!hasNext"
        aria-label="Page suivante"
        @click="emit('update:page', meta.current_page + 1)"
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
