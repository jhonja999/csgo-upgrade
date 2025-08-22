import type { CSGOItem, ItemProbability } from '~/types'

// Constants for game mechanics
export const GAME_CONSTANTS = {
  HOUSE_EDGE: 0.05, // 5% house edge
  MIN_MULTIPLIER: 1.1,
  MAX_MULTIPLIER: 100,
  MAX_PROBABILITY: 0.95,
  MIN_ITEM_PRICE: 0.1,
  MAX_ITEM_PRICE: 50000
}

// Rarity weights for item generation
export const RARITY_WEIGHTS = {
  consumer: 0.40,
  industrial: 0.30,
  milspec: 0.15,
  restricted: 0.08,
  classified: 0.04,
  covert: 0.025,
  contraband: 0.005
}

// Price ranges by rarity
export const RARITY_PRICE_RANGES = {
  consumer: [0.1, 5],
  industrial: [2, 20],
  milspec: [10, 100],
  restricted: [50, 500],
  classified: [200, 2000],
  covert: [1000, 10000],
  contraband: [5000, 50000]
} as const

// Calculate upgrade probabilities
export function calculateUpgradeProbabilities(
  inputItem: CSGOItem,
  multiplier: number,
  houseEdge: number = GAME_CONSTANTS.HOUSE_EDGE
): ItemProbability[] {
  const targetPrice = inputItem.price * multiplier
  const availableItems = generateTargetItems(targetPrice)
  
  return availableItems.map(item => {
    // Base probability inversely proportional to price difference
    let baseProbability = Math.min(targetPrice / item.price, 1) * 0.2
    
    // Apply house edge
    baseProbability *= (1 - houseEdge)
    
    // Cap at maximum probability
    baseProbability = Math.min(baseProbability, GAME_CONSTANTS.MAX_PROBABILITY)
    
    return {
      item,
      probability: baseProbability,
      multiplier: item.price / inputItem.price
    }
  }).sort((a, b) => b.probability - a.probability)
}

// Generate target items for upgrade
export function generateTargetItems(targetPrice: number, count: number = 15): CSGOItem[] {
  const items: CSGOItem[] = []
  const priceVariance = targetPrice * 0.4 // ±40% price variance
  
  const weaponTemplates = [
    { name: 'AK-47', type: 'rifle' },
    { name: 'AWP', type: 'sniper' },
    { name: 'M4A4', type: 'rifle' },
    { name: 'Glock-18', type: 'pistol' },
    { name: 'Desert Eagle', type: 'pistol' },
    { name: 'M4A1-S', type: 'rifle' },
    { name: 'USP-S', type: 'pistol' },
    { name: 'Karambit', type: 'knife' },
    { name: 'Bayonet', type: 'knife' }
  ]
  
  const skins = [
    'Redline', 'Asiimov', 'Dragon Lore', 'Fade', 'Blaze',
    'Fire Serpent', 'Hyper Beast', 'Vulcan', 'Howl'
  ]
  
  const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
  
  for (let i = 0; i < count; i++) {
    const weapon = weaponTemplates[Math.floor(Math.random() * weaponTemplates.length)]
    const skin = skins[Math.floor(Math.random() * skins.length)]
    const exterior = exteriors[Math.floor(Math.random() * exteriors.length)]
    
    // Generate price around target with variance
    const priceOffset = (Math.random() - 0.5) * priceVariance * 2
    const itemPrice = Math.max(GAME_CONSTANTS.MIN_ITEM_PRICE, targetPrice + priceOffset)
    
    // Determine rarity based on price
    const rarity = getRarityFromPrice(itemPrice)
    
    const fullName = `${weapon.name} | ${skin} (${exterior})`
    
    items.push({
      id: `target-${i}-${Date.now()}`,
      name: fullName,
      marketName: fullName,
      price: parseFloat(itemPrice.toFixed(2)),
      imageUrl: '/placeholder-item.jpg',
      rarity,
      type: weapon.type as any,
      category: 'weapon',
      exterior,
      statTrak: Math.random() < 0.1, // 10% chance for StatTrak
      souvenir: Math.random() < 0.05 // 5% chance for Souvenir
    })
  }
  
  return items.sort((a, b) => b.price - a.price)
}

// Determine rarity based on item price
export function getRarityFromPrice(price: number): string {
  for (const [rarity, [min, max]] of Object.entries(RARITY_PRICE_RANGES)) {
    if (price >= min && price <= max) {
      return rarity
    }
  }
  
  // Fallback based on price ranges
  if (price < 5) return 'consumer'
  if (price < 20) return 'industrial'
  if (price < 100) return 'milspec'
  if (price < 500) return 'restricted'
  if (price < 2000) return 'classified'
  if (price < 10000) return 'covert'
  return 'contraband'
}

