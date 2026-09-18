import { http } from '@/lib/http'
import type { PaginatedResponse, SingleResponse } from '@/types/api'
import type { ExchangeType } from '@/types/enums'

/** Filtres de listing communs à /items et /skills (App\Filters\ExchangeableFilters). */
export interface ExchangeableListParams {
  q?: string
  /** Ne renvoie que les annonces du membre connecté (y compris non publiées). */
  mine?: boolean
  type?: ExchangeType
  category_id?: number
  page?: number
  per_page?: number
}

/**
 * Fabrique un client CRUD pour une ressource "échangeable" (Item ou Skill) :
 * les deux partagent exactement le même contrat côté API
 * (App\Contracts\Exchangeable), donc le même client côté front plutôt que
 * de dupliquer deux fois le même code (principe DRY).
 */
export function createExchangeableApi<TResource, TCreatePayload, TUpdatePayload = Partial<TCreatePayload>>(
  resource: 'items' | 'skills',
) {
  return {
    async list(params: ExchangeableListParams = {}) {
      // `mine: true` passe par la route authentifiée dédiée (/me/items,
      // /me/skills) plutôt que par le catalogue public : l'authentification
      // y est garantie par le middleware `auth:sanctum` côté API, au lieu de
      // dépendre d'une résolution d'utilisateur optionnelle sur une route
      // publique (voir routes/api.php côté back).
      const endpoint = params.mine ? `/me/${resource}` : `/${resource}`
      const { data } = await http.get<PaginatedResponse<TResource>>(endpoint, { params })

      return data
    },

    async get(id: number) {
      const { data } = await http.get<SingleResponse<TResource>>(`/${resource}/${id}`)

      return data.data
    },

    async create(payload: TCreatePayload) {
      const { data } = await http.post<SingleResponse<TResource>>(`/${resource}`, payload)

      return data.data
    },

    async update(id: number, payload: TUpdatePayload) {
      const { data } = await http.patch<SingleResponse<TResource>>(`/${resource}/${id}`, payload)

      return data.data
    },

    async remove(id: number) {
      await http.delete(`/${resource}/${id}`)
    },

    async publish(id: number) {
      const { data } = await http.post<SingleResponse<TResource>>(`/${resource}/${id}/publish`)

      return data.data
    },

    async archive(id: number) {
      const { data } = await http.post<SingleResponse<TResource>>(`/${resource}/${id}/archive`)

      return data.data
    },
  }
}
