<template>
  <div class="last-drops bg-gray-800 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">🎉 Últimas Victorias</h3>
      <button
        @click="refreshDrops"
        class="text-gray-400 hover:text-white transition-colors"
        :class="{ 'animate-spin': isRefreshing }"
      >
        🔄
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="loading-skeleton h-16 rounded-lg"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="drops.length === 0" class="text-center py-8 text-gray-400">
      <div class="text-4xl mb-2">🎯</div>
      <p>No hay victorias recientes</p>
      <p class="text-sm">¡Sé el primero en ganar!</p>
    </div>

    <!-- Drops List -->
    <div v-else class="space-y-2">
      <TransitionGroup name="drop" tag="div">
        <div
          v-for="drop in drops"
          :key="drop.id"
          class="drop-item flex items-center gap-3 bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-all duration-200"
          :class="{ 'new-drop': drop.isNew }"
        >
          <!-- User Avatar -->
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-semibold">
              {{ getInitials(drop.username) }}
            </span>
          </div>

          <!-- Drop Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-white truncate">{{ drop.username }}</span>
              <span class="text-xs text-gray-400">{{ getTimeAgo(drop.timestamp) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-400 font-semibold text-sm">
                +${{ drop.profit.toFixed(2) }}
              </span>
              <span class="text-gray-400 text-xs">
                {{ drop.multiplier }}x
              </span>
            </div>
          </div>

          <!-- Item Image -->
          <div class="w-12 h-12 bg-gray-800 rounded border-2 flex-shrink-0" :class="`rarity-${drop.item.rarity}`">
            <img 
              :src="drop.item.imageUrl" 
              :alt="drop.item.name"
              class="w-full h-full object-contain p-1"
              @error="onImageError"
            >
          </div>

          <!-- Win Type Badge -->
          <div 
            class="px-2 py-1 rounded text-xs font-semibold"
            :class="getWinTypeBadgeClass(drop.type)"
          >
            {{ getWinTypeLabel(drop.type) }}
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Live Indicator -->
    <div class="flex items-center justify-center mt-4 text-xs text-gray-400">
      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
      <span>Actualizaciones en tiempo real</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface WinDrop {
  id: string
  username: string
  item: CSGOItem
  profit: number
  multiplier: number
  type: 'upgrade' | 'case' | 'roulette' | 'coinflip' | 'crash'
  timestamp: number
  isNew?: boolean
}

// State
const drops = ref<WinDrop[]>([])
const loading = ref(true)
const isRefreshing = ref(false)

// Methods
const loadDrops = async () => {
  loading.value = true
  
  try {
    // En desarrollo, usar datos mock
    if (process.dev) {
      await loadMockDrops()
    } else {
      // En producción, cargar desde API
      const response = await $fetch('/api/drops/recent')
      drops.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading drops:', error)
  } finally {
    loading.value = false
  }
}

const loadMockDrops = async (): Promise<void> => {
  // Simular delay de carga
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockDrops: WinDrop[] = [
    {
      id: '1',
      username: 'ProGamer123',
      item: {
        id: 'drop-1',
        name: 'AWP | Dragon Lore (Factory New)',
        marketName: 'AWP | Dragon Lore (Factory New)',
        price: 8500,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'covert',
        type: 'sniper',
        category: 'weapon'
      },
      profit: 8200,
      multiplier: 25.6,
      type: 'upgrade',
      timestamp: Date.now() - 1000 * 60 * 2 // 2 minutos atrás
    },
    {
      id: '2',
      username: 'SkinHunter',
      item: {
        id: 'drop-2',
        name: 'Karambit | Fade (Factory New)',
        marketName: 'Karambit | Fade (Factory New)',
        price: 2800,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'covert',
        type: 'knife',
        category: 'weapon'
      },
      profit: 2650,
      multiplier: 18.2,
      type: 'upgrade',
      timestamp: Date.now() - 1000 * 60 * 5 // 5 minutos atrás
    },
    {
      id: '3',
      username: 'LuckyPlayer',
      item: {
        id: 'drop-3',
        name: 'AK-47 | Fire Serpent (Minimal Wear)',
        marketName: 'AK-47 | Fire Serpent (Minimal Wear)',
        price: 1200,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'covert',
        type: 'rifle',
        category: 'weapon'
      },
      profit: 1050,
      multiplier: 7.8,
      type: 'upgrade',
      timestamp: Date.now() - 1000 * 60 * 8 // 8 minutos atrás
    },
    {
      id: '4',
      username: 'CasinoKing',
      item: {
        id: 'drop-4',
        name: 'M4A4 | Howl (Field-Tested)',
        marketName: 'M4A4 | Howl (Field-Tested)',
        price: 3500,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'contraband',
        type: 'rifle',
        category: 'weapon'
      },
      profit: 3200,
      multiplier: 12.4,
      type: 'upgrade',
      timestamp: Date.now() - 1000 * 60 * 12 // 12 minutos atrás
    },
    {
      id: '5',
      username: 'UpgradeGod',
      item: {
        id: 'drop-5',
        name: 'Glock-18 | Fade (Factory New)',
        marketName: 'Glock-18 | Fade (Factory New)',
        price: 450,
        imageUrl: '/placeholder-item.jpg',
        rarity: 'restricted',
        type: 'pistol',
        category: 'weapon'
      },
      profit: 380,
      multiplier: 5.2,
      type: 'upgrade',
      timestamp: Date.now() - 1000 * 60 * 15 // 15 minutos atrás
    }
  ]
  
  drops.value = mockDrops
}

const refreshDrops = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  await loadDrops()
  isRefreshing.value = false
}

const addNewDrop = (drop: WinDrop) => {
  // Marcar como nuevo
  drop.isNew = true
  
  // Añadir al principio de la lista
  drops.value.unshift(drop)
  
  // Quitar la marca de nuevo después de un tiempo
  setTimeout(() => {
    drop.isNew = false
  }, 5000)
  
  // Mantener solo los últimos 20 drops
  if (drops.value.length > 20) {
    drops.value = drops.value.slice(0, 20)
  }
}

const getInitials = (username: string): string => {
  return username.slice(0, 2).toUpperCase()
}

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return 'Ahora'
}

const getWinTypeBadgeClass = (type: string): string => {
  const classes = {
    upgrade: 'bg-orange-500 bg-opacity-20 text-orange-400',
    case: 'bg-blue-500 bg-opacity-20 text-blue-400',
    roulette: 'bg-red-500 bg-opacity-20 text-red-400',
    coinflip: 'bg-yellow-500 bg-opacity-20 text-yellow-400',
    crash: 'bg-purple-500 bg-opacity-20 text-purple-400'
  }
  
  return classes[type as keyof typeof classes] || 'bg-gray-500 bg-opacity-20 text-gray-400'
}

const getWinTypeLabel = (type: string): string => {
  const labels = {
    upgrade: 'UPGRADE',
    case: 'CASE',
    roulette: 'ROULETTE',
    coinflip: 'COINFLIP',
    crash: 'CRASH'
  }
  
  return labels[type as keyof typeof labels] || type.toUpperCase()
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-item.jpg'
}

// Lifecycle
onMounted(() => {
  loadDrops()
  
  // Actualizar cada 30 segundos
  const interval = setInterval(() => {
    if (!document.hidden) {
      refreshDrops()
    }
  }, 30000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})

// Expose method for external components
defineExpose({
  addNewDrop
})
</script>

<style scoped>
.loading-skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.new-drop {
  animation: highlight 3s ease-out;
}

@keyframes highlight {
  0% {
    background-color: rgba(34, 197, 94, 0.2);
    transform: scale(1.02);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
  }
}

/* Transition animations */
.drop-enter-active,
.drop-leave-active {
  transition: all 0.3s ease;
}

.drop-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.drop-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Rarity border colors */
.rarity-consumer {
  border-color: #b0c3d9;
}

.rarity-industrial {
  border-color: #5e98d9;
}

.rarity-milspec {
  border-color: #4b69ff;
}

.rarity-restricted {
  border-color: #8847ff;
}

.rarity-classified {
  border-color: #d32ce6;
}

.rarity-covert {
  border-color: #eb4b4b;
}

.rarity-contraband {
  border-color: #e4ae39;
}
</style>