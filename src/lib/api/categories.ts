import { http } from '@/lib/http'
import type { SingleResponse } from '@/types/api'
import type { CategoryType } from '@/types/enums'
import type { Category } from '@/types/models'

export interface CategoryListParams {
  type?: CategoryType
}

export const categoriesApi = {
  async list(params: CategoryListParams = {}) {
    const { data } = await http.get<SingleResponse<Category[]>>('/categories', { params })

    return data.data
  },

  async get(id: number) {
    const { data } = await http.get<SingleResponse<Category>>(`/categories/${id}`)

    return data.data
  },
}
