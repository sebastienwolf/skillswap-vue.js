<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DropdownMenuContent, DropdownMenuPortal, type DropdownMenuContentProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(), {
  sideOffset: 6,
  align: 'end',
})

const classes = computed(() =>
  cn(
    'z-50 min-w-40 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
    props.class,
  ),
)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent v-bind="props" :class="classes">
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
