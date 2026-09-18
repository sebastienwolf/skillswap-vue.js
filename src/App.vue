<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Toaster } from '@/components/ui/toast'
import { UNAUTHORIZED_EVENT } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToastStore()

/**
 * Un 401 renvoyé par n'importe quel appel API signifie que le jeton n'est
 * plus valide : on nettoie la session et on renvoie vers la connexion,
 * quel que soit l'écran affiché au moment de l'erreur.
 */
function handleUnauthorized() {
  if (!auth.isAuthenticated) return

  auth.forceLogout()
  toast.error('Session expirée', 'Merci de vous reconnecter.')
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}

onMounted(() => window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized))
onBeforeUnmount(() => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized))
</script>

<template>
  <RouterView />
  <Toaster />
</template>
