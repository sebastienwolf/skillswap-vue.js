<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  for?: string
}>()

const classes = computed(() =>
  cn(
    'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class,
  ),
)
</script>

<template>
  <label :for="props.for" :class="classes">
    <slot />
  </label>
</template>
