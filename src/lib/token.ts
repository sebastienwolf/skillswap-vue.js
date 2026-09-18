/**
 * Persistance du jeton Sanctum (Bearer). Isolé dans son propre module pour
 * que `lib/http.ts` puisse le lire sans dépendre du store Pinia (qui,
 * inversement, dépend du client HTTP) — évite toute dépendance circulaire.
 */
const STORAGE_KEY = 'skillswap.token'

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY)
}
