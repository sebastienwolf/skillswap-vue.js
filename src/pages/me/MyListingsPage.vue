<script setup lang="ts">
import { Package, Plus, Sparkles } from '@lucide/vue'

import EmptyState from '@/components/common/EmptyState.vue'
import ExchangeableCard from '@/components/common/ExchangeableCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useExchangeableList } from '@/composables/useExchangeableList'
import { itemsApi } from '@/lib/api/items'
import { skillsApi } from '@/lib/api/skills'
import { useCategoriesStore } from '@/stores/categories'

useCategoriesStore().ensureLoaded()

const items = useExchangeableList(itemsApi, { mine: true })
const skills = useExchangeableList(skillsApi, { mine: true })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Mes annonces</h1>
        <p class="text-muted-foreground">Gérez vos objets et compétences proposés ou recherchés.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <RouterLink :to="{ name: 'item-create' }"><Plus />Objet</RouterLink>
        </Button>
        <Button as-child>
          <RouterLink :to="{ name: 'skill-create' }"><Plus />Compétence</RouterLink>
        </Button>
      </div>
    </div>

    <Tabs default-value="items">
      <TabsList>
        <TabsTrigger value="items">Objets</TabsTrigger>
        <TabsTrigger value="skills">Compétences</TabsTrigger>
      </TabsList>

      <TabsContent value="items" class="space-y-4">
        <div v-if="items.loading.value" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton v-for="n in 3" :key="n" class="h-52" />
        </div>
        <EmptyState
          v-else-if="items.results.value.length === 0"
          :icon="Package"
          title="Aucun objet publié"
          description="Proposez un objet ou indiquez-en un que vous recherchez."
        >
          <Button as-child size="sm">
            <RouterLink :to="{ name: 'item-create' }">Publier un objet</RouterLink>
          </Button>
        </EmptyState>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExchangeableCard v-for="item in items.results.value" :key="item.id" :resource="item" kind="item" />
        </div>
        <Pagination :meta="items.meta.value" @update:page="items.goToPage" />
      </TabsContent>

      <TabsContent value="skills" class="space-y-4">
        <div v-if="skills.loading.value" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton v-for="n in 3" :key="n" class="h-52" />
        </div>
        <EmptyState
          v-else-if="skills.results.value.length === 0"
          :icon="Sparkles"
          title="Aucune compétence publiée"
          description="Partagez une compétence ou indiquez-en une que vous recherchez."
        >
          <Button as-child size="sm">
            <RouterLink :to="{ name: 'skill-create' }">Publier une compétence</RouterLink>
          </Button>
        </EmptyState>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExchangeableCard v-for="skill in skills.results.value" :key="skill.id" :resource="skill" kind="skill" />
        </div>
        <Pagination :meta="skills.meta.value" @update:page="skills.goToPage" />
      </TabsContent>
    </Tabs>
  </div>
</template>
