<template>
  <div class="upgrade-calculator">
    <h2 class="text-2xl font-bold mb-6 text-center">Calculadora de Upgrade</h2>
    
    <!-- Input Item Display -->
    <div v-if="inputItem" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Item a Upgradear</h3>
      <div class="bg-gray-700 rounded-lg p-4 border border-gray-600">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-800 rounded flex-shrink-0">
            <img 
              :src="inputItem.imageUrl" 
              :alt="inputItem.name"
              class="w-full h-full object-contain"
            >
          </div>
          <div class="flex-1">
            <p class="font-medium text-white">{{ inputItem.name }}</p>
            <p class="text-green-400 font-semibold text-lg">${{ inputItem.price.toFixed(2) }}</p>
            <p class="text-gray-400">{{ getRarityDisplayName(inputItem.rarity) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Multiplier Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Multiplicador de Upgrade
      </label>
      
      <div class="space-y-4">
        <!-- Slider -->
        <div class="relative">
          <input
            v-model="selectedMultiplier"
            type="range"
            :min="upgradeStore.config.minMultiplier"
            :max="Math.min(upgradeStore.config.maxMultiplier, maxPossibleMultiplier)"
            step="0.1"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            @input="onMultiplierChange"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ upgradeStore.config.minMultiplier }}x</span>
            <span>{{ Math.min(upgradeStore.config.maxMultiplier, maxPossibleMultiplier) }}x</span>
          </div>
        </div>
        
        <!-- Custom Input -->
        <div class="flex items-center gap-2">
          <input
            v-model.number="selectedMultiplier"
            type="number"
            :min="upgradeStore.config.minMultiplier"
            :max="Math.min(upgradeStore.config.maxMultiplier, maxPossibleMultiplier)"
            step="0.1"
            class="input flex-1"
            @input="onMultiplierChange"
          >
          <span class="text-gray-400">x</span>
        </div>
        
        <!-- Quick Multiplier Buttons -->
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="quickMultiplier in quickMultipliers"
            :key="quickMultiplier"
            @click="setMultiplier(quickMultiplier)"
            class="btn btn-secondary text-sm"
            :class="{ 'btn-primary': selectedMultiplier === quickMultiplier }"
          >
            {{ quickMultiplier }}x
          </button>
        </div>
      </div>
    </div>

    <!-- Target Price Display -->
    <div v-if="inputItem" class="mb-6 bg-gray-700 rounded-lg p-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-400 text-sm">Precio Objetivo</p>
          <p class="text-xl font-bold text-white">${{ targetPrice.toFixed(2) }}</p>
        </div>
        <div>
          <p class="text-gray-400 text-sm">Ganancia Potencial</p>
          <p class="text-xl font-bold text-green-400">+${{ potentialProfit.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- Possible Items -->
    <div v-if="possibleItems.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Posibles Resultados</h3>
      
      <!-- Statistics -->
      <div class="bg-gray-700 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-green-400">{{ totalWinChance.toFixed(1) }}%</p>
            <p class="text-gray-400 text-sm">Probabilidad de Ganar</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-red-400">{{ (100 - totalWinChance).toFixed(1) }}%</p>
            <p class="text-gray-400 text-sm">Probabilidad de Perder</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-blue-400">{{ possibleItems.length }}</p>
            <p class="text-gray-400 text-sm">Items Posibles</p>
          </div>
        </div>
      </div>
      
      <!-- Items List -->
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="itemProb in possibleItems"
          :key="itemProb.item.id"
          class="flex items-center gap-3 bg-gray-700 rounded-lg p-3"
        >
          <div class="w-12 h-12 bg-gray-800 rounded flex-shrink-0">
            <img 
              :src="itemProb.item.imageUrl" 
              :alt="itemProb.item.name"
              class="w-full h-full object-contain"
            >
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white truncate">{{ itemProb.item.name }}</p>
            <p class="text-sm text-gray-400">{{ getRarityDisplayName(itemProb.item.rarity) }}</p>
          </div>
          
          <div class="text-right">
            <p class="font-semibold text-green-400">${{ itemProb.item.price.toFixed(2) }}</p>
            <p class="text-sm text-blue-400">{{ (itemProb.probability * 100).toFixed(2) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Messages -->
    <div v-if="warnings.length > 0" class="mb-6">
      <div
        v-for="warning in warnings"
        :key="warning"
        class="bg-yellow-500 bg-opacity-10 border border-yellow-500 text-yellow-400 p-3 rounded-lg mb-2"
      >
        ⚠️ {{ warning }}
      </div>
    </div>

    <!-- Action Button -->
    <div class="text-center">
      <button
        @click="attemptUpgrade"
        :disabled="!canUpgrade"
        class="btn btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'animate-pulse': isProcessing }"
      >
        <span v-if="isProcessing">Procesando...</span>
        <span v-else>🎲 Intentar Upgrade - ${{ inputItem?.price.toFixed(2) }}</span>
      </button>
      
      <p class="text-gray-400 text-sm mt-2">
        House Edge: {{ (upgradeStore.config.houseEdge * 100).toFixed(1) }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem, ItemProbability } from '~/types'

interface Props {
  inputItem?: CSGOItem | null
  multiplier?: number
}

interface Emits {
  (e: 'multiplier-changed', multiplier: number): void
  (e: 'upgrade-attempt', data: { inputItem: CSGOItem; multiplier: number; possibleItems: ItemProbability[] }): void
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  inputItem: null,
  multiplier: 2.0
})

const emit = defineEmits<Emits>()

// Stores
const upgradeStore = useUpgradeStore()
const balanceStore = useBalanceStore()

// State
const selectedMultiplier = ref(props.multiplier)
const isProcessing = ref(false)

// Computed
const targetPrice = computed(() => {
  if (!props.inputItem) return 0
  return props.inputItem.price * selectedMultiplier.value
})

const potentialProfit = computed(() => {
  if (!props.inputItem) return 0
  return targetPrice.value - props.inputItem.price
})

const maxPossibleMultiplier = computed(() => {
  // Límite basado en el balance o items disponibles
  if (!props.inputItem) return upgradeStore.config.maxMultiplier
  
  const maxBasedOnBalance = Math.min(
    upgradeStore.config.maxMultiplier,
    (balanceStore.balance + props.inputItem.price) / props.inputItem.price
  )
  
  return Math.max(upgradeStore.config.minMultiplier, maxBasedOnBalance)
})

const possibleItems = computed(() => {
  if (!props.inputItem) return []
  return upgradeStore.calculateUpgrade(props.inputItem, selectedMultiplier.value)
})

const totalWinChance = computed(() => {
  return possibleItems.value.reduce((total, item) => total + item.probability, 0) * 100
})

const quickMultipliers = computed(() => {
  const multipliers = [2.0, 5.0, 10.0, 20.0]
  return multipliers.filter(mult => mult <= maxPossibleMultiplier.value)
})

const warnings = computed(() => {
  const warns: string[] = []
  
  if (!props.inputItem) return warns
  
  if (selectedMultiplier.value > 10) {
    warns.push('Multiplicadores altos tienen muy baja probabilidad de éxito')
  }
  
  if (totalWinChance.value < 5) {
    warns.push('La probabilidad de ganar es muy baja')
  }
  
  if (targetPrice.value > balanceStore.balance * 10) {
    warns.push('El precio objetivo es muy alto comparado con tu balance')
  }
  
  return warns
})

const canUpgrade = computed(() => {
  return !!(
    props.inputItem &&
    selectedMultiplier.value >= upgradeStore.config.minMultiplier &&
    selectedMultiplier.value <= maxPossibleMultiplier.value &&
    possibleItems.value.length > 0 &&
    !isProcessing.value
  )
})

// Methods
const onMultiplierChange = () => {
  emit('multiplier-changed', selectedMultiplier.value)
}

const setMultiplier = (multiplier: number) => {
  selectedMultiplier.value = multiplier
  onMultiplierChange()
}

const attemptUpgrade = () => {
  if (!canUpgrade.value || !props.inputItem) return
  
  isProcessing.value = true
  
  emit('upgrade-attempt', {
    inputItem: props.inputItem,
    multiplier: selectedMultiplier.value,
    possibleItems: possibleItems.value
  })
  
  // Reset processing state after a delay
  setTimeout(() => {
    isProcessing.value = false
  }, 3000)
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

// Watch props
watch(() => props.multiplier, (newMultiplier) => {
  if (newMultiplier && newMultiplier !== selectedMultiplier.value) {
    selectedMultiplier.value = newMultiplier
  }
})
</script>

<style scoped>
.slider {
  background: linear-gradient(to right, #374151, #6b7280);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ef4444);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ef4444);
  cursor: pointer;
  border: none;
}
</style>