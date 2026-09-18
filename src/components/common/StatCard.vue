<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: number | string
  icon: Component
}>()
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">{{ label }}</p>
      <component :is="icon" class="size-4 text-muted-foreground" />
    </div>
    <p class="mt-2 text-2xl font-semibold">{{ value }}</p>
  </div>
</template>
