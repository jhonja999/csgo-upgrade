<!-- pages/index.vue -->
<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-12">
      <h1 class="text-5xl font-bold mb-4">
        Welcome to <span class="text-green-400">CSGO</span>Luck
      </h1>
      <p class="text-xl text-gray-300 mb-8">
        The ultimate CS:GO gaming experience with cases, upgrades, and more!
      </p>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-blue-400">{{ totalUsers.toLocaleString() }}</h3>
          <p class="text-gray-400">Active Users</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-green-400">${{ totalWagered.toLocaleString() }}</h3>
          <p class="text-gray-400">Total Wagered</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-purple-400">{{ totalItems.toLocaleString() }}</h3>
          <p class="text-gray-400">Items Won</p>
        </div>
      </div>
    </section>

    <!-- Game Categories -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">Choose Your Game</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          v-for="game in games"
          :key="game.id"
          :title="game.title"
          :description="game.description"
          :image="game.image"
          :href="game.href"
          :badge="game.badge"
          :gradient="game.gradient"
        />
      </div>
    </section>

    <!-- Recent Big Wins -->
    <section v-if="bigWins.length > 0">
      <h2 class="text-3xl font-bold text-center mb-8">Recent Big Wins</h2>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="win in bigWins" 
            :key="win.id"
            class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
          >
            <img 
              :src="win.item.image" 
              :alt="win.item.name"
              class="w-16 h-16 object-contain"
            >
            <div class="flex-1">
              <h4 class="font-semibold">{{ win.item.name }}</h4>
              <p class="text-sm text-gray-400">{{ win.username }}</p>
              <p class="text-lg font-bold text-green-400">${{ win.amount.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-3xl font-bold text-center mb-8">Why Choose CSGOLuck?</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="text-4xl mb-4">🔒</div>
          <h3 class="text-xl font-bold mb-2">100% Secure</h3>
          <p class="text-gray-400">Your items and data are protected with industry-standard security</p>
        </div>
        
        <div class="text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-bold mb-2">Instant Payouts</h3>
          <p class="text-gray-400">Get your winnings immediately with no delays or waiting periods</p>
        </div>
        
        <div class="text-center">
          <div class="text-4xl mb-4">🎯</div>
          <h3 class="text-xl font-bold mb-2">Fair Play</h3>
          <p class="text-gray-400">Provably fair gaming with transparent odds and algorithms</p>
        </div>
      </div>
    </section>

    <!-- Live Activity Feed -->
    <section v-if="liveActivity.length > 0" class="bg-gray-800 rounded-xl p-8">
      <h2 class="text-3xl font-bold text-center mb-8">Live Activity</h2>
      
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="activity in liveActivity" 
          :key="activity.id"
          class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="text-xl">{{ activity.icon }}</div>
            <div>
              <span class="font-semibold">{{ activity.username }}</span>
              <span class="text-gray-400 ml-2">{{ activity.action }}</span>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-bold text-green-400">${{ activity.amount.toFixed(2) }}</div>
            <div class="text-xs text-gray-400">{{ formatTimeAgo(activity.timestamp) }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'CSGOLuck - Best CSGO Casino'
})

// Data
const totalUsers = ref(12547)
const totalWagered = ref(2847593)
const totalItems = ref(156892)

const games = [
  {
    id: 'cases',
    title: 'Cases',
    description: 'Open CS:GO cases and win amazing items',
    image: '/dist/img/other/cases.png',
    href: '/cases',
    badge: 'Popular',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    id: 'roulette',
    title: 'Roulette',
    description: 'Spin the wheel and win big on red, black, or green',
    image: '/dist/img/other/roulette.png',
    href: '/games/roulette',
    gradient: 'from-red-600 to-pink-600'
  },
  {
    id: 'coinflip',
    title: 'Coinflip',
    description: 'Double or nothing on a simple coin flip',
    image: '/dist/img/other/coinflip.png',
    href: '/games/coinflip',
    gradient: 'from-yellow-600 to-orange-600'
  },
  {
    id: 'crash',
    title: 'Crash',
    description: 'Cash out before the multiplier crashes',
    image: '/dist/img/other/crash.png',
    href: '/games/crash',
    gradient: 'from-green-600 to-teal-600'
  },
  {
    id: 'upgrade',
    title: 'Upgrader',
    description: 'Trade up your items for better ones',
    image: '/dist/img/other/upgrade.png',
    href: '/upgrade',
    badge: 'New',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'slots',
    title: 'Slots',
    description: 'Try your luck with fruit-themed slot games',
    image: '/dist/img/other/slots.png',
    href: '/casino',
    gradient: 'from-pink-600 to-rose-600'
  }
]

const bigWins = ref([
  {
    id: '1',
    username: 'ProGamer',
    amount: 9521,
    item: {
      name: 'AWP | Dragon Lore',
      image: '/dist/img/awp/dragonlore.png'
    }
  },
  {
    id: '2', 
    username: 'LuckyOne',
    amount: 2500,
    item: {
      name: 'AK-47 | Fire Serpent',
      image: '/dist/img/ak47/fireserpent.png'
    }
  },
  {
    id: '3',
    username: 'Headshot',
    amount: 1521,
    item: {
      name: 'Karambit | Doppler',
      image: '/dist/img/knife/doppler.png'
    }
  }
])

// Live activity feed
const liveActivity = ref([
  {
    id: 1,
    username: 'Player123',
    action: 'won from roulette',
    amount: 245.60,
    icon: '🎰',
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: 2,
    username: 'GamerPro',
    action: 'opened Anubis Case',
    amount: 89.40,
    icon: '📦',
    timestamp: new Date(Date.now() - 45000)
  },
  {
    id: 3,
    username: 'SkillShot',
    action: 'upgraded successfully',
    amount: 156.20,
    icon: '⬆️',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: 4,
    username: 'CoinMaster',
    action: 'won coinflip',
    amount: 320.00,
    icon: '🪙',
    timestamp: new Date(Date.now() - 90000)
  },
  {
    id: 5,
    username: 'CrashKing',
    action: 'cashed out at 5.2x',
    amount: 780.50,
    icon: '📈',
    timestamp: new Date(Date.now() - 120000)
  }
])

// Methods
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

// Simulate live stats updates
onMounted(() => {
  // Update stats periodically
  const statsInterval = setInterval(() => {
    totalUsers.value += Math.floor(Math.random() * 3)
    totalWagered.value += Math.floor(Math.random() * 1000)
    totalItems.value += Math.floor(Math.random() * 2)
  }, 5000)

  // Add new live activity
  const activityInterval = setInterval(() => {
    const newActivity = {
      id: Date.now(),
      username: generateRandomUsername(),
      action: getRandomAction(),
      amount: Math.random() * 500 + 10,
      icon: getRandomIcon(),
      timestamp: new Date()
    }
    
    liveActivity.value.unshift(newActivity)
    if (liveActivity.value.length > 20) {
      liveActivity.value = liveActivity.value.slice(0, 20)
    }
  }, 8000)

  onUnmounted(() => {
    clearInterval(statsInterval)
    clearInterval(activityInterval)
  })
})

const generateRandomUsername = (): string => {
  const prefixes = ['Pro', 'Lucky', 'Skill', 'Gamer', 'Elite', 'Master', 'King', 'Ace']
  const suffixes = ['Player', 'Shot', 'Winner', 'Hero', 'Legend', 'Champion', 'Star', 'One']
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  const number = Math.floor(Math.random() * 999) + 1
  
  return `${prefix}${suffix}${number}`
}

const getRandomAction = (): string => {
  const actions = [
    'won from roulette',
    'opened a case',
    'upgraded successfully',
    'won coinflip',
    'hit jackpot',
    'cashed out big',
    'won big at slots'
  ]
  return actions[Math.floor(Math.random() * actions.length)]
}

const getRandomIcon = (): string => {
  const icons = ['🎰', '📦', '⬆️', '🪙', '📈', '🎯', '💎']
  return icons[Math.floor(Math.random() * icons.length)]
}
</script>
