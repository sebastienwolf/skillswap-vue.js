<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DropdownMenuItem, type DropdownMenuItemProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<
  DropdownMenuItemProps & { class?: HTMLAttributes['class']; variant?: 'default' | 'destructive' }
>()

const classes = computed(() =>
  cn(
    'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:size-4',
    props.variant === 'destructive' && 'text-destructive focus:bg-destructive/10 focus:text-destructive',
    props.class,
  ),
)
</script>

<template>
  <DropdownMenuItem v-bind="props" :class="classes">
    <slot />
  </DropdownMenuItem>
</template>
