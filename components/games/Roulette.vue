<template>
  <div class="roulette-game">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-4">🎰 Ruleta</h2>
      <p class="text-gray-300">El clásico juego de casino</p>
    </div>

    <!-- Coming Soon Notice -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-gradient-to-br from-red-500 to-green-500 rounded-lg p-8 text-center relative overflow-hidden mb-8">
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        <div class="relative z-10">
          <div class="text-6xl mb-4">🎰</div>
          <h3 class="text-2xl font-bold text-white mb-4">Ruleta Europea</h3>
          <p class="text-red-100 mb-6">
            Próximamente disponible con gráficos 3D y animaciones realistas
          </p>
          <div class="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg inline-block font-semibold">
            🚧 En Desarrollo
          </div>
        </div>
      </div>

      <!-- Mock Roulette Table -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 class="text-xl font-semibold mb-6 text-center">Vista Previa de la Mesa</h4>
        
        <!-- Roulette Wheel -->
        <div class="flex justify-center mb-8">
          <div 
            class="w-48 h-48 border-8 border-gray-600 rounded-full bg-gradient-to-br from-red-600 via-black to-green-600 relative"
            :class="{ 'animate-spin': isSpinning }"
            :style="{ animationDuration: isSpinning ? '3s' : '0s' }"
          >
            <!-- Numbers around the wheel -->
            <div class="absolute inset-4 rounded-full border-2 border-yellow-400 flex items-center justify-center">
              <div class="text-2xl font-bold text-white">{{ currentNumber }}</div>
            </div>
            
            <!-- Ball -->
            <div class="absolute top-2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2"></div>
          </div>
        </div>

        <!-- Betting Table -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Number Grid -->
          <div>
            <h5 class="font-semibold mb-4">Números</h5>
            <div class="grid grid-cols-3 gap-1 mb-4">
              <!-- 0 -->
              <div class="col-span-3 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded cursor-pointer transition-colors">
                0
              </div>
              
              <!-- Numbers 1-36 -->
              <div
                v-for="number in 36"
                :key="number"
                class="aspect-square flex items-center justify-center text-white text-sm font-bold rounded cursor-pointer transition-colors"
                :class="isRed(number) ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'"
                @click="placeBet('number', number)"
              >
                {{ number }}
              </div>
            </div>
          </div>

          <!-- Color and Other Bets -->
          <div>
            <h5 class="font-semibold mb-4">Apuestas Externas</h5>
            <div class="space-y-3">
              <!-- Colors -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="placeBet('color', 'red')"
                  class="bg-red-600 hover:bg-red-700 text-white py-4 rounded font-bold transition-colors"
                >
                  🔴 Rojo
                </button>
                <button
                  @click="placeBet('color', 'black')"
                  class="bg-black hover:bg-gray-800 text-white py-4 rounded font-bold transition-colors"
                >
                  ⚫ Negro
                </button>
              </div>
              
              <!-- Even/Odd -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="placeBet('parity', 'even')"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-colors"
                >
                  Par
                </button>
                <button
                  @click="placeBet('parity', 'odd')"
                  class="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold transition-colors"
                >
                  Impar
                </button>
              </div>
              
              <!-- High/Low -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="placeBet('range', 'low')"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold transition-colors"
                >
                  1-18
                </button>
                <button
                  @click="placeBet('range', 'high')"
                  class="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded font-semibold transition-colors"
                >
                  19-36
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bet Amount and Spin -->
        <div class="mt-8 bg-gray-700 rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Cantidad de Apuesta
              </label>
              <input
                v-model.number="betAmount"
                type="number"
                min="1"
                max="1000"
                class="input w-full"
                placeholder="$0.00"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Apuesta Actual
              </label>
              <div class="bg-gray-600 rounded-lg p-3 text-center">
                <div class="font-semibold text-white">{{ currentBet || 'Ninguna' }}</div>
              </div>
            </div>
            
            <button
              @click="spinWheel"
              :disabled="!betAmount || !currentBet || isSpinning"
              class="bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {{ isSpinning ? 'Girando...' : '🎰 Girar' }}
            </button>
          </div>
        </div>

        <!-- Last Results -->
        <div v-if="lastResults.length > 0" class="mt-6">
          <h5 class="font-semibold mb-3">Últimos Resultados</h5>
          <div class="flex gap-2 overflow-x-auto">
            <div
              v-for="result in lastResults"
              :key="result.id"
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              :class="result.number === 0 ? 'bg-green-600' : (isRed(result.number) ? 'bg-red-600' : 'bg-black')"
            >
              {{ result.number }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RouletteResult {
  id: string
  number: number
  color: 'red' | 'black' | 'green'
}

// State
const betAmount = ref<number>(10)
const currentBet = ref<string>('')
const currentNumber = ref<number>(0)
const isSpinning = ref(false)
const lastResults = ref<RouletteResult[]>([])

// Red numbers in European roulette
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

// Methods
const isRed = (number: number): boolean => {
  return redNumbers.includes(number)
}

const placeBet = (type: string, value: string | number) => {
  if (isSpinning.value) return
  
  switch (type) {
    case 'number':
      currentBet.value = `Número ${value}`
      break
    case 'color':
      currentBet.value = value === 'red' ? 'Rojo' : 'Negro'
      break
    case 'parity':
      currentBet.value = value === 'even' ? 'Par' : 'Impar'
      break
    case 'range':
      currentBet.value = value === 'low' ? '1-18' : '19-36'
      break
  }
}

const spinWheel = async () => {
  if (!betAmount.value || !currentBet.value || isSpinning.value) return
  
  isSpinning.value = true
  
  // Simulate spinning animation
  for (let i = 0; i < 20; i++) {
    currentNumber.value = Math.floor(Math.random() * 37)
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Final result
  const finalNumber = Math.floor(Math.random() * 37)
  currentNumber.value = finalNumber
  
  // Add to results
  const result: RouletteResult = {
    id: Date.now().toString(),
    number: finalNumber,
    color: finalNumber === 0 ? 'green' : (isRed(finalNumber) ? 'red' : 'black')
  }
  
  lastResults.value.unshift(result)
  if (lastResults.value.length > 10) {
    lastResults.value = lastResults.value.slice(0, 10)
  }
  
  isSpinning.value = false
  
  // Check win (simplified)
  setTimeout(() => {
    alert(`Resultado: ${finalNumber} (${result.color})\nEsta es solo una demostración.`)
    currentBet.value = ''
  }, 500)
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #ef4444, #22c55e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animate-spin {
  animation: spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1440deg); /* 4 full rotations */
  }
}
</style>