<template>
  <div class="balance-widget bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-yellow-400 text-lg">💰</span>
        <span class="text-gray-300 text-sm">Balance</span>
      </div>
      <div class="text-right">
        <div class="text-white font-bold text-lg">
          ${{ formattedBalance }}
        </div>
        <div v-if="showChange" class="text-xs transition-all duration-300" :class="changeClass">
          {{ changeText }}
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="flex space-x-2 mt-3">
      <button 
        @click="$emit('deposit')"
        class="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded transition-colors"
      >
        Depositar
      </button>
      <button 
        @click="$emit('withdraw')"
        class="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded transition-colors"
        :disabled="balance <= 0"
      >
        Retirar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showQuickActions?: boolean
}

// Props
const props = withDefaults(defineProps<Props>(), {
  showQuickActions: true
})

// Emits
const emit = defineEmits<{
  deposit: []
  withdraw: []
}>()

// Store
const balanceStore = useBalanceStore()

// State
const previousBalance = ref(0)
const showChange = ref(false)

// Computed
const balance = computed(() => balanceStore.balance)

const formattedBalance = computed(() => {
  return balance.value.toFixed(2)
})

const balanceChange = computed(() => {
  return balance.value - previousBalance.value
})

const changeClass = computed(() => {
  if (balanceChange.value > 0) return 'text-green-400'
  if (balanceChange.value < 0) return 'text-red-400'
  return 'text-gray-400'
})

const changeText = computed(() => {
  const change = balanceChange.value
  if (change > 0) return `+$${change.toFixed(2)}`
  if (change < 0) return `$${change.toFixed(2)}`
  return ''
})

// Watch for balance changes
watch(balance, (newBalance, oldBalance) => {
  if (oldBalance !== undefined && oldBalance !== newBalance) {
    previousBalance.value = oldBalance
    showChange.value = true
    
    // Hide change indicator after 3 seconds
    setTimeout(() => {
      showChange.value = false
    }, 3000)
  }
})

// Initialize previous balance
onMounted(() => {
  previousBalance.value = balance.value
})
</script>

<style scoped>
.balance-widget {
  min-width: 180px;
}

button:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>