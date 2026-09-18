<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DialogTitle, type DialogTitleProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()
const classes = computed(() => cn('text-lg font-semibold leading-none', props.class))
</script>

<template>
  <DialogTitle v-bind="props" :class="classes">
    <slot />
  </DialogTitle>
</template>
