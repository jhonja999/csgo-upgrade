export interface User {
  id: string
  username: string
  email?: string
  avatar: string
  balance: number
  inventory: CSGOItem[]
  stats: UserStats
  preferences: UserPreferences
  createdAt: number
  lastLogin: number
}

export interface UserStats {
  totalUpgrades: number
  successfulUpgrades: number
  totalWagered: number
  totalWon: number
  totalLost: number
  biggestWin: number
  currentStreak: number
  longestStreak: number
  gamesPlayed: {
    roulette: number
    coinflip: number
    crash: number
    caseOpening: number
    upgrade: number
  }
}

export interface UserPreferences {
  soundEnabled: boolean
  musicEnabled: boolean
  animationsEnabled: boolean
  autoSellDuplicates: boolean
  currency: 'USD' | 'EUR' | 'GBP'
  language: 'en' | 'es' | 'pt' | 'ru'
  theme: 'dark' | 'light'
}

export interface UserInventory {
  items: CSGOItem[]
  totalValue: number
  lastUpdated: number
}