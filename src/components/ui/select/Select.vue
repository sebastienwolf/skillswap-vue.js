<script setup lang="ts">
import { SelectRoot, type SelectRootEmits, type SelectRootProps } from 'reka-ui'

// `withDefaults` avec des valeurs `undefined` explicites est indispensable
// ici, et pas qu'une question de style : sans lui, le compilateur Vue génère
// pour `open`/`defaultOpen` (booléens optionnels du type `SelectRootProps`)
// des options de prop SANS clé `default`. Or Vue force alors automatiquement
// `false` pour tout prop booléen absent qui n'a pas de `default` déclaré.
// `open` valait donc `false` (au lieu de `undefined`) une fois transmis à
// `SelectRoot` via `v-bind="props"`, ce qui bascule `SelectRoot` en mode
// "open contrôlé" côté reka-ui (au lieu du mode "non contrôlé" attendu) :
// son état interne restait alors bloqué en permanence sur `false`, et le
// menu ne s'ouvrait plus jamais, quel que soit le clic sur le trigger.
const props = withDefaults(defineProps<SelectRootProps>(), {
  open: undefined,
  defaultOpen: undefined,
})
const emit = defineEmits<SelectRootEmits>()
</script>

<template>
  <SelectRoot v-bind="props" @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </SelectRoot>
</template>
