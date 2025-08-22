<!-- components/cases/CaseOpenModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-gray-800 rounded-xl p-8 max-w-4xl w-full mx-4" @click.stop>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold">Opening {{ case.name }}</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Animation Container -->
      <div class="relative">
        <!-- Arrow Indicator -->
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <div class="w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent border-b-yellow-400 drop-shadow-lg" />
        </div>

        <!-- Items Container -->
        <div class="h-48 bg-gray-700 rounded-lg overflow-hidden relative">
          <div 
            ref="itemsContainer"
            class="flex h-full items-center transition-transform duration-[4000ms] ease-out"
            :style="{ transform: `translateX(${animationOffset}px)` }"
          >
            <div 
              v-for="(item, index) in animationItems" 
              :key="index"
              :class="[
                'flex-shrink-0 w-32 h-full flex flex-col items-center justify-center p-4 border-r border-gray-600',
                getRarityClass(item.rarity)
              ]"
            >
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-20 h-20 object-contain mb-2"
              >
              <p class="text-xs text-center font-semibold truncate w-full">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center mt-8 space-x-4">
        <button
          @click="startAnimation"
          :disabled="isAnimating"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
        >
          {{ isAnimating ? 'Opening...' : 'Open!' }}
        </button>
        
        <button
          @click="$emit('close')"
          :disabled="isAnimating"
          class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      <!-- Result Display -->
      <div v-if="wonItem" class="mt-8 text-center">
        <div class="mb-4">
          <h3 class="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
          <p class="text-gray-300">You won:</p>
        </div>
        
        <div :class="`inline-block p-6 rounded-lg ${getRarityClass(wonItem.rarity)}`">
          <img 
            :src="wonItem.image" 
            :alt="wonItem.name"
            class="w-32 h-32 object-contain mx-auto mb-4"
          >
          <h4 class="text-xl font-bold mb-2">{{ wonItem.name }}</h4>
          <div class="flex items-center justify-center space-x-2">
            <img src="/dist/img/other/coin.png" alt="Coin" class="w-6 h-6">
            <span class="text-2xl font-bold text-green-400">${{ wonItem.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

interface Props {
  case: GameCase
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  result: [result: { item: CSGOItem }]
}>()

const { openCase } = useGameLogic()
const { playSound, sounds } = useAudio()

const isAnimating = ref(false)
const animationOffset = ref(0)
const wonItem = ref<CSGOItem | null>(null)
const animationItems = ref<CSGOItem[]>([])

const generateAnimationItems = () => {
  const items: CSGOItem[] = []
  
  // Generate 50 random items for smooth animation
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * mockItems.length)
    items.push(mockItems[randomIndex])
  }
  
  return items
}

// Mock items for animation (in real app, these would come from case data)
const mockItems: CSGOItem[] = [
  {
    id: '1',
    name: 'AK-47 | Redline',
    rarity: 'classified',
    collection: 'Phoenix',
    image: '/dist/img/ak47/redline.png',
    price: 45.60,
    tradable: true,
    marketable: true,
    obtainedAt: new Date()
  },
  {
    id: '2', 
    name: 'AWP | Electric Hive',
    rarity: 'covert',
    collection: 'Phoenix',
    image: '/dist/img/awp/electrichive.png',
    price: 85.40,
    tradable: true,
    marketable: true,
    obtainedAt: new Date()
  },
  {
    id: '3',
    name: 'M4A4 | Howl',
    rarity: 'covert',
    collection: 'Huntsman',
    image: '/dist/img/m4a4/howl.png',
    price: 1240.50,
    tradable: true,
    marketable: true,
    obtainedAt: new Date()
  }
]

const startAnimation = async () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  wonItem.value = null
  
  try {
    // Play opening sound
    playSound(sounds.caseOpen)
    
    // Generate animation items
    animationItems.value = generateAnimationItems()
    
    // Perform case opening logic
    const result = await openCase(props.case)
    wonItem.value = result.item
    
    // Start animation
    const winningIndex = 25 // Middle of animation
    const itemWidth = 128 // 32 * 4 (w-32)
    const finalOffset = -(winningIndex * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2)
    
    // Animate to winning item
    setTimeout(() => {
      animationOffset.value = finalOffset
    }, 100)
    
    // Show result after animation
    setTimeout(() => {
      isAnimating.value = false
      emit('result', { item: result.item })
    }, 4500)
    
  } catch (error) {
    console.error('Case opening failed:', error)
    isAnimating.value = false
  }
}

const getRarityClass = (rarity: string) => {
  const classes = {
    consumer: 'bg-gray-600/30 border-gray-400',
    industrial: 'bg-blue-600/30 border-blue-400',
    'mil-spec': 'bg-blue-700/30 border-blue-600',
    restricted: 'bg-purple-600/30 border-purple-500',
    classified: 'bg-pink-600/30 border-pink-500',
    covert: 'bg-red-600/30 border-red-500',
    knife: 'bg-yellow-600/30 border-yellow-500',
    gloves: 'bg-yellow-600/30 border-yellow-500'
  }
  return classes[rarity as keyof typeof classes] || classes.consumer
}

// Initialize animation items on mount
onMounted(() => {
  animationItems.value = generateAnimationItems()
})
</script>
