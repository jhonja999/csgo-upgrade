<!-- components/cases/CasesList.vue -->
<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search cases..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
        </div>
        
        <select
          v-model="selectedCategory"
          class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          <option value="weapon">Weapon Cases</option>
          <option value="knife">Knife Cases</option>
          <option value="glove">Glove Cases</option>
          <option value="special">Special Cases</option>
        </select>
        
        <select
          v-model="sortBy"
          class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    <!-- Cases Grid -->
    <div v-if="filteredCases.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <CaseCard
        v-for="gameCase in filteredCases"
        :key="gameCase.id"
        :case="gameCase"
        @open="openCase"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-2xl font-bold mb-2">No Cases Found</h3>
      <p class="text-gray-400">
        {{ searchTerm ? 'No cases match your search criteria.' : 'No cases available at the moment.' }}
      </p>
    </div>

    <!-- Case Opening Modal -->
    <CaseOpenModal
      v-if="selectedCase"
      :case="selectedCase"
      @close="closeModal"
      @result="handleCaseResult"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameCase, CSGOItem } from '~/types'

const emit = defineEmits<{
  openCase: [case: GameCase]
  caseResult: [result: { item: CSGOItem }]
}>()

// State
const searchTerm = ref('')
const selectedCategory = ref('')
const sortBy = ref('popularity')
const selectedCase = ref<GameCase | null>(null)

// Mock cases data (in real app this would come from API/store)
const cases = ref<GameCase[]>([
  {
    id: 'anubis',
    name: 'Anubis Case',
    description: 'Contains a selection of weapons with Egyptian themes',
    image: '/dist/img/cases/anubis.png',
    price: 2.49,
    category: 'weapon',
    background: 'linear-gradient(45deg, #d97706, #fbbf24)',
    items: []
  },
  {
    id: 'awp',
    name: 'AWP Case',
    description: 'Exclusive AWP skins from various collections',
    image: '/dist/img/cases/awp.png',
    price: 4.99,
    category: 'weapon',
    background: 'linear-gradient(45deg, #dc2626, #f87171)',
    items: []
  },
  {
    id: 'knife',
    name: 'Knife Case',
    description: 'Rare knife skins with unique patterns',
    image: '/dist/img/cases/knife.png',
    price: 9.99,
    category: 'knife',
    background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
    items: []
  },
  {
    id: 'glove',
    name: 'Glove Case',
    description: 'Premium glove skins for your hands',
    image: '/dist/img/cases/glove.png',
    price: 7.49,
    category: 'glove',
    background: 'linear-gradient(45deg, #059669, #10b981)',
    items: []
  },
  {
    id: 'premium',
    name: 'Premium Case',
    description: 'High-tier skins with guaranteed rare items',
    image: '/dist/img/cases/premium.png',
    price: 14.99,
    category: 'special',
    background: 'linear-gradient(45deg, #f59e0b, #fcd34d)',
    items: []
  },
  {
    id: 'operation',
    name: 'Operation Case',
    description: 'Limited time operation exclusive items',
    image: '/dist/img/cases/operation.png',
    price: 3.99,
    category: 'special',
    background: 'linear-gradient(45deg, #1d4ed8, #3b82f6)',
    items: []
  }
])

// Computed
const filteredCases = computed(() => {
  let filtered = cases.value

  // Filter by search term
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(c => c.category === selectedCategory.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'price':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'popularity':
      // Mock popularity sorting
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      filtered.reverse()
      break
  }

  return filtered
})

// Methods
const openCase = (gameCase: GameCase) => {
  selectedCase.value = gameCase
  emit('openCase', gameCase)
}

const closeModal = () => {
  selectedCase.value = null
}

const handleCaseResult = (result: { item: CSGOItem }) => {
  emit('caseResult', result)
  // Keep modal open to show result, it will auto-close after animation
}
</script>
