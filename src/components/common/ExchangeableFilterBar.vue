<script setup lang="ts">
import { Search } from '@lucide/vue'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { exchangeTypeLabels } from '@/types/enums'
import type { Category } from '@/types/models'

const props = defineProps<{
  search: string
  type: string | undefined
  categoryId: number | undefined
  categories: Category[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:type': [value: string | undefined]
  'update:categoryId': [value: number | undefined]
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row">
    <div class="relative flex-1">
      <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        :model-value="props.search"
        placeholder="Rechercher une annonce..."
        class="pl-9"
        @update:model-value="emit('update:search', $event)"
      />
    </div>

    <Select
      :model-value="props.type ?? 'all'"
      @update:model-value="emit('update:type', $event === 'all' ? undefined : (String($event) as 'offer' | 'need'))"
    >
      <SelectTrigger class="sm:w-44">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les types</SelectItem>
        <SelectItem value="offer">{{ exchangeTypeLabels.offer }}</SelectItem>
        <SelectItem value="need">{{ exchangeTypeLabels.need }}</SelectItem>
      </SelectContent>
    </Select>

    <Select
      :model-value="props.categoryId ? String(props.categoryId) : 'all'"
      @update:model-value="emit('update:categoryId', $event === 'all' ? undefined : Number($event))"
    >
      <SelectTrigger class="sm:w-52">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Toutes les catégories</SelectItem>
        <SelectItem v-for="category in categories" :key="category.id" :value="String(category.id)">
          {{ category.name }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
