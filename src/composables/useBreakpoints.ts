import { useMediaQuery } from '@vueuse/core'

/**
 * Point de bascule unique entre la navigation mobile (bottom tab bar) et
 * la navigation desktop (sidebar). Aligné sur le breakpoint `md` de
 * Tailwind (768px) pour rester cohérent avec les classes `md:*` utilisées
 * dans les composants de layout.
 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)')
}
