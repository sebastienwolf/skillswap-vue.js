<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Check } from '@lucide/vue'
import { SelectItem, SelectItemIndicator, SelectItemText, type SelectItemProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn(
    'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <SelectItem v-bind="props" :class="classes">
    <span class="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check class="size-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
