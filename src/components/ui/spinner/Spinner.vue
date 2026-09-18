<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { LoaderCircle } from '@lucide/vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('size-4 animate-spin', props.class))
</script>

<template>
  <LoaderCircle :class="classes" />
</template>
