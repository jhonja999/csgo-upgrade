<template>
  <div class="upgrade-page">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
        Upgrade Station
      </h1>
      <p class="text-gray-300">
        Selecciona un item y mejóralo con probabilidades calculadas
      </p>
    </div>

    <!-- Main Upgrade Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Input Item Selection -->
      <div class="lg:col-span-1">
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Seleccionar Item</h2>
          <ItemSelector 
            v-model="selectedItem"
            :items="availableItems"
            @item-selected="onItemSelected"
          />
        </div>
      </div>

      <!-- Upgrade Calculator -->
      <div class="lg:col-span-2">
        <div class="bg-gray-800 rounded-lg p-6">
          <UpgradeCalculator 
            v-if="selectedItem"
            :input-item="selectedItem"
            :multiplier="upgradeMultiplier"
            @multiplier-changed="onMultiplierChanged"
            @upgrade-attempt="onUpgradeAttempt"
          />
          <div v-else class="text-center py-12 text-gray-400">
            <p class="text-lg">Selecciona un item para comenzar el upgrade</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Animation -->
    <UpgradeAnimation 
      v-if="showAnimation"
      :animation-data="animationData"
      @animation-complete="onAnimationComplete"
    />

    <!-- Balance Display -->
    <Balance class="fixed top-4 right-4" />
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem, UpgradeSession, UpgradeResult } from '~/types'

// Meta tags
useHead({
  title: 'CSGO Upgrade - Upgrade Station',
  meta: [
    { name: 'description', content: 'Mejora tus skins de CS:GO con nuestro sistema de upgrade inteligente' }
  ]
})

// Stores
const balanceStore = useBalanceStore()
const inventoryStore = useInventoryStore()
const upgradeStore = useUpgradeStore()

// Reactive state
const selectedItem = ref<CSGOItem | null>(null)
const upgradeMultiplier = ref(2.0)
const showAnimation = ref(false)
const animationData = ref(null)

// Computed
const availableItems = computed(() => {
  return inventoryStore.items.filter(item => item.price >= 1)
})

// Methods
const onItemSelected = (item: CSGOItem) => {
  selectedItem.value = item
}

const onMultiplierChanged = (multiplier: number) => {
  upgradeMultiplier.value = multiplier
}

const onUpgradeAttempt = async (data: any) => {
  if (!selectedItem.value) return

  try {
    // Show animation
    showAnimation.value = true
    
    // Call upgrade API
    const result = await upgradeStore.performUpgrade({
      inputItemId: selectedItem.value.id,
      multiplier: upgradeMultiplier.value
    })

    // Update animation data
    animationData.value = {
      inputItem: selectedItem.value,
      result: result.data,
      duration: 3000
    }
    
  } catch (error) {
    console.error('Error durante el upgrade:', error)
    // Handle error
  }
}

const onAnimationComplete = (result: UpgradeResult) => {
  showAnimation.value = false
  
  if (result.success) {
    // Update balance and inventory
    balanceStore.addBalance(result.profit)
    if (result.wonItem) {
      inventoryStore.addItem(result.wonItem)
    }
    inventoryStore.removeItem(selectedItem.value!.id)
  }
  
  // Reset selection
  selectedItem.value = null
}

// Load inventory on mount
onMounted(() => {
  inventoryStore.loadInventory()
})
</script>

<style scoped>
.upgrade-page {
  min-height: calc(100vh - 200px);
}
</style>