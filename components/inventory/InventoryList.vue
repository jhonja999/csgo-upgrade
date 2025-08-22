<template>
  <div class="inventory-list">
    <!-- Table Header -->
    <div class="bg-gray-800 rounded-t-lg border border-gray-700">
      <div class="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-300">
        <div class="col-span-1 flex items-center">
          <input
            type="checkbox"
            :checked="allSelected"
            :indeterminate="someSelected"
            @change="toggleAllSelection"
            class="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
          >
        </div>
        <div class="col-span-1">
          <button
            @click="toggleSort('image')"
            class="flex items-center gap-1 hover:text-white transition-colors"
          >
            Imagen
          </button>
        </div>
        <div class="col-span-4">
          <button
            @click="toggleSort('name')"
            class="flex items-center gap-1 hover:text-white transition-colors"
          >
            Nombre
            <span v-if="sortBy === 'name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </button>
        </div>
        <div class="col-span-2">
          <button
            @click="toggleSort('price')"
            class="flex items-center gap-1 hover:text-white transition-colors"
          >
            Precio
            <span v-if="sortBy === 'price'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </button>
        </div>
        <div class="col-span-2">
          <button
            @click="toggleSort('rarity')"
            class="flex items-center gap-1 hover:text-white transition-colors"
          >
            Rareza
            <span v-if="sortBy === 'rarity'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </button>
        </div>
        <div class="col-span-2">
          Acciones
        </div>
      </div>
    </div>

    <!-- Table Body -->
    <div class="bg-gray-700 rounded-b-lg border-l border-r border-b border-gray-700">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="inventory-list-item grid grid-cols-12 gap-4 p-4 border-b border-gray-600 last:border-b-0 hover:bg-gray-600 transition-colors"
          :class="{
            'bg-gray-600': selectedItems.includes(item.id),
            'opacity-75': loadingItems.includes(item.id)
          }"
        >
          <!-- Selection Checkbox -->
          <div class="col-span-1 flex items-center">
            <input
              type="checkbox"
              :checked="selectedItems.includes(item.id)"
              @change="toggleItemSelection(item.id)"
              class="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
            >
          </div>

          <!-- Item Image -->
          <div class="col-span-1 flex items-center">
            <div 
              class="w-12 h-12 bg-gray-800 rounded border-2 flex-shrink-0"
              :class="`rarity-${item.rarity}`"
            >
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-contain p-1"
                @error="onImageError"
                loading="lazy"
              >
            </div>
          </div>

          <!-- Item Name and Details -->
          <div class="col-span-4 flex flex-col justify-center min-w-0">
            <h3 class="font-medium text-white truncate" :title="item.name">
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                v-if="item.exterior"
                class="text-xs text-gray-400"
              >
                {{ item.exterior }}
              </span>
              <span
                v-if="item.statTrak"
                class="bg-orange-500 text-white text-xs px-1 py-0.5 rounded font-bold"
              >
                ST
              </span>
              <span
                v-if="item.souvenir"
                class="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded font-bold"
              >
                ★
              </span>
            </div>
            
            <!-- Float Value -->
            <div
              v-if="item.float !== undefined"
              class="text-xs text-gray-400 mt-1"
            >
              Float: {{ item.float.toFixed(4) }}
            </div>
          </div>

          <!-- Price -->
          <div class="col-span-2 flex flex-col justify-center">
            <span class="text-green-400 font-semibold text-lg">
              ${{ formatPrice(item.price) }}
            </span>
            
            <!-- Price Change (if available) -->
            <div
              v-if="item.priceChange"
              class="text-xs mt-1"
              :class="{
                'text-green-400': item.priceChange > 0,
                'text-red-400': item.priceChange < 0,
                'text-gray-400': item.priceChange === 0
              }"
            >
              {{ item.priceChange > 0 ? '+' : '' }}{{ item.priceChange.toFixed(2) }}%
            </div>
          </div>

          <!-- Rarity -->
          <div class="col-span-2 flex items-center">
            <span
              class="px-2 py-1 rounded text-xs font-medium"
              :style="{ 
                color: getRarityColor(item.rarity),
                backgroundColor: getRarityColor(item.rarity) + '20',
                borderColor: getRarityColor(item.rarity)
              }"
            >
              {{ getRarityDisplayName(item.rarity) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex items-center gap-2">
            <button
              @click="handleAction('upgrade', item)"
              class="btn-action text-orange-400 hover:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20"
              title="Upgrade"
              :disabled="loadingItems.includes(item.id)"
            >
              🚀
            </button>
            
            <button
              @click="handleAction('sell', item)"
              class="btn-action text-green-400 hover:text-green-300 hover:bg-green-500 hover:bg-opacity-20"
              title="Vender"
              :disabled="loadingItems.includes(item.id)"
            >
              💰
            </button>
            
            <button
              @click="handleAction('details', item)"
              class="btn-action text-blue-400 hover:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20"
              title="Detalles"
              :disabled="loadingItems.includes(item.id)"
            >
              ℹ️
            </button>

            <!-- More actions dropdown -->
            <div class="relative">
              <button
                @click="toggleActionsMenu(item.id)"
                class="btn-action text-gray-400 hover:text-gray-300 hover:bg-gray-500 hover:bg-opacity-20"
                title="Más acciones"
              >
                ⋯
              </button>
              
              <!-- Actions dropdown menu -->
              <div
                v-if="activeActionsMenu === item.id"
                class="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]"
                @click.stop
              >
                <button
                  @click="handleAction('favorite', item); closeActionsMenu()"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors first:rounded-t-lg"
                >
                  ⭐ Favorito
                </button>
                <button
                  @click="handleAction('copy', item); closeActionsMenu()"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  📋 Copiar nombre
                </button>
                <button
                  @click="handleAction('inspect', item); closeActionsMenu()"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors last:rounded-b-lg"
                >
                  🔍 Inspeccionar
                </button>
              </div>
            </div>

            <!-- Loading indicator -->
            <div
              v-if="loadingItems.includes(item.id)"
              class="ml-2"
            >
              <LoadingSpinner size="xs" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div
        v-if="items.length === 0"
        class="text-center py-12 text-gray-400"
      >
        <div class="text-4xl mb-4">📦</div>
        <p>No hay items para mostrar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface Props {
  items: CSGOItem[]
  selectedItems: string[]
  loadingItems?: string[]
}

interface Emits {
  (e: 'item-selected', itemId: string, selected: boolean): void
  (e: 'item-action', action: string, item: CSGOItem): void
  (e: 'sort-change', sortBy: string, sortOrder: 'asc' | 'desc'): void
  (e: 'select-all', selected: boolean): void
}

// Props
const props = withDefaults(defineProps<Props>(), {
  loadingItems: () => []
})

// Emits
const emit = defineEmits<Emits>()

// State
const sortBy = ref<string>('price')
const sortOrder = ref<'asc' | 'desc'>('desc')
const activeActionsMenu = ref<string | null>(null)

// Computed
const allSelected = computed(() => {
  return props.items.length > 0 && props.selectedItems.length === props.items.length
})

const someSelected = computed(() => {
  return props.selectedItems.length > 0 && props.selectedItems.length < props.items.length
})

// Methods
const toggleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc'
  }
  
  emit('sort-change', sortBy.value, sortOrder.value)
}

