import type {
  CategoryType,
  ExchangeStatus,
  ExchangeType,
  ReservationStatus,
  SkillLevel,
  UserRole,
} from './enums'

/** Reflète App\Http\Resources\UserResource. */
export interface User {
  id: number
  name: string
  /** Absent si l'utilisateur courant n'est ni l'intéressé, ni admin. */
  email?: string
  /** Absent pour un membre consultant un autre profil que le sien. */
  role?: UserRole
  is_active?: boolean
  member_since: string
}

/** Reflète App\Http\Resources\CategoryResource. */
export interface Category {
  id: number
  name: string
  slug: string
  type: CategoryType
}

/** Reflète App\Http\Resources\ItemResource. */
export interface Item {
  id: number
  title: string
  description: string
  type: ExchangeType
  status: ExchangeStatus
  quantity: number
  category: Category
  owner: User
  created_at: string
}

/** Reflète App\Http\Resources\SkillResource. */
export interface Skill {
  id: number
  title: string
  description: string
  type: ExchangeType
  status: ExchangeStatus
  level: SkillLevel
  category: Category
  owner: User
  created_at: string
}

/** Union pratique pour les vues qui affichent indifféremment un Item ou un Skill. */
export type Exchangeable = (Item & { kind: 'item' }) | (Skill & { kind: 'skill' })

/** Reflète App\Http\Resources\ReservationResource. */
export interface Reservation {
  id: number
  status: ReservationStatus
  message: string | null
  scheduled_at: string | null
  requester: User
  reservable_type: 'item' | 'skill'
  reservable: Item | Skill
  created_at: string
}

/** Compte des annonces par statut (App\Enums\ExchangeStatus). */
export interface ExchangeableStatusCounts {
  published: number
  reserved: number
  completed: number
  archived: number
}

/** Reflète App\Services\ExchangeStatsService::summary() côté admin. */
export interface AdminDashboardStats {
  users: {
    total: number
    active: number
  }
  items: ExchangeableStatusCounts
  skills: ExchangeableStatusCounts
  reservations: {
    pending: number
    accepted: number
    completed: number
  }
  top_categories: Array<{
    id: number
    name: string
    items_count: number
    skills_count: number
  }>
}
