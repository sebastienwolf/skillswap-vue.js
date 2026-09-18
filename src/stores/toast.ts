import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastVariant = 'default' | 'success' | 'destructive'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

let nextId = 0

/** File de notifications globales, consommée par components/ui/Toaster.vue. */
export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function push(title: string, options: { description?: string; variant?: ToastVariant } = {}) {
    const id = nextId++
    toasts.value.push({ id, title, description: options.description, variant: options.variant ?? 'default' })

    window.setTimeout(() => dismiss(id), 5000)
  }

  function success(title: string, description?: string) {
    push(title, { description, variant: 'success' })
  }

  function error(title: string, description?: string) {
    push(title, { description, variant: 'destructive' })
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return { toasts, push, success, error, dismiss }
})
