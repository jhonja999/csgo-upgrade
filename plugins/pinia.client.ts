import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // Plugin to initialize Pinia stores and setup client-side functionality
  
  // This plugin runs only on the client side
  if (process.client) {
    // Initialize stores that need client-side data
    const balanceStore = useBalanceStore()
    const inventoryStore = useInventoryStore()
    const upgradeStore = useUpgradeStore()
    
    // Load persisted data from localStorage
    balanceStore.loadBalance()
    inventoryStore.loadFromLocalStorage()
    upgradeStore.loadHistory()
    
    // Setup auto-save functionality
    const setupAutoSave = () => {
      // Save data when the page is about to unload
      window.addEventListener('beforeunload', () => {
        balanceStore.saveBalance()
        inventoryStore.saveToLocalStorage()
        upgradeStore.saveHistory()
      })
      
      // Save data when the page becomes hidden (user switches tabs, etc.)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          balanceStore.saveBalance()
          inventoryStore.saveToLocalStorage()
          upgradeStore.saveHistory()
        }
      })
      
      // Periodic auto-save every 30 seconds
      setInterval(() => {
        balanceStore.saveBalance()
        inventoryStore.saveToLocalStorage()
        upgradeStore.saveHistory()
      }, 30000)
    }
    
    // Initialize auto-save
    setupAutoSave()
    
    // Setup error handling for stores
    const setupErrorHandling = () => {
      // Global error handler for store operations
      window.addEventListener('error', (event) => {
        console.error('Global error in store operation:', event.error)
        
        // You could send error reports to a service here
        // sendErrorReport(event.error)
      })
      
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection in store:', event.reason)
        
        // Prevent the error from being logged to console
        event.preventDefault()
      })
    }
    
    setupErrorHandling()
    
    // Development helpers
    if (process.env.NODE_ENV === 'development') {
      // Make stores available in console for debugging
      window.__CSGO_STORES__ = {
        balance: balanceStore,
        inventory: inventoryStore,
        upgrade: upgradeStore
      }
      
      console.log('🎮 CSGO Upgrade stores initialized and available at window.__CSGO_STORES__')
    }
  }
})