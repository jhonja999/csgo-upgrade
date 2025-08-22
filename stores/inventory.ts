import { defineStore } from 'pinia'
import type { CSGOItem, UserInventory } from '~/types'

interface InventoryState {
  items: CSGOItem[]
  loading: boolean
  lastUpdated: number
  totalValue: number
}

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const state = reactive<InventoryState>({
    items: [],
    loading: false,
    lastUpdated: 0,
    totalValue: 0
  })

  // Getters
  const items = computed(() => state.items)
  const loading = computed(() => state.loading)
  const totalValue = computed(() => state.totalValue)
  const itemCount = computed(() => state.items.length)
  
  const itemsByRarity = computed(() => {
    const grouped: Record<string, CSGOItem[]> = {}
    state.items.forEach(item => {
      if (!grouped[item.rarity]) {
        grouped[item.rarity] = []
      }
      grouped[item.rarity].push(item)
    })
    return grouped
  })
  
  const itemsByType = computed(() => {
    const grouped: Record<string, CSGOItem[]> = {}
    state.items.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = []
      }
      grouped[item.type].push(item)
    })
    return grouped
  })

  // Actions
  const loadInventory = async () => {
    state.loading = true
    
    try {
      // En desarrollo, usar datos mock
      if (process.dev) {
        await loadMockInventory()
      } else {
        // En producción, cargar desde API
        const response = await $fetch('/api/inventory')
        state.items = response.data || []
      }
      
      calculateTotalValue()
      state.lastUpdated = Date.now()
      
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      state.loading = false
    }
  }

  const addItem = (item: CSGOItem) => {
    // Verificar si el item ya existe
    const existingIndex = state.items.findIndex(existing => existing.id === item.id)
    
    if (existingIndex >= 0) {
      // Si existe, actualizar (en caso de cambios de precio)
      state.items[existingIndex] = { ...item }
    } else {
      // Si no existe, agregar
      state.items.push({ ...item })
    }
    
    calculateTotalValue()
    saveToLocalStorage()
  }

  const removeItem = (itemId: string) => {
    const index = state.items.findIndex(item => item.id === itemId)
    if (index >= 0) {
      state.items.splice(index, 1)
      calculateTotalValue()
      saveToLocalStorage()
      return true
    }
    return false
  }

  const updateItem = (itemId: string, updates: Partial<CSGOItem>) => {
    const index = state.items.findIndex(item => item.id === itemId)
    if (index >= 0) {
      state.items[index] = { ...state.items[index], ...updates }
      calculateTotalValue()
      saveToLocalStorage()
      return true
    }
    return false
  }

  const getItemById = (itemId: string): CSGOItem | undefined => {
    return state.items.find(item => item.id === itemId)
  }

  const filterItems = (filters: {
    rarity?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    statTrak?: boolean
    souvenir?: boolean
  }) => {
    return state.items.filter(item => {
      // Filtro por rareza
      if (filters.rarity && item.rarity !== filters.rarity) {
        return false
      }
      
      // Filtro por tipo
      if (filters.type && item.type !== filters.type) {
        return false
      }
      
      // Filtro por precio mínimo
      if (filters.minPrice !== undefined && item.price < filters.minPrice) {
        return false
      }
      
      // Filtro por precio máximo
      if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
        return false
      }
      
      // Filtro por búsqueda de texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!item.name.toLowerCase().includes(searchLower) && 
            !item.marketName.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      
      // Filtro por StatTrak
      if (filters.statTrak !== undefined && item.statTrak !== filters.statTrak) {
        return false
      }
      
      // Filtro por Souvenir
      if (filters.souvenir !== undefined && item.souvenir !== filters.souvenir) {
        return false
      }
      
      return true
    })
  }

  const sortItems = (items: CSGOItem[], sortBy: 'price' | 'name' | 'rarity' | 'type', order: 'asc' | 'desc' = 'desc') => {
    return [...items].sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'price':
          compareValue = a.price - b.price
          break
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'rarity':
          const rarityOrder = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert', 'contraband']
          compareValue = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
          break
        case 'type':
          compareValue = a.type.localeCompare(b.type)
          break
      }
      
      return order === 'asc' ? compareValue : -compareValue
    })
  }

  const calculateTotalValue = () => {
    state.totalValue = state.items.reduce((total, item) => total + item.price, 0)
  }

  // Mock data para desarrollo
  const loadMockInventory = async () => {
    const mockItems: CSGOItem[] = [
      {
        id: 'inv-1',
        name: 'AK-47 | Redline (Field-Tested)',
        marketName: 'AK-47 | Redline (Field-Tested)',
        price: 45.50,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'classified',
        type: 'rifle',
        category: 'weapon',
        exterior: 'Field-Tested',
        statTrak: false,
        souvenir: false
      },
      {
        id: 'inv-2',
        name: 'AWP | Dragon Lore (Factory New)',
        marketName: 'AWP | Dragon Lore (Factory New)',
        price: 8500.00,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'covert',
        type: 'sniper',
        category: 'weapon',
        exterior: 'Factory New',
        statTrak: false,
        souvenir: false
      },
      {
        id: 'inv-3',
        name: 'Glock-18 | Fade (Minimal Wear)',
        marketName: 'Glock-18 | Fade (Minimal Wear)',
        price: 180.25,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'restricted',
        type: 'pistol',
        category: 'weapon',
        exterior: 'Minimal Wear',
        statTrak: true,
        souvenir: false
      },
      {
        id: 'inv-4',
        name: 'M4A4 | Asiimov (Field-Tested)',
        marketName: 'M4A4 | Asiimov (Field-Tested)',
        price: 85.75,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'covert',
        type: 'rifle',
        category: 'weapon',
        exterior: 'Field-Tested',
        statTrak: false,
        souvenir: false
      },
      {
        id: 'inv-5',
        name: 'Desert Eagle | Blaze (Factory New)',
        marketName: 'Desert Eagle | Blaze (Factory New)',
        price: 450.00,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'restricted',
        type: 'pistol',
        category: 'weapon',
        exterior: 'Factory New',
        statTrak: false,
        souvenir: false
      }
    ]
    
    // Simular delay de carga
    await new Promise(resolve => setTimeout(resolve, 1000))
    state.items = mockItems
  }

  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('csgo-upgrade-inventory', JSON.stringify({
        items: state.items,
        lastUpdated: state.lastUpdated,
        totalValue: state.totalValue
      }))
    }
  }

  const loadFromLocalStorage = () => {
    if (process.client) {
      const saved = localStorage.getItem('csgo-upgrade-inventory')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          state.items = data.items || []
          state.lastUpdated = data.lastUpdated || 0
          state.totalValue = data.totalValue || 0
        } catch (error) {
          console.error('Error loading inventory from localStorage:', error)
        }
      }
    }
  }

  const clearInventory = () => {
    state.items = []
    state.totalValue = 0
    state.lastUpdated = Date.now()
    saveToLocalStorage()
  }

  // Stats computadas
  const stats = computed(() => ({
    totalItems: state.items.length,
    totalValue: state.totalValue,
    averageValue: state.items.length > 0 ? state.totalValue / state.items.length : 0,
    mostExpensive: state.items.reduce((max, item) => item.price > max.price ? item : max, state.items[0] || { price: 0 }),
    byRarity: Object.entries(itemsByRarity.value).map(([rarity, items]) => ({
      rarity,
      count: items.length,
      value: items.reduce((sum, item) => sum + item.price, 0)
    }))
  }))

  // Auto-save cuando cambian los items
  watch(() => state.items, saveToLocalStorage, { deep: true })

  return {
    // State
    items,
    loading,
    totalValue,
    itemCount,
    itemsByRarity,
    itemsByType,
    stats,
    
    // Actions
    loadInventory,
    addItem,
    removeItem,
    updateItem,
    getItemById,
    filterItems,
    sortItems,
    calculateTotalValue,
    loadFromLocalStorage,
    saveToLocalStorage,
    clearInventory
  }
})