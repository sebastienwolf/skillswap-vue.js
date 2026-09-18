import { http } from '@/lib/http'
import type { SingleResponse } from '@/types/api'
import type { User } from '@/types/models'

export interface LoginPayload {
  email: string
  password: string
  device_name: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

/** Réponse commune à /auth/register et /auth/login : la ressource + le token. */
type AuthResponse = SingleResponse<User> & { token: string }

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await http.post<AuthResponse>('/auth/register', payload)

    return data
  },

  async login(payload: LoginPayload) {
    const { data } = await http.post<AuthResponse>('/auth/login', payload)

    return data
  },

  async logout() {
    await http.post('/auth/logout')
  },

  async me() {
    const { data } = await http.get<SingleResponse<User>>('/auth/me')

    return data.data
  },
}
