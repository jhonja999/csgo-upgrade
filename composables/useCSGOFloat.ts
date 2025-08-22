import type { CSGOFloatApiResponse, CSGOFloatItem, CSGOItem } from '~/types'

export const useCSGOFloat = () => {
  const config = useRuntimeConfig()
  
  // Estado reactivo
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<number>(0)
  
  // Cache simple
  const cache = new Map<string, { data: any; timestamp: number }>()
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
  
  // Headers para la API
  const getHeaders = () => ({
    'Authorization': `Bearer ${config.csgofloatApiKey}`,
    'Content-Type': 'application/json'
  })
  
  // Función para verificar cache
  const getCachedData = (key: string) => {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }
  
  // Función para guardar en cache
  const setCachedData = (key: string, data: any) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  // Obtener items de CSGOFloat
  const getItems = async (params: {
    search?: string
    min_price?: number
    max_price?: number
    rarity?: string
    type?: string
    limit?: number
    offset?: number
  } = {}) => {
    const cacheKey = `items-${JSON.stringify(params)}`
    const cached = getCachedData(cacheKey)
    
    if (cached) {
      return cached
    }
    
    loading.value = true
    error.value = null
    
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, value.toString())
        }
      })
      
      // En desarrollo, usar mock data
      if (process.dev) {
        const mockData = generateMockItems(params.limit || 50)
        setCachedData(cacheKey, mockData)
        return mockData
      }
      
      const response = await $fetch<CSGOFloatApiResponse>(`/api/csgofloat/items?${query}`)
      
      if (response.success) {
        const transformedData = response.data.map(transformCSGOFloatItem)
        setCachedData(cacheKey, transformedData)
        lastUpdate.value = Date.now()
        return transformedData
      } else {
        throw new Error('Error al obtener items de CSGOFloat')
      }
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching CSGOFloat items:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Obtener precio de un item específico
  const getItemPrice = async (marketHashName: string) => {
    const cacheKey = `price-${marketHashName}`
    const cached = getCachedData(cacheKey)
    
    if (cached) {
      return cached
    }
    
    try {
      if (process.dev) {
        // Mock price para desarrollo
        const mockPrice = {
          price: Math.random() * 100 + 10,
          currency: 'USD',
          timestamp: Date.now()
        }
        setCachedData(cacheKey, mockPrice)
        return mockPrice
      }
      
      const response = await $fetch(`/api/csgofloat/price/${encodeURIComponent(marketHashName)}`)
      setCachedData(cacheKey, response)
      return response
      
    } catch (err) {
      console.error('Error fetching item price:', err)
      throw err
    }
  }
  
  // Transformar item de CSGOFloat API al formato interno
  const transformCSGOFloatItem = (item: CSGOFloatItem): CSGOItem => {
    return {
      id: item.id,
      name: item.market_hash_name,
      marketName: item.market_hash_name,
      price: item.suggested_price || item.mean_price || 0,
      imageUrl: item.preview || '/placeholder-item.jpg',
      rarity: inferRarityFromName(item.market_hash_name),
      type: inferTypeFromName(item.market_hash_name),
      category: 'weapon',
      exterior: extractExterior(item.market_hash_name),
      statTrak: item.market_hash_name.includes('StatTrak™'),
      souvenir: item.market_hash_name.includes('Souvenir')
    }
  }
  
  // Inferir rareza del nombre del item
  const inferRarityFromName = (name: string): any => {
    const rarityKeywords = {
      'Dragon Lore': 'covert',
      'Medusa': 'covert',
      'Howl': 'contraband',
      'Fire Serpent': 'covert',
      'Asiimov': 'covert',
      'Redline': 'classified',
      'AK-47': 'classified',
      'AWP': 'covert'
    }
    
    for (const [keyword, rarity] of Object.entries(rarityKeywords)) {
      if (name.includes(keyword)) {
        return rarity
      }
    }
    
    // Rareza por defecto basada en el precio estimado
    return 'milspec'
  }
  
  // Inferir tipo del nombre del item
  const inferTypeFromName = (name: string): any => {
    const typeKeywords = {
      'AK-47': 'rifle',
      'M4A4': 'rifle',
      'M4A1-S': 'rifle',
      'AWP': 'sniper',
      'Glock-18': 'pistol',
      'USP-S': 'pistol',
      'Desert Eagle': 'pistol',
      'Knife': 'knife',
      'Karambit': 'knife',
      'Bayonet': 'knife'
    }
    
    for (const [keyword, type] of Object.entries(typeKeywords)) {
      if (name.includes(keyword)) {
        return type
      }
    }
    
    return 'rifle' // Por defecto
  }
  
  // Extraer exterior del nombre del item
  const extractExterior = (name: string): string | undefined => {
    const exteriors = [
      'Factory New',
      'Minimal Wear', 
      'Field-Tested',
      'Well-Worn',
      'Battle-Scarred'
    ]
    
    for (const exterior of exteriors) {
      if (name.includes(exterior)) {
        return exterior
      }
    }
    
    return undefined
  }
  
  // Generar datos mock para desarrollo
  const generateMockItems = (count: number): CSGOItem[] => {
    const items: CSGOItem[] = []
    const weapons = [
      'AK-47 | Redline',
      'AWP | Dragon Lore', 
      'M4A4 | Asiimov',
      'Glock-18 | Fade',
      'USP-S | Kill Confirmed',
      'Desert Eagle | Blaze'
    ]
    
    const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
    
    for (let i = 0; i < count; i++) {
      const weaponName = weapons[Math.floor(Math.random() * weapons.length)]
      const exterior = exteriors[Math.floor(Math.random() * exteriors.length)]
      const fullName = `${weaponName} (${exterior})`
      
      items.push({
        id: `mock-${i}`,
        name: fullName,
        marketName: fullName,
        price: Math.random() * 500 + 10,
        imageUrl: '/placeholder-item.jpg',
        rarity: inferRarityFromName(fullName),
        type: inferTypeFromName(fullName),
        category: 'weapon',
        exterior,
        statTrak: Math.random() > 0.8,
        souvenir: Math.random() > 0.9
      })
    }
    
    return items
  }
  
  // Limpiar cache
  const clearCache = () => {
    cache.clear()
  }
  
  return {
    // Estado
    loading: readonly(loading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),
    
    // Métodos
    getItems,
    getItemPrice,
    clearCache,
    transformCSGOFloatItem
  }
}