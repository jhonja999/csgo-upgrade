<!-- pages/games/coinflip.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Coinflip</h1>
      <p class="text-xl text-gray-300">
        Double or nothing - choose your side!
      </p>
    </div>

    <!-- Game Area -->
    <div class="bg-gray-800 rounded-xl p-8">
      <!-- Coin Animation -->
      <div class="relative h-96 flex items-center justify-center mb-8">
        <div class="relative">
          <!-- Red Side -->
          <div 
            ref="redCoin"
            :class="['absolute inset-0 w-48 h-48 rounded-full bg-red-600 flex items-center justify-center transition-transform duration-6000', {
              'animate-spin-slow': isFlipping
            }]"
            :style="{ zIndex: coinResult === 'red' ? 2 : 1 }"
          >
            <img src="/dist/img/other/coin.png" alt="Red" class="w-24 h-24" />
          </div>
          
          <!-- Black Side -->
          <div 
            ref="blackCoin"
            :class="['w-48 h-48 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center transition-transform duration-6000', {
              'animate-spin-slow': isFlipping
            }]"
            :style="{ zIndex: coinResult === 'black' ? 2 : 1 }"
          >
            <img src="/dist/img/other/coin.png" alt="Black" class="w-24 h-24" />
          </div>
        </div>
      </div>

      <!-- Bet Interface -->
      <div class="space-y-6">
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

        <!-- Flip Buttons -->
        <div class="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            @click="flipCoin('red')"
            :disabled="!canFlip"
            class="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 py-8 rounded-xl text-2xl font-bold transition-colors"
          >
            <img src="/dist/img/other/coin.png" alt="Red" class="w-16 h-16 mx-auto mb-4" />
            Bet Red (2x)
          </button>

          <button
            @click="flipCoin('black')"
            :disabled="!canFlip"
            class="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 border-2 border-gray-600 py-8 rounded-xl text-2xl font-bold transition-colors"
          >
            <img src="/dist/img/other/coin.png" alt="Black" class="w-16 h-16 mx-auto mb-4" />
            Bet Black (2x)
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Results -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-center">Recent Results</h3>
      <div class="flex justify-center space-x-2">
        <div 
          v-for="result in recentResults" 
          :key="result.id"
          :class="`w-8 h-8 rounded-full flex items-center justify-center ${
            result.color === 'red' ? 'bg-red-600' : 'bg-gray-700 border border-gray-600'
          }`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { flipCoin } = useGameLogic()
const { hasEnoughBalance } = useBalance()
const { playSound, sounds } = useAudio()

// Meta
useHead({
  title: 'Coinflip - CSGOLuck'
})

// Game State
const betAmount = ref(10)
const isFlipping = ref(false)
const coinResult = ref<'red' | 'black' | null>(null)
const recentResults = ref([
  { id: 1, color: 'red' },
  { id: 2, color: 'black' },
  { id: 3, color: 'red' },
  { id: 4, color: 'black' },
  { id: 5, color: 'red' }
])

const canFlip = computed(() => {
  return !isFlipping.value && betAmount.value > 0 && hasEnoughBalance(betAmount.value)
})

const performFlip = async (side: 'red' | 'black') => {
  if (!canFlip.value) return

  isFlipping.value = true
  
  try {
    playSound(sounds.bet)
    
    // Simulate flip animation
    setTimeout(async () => {
      const result = await flipCoin(betAmount.value, side)
      coinResult.value = result.side
      
      // Add to recent results
      recentResults.value.unshift({ 
        id: Date.now(), 
        color: result.side 
      })
      if (recentResults.value.length > 10) {
        recentResults.value.pop()
      }
      
      isFlipping.value = false
    }, 6000)
    
  } catch (error) {
    console.error('Coinflip failed:', error)
    isFlipping.value = false
  }
}

// Rename the method to avoid conflict
const flipCoin = (side: 'red' | 'black') => {
  performFlip(side)
}
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(1800deg); }
}

.animate-spin-slow {
  animation: spin-slow 6s ease-out;
}
</style>
