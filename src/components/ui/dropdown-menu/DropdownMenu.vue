<script setup lang="ts">
import { DropdownMenuRoot, type DropdownMenuRootEmits, type DropdownMenuRootProps } from 'reka-ui'

const props = defineProps<DropdownMenuRootProps>()
const emit = defineEmits<DropdownMenuRootEmits>()
</script>

<template>
  <DropdownMenuRoot v-bind="props" @update:open="emit('update:open', $event)">
    <slot />
  </DropdownMenuRoot>
</template>
