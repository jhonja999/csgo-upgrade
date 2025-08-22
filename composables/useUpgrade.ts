import type { CSGOItem, UpgradeSession, UpgradeResult, ItemProbability, UpgradeApiRequest } from '~/types'

export const useUpgrade = () => {
  // Store references
  const upgradeStore = useUpgradeStore()
  const balanceStore = useBalanceStore()
  const inventoryStore = useInventoryStore()
  
  // Audio and animations
  const { playUpgradeSpinSound, playWinSound, playLoseSound } = useAudio()
  const { upgradeAnimation } = useAnimations()

  // Computed properties
  const currentSession = computed(() => upgradeStore.currentSession)
  const history = computed(() => upgradeStore.history)
  const config = computed(() => upgradeStore.config)
  const stats = computed(() => upgradeStore.stats)

  // Validation
  const validateUpgradeRequest = (request: UpgradeApiRequest): string[] => {
    const errors: string[] = []
    
    // Check if item exists
    const item = inventoryStore.getItemById(request.inputItemId)
    if (!item) {
      errors.push('Item no encontrado en el inventario')
    }
    
    // Validate multiplier
    if (request.multiplier < config.value.minMultiplier) {
      errors.push(`Multiplicador mínimo es ${config.value.minMultiplier}x`)
    }
    
    if (request.multiplier > config.value.maxMultiplier) {
      errors.push(`Multiplicador máximo es ${config.value.maxMultiplier}x`)
    }
    
    // Check if user has sufficient balance for fees (if any)
    const fees = calculateUpgradeFees(item?.price || 0)
    if (fees > 0 && !balanceStore.hasEnoughBalance(fees)) {
      errors.push('Saldo insuficiente para cubrir las tarifas')
    }
    
    return errors
  }

  // Calculate upgrade possibilities
  const calculateUpgradePossibilities = (inputItem: CSGOItem, multiplier: number) => {
    return upgradeStore.calculateUpgrade(inputItem, multiplier)
  }

  // Calculate fees (if any)
  const calculateUpgradeFees = (itemValue: number): number => {
    // For this implementation, no fees
    // In a real system, you might charge a small percentage
    return 0
  }

  // Calculate expected value
  const calculateExpectedValue = (possibilities: ItemProbability[]): number => {
    return possibilities.reduce((total, possibility) => {
      return total + (possibility.item.price * possibility.probability)
    }, 0)
  }

  // Calculate house edge for this specific upgrade
  const calculateActualHouseEdge = (inputItem: CSGOItem, possibilities: ItemProbability[]): number => {
    const expectedValue = calculateExpectedValue(possibilities)
    const inputValue = inputItem.price
    
    return (inputValue - expectedValue) / inputValue
  }

  // Get upgrade recommendations
  const getUpgradeRecommendations = (inputItem: CSGOItem) => {
    const recommendations = []
    
    // Safe upgrade (low multiplier, higher chance)
    const safeMultiplier = 2.0
    const safePossibilities = calculateUpgradePossibilities(inputItem, safeMultiplier)
    const safeWinChance = safePossibilities.reduce((total, p) => total + p.probability, 0)
    
    if (safeWinChance > 0.3) {
      recommendations.push({
        type: 'safe',
        multiplier: safeMultiplier,
        winChance: safeWinChance * 100,
        description: 'Upgrade seguro con buenas probabilidades'
      })
    }
    
    // Balanced upgrade
    const balancedMultiplier = 5.0
    const balancedPossibilities = calculateUpgradePossibilities(inputItem, balancedMultiplier)
    const balancedWinChance = balancedPossibilities.reduce((total, p) => total + p.probability, 0)
    
    if (balancedWinChance > 0.1) {
      recommendations.push({
        type: 'balanced',
        multiplier: balancedMultiplier,
        winChance: balancedWinChance * 100,
        description: 'Upgrade balanceado con retorno decente'
      })
    }
    
    // High risk, high reward
    const riskyMultiplier = 15.0
    const riskyPossibilities = calculateUpgradePossibilities(inputItem, riskyMultiplier)
    const riskyWinChance = riskyPossibilities.reduce((total, p) => total + p.probability, 0)
    
    if (riskyWinChance > 0.02) {
      recommendations.push({
        type: 'risky',
        multiplier: riskyMultiplier,
        winChance: riskyWinChance * 100,
        description: 'Upgrade arriesgado con gran potencial'
      })
    }
    
    return recommendations
  }

  // Perform upgrade with full workflow
  const performUpgradeWithAnimation = async (
    inputItem: CSGOItem, 
    multiplier: number,
    animationContainer?: HTMLElement
  ): Promise<UpgradeResult> => {
    try {
      // Validate request
      const request: UpgradeApiRequest = {
        inputItemId: inputItem.id,
        multiplier,
        targetRarity: undefined
      }
      
      const errors = validateUpgradeRequest(request)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      // Play spin sound
      playUpgradeSpinSound()

      // Perform the upgrade
      const response = await upgradeStore.performUpgrade(request)
      const result = response.data

      // Play animation if container provided
      if (animationContainer) {
        const possibilities = calculateUpgradePossibilities(inputItem, multiplier)
        const itemElements = animationContainer.querySelectorAll('.upgrade-item') as NodeListOf<HTMLElement>
        
        if (itemElements.length > 0) {
          const winningIndex = result.success ? 
            Math.floor(Math.random() * itemElements.length) : 
            -1
          
          await upgradeAnimation(animationContainer, Array.from(itemElements), winningIndex)
        }
      }

      // Play result sound
      if (result.success) {
        playWinSound()
      } else {
        playLoseSound()
      }

      return result
    } catch (error) {
      console.error('Upgrade failed:', error)
      throw error
    }
  }

  // Quick upgrade (without animation)
  const quickUpgrade = async (inputItemId: string, multiplier: number): Promise<UpgradeResult> => {
    try {
      const request: UpgradeApiRequest = {
        inputItemId,
        multiplier
      }
      
      const response = await upgradeStore.performUpgrade(request)
      return response.data
    } catch (error) {
      console.error('Quick upgrade failed:', error)
      throw error
    }
  }

  // Batch upgrades (multiple items)
  const batchUpgrade = async (requests: Array<{ itemId: string; multiplier: number }>) => {
    const results = []
    
    for (const request of requests) {
      try {
        const result = await quickUpgrade(request.itemId, request.multiplier)
        results.push({ ...result, itemId: request.itemId, success: true })
      } catch (error) {
        results.push({ 
          itemId: request.itemId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }
    
    return results
  }

  // Auto upgrade (keep upgrading until loss or target reached)
  const autoUpgrade = async (
    initialItemId: string, 
    targetValue: number, 
    maxAttempts = 10
  ) => {
    let currentItemId = initialItemId
    let attempts = 0
    let totalProfit = 0
    const results = []

    while (attempts < maxAttempts) {
      const currentItem = inventoryStore.getItemById(currentItemId)
      if (!currentItem) break

      if (currentItem.price >= targetValue) {
        // Target reached
        break
      }

      // Calculate multiplier to reach target
      const neededMultiplier = Math.min(
        targetValue / currentItem.price,
        config.value.maxMultiplier
      )

      try {
        const result = await quickUpgrade(currentItemId, neededMultiplier)
        results.push(result)
        totalProfit += result.profit

        if (result.success && result.wonItem) {
          currentItemId = result.wonItem.id
        } else {
          // Lost, stop auto upgrade
          break
        }
      } catch (error) {
        console.error('Auto upgrade failed:', error)
        break
      }

      attempts++
    }

    return {
      results,
      totalProfit,
      attempts,
      success: totalProfit > 0
    }
  }

  // Statistics and analysis
  const analyzeUpgradePattern = (itemType?: string, rarity?: string) => {
    let relevantHistory = history.value

    if (itemType) {
      relevantHistory = relevantHistory.filter(session => 
        session.inputItem.type === itemType
      )
    }

    if (rarity) {
      relevantHistory = relevantHistory.filter(session => 
        session.inputItem.rarity === rarity
      )
    }

    const totalSessions = relevantHistory.length
    const successfulSessions = relevantHistory.filter(s => s.result?.success).length
    const totalProfit = relevantHistory.reduce((sum, s) => sum + (s.result?.profit || 0), 0)
    const averageMultiplier = relevantHistory.reduce((sum, s) => sum + s.multiplier, 0) / totalSessions

    return {
      totalSessions,
      successfulSessions,
      successRate: totalSessions > 0 ? (successfulSessions / totalSessions) * 100 : 0,
      totalProfit,
      averageProfit: totalSessions > 0 ? totalProfit / totalSessions : 0,
      averageMultiplier
    }
  }

  const getBestUpgradeItems = () => {
    return inventoryStore.items
      .filter(item => item.price >= 10 && item.price <= 100) // Sweet spot for upgrades
      .sort((a, b) => {
        // Prioritize items with good upgrade potential
        const aMultiplier = Math.min(1000 / a.price, config.value.maxMultiplier)
        const bMultiplier = Math.min(1000 / b.price, config.value.maxMultiplier)
        return bMultiplier - aMultiplier
      })
      .slice(0, 10)
  }

  const getUpgradeStreak = () => {
    let currentStreak = 0
    const recentSessions = [...history.value].reverse() // Most recent first

    for (const session of recentSessions) {
      if (session.result?.success) {
        currentStreak++
      } else {
        break
      }
    }

    return currentStreak
  }

  // Risk assessment
  const assessUpgradeRisk = (inputItem: CSGOItem, multiplier: number) => {
    const possibilities = calculateUpgradePossibilities(inputItem, multiplier)
    const winChance = possibilities.reduce((total, p) => total + p.probability, 0)
    const expectedValue = calculateExpectedValue(possibilities)
    const houseEdge = calculateActualHouseEdge(inputItem, possibilities)

    let riskLevel: 'low' | 'medium' | 'high' | 'extreme'
    
    if (winChance > 0.4) riskLevel = 'low'
    else if (winChance > 0.2) riskLevel = 'medium'
    else if (winChance > 0.05) riskLevel = 'high'
    else riskLevel = 'extreme'

    return {
      riskLevel,
      winChance: winChance * 100,
      expectedValue,
      houseEdge: houseEdge * 100,
      recommendation: getRiskRecommendation(riskLevel, winChance, houseEdge)
    }
  }

  const getRiskRecommendation = (riskLevel: string, winChance: number, houseEdge: number) => {
    switch (riskLevel) {
      case 'low':
        return 'Upgrade recomendado con buenas probabilidades'
      case 'medium':
        return 'Upgrade balanceado, considera el riesgo'
      case 'high':
        return 'Upgrade arriesgado, solo si puedes permitirte perder'
      case 'extreme':
        return 'Upgrade muy arriesgado, no recomendado'
      default:
        return 'Evalúa cuidadosamente antes de proceder'
    }
  }

  // Initialize
  onMounted(() => {
    upgradeStore.loadHistory()
  })

  return {
    // State
    currentSession,
    history,
    config,
    stats,
    
    // Core upgrade functions
    performUpgradeWithAnimation,
    quickUpgrade,
    batchUpgrade,
    autoUpgrade,
    
    // Calculations
    calculateUpgradePossibilities,
    calculateExpectedValue,
    calculateActualHouseEdge,
    calculateUpgradeFees,
    
    // Analysis
    analyzeUpgradePattern,
    getBestUpgradeItems,
    getUpgradeStreak,
    assessUpgradeRisk,
    getUpgradeRecommendations,
    
    // Validation
    validateUpgradeRequest
  }
}