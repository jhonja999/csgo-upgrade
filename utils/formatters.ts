// Formatting utilities for the CSGO Upgrade application

// Currency formatting
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Compact currency formatting for large numbers
export function formatCompactCurrency(
  amount: number, 
  currency: string = 'USD'
): string {
  if (amount >= 1000000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `${currency === 'USD' ? '$' : ''}${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount, currency)
}

// Number formatting
export function formatNumber(
  number: number, 
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(number)
}

// Percentage formatting
export function formatPercentage(
  value: number, 
  decimals: number = 1
): string {
  return `${value.toFixed(decimals)}%`
}

// Probability formatting
export function formatProbability(probability: number): string {
  if (probability < 0.01) {
    return '<0.01%'
  } else if (probability >= 99.99) {
    return '>99.99%'
  }
  return `${(probability * 100).toFixed(2)}%`
}

// Time formatting
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} año${years > 1 ? 's' : ''}`
  if (months > 0) return `${months} mes${months > 1 ? 'es' : ''}`
  if (weeks > 0) return `${weeks} semana${weeks > 1 ? 's' : ''}`
  if (days > 0) return `${days} día${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''}`
  if (seconds > 5) return `${seconds}s`
  return 'Ahora'
}

// Duration formatting
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  } else {
    return `0:${seconds.toString().padStart(2, '0')}`
  }
}

// Date formatting
export function formatDate(
  date: Date | number, 
  locale: string = 'es-ES',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(dateObj)
}

// DateTime formatting
export function formatDateTime(
  date: Date | number,
  locale: string = 'es-ES'
): string {
  return formatDate(date, locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Item name formatting
export function formatItemName(itemName: string, maxLength: number = 30): string {
  if (itemName.length <= maxLength) return itemName
  
  // Try to break at sensible points
  const parts = itemName.split(' | ')
  if (parts.length > 1) {
    const weapon = parts[0]
    const skin = parts[1]
    
    if (weapon.length + 3 < maxLength) {
      const remainingLength = maxLength - weapon.length - 3
      return `${weapon} | ${skin.substring(0, remainingLength)}...`
    }
  }
  
  return `${itemName.substring(0, maxLength - 3)}...`
}

// Rarity name formatting
export function formatRarityName(rarity: string): string {
  const rarityNames: Record<string, string> = {
    'consumer': 'Consumer Grade',
    'industrial': 'Industrial Grade',
    'milspec': 'Mil-Spec',
    'restricted': 'Restricted',
    'classified': 'Classified',
    'covert': 'Covert',
    'contraband': 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

// Weapon type formatting
export function formatWeaponType(type: string): string {
  const typeNames: Record<string, string> = {
    'rifle': 'Rifles',
    'pistol': 'Pistolas',
    'sniper': 'Francotiradores',
    'shotgun': 'Escopetas',
    'smg': 'SMGs',
    'machinegun': 'Ametralladoras',
    'knife': 'Cuchillos',
    'gloves': 'Guantes'
  }
  
  return typeNames[type] || type
}

// File size formatting
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Multiplier formatting
export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(2)}x`
}

// Price change formatting
export function formatPriceChange(
  oldPrice: number, 
  newPrice: number
): { change: number; percentage: number; isPositive: boolean } {
  const change = newPrice - oldPrice
  const percentage = oldPrice > 0 ? (change / oldPrice) * 100 : 0
  
  return {
    change: parseFloat(change.toFixed(2)),
    percentage: parseFloat(percentage.toFixed(2)),
    isPositive: change >= 0
  }
}

// Hash formatting (for item IDs, etc.)
export function formatHash(hash: string, length: number = 8): string {
  if (hash.length <= length) return hash
  return `${hash.substring(0, length)}...`
}

// Username formatting
export function formatUsername(username: string, maxLength: number = 16): string {
  if (username.length <= maxLength) return username
  return `${username.substring(0, maxLength - 3)}...`
}

// Transaction type formatting
export function formatTransactionType(type: string): string {
  const typeNames: Record<string, string> = {
    'deposit': 'Depósito',
    'withdraw': 'Retiro',
    'win': 'Victoria',
    'loss': 'Pérdida',
    'upgrade_win': 'Upgrade Exitoso',
    'upgrade_loss': 'Upgrade Fallido',
    'trade': 'Intercambio',
    'transfer': 'Transferencia'
  }
  
  return typeNames[type] || type
}

// Game result formatting
export function formatGameResult(
  result: { win: boolean; profit: number; multiplier?: number }
): string {
  if (result.win) {
    const multiplierText = result.multiplier ? ` (${formatMultiplier(result.multiplier)})` : ''
    return `Victoria: +${formatCurrency(result.profit)}${multiplierText}`
  } else {
    return `Pérdida: ${formatCurrency(result.profit)}`
  }
}

// Validation message formatting
export function formatValidationError(field: string, error: string): string {
  const fieldNames: Record<string, string> = {
    'email': 'Email',
    'username': 'Nombre de usuario',
    'password': 'Contraseña',
    'amount': 'Cantidad',
    'multiplier': 'Multiplicador'
  }
  
  const fieldName = fieldNames[field] || field
  return `${fieldName}: ${error}`
}

// URL formatting
export function formatSteamProfileUrl(steamId: string): string {
  return `https://steamcommunity.com/profiles/${steamId}`
}

export function formatTradeUrl(partnerId: string, token: string): string {
  return `https://steamcommunity.com/tradeoffer/new/?partner=${partnerId}&token=${token}`
}

// Search term highlighting
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Status formatting
export function formatStatus(status: string): { text: string; color: string } {
  const statusMap: Record<string, { text: string; color: string }> = {
    'online': { text: 'En línea', color: 'text-green-400' },
    'offline': { text: 'Desconectado', color: 'text-gray-400' },
    'away': { text: 'Ausente', color: 'text-yellow-400' },
    'busy': { text: 'Ocupado', color: 'text-red-400' },
    'pending': { text: 'Pendiente', color: 'text-yellow-400' },
    'completed': { text: 'Completado', color: 'text-green-400' },
    'failed': { text: 'Fallido', color: 'text-red-400' },
    'cancelled': { text: 'Cancelado', color: 'text-gray-400' }
  }
  
  return statusMap[status] || { text: status, color: 'text-gray-400' }
}

// Color utilities
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'consumer': '#b0c3d9',
    'industrial': '#5e98d9',
    'milspec': '#4b69ff',
    'restricted': '#8847ff',
    'classified': '#d32ce6',
    'covert': '#eb4b4b',
    'contraband': '#e4ae39'
  }
  
  return colors[rarity] || '#9ca3af'
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'rifle': '#ef4444',
    'pistol': '#3b82f6',
    'sniper': '#10b981',
    'knife': '#f59e0b',
    'gloves': '#8b5cf6'
  }
  
  return colors[type] || '#6b7280'
}

// Text utilities
export function capitalizeFirst(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function camelToKebab(text: string): string {
  return text.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function kebabToCamel(text: string): string {
  return text.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Validation
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}