import { defineStore } from 'pinia'
import type { CSGOItem, UpgradeSession, UpgradeResult, ItemProbability, UpgradeApiRequest } from '~/types'

interface UpgradeState {
  currentSession: UpgradeSession | null
  history: UpgradeSession[]
  config: {
    minMultiplier: number
    maxMultiplier: number
    houseEdge: number
    maxProbability: number
  }
}

export const useUpgradeStore = defineStore('upgrade', () => {
  // State
  const state = reactive<UpgradeState>({
    currentSession: null,
    history: [],
    config: {
      minMultiplier: 1.1,
      maxMultiplier: 100,
      houseEdge: 0.05, // 5% house edge
      maxProbability: 0.95 // 95% max probability
    }
  })

  // Getters
  const currentSession = computed(() => state.currentSession)
  const history = computed(() => state.history)
  const config = computed(() => state.config)

  // Stats
  const stats = computed(() => {
    const sessions = state.history
    return {
      totalUpgrades: sessions.length,
      successfulUpgrades: sessions.filter(s => s.result?.success).length,
      successRate: sessions.length > 0 ? 
        (sessions.filter(s => s.result?.success).length / sessions.length) * 100 : 0,
      totalProfit: sessions.reduce((total, session) => 
        total + (session.result?.profit || 0), 0),
      biggestWin: Math.max(...sessions.map(s => s.result?.profit || 0), 0)
    }
  })

  // Actions
  const calculateUpgrade = (inputItem: CSGOItem, multiplier: number): ItemProbability[] => {
    const targetPrice = inputItem.price * multiplier
    const houseEdge = state.config.houseEdge
    
    // Simular obtener items disponibles (en producción vendría de la API)
    const availableItems = generateAvailableItems(targetPrice)
    
    // Calcular probabilidades
    const totalValue = availableItems.reduce((sum, item) => sum + item.price, 0)
    
    const itemProbabilities: ItemProbability[] = availableItems.map(item => {
      // Probabilidad base inversa al precio (items más caros = menor probabilidad)
      let baseProbability = (targetPrice / item.price) * 0.1
      
      // Aplicar house edge
      baseProbability *= (1 - houseEdge)
      
      // Limitar probabilidad máxima
      baseProbability = Math.min(baseProbability, state.config.maxProbability)
      
      return {
        item,
        probability: baseProbability,
        multiplier: item.price / inputItem.price
      }
    })

    // Normalizar probabilidades para que sumen menos del 100%
    const totalProbability = itemProbabilities.reduce((sum, ip) => sum + ip.probability, 0)
    if (totalProbability > 0.95) {
      const scaleFactor = 0.95 / totalProbability
      itemProbabilities.forEach(ip => {
        ip.probability *= scaleFactor
      })
    }

    return itemProbabilities.sort((a, b) => b.probability - a.probability)
  }

  const performUpgrade = async (request: UpgradeApiRequest) => {
    const inventoryStore = useInventoryStore()
    const balanceStore = useBalanceStore()
    
    // Obtener el item del inventario
    const inputItem = inventoryStore.getItemById(request.inputItemId)
    if (!inputItem) {
      throw new Error('Item no encontrado en el inventario')
    }

    // Validar multiplier
    if (request.multiplier < state.config.minMultiplier || request.multiplier > state.config.maxMultiplier) {
      throw new Error(`Multiplicador debe estar entre ${state.config.minMultiplier} y ${state.config.maxMultiplier}`)
    }

    // Crear sesión
    const session: UpgradeSession = {
      id: generateId(),
      inputItem,
      targetItems: calculateUpgrade(inputItem, request.multiplier),
      multiplier: request.multiplier,
      maxProbability: state.config.maxProbability,
      timestamp: Date.now()
    }

    state.currentSession = session

    // Simular resultado del upgrade
    const result = simulateUpgradeResult(session)
    session.result = result

    // Actualizar balance
    if (result.success && result.wonItem) {
      balanceStore.addBalance(result.profit, 'upgrade_win', `Upgrade exitoso: ${result.wonItem.name}`)
    } else {
      balanceStore.subtractBalance(inputItem.price, 'upgrade_loss', `Upgrade fallido: ${inputItem.name}`)
    }

    // Guardar en historial
    state.history.unshift(session)
    if (state.history.length > 100) {
      state.history = state.history.slice(0, 100)
    }

    // Limpiar sesión actual
    setTimeout(() => {
      state.currentSession = null
    }, 1000)

    return {
      success: true,
      data: result,
      session
    }
  }

  // Utility functions
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const generateAvailableItems = (targetPrice: number): CSGOItem[] => {
    // Simular items disponibles basados en el precio objetivo
    const items: CSGOItem[] = []
    const priceRange = targetPrice * 0.3 // ±30% del precio objetivo
    
    for (let i = 0; i < 20; i++) {
      const price = targetPrice + (Math.random() - 0.5) * priceRange * 2
      items.push({
        id: generateId(),
        name: `Simulated Item ${i + 1}`,
        marketName: `Simulated Item ${i + 1}`,
        price: Math.max(0.1, price),
        imageUrl: '/placeholder-item.jpg',
        rarity: getRandomRarity(),
        type: getRandomType(),
        category: 'weapon'
      })
    }
    
    return items
  }

  const getRandomRarity = () => {
    const rarities = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert']
    return rarities[Math.floor(Math.random() * rarities.length)] as any
  }

  const getRandomType = () => {
    const types = ['rifle', 'pistol', 'knife', 'sniper']
    return types[Math.floor(Math.random() * types.length)] as any
  }

  const simulateUpgradeResult = (session: UpgradeSession): UpgradeResult => {
    const random = Math.random()
    let cumulativeProbability = 0
    
    // Verificar si gana algún item
    for (const itemProb of session.targetItems) {
      cumulativeProbability += itemProb.probability
      if (random <= cumulativeProbability) {
        return {
          success: true,
          wonItem: itemProb.item,
          profit: itemProb.item.price - session.inputItem.price,
          multiplier: itemProb.multiplier,
          probability: itemProb.probability
        }
      }
    }
    
    // No ganó nada
    return {
      success: false,
      profit: -session.inputItem.price,
      multiplier: 0,
      probability: 1 - cumulativeProbability
    }
  }

  // Load/Save to localStorage
  const loadHistory = () => {
    if (process.client) {
      const saved = localStorage.getItem('csgo-upgrade-history')
      if (saved) {
        try {
          state.history = JSON.parse(saved)
        } catch (error) {
          console.error('Error loading upgrade history:', error)
        }
      }
    }
  }

  const saveHistory = () => {
    if (process.client) {
      localStorage.setItem('csgo-upgrade-history', JSON.stringify(state.history))
    }
  }

  // Watch for history changes
  watch(() => state.history, saveHistory, { deep: true })

  return {
    // State
    currentSession,
    history,
    config,
    stats,
    
    // Actions
    calculateUpgrade,
    performUpgrade,
    loadHistory,
    saveHistory
  }
})