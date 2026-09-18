import { reactive, ref, watch } from 'vue'

import type { ExchangeableListParams } from '@/lib/api/exchangeable'
import { ApiError } from '@/lib/http'
import type { PaginatedResponse } from '@/types/api'

interface ExchangeableListApi<T> {
  list: (params: ExchangeableListParams) => Promise<PaginatedResponse<T>>
}

/**
 * Logique de listing/filtrage partagée par le catalogue d'Items et celui
 * de Skills (mêmes filtres, même pagination côté API) : évite de dupliquer
 * cette mécanique dans chaque page (principe DRY).
 */
export function useExchangeableList<T>(api: ExchangeableListApi<T>, initialParams: ExchangeableListParams = {}) {
  const filters = reactive<ExchangeableListParams>({ page: 1, per_page: 12, ...initialParams })
  const results = ref<T[]>([])
  const meta = ref<PaginatedResponse<T>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null

    try {
      const response = await api.list(filters)
      results.value = response.data
      meta.value = response.meta
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Impossible de charger les annonces.'
    } finally {
      loading.value = false
    }
  }

  function setFilter<K extends keyof ExchangeableListParams>(key: K, value: ExchangeableListParams[K]) {
    filters[key] = value
    filters.page = 1
  }

  function goToPage(page: number) {
    filters.page = page
  }

  watch(
    () => ({ ...filters }),
    () => {
      void fetch()
    },
    { deep: true, immediate: true },
  )

  return { filters, results, meta, loading, error, setFilter, goToPage, refresh: fetch }
}
