<!-- components/cases/CaseAnimation.vue -->
<template>
  <div class="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-8 max-w-4xl w-full mx-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-2">Opening {{ case.name }}</h2>
        <p v-if="count > 1" class="text-gray-300">Opening {{ count }} cases...</p>
      </div>

      <!-- Single Case Animation -->
      <div v-if="count === 1" class="space-y-8">
        <!-- Arrow Indicator -->
        <div class="flex justify-center">
          <div class="w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent border-b-yellow-400 drop-shadow-lg animate-bounce" />
        </div>

        <!-- Items Reel -->
        <div class="relative h-48 bg-gray-700 rounded-lg overflow-hidden">
          <div 
            ref="itemsReel"
            class="flex h-full items-center transition-transform duration-[4000ms] ease-out"
            :style="{ transform: `translateX(${reelOffset}px)` }"
          >
            <div 
              v-for="(item, index) in reelItems" 
              :key="index"
              :class="[
                'flex-shrink-0 w-32 h-full flex flex-col items-center justify-center p-4 border-r border-gray-600',
                getRarityBorder(item.rarity),
                { 'ring-4 ring-yellow-400': index === winningIndex && showResult }
              ]"
            >
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-20 h-20 object-contain mb-2"
              >
              <p class="text-xs text-center font-semibold truncate w-full">{{ item.name }}</p>
              <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Animation Controls -->
        <div class="text-center">
          <button
            v-if="!isAnimating && !showResult"
            @click="startAnimation"
            class="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            Open Case!
          </button>
          
          <div v-else-if="isAnimating" class="space-y-2">
            <div class="text-xl font-bold text-yellow-400">Opening...</div>
            <div class="w-64 bg-gray-600 rounded-full h-2 mx-auto">
              <div 
                class="bg-yellow-400 h-2 rounded-full transition-all duration-[4000ms] ease-out"
                :style="{ width: isAnimating ? '100%' : '0%' }"
              />
            </div>
          </div>
        </div>

        <!-- Single Result Display -->
        <div v-if="showResult && wonItems.length > 0" class="text-center">
          <div class="mb-4">
            <h3 class="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
            <p class="text-gray-300">You won:</p>
          </div>
          
          <div 
            :class="`inline-block p-6 rounded-lg ${getRarityBg(wonItems[0].rarity)}`"
          >
            <img 
              :src="wonItems[0].image" 
              :alt="wonItems[0].name"
              class="w-32 h-32 object-contain mx-auto mb-4"
            >
            <h4 class="text-xl font-bold mb-2">{{ wonItems[0].name }}</h4>
            <div class="flex items-center justify-center space-x-2">
              <img src="/dist/img/other/coin.png" alt="Coin" class="w-6 h-6">
              <span class="text-2xl font-bold text-green-400">${{ wonItems[0].price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Multiple Cases Animation -->
      <div v-else class="space-y-8">
        <!-- Progress -->
        <div class="text-center mb-6">
          <div class="text-xl font-bold mb-2">
            Opening {{ currentCaseIndex + 1 }} of {{ count }}
          </div>
          <div class="w-full bg-gray-600 rounded-full h-4">
            <div 
              class="bg-blue-400 h-4 rounded-full transition-all duration-300"
              :style="{ width: `${((currentCaseIndex + 1) / count) * 100}%` }"
            />
          </div>
        </div>

        <!-- Quick Results Grid -->
        <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
          <div 
            v-for="(item, index) in wonItems" 
            :key="index"
            :class="[
              'bg-gray-700 rounded-lg p-3 text-center transition-all duration-300',
              getRarityBorder(item.rarity),
              { 'scale-110 ring-2 ring-yellow-400': index === wonItems.length - 1 && isAnimating }
            ]"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-16 h-16 object-contain mx-auto mb-2"
            >
            <p class="text-xs font-semibold truncate">{{ item.name }}</p>
            <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
          </div>
          
          <!-- Placeholder for remaining cases -->
          <div 
            v-for="n in Math.max(0, count - wonItems.length)" 
            :key="`placeholder-${n}`"
            class="bg-gray-600 rounded-lg p-3 text-center border-2 border-dashed border-gray-500"
          >
            <div class="w-16 h-16 mx-auto mb-2 bg-gray-500 rounded animate-pulse" />
            <p class="text-xs text-gray-400">Case {{ wonItems.length + n }}</p>
          </div>
        </div>

        <!-- Multiple Results Summary -->
        <div v-if="showResult" class="bg-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4 text-center">Opening Complete!</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ count }}</div>
              <div class="text-sm text-gray-400">Cases Opened</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">${{ totalValue.toFixed(2) }}</div>
              <div class="text-sm text-gray-400">Total Value</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-400">${{ bestItem?.price.toFixed(2) || '0.00' }}</div>
              <div class="text-sm text-gray-400">Best Item</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-400">${{ averageValue.toFixed(2) }}</div>
              <div class="text-sm text-gray-400">Average Value</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <div class="text-center mt-8">
        <button
          v-if="showResult"
          @click="complete"
          class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition-colors"
        >
          Continue
        </button>
        
        <button
          v-else-if="!isAnimating"
          @click="complete"
          class="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

