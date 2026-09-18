import type { NavigationGuardWithThis } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

/**
 * Garde global : restaure la session (une seule fois), puis applique les
 * règles d'accès portées par `meta` (voir router/index.ts).
 */
export const authGuard: NavigationGuardWithThis<undefined> = async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.ensureInitialized()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'catalog' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    useToastStore().error('Accès refusé', "Cette section est réservée aux administrateurs.")

    return { name: 'catalog' }
  }

  return true
}
