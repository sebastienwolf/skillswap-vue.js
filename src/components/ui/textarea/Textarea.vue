<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  id?: string
  rows?: number
  invalid?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const classes = computed(() =>
  cn(
    'flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    props.invalid && 'border-destructive focus-visible:ring-destructive',
    props.class,
  ),
)
</script>

<template>
  <textarea
    :id="id"
    :rows="rows ?? 4"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue ?? ''"
    :class="classes"
    :aria-invalid="invalid || undefined"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
