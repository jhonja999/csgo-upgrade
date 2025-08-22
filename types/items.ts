export interface CSGOItem {
  id: string
  name: string
  marketName: string
  price: number
  imageUrl: string
  rarity: ItemRarity
  type: ItemType
  wear?: WearLevel
  float?: number
  stickers?: Sticker[]
  exterior?: string
  category: string
  collection?: string
  souvenir?: boolean
  statTrak?: boolean
}

export interface Sticker {
  name: string
  imageUrl: string
  price?: number
}

export type ItemRarity = 
  | 'consumer'
  | 'industrial'
  | 'milspec'
  | 'restricted'
  | 'classified'
  | 'covert'
  | 'contraband'

export type ItemType =
  | 'rifle'
  | 'pistol'
  | 'sniper'
  | 'shotgun'
  | 'smg'
  | 'machinegun'
  | 'knife'
  | 'gloves'
  | 'sticker'
  | 'music_kit'
  | 'case'
  | 'key'

export type WearLevel =
  | 'Factory New'
  | 'Minimal Wear'
  | 'Field-Tested'
  | 'Well-Worn'
  | 'Battle-Scarred'

export interface PriceHistory {
  timestamp: number
  price: number
}

export interface ItemProbability {
  item: CSGOItem
  probability: number
  multiplier: number
}