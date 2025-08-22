export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const marketHashName = getRouterParam(event, 'name')
  
  if (!marketHashName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Market hash name is required'
    })
  }

  // Validate API key
  if (!config.csgofloatApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CSGOFloat API key not configured'
    })
  }

  try {
    // Decode the market hash name
    const decodedName = decodeURIComponent(marketHashName)
    
    // Build CSGOFloat API URL for price lookup
    const apiUrl = `https://csgofloat.com/api/v1/items/${encodeURIComponent(decodedName)}/price`

    // Make request to CSGOFloat API
    const response = await $fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${config.csgofloatApiKey}`,
        'User-Agent': 'CSGO-Upgrade-App/1.0'
      },
      timeout: 10000
    })

    // Transform response
    const priceData = {
      item_name: decodedName,
      price: response.suggested_price || response.mean_price || 0,
      currency: response.currency || 'USD',
      timestamp: Date.now(),
      source: 'csgofloat',
      additional_data: {
        min_price: response.min_price,
        max_price: response.max_price,
        mean_price: response.mean_price,
        volume: response.volume || 0,
        last_updated: response.updated_at
      }
    }

    // Set cache headers (10 minutes for price data)
    setHeader(event, 'Cache-Control', 'public, max-age=600')
    
    return priceData

  } catch (error) {
    console.error('CSGOFloat price API error:', error)
    
    // Return mock price data in development
    if (process.dev) {
      const mockPrice = generateMockPrice(decodedName)
      
      return {
        item_name: decodedName,
        price: mockPrice,
        currency: 'USD',
        timestamp: Date.now(),
        source: 'mock',
        additional_data: {
          min_price: mockPrice * 0.9,
          max_price: mockPrice * 1.1,
          mean_price: mockPrice,
          volume: Math.floor(Math.random() * 100),
          last_updated: new Date().toISOString()
        }
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch price from CSGOFloat'
    })
  }
})

// Generate mock price based on item name
function generateMockPrice(itemName: string): number {
  // Simple hash function to get consistent prices for same items
  let hash = 0
  for (let i = 0; i < itemName.length; i++) {
    const char = itemName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use hash to generate price range
  const basePrice = Math.abs(hash) % 1000
  
  // Adjust price based on item characteristics
  let multiplier = 1
  
  if (itemName.includes('Dragon Lore')) multiplier = 50
  else if (itemName.includes('Howl')) multiplier = 20
  else if (itemName.includes('Fire Serpent')) multiplier = 15
  else if (itemName.includes('Karambit')) multiplier = 10
  else if (itemName.includes('AWP')) multiplier = 5
  else if (itemName.includes('AK-47')) multiplier = 3
  else if (itemName.includes('Factory New')) multiplier *= 2
  else if (itemName.includes('Battle-Scarred')) multiplier *= 0.5
  
  if (itemName.includes('StatTrak')) multiplier *= 2
  if (itemName.includes('Souvenir')) multiplier *= 1.5
  
  const finalPrice = (basePrice * multiplier) / 10
  
  // Ensure reasonable price range
  return Math.max(0.1, Math.min(10000, finalPrice))
}