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
import { skillsApi } from '@/lib/api/skills'
import { ApiError } from '@/lib/http'
import { useCategoriesStore } from '@/stores/categories'
import { useToastStore } from '@/stores/toast'
import { exchangeTypeLabels, skillLevelLabels } from '@/types/enums'

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
    level: z.enum(['beginner', 'intermediate', 'expert'], { required_error: 'Le niveau est requis.' }),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors, setValues } = useForm({
  validationSchema: schema,
  initialValues: { level: 'beginner' },
})

const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [categoryId] = defineField('category_id')
const [type] = defineField('type')
const [level] = defineField('level')

onMounted(async () => {
  await categoriesStore.ensureLoaded()

  if (props.id !== undefined) {
    try {
      const skill = await skillsApi.get(props.id)
      setValues({
        title: skill.title,
        description: skill.description,
        category_id: skill.category.id,
        type: skill.type,
        level: skill.level,
      })
    } catch {
      toast.error('Impossible de charger cette compétence.')
      router.push({ name: 'my-listings' })
    } finally {
      loadingResource.value = false
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (props.id !== undefined) {
      await skillsApi.update(props.id, values)
      toast.success('Compétence mise à jour.')
      router.push({ name: 'skill-detail', params: { id: props.id } })
    } else {
      const created = await skillsApi.create(values)
      toast.success('Compétence publiée.')
      router.push({ name: 'skill-detail', params: { id: created.id } })
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
        <CardTitle>{{ isEditing ? 'Modifier la compétence' : 'Publier une compétence' }}</CardTitle>
        <CardDescription>Décrivez la compétence que vous proposez ou recherchez.</CardDescription>
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
                <SelectItem v-for="category in categoriesStore.skills" :key="category.id" :value="String(category.id)">
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="level" label="Niveau" :error="errors.level">
            <Select v-model="level">
              <SelectTrigger id="level" :invalid="!!errors.level">
                <SelectValue placeholder="Choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{{ skillLevelLabels.beginner }}</SelectItem>
                <SelectItem value="intermediate">{{ skillLevelLabels.intermediate }}</SelectItem>
                <SelectItem value="expert">{{ skillLevelLabels.expert }}</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="title" label="Titre" :error="errors.title">
            <Input id="title" v-model="title" v-bind="titleAttrs" :invalid="!!errors.title" />
          </FormField>

          <FormField id="description" label="Description" :error="errors.description">
            <Textarea id="description" v-model="description" v-bind="descriptionAttrs" :rows="5" :invalid="!!errors.description" />
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
