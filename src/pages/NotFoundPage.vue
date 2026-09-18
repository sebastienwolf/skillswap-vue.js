<script setup lang="ts">
import { Compass } from '@lucide/vue'

import EmptyState from '@/components/common/EmptyState.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <EmptyState :icon="Compass" title="Page introuvable" description="Cette page n'existe pas ou a été déplacée.">
      <Button as-child size="sm">
        <RouterLink :to="{ name: 'catalog' }">Retour à l'accueil</RouterLink>
      </Button>
    </EmptyState>
  </div>
</template>
