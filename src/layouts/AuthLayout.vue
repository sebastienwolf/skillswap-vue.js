<script setup lang="ts">
import { ArrowLeftRight } from '@lucide/vue'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/40 p-4">
    <div class="w-full max-w-sm space-y-6">
      <RouterLink :to="{ name: 'catalog' }" class="flex items-center justify-center gap-2 font-semibold">
        <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ArrowLeftRight class="size-4" />
        </span>
        SkillSwap
      </RouterLink>

      <RouterView />
    </div>
  </div>
</template>
