<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('px-2 py-1.5 text-sm font-medium text-muted-foreground', props.class))
</script>

<template>
  <div :class="classes"><slot /></div>
</template>
