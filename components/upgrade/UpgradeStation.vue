<!-- components/upgrade/UpgradeStation.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-2">Item Upgrader</h2>
      <p class="text-gray-300">Trade up your items for better ones</p>
    </div>

    <!-- Main Upgrade Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Input Section -->
      <div class="space-y-6">
        <div class="bg-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <span class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
            Select Items to Upgrade
          </h3>
          
          <!-- Selected Items Display -->
          <div class="min-h-32 border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4">
            <div v-if="selectedItems.length > 0" class="grid grid-cols-3 gap-2">
              <div 
                v-for="item in selectedItems" 
                :key="item.id"
                class="relative group"
              >
                <InventoryItemCard 
                  :item="{ id: item.id, item, quantity: 1, locked: false, acquiredFrom: 'case', acquiredAt: new Date() }"
                  compact
                />
                <button
                  @click="removeItem(item.id)"
                  class="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div v-else class="text-center text-gray-400 py-8">
              <div class="text-4xl mb-2">📦</div>
              <p>Drag items here or select from your inventory</p>
            </div>
          </div>

          <!-- Quick Add Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="addRandomItems(1)"
              class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
            >
              Add Random Item
            </button>
            <button
              @click="addRandomItems(3)"
              class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
            >
              Add 3 Random
            </button>
            <button
              @click="clearItems"
              class="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <!-- Input Value Summary -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Input Value:</span>
            <span class="text-xl font-bold text-blue-400">${{ inputValue.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-400">Items Count:</span>
            <span class="text-sm">{{ selectedItems.length }}/10</span>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="space-y-6">
        <div class="bg-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <span class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
            Upgrade Calculation
          </h3>
          
          <div v-if="calculation" class="space-y-4">
            <!-- Target Value -->
            <div class="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <span>Target Value:</span>
              <span class="font-bold text-green-400">${{ calculation.outputValue.toFixed(2) }}</span>
            </div>
            
            <!-- Success Chance -->
            <div class="p-3 bg-gray-600 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span>Success Chance:</span>
                <span 
                  :class="`font-bold ${
                    calculation.successChance >= 70 ? 'text-green-400' :
                    calculation.successChance >= 30 ? 'text-yellow-400' : 'text-red-400'
                  }`"
                >
                  {{ calculation.successChance.toFixed(1) }}%
                </span>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full bg-gray-700 rounded-full h-3">
                <div 
                  :style="{ width: `${calculation.successChance}%` }"
                  :class="`h-3 rounded-full transition-all duration-500 ${
                    calculation.successChance >= 70 ? 'bg-green-400' :
                    calculation.successChance >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                  }`"
                />
              </div>
            </div>
            
            <!-- Expected Value -->
            <div class="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <span>Expected Value:</span>
              <span class="font-bold">${{ calculation.expectedValue.toFixed(2) }}</span>
            </div>
            
            <!-- Risk Assessment -->
            <div class="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <span>Risk Level:</span>
              <span 
                :class="`font-bold px-2 py-1 rounded text-xs ${
                  calculation.risk === 'low' ? 'bg-green-600 text-green-100' :
                  calculation.risk === 'medium' ? 'bg-yellow-600 text-yellow-100' : 'bg-red-600 text-red-100'
                }`"
              >
                {{ calculation.risk.toUpperCase() }}
              </span>
            </div>
          </div>
          
          <div v-else-if="selectedItems.length === 0" class="text-center py-8 text-gray-400">
            <div class="text-4xl mb-2">🔮</div>
            <p>Select items to see upgrade calculation</p>
          </div>
          
          <div v-else class="text-center py-4">
            <LoadingSpinner size="sm" />
            <p class="text-gray-400 mt-2">Calculating...</p>
          </div>
        </div>

        <!-- Upgrade Button -->
        <div class="bg-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <span class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
            Perform Upgrade
          </h3>
          
          <button
            @click="performUpgrade"
            :disabled="!canUpgrade"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 py-4 rounded-lg text-xl font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <LoadingSpinner v-if="isUpgrading" size="sm" class="mr-2" />
            <span v-if="isUpgrading">Upgrading...</span>
            <span v-else-if="selectedItems.length === 0">Select Items First</span>
            <span v-else>Upgrade Items</span>
          </button>
          
          <p v-if="calculation" class="text-xs text-gray-400 text-center mt-2">
            Potential return: ${{ (calculation.outputValue * (calculation.successChance / 100)).toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Upgrades History -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Recent Upgrades</h3>
      
      <div v-if="recentUpgrades.length > 0" class="space-y-3">
        <div 
          v-for="upgrade in recentUpgrades.slice(0, 5)" 
          :key="upgrade.id"
          class="flex items-center justify-between p-4 bg-gray-600 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div :class="`w-3 h-3 rounded-full ${
              upgrade.success ? 'bg-green-400' : 'bg-red-400'
            }`" />
            
            <div>
              <div class="font-semibold">
                {{ upgrade.inputItems.length }} items → {{ upgrade.success ? '1 item' : 'Failed' }}
              </div>
              <div class="text-sm text-gray-400">
                ${{ upgrade.inputValue.toFixed(2) }} → 
                {{ upgrade.success ? `$${upgrade.outputValue?.toFixed(2)}` : '$0.00' }}
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-sm text-gray-400">{{ formatTimeAgo(upgrade.timestamp) }}</div>
            <div :class="`text-sm font-bold ${
              upgrade.success ? 'text-green-400' : 'text-red-400'
            }`">
              {{ upgrade.success ? '+' : '' }}${{ (upgrade.success ? (upgrade.outputValue || 0) - upgrade.inputValue : -upgrade.inputValue).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-400">
        <div class="text-4xl mb-2">📊</div>
        <p>No recent upgrades</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem, UpgradeCalculation } from '~/types'

const upgradeStore = useUpgradeStore()
const inventoryStore = useInventoryStore()

// Reactive data
const { selectedItems, calculation, isUpgrading } = storeToRefs(upgradeStore)

// Mock recent upgrades (in real app this would come from store/API)
const recentUpgrades = ref([
  {
    id: '1',
    inputItems: ['item1', 'item2'],
    inputValue: 45.60,
    outputValue: 78.30,
    success: true,
    timestamp: new Date(Date.now() - 300000) // 5 min ago
  },
  {
    id: '2',
    inputItems: ['item3'],
    inputValue: 23.40,
    outputValue: 0,
    success: false,
    timestamp: new Date(Date.now() - 600000) // 10 min ago
  }
])

// Computed
const inputValue = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

const canUpgrade = computed(() => {
  return !isUpgrading.value && selectedItems.value.length > 0 && calculation.value !== null
})

// Methods
const addRandomItems = (count: number) => {
  // Mock implementation - in real app this would select from user inventory
  const mockItems: CSGOItem[] = [
    {
      id: 'mock1',
      name: 'AK-47 | Redline',
      rarity: 'classified',
      collection: 'Phoenix',
      image: '/dist/img/ak47/redline.png',
      price: 45.60,
      tradable: true,
      marketable: true,
      obtainedAt: new Date()
    },
    {
      id: 'mock2',
      name: 'M4A4 | Howl',
      rarity: 'covert',
      collection: 'Huntsman',
      image: '/dist/img/m4a4/howl.png',
      price: 1240.50,
      tradable: true,
      marketable: true,
      obtainedAt: new Date()
    }
  ]
  
  for (let i = 0; i < count && selectedItems.value.length < 10; i++) {
    const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)]
    upgradeStore.addSelectedItem({ ...randomItem, id: `${randomItem.id}-${Date.now()}-${i}` })
  }
}

const removeItem = (itemId: string) => {
  upgradeStore.removeSelectedItem(itemId)
}

const clearItems = () => {
  upgradeStore.clearSelectedItems()
}

const performUpgrade = async () => {
  if (!canUpgrade.value) return
  
  try {
    const result = await upgradeStore.performUpgrade()
    
    // Add to recent upgrades
    recentUpgrades.value.unshift({
      id: Date.now().toString(),
      inputItems: selectedItems.value.map(item => item.id),
      inputValue: inputValue.value,
      outputValue: result?.outputValue || 0,
      success: result?.success || false,
      timestamp: new Date()
    })
    
    // Keep only last 10 upgrades
    if (recentUpgrades.value.length > 10) {
      recentUpgrades.value = recentUpgrades.value.slice(0, 10)
    }
    
  } catch (error) {
    console.error('Upgrade failed:', error)
  }
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

// Watch for changes in selected items to recalculate
watch(selectedItems, () => {
  if (selectedItems.value.length > 0) {
    upgradeStore.calculateUpgrade()
  }
}, { deep: true })
</script>
