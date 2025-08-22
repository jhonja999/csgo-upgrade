<!-- pages/casino/slots.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Mega Slots</h1>
      <p class="text-xl text-gray-300">
        Spin the reels and win big!
      </p>
    </div>

    <!-- Slot Machine -->
    <div class="bg-gray-800 rounded-xl p-8">
      <!-- Balance & Bet Controls -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-4 mb-4">
          <div class="bg-gray-700 px-4 py-2 rounded-lg">
            <span class="text-sm text-gray-400">Balance:</span>
            <span class="text-lg font-bold text-green-400 ml-2">${{ balance.toFixed(2) }}</span>
          </div>
          
          <div class="bg-gray-700 px-4 py-2 rounded-lg">
            <span class="text-sm text-gray-400">Bet:</span>
            <span class="text-lg font-bold text-blue-400 ml-2">${{ betAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Bet Amount Input -->
        <div class="mb-4">
          <input
            v-model.number="betAmount"
            type="number"
            min="0.10"
            max="100"
            step="0.10"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-center text-xl font-bold w-32"
          >
        </div>

        <!-- Quick Bet Controls -->
        <BetControls v-model="betAmount" />
      </div>

      <!-- Slot Reels -->
      <div class="bg-gray-900 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          <div 
            v-for="(reel, reelIndex) in reels" 
            :key="reelIndex"
            class="bg-gray-800 rounded-lg p-4 text-center border-2 border-gray-700"
          >
            <div 
              :class="[
                'text-6xl transition-all duration-500',
                isSpinning ? 'animate-bounce' : ''
              ]"
            >
              {{ reel.symbol }}
            </div>
            <div class="text-xs text-gray-400 mt-2">{{ reel.name }}</div>
          </div>
        </div>

        <!-- Paylines -->
        <div class="mt-6">
          <div class="text-center text-sm text-gray-400 mb-2">Active Paylines</div>
          <div class="flex justify-center space-x-1">
            <div 
              v-for="line in 5" 
              :key="line"
              :class="`w-3 h-3 rounded-full ${
                line <= activePaylines ? 'bg-yellow-400' : 'bg-gray-600'
              }`"
            />
          </div>
        </div>
      </div>

      <!-- Spin Button -->
      <div class="text-center mb-6">
        <button
          @click="spin"
          :disabled="!canSpin"
          :class="[
            'px-12 py-4 rounded-xl text-2xl font-bold transition-all duration-200',
            canSpin 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          ]"
        >
          {{ isSpinning ? 'SPINNING...' : 'SPIN' }}
        </button>
      </div>

      <!-- Win Display -->
      <div v-if="lastWin > 0" class="text-center mb-6">
        <div class="text-3xl font-bold text-yellow-400 animate-pulse">
          WIN: ${{ lastWin.toFixed(2) }}
        </div>
        <div class="text-lg text-gray-300">
          {{ lastWinMultiplier }}x Multiplier
        </div>
      </div>
    </div>

    <!-- Paytable -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Paytable</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-bold mb-4">Symbol Payouts (5 in a row)</h3>
          <div class="space-y-3">
            <div 
              v-for="symbol in paytable" 
              :key="symbol.name"
              class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{{ symbol.icon }}</span>
                <span class="font-semibold">{{ symbol.name }}</span>
              </div>
              <div class="text-right">
                <div class="font-bold text-yellow-400">{{ symbol.payout }}x</div>
                <div class="text-xs text-gray-400">Bet Multiplier</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4">Special Features</h3>
          <div class="space-y-3">
            <div class="p-3 bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-3 mb-2">
                <span class="text-2xl">🎰</span>
                <span class="font-semibold">Jackpot</span>
              </div>
              <p class="text-sm text-gray-300">5 Jackpot symbols = 1000x bet</p>
            </div>
            
            <div class="p-3 bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-3 mb-2">
                <span class="text-2xl">⭐</span>
                <span class="font-semibold">Wild Symbol</span>
              </div>
              <p class="text-sm text-gray-300">Substitutes for any symbol</p>
            </div>
            
            <div class="p-3 bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-3 mb-2">
                <span class="text-2xl">💎</span>
                <span class="font-semibold">Scatter</span>
              </div>
              <p class="text-sm text-gray-300">3+ anywhere = bonus round</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Your Slots Statistics</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400">{{ stats.spins }}</div>
          <div class="text-sm text-gray-400">Total Spins</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">${{ stats.totalWagered.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Wagered</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-400">${{ stats.biggestWin.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Biggest Win</div>
        </div>
        
        <div class="text-center">
          <div 
            :class="`text-3xl font-bold ${
              stats.totalReturn >= stats.totalWagered ? 'text-green-400' : 'text-red-400'
            }`"
          >
            {{ stats.totalReturn >= stats.totalWagered ? '+' : '' }}${{ (stats.totalReturn - stats.totalWagered).toFixed(2) }}
          </div>
          <div class="text-sm text-gray-400">Net P&L</div>
        </div>
      </div>
      
      <!-- RTP Display -->
      <div class="mt-6 text-center">
        <div class="text-lg">
          <span class="text-gray-400">Return to Player: </span>
          <span class="font-bold text-blue-400">
            {{ stats.spins > 0 ? ((stats.totalReturn / stats.totalWagered) * 100).toFixed(1) : 96.5 }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Wins -->
    <div v-if="recentWins.length > 0" class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Recent Wins</h2>
      
      <div class="space-y-3">
        <div 
          v-for="win in recentWins.slice(0, 10)" 
          :key="win.id"
          class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="flex space-x-1">
              <span v-for="symbol in win.combination" :key="symbol" class="text-lg">{{ symbol }}</span>
            </div>
            <div>
              <div class="font-semibold">{{ win.type }}</div>
              <div class="text-sm text-gray-400">{{ formatTimeAgo(win.timestamp) }}</div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-bold text-yellow-400">${{ win.amount.toFixed(2) }}</div>
            <div class="text-sm text-gray-400">{{ win.multiplier }}x</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hasEnoughBalance, placeBet, payoutWin } = useBalance()
const { balance } = useBalance()
const { playSound, sounds } = useAudio()

// Meta
useHead({
  title: 'Mega Slots - CSGOLuck'
})

// State
const betAmount = ref(1.00)
const isSpinning = ref(false)
const lastWin = ref(0)
const lastWinMultiplier = ref('')
const activePaylines = ref(5)

// Reels
const reels = ref([
  { symbol: '🍒', name: 'Cherry' },
  { symbol: '🍋', name: 'Lemon' },
  { symbol: '🍇', name: 'Grape' },
  { symbol: '🔔', name: 'Bell' },
  { symbol: '⭐', name: 'Star' }
])

// Symbols with their weights and payouts
const symbols = [
  { icon: '🍒', name: 'Cherry', weight: 25, payout: 5 },
  { icon: '🍋', name: 'Lemon', weight: 20, payout: 10 },
  { icon: '🍇', name: 'Grape', weight: 15, payout: 20 },
  { icon: '🔔', name: 'Bell', weight: 12, payout: 50 },
  { icon: '⭐', name: 'Star', weight: 10, payout: 100 },
  { icon: '💎', name: 'Diamond', weight: 8, payout: 200 },
  { icon: '🎰', name: 'Jackpot', weight: 2, payout: 1000 }
]

const paytable = computed(() => symbols.filter(s => s.name !== 'Jackpot'))

// Statistics
const stats = ref({
  spins: 0,
  totalWagered: 0,
  totalReturn: 0,
  biggestWin: 0
})

const recentWins = ref<Array<{
  id: number
  combination: string[]
  amount: number
  multiplier: number
  type: string
  timestamp: Date
}>>([])

// Computed
const canSpin = computed(() => {
  return !isSpinning.value && betAmount.value > 0 && hasEnoughBalance(betAmount.value)
})

// Methods
const spin = async () => {
  if (!canSpin.value) return
  
  isSpinning.value = true
  lastWin.value = 0
  
  try {
    // Deduct bet
    placeBet(betAmount.value, 'slots', 'Slot spin')
    playSound(sounds.spin)
    
    // Update stats
    stats.value.spins++
    stats.value.totalWagered += betAmount.value
    
    // Simulate spin animation
    const spinDuration = 2000
    const spinInterval = setInterval(() => {
      reels.value.forEach(reel => {
        reel.symbol = getRandomSymbol().icon
        reel.name = getRandomSymbol().name
      })
    }, 100)
    
    // Stop spinning and calculate result
    setTimeout(() => {
      clearInterval(spinInterval)
      
      // Generate final result
      const result = generateSpinResult()
      reels.value = result.reels
      
      if (result.win > 0) {
        lastWin.value = result.win
        lastWinMultiplier.value = result.multiplier
        
        // Pay out win
        payoutWin(result.win, 'slots', `Slots win: ${result.multiplier}`)
        playSound(sounds.win)
        
        // Update stats
        stats.value.totalReturn += result.win
        if (result.win > stats.value.biggestWin) {
          stats.value.biggestWin = result.win
        }
        
        // Add to recent wins
        recentWins.value.unshift({
          id: Date.now(),
          combination: result.reels.map(r => r.symbol),
          amount: result.win,
          multiplier: parseFloat(result.multiplier.replace('x', '')),
          type: result.winType,
          timestamp: new Date()
        })
        
        // Keep only last 20 wins
        if (recentWins.value.length > 20) {
          recentWins.value = recentWins.value.slice(0, 20)
        }
      }
      
      isSpinning.value = false
    }, spinDuration)
    
  } catch (error) {
    console.error('Spin failed:', error)
    isSpinning.value = false
  }
}

const getRandomSymbol = () => {
  const totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const symbol of symbols) {
    random -= symbol.weight
    if (random <= 0) {
      return symbol
    }
  }
  
  return symbols[0]
}

const generateSpinResult = () => {
  const resultReels = []
  
  // Generate symbols for each reel
  for (let i = 0; i < 5; i++) {
    const symbol = getRandomSymbol()
    resultReels.push({
      symbol: symbol.icon,
      name: symbol.name
    })
  }
  
  // Check for wins
  const symbolCounts = {}
  resultReels.forEach(reel => {
    const symbolName = reel.name
    symbolCounts[symbolName] = (symbolCounts[symbolName] || 0) + 1
  })
  
  let win = 0
  let multiplier = '0x'
  let winType = 'No Win'
  
  // Check for 5 of a kind
  for (const [symbolName, count] of Object.entries(symbolCounts)) {
    if (count === 5) {
      const symbol = symbols.find(s => s.name === symbolName)
      if (symbol) {
        win = betAmount.value * symbol.payout
        multiplier = `${symbol.payout}x`
        winType = `5 ${symbolName}s`
        break
      }
    }
  }
  
  // Check for 4 of a kind (lower payout)
  if (win === 0) {
    for (const [symbolName, count] of Object.entries(symbolCounts)) {
      if (count === 4) {
        const symbol = symbols.find(s => s.name === symbolName)
        if (symbol) {
          win = betAmount.value * (symbol.payout * 0.3)
          multiplier = `${(symbol.payout * 0.3).toFixed(1)}x`
          winType = `4 ${symbolName}s`
          break
        }
      }
    }
  }
  
  // Check for 3 of a kind (even lower payout)
  if (win === 0) {
    for (const [symbolName, count] of Object.entries(symbolCounts)) {
      if (count === 3) {
        const symbol = symbols.find(s => s.name === symbolName)
        if (symbol) {
          win = betAmount.value * (symbol.payout * 0.1)
          multiplier = `${(symbol.payout * 0.1).toFixed(1)}x`
          winType = `3 ${symbolName}s`
          break
        }
      }
    }
  }
  
  return {
    reels: resultReels,
    win,
    multiplier,
    winType
  }
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

// Load stats from localStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem('slots-stats')
    if (saved) {
      const data = JSON.parse(saved)
      stats.value = data.stats || stats.value
      recentWins.value = (data.recentWins || []).map((win: any) => ({
        ...win,
        timestamp: new Date(win.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to load slots stats:', error)
  }
})

// Save stats when they change
watch([stats, recentWins], () => {
  try {
    localStorage.setItem('slots-stats', JSON.stringify({
      stats: stats.value,
      recentWins: recentWins.value
    }))
  } catch (error) {
    console.error('Failed to save slots stats:', error)
  }
}, { deep: true })
</script>

<style scoped>
@keyframes spin-reel {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

.animate-spin-reel {
  animation: spin-reel 0.1s ease-in-out infinite;
}
</style>
