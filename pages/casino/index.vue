<!-- pages/casino/index.vue -->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Casino</h1>
      <p class="text-xl text-gray-300">
        Try your luck with our exclusive casino games
      </p>
    </div>

    <!-- Featured Games -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Featured Games</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="game in featuredGames"
          :key="game.id"
          class="group relative bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
          @click="navigateToGame(game.path)"
        >
          <div class="absolute inset-0 opacity-30" :style="{ background: game.background }" />
          
          <div class="relative p-6 text-center">
            <div class="text-4xl mb-4">{{ game.icon }}</div>
            
            <h3 class="text-xl font-bold mb-2">{{ game.name }}</h3>
            <p class="text-gray-300 text-sm mb-4">{{ game.description }}</p>
            
            <div class="flex items-center justify-center space-x-4 mb-4">
              <div class="text-center">
                <div class="text-lg font-bold text-green-400">{{ game.minBet }}x</div>
                <div class="text-xs text-gray-400">Min Multiplier</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ game.maxBet }}x</div>
                <div class="text-xs text-gray-400">Max Multiplier</div>
              </div>
            </div>
            
            <button class="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors">
              Play Now
            </button>
            
            <!-- Status badges -->
            <div v-if="game.status" class="absolute top-2 right-2">
              <span 
                :class="`px-2 py-1 rounded text-xs font-bold ${
                  game.status === 'hot' ? 'bg-red-500 text-white' :
                  game.status === 'new' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`"
              >
                {{ game.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Casino Games -->
    <div class="bg-gray-800 rounded-xl p-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">All Casino Games</h2>
        
        <div class="flex space-x-4">
          <select
            v-model="filterCategory"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            <option value="slots">Slots</option>
            <option value="table">Table Games</option>
            <option value="specialty">Specialty</option>
          </select>
          
          <select
            v-model="sortBy"
            class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="popularity">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="rtp">Highest RTP</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="game in filteredGames"
          :key="game.id"
          class="group bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors cursor-pointer"
          @click="navigateToGame(game.path)"
        >
          <div class="text-2xl mb-2">{{ game.icon }}</div>
          <h3 class="text-sm font-bold mb-1">{{ game.name }}</h3>
          <p class="text-xs text-gray-400 mb-2">{{ game.category }}</p>
          <div class="text-xs">
            <div class="text-green-400 font-semibold">RTP: {{ game.rtp }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Casino Statistics -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Your Casino Statistics</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-400">{{ stats.gamesPlayed }}</div>
          <div class="text-sm text-gray-400">Games Played</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">${{ stats.totalWagered.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Total Wagered</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-400">${{ stats.biggestWin.toFixed(2) }}</div>
          <div class="text-sm text-gray-400">Biggest Win</div>
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

    <!-- Recent Activity -->
    <div v-if="recentActivity.length > 0" class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Recent Activity</h2>
      
      <div class="space-y-3">
        <div 
          v-for="activity in recentActivity.slice(0, 8)" 
          :key="activity.id"
          class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="text-2xl">{{ activity.icon }}</div>
            <div>
              <div class="font-semibold">{{ activity.game }}</div>
              <div class="text-sm text-gray-400">{{ formatTimeAgo(activity.timestamp) }}</div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-semibold">{{ activity.multiplier }}x</div>
            <div 
              :class="`text-sm font-bold ${
                activity.profit >= 0 ? 'text-green-400' : 'text-red-400'
              }`"
            >
              {{ activity.profit >= 0 ? '+' : '' }}${{ activity.profit.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promotions -->
    <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Active Promotions</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-800/50 rounded-lg p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="text-2xl">💰</div>
            <h3 class="text-xl font-bold">Welcome Bonus</h3>
          </div>
          <p class="text-gray-300 mb-4">
            Get 100% bonus on your first casino deposit up to $500!
          </p>
          <button class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors">
            Claim Now
          </button>
        </div>
        
        <div class="bg-gray-800/50 rounded-lg p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="text-2xl">🎰</div>
            <h3 class="text-xl font-bold">Daily Spins</h3>
          </div>
          <p class="text-gray-300 mb-4">
            Get 5 free spins every day on our premium slot games!
          </p>
          <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors">
            Play Free Spins
          </button>
        </div>
      </div>
    </div>

    <!-- Responsible Gaming -->
    <div class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6">Responsible Gaming</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl mb-2">⏰</div>
          <h3 class="font-bold mb-2">Set Time Limits</h3>
          <p class="text-sm text-gray-400">Control how long you play</p>
        </div>
        
        <div class="text-center">
          <div class="text-2xl mb-2">💳</div>
          <h3 class="font-bold mb-2">Set Deposit Limits</h3>
          <p class="text-sm text-gray-400">Manage your spending</p>
        </div>
        
        <div class="text-center">
          <div class="text-2xl mb-2">🛡️</div>
          <h3 class="font-bold mb-2">Self-Exclusion</h3>
          <p class="text-sm text-gray-400">Take a break when needed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const gamesStore = useGamesStore()

// Meta
useHead({
  title: 'Casino - CSGOLuck'
})

// State
const filterCategory = ref('')
const sortBy = ref('popularity')

// Mock statistics
const stats = ref({
  gamesPlayed: 0,
  totalWagered: 0,
  biggestWin: 0,
  profitLoss: 0
})

// Featured casino games
const featuredGames = ref([
  {
    id: 'slots',
    name: 'Mega Slots',
    description: 'Classic slot machine with huge jackpots',
    icon: '🎰',
    minBet: 1.2,
    maxBet: 1000,
    category: 'slots',
    rtp: 96.5,
    path: '/casino/slots',
    background: 'linear-gradient(45deg, #dc2626, #f87171)',
    status: 'hot'
  },
  {
    id: 'banana-rush',
    name: 'Banana Rush',
    description: 'Fast-paced multiplier game',
    icon: '🍌',
    minBet: 1.1,
    maxBet: 500,
    category: 'specialty',
    rtp: 97.2,
    path: '/casino/banana-rush',
    background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
    status: 'new'
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'Classic 21 card game',
    icon: '🃏',
    minBet: 1.0,
    maxBet: 50,
    category: 'table',
    rtp: 99.5,
    path: '/casino/blackjack',
    background: 'linear-gradient(45deg, #1f2937, #374151)'
  }
])

// All casino games
const allGames = ref([
  ...featuredGames.value,
  {
    id: 'poker',
    name: 'Poker',
    icon: '♠️',
    category: 'table',
    rtp: 98.9,
    path: '/casino/poker'
  },
  {
    id: 'baccarat',
    name: 'Baccarat',
    icon: '🎲',
    category: 'table',
    rtp: 98.9,
    path: '/casino/baccarat'
  },
  {
    id: 'wheel',
    name: 'Wheel of Fortune',
    icon: '🎡',
    category: 'specialty',
    rtp: 96.8,
    path: '/casino/wheel'
  },
  {
    id: 'dice',
    name: 'Dice Roll',
    icon: '🎲',
    category: 'specialty',
    rtp: 99.0,
    path: '/casino/dice'
  },
  {
    id: 'keno',
    name: 'Keno',
    icon: '🔢',
    category: 'specialty',
    rtp: 95.0,
    path: '/casino/keno'
  }
])

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    game: 'Mega Slots',
    icon: '🎰',
    multiplier: 12.5,
    profit: 125.50,
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    game: 'Banana Rush',
    icon: '🍌',
    multiplier: 2.3,
    profit: -15.60,
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: 3,
    game: 'Blackjack',
    icon: '🃏',
    multiplier: 2.0,
    profit: 50.00,
    timestamp: new Date(Date.now() - 900000)
  }
])

// Computed
const filteredGames = computed(() => {
  let filtered = allGames.value

  if (filterCategory.value) {
    filtered = filtered.filter(game => game.category === filterCategory.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'newest':
      // Mock sorting by newest
      filtered = [...filtered].reverse()
      break
    case 'rtp':
      filtered = filtered.sort((a, b) => (b.rtp || 0) - (a.rtp || 0))
      break
    case 'popularity':
    default:
      // Default order
      break
  }

  return filtered
})

// Methods
const navigateToGame = (path: string) => {
  router.push(path)
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

// Load statistics from games store
const { getGameStats } = storeToRefs(gamesStore)
watch(getGameStats, (newStats) => {
  if (newStats) {
    stats.value = {
      gamesPlayed: newStats.totalGamesPlayed,
      totalWagered: newStats.totalWagered,
      biggestWin: newStats.biggestWin,
      profitLoss: newStats.profitLoss
    }
  }
}, { immediate: true })

onMounted(() => {
  gamesStore.loadGameData()
})
</script>
