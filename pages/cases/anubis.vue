<!-- pages/cases/anubis.vue -->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="relative w-64 h-64 mx-auto mb-6">
        <div 
          class="w-full h-full rounded-lg overflow-hidden"
          style="background: linear-gradient(45deg, #d97706, #fbbf24)"
        >
          <img 
            src="/dist/img/cases/anubis.png" 
            alt="Anubis Case"
            class="w-full h-full object-contain p-8"
          >
        </div>
        
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-lg blur-xl animate-pulse" />
      </div>
      
      <h1 class="text-4xl font-bold mb-4">Anubis Case</h1>
      <p class="text-xl text-gray-300 mb-6">
        Ancient Egyptian themed weapons with mystical designs
      </p>
      
      <div class="flex items-center justify-center space-x-2 mb-8">
        <img src="/dist/img/other/coin.png" alt="Coin" class="w-8 h-8">
        <span class="text-4xl font-bold text-green-400">$2.49</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-gray-800 rounded-xl">
      <div class="border-b border-gray-700">
        <nav class="flex space-x-8 px-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Case Opening Tab -->
        <div v-if="activeTab === 'open'">
          <CaseOpener :selected-case="anubisCase" @opened="handleOpened" />
        </div>

        <!-- Contents Tab -->
        <div v-if="activeTab === 'contents'">
          <CaseChances :case="anubisCase" />
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'">
          <div class="space-y-6">
            <!-- Opening Statistics -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Your Anubis Case Statistics</h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-400">{{ caseStats.opened }}</div>
                  <div class="text-sm text-gray-400">Cases Opened</div>
                </div>
                
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-400">${{ caseStats.totalSpent.toFixed(2) }}</div>
                  <div class="text-sm text-gray-400">Total Spent</div>
                </div>
                
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-400">${{ caseStats.bestItem.toFixed(2) }}</div>
                  <div class="text-sm text-gray-400">Best Item</div>
                </div>
                
                <div class="text-center">
                  <div 
                    :class="`text-2xl font-bold ${
                      caseStats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`"
                  >
                    {{ caseStats.profitLoss >= 0 ? '+' : '' }}${{ caseStats.profitLoss.toFixed(2) }}
                  </div>
                  <div class="text-sm text-gray-400">Profit/Loss</div>
                </div>
              </div>
            </div>

            <!-- Recent Drops -->
            <div v-if="recentDrops.length > 0" class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Recent Drops from Anubis Cases</h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div 
                  v-for="item in recentDrops.slice(0, 12)" 
                  :key="item.id"
                  class="bg-gray-600 rounded-lg p-3 text-center"
                >
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-16 h-16 object-contain mx-auto mb-2"
                  >
                  <p class="text-xs font-semibold truncate mb-1">{{ item.name }}</p>
                  <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <!-- Rarity Distribution -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Your Drop Distribution</h3>
              
              <div class="space-y-3">
                <div 
                  v-for="rarity in rarityStats" 
                  :key="rarity.name"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div :class="`w-4 h-4 rounded-full ${getRarityColor(rarity.name)}`" />
                    <span class="font-semibold capitalize">{{ rarity.name.replace('-', ' ') }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-4">
                    <div class="text-right">
                      <div class="font-bold">{{ rarity.count }}</div>
                      <div class="text-xs text-gray-400">{{ rarity.percentage.toFixed(1) }}%</div>
                    </div>
                    
                    <div class="w-32 bg-gray-600 rounded-full h-2">
                      <div 
                        :class="`h-2 rounded-full ${getRarityColor(rarity.name)}`"
                        :style="{ width: `${rarity.percentage}%` }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Cases -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Related Cases</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="relatedCase in relatedCases"
          :key="relatedCase.id"
          :to="`/cases/${relatedCase.id}`"
          class="group bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          <div class="relative p-6 text-center">
            <img 
              :src="relatedCase.image" 
              :alt="relatedCase.name"
              class="w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
            >
            
            <h3 class="text-lg font-bold mb-2">{{ relatedCase.name }}</h3>
            
            <div class="flex items-center justify-center space-x-2">
              <img src="/dist/img/other/coin.png" alt="Coin" class="w-4 h-4">
              <span class="text-xl font-bold text-green-400">${{ relatedCase.price.toFixed(2) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

// Meta
useHead({
  title: 'Anubis Case - CSGOLuck'
})

// State
const activeTab = ref('open')

const tabs = [
  { id: 'open', name: 'Open Cases' },
  { id: 'contents', name: 'Contents & Chances' },
  { id: 'stats', name: 'Statistics' }
]

// Anubis Case data
const anubisCase: GameCase = {
  id: 'anubis',
  name: 'Anubis Case',
  description: 'Ancient Egyptian themed weapons with mystical designs',
  image: '/dist/img/cases/anubis.png',
  price: 2.49,
  category: 'weapon',
  background: 'linear-gradient(45deg, #d97706, #fbbf24)',
  items: []
}

// Statistics
const caseStats = ref({
  opened: 0,
  totalSpent: 0,
  bestItem: 0,
  profitLoss: 0
})

const recentDrops = ref<CSGOItem[]>([])

const rarityStats = ref([
  { name: 'consumer', count: 0, percentage: 0 },
  { name: 'industrial', count: 0, percentage: 0 },
  { name: 'mil-spec', count: 0, percentage: 0 },
  { name: 'restricted', count: 0, percentage: 0 },
  { name: 'classified', count: 0, percentage: 0 },
  { name: 'covert', count: 0, percentage: 0 },
  { name: 'knife', count: 0, percentage: 0 }
])

// Related cases
const relatedCases = ref<GameCase[]>([
  {
    id: 'awp',
    name: 'AWP Case',
    description: 'Exclusive AWP skins collection',
    image: '/dist/img/cases/awp.png',
    price: 4.99,
    category: 'weapon',
    background: 'linear-gradient(45deg, #dc2626, #f87171)',
    items: []
  },
  {
    id: 'knife',
    name: 'Knife Case',
    description: 'Rare knife skins with unique patterns',
    image: '/dist/img/cases/knife.png',
    price: 9.99,
    category: 'knife',
    background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
    items: []
  },
  {
    id: 'glove',
    name: 'Glove Case',
    description: 'Premium glove skins for your hands',
    image: '/dist/img/cases/glove.png',
    price: 7.49,
    category: 'glove',
    background: 'linear-gradient(45deg, #059669, #10b981)',
    items: []
  }
])

// Methods
const handleOpened = (results: { items: CSGOItem[], totalCost: number }) => {
  // Update statistics
  caseStats.value.opened += results.items.length
  caseStats.value.totalSpent += results.totalCost
  
  const bestItemValue = Math.max(...results.items.map(item => item.price))
  if (bestItemValue > caseStats.value.bestItem) {
    caseStats.value.bestItem = bestItemValue
  }
  
  const totalValue = results.items.reduce((sum, item) => sum + item.price, 0)
  caseStats.value.profitLoss += totalValue - results.totalCost
  
  // Add to recent drops
  recentDrops.value.unshift(...results.items)
  if (recentDrops.value.length > 24) {
    recentDrops.value = recentDrops.value.slice(0, 24)
  }
  
  // Update rarity stats
  updateRarityStats(results.items)
  
  // Save to localStorage
  saveStats()
}

const updateRarityStats = (items: CSGOItem[]) => {
  items.forEach(item => {
    const rarityIndex = rarityStats.value.findIndex(r => r.name === item.rarity)
    if (rarityIndex > -1) {
      rarityStats.value[rarityIndex].count++
    }
  })
  
  // Recalculate percentages
  const total = rarityStats.value.reduce((sum, rarity) => sum + rarity.count, 0)
  if (total > 0) {
    rarityStats.value.forEach(rarity => {
      rarity.percentage = (rarity.count / total) * 100
    })
  }
}

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

const saveStats = () => {
  try {
    localStorage.setItem('anubis-case-stats', JSON.stringify({
      caseStats: caseStats.value,
      recentDrops: recentDrops.value,
      rarityStats: rarityStats.value
    }))
  } catch (error) {
    console.error('Failed to save Anubis case stats:', error)
  }
}

const loadStats = () => {
  try {
    const saved = localStorage.getItem('anubis-case-stats')
    if (saved) {
      const data = JSON.parse(saved)
      caseStats.value = data.caseStats || caseStats.value
      recentDrops.value = (data.recentDrops || []).map((item: any) => ({
        ...item,
        obtainedAt: new Date(item.obtainedAt)
      }))
      rarityStats.value = data.rarityStats || rarityStats.value
    }
  } catch (error) {
    console.error('Failed to load Anubis case stats:', error)
  }
}

// Load statistics on mount
onMounted(() => {
  loadStats()
})
</script>
