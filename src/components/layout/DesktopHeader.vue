<script setup lang="ts">
import { ArrowLeftRight } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import PublishMenu from '@/components/layout/PublishMenu.vue'
import UserMenu from '@/components/layout/UserMenu.vue'
import { primaryNavItems } from '@/router/navigation'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header class="sticky top-0 z-30 hidden border-b border-border bg-background/95 backdrop-blur md:block">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
      <RouterLink :to="{ name: 'catalog' }" class="flex items-center gap-2 font-semibold">
        <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ArrowLeftRight class="size-4" />
        </span>
        SkillSwap
      </RouterLink>

      <nav class="flex items-center gap-1 text-sm font-medium">
        <RouterLink
          v-for="item in primaryNavItems"
          :key="item.label"
          :to="item.requiresAuth && !auth.isAuthenticated ? { name: 'login' } : item.to"
          class="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          active-class="bg-accent text-accent-foreground"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <PublishMenu />
          <UserMenu />
        </template>
        <template v-else>
          <Button variant="ghost" as-child>
            <RouterLink :to="{ name: 'login' }">Connexion</RouterLink>
          </Button>
          <Button as-child>
            <RouterLink :to="{ name: 'register' }">Créer un compte</RouterLink>
          </Button>
        </template>
      </div>
    </div>
  </header>
</template>
