/** Enveloppe d'une collection paginée par Laravel (paginate()). */
export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

/** Enveloppe d'une ressource unique (JsonResource). */
export interface SingleResponse<T> {
  data: T
}

/** Corps d'une erreur 422 (Illuminate\Validation\ValidationException). */
export interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

/** Corps générique d'une erreur (401/403/404/500...). */
export interface ApiErrorResponse {
  message: string
}
