<template>
  <div class="banana-rush">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold gradient-text mb-4">🍌 Banana Rush</h2>
      <p class="text-gray-300">El juego más loco del casino</p>
    </div>

    <!-- Coming Soon Card -->
    <div class="max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-8 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        <div class="relative z-10">
          <div class="text-6xl mb-4 animate-bounce">🍌</div>
          <h3 class="text-2xl font-bold text-white mb-4">Banana Rush</h3>
          <p class="text-yellow-100 mb-6">
            Un juego único donde las bananas pueden hacerte millonario
          </p>
          
          <!-- Game Preview -->
          <div class="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
            <div class="grid grid-cols-5 gap-2 mb-4">
              <div
                v-for="(banana, index) in bananas"
                :key="index"
                class="aspect-square bg-yellow-300 rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-yellow-200 transition-colors"
                @click="clickBanana(index)"
              >
                {{ banana.revealed ? banana.multiplier + 'x' : '🍌' }}
              </div>
            </div>
            
            <div class="text-white text-sm">
              Haz clic en las bananas para revelar multiplicadores
            </div>
          </div>
          
          <!-- Rules -->
          <div class="text-left bg-white bg-opacity-10 rounded-lg p-4 mb-6">
            <h4 class="font-bold text-white mb-2">¿Cómo jugar?</h4>
            <ul class="text-yellow-100 text-sm space-y-1">
              <li>• Elige tu apuesta inicial</li>
              <li>• Haz clic en bananas para revelar multiplicadores</li>
              <li>• Retira en cualquier momento o arriesga por más</li>
              <li>• ¡Cuidado con las bananas podridas! 🍌💥</li>
            </ul>
          </div>
          
          <div class="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg inline-block font-semibold">
            🚧 Próximamente
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Banana {
  multiplier: number
  revealed: boolean
  isRotten: boolean
}

// State
const bananas = ref<Banana[]>([])

// Initialize bananas
const initializeBananas = () => {
  bananas.value = Array.from({ length: 25 }, () => ({
    multiplier: Math.floor(Math.random() * 10) + 1,
    revealed: false,
    isRotten: Math.random() < 0.2 // 20% chance of rotten banana
  }))
}

// Methods
const clickBanana = (index: number) => {
  const banana = bananas.value[index]
  if (banana.revealed) return
  
  banana.revealed = true
  
  if (banana.isRotten) {
    alert('¡Banana podrida! 💥 Juego terminado')
    initializeBananas()
  } else {
    console.log(`Multiplicador: ${banana.multiplier}x`)
  }
}

// Initialize on mount
onMounted(() => {
  initializeBananas()
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>