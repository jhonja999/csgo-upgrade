<template>
  <div class="inventory-filters">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Buscar
        </label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Nombre del item..."
          class="input w-full"
          @input="emitFiltersChanged"
        >
      </div>

      <!-- Rarity Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Rareza
        </label>
        <select
          v-model="localFilters.rarity"
          class="input w-full"
          @change="emitFiltersChanged"
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
      </div>

      <!-- Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Arma
        </label>
        <select
          v-model="localFilters.type"
          class="input w-full"
          @change="emitFiltersChanged"
        >
          <option value="">Todos los tipos</option>
          <option value="rifle">Rifles</option>
          <option value="pistol">Pistolas</option>
          <option value="sniper">Francotiradores</option>
          <option value="shotgun">Escopetas</option>
          <option value="smg">SMGs</option>
          <option value="machinegun">Ametralladoras</option>
          <option value="knife">Cuchillos</option>
          <option value="gloves">Guantes</option>
        </select>
      </div>

      <!-- Sort Options -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Ordenar por
        </label>
        <div class="flex gap-2">
          <select
            v-model="localSortBy"
            class="input flex-1"
            @change="emitSortChanged"
          >
            <option value="price">Precio</option>
            <option value="name">Nombre</option>
            <option value="rarity">Rareza</option>
            <option value="type">Tipo</option>
          </select>
          <button
            @click="toggleSortOrder"
            class="btn btn-secondary px-3"
            :title="localSortOrder === 'desc' ? 'Descendente' : 'Ascendente'"
          >
            {{ localSortOrder === 'desc' ? '↓' : '↑' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Filters (Collapsible) -->
    <div class="border-t border-gray-700 pt-4">
      <button
        @click="showAdvanced = !showAdvanced"
        class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
      >
        <span>Filtros Avanzados</span>
        <span class="transform transition-transform" :class="{ 'rotate-180': showAdvanced }">
          ▼
        </span>
      </button>

      <Transition name="slide-down">
        <div v-if="showAdvanced" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Price Range -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Precio Mínimo
            </label>
            <input
              v-model.number="localFilters.minPrice"
              type="number"
              placeholder="$0.00"
              min="0"
              step="0.01"
              class="input w-full"
              @input="emitFiltersChanged"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Precio Máximo
            </label>
            <input
              v-model.number="localFilters.maxPrice"
              type="number"
              placeholder="$999,999"
              min="0"
              step="0.01"
              class="input w-full"
              @input="emitFiltersChanged"
            >
          </div>

          <!-- Special Attributes -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Atributos Especiales
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="localFilters.statTrak"
                  type="checkbox"
                  class="rounded border-gray-600 text-orange-500 focus:ring-orange-500 mr-2"
                  @change="emitFiltersChanged"
                >
                <span class="text-sm text-gray-300">Solo StatTrak™</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="localFilters.souvenir"
                  type="checkbox"
                  class="rounded border-gray-600 text-orange-500 focus:ring-orange-500 mr-2"
                  @change="emitFiltersChanged"
                >
                <span class="text-sm text-gray-300">Solo Souvenir</span>
              </label>
            </div>
          </div>

          <!-- Quick Price Filters -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Filtros Rápidos
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="setQuickFilter('cheap')"
                class="btn btn-secondary text-xs py-1"
              >
                Baratos (&lt;$10)
              </button>
              <button
                @click="setQuickFilter('mid')"
                class="btn btn-secondary text-xs py-1"
              >
                Medios ($10-100)
              </button>
              <button
                @click="setQuickFilter('expensive')"
                class="btn btn-secondary text-xs py-1"
              >
                Caros ($100+)
              </button>
              <button
                @click="setQuickFilter('premium')"
                class="btn btn-secondary text-xs py-1"
              >
                Premium ($1000+)
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="border-t border-gray-700 pt-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-medium text-gray-300">Filtros activos:</span>
        <button
          @click="clearAllFilters"
          class="text-orange-400 hover:text-orange-300 text-sm transition-colors"
        >
          Limpiar todo
        </button>
      </div>
      
      <div class="flex flex-wrap gap-2">
        <span
          v-for="filter in activeFilterTags"
          :key="filter.key"
          class="inline-flex items-center gap-1 bg-orange-500 bg-opacity-20 text-orange-400 px-2 py-1 rounded text-xs"
        >
          {{ filter.label }}
          <button
            @click="removeFilter(filter.key)"
            class="hover:text-orange-300 transition-colors"
          >
            ✕
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FilterOptions {
  rarity: string
  type: string
  minPrice?: number
  maxPrice?: number
  search: string
  statTrak?: boolean
  souvenir?: boolean
}

interface Props {
  filters: FilterOptions
  sortBy: 'price' | 'name' | 'rarity' | 'type'
  sortOrder: 'asc' | 'desc'
}

interface Emits {
  (e: 'update:filters', filters: FilterOptions): void
  (e: 'update:sortBy', sortBy: 'price' | 'name' | 'rarity' | 'type'): void
  (e: 'update:sortOrder', sortOrder: 'asc' | 'desc'): void
  (e: 'filters-changed'): void
}

// Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const showAdvanced = ref(false)

// Local reactive copies for v-model
const localFilters = ref<FilterOptions>({ ...props.filters })
const localSortBy = ref(props.sortBy)
const localSortOrder = ref(props.sortOrder)

// Computed
const hasActiveFilters = computed(() => {
  return localFilters.value.search ||
         localFilters.value.rarity ||
         localFilters.value.type ||
         localFilters.value.minPrice !== undefined ||
         localFilters.value.maxPrice !== undefined ||
         localFilters.value.statTrak ||
         localFilters.value.souvenir
})

const activeFilterTags = computed(() => {
  const tags: Array<{ key: string; label: string }> = []
  
  if (localFilters.value.search) {
    tags.push({ key: 'search', label: `Búsqueda: "${localFilters.value.search}"` })
  }
  
  if (localFilters.value.rarity) {
    const rarityNames: Record<string, string> = {
      'consumer': 'Consumer Grade',
      'industrial': 'Industrial Grade',
      'milspec': 'Mil-Spec',
      'restricted': 'Restricted',
      'classified': 'Classified',
      'covert': 'Covert',
      'contraband': 'Contraband'
    }
    tags.push({ key: 'rarity', label: `Rareza: ${rarityNames[localFilters.value.rarity]}` })
  }
  
  if (localFilters.value.type) {
    const typeNames: Record<string, string> = {
      'rifle': 'Rifles',
      'pistol': 'Pistolas',
      'sniper': 'Francotiradores',
      'shotgun': 'Escopetas',
      'smg': 'SMGs',
      'machinegun': 'Ametralladoras',
      'knife': 'Cuchillos',
      'gloves': 'Guantes'
    }
    tags.push({ key: 'type', label: `Tipo: ${typeNames[localFilters.value.type]}` })
  }
  
  if (localFilters.value.minPrice !== undefined) {
    tags.push({ key: 'minPrice', label: `Min: $${localFilters.value.minPrice}` })
  }
  
  if (localFilters.value.maxPrice !== undefined) {
    tags.push({ key: 'maxPrice', label: `Max: $${localFilters.value.maxPrice}` })
  }
  
  if (localFilters.value.statTrak) {
    tags.push({ key: 'statTrak', label: 'StatTrak™' })
  }
  
  if (localFilters.value.souvenir) {
    tags.push({ key: 'souvenir', label: 'Souvenir' })
  }
  
  return tags
})

// Methods
const emitFiltersChanged = () => {
  emit('update:filters', { ...localFilters.value })
  emit('filters-changed')
}

const emitSortChanged = () => {
  emit('update:sortBy', localSortBy.value)
  emit('update:sortOrder', localSortOrder.value)
  emit('filters-changed')
}

const toggleSortOrder = () => {
  localSortOrder.value = localSortOrder.value === 'desc' ? 'asc' : 'desc'
  emitSortChanged()
}

const setQuickFilter = (type: 'cheap' | 'mid' | 'expensive' | 'premium') => {
  switch (type) {
    case 'cheap':
      localFilters.value.minPrice = undefined
      localFilters.value.maxPrice = 10
      break
    case 'mid':
      localFilters.value.minPrice = 10
      localFilters.value.maxPrice = 100
      break
    case 'expensive':
      localFilters.value.minPrice = 100
      localFilters.value.maxPrice = 1000
      break
    case 'premium':
      localFilters.value.minPrice = 1000
      localFilters.value.maxPrice = undefined
      break
  }
  emitFiltersChanged()
}

const removeFilter = (filterKey: string) => {
  switch (filterKey) {
    case 'search':
      localFilters.value.search = ''
      break
    case 'rarity':
      localFilters.value.rarity = ''
      break
    case 'type':
      localFilters.value.type = ''
      break
    case 'minPrice':
      localFilters.value.minPrice = undefined
      break
    case 'maxPrice':
      localFilters.value.maxPrice = undefined
      break
    case 'statTrak':
      localFilters.value.statTrak = undefined
      break
    case 'souvenir':
      localFilters.value.souvenir = undefined
      break
  }
  emitFiltersChanged()
}

const clearAllFilters = () => {
  localFilters.value = {
    rarity: '',
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    search: '',
    statTrak: undefined,
    souvenir: undefined
  }
  emitFiltersChanged()
}

// Watch for prop changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

watch(() => props.sortBy, (newSortBy) => {
  localSortBy.value = newSortBy
})

watch(() => props.sortOrder, (newSortOrder) => {
  localSortOrder.value = newSortOrder
})
</script>

<style scoped>
/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 200px;
  opacity: 1;
}

/* Custom checkbox styling */
input[type="checkbox"] {
  accent-color: #f97316;
}
</style>