const toggleAllSelection = () => {
  emit('select-all', !allSelected.value)
}

const toggleItemSelection = (itemId: string) => {
  const isSelected = props.selectedItems.includes(itemId)
  emit('item-selected', itemId, !isSelected)
}

const handleAction = (action: string, item: CSGOItem) => {
  emit('item-action', action, item)
}

const toggleActionsMenu = (itemId: string) => {
  activeActionsMenu.value = activeActionsMenu.value === itemId ? null : itemId
}

const closeActionsMenu = () => {
  activeActionsMenu.value = null
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getRarityDisplayName = (rarity: string): string => {
  const rarityNames: Record<string, string> = {
    consumer: 'Consumer',
    industrial: 'Industrial',
    milspec: 'Mil-Spec',
    restricted: 'Restricted',
    classified: 'Classified',
    covert: 'Covert',
    contraband: 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    consumer: '#b0c3d9',
    industrial: '#5e98d9',
    milspec: '#4b69ff',
    restricted: '#8847ff',
    classified: '#d32ce6',
    covert: '#eb4b4b',
    contraband: '#e4ae39'
  }
  
  return colors[rarity] || '#9ca3af'
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-item.jpg'
}

// Close actions menu when clicking outside
onMounted(() => {
  document.addEventListener('click', () => {
    activeActionsMenu.value = null
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {
    activeActionsMenu.value = null
  })
})
</script>

<style scoped>
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

/* Action buttons */
.btn-action {
  @apply p-2 rounded text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-action:hover:not(:disabled) {
  transform: scale(1.1);
}

/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Row hover effect */
.inventory-list-item:hover {
  box-shadow: inset 2px 0 0 #f97316;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .inventory-list-item {
    grid-template-columns: auto 60px 1fr auto;
    gap: 2;
  }
  
  .col-span-1,
  .col-span-2,
  .col-span-4 {
    grid-column: span 1;
  }
  
  /* Hide some columns on mobile */
  .inventory-list-item > div:nth-child(5),
  .inventory-list-item > div:nth-child(6) {
    display: none;
  }
}
</style>