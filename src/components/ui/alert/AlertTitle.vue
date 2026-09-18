<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('mb-1 font-medium leading-none', props.class))
</script>

<template>
  <h5 :class="classes"><slot /></h5>
</template>
