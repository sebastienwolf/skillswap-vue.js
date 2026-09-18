<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

import FormField from '@/components/forms/FormField.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ApiError } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const schema = toTypedSchema(
  z
    .object({
      name: z.string().min(1, 'Le nom est requis.').max(255),
      email: z.string().min(1, "L'email est requis.").email("Format d'email invalide."),
      password: z
        .string()
        .min(8, 'Au moins 8 caractères.')
        .regex(/[a-zA-Z]/, 'Doit contenir au moins une lettre.')
        .regex(/[0-9]/, 'Doit contenir au moins un chiffre.'),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: 'Les mots de passe ne correspondent pas.',
      path: ['password_confirmation'],
    }),
)

const { defineField, handleSubmit, errors, setFieldError, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.register(values)
    toast.success('Bienvenue sur SkillSwap !')
    router.push({ name: 'catalog' })
  } catch (error) {
    if (error instanceof ApiError && error.errors) {
      setErrors(error.errors)
    } else if (error instanceof ApiError) {
      setFieldError('email', error.message)
    }
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Créer un compte</CardTitle>
      <CardDescription>Rejoignez la communauté d'échange SkillSwap.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" novalidate @submit="onSubmit">
        <FormField id="name" label="Nom" :error="errors.name">
          <Input id="name" v-model="name" v-bind="nameAttrs" autocomplete="name" :invalid="!!errors.name" />
        </FormField>

        <FormField id="email" label="Email" :error="errors.email">
          <Input id="email" v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" :invalid="!!errors.email" />
        </FormField>

        <FormField id="password" label="Mot de passe" :error="errors.password">
          <Input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            autocomplete="new-password"
            :invalid="!!errors.password"
          />
        </FormField>

        <FormField id="password_confirmation" label="Confirmer le mot de passe" :error="errors.password_confirmation">
          <Input
            id="password_confirmation"
            v-model="passwordConfirmation"
            v-bind="passwordConfirmationAttrs"
            type="password"
            autocomplete="new-password"
            :invalid="!!errors.password_confirmation"
          />
        </FormField>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          <Spinner v-if="isSubmitting" />
          Créer mon compte
        </Button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        Déjà inscrit ?
        <RouterLink :to="{ name: 'login' }" class="font-medium text-primary hover:underline">Se connecter</RouterLink>
      </p>
    </CardContent>
  </Card>
</template>
