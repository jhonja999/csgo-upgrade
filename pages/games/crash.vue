<!-- pages/games/crash.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Crash</h1>
      <p class="text-xl text-gray-300">
        Cash out before it crashes!
      </p>
    </div>

    <!-- Game Area -->
    <div class="bg-gray-800 rounded-xl p-8">
      <!-- Multiplier Display -->
      <div class="text-center mb-8">
        <div 
          :class="[
            'text-8xl font-bold transition-all duration-300',
            gameState === 'playing' ? 'text-green-400 animate-pulse' : 
            gameState === 'crashed' ? 'text-red-400' : 'text-gray-400'
          ]"
        >
          {{ currentMultiplier.toFixed(2) }}x
        </div>
        
        <div v-if="gameState === 'waiting'" class="mt-4">
          <div class="text-2xl font-bold">{{ timeToNext }}s</div>
          <p class="text-gray-400">Next round starts in</p>
        </div>
      </div>

      <!-- Game History Chart -->
      <div class="h-32 bg-gray-700 rounded-lg mb-8 flex items-end justify-center space-x-1 px-4">
        <div 
          v-for="(point, index) in crashHistory" 
          :key="index"
          :style="{ height: `${Math.min(point * 10, 100)}%` }"
          :class="`w-4 rounded-t ${
            point >= 2 ? 'bg-green-400' : 
            point >= 1.5 ? 'bg-yellow-400' : 'bg-red-400'
          }`"
          :title="`${point.toFixed(2)}x`"
        />
      </div>

      <!-- Betting Interface -->
      <div v-if="gameState !== 'playing'" class="space-y-6">
        <!-- Bet Amount -->
        <div class="text-center">
          <input
            v-model.number="betAmount"
            type="number"
            placeholder="Bet amount..."
            min="0"
            step="0.01"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-center text-xl font-bold w-64"
          >
        </div>

        <!-- Quick Bet Controls -->
        <BetControls v-model="betAmount" />

        <!-- Bet Button -->
        <div class="text-center">
          <button
            @click="placeBet"
            :disabled="!canBet"
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-4 rounded-xl text-xl font-bold transition-colors"
          >
            Place Bet
          </button>
        </div>
      </div>

      <!-- Active Game Interface -->
      <div v-else class="space-y-6">
        <div class="text-center">
          <div class="text-lg mb-2">
            Your bet: <span class="font-bold">${{ playerBet.toFixed(2) }}</span>
          </div>
          <div class="text-lg mb-4">
            Current value: <span class="font-bold text-green-400">
              ${{ (playerBet * currentMultiplier).toFixed(2) }}
            </span>
          </div>
          
          <button
            @click="cashOut"
            :disabled="hasCashedOut"
            class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-8 py-4 rounded-xl text-xl font-bold transition-colors"
          >
            {{ hasCashedOut ? 'Cashed Out!' : 'Cash Out' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Last Crashes -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-center">Last Crashes</h3>
      <div class="flex justify-center space-x-2">
        <div 
          v-for="crash in crashHistory.slice(-10)" 
          :key="crash"
          :class="`px-3 py-2 rounded font-bold ${
            crash >= 10 ? 'bg-blue-600' :
            crash >= 5 ? 'bg-yellow-600' :
            crash >= 2 ? 'bg-green-600' : 'bg-red-600'
          }`"
        >
          {{ crash.toFixed(2) }}x
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hasEnoughBalance, placeBet: deductBalance, payoutWin } = useBalance()
const { playSound, sounds } = useAudio()

// Meta
useHead({
  title: 'Crash - CSGOLuck'
})

// Game State
const betAmount = ref(10)
const currentMultiplier = ref(1.00)
const gameState = ref<'waiting' | 'playing' | 'crashed'>('waiting')
const timeToNext = ref(15)
const playerBet = ref(0)
const hasCashedOut = ref(false)

const crashHistory = ref([
  2.34, 1.45, 8.92, 1.12, 3.67, 2.89, 1.34, 5.23, 1.89, 4.56
])

const canBet = computed(() => {
  return gameState.value === 'waiting' && betAmount.value > 0 && hasEnoughBalance(betAmount.value)
})

// Game Logic
const placeBet = () => {
  if (!canBet.value) return
  
  try {
    deductBalance(betAmount.value, 'crash', 'Crash bet')
    playerBet.value = betAmount.value
    playSound(sounds.bet)
  } catch (error) {
    console.error('Bet failed:', error)
  }
}

const cashOut = () => {
  if (hasCashedOut.value || gameState.value !== 'playing') return
  
  const winAmount = playerBet.value * currentMultiplier.value
  payoutWin(winAmount, 'crash', `Cashed out at ${currentMultiplier.value.toFixed(2)}x`)
  hasCashedOut.value = true
  playSound(sounds.win)
}

const startGame = () => {
  gameState.value = 'playing'
  currentMultiplier.value = 1.00
  hasCashedOut.value = false
  
  // Generate random crash point
  const crashPoint = 1 + Math.random() * 10
  
  const gameInterval = setInterval(() => {
    if (currentMultiplier.value >= crashPoint) {
      // Crash!
      gameState.value = 'crashed'
      crashHistory.value.push(crashPoint)
      
      clearInterval(gameInterval)
      
      // Reset for next round
      setTimeout(() => {
        gameState.value = 'waiting'
        timeToNext.value = 15
        playerBet.value = 0
        startCountdown()
      }, 3000)
      
      return
    }
    
    // Increase multiplier
    currentMultiplier.value += 0.01
  }, 100)
}

const startCountdown = () => {
  const countdown = setInterval(() => {
    timeToNext.value--
    
    if (timeToNext.value <= 0) {
      clearInterval(countdown)
      startGame()
    }
  }, 1000)
}

// Initialize
onMounted(() => {
  startCountdown()
})
</script>
