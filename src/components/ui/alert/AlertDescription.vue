<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('text-sm opacity-90 [&_p]:leading-relaxed', props.class))
</script>

<template>
  <div :class="classes"><slot /></div>
</template>