// Generate random rarity based on weights
export function getRandomRarity(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulative += weight
    if (random <= cumulative) {
      return rarity
    }
  }
  
  return 'consumer'
}

// Calculate expected value of upgrade
export function calculateExpectedValue(possibilities: ItemProbability[]): number {
  return possibilities.reduce((total, possibility) => {
    return total + (possibility.item.price * possibility.probability)
  }, 0)
}

// Calculate actual house edge for upgrade
export function calculateActualHouseEdge(
  inputPrice: number,
  possibilities: ItemProbability[]
): number {
  const expectedValue = calculateExpectedValue(possibilities)
  return Math.max(0, (inputPrice - expectedValue) / inputPrice)
}

// Simulate upgrade result
export function simulateUpgradeResult(possibilities: ItemProbability[]): {
  success: boolean
  wonItem?: CSGOItem
  probability: number
} {
  const random = Math.random()
  let cumulativeProbability = 0
  
  for (const possibility of possibilities) {
    cumulativeProbability += possibility.probability
    if (random <= cumulativeProbability) {
      return {
        success: true,
        wonItem: possibility.item,
        probability: possibility.probability
      }
    }
  }
  
  return {
    success: false,
    probability: 1 - cumulativeProbability
  }
}

// Validate upgrade parameters
export function validateUpgradeParameters(
  inputItem: CSGOItem,
  multiplier: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!inputItem) {
    errors.push('Input item is required')
  }
  
  if (multiplier < GAME_CONSTANTS.MIN_MULTIPLIER) {
    errors.push(`Multiplier must be at least ${GAME_CONSTANTS.MIN_MULTIPLIER}x`)
  }
  
  if (multiplier > GAME_CONSTANTS.MAX_MULTIPLIER) {
    errors.push(`Multiplier cannot exceed ${GAME_CONSTANTS.MAX_MULTIPLIER}x`)
  }
  
  if (inputItem && inputItem.price < GAME_CONSTANTS.MIN_ITEM_PRICE) {
    errors.push(`Item price must be at least $${GAME_CONSTANTS.MIN_ITEM_PRICE}`)
  }
  
  if (inputItem && inputItem.price > GAME_CONSTANTS.MAX_ITEM_PRICE) {
    errors.push(`Item price cannot exceed $${GAME_CONSTANTS.MAX_ITEM_PRICE}`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Generate provably fair result
export function generateProvablyFairResult(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): number {
  // Simple implementation - in production, use proper cryptographic functions
  const combined = `${serverSeed}:${clientSeed}:${nonce}`
  let hash = 0
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert to 0-1 range
  return Math.abs(hash) / 2147483647
}

// Calculate crash game multiplier
export function calculateCrashMultiplier(houseEdge: number = 0.01): number {
  const random = Math.random()
  
  // Exponential distribution for crash point
  const crashPoint = (1 / (1 - houseEdge)) * (-Math.log(1 - random))
  
  // Ensure reasonable bounds
  return Math.max(1.0, Math.min(1000, parseFloat(crashPoint.toFixed(2))))
}

// Roulette game logic
export function simulateRouletteResult(): {
  number: number
  color: 'red' | 'black' | 'green'
} {
  const number = Math.floor(Math.random() * 37) // 0-36
  
  let color: 'red' | 'black' | 'green'
  
  if (number === 0) {
    color = 'green'
  } else {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    color = redNumbers.includes(number) ? 'red' : 'black'
  }
  
  return { number, color }
}

// Calculate roulette payout
export function calculateRoulettePayout(
  bet: number,
  betType: string,
  betValue: number | string,
  result: { number: number; color: string }
): number {
  switch (betType) {
    case 'number':
      return result.number === betValue ? bet * 35 : 0
    case 'color':
      return result.color === betValue ? bet * 2 : 0
    case 'even':
      return result.number > 0 && result.number % 2 === 0 ? bet * 2 : 0
    case 'odd':
      return result.number > 0 && result.number % 2 === 1 ? bet * 2 : 0
    case 'low':
      return result.number >= 1 && result.number <= 18 ? bet * 2 : 0
    case 'high':
      return result.number >= 19 && result.number <= 36 ? bet * 2 : 0
    default:
      return 0
  }
}

// Utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}