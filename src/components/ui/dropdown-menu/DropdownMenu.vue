<script setup lang="ts">
import { DropdownMenuRoot, type DropdownMenuRootEmits, type DropdownMenuRootProps } from 'reka-ui'

// Même bug que Select.vue (voir son commentaire) : sans `withDefaults` avec
// des valeurs `undefined` explicites pour `open`/`defaultOpen`, Vue force
// `false` pour ces booléens optionnels absents, ce qui bloque le menu en
// permanence sur "fermé".
const props = withDefaults(defineProps<DropdownMenuRootProps>(), {
  open: undefined,
  defaultOpen: undefined,
})
const emit = defineEmits<DropdownMenuRootEmits>()
</script>

<template>
  <DropdownMenuRoot v-bind="props" @update:open="emit('update:open', $event)">
    <slot />
  </DropdownMenuRoot>
</template>
