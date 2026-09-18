import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import type { ApiErrorResponse, ValidationErrorResponse } from '@/types/api'

import { clearToken, getToken } from './token'

/**
 * Événement émis lorsqu'une requête échoue avec un 401 : le token est
 * périmé ou invalide. Écouté au niveau racine (voir App.vue) pour
 * déconnecter l'utilisateur et le rediriger, sans coupler ce module au
 * store Pinia ni au router.
 */
export const UNAUTHORIZED_EVENT = 'skillswap:unauthorized'

/** Erreur normalisée, quelle que soit la forme de la réponse API d'origine. */
export class ApiError extends Error {
  readonly status: number | null
  readonly errors: Record<string, string[]> | null

  constructor(message: string, status: number | null, errors: Record<string, string[]> | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  /** Premier message de validation pour un champ donné, s'il existe. */
  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0]
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new ApiError('Une erreur inattendue est survenue.', null))
    }

    const axiosError = error as AxiosError<ValidationErrorResponse | ApiErrorResponse>
    const status = axiosError.response?.status ?? null
    const body = axiosError.response?.data

    if (status === 401) {
      clearToken()
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }

    if (status === 422 && body && 'errors' in body) {
      return Promise.reject(new ApiError(body.message, status, body.errors))
    }

    const message = body?.message ?? axiosError.message ?? 'Une erreur inattendue est survenue.'

    return Promise.reject(new ApiError(message, status))
  },
)
