<script setup lang="ts">
import { useRoute } from 'vue-router'

import { primaryNavItems } from '@/router/navigation'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

function resolveTo(item: (typeof primaryNavItems)[number]) {
  // Une entrée qui exige une session redirige vers la connexion si le
  // visiteur n'est pas authentifié, plutôt que de le laisser buter sur le
  // garde de route sans contexte.
  if (item.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: route.fullPath } }
  }

  return item.to
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Navigation principale"
  >
    <ul class="grid grid-cols-4">
      <li v-for="item in primaryNavItems" :key="item.label">
        <RouterLink
          :to="resolveTo(item)"
          class="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
          active-class="text-primary"
        >
          <component :is="item.icon" class="size-5" />
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
