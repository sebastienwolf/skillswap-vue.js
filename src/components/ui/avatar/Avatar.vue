<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AvatarRoot, type AvatarRootProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<AvatarRootProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn('relative flex size-10 shrink-0 overflow-hidden rounded-full bg-secondary', props.class),
)
</script>

<template>
  <AvatarRoot :class="classes">
    <slot />
  </AvatarRoot>
</template>
