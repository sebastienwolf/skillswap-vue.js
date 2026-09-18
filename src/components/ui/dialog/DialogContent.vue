<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { X } from '@lucide/vue'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, type DialogContentProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class']; hideClose?: boolean }>()
const classes = computed(() =>
  cn(
    'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-card p-6 shadow-lg',
    'max-h-[85vh] overflow-y-auto',
    props.class,
  ),
)
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
    <DialogContent v-bind="props" :class="classes">
      <slot />
      <DialogClose
        v-if="!hideClose"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X class="size-4" />
        <span class="sr-only">Fermer</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
