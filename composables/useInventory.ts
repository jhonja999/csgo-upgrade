import type { CSGOItem } from '~/types'

export const useInventory = () => {
  // Store reference
  const inventoryStore = useInventoryStore()
  
  // Computed properties
  const items = computed(() => inventoryStore.items)
  const loading = computed(() => inventoryStore.loading)
  const totalValue = computed(() => inventoryStore.totalValue)
  const itemCount = computed(() => inventoryStore.itemCount)
  const stats = computed(() => inventoryStore.stats)
  const itemsByRarity = computed(() => inventoryStore.itemsByRarity)
  const itemsByType = computed(() => inventoryStore.itemsByType)

  // Item management
  const addItem = async (item: CSGOItem) => {
    try {
      inventoryStore.addItem(item)
      
      // In production, sync with server
      if (process.env.NODE_ENV === 'production') {
        await $fetch('/api/inventory/add', {
          method: 'POST',
          body: { item }
        })
      }
      
      return true
    } catch (error) {
      console.error('Error adding item to inventory:', error)
      return false
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const success = inventoryStore.removeItem(itemId)
      
      if (success && process.env.NODE_ENV === 'production') {
        await $fetch('/api/inventory/remove', {
          method: 'DELETE',
          body: { itemId }
        })
      }
      
      return success
    } catch (error) {
      console.error('Error removing item from inventory:', error)
      return false
    }
  }

  const updateItem = async (itemId: string, updates: Partial<CSGOItem>) => {
    try {
      const success = inventoryStore.updateItem(itemId, updates)
      
      if (success && process.env.NODE_ENV === 'production') {
        await $fetch('/api/inventory/update', {
          method: 'PUT',
          body: { itemId, updates }
        })
      }
      
      return success
    } catch (error) {
      console.error('Error updating item in inventory:', error)
      return false
    }
  }

  // Search and filtering
  const findItem = (itemId: string) => {
    return inventoryStore.getItemById(itemId)
  }

  const searchItems = (query: string) => {
    return inventoryStore.filterItems({
      search: query
    })
  }

  const filterByRarity = (rarity: string) => {
    return inventoryStore.filterItems({
      rarity
    })
  }

  const filterByType = (type: string) => {
    return inventoryStore.filterItems({
      type
    })
  }

  const filterByPriceRange = (minPrice: number, maxPrice: number) => {
    return inventoryStore.filterItems({
      minPrice,
      maxPrice
    })
  }

  const getExpensiveItems = (threshold = 100) => {
    return inventoryStore.filterItems({
      minPrice: threshold
    })
  }

  const getCheapItems = (threshold = 10) => {
    return inventoryStore.filterItems({
      maxPrice: threshold
    })
  }

  const getStatTrakItems = () => {
    return inventoryStore.filterItems({
      statTrak: true
    })
  }

  const getSouvenirItems = () => {
    return inventoryStore.filterItems({
      souvenir: true
    })
  }

  // Sorting utilities
  const sortByPrice = (ascending = false) => {
    return inventoryStore.sortItems(items.value, 'price', ascending ? 'asc' : 'desc')
  }

  const sortByName = (ascending = true) => {
    return inventoryStore.sortItems(items.value, 'name', ascending ? 'asc' : 'desc')
  }

  const sortByRarity = (ascending = false) => {
    return inventoryStore.sortItems(items.value, 'rarity', ascending ? 'asc' : 'desc')
  }

  // Bulk operations
  const bulkRemove = async (itemIds: string[]) => {
    const results = await Promise.allSettled(
      itemIds.map(id => removeItem(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length
    const failed = results.length - successful
    
    return { successful, failed, total: results.length }
  }

  const bulkUpdate = async (updates: Array<{ itemId: string; updates: Partial<CSGOItem> }>) => {
    const results = await Promise.allSettled(
      updates.map(({ itemId, updates }) => updateItem(itemId, updates))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length
    const failed = results.length - successful
    
    return { successful, failed, total: results.length }
  }

  // Trading utilities
  const getTradeableItems = () => {
    return items.value.filter(item => 
      !item.statTrak && // Assuming StatTrak items are more valuable/harder to trade
      item.price >= 1 && // Minimum trade value
      item.price <= 1000 // Maximum trade value for regular trades
    )
  }

  const calculateTradeValue = (itemIds: string[]) => {
    return itemIds.reduce((total, id) => {
      const item = findItem(id)
      return total + (item?.price || 0)
    }, 0)
  }

  const suggestTradeItems = (targetValue: number, tolerance = 0.1) => {
    const sortedItems = sortByPrice(true) // Ascending order
    const suggestions: CSGOItem[] = []
    let currentValue = 0
    const maxValue = targetValue * (1 + tolerance)
    const minValue = targetValue * (1 - tolerance)

    for (const item of sortedItems) {
      if (currentValue + item.price <= maxValue) {
        suggestions.push(item)
        currentValue += item.price
        
        if (currentValue >= minValue) {
          break
        }
      }
    }

    return {
      items: suggestions,
      totalValue: currentValue,
      difference: Math.abs(currentValue - targetValue)
    }
  }

  // Analytics and insights
  const getMostValuableItems = (count = 5) => {
    return sortByPrice().slice(0, count)
  }

  const getLeastValuableItems = (count = 5) => {
    return sortByPrice(true).slice(0, count)
  }

  const getAverageItemValue = () => {
    if (items.value.length === 0) return 0
    return totalValue.value / items.value.length
  }

  const getValueDistribution = () => {
    const ranges = [
      { min: 0, max: 10, label: 'Económicos ($0-10)' },
      { min: 10, max: 50, label: 'Medios ($10-50)' },
      { min: 50, max: 100, label: 'Buenos ($50-100)' },
      { min: 100, max: 500, label: 'Premium ($100-500)' },
      { min: 500, max: Infinity, label: 'Elite ($500+)' }
    ]

    return ranges.map(range => ({
      ...range,
      count: items.value.filter(item => 
        item.price >= range.min && item.price < range.max
      ).length,
      value: items.value
        .filter(item => item.price >= range.min && item.price < range.max)
        .reduce((sum, item) => sum + item.price, 0)
    }))
  }

  const getRarityDistribution = () => {
    const rarities = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert', 'contraband']
    
    return rarities.map(rarity => ({
      rarity,
      count: itemsByRarity.value[rarity]?.length || 0,
      value: itemsByRarity.value[rarity]?.reduce((sum, item) => sum + item.price, 0) || 0
    }))
  }

  // Price updates
  const updateItemPrices = async () => {
    const { getItemPrice } = useCSGOFloat()
    
    const updatePromises = items.value.map(async (item) => {
      try {
        const priceData = await getItemPrice(item.marketName)
        if (priceData && priceData.price !== item.price) {
          await updateItem(item.id, { price: priceData.price })
        }
      } catch (error) {
        console.warn(`Failed to update price for ${item.name}:`, error)
      }
    })

    await Promise.allSettled(updatePromises)
  }

  // Export/Import functionality
  const exportInventory = () => {
    const exportData = {
      items: items.value,
      totalValue: totalValue.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `csgo-inventory-${Date.now()}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  const importInventory = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Formato de archivo inválido')
      }
      
      // Clear current inventory
      inventoryStore.clearInventory()
      
      // Add imported items
      for (const item of data.items) {
        await addItem(item)
      }
      
      return true
    } catch (error) {
      console.error('Error importing inventory:', error)
      throw error
    }
  }

  // Refresh and sync
  const refreshInventory = async () => {
    try {
      await inventoryStore.loadInventory()
      return true
    } catch (error) {
      console.error('Error refreshing inventory:', error)
      return false
    }
  }

  const syncWithServer = async () => {
    if (process.env.NODE_ENV !== 'production') return
    
    try {
      const serverInventory = await $fetch('/api/inventory')
      // Compare and merge differences
      // This would be more complex in a real implementation
      inventoryStore.items = serverInventory.data || []
      inventoryStore.calculateTotalValue()
      return true
    } catch (error) {
      console.error('Error syncing with server:', error)
      return false
    }
  }

  // Auto-save functionality
  const setupAutoSave = () => {
    if (!process.client) return

    // Save on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        inventoryStore.saveToLocalStorage()
      }
    })

    // Save before page unload
    window.addEventListener('beforeunload', () => {
      inventoryStore.saveToLocalStorage()
    })
  }

  // Initialize
  onMounted(() => {
    inventoryStore.loadFromLocalStorage()
    setupAutoSave()
  })

  return {
    // State
    items,
    loading,
    totalValue,
    itemCount,
    stats,
    itemsByRarity,
    itemsByType,
    
    // Item management
    addItem,
    removeItem,
    updateItem,
    
    // Search and filtering
    findItem,
    searchItems,
    filterByRarity,
    filterByType,
    filterByPriceRange,
    getExpensiveItems,
    getCheapItems,
    getStatTrakItems,
    getSouvenirItems,
    
    // Sorting
    sortByPrice,
    sortByName,
    sortByRarity,
    
    // Bulk operations
    bulkRemove,
    bulkUpdate,
    
    // Trading
    getTradeableItems,
    calculateTradeValue,
    suggestTradeItems,
    
    // Analytics
    getMostValuableItems,
    getLeastValuableItems,
    getAverageItemValue,
    getValueDistribution,
    getRarityDistribution,
    
    // Utilities
    updateItemPrices,
    exportInventory,
    importInventory,
    refreshInventory,
    syncWithServer
  }
}