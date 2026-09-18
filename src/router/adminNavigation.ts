import { FolderTree, LayoutDashboard, Package, ShieldCheck, Sparkles, Users } from '@lucide/vue'
import type { Component } from 'vue'

export interface AdminNavItem {
  label: string
  to: { name: string }
  icon: Component
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Tableau de bord', to: { name: 'admin-dashboard' }, icon: LayoutDashboard },
  { label: 'Catégories', to: { name: 'admin-categories' }, icon: FolderTree },
  { label: 'Utilisateurs', to: { name: 'admin-users' }, icon: Users },
  { label: 'Objets', to: { name: 'admin-items' }, icon: Package },
  { label: 'Compétences', to: { name: 'admin-skills' }, icon: Sparkles },
]

export const adminBrand = { icon: ShieldCheck }
