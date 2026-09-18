import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authApi, type LoginPayload, type RegisterPayload } from '@/lib/api/auth'
import { ApiError } from '@/lib/http'
import { clearToken, getToken, setToken } from '@/lib/token'
import type { User } from '@/types/models'

/** Nom d'appareil envoyé à Sanctum pour identifier le jeton créé. */
function currentDeviceName(): string {
  return `web-${navigator.userAgent.slice(0, 40)}`
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  /** Distingue "pas encore vérifié" de "vérifié, personne connectée" au démarrage. */
  const initialized = ref(false)
  const loading = ref(false)
  /** Mémoïse l'appel initial : plusieurs navigations concurrentes avant la
   *  première résolution ne doivent déclencher qu'une seule requête /auth/me. */
  let initPromise: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(payload: Omit<LoginPayload, 'device_name'>) {
    loading.value = true

    try {
      const { data, token } = await authApi.login({ ...payload, device_name: currentDeviceName() })
      setToken(token)
      user.value = data
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true

    try {
      const { data, token } = await authApi.register(payload)
      setToken(token)
      user.value = data
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Le jeton est peut-être déjà invalide côté serveur : on nettoie
      // l'état local dans tous les cas.
    } finally {
      clearToken()
      user.value = null
    }
  }

  /** À appeler une fois au démarrage de l'app pour restaurer la session. */
  async function fetchCurrentUser() {
    if (!getToken()) {
      initialized.value = true

      return
    }

    loading.value = true

    try {
      user.value = await authApi.me()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken()
      }
      user.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  /** Déconnexion locale immédiate, déclenchée sur un 401 global (voir lib/http.ts). */
  function forceLogout() {
    clearToken()
    user.value = null
  }

  /** Point d'entrée utilisé par le garde de routes (voir router/guards.ts). */
  function ensureInitialized() {
    initPromise ??= fetchCurrentUser()

    return initPromise
  }

  return {
    user,
    initialized,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser,
    forceLogout,
    ensureInitialized,
  }
})
