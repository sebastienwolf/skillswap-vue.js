<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'

import UserMenu from '@/components/layout/UserMenu.vue'
import { adminNavItems } from '@/router/adminNavigation'
</script>

<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <!-- Sidebar desktop -->
    <aside class="hidden w-60 shrink-0 flex-col border-r border-border p-4 md:flex">
      <RouterLink
        :to="{ name: 'catalog' }"
        class="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft class="size-4" />
        Retour à SkillSwap
      </RouterLink>

      <nav class="flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="item in adminNavItems"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          active-class="bg-accent text-accent-foreground"
        >
          <component :is="item.icon" class="size-4" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <UserMenu />
    </aside>

    <div class="flex flex-1 flex-col">
      <!-- Barre mobile -->
      <header
        class="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden"
      >
        <RouterLink :to="{ name: 'catalog' }" class="flex items-center gap-2 text-sm font-medium">
          <ArrowLeft class="size-4" />
          SkillSwap
        </RouterLink>
        <UserMenu />
      </header>

      <nav class="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 scrollbar-none md:hidden">
        <RouterLink
          v-for="item in adminNavItems"
          :key="item.label"
          :to="item.to"
          class="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground"
          active-class="bg-accent text-accent-foreground"
        >
          <component :is="item.icon" class="size-4" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
