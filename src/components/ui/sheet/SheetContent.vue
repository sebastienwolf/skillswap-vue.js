<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { X } from '@lucide/vue'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, type DialogContentProps } from 'reka-ui'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes['class']
      side?: 'top' | 'bottom' | 'left' | 'right'
    }
  >(),
  { side: 'bottom' },
)

const sideClasses: Record<NonNullable<typeof props.side>, string> = {
  bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t',
  top: 'inset-x-0 top-0 max-h-[85vh] rounded-b-2xl border-b',
  left: 'inset-y-0 left-0 h-full w-[85vw] max-w-sm border-r',
  right: 'inset-y-0 right-0 h-full w-[85vw] max-w-sm border-l',
}

const classes = computed(() =>
  cn(
    'fixed z-50 flex flex-col gap-4 border-border bg-card p-6 shadow-lg overflow-y-auto',
    sideClasses[props.side],
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
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <X class="size-4" />
        <span class="sr-only">Fermer</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
