<script setup lang="ts">
import { Label } from '@/components/ui/label'

defineProps<{
  id: string
  label: string
  error?: string
}>()
</script>

<template>
  <div class="space-y-1.5">
    <Label :for="id">{{ label }}</Label>
    <slot />
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