interface Props {
  case: GameCase
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 1
})

const emit = defineEmits<{
  complete: [results: { items: CSGOItem[] }]
}>()

const { playSound, sounds } = useAudio()

// State
const isAnimating = ref(false)
const showResult = ref(false)
const reelOffset = ref(0)
const winningIndex = ref(25) // Middle position
const currentCaseIndex = ref(0)
const wonItems = ref<CSGOItem[]>([])
const reelItems = ref<CSGOItem[]>([])

// Generate reel items for single case animation
const generateReelItems = (): CSGOItem[] => {
  const items: CSGOItem[] = []
  
  // Create a reel of 50 items for smooth animation
  for (let i = 0; i < 50; i++) {
    const randomItem = generateRandomItem()
    items.push({
      ...randomItem,
      id: `reel-${i}`
    })
  }
  
  return items
}

// Generate a random item based on case probabilities
const generateRandomItem = (): CSGOItem => {
  const rarityWeights = {
    'consumer': 60,
    'industrial': 25,
    'mil-spec': 10,
    'restricted': 3,
    'classified': 1.5,
    'covert': 0.4,
    'knife': 0.1
  }
  
  const mockItems = {
    'consumer': [
      { name: 'P250 | Sand Dune', price: 0.03, image: '/dist/img/p250/sanddune.png' },
      { name: 'SCAR-20 | Storm', price: 0.05, image: '/dist/img/scar20/storm.png' }
    ],
    'industrial': [
      { name: 'M4A4 | Tornado', price: 0.25, image: '/dist/img/m4a4/tornado.png' },
      { name: 'AK-47 | Safari Mesh', price: 0.30, image: '/dist/img/ak47/safari.png' }
    ],
    'mil-spec': [
      { name: 'AK-47 | Blue Laminate', price: 2.50, image: '/dist/img/ak47/blue.png' },
      { name: 'M4A1-S | Dark Water', price: 3.20, image: '/dist/img/m4a1s/darkwater.png' }
    ],
    'restricted': [
      { name: 'AWP | Pink DDPAT', price: 15.60, image: '/dist/img/awp/pink.png' },
      { name: 'AK-47 | Case Hardened', price: 22.40, image: '/dist/img/ak47/casehardened.png' }
    ],
    'classified': [
      { name: 'AK-47 | Redline', price: 45.60, image: '/dist/img/ak47/redline.png' },
      { name: 'M4A4 | Asiimov', price: 67.80, image: '/dist/img/m4a4/asiimov.png' }
    ],
    'covert': [
      { name: 'AWP | Dragon Lore', price: 2450.00, image: '/dist/img/awp/dragonlore.png' },
      { name: 'AK-47 | Fire Serpent', price: 1890.50, image: '/dist/img/ak47/fire.png' }
    ],
    'knife': [
      { name: 'Karambit | Fade', price: 1650.00, image: '/dist/img/knives/karambit.png' },
      { name: 'Butterfly Knife | Slaughter', price: 1200.00, image: '/dist/img/knives/butterfly.png' }
    ]
  }
  
  // Select rarity based on weights
  const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight
  let selectedRarity = 'consumer'
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    random -= weight
    if (random <= 0) {
      selectedRarity = rarity
      break
    }
  }
  
  // Select random item from selected rarity
  const rarityItems = mockItems[selectedRarity as keyof typeof mockItems]
  const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)]
  
  return {
    id: `item-${Date.now()}-${Math.random()}`,
    name: randomItem.name,
    rarity: selectedRarity,
    collection: props.case.name,
    image: randomItem.image,
    price: randomItem.price,
    tradable: true,
    marketable: true,
    obtainedAt: new Date()
  }
}

