<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { reservationsApi } from '@/lib/api/reservations'
import { ApiError } from '@/lib/http'
import { useToastStore } from '@/stores/toast'
import type { ReservableType } from '@/types/enums'

const props = defineProps<{
  reservableType: ReservableType
  reservableId: number
  resourceTitle: string
}>()

const emit = defineEmits<{ reserved: [] }>()

const toast = useToastStore()
const open = ref(false)
const message = ref('')
const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function submit() {
  submitting.value = true
  errorMessage.value = null

  try {
    await reservationsApi.create({
      reservable_type: props.reservableType,
      reservable_id: props.reservableId,
      message: message.value || undefined,
    })

    toast.success('Demande de réservation envoyée !')
    open.value = false
    message.value = ''
    emit('reserved')
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Une erreur est survenue.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button size="lg" class="w-full sm:w-auto">Réserver</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Réserver « {{ resourceTitle }} »</DialogTitle>
        <DialogDescription>
          Un message court aide le propriétaire à répondre rapidement à votre demande.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-1.5">
        <Label for="reservation-message">Message (optionnel)</Label>
        <Textarea
          id="reservation-message"
          v-model="message"
          placeholder="Bonjour, je suis intéressé(e) par..."
          :rows="4"
        />
      </div>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <DialogFooter>
        <Button variant="outline" @click="open = false">Annuler</Button>
        <Button :disabled="submitting" @click="submit">
          <Spinner v-if="submitting" />
          Envoyer la demande
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
