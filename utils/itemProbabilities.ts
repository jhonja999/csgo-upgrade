import type { CSGOItem, ItemProbability } from '~/types'
import { RARITY_CONFIG } from './constants'

// Base probability calculation system for CSGO Upgrade

export interface ProbabilityConfig {
  houseEdge: number
  maxProbability: number
  rarityMultipliers: Record<string, number>
  typeMultipliers: Record<string, number>
  wearMultipliers: Record<string, number>
}

export const DEFAULT_PROBABILITY_CONFIG: ProbabilityConfig = {
  houseEdge: 0.05, // 5% house edge
  maxProbability: 0.95, // 95% max win chance
  rarityMultipliers: {
    consumer: 1.0,
    industrial: 0.8,
    milspec: 0.6,
    restricted: 0.4,
    classified: 0.25,
    covert: 0.15,
    contraband: 0.05
  },
  typeMultipliers: {
    rifle: 1.0,
    pistol: 1.1,
    sniper: 0.8,
    shotgun: 1.2,
    smg: 1.1,
    machinegun: 0.9,
    knife: 0.3,
    gloves: 0.4
  },
  wearMultipliers: {
    'Factory New': 0.7,
    'Minimal Wear': 0.8,
    'Field-Tested': 1.0,
    'Well-Worn': 1.1,
    'Battle-Scarred': 1.2
  }
}

// Main probability calculation function
export function calculateItemProbabilities(
  inputItem: CSGOItem,
  targetItems: CSGOItem[],
  multiplier: number,
  config: ProbabilityConfig = DEFAULT_PROBABILITY_CONFIG
): ItemProbability[] {
  const targetPrice = inputItem.price * multiplier
  
  return targetItems.map(item => {
    const probability = calculateSingleItemProbability(
      inputItem,
      item,
      targetPrice,
      config
    )
    
    return {
      item,
      probability,
      multiplier: item.price / inputItem.price
    }
  }).sort((a, b) => b.probability - a.probability)
}

// Calculate probability for a single item
export function calculateSingleItemProbability(
  inputItem: CSGOItem,
  targetItem: CSGOItem,
  targetPrice: number,
  config: ProbabilityConfig
): number {
  // Base probability inversely related to price difference
  let baseProbability = Math.min(targetPrice / targetItem.price, 2) * 0.1
  
  // Apply rarity modifier
  const rarityMultiplier = config.rarityMultipliers[targetItem.rarity] || 1.0
  baseProbability *= rarityMultiplier
  
  // Apply type modifier
  const typeMultiplier = config.typeMultipliers[targetItem.type] || 1.0
  baseProbability *= typeMultiplier
  
  // Apply wear modifier if available
  if (targetItem.exterior) {
    const wearMultiplier = config.wearMultipliers[targetItem.exterior] || 1.0
    baseProbability *= wearMultiplier
  }
  
  // Apply special item modifiers
  if (targetItem.statTrak) {
    baseProbability *= 0.5 // StatTrak items are rarer
  }
  
  if (targetItem.souvenir) {
    baseProbability *= 0.7 // Souvenir items are somewhat rarer
  }
  
  // Apply house edge
  baseProbability *= (1 - config.houseEdge)
  
  // Ensure probability is within bounds
  return Math.max(0, Math.min(config.maxProbability, baseProbability))
}

// Generate probability distribution for upgrade pool
export function generateUpgradeProbabilities(
  inputPrice: number,
  multiplier: number,
  itemCount: number = 20,
  config: ProbabilityConfig = DEFAULT_PROBABILITY_CONFIG
): ItemProbability[] {
  const targetPrice = inputPrice * multiplier
  const generatedItems = generateUpgradePool(targetPrice, itemCount)
  
  return generatedItems.map(item => {
    const probability = calculateBaseProbability(item.price, targetPrice, config)
    
    return {
      item,
      probability,
      multiplier: item.price / inputPrice
    }
  }).sort((a, b) => b.probability - a.probability)
}

// Generate pool of potential upgrade items
export function generateUpgradePool(
  targetPrice: number,
  count: number = 20,
  priceVariance: number = 0.4
): CSGOItem[] {
  const items: CSGOItem[] = []
  const variance = targetPrice * priceVariance
  
  const weaponNames = [
    'AK-47', 'AWP', 'M4A4', 'M4A1-S', 'Glock-18', 'USP-S',
    'Desert Eagle', 'P250', 'Tec-9', 'MP7', 'UMP-45',
    'Karambit', 'Bayonet', 'Flip Knife', 'Gut Knife'
  ]
  
  const skinNames = [
    'Redline', 'Asiimov', 'Dragon Lore', 'Fade', 'Blaze',
    'Fire Serpent', 'Hyper Beast', 'Vulcan', 'Howl', 'Medusa',
    'Lightning Strike', 'Boom', 'Case Hardened', 'Crimson Web'
  ]
  
  const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
  
  for (let i = 0; i < count; i++) {
    // Generate price around target with variance
    const priceOffset = (Math.random() - 0.5) * variance * 2
    const itemPrice = Math.max(0.1, targetPrice + priceOffset)
    
    // Select random components
    const weapon = weaponNames[Math.floor(Math.random() * weaponNames.length)]
    const skin = skinNames[Math.floor(Math.random() * skinNames.length)]
    const exterior = exteriors[Math.floor(Math.random() * exteriors.length)]
    
    // Determine item properties
    const isKnife = weapon.includes('Knife') || weapon === 'Karambit' || weapon === 'Bayonet'
    const rarity = determineRarityFromPrice(itemPrice)
    const type = isKnife ? 'knife' : determineWeaponType(weapon)
    
    const fullName = `${weapon} | ${skin} (${exterior})`
    
    items.push({
      id: `pool-${i}-${Date.now()}`,
      name: fullName,
      marketName: fullName,
      price: parseFloat(itemPrice.toFixed(2)),
      imageUrl: '/placeholder-item.jpg',
      rarity,
      type,
      category: 'weapon',
      exterior,
      statTrak: Math.random() < 0.1,
      souvenir: Math.random() < 0.05
    })
  }
  
  return items
}

