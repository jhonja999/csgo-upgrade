<template>
  <div class="deposit-page">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 gradient-text">
        Depositar Fondos
      </h1>
      <p class="text-gray-300">
        Añade fondos a tu cuenta para comenzar a hacer upgrades
      </p>
    </div>

    <!-- Deposit Methods -->
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Steam Items Deposit -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            💎 Depositar Items de Steam
          </h2>
          <p class="text-gray-400 mb-6">
            Deposita tus skins de CS:GO directamente desde tu inventario de Steam
          </p>
          
          <div class="space-y-4">
            <div class="bg-gray-700 rounded-lg p-4">
              <h3 class="font-semibold mb-2">¿Cómo funciona?</h3>
              <ol class="text-sm text-gray-300 space-y-1">
                <li>1. Conecta tu cuenta de Steam</li>
                <li>2. Selecciona los items que quieres depositar</li>
                <li>3. Confirma el trade offer</li>
                <li>4. Recibe el valor en tu balance</li>
              </ol>
            </div>
            
            <button 
              @click="connectSteam"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔗 Conectar Steam
            </button>
          </div>
        </div>

        <!-- Virtual Currency Deposit -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            💰 Depositar Fondos Virtuales
          </h2>
          <p class="text-gray-400 mb-6">
            Para fines de demostración, puedes añadir fondos virtuales
          </p>
          
          <div class="space-y-4">
            <!-- Quick amounts -->
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="amount in quickAmounts"
                :key="amount"
                @click="selectAmount(amount)"
                class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                :class="{ 'bg-orange-500 hover:bg-orange-600': selectedAmount === amount }"
              >
                ${{ amount }}
              </button>
            </div>
            
            <!-- Custom amount -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Cantidad personalizada
              </label>
              <input
                v-model.number="customAmount"
                type="number"
                min="1"
                max="10000"
                placeholder="Ingresa cantidad..."
                class="input w-full"
                @input="selectedAmount = customAmount"
              >
            </div>
            
            <!-- Total -->
            <div class="bg-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <span>Total a depositar:</span>
                <span class="text-2xl font-bold text-green-400">
                  ${{ (selectedAmount || 0).toFixed(2) }}
                </span>
              </div>
            </div>
            
            <button 
              @click="depositVirtualFunds"
              :disabled="!selectedAmount || selectedAmount <= 0 || isProcessing"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {{ isProcessing ? 'Procesando...' : '💸 Depositar Fondos' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Deposits -->
      <div class="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-xl font-bold mb-4">Depósitos Recientes</h3>
        
        <div v-if="recentDeposits.length === 0" class="text-center py-8 text-gray-400">
          No tienes depósitos recientes
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="deposit in recentDeposits"
            :key="deposit.id"
            class="flex items-center justify-between bg-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <p class="font-medium text-white">{{ deposit.method }}</p>
                <p class="text-sm text-gray-400">{{ formatDate(deposit.timestamp) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-400">+${{ deposit.amount.toFixed(2) }}</p>
              <p class="text-xs text-gray-400">{{ deposit.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'CSGO Upgrade - Depositar',
  meta: [
    { name: 'description', content: 'Deposita fondos y items para empezar a hacer upgrades' }
  ]
})

// Stores
const balanceStore = useBalanceStore()

// State
const selectedAmount = ref<number>(0)
const customAmount = ref<number>(0)
const isProcessing = ref(false)
const quickAmounts = [10, 25, 50, 100, 250, 500]

const recentDeposits = ref([
  {
    id: '1',
    method: 'Fondos Virtuales',
    amount: 100,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    status: 'Completado'
  }
])

// Methods
const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = amount
}

const depositVirtualFunds = async () => {
  if (!selectedAmount.value || selectedAmount.value <= 0) return
  
  isProcessing.value = true
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add funds to balance
    await balanceStore.addBalance(
      selectedAmount.value, 
      'deposit', 
      `Depósito virtual de $${selectedAmount.value}`
    )
    
    // Add to recent deposits
    recentDeposits.value.unshift({
      id: Date.now().toString(),
      method: 'Fondos Virtuales',
      amount: selectedAmount.value,
      timestamp: Date.now(),
      status: 'Completado'
    })
    
    // Reset form
    selectedAmount.value = 0
    customAmount.value = 0
    
    // Show success message
    alert(`¡Depósito exitoso! Se han añadido $${selectedAmount.value} a tu balance.`)
    
  } catch (error) {
    console.error('Error depositing funds:', error)
    alert('Error al procesar el depósito')
  } finally {
    isProcessing.value = false
  }
}

const connectSteam = () => {
  // In a real implementation, this would redirect to Steam OAuth
  alert('Funcionalidad de Steam próximamente disponible')
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('es-ES')
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>