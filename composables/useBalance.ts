export const useBalance = () => {
  // Store reference
  const balanceStore = useBalanceStore()

  // Computed properties
  const balance = computed(() => balanceStore.balance)
  const formattedBalance = computed(() => balanceStore.formattedBalance)
  const currency = computed(() => balanceStore.currency)
  const history = computed(() => balanceStore.history)
  const stats = computed(() => balanceStore.stats)

  // Transaction methods
  const addFunds = async (amount: number, description?: string) => {
    try {
      const transaction = balanceStore.addBalance(amount, 'deposit', description)
      
      // In production, this would make an API call
      if (process.env.NODE_ENV === 'production') {
        await $fetch('/api/balance/add', {
          method: 'POST',
          body: { amount, description }
        })
      }
      
      return transaction
    } catch (error) {
      console.error('Error adding funds:', error)
      throw error
    }
  }

  const withdrawFunds = async (amount: number, description?: string) => {
    try {
      if (!balanceStore.hasEnoughBalance(amount)) {
        throw new Error('Saldo insuficiente')
      }

      const transaction = balanceStore.subtractBalance(amount, 'withdraw', description)
      
      // In production, this would make an API call
      if (process.env.NODE_ENV === 'production') {
        await $fetch('/api/balance/withdraw', {
          method: 'POST',
          body: { amount, description }
        })
      }
      
      return transaction
    } catch (error) {
      console.error('Error withdrawing funds:', error)
      throw error
    }
  }

  const transferFunds = async (amount: number, targetUserId: string, description?: string) => {
    try {
      if (!balanceStore.hasEnoughBalance(amount)) {
        throw new Error('Saldo insuficiente')
      }

      // In production, this would make an API call
      const response = await $fetch('/api/balance/transfer', {
        method: 'POST',
        body: { amount, targetUserId, description }
      })

      // Update local balance
      balanceStore.subtractBalance(amount, 'withdraw', `Transferencia a ${targetUserId}`)
      
      return response
    } catch (error) {
      console.error('Error transferring funds:', error)
      throw error
    }
  }

  // Game transaction methods
  const placeBet = (amount: number, gameType: string, gameId?: string) => {
    if (!balanceStore.hasEnoughBalance(amount)) {
      throw new Error('Saldo insuficiente para apostar')
    }

    return balanceStore.subtractBalance(
      amount, 
      'loss', 
      `Apuesta en ${gameType}${gameId ? ` #${gameId}` : ''}`
    )
  }

  const winBet = (amount: number, gameType: string, gameId?: string) => {
    return balanceStore.addBalance(
      amount, 
      'win', 
      `Victoria en ${gameType}${gameId ? ` #${gameId}` : ''}`
    )
  }

  const upgradeWin = (amount: number, itemName: string) => {
    return balanceStore.addBalance(
      amount, 
      'upgrade_win', 
      `Upgrade exitoso: ${itemName}`
    )
  }

  const upgradeLoss = (amount: number, itemName: string) => {
    return balanceStore.subtractBalance(
      amount, 
      'upgrade_loss', 
      `Upgrade fallido: ${itemName}`
    )
  }

  // Validation methods
  const canAfford = (amount: number) => {
    return balanceStore.hasEnoughBalance(amount)
  }

  const validateAmount = (amount: number) => {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor que 0')
    }
    
    if (amount > 100000) {
      throw new Error('El monto máximo es $100,000')
    }
    
    return true
  }

  // Formatting utilities
  const formatCurrency = (amount: number, includeCurrency = true) => {
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    
    return includeCurrency ? `$${formatted}` : formatted
  }

  const formatTransaction = (transaction: any) => {
    return {
      ...transaction,
      formattedAmount: formatCurrency(Math.abs(transaction.amount)),
      isPositive: transaction.amount > 0,
      displayType: getTransactionDisplayType(transaction.type)
    }
  }

  const getTransactionDisplayType = (type: string) => {
    const typeMap: Record<string, string> = {
      'deposit': 'Depósito',
      'withdraw': 'Retiro',
      'win': 'Victoria',
      'loss': 'Pérdida',
      'upgrade_win': 'Upgrade Exitoso',
      'upgrade_loss': 'Upgrade Fallido'
    }
    
    return typeMap[type] || type
  }

  // Statistics calculations
  const calculateProfitLoss = (days = 30) => {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000)
    const recentTransactions = history.value.filter(t => t.timestamp >= cutoffDate)
    
    return recentTransactions.reduce((total, transaction) => {
      if (transaction.type === 'win' || transaction.type === 'upgrade_win') {
        return total + transaction.amount
      } else if (transaction.type === 'loss' || transaction.type === 'upgrade_loss') {
        return total + transaction.amount // transaction.amount is already negative
      }
      return total
    }, 0)
  }

  const getWinRate = (days = 30) => {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000)
    const gameTransactions = history.value.filter(t => 
      t.timestamp >= cutoffDate && 
      (t.type === 'win' || t.type === 'loss' || t.type === 'upgrade_win' || t.type === 'upgrade_loss')
    )
    
    if (gameTransactions.length === 0) return 0
    
    const wins = gameTransactions.filter(t => 
      t.type === 'win' || t.type === 'upgrade_win'
    ).length
    
    return (wins / gameTransactions.length) * 100
  }

  const getBiggestWin = () => {
    const winTransactions = history.value.filter(t => 
      t.type === 'win' || t.type === 'upgrade_win'
    )
    
    if (winTransactions.length === 0) return 0
    
    return Math.max(...winTransactions.map(t => t.amount))
  }

  const getBiggestLoss = () => {
    const lossTransactions = history.value.filter(t => 
      t.type === 'loss' || t.type === 'upgrade_loss'
    )
    
    if (lossTransactions.length === 0) return 0
    
    return Math.abs(Math.min(...lossTransactions.map(t => t.amount)))
  }

  // Real-time updates (for production)
  const subscribeToBalanceUpdates = () => {
    // This would be implemented with WebSockets or Server-Sent Events
    if (process.client && process.env.NODE_ENV === 'production') {
      // Example WebSocket connection
      // const ws = new WebSocket(`${wsUrl}/balance-updates`)
      // ws.onmessage = (event) => {
      //   const data = JSON.parse(event.data)
      //   balanceStore.setBalance(data.balance)
      // }
    }
  }

  // Automatic save/load
  const initializeBalance = () => {
    balanceStore.loadBalance()
    
    if (process.client) {
      // Auto-save on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          balanceStore.saveBalance()
        }
      })
      
      // Auto-save before page unload
      window.addEventListener('beforeunload', () => {
        balanceStore.saveBalance()
      })
    }
  }

  // Initialize on composable creation
  onMounted(() => {
    initializeBalance()
    subscribeToBalanceUpdates()
  })

  return {
    // State
    balance,
    formattedBalance,
    currency,
    history,
    stats,
    
    // Transaction methods
    addFunds,
    withdrawFunds,
    transferFunds,
    placeBet,
    winBet,
    upgradeWin,
    upgradeLoss,
    
    // Validation
    canAfford,
    validateAmount,
    
    // Formatting
    formatCurrency,
    formatTransaction,
    getTransactionDisplayType,
    
    // Statistics
    calculateProfitLoss,
    getWinRate,
    getBiggestWin,
    getBiggestLoss,
    
    // Utilities
    initializeBalance,
    subscribeToBalanceUpdates
  }
}