<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('text-sm text-muted-foreground', props.class))
</script>

<template>
  <DialogDescription v-bind="props" :class="classes">
    <slot />
  </DialogDescription>
</template>
