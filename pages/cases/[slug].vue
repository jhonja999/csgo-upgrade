<!-- pages/cases/[slug].vue -->
<template>
  <div v-if="caseData" class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="relative w-64 h-64 mx-auto mb-6">
        <div 
          class="w-full h-full rounded-lg overflow-hidden"
          :style="{ background: caseData.background }"
        >
          <img 
            :src="caseData.image" 
            :alt="caseData.name"
            class="w-full h-full object-contain p-8"
          >
        </div>
        
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl animate-pulse" />
      </div>
      
      <h1 class="text-4xl font-bold mb-4">{{ caseData.name }}</h1>
      <p class="text-xl text-gray-300 mb-6">
        {{ caseData.description }}
      </p>
      
      <div class="flex items-center justify-center space-x-2 mb-8">
        <img src="/dist/img/other/coin.png" alt="Coin" class="w-8 h-8">
        <span class="text-4xl font-bold text-green-400">${{ caseData.price.toFixed(2) }}</span>
      </div>

      <!-- Case Category Badge -->
      <div class="flex justify-center mb-6">
        <span :class="`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryStyle(caseData.category)}`">
          {{ formatCategory(caseData.category) }}
        </span>
      </div>
    </div>

    <!-- Case Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-800 rounded-lg p-6 text-center">
        <div class="text-2xl mb-2">🎯</div>
        <h3 class="font-bold mb-2">Drop System</h3>
        <p class="text-sm text-gray-400">Advanced probability system with guaranteed minimum value</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6 text-center">
        <div class="text-2xl mb-2">⚡</div>
        <h3 class="font-bold mb-2">Instant Opening</h3>
        <p class="text-sm text-gray-400">Get your items immediately with stunning animations</p>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6 text-center">
        <div class="text-2xl mb-2">🔄</div>
        <h3 class="font-bold mb-2">Trade Ready</h3>
        <p class="text-sm text-gray-400">All items are tradable and marketable instantly</p>
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
                ? 'border-blue-500 text-blue-500'
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
          <CaseOpener :selected-case="caseData" @opened="handleOpened" />
        </div>

        <!-- Contents Tab -->
        <div v-if="activeTab === 'contents'">
          <CaseChances :case="caseData" />
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'">
          <div class="space-y-6">
            <!-- Opening Statistics -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Your {{ caseData.name }} Statistics</h3>
              
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
              <h3 class="text-xl font-bold mb-4">Recent Drops from {{ caseData.name }}</h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div 
                  v-for="item in recentDrops.slice(0, 12)" 
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
                </div>
              </div>
            </div>

            <!-- Performance Chart -->
            <div class="bg-gray-700 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Opening Performance</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold mb-3">Value Distribution</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">$0 - $5:</span>
                      <span class="font-bold">{{ getValueDistribution('0-5') }}%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">$5 - $25:</span>
                      <span class="font-bold">{{ getValueDistribution('5-25') }}%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">$25 - $100:</span>
                      <span class="font-bold">{{ getValueDistribution('25-100') }}%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">$100+:</span>
                      <span class="font-bold">{{ getValueDistribution('100+') }}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-semibold mb-3">Best Streaks</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">Profit Streak:</span>
                      <span class="font-bold text-green-400">{{ streaks.profit }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Loss Streak:</span>
                      <span class="font-bold text-red-400">{{ streaks.loss }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Current Streak:</span>
                      <span :class="`font-bold ${streaks.current > 0 ? 'text-green-400' : 'text-red-400'}`">
                        {{ streaks.current > 0 ? '+' : '' }}{{ streaks.current }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Similar Cases -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Similar Cases</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NuxtLink
          v-for="similarCase in similarCases"
          :key="similarCase.id"
          :to="`/cases/${similarCase.id}`"
          class="group bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          <div class="relative p-4 text-center">
            <img 
              :src="similarCase.image" 
              :alt="similarCase.name"
              class="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200"
            >
            
            <h3 class="text-sm font-bold mb-1">{{ similarCase.name }}</h3>
            
            <div class="flex items-center justify-center space-x-1">
              <img src="/dist/img/other/coin.png" alt="Coin" class="w-3 h-3">
              <span class="text-sm font-bold text-green-400">${{ similarCase.price.toFixed(2) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Item Detail Modal -->
    <div v-if="selectedItem" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="closeItemModal">
      <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
        <div class="text-center">
          <img 
            :src="selectedItem.image" 
            :alt="selectedItem.name"
            class="w-32 h-32 object-contain mx-auto mb-4"
          >
          
          <h3 class="text-2xl font-bold mb-2">{{ selectedItem.name }}</h3>
          <p class="text-gray-300 mb-4">{{ formatRarity(selectedItem.rarity) }}</p>
          
          <div class="flex items-center justify-center space-x-2 mb-6">
            <img src="/dist/img/other/coin.png" alt="Coin" class="w-6 h-6">
            <span class="text-3xl font-bold text-green-400">${{ selectedItem.price.toFixed(2) }}</span>
          </div>
          
          <button
            @click="closeItemModal"
            class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-96">
    <LoadingSpinner size="lg" />
  </div>

  <!-- 404 State -->
  <div v-if="!loading && !caseData" class="text-center py-16">
    <div class="text-6xl mb-4">📦</div>
    <h1 class="text-3xl font-bold mb-4">Case Not Found</h1>
    <p class="text-gray-400 mb-8">The case you're looking for doesn't exist.</p>
    <NuxtLink 
      to="/cases"
      class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
    >
      Browse All Cases
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const caseData = ref<GameCase | null>(null)
const activeTab = ref('open')
const selectedItem = ref<CSGOItem | null>(null)

const tabs = [
  { id: 'open', name: 'Open Cases' },
  { id: 'contents', name: 'Contents & Chances' },
  { id: 'stats', name: 'Statistics' }
]

// Statistics
const caseStats = ref({
  opened: 0,
  totalSpent: 0,
  bestItem: 0,
  profitLoss: 0
})

const recentDrops = ref<CSGOItem[]>([])

const streaks = ref({
  profit: 0,
  loss: 0,
  current: 0
})

// All available cases
const allCases: GameCase[] = [
  {
    id: 'anubis',
    name: 'Anubis Case',
    description: 'Ancient Egyptian themed weapons with mystical designs',
    image: '/dist/img/cases/anubis.png',
    price: 2.49,
    category: 'weapon',
    background: 'linear-gradient(45deg, #d97706, #fbbf24)',
    items: []
  },
  {
    id: 'awp',
    name: 'AWP Case',
    description: 'Exclusive collection of premium AWP skins',
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
  },
  {
    id: 'premium',
    name: 'Premium Case',
    description: 'High-tier skins with guaranteed rare items',
    image: '/dist/img/cases/premium.png',
    price: 14.99,
    category: 'special',
    background: 'linear-gradient(45deg, #f59e0b, #fcd34d)',
    items: []
  },
  {
    id: 'operation',
    name: 'Operation Case',
    description: 'Limited time operation exclusive items',
    image: '/dist/img/cases/operation.png',
    price: 3.99,
    category: 'special',
    background: 'linear-gradient(45deg, #1d4ed8, #3b82f6)',
    items: []
  }
]

// Computed
const similarCases = computed(() => {
  if (!caseData.value) return []
  
  return allCases
    .filter(c => c.id !== caseData.value!.id && c.category === caseData.value!.category)
    .slice(0, 4)
})

// Methods
const loadCase = () => {
  const slug = route.params.slug as string
  const foundCase = allCases.find(c => c.id === slug)
  
  if (foundCase) {
    caseData.value = foundCase
    useHead({
      title: `${foundCase.name} - CSGOLuck`
    })
    loadCaseStats()
  }
  
  loading.value = false
}

const getCategoryStyle = (category: string) => {
  const styles = {
    'weapon': 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    'knife': 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
    'glove': 'bg-green-600/20 text-green-400 border border-green-500/30',
    'special': 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
  }
  return styles[category as keyof typeof styles] || styles.weapon
}

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1) + ' Case'
}

const formatRarity = (rarity: string) => {
  return rarity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const handleOpened = (results: { items: CSGOItem[], totalCost: number }) => {
  // Update statistics
  caseStats.value.opened += results.items.length
  caseStats.value.totalSpent += results.totalCost
  
  const bestItemValue = Math.max(...results.items.map(item => item.price))
  if (bestItemValue > caseStats.value.bestItem) {
    caseStats.value.bestItem = bestItemValue
  }
  
  const totalValue = results.items.reduce((sum, item) => sum + item.price, 0)
  const profit = totalValue - results.totalCost
  caseStats.value.profitLoss += profit
  
  // Update streaks
  if (profit > 0) {
    streaks.value.current = streaks.value.current > 0 ? streaks.value.current + 1 : 1
    if (streaks.value.current > streaks.value.profit) {
      streaks.value.profit = streaks.value.current
    }
  } else {
    streaks.value.current = streaks.value.current < 0 ? streaks.value.current - 1 : -1
    if (Math.abs(streaks.value.current) > streaks.value.loss) {
      streaks.value.loss = Math.abs(streaks.value.current)
    }
  }
  
  // Add to recent drops
  recentDrops.value.unshift(...results.items)
  if (recentDrops.value.length > 24) {
    recentDrops.value = recentDrops.value.slice(0, 24)
  }
  
  saveCaseStats()
}

const getValueDistribution = (range: string): number => {
  if (recentDrops.value.length === 0) return 0
  
  let count = 0
  const total = recentDrops.value.length
  
  recentDrops.value.forEach(item => {
    switch (range) {
      case '0-5':
        if (item.price >= 0 && item.price < 5) count++
        break
      case '5-25':
        if (item.price >= 5 && item.price < 25) count++
        break
      case '25-100':
        if (item.price >= 25 && item.price < 100) count++
        break
      case '100+':
        if (item.price >= 100) count++
        break
    }
  })
  
  return Math.round((count / total) * 100)
}

const showItemDetails = (item: CSGOItem) => {
  selectedItem.value = item
}

const closeItemModal = () => {
  selectedItem.value = null
}

const saveCaseStats = () => {
  if (!caseData.value) return
  
  try {
    localStorage.setItem(`case-stats-${caseData.value.id}`, JSON.stringify({
      caseStats: caseStats.value,
      recentDrops: recentDrops.value,
      streaks: streaks.value
    }))
  } catch (error) {
    console.error('Failed to save case stats:', error)
  }
}

const loadCaseStats = () => {
  if (!caseData.value) return
  
  try {
    const saved = localStorage.getItem(`case-stats-${caseData.value.id}`)
    if (saved) {
      const data = JSON.parse(saved)
      caseStats.value = data.caseStats || caseStats.value
      recentDrops.value = (data.recentDrops || []).map((item: any) => ({
        ...item,
        obtainedAt: new Date(item.obtainedAt)
      }))
      streaks.value = data.streaks || streaks.value
    }
  } catch (error) {
    console.error('Failed to load case stats:', error)
  }
}

// Watch for route changes
watch(() => route.params.slug, () => {
  loadCase()
}, { immediate: true })

// Load case on mount
onMounted(() => {
  loadCase()
})
</script>
