<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, "L'email est requis.").email('Format d\'email invalide.'),
    password: z.string().min(1, 'Le mot de passe est requis.'),
  }),
)

const { defineField, handleSubmit, errors, setFieldError, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.login(values)
    toast.success(`Bon retour, ${auth.user?.name} !`)

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'catalog' }
    router.push(redirect)
  } catch (error) {
    if (error instanceof ApiError && error.errors) {
      setErrors(error.errors)
    } else if (error instanceof ApiError) {
      setFieldError('password', error.message)
    }
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Connexion</CardTitle>
      <CardDescription>Accédez à vos annonces et réservations SkillSwap.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" novalidate @submit="onSubmit">
        <FormField id="email" label="Email" :error="errors.email">
          <Input id="email" v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" :invalid="!!errors.email" />
        </FormField>

        <FormField id="password" label="Mot de passe" :error="errors.password">
          <Input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            autocomplete="current-password"
            :invalid="!!errors.password"
          />
        </FormField>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          <Spinner v-if="isSubmitting" />
          Se connecter
        </Button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        Pas encore de compte ?
        <RouterLink :to="{ name: 'register' }" class="font-medium text-primary hover:underline">
          Créer un compte
        </RouterLink>
      </p>
    </CardContent>
  </Card>
</template>
