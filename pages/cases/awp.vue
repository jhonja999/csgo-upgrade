<!-- pages/cases/awp.vue -->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="relative w-64 h-64 mx-auto mb-6">
        <div 
          class="w-full h-full rounded-lg overflow-hidden"
          style="background: linear-gradient(45deg, #dc2626, #f87171)"
        >
          <img 
            src="/dist/img/cases/awp.png" 
            alt="AWP Case"
            class="w-full h-full object-contain p-8"
          >
        </div>
        
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-lg blur-xl animate-pulse" />
      </div>
      
      <h1 class="text-4xl font-bold mb-4">AWP Case</h1>
      <p class="text-xl text-gray-300 mb-6">
        Exclusive collection of premium AWP skins from legendary collections
      </p>
      
      <div class="flex items-center justify-center space-x-2 mb-8">
        <img src="/dist/img/other/coin.png" alt="Coin" class="w-8 h-8">
        <span class="text-4xl font-bold text-green-400">$4.99</span>
      </div>
      
      <!-- Special Features -->
      <div class="flex justify-center space-x-6 mb-8">
        <div class="flex items-center space-x-2 bg-red-600/20 px-4 py-2 rounded-lg">
          <div class="w-2 h-2 bg-red-400 rounded-full"></div>
          <span class="text-sm font-semibold text-red-400">Premium Skins</span>
        </div>
        <div class="flex items-center space-x-2 bg-yellow-600/20 px-4 py-2 rounded-lg">
          <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span class="text-sm font-semibold text-yellow-400">Higher Odds</span>
        </div>
        <div class="flex items-center space-x-2 bg-purple-600/20 px-4 py-2 rounded-lg">
          <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span class="text-sm font-semibold text-purple-400">AWP Only</span>
        </div>
      </div>
    </div>

    <!-- Warning Notice -->
    <div class="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-6">
      <div class="flex items-center space-x-3">
        <div class="text-2xl">⚠️</div>
        <div>
          <h3 class="text-lg font-bold text-red-400">Premium Case Notice</h3>
          <p class="text-gray-300">
            This case contains only AWP skins with enhanced drop rates for rare items. 
            Minimum guaranteed value: $2.50 per case.
          </p>
        </div>
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
                ? 'border-red-500 text-red-500'
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
          <CaseOpener :selected-case="awpCase" @opened="handleOpened" />
        </div>

        <!-- Contents Tab -->
        <div v-if="activeTab === 'contents'">
          <CaseChances :case="awpCase" />
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'">
          <div class="space-y-6">
            <!-- Opening Statistics -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Your AWP Case Statistics</h3>
              
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
                  <div class="text-sm text-gray-400">Best AWP</div>
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

            <!-- AWP Collection Progress -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">AWP Collection Progress</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="awp in awpCollection" 
                  :key="awp.name"
                  :class="[
                    'flex items-center justify-between p-3 rounded-lg',
                    awp.owned ? 'bg-green-600/20 border border-green-500/30' : 'bg-gray-600'
                  ]"
                >
                  <div class="flex items-center space-x-3">
                    <img 
                      :src="awp.image" 
                      :alt="awp.name"
                      class="w-12 h-12 object-contain"
                    >
                    <div>
                      <p class="font-semibold">{{ awp.name }}</p>
                      <p class="text-sm text-gray-400">${{ awp.price.toFixed(2) }}</p>
                    </div>
                  </div>
                  
                  <div :class="`text-lg ${awp.owned ? 'text-green-400' : 'text-gray-400'}`">
                    {{ awp.owned ? '✓' : '○' }}
                  </div>
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-t border-gray-600">
                <div class="flex justify-between text-sm">
                  <span>Collection Progress:</span>
                  <span class="font-bold">{{ ownedCount }}/{{ awpCollection.length }} ({{ collectionProgress.toFixed(0) }}%)</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-3 mt-2">
                  <div 
                    class="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    :style="{ width: `${collectionProgress}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Recent AWP Drops -->
            <div v-if="recentDrops.length > 0" class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Recent AWP Drops</h3>
              
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div 
                  v-for="item in recentDrops.slice(0, 8)" 
                  :key="item.id"
                  class="bg-gray-600 rounded-lg p-4 text-center"
                >
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-20 h-20 object-contain mx-auto mb-2"
                  >
                  <p class="text-sm font-semibold truncate mb-1">{{ item.name }}</p>
                  <p class="text-sm text-green-400">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AWP Showcase -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Featured AWP Skins</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="featured in featuredAwps" 
          :key="featured.name"
          class="group bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          <div class="relative p-6">
            <img 
              :src="featured.image" 
              :alt="featured.name"
              class="w-full h-32 object-contain mb-4 group-hover:scale-110 transition-transform duration-200"
            >
            
            <h3 class="text-lg font-bold mb-2">{{ featured.name }}</h3>
            <p class="text-sm text-gray-400 mb-3">{{ featured.description }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img src="/dist/img/other/coin.png" alt="Coin" class="w-4 h-4">
                <span class="text-lg font-bold text-green-400">${{ featured.price.toFixed(2) }}</span>
              </div>
              
              <span :class="`text-xs px-2 py-1 rounded ${featured.rarityClass}`">
                {{ featured.rarity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/cases"
        class="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors"
      >
        <div class="text-2xl mb-2">📦</div>
        <h3 class="font-bold mb-2">Browse All Cases</h3>
        <p class="text-sm text-gray-400">Explore our full collection</p>
      </NuxtLink>
      
      <NuxtLink
        to="/inventory"
        class="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors"
      >
        <div class="text-2xl mb-2">🎒</div>
        <h3 class="font-bold mb-2">View Inventory</h3>
        <p class="text-sm text-gray-400">See your AWP collection</p>
      </NuxtLink>
      
      <NuxtLink
        to="/games/roulette"
        class="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors"
      >
        <div class="text-2xl mb-2">🎰</div>
        <h3 class="font-bold mb-2">Try Your Luck</h3>
        <p class="text-sm text-gray-400">Play games with your skins</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

// Meta
useHead({
  title: 'AWP Case - CSGOLuck'
})

// State
const activeTab = ref('open')

const tabs = [
  { id: 'open', name: 'Open Cases' },
  { id: 'contents', name: 'Contents & Chances' },
  { id: 'stats', name: 'Collection' }
]

// AWP Case data
const awpCase: GameCase = {
  id: 'awp',
  name: 'AWP Case',
  description: 'Exclusive collection of premium AWP skins',
  image: '/dist/img/cases/awp.png',
  price: 4.99,
  category: 'weapon',
  background: 'linear-gradient(45deg, #dc2626, #f87171)',
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

// AWP Collection tracking
const awpCollection = ref([
  { name: 'AWP | Dragon Lore', price: 2450.00, image: '/dist/img/awp/dragonlore.png', owned: false },
  { name: 'AWP | Medusa', price: 1890.50, image: '/dist/img/awp/medusa.png', owned: false },
  { name: 'AWP | Lightning Strike', price: 245.60, image: '/dist/img/awp/lightning.png', owned: false },
  { name: 'AWP | Asiimov', price: 89.30, image: '/dist/img/awp/asiimov.png', owned: false },
  { name: 'AWP | Hyper Beast', price: 67.80, image: '/dist/img/awp/hyperbeast.png', owned: false },
  { name: 'AWP | Electric Hive', price: 45.20, image: '/dist/img/awp/electrichive.png', owned: false },
  { name: 'AWP | Redline', price: 32.40, image: '/dist/img/awp/redline.png', owned: false },
  { name: 'AWP | Pink DDPAT', price: 15.60, image: '/dist/img/awp/pink.png', owned: false }
])

// Featured AWPs
const featuredAwps = ref([
  {
    name: 'AWP | Dragon Lore',
    description: 'The most legendary AWP skin',
    price: 2450.00,
    image: '/dist/img/awp/dragonlore.png',
    rarity: 'Covert',
    rarityClass: 'bg-red-500 text-white'
  },
  {
    name: 'AWP | Medusa',
    description: 'Mythical creature design',
    price: 1890.50,
    image: '/dist/img/awp/medusa.png',
    rarity: 'Covert',
    rarityClass: 'bg-red-500 text-white'
  },
  {
    name: 'AWP | Lightning Strike',
    description: 'Electric themed masterpiece',
    price: 245.60,
    image: '/dist/img/awp/lightning.png',
    rarity: 'Classified',
    rarityClass: 'bg-pink-500 text-white'
  }
])

// Computed
const ownedCount = computed(() => awpCollection.value.filter(awp => awp.owned).length)
const collectionProgress = computed(() => (ownedCount.value / awpCollection.value.length) * 100)

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
  if (recentDrops.value.length > 16) {
    recentDrops.value = recentDrops.value.slice(0, 16)
  }
  
  // Update collection progress
  results.items.forEach(item => {
    const collectionItem = awpCollection.value.find(awp => 
      awp.name.toLowerCase().includes(item.name.toLowerCase().split('|')[1]?.trim())
    )
    if (collectionItem) {
      collectionItem.owned = true
    }
  })
  
  // Save to localStorage
  saveStats()
}

const saveStats = () => {
  try {
    localStorage.setItem('awp-case-stats', JSON.stringify({
      caseStats: caseStats.value,
      recentDrops: recentDrops.value,
      awpCollection: awpCollection.value
    }))
  } catch (error) {
    console.error('Failed to save AWP case stats:', error)
  }
}

const loadStats = () => {
  try {
    const saved = localStorage.getItem('awp-case-stats')
    if (saved) {
      const data = JSON.parse(saved)
      caseStats.value = data.caseStats || caseStats.value
      recentDrops.value = (data.recentDrops || []).map((item: any) => ({
        ...item,
        obtainedAt: new Date(item.obtainedAt)
      }))
      awpCollection.value = data.awpCollection || awpCollection.value
    }
  } catch (error) {
    console.error('Failed to load AWP case stats:', error)
  }
}

// Load statistics on mount
onMounted(() => {
  loadStats()
})
</script>
