import type { ExchangeType, SkillLevel } from '@/types/enums'
import type { Skill } from '@/types/models'

import { createExchangeableApi } from './exchangeable'

/** Reflète App\Http\Requests\Skills\StoreSkillRequest. */
export interface CreateSkillPayload {
  category_id: number
  title: string
  description: string
  type: ExchangeType
  level?: SkillLevel
}

export type UpdateSkillPayload = Partial<CreateSkillPayload>

export const skillsApi = createExchangeableApi<Skill, CreateSkillPayload, UpdateSkillPayload>('skills')