// Calculate base probability from price relationship
function calculateBaseProbability(
  itemPrice: number,
  targetPrice: number,
  config: ProbabilityConfig
): number {
  if (itemPrice <= 0 || targetPrice <= 0) return 0
  
  // Inverse relationship: higher priced items have lower probability
  let probability = Math.min(targetPrice / itemPrice, 2) * 0.15
  
  // Apply curve to make expensive items much rarer
  const priceRatio = itemPrice / targetPrice
  if (priceRatio > 1.5) {
    probability *= Math.pow(0.5, priceRatio - 1.5)
  }
  
  // Apply house edge
  probability *= (1 - config.houseEdge)
  
  return Math.max(0, Math.min(config.maxProbability, probability))
}

// Determine rarity based on price
function determineRarityFromPrice(price: number): string {
  if (price >= 5000) return 'contraband'
  if (price >= 1000) return 'covert'
  if (price >= 200) return 'classified'
  if (price >= 50) return 'restricted'
  if (price >= 10) return 'milspec'
  if (price >= 2) return 'industrial'
  return 'consumer'
}

// Determine weapon type
function determineWeaponType(weaponName: string): string {
  const typeMap: Record<string, string> = {
    'AK-47': 'rifle',
    'AWP': 'sniper',
    'M4A4': 'rifle',
    'M4A1-S': 'rifle',
    'Glock-18': 'pistol',
    'USP-S': 'pistol',
    'Desert Eagle': 'pistol',
    'P250': 'pistol',
    'Tec-9': 'pistol',
    'MP7': 'smg',
    'UMP-45': 'smg'
  }
  
  return typeMap[weaponName] || 'rifle'
}

// Validate probability distribution
export function validateProbabilityDistribution(
  probabilities: ItemProbability[],
  config: ProbabilityConfig
): { valid: boolean; totalProbability: number; warnings: string[] } {
  const totalProbability = probabilities.reduce((sum, item) => sum + item.probability, 0)
  const warnings: string[] = []
  
  if (totalProbability > config.maxProbability) {
    warnings.push(`Total probability (${(totalProbability * 100).toFixed(2)}%) exceeds maximum allowed`)
  }
  
  if (totalProbability < 0.01) {
    warnings.push('Total probability is extremely low')
  }
  
  const highProbItems = probabilities.filter(item => item.probability > 0.5)
  if (highProbItems.length > 0) {
    warnings.push(`${highProbItems.length} items have >50% probability`)
  }
  
  return {
    valid: warnings.length === 0,
    totalProbability,
    warnings
  }
}

// Calculate expected value
export function calculateExpectedValue(probabilities: ItemProbability[]): number {
  return probabilities.reduce((sum, item) => {
    return sum + (item.item.price * item.probability)
  }, 0)
}

// Calculate house edge for specific upgrade
export function calculateEffectiveHouseEdge(
  inputPrice: number,
  probabilities: ItemProbability[]
): number {
  const expectedValue = calculateExpectedValue(probabilities)
  return Math.max(0, (inputPrice - expectedValue) / inputPrice)
}

// Normalize probabilities to ensure they don't exceed maximum
export function normalizeProbabilities(
  probabilities: ItemProbability[],
  maxTotal: number = 0.95
): ItemProbability[] {
  const totalProbability = probabilities.reduce((sum, item) => sum + item.probability, 0)
  
  if (totalProbability <= maxTotal) {
    return probabilities
  }
  
  const scaleFactor = maxTotal / totalProbability
  
  return probabilities.map(item => ({
    ...item,
    probability: item.probability * scaleFactor
  }))
}

// Simulate upgrade outcome
export function simulateUpgradeOutcome(probabilities: ItemProbability[]): {
  success: boolean
  wonItem?: CSGOItem
  probability: number
} {
  const random = Math.random()
  let cumulativeProbability = 0
  
  for (const item of probabilities) {
    cumulativeProbability += item.probability
    if (random <= cumulativeProbability) {
      return {
        success: true,
        wonItem: item.item,
        probability: item.probability
      }
    }
  }
  
  return {
    success: false,
    probability: 1 - cumulativeProbability
  }
}

// Get probability tier for UI display
export function getProbabilityTier(probability: number): {
  tier: string
  color: string
  label: string
} {
  if (probability >= 0.5) {
    return { tier: 'high', color: 'text-green-400', label: 'Alta' }
  } else if (probability >= 0.2) {
    return { tier: 'medium', color: 'text-yellow-400', label: 'Media' }
  } else if (probability >= 0.05) {
    return { tier: 'low', color: 'text-orange-400', label: 'Baja' }
  } else {
    return { tier: 'very-low', color: 'text-red-400', label: 'Muy Baja' }
  }
}

// Calculate probability confidence interval
export function calculateConfidenceInterval(
  probability: number,
  sampleSize: number = 1000,
  confidence: number = 0.95
): { lower: number; upper: number } {
  const z = confidence === 0.95 ? 1.96 : 2.58 // 95% or 99% confidence
  const margin = z * Math.sqrt((probability * (1 - probability)) / sampleSize)
  
  return {
    lower: Math.max(0, probability - margin),
    upper: Math.min(1, probability + margin)
  }
}