export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

export interface CSGOFloatApiResponse {
  success: boolean
  data: CSGOFloatItem[]
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

export interface CSGOFloatItem {
  id: string
  market_hash_name: string
  currency: string
  suggested_price: number
  preview: string
  min_price: number
  max_price: number
  mean_price: number
  quantity: number
  created_at: string
  updated_at: string
}

export interface PriceApiResponse {
  item_name: string
  price: number
  currency: string
  timestamp: number
  source: 'csgofloat' | 'steam' | 'bitskins'
}

export interface UpgradeApiRequest {
  inputItemId: string
  multiplier: number
  targetRarity?: ItemRarity
}

export interface UpgradeApiResponse extends ApiResponse<UpgradeResult> {
  session: UpgradeSession
}

export interface InventoryApiResponse extends ApiResponse<CSGOItem[]> {
  totalValue: number
  itemCount: number
}