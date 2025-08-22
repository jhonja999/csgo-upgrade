<!-- components/cases/CaseChances.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-8 space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-2">Case Contents & Chances</h2>
      <p class="text-gray-300">See what you can get from this case</p>
    </div>

    <!-- Rarity Breakdown -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Drop Chances by Rarity</h3>
      
      <div class="space-y-4">
        <div 
          v-for="rarity in rarityChances" 
          :key="rarity.name"
          class="flex items-center justify-between p-3 rounded-lg"
          :class="rarity.bgClass"
        >
          <div class="flex items-center space-x-3">
            <div :class="`w-4 h-4 rounded-full ${rarity.colorClass}`" />
            <span class="font-semibold capitalize">{{ rarity.name.replace('-', ' ') }}</span>
          </div>
          
          <div class="text-right">
            <div class="font-bold">{{ rarity.chance.toFixed(2) }}%</div>
            <div class="text-sm text-gray-300">{{ rarity.itemCount }} items</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Items by Rarity -->
    <div class="space-y-6">
      <div 
        v-for="rarity in itemsByRarity" 
        :key="rarity.name"
        class="bg-gray-700 rounded-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold flex items-center">
            <div :class="`w-4 h-4 rounded-full mr-3 ${getRarityColor(rarity.name)}`" />
            {{ formatRarity(rarity.name) }}
          </h3>
          <span class="text-sm text-gray-400">{{ rarity.chance.toFixed(2) }}% chance</span>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="item in rarity.items" 
            :key="item.id"
            class="bg-gray-600 rounded-lg p-3 text-center hover:bg-gray-500 transition-colors cursor-pointer"
            @click="showItemDetails(item)"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-16 h-16 object-contain mx-auto mb-2"
            >
            <p class="text-xs font-semibold truncate mb-1">{{ item.name }}</p>
            <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
            <p class="text-xs text-gray-400">{{ item.dropChance.toFixed(3) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Expected Value Calculator -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Expected Value Analysis</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400">${{ casePrice.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Case Price</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">${{ expectedValue.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Expected Value</div>
        </div>
        
        <div class="text-center">
          <div 
            :class="`text-3xl font-bold ${
              expectedReturn >= 100 ? 'text-green-400' : 
              expectedReturn >= 80 ? 'text-yellow-400' : 'text-red-400'
            }`"
          >
            {{ expectedReturn.toFixed(1) }}%
          </div>
          <div class="text-sm text-gray-400">Expected Return</div>
        </div>
      </div>
      
      <!-- Profit Probability -->
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold">Profit Probability</span>
          <span class="font-bold">{{ profitProbability.toFixed(1) }}%</span>
        </div>
        <div class="w-full bg-gray-600 rounded-full h-3">
          <div 
            :style="{ width: `${profitProbability}%` }"
            :class="`h-3 rounded-full transition-all duration-500 ${
              profitProbability >= 50 ? 'bg-green-400' :
              profitProbability >= 25 ? 'bg-yellow-400' : 'bg-red-400'
            }`"
          />
        </div>
      </div>
    </div>

    <!-- Opening Simulator -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Opening Simulator</h3>
      <p class="text-gray-300 mb-4">Simulate opening cases to see potential outcomes</p>
      
      <div class="flex items-center space-x-4 mb-4">
        <input
          v-model.number="simulationCount"
          type="number"
          min="1"
          max="1000"
          class="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 w-32"
          placeholder="Count"
        >
        
        <button
          @click="runSimulation"
          :disabled="isSimulating"
          class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {{ isSimulating ? 'Simulating...' : 'Simulate' }}
        </button>
      </div>
      
      <div v-if="simulationResults" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-xl font-bold text-blue-400">${{ simulationResults.totalCost.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Cost</div>
        </div>
        
        <div class="text-center">
          <div class="text-xl font-bold text-green-400">${{ simulationResults.totalValue.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Value</div>
        </div>
        
        <div class="text-center">
          <div 
            :class="`text-xl font-bold ${
              simulationResults.profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`"
          >
            {{ simulationResults.profit >= 0 ? '+' : '' }}${{ simulationResults.profit.toFixed(2) }}
          </div>
          <div class="text-sm text-gray-400">Profit/Loss</div>
        </div>
        
        <div class="text-center">
          <div class="text-xl font-bold text-yellow-400">${{ simulationResults.bestItem.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Best Item</div>
        </div>
      </div>
    </div>

    <!-- Item Detail Modal -->
    <div v-if="selectedItem" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="closeItemDetails">
      <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
        <div class="text-center">
          <img 
            :src="selectedItem.image" 
            :alt="selectedItem.name"
            class="w-32 h-32 object-contain mx-auto mb-4"
          >
          
          <h3 class="text-2xl font-bold mb-2">{{ selectedItem.name }}</h3>
          <p class="text-gray-300 mb-4">{{ formatRarity(selectedItem.rarity) }}</p>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Market Price:</span>
              <span class="font-bold text-green-400">${{ selectedItem.price.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span>Drop Chance:</span>
              <span class="font-bold">{{ selectedItem.dropChance.toFixed(3) }}%</span>
            </div>
            
            <div class="flex justify-between">
              <span>Profit Potential:</span>
              <span 
                :class="`font-bold ${
                  selectedItem.price > casePrice ? 'text-green-400' : 'text-red-400'
                }`"
              >
                {{ selectedItem.price > casePrice ? '+' : '' }}${{ (selectedItem.price - casePrice).toFixed(2) }}
              </span>
            </div>
          </div>
          
          <button
            @click="closeItemDetails"
            class="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
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

// State
const selectedItem = ref<(CSGOItem & { dropChance: number }) | null>(null)
const simulationCount = ref(10)
const isSimulating = ref(false)
const simulationResults = ref<{
  totalCost: number
  totalValue: number
  profit: number
  bestItem: number
} | null>(null)

// Mock case contents
const caseItems = ref<(CSGOItem & { dropChance: number })[]>([
  // Consumer Grade (60%)
  { id: '1', name: 'P250 | Sand Dune', rarity: 'consumer', collection: props.case.name, image: '/dist/img/p250/sanddune.png', price: 0.03, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 20 },
  { id: '2', name: 'SCAR-20 | Storm', rarity: 'consumer', collection: props.case.name, image: '/dist/img/scar20/storm.png', price: 0.05, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 20 },
  { id: '3', name: 'MP9 | Storm', rarity: 'consumer', collection: props.case.name, image: '/dist/img/mp9/storm.png', price: 0.04, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 20 },
  
  // Industrial Grade (25%)
  { id: '4', name: 'M4A4 | Tornado', rarity: 'industrial', collection: props.case.name, image: '/dist/img/m4a4/tornado.png', price: 0.25, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 8.33 },
  { id: '5', name: 'AK-47 | Safari Mesh', rarity: 'industrial', collection: props.case.name, image: '/dist/img/ak47/safari.png', price: 0.30, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 8.33 },
  { id: '6', name: 'AWP | Safari Mesh', rarity: 'industrial', collection: props.case.name, image: '/dist/img/awp/safari.png', price: 0.45, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 8.34 },
  
  // Mil-Spec Grade (10%)
  { id: '7', name: 'AK-47 | Blue Laminate', rarity: 'mil-spec', collection: props.case.name, image: '/dist/img/ak47/blue.png', price: 2.50, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 3.33 },
  { id: '8', name: 'M4A1-S | Dark Water', rarity: 'mil-spec', collection: props.case.name, image: '/dist/img/m4a1s/darkwater.png', price: 3.20, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 3.33 },
  { id: '9', name: 'AWP | Pit Viper', rarity: 'mil-spec', collection: props.case.name, image: '/dist/img/awp/pitviper.png', price: 4.80, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 3.34 },
  
  // Restricted (3%)
  { id: '10', name: 'AWP | Pink DDPAT', rarity: 'restricted', collection: props.case.name, image: '/dist/img/awp/pink.png', price: 15.60, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 1.5 },
  { id: '11', name: 'AK-47 | Case Hardened', rarity: 'restricted', collection: props.case.name, image: '/dist/img/ak47/casehardened.png', price: 22.40, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 1.5 },
  
  // Classified (1.5%)
  { id: '12', name: 'AK-47 | Redline', rarity: 'classified', collection: props.case.name, image: '/dist/img/ak47/redline.png', price: 45.60, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.75 },
  { id: '13', name: 'M4A4 | Asiimov', rarity: 'classified', collection: props.case.name, image: '/dist/img/m4a4/asiimov.png', price: 67.80, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.75 },
  
  // Covert (0.4%)
  { id: '14', name: 'AWP | Dragon Lore', rarity: 'covert', collection: props.case.name, image: '/dist/img/awp/dragonlore.png', price: 2450.00, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.2 },
  { id: '15', name: 'AK-47 | Fire Serpent', rarity: 'covert', collection: props.case.name, image: '/dist/img/ak47/fire.png', price: 1890.50, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.2 },
  
  // Knife (0.1%)
  { id: '16', name: 'Karambit | Fade', rarity: 'knife', collection: props.case.name, image: '/dist/img/knives/karambit.png', price: 1650.00, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.05 },
  { id: '17', name: 'Butterfly Knife | Slaughter', rarity: 'knife', collection: props.case.name, image: '/dist/img/knives/butterfly.png', price: 1200.00, tradable: true, marketable: true, obtainedAt: new Date(), dropChance: 0.05 }
])

// Computed
const casePrice = computed(() => props.case.price)

const rarityChances = computed(() => {
  const rarities = ['consumer', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', 'knife']
  
  return rarities.map(rarity => {
    const items = caseItems.value.filter(item => item.rarity === rarity)
    const chance = items.reduce((sum, item) => sum + item.dropChance, 0)
    
    return {
      name: rarity,
      chance,
      itemCount: items.length,
      colorClass: getRarityColor(rarity),
      bgClass: getRarityBg(rarity)
    }
  }).filter(r => r.itemCount > 0)
})

const itemsByRarity = computed(() => {
  const rarities = ['consumer', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', 'knife']
  
  return rarities.map(rarity => {
    const items = caseItems.value.filter(item => item.rarity === rarity)
    const chance = items.reduce((sum, item) => sum + item.dropChance, 0)
    
    return {
      name: rarity,
      chance,
      items: items.sort((a, b) => b.price - a.price)
    }
  }).filter(r => r.items.length > 0)
})

const expectedValue = computed(() => {
  return caseItems.value.reduce((sum, item) => {
    return sum + (item.price * (item.dropChance / 100))
  }, 0)
})

const expectedReturn = computed(() => {
  return (expectedValue.value / casePrice.value) * 100
})

const profitProbability = computed(() => {
  return caseItems.value
    .filter(item => item.price > casePrice.value)
    .reduce((sum, item) => sum + item.dropChance, 0)
})

// Methods
const getRarityColor = (rarity: string) => {
  const colors = {
    'consumer': 'bg-gray-400',
    'industrial': 'bg-blue-400',
    'mil-spec': 'bg-blue-600',
    'restricted': 'bg-purple-500',
    'classified': 'bg-pink-500',
    'covert': 'bg-red-500',
    'knife': 'bg-yellow-500',
    'gloves': 'bg-yellow-500'
  }
  return colors[rarity as keyof typeof colors] || colors.consumer
}

const getRarityBg = (rarity: string) => {
  const colors = {
    'consumer': 'bg-gray-600/20',
    'industrial': 'bg-blue-600/20',
    'mil-spec': 'bg-blue-700/20',
    'restricted': 'bg-purple-600/20',
    'classified': 'bg-pink-600/20',
    'covert': 'bg-red-600/20',
    'knife': 'bg-yellow-600/20',
    'gloves': 'bg-yellow-600/20'
  }
  return colors[rarity as keyof typeof colors] || colors.consumer
}

const formatRarity = (rarity: string) => {
  return rarity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const showItemDetails = (item: CSGOItem & { dropChance: number }) => {
  selectedItem.value = item
}

const closeItemDetails = () => {
  selectedItem.value = null
}

const runSimulation = async () => {
  if (isSimulating.value) return
  
  isSimulating.value = true
  
  try {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let totalValue = 0
    let bestItemValue = 0
    
    for (let i = 0; i < simulationCount.value; i++) {
      const random = Math.random() * 100
      let cumulativeChance = 0
      
      for (const item of caseItems.value) {
        cumulativeChance += item.dropChance
        if (random <= cumulativeChance) {
          totalValue += item.price
          if (item.price > bestItemValue) {
            bestItemValue = item.price
          }
          break
        }
      }
    }
    
    const totalCost = casePrice.value * simulationCount.value
    
    simulationResults.value = {
      totalCost,
      totalValue,
      profit: totalValue - totalCost,
      bestItem: bestItemValue
    }
    
  } catch (error) {
    console.error('Simulation failed:', error)
  } finally {
    isSimulating.value = false
  }
}
</script>
