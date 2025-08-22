<!-- pages/cases/index.vue -->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Case Opening</h1>
      <p class="text-xl text-gray-300">
        Open cases to get rare CS:GO skins and items
      </p>
    </div>

    <!-- Featured Cases -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Featured Cases</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="featuredCase in featuredCases"
          :key="featuredCase.id"
          :to="`/cases/${featuredCase.id}`"
          class="group relative bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          <div class="absolute inset-0 opacity-30" :style="{ background: featuredCase.background }" />
          
          <div class="relative p-6 text-center">
            <img 
              :src="featuredCase.image" 
              :alt="featuredCase.name"
              class="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
            >
            
            <h3 class="text-xl font-bold mb-2">{{ featuredCase.name }}</h3>
            <p class="text-gray-300 text-sm mb-4">{{ featuredCase.description }}</p>
            
            <div class="flex items-center justify-center space-x-2">
              <img src="/dist/img/other/coin.png" alt="Coin" class="w-5 h-5">
              <span class="text-2xl font-bold text-green-400">${{ featuredCase.price.toFixed(2) }}</span>
            </div>
            
            <!-- Featured badge -->
            <div class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              FEATURED
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- All Cases -->
    <div class="bg-gray-800 rounded-xl p-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">All Cases</h2>
        
        <!-- Sort Options -->
        <div class="flex space-x-4">
          <select
            v-model="sortBy"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          
          <select
            v-model="filterCategory"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            <option value="weapon">Weapon Cases</option>
            <option value="knife">Knife Cases</option>
            <option value="glove">Glove Cases</option>
            <option value="special">Special Cases</option>
          </select>
        </div>
      </div>
      
      <CasesList 
        @open-case="handleCaseOpen"
        @case-result="handleCaseResult"
      />
    </div>

    <!-- Case Opening Statistics -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Your Opening Statistics</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400">{{ stats.totalOpened }}</div>
          <div class="text-sm text-gray-400">Cases Opened</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">${{ stats.totalSpent.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Spent</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-400">${{ stats.bestItem.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Best Item</div>
        </div>
        
        <div class="text-center">
          <div 
            :class="`text-3xl font-bold ${
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
    <div v-if="recentDrops.length > 0" class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Recent Drops</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="item in recentDrops.slice(0, 12)" 
          :key="item.id"
          class="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors"
        >
          <img 
            :src="item.image" 
            :alt="item.name"
            class="w-16 h-16 object-contain mx-auto mb-2"
          >
          <p class="text-xs font-semibold truncate mb-1">{{ item.name }}</p>
          <p class="text-xs text-green-400">${{ item.price.toFixed(2) }}</p>
          <p class="text-xs text-gray-400">{{ formatTimeAgo(item.obtainedAt) }}</p>
        </div>
      </div>
      
      <div class="text-center mt-6">
        <NuxtLink 
          to="/inventory"
          class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          View All Items
        </NuxtLink>
      </div>
    </div>

    <!-- Success Popup -->
    <div 
      v-if="showSuccessPopup"
      class="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in"
    >
      <div class="flex items-center space-x-3">
        <div class="text-2xl">🎉</div>
        <div>
          <p class="font-bold">{{ lastOpenedItem?.name }}</p>
          <p class="text-sm">${{ lastOpenedItem?.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

const inventoryStore = useInventoryStore()

// Meta
useHead({
  title: 'Cases - CSGOLuck'
})

// State
const sortBy = ref('popularity')
const filterCategory = ref('')
const showSuccessPopup = ref(false)
const lastOpenedItem = ref<CSGOItem | null>(null)

// Mock statistics
const stats = ref({
  totalOpened: 0,
  totalSpent: 0,
  bestItem: 0,
  profitLoss: 0
})

// Recent drops from inventory
const recentDrops = computed(() => {
  return inventoryStore.items
    .filter(item => item.acquiredFrom === 'case')
    .sort((a, b) => b.acquiredAt.getTime() - a.acquiredAt.getTime())
    .map(item => item.item)
})

// Featured cases
const featuredCases = ref<GameCase[]>([
  {
    id: 'anubis',
    name: 'Anubis Case',
    description: 'Contains Egyptian-themed weapon skins',
    image: '/dist/img/cases/anubis.png',
    price: 2.49,
    category: 'weapon',
    background: 'linear-gradient(45deg, #d97706, #fbbf24)',
    items: []
  },
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
  }
])

// Methods
const handleCaseOpen = (gameCase: GameCase) => {
  // Logic handled by CasesList component
}

const handleCaseResult = (result: { item: CSGOItem }) => {
  lastOpenedItem.value = result.item
  showSuccessPopup.value = true
  
  // Update statistics
  stats.value.totalOpened++
  stats.value.totalSpent += 2.49 // Mock case price
  
  if (result.item.price > stats.value.bestItem) {
    stats.value.bestItem = result.item.price
  }
  
  stats.value.profitLoss += result.item.price - 2.49
  
  // Add to inventory
  inventoryStore.addItem({
    item: result.item,
    quantity: 1,
    acquiredFrom: 'case',
    acquiredAt: new Date(),
    locked: false
  })
  
  // Hide popup after 5 seconds
  setTimeout(() => {
    showSuccessPopup.value = false
  }, 5000)
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

// Load statistics from localStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem('case-opening-stats')
    if (saved) {
      stats.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load case statistics:', error)
  }
})

// Save statistics when they change
watch(stats, () => {
  try {
    localStorage.setItem('case-opening-stats', JSON.stringify(stats.value))
  } catch (error) {
    console.error('Failed to save case statistics:', error)
  }
}, { deep: true })
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
