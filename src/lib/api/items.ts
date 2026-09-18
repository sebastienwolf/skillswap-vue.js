import type { ExchangeType } from '@/types/enums'
import type { Item } from '@/types/models'

import { createExchangeableApi } from './exchangeable'

/** Reflète App\Http\Requests\Items\StoreItemRequest. */
export interface CreateItemPayload {
  category_id: number
  title: string
  description: string
  type: ExchangeType
  quantity?: number
}

export type UpdateItemPayload = Partial<CreateItemPayload>

export const itemsApi = createExchangeableApi<Item, CreateItemPayload, UpdateItemPayload>('items')
