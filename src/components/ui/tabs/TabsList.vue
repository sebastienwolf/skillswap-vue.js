<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsList, type TabsListProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() =>
  cn(
    'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
    props.class,
  ),
)
</script>

<template>
  <TabsList v-bind="props" :class="classes">
    <slot />
  </TabsList>
</template>
