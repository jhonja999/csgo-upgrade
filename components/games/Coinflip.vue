<template>
  <div class="coinflip-game">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-4">🪙 Coinflip</h2>
      <p class="text-gray-300">Simple, rápido y emocionante</p>
    </div>

    <!-- Coming Soon Notice -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg p-8 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        <div class="relative z-10">
          <div class="text-6xl mb-4">🪙</div>
          <h3 class="text-2xl font-bold text-white mb-4">Coinflip Clásico</h3>
          <p class="text-yellow-100 mb-6">
            El juego más simple pero emocionante. ¿Cara o cruz?
          </p>
          <div class="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg inline-block font-semibold">
            🚧 Próximamente
          </div>
        </div>
      </div>
    </div>

    <!-- Game Interface -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <!-- Coin Display -->
        <div class="text-center mb-8">
          <div class="relative inline-block">
            <div 
              class="w-32 h-32 rounded-full border-4 border-yellow-400 flex items-center justify-center text-4xl font-bold transform transition-transform duration-500"
              :class="[
                coinSide === 'heads' ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white',
                { 'animate-flip': isFlipping }
              ]"
            >
              {{ coinSide === 'heads' ? '👑' : '🛡️' }}
            </div>
            
            <!-- Flip effect overlay -->
            <div
              v-if="isFlipping"
              class="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 animate-spin"
              style="animation-duration: 1s;"
            ></div>
          </div>
          
          <div class="mt-4">
            <div class="text-2xl font-bold text-white">
              {{ coinSide === 'heads' ? 'CARA' : 'CRUZ' }}
            </div>
            <div class="text-gray-400">
              {{ coinSide === 'heads' ? 'Heads' : 'Tails' }}
            </div>
          </div>
        </div>

        <!-- Betting Interface -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Side Selection -->
          <div>
            <h4 class="text-xl font-semibold mb-4">Elige tu lado</h4>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="selectSide('heads')"
                class="coinflip-option p-6 rounded-lg border-2 transition-all duration-200"
                :class="selectedSide === 'heads' 
                  ? 'bg-yellow-400 border-yellow-400 text-yellow-900' 
                  : 'bg-gray-700 border-gray-600 text-white hover:border-yellow-400'"
              >
                <div class="text-3xl mb-2">👑</div>
                <div class="font-bold">CARA</div>
                <div class="text-sm opacity-75">Heads</div>
                <div class="text-xs mt-2">Probabilidad: ~50%</div>
              </button>
              
              <button
                @click="selectSide('tails')"
                class="coinflip-option p-6 rounded-lg border-2 transition-all duration-200"
                :class="selectedSide === 'tails' 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-700 border-gray-600 text-white hover:border-blue-500'"
              >
                <div class="text-3xl mb-2">🛡️</div>
                <div class="font-bold">CRUZ</div>
                <div class="text-sm opacity-75">Tails</div>
                <div class="text-xs mt-2">Probabilidad: ~50%</div>
              </button>
            </div>
          </div>

          <!-- Bet Amount and Controls -->
          <div>
            <h4 class="text-xl font-semibold mb-4">Cantidad de apuesta</h4>
            
            <!-- Quick bet amounts -->
            <div class="grid grid-cols-4 gap-2 mb-4">
              <button
                v-for="amount in quickBets"
                :key="amount"
                @click="betAmount = amount"
                class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
                :class="{ 'bg-orange-500 hover:bg-orange-600': betAmount === amount }"
              >
                ${{ amount }}
              </button>
            </div>
            
            <!-- Custom amount -->
            <div class="mb-6">
              <input
                v-model.number="betAmount"
                type="number"
                min="1"
                max="1000"
                class="input w-full"
                placeholder="Cantidad personalizada..."
              >
            </div>
            
            <!-- Potential win -->
            <div class="bg-gray-700 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-sm text-gray-400">Apuesta</div>
                  <div class="text-lg font-bold text-white">${{ betAmount?.toFixed(2) || '0.00' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-400">Ganancia Potencial</div>
                  <div class="text-lg font-bold text-green-400">
                    ${{ ((betAmount || 0) * 1.96).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Flip button -->
            <button
              @click="flipCoin"
              :disabled="!selectedSide || !betAmount || betAmount <= 0 || isFlipping"
              class="w-full bg-gradient-to-r from-yellow-400 to-blue-500 hover:from-yellow-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              {{ isFlipping ? 'Lanzando...' : '🪙 LANZAR MONEDA' }}
            </button>
          </div>
        </div>

        <!-- Game Stats -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-white">{{ gameStats.totalFlips }}</div>
            <div class="text-sm text-gray-400">Total de lanzamientos</div>
          </div>
          <div class="bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-400">{{ gameStats.wins }}</div>
            <div class="text-sm text-gray-400">Victorias</div>
          </div>
          <div class="bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ gameStats.winRate }}%</div>
            <div class="text-sm text-gray-400">Tasa de victoria</div>
          </div>
        </div>

        <!-- Recent Results -->
        <div v-if="recentResults.length > 0" class="mt-6">
          <h5 class="font-semibold mb-3">Últimos resultados</h5>
          <div class="flex gap-2 overflow-x-auto">
            <div
              v-for="result in recentResults"
              :key="result.id"
              class="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg"
              :class="result.result === 'heads' 
                ? 'bg-yellow-400 border-yellow-400 text-yellow-900' 
                : 'bg-blue-500 border-blue-500 text-white'"
            >
              {{ result.result === 'heads' ? '👑' : '🛡️' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CoinflipResult {
  id: string
  result: 'heads' | 'tails'
  won: boolean
  amount: number
  timestamp: number
}

// State
const selectedSide = ref<'heads' | 'tails' | null>(null)
const betAmount = ref<number>(10)
const coinSide = ref<'heads' | 'tails'>('heads')
const isFlipping = ref(false)
const quickBets = [5, 10, 25, 50]

const gameStats = reactive({
  totalFlips: 0,
  wins: 0,
  winRate: 0
})

const recentResults = ref<CoinflipResult[]>([])

// Methods
const selectSide = (side: 'heads' | 'tails') => {
  if (isFlipping.value) return
  selectedSide.value = side
}

const flipCoin = async () => {
  if (!selectedSide.value || !betAmount.value || betAmount.value <= 0 || isFlipping.value) return
  
  isFlipping.value = true
  
  // Simulate coin flip animation
  for (let i = 0; i < 8; i++) {
    coinSide.value = Math.random() < 0.5 ? 'heads' : 'tails'
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Final result
  const finalResult = Math.random() < 0.5 ? 'heads' : 'tails'
  coinSide.value = finalResult
  
  // Check if won
  const won = selectedSide.value === finalResult
  
  // Create result record
  const result: CoinflipResult = {
    id: Date.now().toString(),
    result: finalResult,
    won,
    amount: betAmount.value,
    timestamp: Date.now()
  }
  
  // Update stats
  gameStats.totalFlips++
  if (won) gameStats.wins++
  gameStats.winRate = Math.round((gameStats.wins / gameStats.totalFlips) * 100)
  
  // Add to recent results
  recentResults.value.unshift(result)
  if (recentResults.value.length > 20) {
    recentResults.value = recentResults.value.slice(0, 20)
  }
  
  isFlipping.value = false
  
  // Show result
  setTimeout(() => {
    const message = won 
      ? `¡Ganaste! 🎉\nGanancias: $${(betAmount.value * 1.96).toFixed(2)}`
      : `Perdiste 😔\nPérdida: $${betAmount.value.toFixed(2)}`
    
    alert(message + '\n\nEsta es solo una demostración.')
  }, 500)
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #fbbf24, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.coinflip-option {
  text-align: center;
}

.coinflip-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@keyframes flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(180deg); }
}

.animate-flip {
  animation: flip 0.5s ease-in-out infinite;
}
</style>