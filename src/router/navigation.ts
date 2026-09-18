import { CalendarClock, Compass, Package, UserRound } from '@lucide/vue'
import type { Component } from 'vue'

/**
 * Source unique pour les entrées de navigation principale (membre), utilisée
 * à la fois par la bottom tab bar mobile et la barre desktop, pour éviter
 * que les deux se désynchronisent au fil des évolutions.
 */
export interface NavItem {
  label: string
  to: { name: string }
  icon: Component
  /** Route nécessitant une session active (voir router/guards). */
  requiresAuth?: boolean
}

export const primaryNavItems: NavItem[] = [
  { label: 'Découvrir', to: { name: 'catalog' }, icon: Compass },
  { label: 'Mes annonces', to: { name: 'my-listings' }, icon: Package, requiresAuth: true },
  { label: 'Réservations', to: { name: 'reservations' }, icon: CalendarClock, requiresAuth: true },
  { label: 'Profil', to: { name: 'profile' }, icon: UserRound, requiresAuth: true },
]
