<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AvatarFallback, type AvatarFallbackProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn('flex size-full items-center justify-center rounded-full text-sm font-medium text-secondary-foreground', props.class),
)
</script>

<template>
  <AvatarFallback :class="classes">
    <slot />
  </AvatarFallback>
</template>
