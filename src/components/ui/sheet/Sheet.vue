<script setup lang="ts">
import { DialogRoot, type DialogRootEmits, type DialogRootProps } from 'reka-ui'

// Même bug que Select.vue (voir son commentaire) : sans `withDefaults` avec
// des valeurs `undefined` explicites pour `open`/`defaultOpen`, Vue force
// `false` pour ces booléens optionnels absents, ce qui bloque le panneau en
// permanence sur "fermé".
const props = withDefaults(defineProps<DialogRootProps>(), {
  open: undefined,
  defaultOpen: undefined,
})
const emit = defineEmits<DialogRootEmits>()
</script>

<template>
  <DialogRoot v-bind="props" @update:open="emit('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
