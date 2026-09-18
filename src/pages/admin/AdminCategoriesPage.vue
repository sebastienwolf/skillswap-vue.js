<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { FolderTree, Pencil, Plus, Trash2 } from '@lucide/vue'
import { z } from 'zod'

import FormField from '@/components/forms/FormField.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { adminApi, type CategoryPayload } from '@/lib/api/admin'
import { ApiError } from '@/lib/http'
import { useToastStore } from '@/stores/toast'
import { CategoryType } from '@/types/enums'
import type { Category } from '@/types/models'

const toast = useToastStore()
const categories = ref<Category[]>([])
const loading = ref(true)

const itemCategories = computed(() => categories.value.filter((category) => category.type === CategoryType.Item))
const skillCategories = computed(() => categories.value.filter((category) => category.type === CategoryType.Skill))

async function load() {
  loading.value = true

  try {
    categories.value = await adminApi.categories.list()
  } catch {
    toast.error('Impossible de charger les catégories.')
  } finally {
    loading.value = false
  }
}

onMounted(load)

// --- Formulaire (création + édition dans une même boîte de dialogue) ---

const dialogOpen = ref(false)
const editingCategory = ref<Category | null>(null)

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Le nom est requis.').max(255),
    type: z.enum(['item', 'skill'], { required_error: 'Le type est requis.' }),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors, setValues, resetForm } = useForm({
  validationSchema: schema,
})

const [name, nameAttrs] = defineField('name')
const [type] = defineField('type')

function openCreate() {
  editingCategory.value = null
  resetForm({ values: { name: '', type: 'item' } })
  dialogOpen.value = true
}

function openEdit(category: Category) {
  editingCategory.value = category
  setValues({ name: category.name, type: category.type })
  dialogOpen.value = true
}

const onSubmit = handleSubmit(async (values: CategoryPayload) => {
  try {
    if (editingCategory.value) {
      await adminApi.categories.update(editingCategory.value.id, values)
      toast.success('Catégorie mise à jour.')
    } else {
      await adminApi.categories.create(values)
      toast.success('Catégorie créée.')
    }
    dialogOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.errors) {
      setErrors(error.errors)
    } else {
      toast.error('Une erreur est survenue.')
    }
  }
})

// --- Suppression ---

const deleteTarget = ref<Category | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return

  deleting.value = true

  try {
    await adminApi.categories.remove(deleteTarget.value.id)
    toast.success('Catégorie supprimée.')
    deleteTarget.value = null
    await load()
  } catch (error) {
    toast.error('Suppression impossible', error instanceof ApiError ? error.message : undefined)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Catégories</h1>
        <p class="text-muted-foreground">Taxonomie partagée par les objets et les compétences.</p>
      </div>
      <Button @click="openCreate">
        <Plus />
        Nouvelle catégorie
      </Button>
    </div>

    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="n in 4" :key="n" class="h-14" />
    </div>

    <EmptyState v-else-if="categories.length === 0" :icon="FolderTree" title="Aucune catégorie" />

    <div v-else class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent class="p-4">
          <h2 class="mb-3 font-medium">Objets</h2>
          <ul class="divide-y divide-border">
            <li v-for="category in itemCategories" :key="category.id" class="flex items-center justify-between py-2">
              <span class="text-sm">{{ category.name }}</span>
              <div class="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Modifier" @click="openEdit(category)">
                  <Pencil class="size-4" />
                </Button>
                <Button size="icon" variant="ghost" class="text-destructive hover:text-destructive" aria-label="Supprimer" @click="deleteTarget = category">
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <h2 class="mb-3 font-medium">Compétences</h2>
          <ul class="divide-y divide-border">
            <li v-for="category in skillCategories" :key="category.id" class="flex items-center justify-between py-2">
              <span class="text-sm">{{ category.name }}</span>
              <div class="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Modifier" @click="openEdit(category)">
                  <Pencil class="size-4" />
                </Button>
                <Button size="icon" variant="ghost" class="text-destructive hover:text-destructive" aria-label="Supprimer" @click="deleteTarget = category">
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <!-- Création / édition -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</DialogTitle>
        </DialogHeader>

        <form class="space-y-4" novalidate @submit="onSubmit">
          <FormField id="cat-name" label="Nom" :error="errors.name">
            <Input id="cat-name" v-model="name" v-bind="nameAttrs" :invalid="!!errors.name" />
          </FormField>

          <FormField id="cat-type" label="Type" :error="errors.type">
            <Select v-model="type">
              <SelectTrigger id="cat-type" :invalid="!!errors.type">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item">Objet</SelectItem>
                <SelectItem value="skill">Compétence</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" @click="dialogOpen = false">Annuler</Button>
            <Button type="submit" :disabled="isSubmitting">
              <Spinner v-if="isSubmitting" />
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Suppression -->
    <Dialog :open="!!deleteTarget" @update:open="(value) => !value && (deleteTarget = null)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer « {{ deleteTarget?.name }} » ?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteTarget = null">Annuler</Button>
          <Button variant="destructive" :disabled="deleting" @click="confirmDelete">
            <Spinner v-if="deleting" />
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
