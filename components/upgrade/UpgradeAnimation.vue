<template>
  <div v-if="isVisible" class="upgrade-animation-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <div class="upgrade-animation-container bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold gradient-text mb-2">🎲 Upgrade en Progreso</h2>
        <p class="text-gray-300">Multiplicador: {{ animationData?.multiplier || 0 }}x</p>
      </div>

      <!-- Input Item -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-center">Item Sacrificado</h3>
        <div v-if="animationData?.inputItem" class="flex justify-center">
          <div class="bg-gray-700 rounded-lg p-4 border border-red-500">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gray-800 rounded">
                <img 
                  :src="animationData.inputItem.imageUrl" 
                  :alt="animationData.inputItem.name"
                  class="w-full h-full object-contain"
                >
              </div>
              <div>
                <p class="font-medium text-white">{{ animationData.inputItem.name }}</p>
                <p class="text-red-400 font-semibold">${{ animationData.inputItem.price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Animation Area -->
      <div class="animation-area mb-8">
        <!-- Spinning Wheel / Slot Machine Effect -->
        <div class="relative overflow-hidden bg-gray-900 rounded-lg border-2 border-orange-500 h-32">
          <!-- Items Carousel -->
          <div 
            ref="itemsCarousel"
            class="flex items-center h-full transition-transform duration-1000 ease-out"
            :style="{ transform: `translateX(${carouselOffset}px)` }"
          >
            <div
              v-for="(item, index) in displayItems"
              :key="`${item.id}-${index}`"
              class="flex-shrink-0 w-24 h-24 mx-2 bg-gray-800 rounded border-2 border-gray-600 flex items-center justify-center"
              :class="{
                'border-green-500 scale-110 shadow-lg shadow-green-500/50': isWinningItem(index),
                [`rarity-${item.rarity}`]: true
              }"
            >
              <img 
                :src="item.imageUrl" 
                :alt="item.name"
                class="w-full h-full object-contain p-1"
              >
            </div>
          </div>
          
          <!-- Center Indicator -->
          <div class="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-orange-500 shadow-lg shadow-orange-500/50"></div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-100"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="text-center text-gray-400 text-sm mt-2">{{ progressText }}</p>
        </div>
      </div>

      <!-- Result Display -->
      <div v-if="showResult && result" class="text-center">
        <div v-if="result.success" class="space-y-4">
          <div class="text-6xl animate-bounce">🎉</div>
          <h3 class="text-2xl font-bold text-green-400">¡FELICIDADES!</h3>
          <p class="text-gray-300">Has ganado:</p>
          
          <div class="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-6 max-w-md mx-auto">
            <div class="flex items-center gap-4 justify-center">
              <div class="w-20 h-20 bg-gray-800 rounded">
                <img 
                  :src="result.wonItem?.imageUrl" 
                  :alt="result.wonItem?.name"
                  class="w-full h-full object-contain"
                >
              </div>
              <div class="text-left">
                <p class="font-medium text-white">{{ result.wonItem?.name }}</p>
                <p class="text-green-400 font-bold text-xl">${{ result.wonItem?.price.toFixed(2) }}</p>
                <p class="text-green-400">Ganancia: +${{ result.profit.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <div class="text-6xl">😔</div>
          <h3 class="text-2xl font-bold text-red-400">¡Oh no!</h3>
          <p class="text-gray-300">El upgrade falló</p>
          
          <div class="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-red-400">Pérdida: ${{ Math.abs(result.profit).toFixed(2) }}</p>
            <p class="text-gray-400 text-sm">Mejor suerte la próxima vez</p>
          </div>
        </div>
        
        <button
          @click="closeAnimation"
          class="btn btn-primary mt-6 px-8"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem, UpgradeResult } from '~/types'

interface AnimationData {
  inputItem: CSGOItem
  result: UpgradeResult
  duration?: number
  possibleItems?: CSGOItem[]
}

interface Props {
  animationData?: AnimationData | null
}

interface Emits {
  (e: 'animation-complete', result: UpgradeResult): void
}

// Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const isVisible = ref(false)
const progress = ref(0)
const progressText = ref('')
const showResult = ref(false)
const carouselOffset = ref(0)
const displayItems = ref<CSGOItem[]>([])
const itemsCarousel = ref<HTMLElement>()

// Computed
const result = computed(() => props.animationData?.result)

// Methods
const startAnimation = async () => {
  if (!props.animationData) return
  
  isVisible.value = true
  showResult.value = false
  progress.value = 0
  progressText.value = 'Preparando upgrade...'
  
  // Generate display items for animation
  generateDisplayItems()
  
  // Start progress animation
  await animateProgress()
  
  // Start carousel animation
  await animateCarousel()
  
  // Show result
  showResult.value = true
  
  // Auto-close after delay
  setTimeout(() => {
    if (showResult.value) {
      closeAnimation()
    }
  }, 5000)
}

const generateDisplayItems = () => {
  const items: CSGOItem[] = []
  const { inputItem, result, possibleItems = [] } = props.animationData!
  
  // Add some random items at the beginning
  for (let i = 0; i < 20; i++) {
    items.push(getRandomItem())
  }
  
  // Add the winning item (or a random losing item) in the middle
  if (result.success && result.wonItem) {
    items.push(result.wonItem)
  } else {
    items.push(getRandomItem())
  }
  
  // Add more random items
  for (let i = 0; i < 20; i++) {
    items.push(getRandomItem())
  }
  
  displayItems.value = items
}

const getRandomItem = (): CSGOItem => {
  const mockItems = [
    'AK-47 | Redline',
    'AWP | Dragon Lore',
    'M4A4 | Asiimov',
    'Glock-18 | Fade',
    'Desert Eagle | Blaze'
  ]
  
  const randomName = mockItems[Math.floor(Math.random() * mockItems.length)]
  
  return {
    id: `random-${Math.random()}`,
    name: randomName,
    marketName: randomName,
    price: Math.random() * 100 + 10,
    imageUrl: '/placeholder-item.jpg',
    rarity: 'milspec',
    type: 'rifle',
    category: 'weapon'
  }
}

const animateProgress = (): Promise<void> => {
  return new Promise((resolve) => {
    const duration = 2000 // 2 seconds
    const interval = 50
    const steps = duration / interval
    const progressStep = 100 / steps
    
    let currentStep = 0
    
    const progressInterval = setInterval(() => {
      currentStep++
      progress.value = Math.min(currentStep * progressStep, 100)
      
      if (currentStep < steps * 0.3) {
        progressText.value = 'Analizando probabilidades...'
      } else if (currentStep < steps * 0.6) {
        progressText.value = 'Calculando resultado...'
      } else if (currentStep < steps * 0.9) {
        progressText.value = 'Determinando ganador...'
      } else {
        progressText.value = '¡Finalizando!'
      }
      
      if (currentStep >= steps) {
        clearInterval(progressInterval)
        resolve()
      }
    }, interval)
  })
}

const animateCarousel = (): Promise<void> => {
  return new Promise((resolve) => {
    const itemWidth = 112 // 24 (w-24) * 4 + margins
    const centerIndex = Math.floor(displayItems.value.length / 2)
    const targetOffset = -(centerIndex * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2)
    
    // Start with fast scrolling
    let currentOffset = 0
    const scrollSpeed = 20
    const scrollDuration = 3000
    const scrollInterval = 16 // ~60fps
    
    const scrollAnimation = setInterval(() => {
      currentOffset -= scrollSpeed
      carouselOffset.value = currentOffset
    }, scrollInterval)
    
    // Stop scrolling and center on winning item
    setTimeout(() => {
      clearInterval(scrollAnimation)
      carouselOffset.value = targetOffset
      
      setTimeout(() => {
        resolve()
      }, 1000)
    }, scrollDuration)
  })
}

const isWinningItem = (index: number): boolean => {
  const centerIndex = Math.floor(displayItems.value.length / 2)
  return showResult.value && index === centerIndex
}

const closeAnimation = () => {
  if (result.value) {
    emit('animation-complete', result.value)
  }
  
  // Reset state
  isVisible.value = false
  progress.value = 0
  showResult.value = false
  carouselOffset.value = 0
  displayItems.value = []
}

// Watch for animation data changes
watch(() => props.animationData, (newData) => {
  if (newData && !isVisible.value) {
    startAnimation()
  }
}, { immediate: true })

// Handle escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showResult.value) {
    closeAnimation()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.upgrade-animation-overlay {
  backdrop-filter: blur(5px);
}

.gradient-text {
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animation-area {
  user-select: none;
}

/* Rarity colors for items */
.rarity-consumer {
  border-color: #b0c3d9;
}

.rarity-industrial {
  border-color: #5e98d9;
}

.rarity-milspec {
  border-color: #4b69ff;
}

.rarity-restricted {
  border-color: #8847ff;
}

.rarity-classified {
  border-color: #d32ce6;
}

.rarity-covert {
  border-color: #eb4b4b;
}

.rarity-contraband {
  border-color: #e4ae39;
}
</style>