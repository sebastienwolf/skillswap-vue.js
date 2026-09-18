import { http } from '@/lib/http'
import type { PaginatedResponse, SingleResponse } from '@/types/api'
import type { CategoryType, ExchangeStatus, UserRole } from '@/types/enums'
import type { AdminDashboardStats, Category, Item, Skill, User } from '@/types/models'

export interface AdminExchangeableListParams {
  status?: ExchangeStatus
  page?: number
  per_page?: number
}

export interface AdminUserListParams {
  role?: UserRole
  page?: number
  per_page?: number
}

/** Reflète App\Http\Requests\Admin\StoreCategoryRequest / UpdateCategoryRequest. */
export interface CategoryPayload {
  name: string
  type: CategoryType
}

/** Reflète App\Http\Requests\Admin\UpdateUserRequest. */
export interface UpdateUserPayload {
  role?: UserRole
  is_active?: boolean
}

export const adminApi = {
  dashboard: {
    async summary() {
      const { data } = await http.get<{ data: AdminDashboardStats }>('/admin/dashboard')

      return data.data
    },
  },

  categories: {
    async list() {
      const { data } = await http.get<SingleResponse<Category[]>>('/admin/categories')

      return data.data
    },

    async create(payload: CategoryPayload) {
      const { data } = await http.post<SingleResponse<Category>>('/admin/categories', payload)

      return data.data
    },

    async update(id: number, payload: Partial<CategoryPayload>) {
      const { data } = await http.patch<SingleResponse<Category>>(`/admin/categories/${id}`, payload)

      return data.data
    },

    async remove(id: number) {
      await http.delete(`/admin/categories/${id}`)
    },
  },

  items: {
    async list(params: AdminExchangeableListParams = {}) {
      const { data } = await http.get<PaginatedResponse<Item>>('/admin/items', { params })

      return data
    },

    async archive(id: number) {
      const { data } = await http.post<SingleResponse<Item>>(`/admin/items/${id}/archive`)

      return data.data
    },

    async remove(id: number) {
      await http.delete(`/admin/items/${id}`)
    },
  },

  skills: {
    async list(params: AdminExchangeableListParams = {}) {
      const { data } = await http.get<PaginatedResponse<Skill>>('/admin/skills', { params })

      return data
    },

    async archive(id: number) {
      const { data } = await http.post<SingleResponse<Skill>>(`/admin/skills/${id}/archive`)

      return data.data
    },

    async remove(id: number) {
      await http.delete(`/admin/skills/${id}`)
    },
  },

  users: {
    async list(params: AdminUserListParams = {}) {
      const { data } = await http.get<PaginatedResponse<User>>('/admin/users', { params })

      return data
    },

    async get(id: number) {
      const { data } = await http.get<SingleResponse<User>>(`/admin/users/${id}`)

      return data.data
    },

    async update(id: number, payload: UpdateUserPayload) {
      const { data } = await http.patch<SingleResponse<User>>(`/admin/users/${id}`, payload)

      return data.data
    },

    async remove(id: number) {
      await http.delete(`/admin/users/${id}`)
    },
  },
}
