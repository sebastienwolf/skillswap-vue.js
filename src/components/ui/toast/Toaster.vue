<script setup lang="ts">
import { CheckCircle2, Info, X, XCircle } from '@lucide/vue'

import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
} as const
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
    >
      <TransitionGroup name="toast" tag="div" class="flex w-full max-w-sm flex-col gap-2">
        <div
          v-for="toast in store.toasts"
          :key="toast.id"
          role="status"
          :class="
            cn(
              'pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg',
              toast.variant === 'success' && 'border-success/40',
              toast.variant === 'destructive' && 'border-destructive/40',
            )
          "
        >
          <component
            :is="icons[toast.variant]"
            :class="
              cn(
                'mt-0.5 size-5 shrink-0',
                toast.variant === 'success' && 'text-success',
                toast.variant === 'destructive' && 'text-destructive',
                toast.variant === 'default' && 'text-foreground',
              )
            "
          />
          <div class="flex-1 space-y-1">
            <p class="text-sm font-medium">{{ toast.title }}</p>
            <p v-if="toast.description" class="text-sm text-muted-foreground">{{ toast.description }}</p>
          </div>
          <button
            type="button"
            class="text-muted-foreground transition-colors hover:text-foreground"
            @click="store.dismiss(toast.id)"
          >
            <X class="size-4" />
            <span class="sr-only">Fermer</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
