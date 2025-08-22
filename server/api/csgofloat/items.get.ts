export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  // Validate API key
  if (!config.csgofloatApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CSGOFloat API key not configured'
    })
  }

  try {
    // Build CSGOFloat API URL
    const baseUrl = 'https://csgofloat.com/api/v1/listings'
    const searchParams = new URLSearchParams()

    // Map query parameters to CSGOFloat API format
    if (query.search) {
      searchParams.append('market_hash_name', query.search as string)
    }
    
    if (query.min_price) {
      searchParams.append('min_price', query.min_price as string)
    }
    
    if (query.max_price) {
      searchParams.append('max_price', query.max_price as string)
    }
    
    if (query.limit) {
      searchParams.append('limit', Math.min(Number(query.limit), 100).toString())
    } else {
      searchParams.append('limit', '50')
    }
    
    if (query.offset) {
      searchParams.append('offset', query.offset as string)
    }

    const apiUrl = `${baseUrl}?${searchParams}`

    // Make request to CSGOFloat API
    const response = await $fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${config.csgofloatApiKey}`,
        'User-Agent': 'CSGO-Upgrade-App/1.0'
      },
      timeout: 10000 // 10 second timeout
    })

    // Transform response if needed
    const transformedResponse = {
      success: true,
      data: response.data || response,
      pagination: response.pagination || null,
      timestamp: Date.now()
    }

    // Set cache headers (5 minutes)
    setHeader(event, 'Cache-Control', 'public, max-age=300')
    
    return transformedResponse

  } catch (error) {
    console.error('CSGOFloat API error:', error)
    
    // Return mock data in development
    if (process.dev) {
      return {
        success: true,
        data: generateMockCSGOFloatData(query),
        pagination: {
          page: 1,
          limit: 50,
          total: 1000,
          hasNext: true
        },
        timestamp: Date.now()
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch items from CSGOFloat'
    })
  }
})

// Generate mock data for development
function generateMockCSGOFloatData(query: any) {
  const mockItems = []
  const count = Math.min(Number(query.limit) || 50, 100)
  
  const weaponNames = [
    'AK-47 | Redline',
    'AWP | Dragon Lore',
    'M4A4 | Asiimov',
    'Glock-18 | Fade',
    'Desert Eagle | Blaze',
    'M4A1-S | Hyper Beast',
    'USP-S | Kill Confirmed',
    'AWP | Asiimov',
    'AK-47 | Fire Serpent',
    'Karambit | Fade'
  ]
  
  const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
  
  for (let i = 0; i < count; i++) {
    const weaponName = weaponNames[Math.floor(Math.random() * weaponNames.length)]
    const exterior = exteriors[Math.floor(Math.random() * exteriors.length)]
    const fullName = `${weaponName} (${exterior})`
    const price = Math.random() * 500 + 10
    
    mockItems.push({
      id: `mock-${i}`,
      market_hash_name: fullName,
      currency: 'USD',
      suggested_price: price,
      preview: '/placeholder-item.jpg',
      min_price: price * 0.9,
      max_price: price * 1.1,
      mean_price: price,
      quantity: Math.floor(Math.random() * 10) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  return mockItems
}