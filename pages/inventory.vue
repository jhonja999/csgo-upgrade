<template>
  <div class="inventory-page">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold gradient-text mb-2">Mi Inventario</h1>
        <p class="text-gray-400">
          Gestiona tus items y ve estadísticas detalladas
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <button
          @click="refreshInventory"
          :disabled="inventoryStore.loading"
          class="btn btn-secondary"
          :class="{ 'animate-spin': inventoryStore.loading }"
        >
          🔄 Actualizar
        </button>
        
        <NuxtLink to="/deposit" class="btn btn-primary">
          + Depositar Items
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total Items</p>
            <p class="text-2xl font-bold text-white">{{ inventoryStore.itemCount }}</p>
          </div>
          <div class="text-3xl">📦</div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Valor Total</p>
            <p class="text-2xl font-bold text-green-400">${{ inventoryStore.totalValue.toFixed(2) }}</p>
          </div>
          <div class="text-3xl">💰</div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Valor Promedio</p>
            <p class="text-2xl font-bold text-blue-400">${{ averageValue.toFixed(2) }}</p>
          </div>
          <div class="text-3xl">📊</div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Item Más Caro</p>
            <p class="text-2xl font-bold text-purple-400">${{ mostExpensiveValue.toFixed(2) }}</p>
          </div>
          <div class="text-3xl">⭐</div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
      <InventoryFilters
        v-model:filters="activeFilters"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        @filters-changed="applyFilters"
      />
    </div>

    <!-- Loading State -->
    <div v-if="inventoryStore.loading" class="text-center py-12">
      <div class="loading-spinner mx-auto mb-4"></div>
      <p class="text-gray-400">Cargando inventario...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredItems.length === 0 && inventoryStore.itemCount === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-xl font-semibold text-white mb-2">Inventario Vacío</h3>
      <p class="text-gray-400 mb-6">Aún no tienes items en tu inventario</p>
      <div class="space-x-4">
        <NuxtLink to="/deposit" class="btn btn-primary">
          Depositar Items
        </NuxtLink>
        <NuxtLink to="/upgrade" class="btn btn-secondary">
          Probar Upgrade
        </NuxtLink>
      </div>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-white mb-2">No se encontraron items</h3>
      <p class="text-gray-400 mb-4">Prueba ajustando los filtros de búsqueda</p>
      <button @click="clearFilters" class="btn btn-secondary">
        Limpiar Filtros
      </button>
    </div>

    <!-- Inventory Grid -->
    <div v-else>
      <!-- Results Info -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-400">
          Mostrando {{ filteredItems.length }} de {{ inventoryStore.itemCount }} items
        </p>
        
        <div class="flex items-center gap-2">
          <span class="text-gray-400 text-sm">Vista:</span>
          <button
            @click="viewMode = 'grid'"
            class="btn btn-secondary text-sm px-2 py-1"
            :class="{ 'btn-primary': viewMode === 'grid' }"
          >
            ⊞
          </button>
          <button
            @click="viewMode = 'list'"
            class="btn btn-secondary text-sm px-2 py-1"
            :class="{ 'btn-primary': viewMode === 'list' }"
          >
            ☰
          </button>
        </div>
      </div>

      <!-- Items Display -->
      <InventoryGrid
        v-if="viewMode === 'grid'"
        :items="paginatedItems"
        :selected-items="selectedItems"
        @item-selected="onItemSelected"
        @item-action="onItemAction"
      />
      
      <InventoryList
        v-else
        :items="paginatedItems"
        :selected-items="selectedItems"
        @item-selected="onItemSelected"
        @item-action="onItemAction"
      />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          
          <span
            v-for="page in visiblePages"
            :key="page"
            class="px-3 py-2 rounded cursor-pointer transition-colors"
            :class="{
              'bg-orange-500 text-white': page === currentPage,
              'bg-gray-700 text-gray-300 hover:bg-gray-600': page !== currentPage
            }"
            @click="goToPage(page)"
          >
            {{ page }}
          </span>
          
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="btn btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedItems.length > 0" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
      <div class="flex items-center gap-4">
        <span class="text-white font-semibold">
          {{ selectedItems.length }} items seleccionados
        </span>
        
        <div class="flex items-center gap-2">
          <button
            @click="bulkUpgrade"
            class="btn btn-primary text-sm"
            :disabled="!canBulkUpgrade"
          >
            🚀 Upgrade Múltiple
          </button>
          
          <button
            @click="bulkSell"
            class="btn btn-secondary text-sm"
            :disabled="!canBulkSell"
          >
            💰 Vender Todo
          </button>
          
          <button
            @click="clearSelection"
            class="btn btn-secondary text-sm"
          >
            ✕ Limpiar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

// Meta tags
useHead({
  title: 'CSGO Upgrade - Mi Inventario',
  meta: [
    { name: 'description', content: 'Gestiona tu inventario de skins de CS:GO' }
  ]
})

// Stores
const inventoryStore = useInventoryStore()

// State
const activeFilters = ref({
  rarity: '',
  type: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  search: '',
  statTrak: undefined as boolean | undefined,
  souvenir: undefined as boolean | undefined
})

const sortBy = ref<'price' | 'name' | 'rarity'>('price')
const sortOrder = ref<'asc' | 'desc'>('desc')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedItems = ref<string[]>([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(24)

// Computed
const filteredItems = computed(() => {
  let items = inventoryStore.filterItems(activeFilters.value)
  return inventoryStore.sortItems(items, sortBy.value, sortOrder.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const averageValue = computed(() => {
  return inventoryStore.stats.averageValue
})

const mostExpensiveValue = computed(() => {
  return inventoryStore.stats.mostExpensive?.price || 0
})

const canBulkUpgrade = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length <= 5
})

const canBulkSell = computed(() => {
  return selectedItems.value.length > 0
})

// Methods
const refreshInventory = async () => {
  await inventoryStore.loadInventory()
}

const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when filtering
}

const clearFilters = () => {
  activeFilters.value = {
    rarity: '',
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    search: '',
    statTrak: undefined,
    souvenir: undefined
  }
  currentPage.value = 1
}

const onItemSelected = (itemId: string, selected: boolean) => {
  if (selected) {
    if (!selectedItems.value.includes(itemId)) {
      selectedItems.value.push(itemId)
    }
  } else {
    const index = selectedItems.value.indexOf(itemId)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }
  }
}

const onItemAction = (action: string, item: CSGOItem) => {
  switch (action) {
    case 'upgrade':
      navigateTo(`/upgrade?item=${item.id}`)
      break
    case 'sell':
      // Handle sell action
      console.log('Sell item:', item)
      break
    case 'details':
      // Handle view details
      console.log('View details:', item)
      break
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const clearSelection = () => {
  selectedItems.value = []
}

const bulkUpgrade = () => {
  // Handle bulk upgrade
  console.log('Bulk upgrade items:', selectedItems.value)
}

const bulkSell = () => {
  // Handle bulk sell
  console.log('Bulk sell items:', selectedItems.value)
}

// Load inventory on mount
onMounted(() => {
  if (inventoryStore.items.length === 0) {
    inventoryStore.loadInventory()
  }
})

// Watch for filter changes
watch([activeFilters, sortBy, sortOrder], () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #374151;
  border-top: 3px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.gradient-text {
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>