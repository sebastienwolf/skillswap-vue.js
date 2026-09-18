<script lang="ts">
import { type VariantProps, cva } from 'class-variance-authority'

export const alertVariants = cva('relative w-full rounded-lg border p-4 text-sm [&>svg]:size-4', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground border-border',
      destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
      success: 'border-success/40 bg-success/10 text-success',
    },
  },
  defaultVariants: { variant: 'default' },
})

export type AlertVariants = VariantProps<typeof alertVariants>
</script>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ variant?: AlertVariants['variant']; class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn(alertVariants({ variant: props.variant }), props.class))
</script>

<template>
  <div role="alert" :class="classes">
    <slot />
  </div>
</template>
