<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Separator as SeparatorPrimitive, type SeparatorProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn(
    'shrink-0 bg-border',
    props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
    props.class,
  ),
)
</script>

<template>
  <SeparatorPrimitive :orientation="orientation ?? 'horizontal'" :decorative="decorative ?? true" :class="classes" />
</template>
