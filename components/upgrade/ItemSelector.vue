<template>
  <div class="item-selector">
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">Tu Inventario</h3>
      
      <!-- Filtros -->
      <div class="flex flex-wrap gap-2 mb-4">
        <select 
          v-model="filters.rarity" 
          class="input text-sm"
          @change="applyFilters"
        >
          <option value="">Todas las rarezas</option>
          <option value="consumer">Consumer Grade</option>
          <option value="industrial">Industrial Grade</option>
          <option value="milspec">Mil-Spec</option>
          <option value="restricted">Restricted</option>
          <option value="classified">Classified</option>
          <option value="covert">Covert</option>
          <option value="contraband">Contraband</option>
        </select>
        
        <select 
          v-model="filters.type" 
          class="input text-sm"
          @change="applyFilters"
        >
          <option value="">Todos los tipos</option>
          <option value="rifle">Rifles</option>
          <option value="pistol">Pistolas</option>
          <option value="sniper">Francotiradores</option>
          <option value="knife">Cuchillos</option>
          <option value="gloves">Guantes</option>
        </select>
        
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar item..."
          class="input text-sm flex-1 min-w-[150px]"
          @input="applyFilters"
        >
      </div>
      
      <!-- Ordenamiento -->
      <div class="flex gap-2 mb-4">
        <select 
          v-model="sortBy" 
          class="input text-sm"
          @change="applySorting"
        >
          <option value="price">Precio</option>
          <option value="name">Nombre</option>
          <option value="rarity">Rareza</option>
        </select>
        
        <button
          @click="toggleSortOrder"
          class="btn btn-secondary text-sm px-3"
        >
          {{ sortOrder === 'desc' ? '↓' : '↑' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="inventoryStore.loading" class="text-center py-8">
      <div class="loading-spinner mx-auto mb-2"></div>
      <p class="text-gray-400">Cargando inventario...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-8">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <p class="text-gray-400">
        {{ inventoryStore.items.length === 0 ? 'No tienes items en tu inventario' : 'No se encontraron items con los filtros aplicados' }}
      </p>
      <NuxtLink to="/deposit" class="btn btn-primary mt-4 inline-block">
        Depositar Items
      </NuxtLink>
    </div>
    
    <!-- Items Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="item-card cursor-pointer transition-all duration-200 hover:scale-105"
        :class="{
          'ring-2 ring-orange-500': selectedItem?.id === item.id,
          [`rarity-${item.rarity}`]: true
        }"
        @click="selectItem(item)"
      >
        <div class="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500">
          <!-- Item Image -->
          <div class="aspect-square bg-gray-800 rounded mb-2 flex items-center justify-center">
            <img 
              :src="item.imageUrl" 
              :alt="item.name"
              class="w-full h-full object-contain"
              @error="onImageError"
            >
          </div>
          
          <!-- Item Info -->
          <div class="text-xs">
            <p class="font-medium text-white truncate mb-1" :title="item.name">
              {{ item.name }}
            </p>
            
            <div class="flex justify-between items-center">
              <span class="text-green-400 font-semibold">
                ${{ item.price.toFixed(2) }}
              </span>
              
              <div class="flex gap-1">
                <span v-if="item.statTrak" class="text-orange-400 text-xs">ST</span>
                <span v-if="item.souvenir" class="text-yellow-400 text-xs">★</span>
              </div>
            </div>
            
            <div class="mt-1">
              <span 
                class="text-xs px-1 py-0.5 rounded"
                :class="`rarity-${item.rarity}`"
              >
                {{ getRarityDisplayName(item.rarity) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected Item Info -->
    <div v-if="selectedItem" class="mt-4 p-4 bg-gray-700 rounded-lg border border-orange-500">
      <h4 class="font-semibold text-orange-400 mb-2">Item Seleccionado</h4>
      <div class="flex items-center gap-3">
        <div class="w-16 h-16 bg-gray-800 rounded flex-shrink-0">
          <img 
            :src="selectedItem.imageUrl" 
            :alt="selectedItem.name"
            class="w-full h-full object-contain"
          >
        </div>
        <div class="flex-1">
          <p class="font-medium text-white">{{ selectedItem.name }}</p>
          <p class="text-green-400 font-semibold">${{ selectedItem.price.toFixed(2) }}</p>
          <p class="text-gray-400 text-sm">{{ getRarityDisplayName(selectedItem.rarity) }}</p>
        </div>
        <button
          @click="clearSelection"
          class="text-red-400 hover:text-red-300 text-sm"
        >
          ✕ Deseleccionar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface Props {
  items: CSGOItem[]
  modelValue?: CSGOItem | null
}

interface Emits {
  (e: 'update:modelValue', item: CSGOItem | null): void
  (e: 'item-selected', item: CSGOItem): void
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  modelValue: null
})

const emit = defineEmits<Emits>()

// Stores
const inventoryStore = useInventoryStore()

// State
const filters = reactive({
  rarity: '',
  type: '',
  search: ''
})

const sortBy = ref<'price' | 'name' | 'rarity'>('price')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Computed
const selectedItem = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const filteredItems = computed(() => {
  let items = inventoryStore.filterItems({
    rarity: filters.rarity || undefined,
    type: filters.type || undefined,
    search: filters.search || undefined
  })
  
  return inventoryStore.sortItems(items, sortBy.value, sortOrder.value)
})

// Methods
const selectItem = (item: CSGOItem) => {
  selectedItem.value = item
  emit('item-selected', item)
}

const clearSelection = () => {
  selectedItem.value = null
}

const applyFilters = () => {
  // Los filtros se aplican automáticamente a través del computed
}

const applySorting = () => {
  // El ordenamiento se aplica automáticamente a través del computed
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const getRarityDisplayName = (rarity: string): string => {
  const rarityNames: Record<string, string> = {
    'consumer': 'Consumer Grade',
    'industrial': 'Industrial Grade',
    'milspec': 'Mil-Spec',
    'restricted': 'Restricted',
    'classified': 'Classified',
    'covert': 'Covert',
    'contraband': 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-item.jpg'
}

// Load inventory on mount
onMounted(() => {
  if (inventoryStore.items.length === 0) {
    inventoryStore.loadInventory()
  }
})
</script>

<style scoped>
.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #374151;
  border-top: 2px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.item-card:hover .item-info {
  background-color: rgba(55, 65, 81, 0.8);
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