<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PackageSearch } from '@lucide/vue'

import ExchangeableCard from '@/components/common/ExchangeableCard.vue'
import ExchangeableFilterBar from '@/components/common/ExchangeableFilterBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Pagination from '@/components/common/Pagination.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useExchangeableList } from '@/composables/useExchangeableList'
import { itemsApi } from '@/lib/api/items'
import { skillsApi } from '@/lib/api/skills'
import { useCategoriesStore } from '@/stores/categories'
import type { ExchangeType } from '@/types/enums'

const categoriesStore = useCategoriesStore()
onMounted(() => categoriesStore.ensureLoaded())

const items = useExchangeableList(itemsApi)
const skills = useExchangeableList(skillsApi)

const itemType = computed({
  get: () => items.filters.type,
  set: (value: ExchangeType | undefined) => items.setFilter('type', value),
})
const skillType = computed({
  get: () => skills.filters.type,
  set: (value: ExchangeType | undefined) => skills.setFilter('type', value),
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Découvrir</h1>
      <p class="text-muted-foreground">Objets et compétences proposés ou recherchés par la communauté.</p>
    </div>

    <Tabs default-value="items">
      <TabsList>
        <TabsTrigger value="items">Objets</TabsTrigger>
        <TabsTrigger value="skills">Compétences</TabsTrigger>
      </TabsList>

      <TabsContent value="items" class="space-y-4">
        <ExchangeableFilterBar
          :search="items.filters.q ?? ''"
          :type="itemType"
          :category-id="items.filters.category_id"
          :categories="categoriesStore.items"
          @update:search="items.setFilter('q', $event || undefined)"
          @update:type="itemType = $event as ExchangeType | undefined"
          @update:category-id="items.setFilter('category_id', $event)"
        />

        <div v-if="items.loading.value" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton v-for="n in 6" :key="n" class="h-52" />
        </div>

        <EmptyState
          v-else-if="items.results.value.length === 0"
          :icon="PackageSearch"
          title="Aucun objet ne correspond"
          description="Essayez d'élargir vos filtres ou revenez plus tard."
        />

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExchangeableCard v-for="item in items.results.value" :key="item.id" :resource="item" kind="item" />
        </div>

        <Pagination :meta="items.meta.value" @update:page="items.goToPage" />
      </TabsContent>

      <TabsContent value="skills" class="space-y-4">
        <ExchangeableFilterBar
          :search="skills.filters.q ?? ''"
          :type="skillType"
          :category-id="skills.filters.category_id"
          :categories="categoriesStore.skills"
          @update:search="skills.setFilter('q', $event || undefined)"
          @update:type="skillType = $event as ExchangeType | undefined"
          @update:category-id="skills.setFilter('category_id', $event)"
        />

        <div v-if="skills.loading.value" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton v-for="n in 6" :key="n" class="h-52" />
        </div>

        <EmptyState
          v-else-if="skills.results.value.length === 0"
          :icon="PackageSearch"
          title="Aucune compétence ne correspond"
          description="Essayez d'élargir vos filtres ou revenez plus tard."
        />

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExchangeableCard v-for="skill in skills.results.value" :key="skill.id" :resource="skill" kind="skill" />
        </div>

        <Pagination :meta="skills.meta.value" @update:page="skills.goToPage" />
      </TabsContent>
    </Tabs>
  </div>
</template>
