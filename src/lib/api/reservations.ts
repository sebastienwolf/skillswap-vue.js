import { http } from '@/lib/http'
import type { PaginatedResponse, SingleResponse } from '@/types/api'
import type { ReservableType } from '@/types/enums'
import type { Reservation } from '@/types/models'

export interface ReservationListParams {
  /** "received" = réservations reçues sur mes annonces ; par défaut, mes propres demandes. */
  scope?: 'mine' | 'received'
  page?: number
  per_page?: number
}

/** Reflète App\Http\Requests\Reservations\StoreReservationRequest. */
export interface CreateReservationPayload {
  reservable_type: ReservableType
  reservable_id: number
  message?: string
}

export const reservationsApi = {
  async list(params: ReservationListParams = {}) {
    // Le back-end n'utilise `scope` que pour la valeur "received" ; on omet
    // le paramètre plutôt que d'envoyer "mine" (non reconnu côté API).
    const { scope, ...rest } = params
    const query = scope === 'received' ? { scope, ...rest } : rest

    const { data } = await http.get<PaginatedResponse<Reservation>>('/reservations', { params: query })

    return data
  },

  async get(id: number) {
    const { data } = await http.get<SingleResponse<Reservation>>(`/reservations/${id}`)

    return data.data
  },

  async create(payload: CreateReservationPayload) {
    const { data } = await http.post<SingleResponse<Reservation>>('/reservations', payload)

    return data.data
  },

  async accept(id: number) {
    const { data } = await http.post<SingleResponse<Reservation>>(`/reservations/${id}/accept`)

    return data.data
  },

  async decline(id: number) {
    const { data } = await http.post<SingleResponse<Reservation>>(`/reservations/${id}/decline`)

    return data.data
  },

  async cancel(id: number) {
    const { data } = await http.post<SingleResponse<Reservation>>(`/reservations/${id}/cancel`)

    return data.data
  },

  async complete(id: number) {
    const { data } = await http.post<SingleResponse<Reservation>>(`/reservations/${id}/complete`)

    return data.data
  },
}
