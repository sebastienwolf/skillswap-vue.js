<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

import FormField from '@/components/forms/FormField.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { itemsApi } from '@/lib/api/items'
import { ApiError } from '@/lib/http'
import { useCategoriesStore } from '@/stores/categories'
import { useToastStore } from '@/stores/toast'
import { exchangeTypeLabels } from '@/types/enums'

const props = defineProps<{ id?: number }>()

const router = useRouter()
const toast = useToastStore()
const categoriesStore = useCategoriesStore()
const isEditing = computed(() => props.id !== undefined)
const loadingResource = ref(isEditing.value)

const schema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Le titre est requis.').max(255),
    description: z.string().min(1, 'La description est requise.').max(5000),
    category_id: z.coerce.number().positive('La catégorie est requise.'),
    type: z.enum(['offer', 'need'], { required_error: 'Le type est requis.' }),
    quantity: z.coerce.number().int().min(1).max(1000),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors, setValues } = useForm({
  validationSchema: schema,
  initialValues: { quantity: 1 },
})

const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [categoryId] = defineField('category_id')
const [type] = defineField('type')
const [quantity, quantityAttrs] = defineField('quantity')

onMounted(async () => {
  await categoriesStore.ensureLoaded()

  if (props.id !== undefined) {
    try {
      const item = await itemsApi.get(props.id)
      setValues({
        title: item.title,
        description: item.description,
        category_id: item.category.id,
        type: item.type,
        quantity: item.quantity,
      })
    } catch {
      toast.error('Impossible de charger cet objet.')
      router.push({ name: 'my-listings' })
    } finally {
      loadingResource.value = false
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (props.id !== undefined) {
      await itemsApi.update(props.id, values)
      toast.success('Objet mis à jour.')
      router.push({ name: 'item-detail', params: { id: props.id } })
    } else {
      const created = await itemsApi.create(values)
      toast.success('Objet publié.')
      router.push({ name: 'item-detail', params: { id: created.id } })
    }
  } catch (error) {
    if (error instanceof ApiError && error.errors) {
      setErrors(error.errors)
    } else {
      toast.error('Une erreur est survenue.')
    }
  }
})
</script>

<template>
  <div class="mx-auto max-w-xl">
    <Card>
      <CardHeader>
        <CardTitle>{{ isEditing ? "Modifier l'objet" : 'Publier un objet' }}</CardTitle>
        <CardDescription>Décrivez ce que vous proposez ou recherchez.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loadingResource" class="space-y-4">
          <Skeleton class="h-10" />
          <Skeleton class="h-24" />
        </div>

        <form v-else class="space-y-4" novalidate @submit="onSubmit">
          <FormField id="type" label="Je propose ou je recherche ?" :error="errors.type">
            <Select v-model="type">
              <SelectTrigger id="type" :invalid="!!errors.type">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offer">{{ exchangeTypeLabels.offer }}</SelectItem>
                <SelectItem value="need">{{ exchangeTypeLabels.need }}</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="category_id" label="Catégorie" :error="errors.category_id">
            <Select :model-value="categoryId ? String(categoryId) : undefined" @update:model-value="categoryId = Number($event)">
              <SelectTrigger id="category_id" :invalid="!!errors.category_id">
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="category in categoriesStore.items" :key="category.id" :value="String(category.id)">
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="title" label="Titre" :error="errors.title">
            <Input id="title" v-model="title" v-bind="titleAttrs" :invalid="!!errors.title" />
          </FormField>

          <FormField id="description" label="Description" :error="errors.description">
            <Textarea id="description" v-model="description" v-bind="descriptionAttrs" :rows="5" :invalid="!!errors.description" />
          </FormField>

          <FormField id="quantity" label="Quantité disponible" :error="errors.quantity">
            <Input id="quantity" v-model="quantity" v-bind="quantityAttrs" type="number" min="1" max="1000" :invalid="!!errors.quantity" />
          </FormField>

          <div class="flex gap-2">
            <Button type="submit" :disabled="isSubmitting">
              <Spinner v-if="isSubmitting" />
              {{ isEditing ? 'Enregistrer' : 'Publier' }}
            </Button>
            <Button type="button" variant="outline" @click="router.back()">Annuler</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
