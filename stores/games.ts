// stores/games.ts
export const useGamesStore = defineStore('games', () => {
  // State
  const activeGame = ref<string | null>(null)
  const gameHistory = ref<GameHistoryEntry[]>([])
  const gameStats = ref<GameStats>({
    totalGamesPlayed: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    favoriteGame: null,
    winRate: 0,
    profitLoss: 0
  })

  // Game Results Storage
  const rouletteHistory = ref<RouletteResult[]>([])
  const coinflipHistory = ref<CoinflipResult[]>([])
  const crashHistory = ref<CrashResult[]>([])
  
  // Current Game States
  const currentBets = ref<GameBet[]>([])
  const isPlaying = ref(false)

  // Getters
  const getGameStats = computed(() => gameStats.value)
  
  const getGameHistory = computed(() => 
    gameHistory.value.slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  )
  
  const getRecentResults = computed(() => (game: string, limit = 10) => {
    switch (game) {
      case 'roulette':
        return rouletteHistory.value.slice(-limit).reverse()
      case 'coinflip':
        return coinflipHistory.value.slice(-limit).reverse()
      case 'crash':
        return crashHistory.value.slice(-limit).reverse()
      default:
        return []
    }
  })

  const getTotalBetAmount = computed(() => 
    currentBets.value.reduce((sum, bet) => sum + bet.amount, 0)
  )

  // Actions
  const setActiveGame = (game: string | null) => {
    activeGame.value = game
  }

  const addGameResult = (result: GameResult) => {
    // Add to game history
    const historyEntry: GameHistoryEntry = {
      id: Date.now().toString(),
      game: result.game,
      betAmount: result.betAmount,
      winAmount: result.winAmount,
      multiplier: result.multiplier || (result.winAmount / result.betAmount),
      timestamp: new Date(),
      result: result.won ? 'win' : 'loss'
    }
    
    gameHistory.value.push(historyEntry)
    
    // Add to specific game history
    switch (result.game) {
      case 'roulette':
        rouletteHistory.value.push({
          id: historyEntry.id,
          multiplier: result.multiplier || 1,
          betAmount: result.betAmount,
          winAmount: result.winAmount,
          timestamp: historyEntry.timestamp
        })
        break
      case 'coinflip':
        coinflipHistory.value.push({
          id: historyEntry.id,
          side: result.side || 'red',
          betAmount: result.betAmount,
          winAmount: result.winAmount,
          won: result.won,
          timestamp: historyEntry.timestamp
        })
        break
      case 'crash':
        crashHistory.value.push({
          id: historyEntry.id,
          crashPoint: result.multiplier || 1,
          cashOutAt: result.cashOutAt,
          betAmount: result.betAmount,
          winAmount: result.winAmount,
          timestamp: historyEntry.timestamp
        })
        break
    }
    
    // Update stats
    updateGameStats(result)
    
    // Keep only last 100 entries per game
    if (gameHistory.value.length > 100) {
      gameHistory.value = gameHistory.value.slice(-100)
    }
    if (rouletteHistory.value.length > 50) {
      rouletteHistory.value = rouletteHistory.value.slice(-50)
    }
    if (coinflipHistory.value.length > 50) {
      coinflipHistory.value = coinflipHistory.value.slice(-50)
    }
    if (crashHistory.value.length > 50) {
      crashHistory.value = crashHistory.value.slice(-50)
    }
  }

  const addBet = (bet: GameBet) => {
    currentBets.value.push(bet)
  }

  const removeBet = (betId: string) => {
    const index = currentBets.value.findIndex(bet => bet.id === betId)
    if (index > -1) {
      currentBets.value.splice(index, 1)
    }
  }

  const clearBets = () => {
    currentBets.value = []
  }

  const updateGameStats = (result: GameResult) => {
    gameStats.value.totalGamesPlayed++
    gameStats.value.totalWagered += result.betAmount
    gameStats.value.totalWon += result.winAmount
    gameStats.value.profitLoss = gameStats.value.totalWon - gameStats.value.totalWagered
    
    if (result.winAmount > gameStats.value.biggestWin) {
      gameStats.value.biggestWin = result.winAmount
    }
    
    // Calculate win rate
    const wins = gameHistory.value.filter(entry => entry.result === 'win').length
    gameStats.value.winRate = gameStats.value.totalGamesPlayed > 0 
      ? (wins / gameStats.value.totalGamesPlayed) * 100 
      : 0
    
    // Update favorite game
    const gameCounts = gameHistory.value.reduce((acc, entry) => {
      acc[entry.game] = (acc[entry.game] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    gameStats.value.favoriteGame = Object.entries(gameCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null
  }

  const resetStats = () => {
    gameStats.value = {
      totalGamesPlayed: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      favoriteGame: null,
      winRate: 0,
      profitLoss: 0
    }
    gameHistory.value = []
    rouletteHistory.value = []
    coinflipHistory.value = []
    crashHistory.value = []
  }

  const loadGameData = () => {
    // Load from localStorage or API
    try {
      const saved = localStorage.getItem('csgo-upgrade-games')
      if (saved) {
        const data = JSON.parse(saved)
        gameStats.value = data.stats || gameStats.value
        gameHistory.value = (data.history || []).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
        rouletteHistory.value = (data.rouletteHistory || []).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
        coinflipHistory.value = (data.coinflipHistory || []).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
        crashHistory.value = (data.crashHistory || []).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to load game data:', error)
    }
  }

  const saveGameData = () => {
    // Save to localStorage
    try {
      const data = {
        stats: gameStats.value,
        history: gameHistory.value,
        rouletteHistory: rouletteHistory.value,
        coinflipHistory: coinflipHistory.value,
        crashHistory: crashHistory.value
      }
      localStorage.setItem('csgo-upgrade-games', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save game data:', error)
    }
  }

  // Auto-save when data changes
  watch([gameStats, gameHistory, rouletteHistory, coinflipHistory, crashHistory], () => {
    saveGameData()
  }, { deep: true })

  return {
    // State
    activeGame: readonly(activeGame),
    gameHistory: readonly(gameHistory),
    gameStats: readonly(gameStats),
    rouletteHistory: readonly(rouletteHistory),
    coinflipHistory: readonly(coinflipHistory),
    crashHistory: readonly(crashHistory),
    currentBets: readonly(currentBets),
    isPlaying: readonly(isPlaying),
    
    // Getters
    getGameStats,
    getGameHistory,
    getRecentResults,
    getTotalBetAmount,
    
    // Actions
    setActiveGame,
    addGameResult,
    addBet,
    removeBet,
    clearBets,
    updateGameStats,
    resetStats,
    loadGameData,
    saveGameData
  }
})

// Types
interface GameHistoryEntry {
  id: string
  game: string
  betAmount: number
  winAmount: number
  multiplier: number
  timestamp: Date
  result: 'win' | 'loss'
}

interface GameStats {
  totalGamesPlayed: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  favoriteGame: string | null
  winRate: number
  profitLoss: number
}

interface GameResult {
  game: string
  betAmount: number
  winAmount: number
  won: boolean
  multiplier?: number
  side?: string
  cashOutAt?: number
}

interface GameBet {
  id: string
  game: string
  amount: number
  target?: string | number
  timestamp: Date
}

interface RouletteResult {
  id: string
  multiplier: number
  betAmount: number
  winAmount: number
  timestamp: Date
}

interface CoinflipResult {
  id: string
  side: string
  betAmount: number
  winAmount: number
  won: boolean
  timestamp: Date
}

interface CrashResult {
  id: string
  crashPoint: number
  cashOutAt?: number
  betAmount: number
  winAmount: number
  timestamp: Date
}
