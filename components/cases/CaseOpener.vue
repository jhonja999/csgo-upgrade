<!-- components/cases/CaseOpener.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-8 space-y-8">
    <!-- Case Display -->
    <div class="text-center">
      <div class="relative w-64 h-64 mx-auto mb-6">
        <div 
          class="w-full h-full rounded-lg overflow-hidden"
          :style="{ background: selectedCase.background }"
        >
          <img 
            :src="selectedCase.image" 
            :alt="selectedCase.name"
            class="w-full h-full object-contain p-8"
          >
        </div>
        
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl animate-pulse" />
      </div>
      
      <h2 class="text-3xl font-bold mb-2">{{ selectedCase.name }}</h2>
      <p class="text-gray-300 mb-4">{{ selectedCase.description }}</p>
      
      <div class="flex items-center justify-center space-x-2 mb-6">
        <img src="/dist/img/other/coin.png" alt="Coin" class="w-8 h-8">
        <span class="text-4xl font-bold text-green-400">${{ selectedCase.price.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Opening Options -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Single Open -->
      <div class="bg-gray-700 rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold mb-4">Single Open</h3>
        <p class="text-gray-300 mb-6">Open one case for the listed price</p>
        
        <button
          @click="openSingle"
          :disabled="!canOpen(1)"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
        >
          Open 1x - ${{ selectedCase.price.toFixed(2) }}
        </button>
      </div>

      <!-- Multiple Opens -->
      <div class="bg-gray-700 rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold mb-4">Multiple Opens</h3>
        <p class="text-gray-300 mb-6">Open multiple cases with discount</p>
        
        <div class="space-y-3">
          <button
            @click="openMultiple(5)"
            :disabled="!canOpen(5)"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-2 rounded-lg font-bold transition-colors text-sm"
          >
            Open 5x - ${{ (selectedCase.price * 5 * 0.95).toFixed(2) }}
            <span class="text-green-200 block text-xs">5% off</span>
          </button>
          
          <button
            @click="openMultiple(10)"
            :disabled="!canOpen(10)"
            class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-2 rounded-lg font-bold transition-colors text-sm"
          >
            Open 10x - ${{ (selectedCase.price * 10 * 0.90).toFixed(2) }}
            <span class="text-purple-200 block text-xs">10% off</span>
          </button>
        </div>
      </div>

      <!-- Auto Open -->
      <div class="bg-gray-700 rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold mb-4">Auto Open</h3>
        <p class="text-gray-300 mb-6">Keep opening until target value</p>
        
        <div class="space-y-3">
          <input
            v-model.number="autoOpenTarget"
            type="number"
            placeholder="Target value..."
            min="0"
            step="0.01"
            class="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-center"
          >
          
          <button
            @click="startAutoOpen"
            :disabled="!canAutoOpen"
            class="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
          >
            {{ isAutoOpening ? 'Stop Auto' : 'Start Auto' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Opening Statistics -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Opening Statistics</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">{{ stats.totalOpened }}</div>
          <div class="text-sm text-gray-400">Cases Opened</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">${{ stats.totalSpent.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Spent</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-400">${{ stats.totalValue.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Items Value</div>
        </div>
        
        <div class="text-center">
          <div 
            :class="`text-2xl font-bold ${
              stats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
            }`"
          >
            {{ stats.profitLoss >= 0 ? '+' : '' }}${{ stats.profitLoss.toFixed(2) }}
          </div>
          <div class="text-sm text-gray-400">Profit/Loss</div>
        </div>
      </div>
    </div>

    <!-- Recent Drops -->
    <div v-if="recentDrops.length > 0" class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Recent Drops</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="item in recentDrops.slice(0, 6)" 
          :key="item.id"
          class="text-center p-3 bg-gray-600 rounded-lg"
        >
          <img 
            :src="item.image" 
            :alt="item.name"
            class="w-16 h-16 object-contain mx-auto mb-2"
          >
          <p class="text-xs font-semibold truncate">{{ item.name }}</p>
          <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- Opening Animation Modal -->
    <CaseAnimation
      v-if="showAnimation"
      :case="selectedCase"
      :count="openingCount"
      @complete="handleOpeningComplete"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

interface Props {
  selectedCase: GameCase
}

const props = defineProps<Props>()
const emit = defineEmits<{
  opened: [results: { items: CSGOItem[], totalCost: number }]
}>()

const { hasEnoughBalance, placeBet, payoutWin } = useBalance()
const { playSound, sounds } = useAudio()

// State
const showAnimation = ref(false)
const openingCount = ref(1)
const isAutoOpening = ref(false)
const autoOpenTarget = ref(100)
const recentDrops = ref<CSGOItem[]>([])

const stats = ref({
  totalOpened: 0,
  totalSpent: 0,
  totalValue: 0,
  profitLoss: 0
})

// Computed
const canOpen = (count: number) => {
  const cost = props.selectedCase.price * count
  const discount = count >= 10 ? 0.90 : count >= 5 ? 0.95 : 1
  return hasEnoughBalance(cost * discount)
}

const canAutoOpen = computed(() => {
  return !isAutoOpening.value && autoOpenTarget.value > 0 && canOpen(1)
})

// Methods
const openSingle = () => {
  openCases(1)
}

const openMultiple = (count: number) => {
  openCases(count)
}

const openCases = async (count: number) => {
  if (!canOpen(count)) return
  
  showAnimation.value = true
  openingCount.value = count
  
  try {
    const discount = count >= 10 ? 0.90 : count >= 5 ? 0.95 : 1
    const totalCost = props.selectedCase.price * count * discount
    
    placeBet(totalCost, 'case', `Opened ${count}x ${props.selectedCase.name}`)
    playSound(sounds.caseOpen)
    
    // Simulate case opening delay
    await new Promise(resolve => setTimeout(resolve, 3000 + (count * 500)))
    
    // Generate random items
    const items = generateCaseItems(count)
    const totalValue = items.reduce((sum, item) => sum + item.price, 0)
    
    // Update stats
    stats.value.totalOpened += count
    stats.value.totalSpent += totalCost
    stats.value.totalValue += totalValue
    stats.value.profitLoss = stats.value.totalValue - stats.value.totalSpent
    
    // Add to recent drops
    recentDrops.value.unshift(...items)
    if (recentDrops.value.length > 20) {
      recentDrops.value = recentDrops.value.slice(0, 20)
    }
    
    // Pay out the items (add to inventory)
    items.forEach(item => {
      payoutWin(item.price, 'case', `Won ${item.name}`)
    })
    
    emit('opened', { items, totalCost })
    
  } catch (error) {
    console.error('Case opening failed:', error)
  } finally {
    showAnimation.value = false
  }
}

const startAutoOpen = () => {
  if (isAutoOpening.value) {
    stopAutoOpen()
    return
  }
  
  isAutoOpening.value = true
  autoOpenLoop()
}

const stopAutoOpen = () => {
  isAutoOpening.value = false
}

const autoOpenLoop = async () => {
  while (isAutoOpening.value && canOpen(1)) {
    const items = await openSingleQuick()
    const bestItem = items.reduce((best, item) => item.price > best.price ? item : best, items[0])
    
    if (bestItem.price >= autoOpenTarget.value) {
      stopAutoOpen()
      break
    }
    
    // Wait between opens
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  if (isAutoOpening.value) {
    stopAutoOpen()
  }
}

const openSingleQuick = async (): Promise<CSGOItem[]> => {
  if (!canOpen(1)) return []
  
  try {
    placeBet(props.selectedCase.price, 'case', `Auto opened ${props.selectedCase.name}`)
    
    const items = generateCaseItems(1)
    const totalValue = items.reduce((sum, item) => sum + item.price, 0)
    
    // Update stats
    stats.value.totalOpened += 1
    stats.value.totalSpent += props.selectedCase.price
    stats.value.totalValue += totalValue
    stats.value.profitLoss = stats.value.totalValue - stats.value.totalSpent
    
    // Add to recent drops
    recentDrops.value.unshift(...items)
    if (recentDrops.value.length > 20) {
      recentDrops.value = recentDrops.value.slice(0, 20)
    }
    
    return items
  } catch (error) {
    console.error('Quick case opening failed:', error)
    return []
  }
}

const generateCaseItems = (count: number): CSGOItem[] => {
  // Mock item generation based on rarity weights
  const items: CSGOItem[] = []
  
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
  
  for (let i = 0; i < count; i++) {
    const random = Math.random() * 100
    let cumulativeWeight = 0
    let selectedRarity = 'consumer'
    
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulativeWeight += weight
      if (random <= cumulativeWeight) {
        selectedRarity = rarity
        break
      }
    }
    
    const rarityItems = mockItems[selectedRarity as keyof typeof mockItems]
    const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)]
    
    items.push({
      id: `case_${Date.now()}_${i}`,
      name: randomItem.name,
      rarity: selectedRarity,
      collection: props.selectedCase.name,
      image: randomItem.image,
      price: randomItem.price,
      tradable: true,
      marketable: true,
      obtainedAt: new Date()
    })
  }
  
  return items
}

const handleOpeningComplete = (results: { items: CSGOItem[] }) => {
  // Animation completed, results already processed
  showAnimation.value = false
}

// Load stats from localStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem(`case-stats-${props.selectedCase.id}`)
    if (saved) {
      stats.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load case stats:', error)
  }
})

// Save stats when they change
watch(stats, () => {
  try {
    localStorage.setItem(`case-stats-${props.selectedCase.id}`, JSON.stringify(stats.value))
  } catch (error) {
    console.error('Failed to save case stats:', error)
  }
}, { deep: true })
</script>
