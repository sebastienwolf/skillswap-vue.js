import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes Tailwind en résolvant les conflits (ex: "p-2" +
 * "p-4" -> "p-4"). Utilisé par tous les composants `ui/*` pour permettre
 * la surcharge de style via une prop `class`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Formate une date ISO en date courte lisible (fr-FR). */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

/** Formate une date ISO avec l'heure (fr-FR). */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

/** Initiales d'un nom pour un avatar de repli (ex: "Jean Dupont" -> "JD"). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
