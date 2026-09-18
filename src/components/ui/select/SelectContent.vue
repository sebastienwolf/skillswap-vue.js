<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SelectContent, SelectPortal, SelectViewport, type SelectContentProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(), {
  position: 'popper',
  sideOffset: 4,
})

const classes = computed(() =>
  cn(
    'relative z-50 max-h-72 min-w-[8rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md',
    props.position === 'popper' && 'w-[--reka-select-trigger-width]',
    props.class,
  ),
)
</script>

<template>
  <SelectPortal>
    <SelectContent v-bind="props" :class="classes">
      <SelectViewport class="p-1">
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
