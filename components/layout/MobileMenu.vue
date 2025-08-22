<!-- components/layout/MobileMenu.vue -->
<template>
  <!-- Mobile Menu Overlay -->
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 md:hidden"
    @click="close"
  >
    <!-- Background Overlay -->
    <div class="fixed inset-0 bg-black/80 transition-opacity" />
    
    <!-- Menu Panel -->
    <div 
      class="fixed inset-y-0 left-0 w-80 bg-gray-900 shadow-xl transform transition-transform"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
        <div class="flex items-center space-x-3">
          <img src="/dist/img/logo.png" alt="CSGOLuck" class="h-8 w-8">
          <span class="text-xl font-bold text-white">CSGOLuck</span>
        </div>
        
        <button
          @click="close"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- User Section -->
      <div class="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div class="flex items-center space-x-3 mb-4">
          <img 
            :src="user?.avatar || '/dist/img/avatars/default.png'" 
            alt="Avatar"
            class="w-12 h-12 rounded-full border-2 border-gray-600"
          >
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">
              {{ user?.username || 'Guest' }}
            </h3>
            <p class="text-sm text-gray-400">
              {{ isLoggedIn ? `Level ${userLevel}` : 'Not logged in' }}
            </p>
          </div>
        </div>

        <!-- Balance & Quick Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img src="/dist/img/other/coin.png" alt="Coin" class="w-6 h-6">
            <span class="text-xl font-bold text-green-400">${{ balance.toFixed(2) }}</span>
          </div>
          
          <NuxtLink
            to="/deposit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            @click="close"
          >
            Deposit
          </NuxtLink>
        </div>

        <!-- Experience Bar (if logged in) -->
        <div v-if="isLoggedIn" class="mt-4">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Progress</span>
            <span>{{ experienceProgress.toFixed(0) }}%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${experienceProgress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto">
        <!-- Main Navigation -->
        <div class="px-4 py-6">
          <div class="space-y-2">
            <NuxtLink
              v-for="item in mainNavItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200',
                isActiveRoute(item.href)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              ]"
              @click="close"
            >
              <component 
                :is="item.icon" 
                class="flex-shrink-0 w-6 h-6 mr-4"
              />
              <span>{{ item.name }}</span>
              
              <!-- Badge for new features -->
              <span 
                v-if="item.badge"
                class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Games Section -->
        <div class="px-4 pb-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Games
          </h3>
          
          <div class="space-y-1">
            <NuxtLink
              v-for="game in gameNavItems"
              :key="game.name"
              :to="game.href"
              :class="[
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActiveRoute(game.href)
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              ]"
              @click="close"
            >
              <component 
                :is="game.icon" 
                class="flex-shrink-0 w-5 h-5 mr-3"
              />
              <span>{{ game.name }}</span>
              
              <!-- Game status indicator -->
              <div 
                v-if="game.status"
                :class="`ml-auto w-2 h-2 rounded-full ${
                  game.status === 'hot' ? 'bg-red-400' :
                  game.status === 'new' ? 'bg-green-400' : 'bg-gray-400'
                }`"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="px-4 pb-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-3">Your Stats</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-400">{{ gamesPlayed }}</div>
                <div class="text-xs text-gray-400">Games</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-bold text-green-400">${{ totalWon.toFixed(0) }}</div>
                <div class="text-xs text-gray-400">Won</div>
              </div>
              
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ winRate.toFixed(0) }}%</div>
                <div class="text-xs text-gray-400">Win Rate</div>
              </div>
              
              <div class="text-center">
                <div 
                  :class="`text-lg font-bold ${
                    profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`"
                >
                  {{ profitLoss >= 0 ? '+' : '' }}${{ profitLoss.toFixed(0) }}
                </div>
                <div class="text-xs text-gray-400">P&L</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="px-4 pb-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-3">Recent Activity</h4>
            
            <div class="space-y-2">
              <div 
                v-for="activity in recentActivity.slice(0, 4)" 
                :key="activity.id"
                class="flex items-center space-x-3 text-sm"
              >
                <div :class="`w-2 h-2 rounded-full flex-shrink-0 ${getActivityColor(activity.type)}`" />
                <span class="text-gray-300 truncate">{{ activity.description }}</span>
              </div>
            </div>
            
            <NuxtLink 
              to="/activity"
              class="block text-sm text-blue-400 hover:text-blue-300 mt-3 transition-colors"
              @click="close"
            >
              View All Activity →
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Footer Actions -->
      <div class="p-4 bg-gray-800 border-t border-gray-700">
        <div v-if="isLoggedIn" class="space-y-2">
          <NuxtLink
            to="/profile"
            class="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
            @click="close"
          >
            Profile Settings
          </NuxtLink>
          
          <button
            @click="logout"
            class="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div v-else class="space-y-2">
          <button
            @click="showLoginModal"
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Login
          </button>
          
          <button
            @click="loginWithSteam"
            class="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Login with Steam
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  showLogin: []
}>()

// Icon components
const HomeIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const CaseIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
])

const GameIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const UpgradeIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' })
])

const CasinoIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 13v-1m4 1v-3m4 3V8M8 21l4-7 4 7M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' })
])

const InventoryIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
])

const RouletteIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '12', cy: '12', r: '10', 'stroke-width': '2' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 2v20M2 12h20' })
])

const CoinflipIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '12', cy: '12', r: '10', 'stroke-width': '2' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8V4m0 16v-4' })
])

const CrashIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
])

// Stores
const userStore = useUserStore()
const balanceStore = useBalanceStore()
const gamesStore = useGamesStore()
const route = useRoute()

// Reactive data
const { user, isLoggedIn, getUserLevel, getExperienceProgress } = storeToRefs(userStore)
const { balance } = storeToRefs(balanceStore)
const { getGameStats } = storeToRefs(gamesStore)

// Mock recent activity
const recentActivity = ref([
  { id: 1, type: 'win', description: 'Won $45.60 from AK-47 Redline' },
  { id: 2, type: 'loss', description: 'Lost coinflip bet $20.00' },
  { id: 3, type: 'case', description: 'Opened Anubis Case' },
  { id: 4, type: 'upgrade', description: 'Upgraded 3 items successfully' },
  { id: 5, type: 'deposit', description: 'Deposited $100.00' }
])

// Navigation items
const mainNavItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Cases', href: '/cases', icon: CaseIcon, badge: 'Hot' },
  { name: 'Games', href: '/games', icon: GameIcon },
  { name: 'Upgrader', href: '/upgrade', icon: UpgradeIcon, badge: 'New' },
  { name: 'Casino', href: '/casino', icon: CasinoIcon },
  { name: 'Inventory', href: '/inventory', icon: InventoryIcon }
]

const gameNavItems = [
  { name: 'Roulette', href: '/games/roulette', icon: RouletteIcon, status: 'hot' },
  { name: 'Coinflip', href: '/games/coinflip', icon: CoinflipIcon },
  { name: 'Crash', href: '/games/crash', icon: CrashIcon, status: 'new' }
]

// Computed
const userLevel = computed(() => getUserLevel.value || 1)
const experienceProgress = computed(() => getExperienceProgress.value || 0)
const gamesPlayed = computed(() => getGameStats.value?.totalGamesPlayed || 0)
const totalWon = computed(() => getGameStats.value?.totalWon || 0)
const winRate = computed(() => getGameStats.value?.winRate || 0)
const profitLoss = computed(() => getGameStats.value?.profitLoss || 0)

// Methods
const isActiveRoute = (href: string): boolean => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

const close = () => {
  emit('close')
}

const showLoginModal = () => {
  emit('showLogin')
  close()
}

const loginWithSteam = async () => {
  try {
    await userStore.loginWithSteam()
    close()
  } catch (error) {
    console.error('Steam login failed:', error)
  }
}

const logout = () => {
  userStore.logout()
  close()
}

const getActivityColor = (type: string): string => {
  const colors = {
    win: 'bg-green-400',
    loss: 'bg-red-400',
    case: 'bg-blue-400',
    upgrade: 'bg-purple-400',
    deposit: 'bg-yellow-400',
    default: 'bg-gray-400'
  }
  return colors[type as keyof typeof colors] || colors.default
}

// Close on route change
watch(() => route.path, () => {
  close()
})
</script>
