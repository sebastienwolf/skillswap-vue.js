<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Archive, Pencil, Send, Trash2 } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { ApiError } from '@/lib/http'
import { useToastStore } from '@/stores/toast'
import type { ExchangeStatus } from '@/types/enums'

/**
 * Barre d'actions du propriétaire sur sa propre annonce (Item ou Skill) :
 * publier/archiver/supprimer partagent la même mécanique côté API
 * (App\Contracts\Exchangeable), d'où un composant unique piloté par les
 * callbacks fournis plutôt qu'un doublon par type de ressource.
 */
const props = defineProps<{
  status: ExchangeStatus
  editTo: { name: string; params: Record<string, string | number> }
  onPublish: () => Promise<unknown>
  onArchive: () => Promise<unknown>
  onDelete: () => Promise<unknown>
}>()

const emit = defineEmits<{ changed: [] }>()

const toast = useToastStore()
const router = useRouter()
const actionLoading = ref<'publish' | 'archive' | 'delete' | null>(null)
const confirmDelete = ref(false)

async function run(action: 'publish' | 'archive' | 'delete') {
  actionLoading.value = action

  try {
    if (action === 'publish') {
      await props.onPublish()
      toast.success('Annonce publiée.')
    } else if (action === 'archive') {
      await props.onArchive()
      toast.success('Annonce archivée.')
    } else {
      await props.onDelete()
      toast.success('Annonce supprimée.')
      router.push({ name: 'my-listings' })

      return
    }

    emit('changed')
  } catch (error) {
    toast.error('Action impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    actionLoading.value = null
    confirmDelete.value = false
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" as-child>
      <RouterLink :to="editTo">
        <Pencil />
        Modifier
      </RouterLink>
    </Button>

    <Button v-if="status === 'archived'" variant="outline" :disabled="!!actionLoading" @click="run('publish')">
      <Spinner v-if="actionLoading === 'publish'" />
      <Send v-else />
      Publier
    </Button>

    <Button v-if="status === 'published'" variant="outline" :disabled="!!actionLoading" @click="run('archive')">
      <Spinner v-if="actionLoading === 'archive'" />
      <Archive v-else />
      Archiver
    </Button>

    <Button variant="outline" class="text-destructive hover:text-destructive" @click="confirmDelete = true">
      <Trash2 />
      Supprimer
    </Button>

    <Dialog v-model:open="confirmDelete">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer cette annonce ?</DialogTitle>
          <DialogDescription>Cette action est définitive et ne peut pas être annulée.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="confirmDelete = false">Annuler</Button>
          <Button variant="destructive" :disabled="!!actionLoading" @click="run('delete')">
            <Spinner v-if="actionLoading === 'delete'" />
            Supprimer définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
