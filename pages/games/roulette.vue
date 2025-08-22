<!-- pages/games/roulette.vue -->
<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Roulette</h1>
      <p class="text-xl text-gray-300">
        Place your bets and spin the wheel!
      </p>
    </div>

    <!-- Game Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Roulette Wheel -->
      <div class="lg:col-span-2">
        <div class="bg-gray-800 rounded-xl p-8">
          <!-- Wheel -->
          <div class="relative w-80 h-80 mx-auto mb-8">
            <div 
              ref="wheel"
              :class="[
                'w-full h-full rounded-full border-8 border-yellow-400 transition-transform duration-[4000ms] ease-out',
                isSpinning ? 'animate-spin-wheel' : ''
              ]"
              :style="{ transform: `rotate(${wheelRotation}deg)` }"
            >
              <!-- Wheel Sectors -->
              <svg viewBox="0 0 200 200" class="w-full h-full">
                <g v-for="(sector, index) in wheelSectors" :key="index">
                  <path
                    :d="generateSectorPath(index, 360 / wheelSectors.length)"
                    :fill="getSectorColor(sector)"
                    stroke="#1f2937"
                    stroke-width="1"
                  />
                  <text
                    :x="getSectorTextX(index, 360 / wheelSectors.length)"
                    :y="getSectorTextY(index, 360 / wheelSectors.length)"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="text-xs font-bold fill-white"
                  >
                    {{ sector.multiplier }}x
                  </text>
                </g>
              </svg>
            </div>
            
            <!-- Pointer -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div class="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-yellow-400" />
            </div>
          </div>

          <!-- Betting Interface -->
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

            <!-- Multiplier Betting Options -->
            <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
              <button
                v-for="multiplier in [1.2, 1.5, 2, 3, 5, 10]"
                :key="multiplier"
                @click="placeBet(multiplier)"
                :disabled="!canBet"
                :class="`py-3 rounded-lg font-bold transition-colors ${getMultiplierButtonClass(multiplier)}`"
              >
                {{ multiplier }}x
              </button>
            </div>

            <!-- Spin Button -->
            <div class="text-center">
              <button
                @click="spinWheel"
                :disabled="!canSpin"
                class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-12 py-4 rounded-xl text-xl font-bold transition-colors"
              >
                {{ isSpinning ? 'Spinning...' : 'Spin Wheel' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Panel -->
      <div class="space-y-6">
        <!-- Current Bets -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4">Your Bets</h3>
          
          <div v-if="currentBets.length > 0" class="space-y-3">
            <div 
              v-for="bet in currentBets" 
              :key="bet.id"
              class="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
            >
              <div>
                <div class="font-semibold">{{ bet.multiplier }}x</div>
                <div class="text-sm text-gray-400">${{ bet.amount.toFixed(2) }}</div>
              </div>
              <div class="text-green-400 font-bold">
                ${{ (bet.amount * bet.multiplier).toFixed(2) }}
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4 text-gray-400">
            No active bets
          </div>
          
          <div v-if="currentBets.length > 0" class="mt-4 pt-4 border-t border-gray-600">
            <div class="flex justify-between font-bold">
              <span>Total Bet:</span>
              <span>${{ totalBetAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold text-green-400">
              <span>Potential Win:</span>
              <span>${{ totalPotentialWin.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Spins -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4">Recent Spins</h3>
          
          <div class="space-y-2">
            <div 
              v-for="spin in recentSpins" 
              :key="spin.id"
              :class="`flex justify-between items-center p-2 rounded ${
                spin.multiplier >= 5 ? 'bg-yellow-600/20' :
                spin.multiplier >= 2 ? 'bg-green-600/20' : 'bg-gray-700'
              }`"
            >
              <span class="font-bold">{{ spin.multiplier }}x</span>
              <span class="text-sm text-gray-400">{{ formatTime(spin.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4">Statistics</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Games Played:</span>
              <span class="font-bold">{{ stats.gamesPlayed }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total Wagered:</span>
              <span class="font-bold">${{ stats.totalWagered.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total Won:</span>
              <span class="font-bold text-green-400">${{ stats.totalWon.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Biggest Win:</span>
              <span class="font-bold text-yellow-400">${{ stats.biggestWin.toFixed(2) }}</span>
            </div>
          </div>
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
  title: 'Roulette - CSGOLuck'
})

// Game State
const betAmount = ref(10)
const isSpinning = ref(false)
const wheelRotation = ref(0)
const currentBets = ref<Array<{
  id: string
  multiplier: number
  amount: number
}>>([])

const recentSpins = ref([
  { id: 1, multiplier: 2.5, timestamp: new Date(Date.now() - 30000) },
  { id: 2, multiplier: 1.2, timestamp: new Date(Date.now() - 60000) },
  { id: 3, multiplier: 10, timestamp: new Date(Date.now() - 90000) },
  { id: 4, multiplier: 1.5, timestamp: new Date(Date.now() - 120000) },
  { id: 5, multiplier: 3, timestamp: new Date(Date.now() - 150000) }
])

const stats = ref({
  gamesPlayed: 0,
  totalWagered: 0,
  totalWon: 0,
  biggestWin: 0
})

// Wheel configuration
const wheelSectors = ref([
  { multiplier: 1.2, weight: 30 },
  { multiplier: 1.5, weight: 25 },
  { multiplier: 2, weight: 20 },
  { multiplier: 3, weight: 15 },
  { multiplier: 5, weight: 8 },
  { multiplier: 10, weight: 2 }
])

// Computed
const canBet = computed(() => {
  return !isSpinning.value && betAmount.value > 0 && hasEnoughBalance(betAmount.value)
})

const canSpin = computed(() => {
  return !isSpinning.value && currentBets.value.length > 0
})

const totalBetAmount = computed(() => {
  return currentBets.value.reduce((sum, bet) => sum + bet.amount, 0)
})

const totalPotentialWin = computed(() => {
  return currentBets.value.reduce((sum, bet) => sum + (bet.amount * bet.multiplier), 0)
})

// Methods
const placeBet = (multiplier: number) => {
  if (!canBet.value) return
  
  try {
    deductBalance(betAmount.value, 'roulette', `Roulette bet on ${multiplier}x`)
    
    currentBets.value.push({
      id: Date.now().toString(),
      multiplier,
      amount: betAmount.value
    })
    
    playSound(sounds.bet)
  } catch (error) {
    console.error('Bet failed:', error)
  }
}

const spinWheel = async () => {
  if (!canSpin.value) return
  
  isSpinning.value = true
  
  try {
    playSound(sounds.spin)
    
    // Generate winning multiplier based on weights
    const winningMultiplier = getRandomMultiplier()
    
    // Calculate final rotation
    const sectorAngle = 360 / wheelSectors.value.length
    const winningIndex = wheelSectors.value.findIndex(s => s.multiplier === winningMultiplier)
    const finalRotation = 360 * 5 + (winningIndex * sectorAngle) + (sectorAngle / 2)
    
    wheelRotation.value = finalRotation
    
    // Wait for animation to complete
    setTimeout(() => {
      processWin(winningMultiplier)
      isSpinning.value = false
      
      // Add to recent spins
      recentSpins.value.unshift({
        id: Date.now(),
        multiplier: winningMultiplier,
        timestamp: new Date()
      })
      if (recentSpins.value.length > 10) {
        recentSpins.value.pop()
      }
      
      // Clear bets
      currentBets.value = []
    }, 4000)
    
  } catch (error) {
    console.error('Spin failed:', error)
    isSpinning.value = false
  }
}

const getRandomMultiplier = (): number => {
  const totalWeight = wheelSectors.value.reduce((sum, sector) => sum + sector.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const sector of wheelSectors.value) {
    random -= sector.weight
    if (random <= 0) {
      return sector.multiplier
    }
  }
  
  return wheelSectors.value[0].multiplier
}

const processWin = (winningMultiplier: number) => {
  const winningBets = currentBets.value.filter(bet => bet.multiplier === winningMultiplier)
  
  if (winningBets.length > 0) {
    const totalWin = winningBets.reduce((sum, bet) => sum + (bet.amount * bet.multiplier), 0)
    payoutWin(totalWin, 'roulette', `Won ${winningMultiplier}x multiplier`)
    
    // Update stats
    stats.value.totalWon += totalWin
    if (totalWin > stats.value.biggestWin) {
      stats.value.biggestWin = totalWin
    }
    
    playSound(sounds.win)
  }
  
  stats.value.gamesPlayed++
  stats.value.totalWagered += totalBetAmount.value
}

const getSectorColor = (sector: { multiplier: number }) => {
  const colors = {
    1.2: '#6b7280', // gray
    1.5: '#3b82f6', // blue
    2: '#10b981',   // green
    3: '#f59e0b',   // yellow
    5: '#f97316',   // orange
    10: '#dc2626'   // red
  }
  return colors[sector.multiplier as keyof typeof colors] || '#6b7280'
}

const getMultiplierButtonClass = (multiplier: number) => {
  const classes = {
    1.2: 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500',
    1.5: 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500',
    2: 'bg-green-600 hover:bg-green-700 disabled:bg-gray-500',
    3: 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-500',
    5: 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500',
    10: 'bg-red-600 hover:bg-red-700 disabled:bg-gray-500'
  }
  return classes[multiplier as keyof typeof classes] || classes[1.2]
}

const generateSectorPath = (index: number, sectorAngle: number): string => {
  const centerX = 100
  const centerY = 100
  const radius = 90
  
  const startAngle = (index * sectorAngle) * (Math.PI / 180)
  const endAngle = ((index + 1) * sectorAngle) * (Math.PI / 180)
  
  const x1 = centerX + radius * Math.cos(startAngle)
  const y1 = centerY + radius * Math.sin(startAngle)
  const x2 = centerX + radius * Math.cos(endAngle)
  const y2 = centerY + radius * Math.sin(endAngle)
  
  const largeArcFlag = sectorAngle > 180 ? 1 : 0
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

const getSectorTextX = (index: number, sectorAngle: number): number => {
  const centerX = 100
  const radius = 70
  const angle = (index * sectorAngle + sectorAngle / 2) * (Math.PI / 180)
  return centerX + radius * Math.cos(angle)
}

const getSectorTextY = (index: number, sectorAngle: number): number => {
  const centerY = 100
  const radius = 70
  const angle = (index * sectorAngle + sectorAngle / 2) * (Math.PI / 180)
  return centerY + radius * Math.sin(angle)
}

const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  return `${Math.floor(diffSeconds / 3600)}h ago`
}
</script>

<style scoped>
@keyframes spin-wheel {
  from { transform: rotate(0deg); }
  to { transform: rotate(1800deg); }
}

.animate-spin-wheel {
  animation: spin-wheel 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}
</style>
