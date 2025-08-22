<template>
  <header class="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">CS</span>
          </div>
          <span class="text-xl font-bold text-white">CSGO Upgrade</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/upgrade" 
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/upgrade' }"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink 
            to="/inventory" 
            class="text-gray-300 hover:text-white transition-colors"
            :class="{ 'text-orange-400': $route.path === '/inventory' }"
          >
            Inventario
          </NuxtLink>
          <div class="text-gray-500 cursor-not-allowed">
            Cases (Próximamente)
          </div>
          <div class="text-gray-500 cursor-not-allowed">
            Casino (Próximamente)
          </div>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Balance -->
          <div class="bg-gray-700 rounded-lg px-4 py-2 flex items-center space-x-2">
            <span class="text-yellow-400">💰</span>
            <span class="text-white font-semibold">${{ formattedBalance }}</span>
          </div>

          <!-- Deposit Button -->
          <NuxtLink 
            to="/deposit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Depositar
          </NuxtLink>

          <!-- User Menu -->
          <div class="relative">
            <button class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm">👤</span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden text-gray-300 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-700">
        <nav class="flex flex-col space-y-4">
          <NuxtLink 
            to="/" 
            @click="closeMobileMenu"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/upgrade" 
            @click="closeMobileMenu"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink 
            to="/inventory" 
            @click="closeMobileMenu"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Inventario
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Stores
const balanceStore = useBalanceStore()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Computed
const formattedBalance = computed(() => {
  return balanceStore.balance.toFixed(2)
})

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>