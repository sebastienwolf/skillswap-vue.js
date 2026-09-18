<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsContent, type TabsContentProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('mt-4 focus-visible:outline-none', props.class))
</script>

<template>
  <TabsContent v-bind="props" :class="classes">
    <slot />
  </TabsContent>
</template>
