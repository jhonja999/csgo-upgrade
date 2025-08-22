import type { GameSession, RouletteGame, CoinflipGame, CrashGame } from '~/types'

export const useGameLogic = () => {
  // Store references
  const balanceStore = useBalanceStore()
  
  // Audio
  const { playWinSound, playLoseSound, playClickSound } = useAudio()

  // Game state
  const currentGame = ref<GameSession | null>(null)
  const gameHistory = ref<GameSession[]>([])
  const isPlaying = ref(false)

  // Roulette logic
  const playRoulette = async (bet: number, selection: { type: 'number' | 'color'; value: number | string }) => {
    if (!balanceStore.hasEnoughBalance(bet)) {
      throw new Error('Saldo insuficiente')
    }

    isPlaying.value = true
    const gameId = generateGameId()

    try {
      // Deduct bet
      balanceStore.subtractBalance(bet, 'loss', `Apuesta en Ruleta #${gameId}`)

      // Create game session
      const rouletteGame: RouletteGame = {
        id: gameId,
        type: 'roulette',
        bet,
        timestamp: Date.now(),
        selectedNumber: selection.type === 'number' ? selection.value as number : undefined,
        selectedColor: selection.type === 'color' ? selection.value as string : undefined
      }

      currentGame.value = rouletteGame

      // Simulate roulette spin (0-36)
      await new Promise(resolve => setTimeout(resolve, 3000)) // Spin animation time
      
      const winningNumber = Math.floor(Math.random() * 37)
      rouletteGame.winningNumber = winningNumber

      // Determine if player won
      let won = false
      let multiplier = 0

      if (selection.type === 'number' && selection.value === winningNumber) {
        won = true
        multiplier = 35 // 35:1 payout for single number
      } else if (selection.type === 'color') {
        const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber)
        const isBlack = winningNumber > 0 && !isRed
        
        if (
          (selection.value === 'red' && isRed) ||
          (selection.value === 'black' && isBlack) ||
          (selection.value === 'green' && winningNumber === 0)
        ) {
          won = true
          multiplier = selection.value === 'green' ? 35 : 1 // Green pays 35:1, red/black pays 1:1
        }
      }

      // Calculate winnings
      let payout = 0
      let profit = -bet

      if (won) {
        payout = bet * (multiplier + 1) // Include original bet
        profit = payout - bet
        balanceStore.addBalance(payout, 'win', `Victoria en Ruleta #${gameId}`)
        playWinSound()
      } else {
        playLoseSound()
      }

      // Update game result
      rouletteGame.result = {
        win: won,
        payout,
        profit,
        details: { winningNumber, multiplier }
      }

      gameHistory.value.unshift(rouletteGame)
      return rouletteGame

    } finally {
      isPlaying.value = false
      currentGame.value = null
    }
  }

  // Coinflip logic
  const playCoinflip = async (bet: number, selectedSide: 'heads' | 'tails') => {
    if (!balanceStore.hasEnoughBalance(bet)) {
      throw new Error('Saldo insuficiente')
    }

    isPlaying.value = true
    const gameId = generateGameId()

    try {
      // Deduct bet
      balanceStore.subtractBalance(bet, 'loss', `Apuesta en Coinflip #${gameId}`)

      // Create game session
      const coinflipGame: CoinflipGame = {
        id: gameId,
        type: 'coinflip',
        bet,
        selectedSide,
        timestamp: Date.now()
      }

      currentGame.value = coinflipGame

      // Simulate coin flip animation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = Math.random() < 0.5 ? 'heads' : 'tails'
      coinflipGame.result = result

      // Determine if player won (50/50 with slight house edge)
      const houseEdge = 0.02 // 2% house edge
      const actualWinChance = 0.5 - (houseEdge / 2)
      const won = selectedSide === result && Math.random() < (actualWinChance / 0.5)

      let payout = 0
      let profit = -bet

      if (won) {
        payout = bet * 1.96 // 96% payout (4% house edge)
        profit = payout - bet
        balanceStore.addBalance(payout, 'win', `Victoria en Coinflip #${gameId}`)
        playWinSound()
      } else {
        playLoseSound()
      }

      // Update game result
      coinflipGame.result = {
        win: won,
        payout,
        profit
      }

      gameHistory.value.unshift(coinflipGame)
      return coinflipGame

    } finally {
      isPlaying.value = false
      currentGame.value = null
    }
  }

  // Crash game logic
  const playCrash = async (bet: number, targetMultiplier: number = 2.0) => {
    if (!balanceStore.hasEnoughBalance(bet)) {
      throw new Error('Saldo insuficiente')
    }

    isPlaying.value = true
    const gameId = generateGameId()

    try {
      // Deduct bet
      balanceStore.subtractBalance(bet, 'loss', `Apuesta en Crash #${gameId}`)

      // Create game session
      const crashGame: CrashGame = {
        id: gameId,
        type: 'crash',
        bet,
        cashOutAt: targetMultiplier,
        cashedOut: false,
        timestamp: Date.now()
      }

      currentGame.value = crashGame

      // Generate crash point (using exponential distribution)
      const crashPoint = generateCrashPoint()
      crashGame.crashPoint = crashPoint

      // Simulate crash game progression
      let currentMultiplier = 1.0
      const incrementInterval = 100 // ms
      const incrementAmount = 0.01

      while (currentMultiplier < crashPoint && currentMultiplier < targetMultiplier) {
        await new Promise(resolve => setTimeout(resolve, incrementInterval))
        currentMultiplier += incrementAmount
      }

      // Determine result
      const won = currentMultiplier >= targetMultiplier
      let payout = 0
      let profit = -bet

      if (won) {
        crashGame.cashedOut = true
        payout = bet * targetMultiplier
        profit = payout - bet
        balanceStore.addBalance(payout, 'win', `Victoria en Crash #${gameId}`)
        playWinSound()
      } else {
        playLoseSound()
      }

      // Update game result
      crashGame.result = {
        win: won,
        payout,
        profit,
        details: { crashPoint, targetMultiplier }
      }

      gameHistory.value.unshift(crashGame)
      return crashGame

    } finally {
      isPlaying.value = false
      currentGame.value = null
    }
  }

  // Generate crash point using exponential distribution for fairness
  const generateCrashPoint = (): number => {
    const houseEdge = 0.01 // 1% house edge
    const random = Math.random()
    
    // Exponential distribution with house edge
    const crashPoint = (1 / (1 - houseEdge)) * (-Math.log(1 - random))
    
    // Ensure minimum of 1.0x and reasonable maximum
    return Math.max(1.0, Math.min(1000, parseFloat(crashPoint.toFixed(2))))
  }

  // Case opening logic (simplified)
  const openCase = async (caseType: string, casePrice: number) => {
    if (!balanceStore.hasEnoughBalance(casePrice)) {
      throw new Error('Saldo insuficiente')
    }

    isPlaying.value = true
    const gameId = generateGameId()

    try {
      // Deduct case price
      balanceStore.subtractBalance(casePrice, 'loss', `Apertura de ${caseType} #${gameId}`)

      // Simulate case opening animation
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Get random item from case (mock implementation)
      const wonItem = generateRandomCaseItem(caseType)
      const profit = wonItem.price - casePrice

      if (profit > 0) {
        balanceStore.addBalance(wonItem.price, 'win', `${wonItem.name} de ${caseType}`)
        playWinSound()
      } else {
        playLoseSound()
      }

      const caseSession = {
        id: gameId,
        type: 'case_opening' as const,
        bet: casePrice,
        timestamp: Date.now(),
        result: {
          win: profit > 0,
          payout: wonItem.price,
          profit,
          details: { wonItem, caseType }
        }
      }

      gameHistory.value.unshift(caseSession)
      return caseSession

    } finally {
      isPlaying.value = false
      currentGame.value = null
    }
  }

  // Generate random item from case (mock)
  const generateRandomCaseItem = (caseType: string) => {
    const rarityWeights = {
      consumer: 0.4,
      industrial: 0.3,
      milspec: 0.15,
      restricted: 0.08,
      classified: 0.04,
      covert: 0.025,
      contraband: 0.005
    }

    // Select rarity based on weights
    const random = Math.random()
    let cumulative = 0
    let selectedRarity = 'consumer'

    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulative += weight
      if (random <= cumulative) {
        selectedRarity = rarity
        break
      }
    }

    // Generate item based on rarity
    const priceRanges = {
      consumer: [0.1, 2],
      industrial: [1, 5],
      milspec: [3, 15],
      restricted: [10, 50],
      classified: [30, 150],
      covert: [100, 500],
      contraband: [500, 5000]
    }

    const [minPrice, maxPrice] = priceRanges[selectedRarity as keyof typeof priceRanges]
    const price = minPrice + Math.random() * (maxPrice - minPrice)

    return {
      id: generateItemId(),
      name: `Mock ${selectedRarity} Item`,
      marketName: `Mock ${selectedRarity} Item`,
      price: parseFloat(price.toFixed(2)),
      imageUrl: '/placeholder-item.jpg',
      rarity: selectedRarity,
      type: 'rifle',
      category: 'weapon'
    }
  }

  // Game statistics
  const getGameStats = (gameType?: string) => {
    let relevantGames = gameHistory.value

    if (gameType) {
      relevantGames = relevantGames.filter(game => game.type === gameType)
    }

    const totalGames = relevantGames.length
    const wins = relevantGames.filter(game => game.result?.win).length
    const totalWagered = relevantGames.reduce((sum, game) => sum + game.bet, 0)
    const totalWon = relevantGames.reduce((sum, game) => sum + (game.result?.payout || 0), 0)
    const netProfit = totalWon - totalWagered

    return {
      totalGames,
      wins,
      losses: totalGames - wins,
      winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
      totalWagered,
      totalWon,
      netProfit,
      averageBet: totalGames > 0 ? totalWagered / totalGames : 0,
      biggestWin: Math.max(...relevantGames.map(g => g.result?.profit || 0), 0)
    }
  }

  // Utility functions
  const generateGameId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const generateItemId = () => {
    return 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Load/save game history
  const saveGameHistory = () => {
    if (process.client) {
      localStorage.setItem('csgo-upgrade-game-history', JSON.stringify(gameHistory.value))
    }
  }

  const loadGameHistory = () => {
    if (process.client) {
      const saved = localStorage.getItem('csgo-upgrade-game-history')
      if (saved) {
        try {
          gameHistory.value = JSON.parse(saved)
        } catch (error) {
          console.error('Error loading game history:', error)
        }
      }
    }
  }

  // Auto-save functionality
  watch(gameHistory, saveGameHistory, { deep: true })

  // Initialize
  onMounted(() => {
    loadGameHistory()
  })

  return {
    // State
    currentGame: readonly(currentGame),
    gameHistory: readonly(gameHistory),
    isPlaying: readonly(isPlaying),

    // Game functions
    playRoulette,
    playCoinflip,
    playCrash,
    openCase,

    // Statistics
    getGameStats,

    // Utilities
    loadGameHistory,
    saveGameHistory
  }
}