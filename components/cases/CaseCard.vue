<!-- components/cases/CaseCard.vue -->
<template>
  <div class="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <!-- Background Gradient -->
    <div class="absolute inset-0 opacity-30" :style="{ background: case.background }" />
    
    <!-- Case Image -->
    <div class="relative p-8 text-center">
      <div class="relative w-32 h-32 mx-auto mb-6">
        <img 
          :src="case.image" 
          :alt="case.name"
          class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        >
        <!-- Glow Effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
      </div>
      
      <!-- Case Info -->
      <h3 class="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
        {{ case.name }}
      </h3>
      
      <p v-if="case.description" class="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors">
        {{ case.description }}
      </p>
      
      <!-- Price -->
      <div class="flex items-center justify-center space-x-2 mb-6">
        <img src="/dist/img/other/coin.png" alt="Coin" class="w-6 h-6">
        <span class="text-3xl font-bold text-green-400">${{ case.price.toFixed(2) }}</span>
      </div>
      
      <!-- Open Button -->
      <button
        @click="openCase"
        :disabled="!canOpen"
        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 py-4 rounded-lg text-xl font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {{ canOpen ? 'Open Case' : 'Insufficient Balance' }}
      </button>
    </div>

    <!-- Best Item Preview -->
    <div v-if="bestItem" class="absolute top-4 right-4 group-hover:scale-110 transition-transform duration-200">
      <div class="w-16 h-16 bg-black/30 rounded-lg p-2">
        <img 
          :src="bestItem.image" 
          :alt="bestItem.name"
          class="w-full h-full object-contain"
        >
      </div>
    </div>

    <!-- Category Badge -->
    <div class="absolute top-4 left-4">
      <span :class="`px-2 py-1 rounded text-xs font-bold ${getCategoryStyle(case.category)}`">
        {{ formatCategory(case.category) }}
      </span>
    </div>

    <!-- Hover Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
</template>

<script setup lang="ts">
import type { GameCase } from '~/types'

interface Props {
  case: GameCase
}

const props = defineProps<Props>()
const emit = defineEmits<{
  open: [case: GameCase]
}>()

const { hasEnoughBalance } = useBalance()

const canOpen = computed(() => hasEnoughBalance(props.case.price))

const bestItem = computed(() => {
  // Get the rarest/most expensive item from the case
  if (!props.case.items || props.case.items.length === 0) return null
  
  return props.case.items
    .sort((a, b) => b.item.price - a.item.price)[0]?.item
})

const getCategoryStyle = (category: string) => {
  const styles = {
    'weapon': 'bg-blue-600 text-white',
    'knife': 'bg-yellow-600 text-black',
    'glove': 'bg-green-600 text-white',
    'special': 'bg-purple-600 text-white'
  }
  return styles[category as keyof typeof styles] || styles.weapon
}

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const openCase = () => {
  if (canOpen.value) {
    emit('open', props.case)
  }
}
</script>
