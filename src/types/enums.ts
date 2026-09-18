/**
 * Enums partagés avec le back-end (app/Enums/*.php).
 * Les valeurs (string) doivent rester strictement identiques à celles
 * exposées par l'API — ce sont elles qui transitent dans le JSON.
 */

export const UserRole = {
  Member: 'member',
  Admin: 'admin',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const CategoryType = {
  Item: 'item',
  Skill: 'skill',
} as const
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType]

export const ExchangeType = {
  Offer: 'offer',
  Need: 'need',
} as const
export type ExchangeType = (typeof ExchangeType)[keyof typeof ExchangeType]

export const ExchangeStatus = {
  Published: 'published',
  Reserved: 'reserved',
  Completed: 'completed',
  Archived: 'archived',
} as const
export type ExchangeStatus = (typeof ExchangeStatus)[keyof typeof ExchangeStatus]

export const SkillLevel = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Expert: 'expert',
} as const
export type SkillLevel = (typeof SkillLevel)[keyof typeof SkillLevel]

export const ReservationStatus = {
  Pending: 'pending',
  Accepted: 'accepted',
  Declined: 'declined',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]

/** Type de ressource réservable, tel qu'attendu par POST /reservations. */
export const ReservableType = {
  Item: 'item',
  Skill: 'skill',
} as const
export type ReservableType = (typeof ReservableType)[keyof typeof ReservableType]

export const exchangeTypeLabels: Record<ExchangeType, string> = {
  offer: 'Offre',
  need: 'Recherche',
}

export const exchangeStatusLabels: Record<ExchangeStatus, string> = {
  published: 'Publiée',
  reserved: 'Réservée',
  completed: 'Terminée',
  archived: 'Archivée',
}

export const skillLevelLabels: Record<SkillLevel, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  declined: 'Refusée',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

export const userRoleLabels: Record<UserRole, string> = {
  member: 'Membre',
  admin: 'Administrateur',
}
