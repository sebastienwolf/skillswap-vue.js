<script setup lang="ts">
import { ArrowLeftRight, Plus } from '@lucide/vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden"
    style="padding-top: env(safe-area-inset-top)"
  >
    <RouterLink :to="{ name: 'catalog' }" class="flex items-center gap-2 font-semibold">
      <span class="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ArrowLeftRight class="size-3.5" />
      </span>
      SkillSwap
    </RouterLink>

    <div class="flex items-center gap-2">
      <template v-if="auth.isAuthenticated">
        <Button size="icon" variant="ghost" as-child aria-label="Publier une annonce">
          <RouterLink :to="{ name: 'item-create' }">
            <Plus />
          </RouterLink>
        </Button>
        <RouterLink :to="{ name: 'profile' }">
          <Avatar class="size-8">
            <AvatarFallback class="text-xs">{{ initials(auth.user?.name ?? '?') }}</AvatarFallback>
          </Avatar>
        </RouterLink>
      </template>
      <Button v-else size="sm" as-child>
        <RouterLink :to="{ name: 'login' }">Connexion</RouterLink>
      </Button>
    </div>
  </header>
</template>
