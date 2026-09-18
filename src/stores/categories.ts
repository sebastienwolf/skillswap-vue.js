import { ref } from 'vue'
import { defineStore } from 'pinia'

import { categoriesApi } from '@/lib/api/categories'
import type { Category } from '@/types/models'

/**
 * Les catégories changent rarement et sont utilisées par de nombreux
 * écrans (filtres du catalogue, formulaires de création) : on les
 * charge une fois et on les partage plutôt que de refaire l'appel
 * réseau à chaque montage de composant.
 */
export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<Category[]>([])
  const skills = ref<Category[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  async function ensureLoaded() {
    if (loaded.value || loading.value) return

    loading.value = true

    try {
      const [itemCategories, skillCategories] = await Promise.all([
        categoriesApi.list({ type: 'item' }),
        categoriesApi.list({ type: 'skill' }),
      ])

      items.value = itemCategories
      skills.value = skillCategories
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    loaded.value = false
    await ensureLoaded()
  }

  return { items, skills, loaded, loading, ensureLoaded, refresh }
})
