<script setup lang="ts">
import { TabsRoot, type TabsRootEmits, type TabsRootProps } from 'reka-ui'

const props = defineProps<TabsRootProps>()
const emit = defineEmits<TabsRootEmits>()
</script>

<template>
  <TabsRoot v-bind="props" @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </TabsRoot>
</template>
