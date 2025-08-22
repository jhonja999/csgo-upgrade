<template>
  <div class="inventory-grid">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="item-card relative bg-gray-700 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer"
        :class="[
          `rarity-${item.rarity}`,
          {
            'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900': selectedItems.includes(item.id),
            'opacity-75': selectedItems.length > 0 && !selectedItems.includes(item.id)
          }
        ]"
        @click="toggleSelection(item)"
        @contextmenu.prevent="showContextMenu(item, $event)"
      >
        <!-- Selection Checkbox -->
        <div class="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            :checked="selectedItems.includes(item.id)"
            class="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
            @click.stop="toggleSelection(item)"
          >
        </div>

        <!-- Special Badges -->
        <div class="absolute top-2 right-2 z-10 flex gap-1">
          <span v-if="item.statTrak" class="bg-orange-500 text-white text-xs px-1 py-0.5 rounded font-bold">
            ST
          </span>
          <span v-if="item.souvenir" class="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded font-bold">
            ★
          </span>
        </div>

        <!-- Item Image -->
        <div class="aspect-square bg-gray-800 rounded-t-lg p-3 flex items-center justify-center">
          <img
            :src="item.imageUrl"
            :alt="item.name"
            class="w-full h-full object-contain transition-transform duration-200 hover:scale-110"
            @error="onImageError"
            loading="lazy"
          >
        </div>

        <!-- Item Info -->
        <div class="p-3">
          <!-- Item Name -->
          <h3 
            class="text-white font-medium text-sm mb-1 truncate"
            :title="item.name"
          >
            {{ item.name }}
          </h3>

          <!-- Price -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-400 font-bold text-sm">
              ${{ item.price.toFixed(2) }}
            </span>
            
            <!-- Wear/Exterior -->
            <span v-if="item.exterior" class="text-xs text-gray-400">
              {{ getShortExterior(item.exterior) }}
            </span>
          </div>

          <!-- Rarity -->
          <div class="flex items-center justify-between">
            <span 
              class="text-xs px-2 py-1 rounded"
              :class="`rarity-${item.rarity}`"
            >
              {{ getRarityDisplayName(item.rarity) }}
            </span>
            
            <!-- Quick Actions -->
            <div class="flex gap-1">
              <button
                @click.stop="quickAction('upgrade', item)"
                class="text-orange-400 hover:text-orange-300 text-xs p-1 rounded hover:bg-gray-600 transition-colors"
                title="Upgrade"
              >
                🚀
              </button>
              
              <button
                @click.stop="quickAction('sell', item)"
                class="text-green-400 hover:text-green-300 text-xs p-1 rounded hover:bg-gray-600 transition-colors"
                title="Vender"
              >
                💰
              </button>
              
              <button
                @click.stop="quickAction('details', item)"
                class="text-blue-400 hover:text-blue-300 text-xs p-1 rounded hover:bg-gray-600 transition-colors"
                title="Detalles"
              >
                ℹ️
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="loadingItems.includes(item.id)"
          class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
        >
          <div class="loading-spinner"></div>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="fixed z-50 bg-gray-800 rounded-lg border border-gray-700 shadow-lg py-2 min-w-[150px]"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click.stop
    >
      <button
        v-for="action in contextMenuActions"
        :key="action.key"
        @click="handleContextAction(action.key)"
        class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
      >
        <span>{{ action.icon }}</span>
        <span>{{ action.label }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="col-span-full text-center py-12">
      <div class="text-4xl mb-4">📦</div>
      <p class="text-gray-400">No hay items para mostrar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface Props {
  items: CSGOItem[]
  selectedItems: string[]
}

interface Emits {
  (e: 'item-selected', itemId: string, selected: boolean): void
  (e: 'item-action', action: string, item: CSGOItem): void
}

// Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const loadingItems = ref<string[]>([])
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  item: null as CSGOItem | null
})

// Context menu actions
const contextMenuActions = [
  { key: 'upgrade', icon: '🚀', label: 'Upgrade Item' },
  { key: 'sell', icon: '💰', label: 'Vender Item' },
  { key: 'details', icon: 'ℹ️', label: 'Ver Detalles' },
  { key: 'separator', icon: '', label: '---' },
  { key: 'copy', icon: '📋', label: 'Copiar Nombre' },
  { key: 'favorite', icon: '⭐', label: 'Agregar a Favoritos' }
]

// Methods
const toggleSelection = (item: CSGOItem) => {
  const isSelected = props.selectedItems.includes(item.id)
  emit('item-selected', item.id, !isSelected)
}

const quickAction = (action: string, item: CSGOItem) => {
  emit('item-action', action, item)
}

const showContextMenu = (item: CSGOItem, event: MouseEvent) => {
  contextMenu.item = item
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
  contextMenu.visible = true
  
  // Adjust position if menu would go off screen
  nextTick(() => {
    const menu = document.querySelector('.fixed.z-50') as HTMLElement
    if (menu) {
      const rect = menu.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      if (contextMenu.x + rect.width > windowWidth) {
        contextMenu.x = windowWidth - rect.width - 10
      }
      
      if (contextMenu.y + rect.height > windowHeight) {
        contextMenu.y = windowHeight - rect.height - 10
      }
    }
  })
}

const hideContextMenu = () => {
  contextMenu.visible = false
  contextMenu.item = null
}

const handleContextAction = (action: string) => {
  if (!contextMenu.item || action === 'separator') return
  
  switch (action) {
    case 'copy':
      navigator.clipboard?.writeText(contextMenu.item.name)
      break
    case 'favorite':
      // Handle favorite action
      console.log('Add to favorites:', contextMenu.item)
      break
    default:
      emit('item-action', action, contextMenu.item)
  }
  
  hideContextMenu()
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-item.jpg'
}

const getRarityDisplayName = (rarity: string): string => {
  const rarityNames: Record<string, string> = {
    'consumer': 'Consumer',
    'industrial': 'Industrial',
    'milspec': 'Mil-Spec',
    'restricted': 'Restricted',
    'classified': 'Classified',
    'covert': 'Covert',
    'contraband': 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

const getShortExterior = (exterior: string): string => {
  const shortNames: Record<string, string> = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS'
  }
  
  return shortNames[exterior] || exterior
}

// Global click listener to hide context menu
onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
</script>

<style scoped>
.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #374151;
  border-top: 2px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

/* Rarity text colors for badges */
.rarity-consumer span {
  color: #b0c3d9;
}

.rarity-industrial span {
  color: #5e98d9;
}

.rarity-milspec span {
  color: #4b69ff;
}

.rarity-restricted span {
  color: #8847ff;
}

.rarity-classified span {
  color: #d32ce6;
}

.rarity-covert span {
  color: #eb4b4b;
}

.rarity-contraband span {
  color: #e4ae39;
}

/* Hover effects */
.item-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px) scale(1.02);
}

/* Selection animation */
.item-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Context menu separator */
.context-separator {
  height: 1px;
  background-color: #374151;
  margin: 4px 0;
}
</style>