// Computed
const totalValue = computed(() => 
  wonItems.value.reduce((sum, item) => sum + item.price, 0)
)

const bestItem = computed(() => 
  wonItems.value.length > 0 
    ? wonItems.value.reduce((best, item) => item.price > best.price ? item : best)
    : null
)

const averageValue = computed(() => 
  wonItems.value.length > 0 ? totalValue.value / wonItems.value.length : 0
)

// Methods
const startAnimation = async () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  playSound(sounds.caseOpen)
  
  if (props.count === 1) {
    await animateSingleCase()
  } else {
    await animateMultipleCases()
  }
  
  showResult.value = true
  isAnimating.value = false
}

const animateSingleCase = async () => {
  // Generate the winning item and place it at winning position
  const winningItem = generateRandomItem()
  reelItems.value[winningIndex.value] = winningItem
  
  // Calculate final offset to center the winning item
  const itemWidth = 128 // w-32 = 128px
  const containerWidth = 512 // Approximate container width
  const finalOffset = -(winningIndex.value * itemWidth) + (containerWidth / 2) - (itemWidth / 2)
  
  // Animate to winning position
  setTimeout(() => {
    reelOffset.value = finalOffset
  }, 100)
  
  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 4000))
  
  wonItems.value = [winningItem]
}

const animateMultipleCases = async () => {
  for (let i = 0; i < props.count; i++) {
    currentCaseIndex.value = i
    
    // Generate and add item
    const item = generateRandomItem()
    wonItems.value.push(item)
    
    // Play sound for each case
    if (i > 0) playSound(sounds.caseOpen)
    
    // Wait between cases
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

const getRarityBorder = (rarity: string) => {
  const borders = {
    'consumer': 'border-l-4 border-gray-400',
    'industrial': 'border-l-4 border-blue-400',
    'mil-spec': 'border-l-4 border-blue-600',
    'restricted': 'border-l-4 border-purple-500',
    'classified': 'border-l-4 border-pink-500',
    'covert': 'border-l-4 border-red-500',
    'knife': 'border-l-4 border-yellow-500',
    'gloves': 'border-l-4 border-yellow-500'
  }
  return borders[rarity as keyof typeof borders] || borders.consumer
}

const getRarityBg = (rarity: string) => {
  const backgrounds = {
    'consumer': 'bg-gray-600/30 border border-gray-400',
    'industrial': 'bg-blue-600/30 border border-blue-400',
    'mil-spec': 'bg-blue-700/30 border border-blue-600',
    'restricted': 'bg-purple-600/30 border border-purple-500',
    'classified': 'bg-pink-600/30 border border-pink-500',
    'covert': 'bg-red-600/30 border border-red-500',
    'knife': 'bg-yellow-600/30 border border-yellow-500',
    'gloves': 'bg-yellow-600/30 border border-yellow-500'
  }
  return backgrounds[rarity as keyof typeof backgrounds] || backgrounds.consumer
}

const complete = () => {
  emit('complete', { items: wonItems.value })
}

// Initialize reel items for single case
onMounted(() => {
  if (props.count === 1) {
    reelItems.value = generateReelItems()
  }
})
</script>

<style scoped>
/* Custom scrollbar for results grid */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  @apply bg-gray-700;
}

.max-h-96::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-full;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
