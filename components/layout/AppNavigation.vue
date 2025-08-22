<!-- components/layout/AppNavigation.vue -->
<template>
  <nav class="bg-gray-900 border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <img src="/dist/img/logo.png" alt="CSGOLuck" class="h-8 w-8">
            <span class="text-xl font-bold text-white">CSGOLuck</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActiveRoute(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- User Menu & Balance -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Balance Display -->
          <div class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
            <img src="/dist/img/other/coin.png" alt="Coin" class="w-5 h-5">
            <span class="font-bold text-green-400">${{ balance.toFixed(2) }}</span>
          </div>

          <!-- Deposit Button -->
          <NuxtLink
            to="/deposit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Deposit
          </NuxtLink>

          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              <img 
                :src="user?.avatar || '/dist/img/avatars/default.png'" 
                alt="Avatar"
                class="w-6 h-6 rounded-full"
              >
              <span class="font-medium">{{ user?.username || 'Guest' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50"
            >
              <template v-if="isLoggedIn">
                <NuxtLink
                  to="/inventory"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="closeUserMenu"
                >
                  Inventory
                </NuxtLink>
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="closeUserMenu"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </template>
              <template v-else>
                <button
                  @click="showLoginModal = true"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  @click="loginWithSteam"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Login with Steam
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-400 hover:text-white focus:outline-none focus:text-white"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-show="showMobileMenu" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'block px-3 py-2 rounded-md text-base font-medium transition-colors',
            isActiveRoute(item.href)
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- Mobile Balance & User -->
        <div class="border-t border-gray-700 pt-4 mt-4">
          <div class="flex items-center justify-between px-3 py-2">
            <div class="flex items-center space-x-2">
              <img src="/dist/img/other/coin.png" alt="Coin" class="w-5 h-5">
              <span class="font-bold text-green-400">${{ balance.toFixed(2) }}</span>
            </div>
            <NuxtLink
              to="/deposit"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
              @click="closeMobileMenu"
            >
              Deposit
            </NuxtLink>
          </div>
          
          <div class="px-3 py-2">
            <div class="flex items-center space-x-2 mb-3">
              <img 
                :src="user?.avatar || '/dist/img/avatars/default.png'" 
                alt="Avatar"
                class="w-8 h-8 rounded-full"
              >
              <span class="font-medium text-white">{{ user?.username || 'Guest' }}</span>
            </div>
            
            <div class="space-y-1">
              <template v-if="isLoggedIn">
                <NuxtLink
                  to="/inventory"
                  class="block text-gray-300 hover:text-white text-sm transition-colors"
                  @click="closeMobileMenu"
                >
                  Inventory
                </NuxtLink>
                <NuxtLink
                  to="/profile"
                  class="block text-gray-300 hover:text-white text-sm transition-colors"
                  @click="closeMobileMenu"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="logout"
                  class="block text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Logout
                </button>
              </template>
              <template v-else>
                <button
                  @click="showLoginModal = true"
                  class="block text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Login
                </button>
                <button
                  @click="loginWithSteam"
                  class="block text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Login with Steam
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="showLoginModal = false">
      <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="Username"
              required
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
          </div>
          
          <div>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="Password"
              required
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
          </div>
          
          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2 rounded-lg font-semibold transition-colors"
          >
            {{ isLoggingIn ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <div class="mt-4 text-center">
          <button
            @click="loginWithSteam"
            class="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition-colors"
          >
            Login with Steam
          </button>
        </div>
        
        <button
          @click="showLoginModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const balanceStore = useBalanceStore()
const route = useRoute()

// Reactive data
const { user, isLoggedIn, isLoading: isLoggingIn } = storeToRefs(userStore)
const { balance } = storeToRefs(balanceStore)

const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const showLoginModal = ref(false)
const userMenuRef = ref<HTMLElement>()

const loginForm = ref({
  username: '',
  password: ''
})

// Navigation items
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Cases', href: '/cases' },
  { name: 'Games', href: '/games' },
  { name: 'Upgrader', href: '/upgrade' },
  { name: 'Casino', href: '/casino' }
]

// Methods
const isActiveRoute = (href: string): boolean => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogin = async () => {
  try {
    const result = await userStore.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    
    if (result.success) {
      showLoginModal.value = false
      loginForm.value = { username: '', password: '' }
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const loginWithSteam = async () => {
  try {
    const result = await userStore.loginWithSteam()
    if (result.success) {
      showLoginModal.value = false
      showMobileMenu.value = false
      showUserMenu.value = false
    }
  } catch (error) {
    console.error('Steam login failed:', error)
  }
}

const logout = () => {
  userStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
}

// Close dropdowns when clicking outside
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

// Close mobile menu on route change
watch(() => route.path, () => {
  showMobileMenu.value = false
  showUserMenu.value = false
})

// Load user data on mount
onMounted(() => {
  userStore.loadUserData()
  balanceStore.loadBalance()
})
</script>
