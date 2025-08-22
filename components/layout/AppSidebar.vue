<!-- components/layout/AppSidebar.vue -->
<template>
  <aside 
    :class="[
      'fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40',
      isOpen ? 'w-64' : 'w-16'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-800">
      <div v-if="isOpen" class="flex items-center space-x-3">
        <img src="/dist/img/logo.png" alt="CSGOLuck" class="h-8 w-8">
        <span class="text-xl font-bold text-white">CSGOLuck</span>
      </div>
      <div v-else class="flex justify-center w-full">
        <img src="/dist/img/logo.png" alt="CSGOLuck" class="h-8 w-8">
      </div>
      
      <button
        @click="toggleSidebar"
        class="text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            :d="isOpen ? 'M11 19l-7-7 7-7M21 12H3' : 'M13 5l7 7-7 7M5 12h14'"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="mt-8">
      <div class="px-4 space-y-2">
        <NuxtLink
          v-for="item in mainNavItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
            isActiveRoute(item.href)
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <component 
            :is="item.icon" 
            :class="[
              'flex-shrink-0 w-6 h-6',
              isOpen ? 'mr-3' : 'mx-auto'
            ]"
          />
          <span v-if="isOpen">{{ item.name }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div 
            v-if="!isOpen"
            class="absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
          >
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>

      <!-- Games Section -->
      <div class="mt-8">
        <div v-if="isOpen" class="px-6 py-2">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Games</h3>
        </div>
        
        <div class="px-4 mt-2 space-y-1">
          <NuxtLink
            v-for="game in gameNavItems"
            :key="game.name"
            :to="game.href"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
              isActiveRoute(game.href)
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            ]"
          >
            <component 
              :is="game.icon" 
              :class="[
                'flex-shrink-0 w-5 h-5',
                isOpen ? 'mr-3' : 'mx-auto'
              ]"
            />
            <span v-if="isOpen">{{ game.name }}</span>
            
            <!-- Tooltip for collapsed state -->
            <div 
              v-if="!isOpen"
              class="absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
            >
              {{ game.name }}
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Stats -->
      <div v-if="isOpen" class="mt-8 px-4">
        <div class="bg-gray-800 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-400 mb-3">Quick Stats</h4>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Balance:</span>
              <span class="font-semibold text-green-400">${{ balance.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Level:</span>
              <span class="font-semibold text-blue-400">{{ userLevel }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Games:</span>
              <span class="font-semibold text-purple-400">{{ gamesPlayed }}</span>
            </div>
          </div>
          
          <!-- Level Progress -->
          <div class="mt-3">
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
      </div>

      <!-- Recent Activity -->
      <div v-if="isOpen" class="mt-6 px-4">
        <div class="bg-gray-800 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-400 mb-3">Recent Activity</h4>
          
          <div class="space-y-2">
            <div 
              v-for="activity in recentActivity.slice(0, 3)" 
              :key="activity.id"
              class="flex items-center space-x-2 text-xs"
            >
              <div :class="`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`" />
              <span class="text-gray-300 truncate">{{ activity.description }}</span>
            </div>
          </div>
          
          <NuxtLink 
            to="/activity"
            class="block text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
          >
            View All
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <div v-if="isOpen" class="flex items-center space-x-3">
        <img 
          :src="user?.avatar || '/dist/img/avatars/default.png'" 
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ user?.username || 'Guest' }}
          </p>
          <p class="text-xs text-gray-400">
            {{ isLoggedIn ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <img 
          :src="user?.avatar || '/dist/img/avatars/default.png'" 
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        >
      </div>
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div 
    v-if="isOpen && isMobile"
    class="fixed inset-0 bg-black/50 z-30"
    @click="closeSidebar"
  />
</template>

<script setup lang="ts">
// Icon components (using simple SVG for this example)
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

const isOpen = ref(true)
const isMobile = ref(false)

// Mock recent activity
const recentActivity = ref([
  { id: 1, type: 'win', description: 'Won $45.60 from AK-47 Redline' },
  { id: 2, type: 'loss', description: 'Lost coinflip bet $20.00' },
  { id: 3, type: 'case', description: 'Opened Anubis Case' },
  { id: 4, type: 'upgrade', description: 'Upgraded 3 items successfully' }
])

// Navigation items
const mainNavItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Cases', href: '/cases', icon: CaseIcon },
  { name: 'Games', href: '/games', icon: GameIcon },
  { name: 'Upgrader', href: '/upgrade', icon: UpgradeIcon },
  { name: 'Casino', href: '/casino', icon: CasinoIcon },
  { name: 'Inventory', href: '/inventory', icon: InventoryIcon }
]

const gameNavItems = [
  { name: 'Roulette', href: '/games/roulette', icon: RouletteIcon },
  { name: 'Coinflip', href: '/games/coinflip', icon: CoinflipIcon },
  { name: 'Crash', href: '/games/crash', icon: CrashIcon }
]

// Computed
const userLevel = computed(() => getUserLevel.value || 1)
const experienceProgress = computed(() => getExperienceProgress.value || 0)
const gamesPlayed = computed(() => getGameStats.value?.totalGamesPlayed || 0)

// Methods
const isActiveRoute = (href: string): boolean => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const getActivityColor = (type: string): string => {
  const colors = {
    win: 'bg-green-400',
    loss: 'bg-red-400',
    case: 'bg-blue-400',
    upgrade: 'bg-purple-400',
    default: 'bg-gray-400'
  }
  return colors[type as keyof typeof colors] || colors.default
}

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isOpen.value = false
  }
}

// Handle window resize
const handleResize = () => {
  checkMobile()
}

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  if (isMobile.value) {
    isOpen.value = false
  }
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose methods for parent components
defineExpose({
  toggleSidebar,
  closeSidebar,
  isOpen: readonly(isOpen)
})
</script>
