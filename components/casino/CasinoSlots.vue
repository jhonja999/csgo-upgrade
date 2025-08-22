<template>
  <div class="casino-slots">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-4">🎰 Slots</h2>
      <p class="text-gray-300">Próximamente disponible</p>
    </div>

    <!-- Coming Soon Card -->
    <div class="max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-8 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        <div class="relative z-10">
          <div class="text-6xl mb-4">🎰</div>
          <h3 class="text-2xl font-bold text-white mb-4">Casino Slots</h3>
          <p class="text-purple-100 mb-6">
            Emocionantes slots temáticos de CS:GO con jackpots progresivos
          </p>
          
          <!-- Feature list -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white bg-opacity-10 rounded-lg p-3">
              <div class="text-2xl mb-2">💎</div>
              <p class="text-sm">Jackpots progresivos</p>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-3">
              <div class="text-2xl mb-2">🎨</div>
              <p class="text-sm">Temas de CS:GO</p>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-3">
              <div class="text-2xl mb-2">⚡</div>
              <p class="text-sm">Giros rápidos</p>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-3">
              <div class="text-2xl mb-2">🎁</div>
              <p class="text-sm">Bonos especiales</p>
            </div>
          </div>
          
          <div class="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg inline-block font-semibold">
            🚧 En Desarrollo
          </div>
        </div>
      </div>
    </div>

    <!-- Mock Slots Preview -->
    <div class="mt-8 max-w-4xl mx-auto">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h4 class="text-xl font-semibold mb-4 text-center">Vista Previa</h4>
        
        <!-- Slot Machine Mock -->
        <div class="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div
              v-for="(reel, index) in reels"
              :key="index"
              class="aspect-square bg-gray-700 rounded border-2 border-gray-600 flex items-center justify-center text-3xl"
            >
              {{ reel }}
            </div>
          </div>
          
          <div class="text-center mb-4">
            <div class="text-sm text-gray-400 mb-2">Apuesta</div>
            <div class="text-lg font-bold text-white">$10.00</div>
          </div>
          
          <button
            @click="spinReels"
            :disabled="isSpinning"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            :class="{ 'animate-pulse': isSpinning }"
          >
            {{ isSpinning ? 'Girando...' : '🎰 GIRAR' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const reels = ref(['🍒', '🍋', '🍒'])
const isSpinning = ref(false)

const slotSymbols = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣']

// Methods
const spinReels = async () => {
  isSpinning.value = true
  
  // Simulate spinning animation
  for (let i = 0; i < 10; i++) {
    reels.value = reels.value.map(() => 
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
    )
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Final result
  reels.value = reels.value.map(() => 
    slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
  )
  
  isSpinning.value = false
  
  // Check for win
  const allSame = reels.value.every(symbol => symbol === reels.value[0])
  if (allSame) {
    alert('¡Jackpot! 🎉')
  }
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>