<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { SelectIcon, SelectTrigger, type SelectTriggerProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn(
    'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    props.class,
  ),
)
</script>

<template>
  <SelectTrigger v-bind="props" :class="classes">
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 shrink-0 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
