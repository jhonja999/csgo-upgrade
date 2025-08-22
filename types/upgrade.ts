export interface UpgradeConfig {
  minMultiplier: number
  maxMultiplier: number
  houseEdge: number
  maxProbability: number
  allowedRarities: ItemRarity[]
  priceRange: {
    min: number
    max: number
  }
}

export interface UpgradeCalculation {
  inputItem: CSGOItem
  multiplier: number
  targetPrice: number
  possibleItems: ItemProbability[]
  totalProbability: number
  houseEdge: number
  expectedValue: number
}

export interface UpgradeFilter {
  minPrice?: number
  maxPrice?: number
  rarity?: ItemRarity
  type?: ItemType
  wear?: WearLevel
  statTrak?: boolean
  souvenir?: boolean
  searchTerm?: string
}

export interface UpgradeAnimation {
  duration: number
  items: CSGOItem[]
  winningIndex: number
  winningItem: CSGOItem
}

export interface UpgradeSoundConfig {
  enabled: boolean
  volume: number
  sounds: {
    spin: string
    win: string
    lose: string
    hover: string
    click: string
  }
}