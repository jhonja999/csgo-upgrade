import { defineStore } from 'pinia'

interface BalanceState {
  balance: number
  currency: 'USD' | 'EUR' | 'GBP'
  history: BalanceTransaction[]
}

interface BalanceTransaction {
  id: string
  type: 'deposit' | 'withdraw' | 'win' | 'loss' | 'upgrade_win' | 'upgrade_loss'
  amount: number
  timestamp: number
  description: string
  gameId?: string
}

export const useBalanceStore = defineStore('balance', () => {
  // State
  const state = reactive<BalanceState>({
    balance: 1000, // Balance inicial para desarrollo
    currency: 'USD',
    history: []
  })

  // Getters
  const balance = computed(() => state.balance)
  const currency = computed(() => state.currency)
  const history = computed(() => state.history)
  const formattedBalance = computed(() => `$${state.balance.toFixed(2)}`)

  // Actions
  const addBalance = (amount: number, type: BalanceTransaction['type'] = 'deposit', description = '') => {
    const transaction: BalanceTransaction = {
      id: generateId(),
      type,
      amount,
      timestamp: Date.now(),
      description: description || `Balance ${type}`,
    }

    state.balance += amount
    state.history.unshift(transaction)
    
    // Limit history to last 100 transactions
    if (state.history.length > 100) {
      state.history = state.history.slice(0, 100)
    }

    return transaction
  }

  const subtractBalance = (amount: number, type: BalanceTransaction['type'] = 'withdraw', description = '') => {
    if (state.balance < amount) {
      throw new Error('Saldo insuficiente')
    }

    const transaction: BalanceTransaction = {
      id: generateId(),
      type,
      amount: -amount,
      timestamp: Date.now(),
      description: description || `Balance ${type}`,
    }

    state.balance -= amount
    state.history.unshift(transaction)
    
    if (state.history.length > 100) {
      state.history = state.history.slice(0, 100)
    }

    return transaction
  }

  const setBalance = (amount: number) => {
    state.balance = Math.max(0, amount)
  }

  const hasEnoughBalance = (amount: number) => {
    return state.balance >= amount
  }

  const getTransactionsByType = (type: BalanceTransaction['type']) => {
    return state.history.filter(transaction => transaction.type === type)
  }

  const getTotalByType = (type: BalanceTransaction['type']) => {
    return getTransactionsByType(type)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  }

  // Stats
  const stats = computed(() => ({
    totalDeposited: getTotalByType('deposit'),
    totalWithdrawn: getTotalByType('withdraw'),
    totalWon: getTotalByType('win') + getTotalByType('upgrade_win'),
    totalLost: getTotalByType('loss') + getTotalByType('upgrade_loss'),
    netProfit: getTotalByType('win') + getTotalByType('upgrade_win') - getTotalByType('loss') - getTotalByType('upgrade_loss')
  }))

  // Utility function to generate unique IDs
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Load balance from localStorage on client side
  const loadBalance = () => {
    if (process.client) {
      const savedBalance = localStorage.getItem('csgo-upgrade-balance')
      const savedHistory = localStorage.getItem('csgo-upgrade-balance-history')
      
      if (savedBalance) {
        state.balance = parseFloat(savedBalance)
      }
      
      if (savedHistory) {
        try {
          state.history = JSON.parse(savedHistory)
        } catch (error) {
          console.error('Error loading balance history:', error)
        }
      }
    }
  }

  // Save balance to localStorage
  const saveBalance = () => {
    if (process.client) {
      localStorage.setItem('csgo-upgrade-balance', state.balance.toString())
      localStorage.setItem('csgo-upgrade-balance-history', JSON.stringify(state.history))
    }
  }

  // Watch for balance changes to auto-save
  watch(() => state.balance, saveBalance)
  watch(() => state.history, saveBalance, { deep: true })

  return {
    // State
    balance,
    currency,
    history,
    formattedBalance,
    stats,
    
    // Actions
    addBalance,
    subtractBalance,
    setBalance,
    hasEnoughBalance,
    getTransactionsByType,
    getTotalByType,
    loadBalance,
    saveBalance
  }
})