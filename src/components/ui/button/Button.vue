<script lang="ts">
import { type VariantProps, cva } from 'class-variance-authority'

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 [&_svg]:size-4',
        sm: 'h-9 rounded-md px-3 [&_svg]:size-4',
        lg: 'h-12 rounded-md px-6 text-base [&_svg]:size-5',
        icon: 'h-10 w-10 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
</script>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      variant?: ButtonVariants['variant']
      size?: ButtonVariants['size']
      class?: HTMLAttributes['class']
      disabled?: boolean
    }
  >(),
  {
    as: 'button',
  },
)

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :disabled="disabled" :class="classes">
    <slot />
  </Primitive>
</template>
