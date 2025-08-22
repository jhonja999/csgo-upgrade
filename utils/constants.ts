// Application constants

// API Configuration
export const API_CONFIG = {
  CSGOFLOAT_BASE_URL: 'https://csgofloat.com/api/v1',
  CACHE_DURATION: {
    ITEMS: 5 * 60 * 1000, // 5 minutes
    PRICES: 10 * 60 * 1000, // 10 minutes
    USER_DATA: 1 * 60 * 1000 // 1 minute
  },
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10
  }
}

// Game Configuration
export const GAME_CONFIG = {
  UPGRADE: {
    MIN_MULTIPLIER: 1.1,
    MAX_MULTIPLIER: 100,
    HOUSE_EDGE: 0.05, // 5%
    MAX_PROBABILITY: 0.95, // 95%
    MIN_ITEM_VALUE: 0.10,
    MAX_ITEM_VALUE: 50000
  },
  ROULETTE: {
    HOUSE_EDGE: 0.027, // 2.7% (1/37)
    MAX_BET: 10000,
    MIN_BET: 0.10,
    PAYOUTS: {
      SINGLE_NUMBER: 35,
      COLOR: 1,
      EVEN_ODD: 1,
      LOW_HIGH: 1,
      DOZEN: 2,
      COLUMN: 2
    }
  },
  COINFLIP: {
    HOUSE_EDGE: 0.02, // 2%
    MAX_BET: 5000,
    MIN_BET: 0.10,
    PAYOUT_MULTIPLIER: 1.96
  },
  CRASH: {
    HOUSE_EDGE: 0.01, // 1%
    MAX_BET: 10000,
    MIN_BET: 0.10,
    MAX_MULTIPLIER: 1000,
    MIN_MULTIPLIER: 1.0
  },
  CASE_OPENING: {
    CASE_PRICES: {
      'Operation Bravo': 25.99,
      'Chroma 3': 2.49,
      'Gamma 2': 1.99,
      'Spectrum': 1.49,
      'Glove': 4.99
    }
  }
}

// Item Rarity Configuration
export const RARITY_CONFIG = {
  WEIGHTS: {
    consumer: 0.40, // 40%
    industrial: 0.30, // 30%
    milspec: 0.15, // 15%
    restricted: 0.08, // 8%
    classified: 0.04, // 4%
    covert: 0.025, // 2.5%
    contraband: 0.005 // 0.5%
  },
  COLORS: {
    consumer: '#b0c3d9',
    industrial: '#5e98d9',
    milspec: '#4b69ff',
    restricted: '#8847ff',
    classified: '#d32ce6',
    covert: '#eb4b4b',
    contraband: '#e4ae39'
  },
  NAMES: {
    consumer: 'Consumer Grade',
    industrial: 'Industrial Grade',
    milspec: 'Mil-Spec',
    restricted: 'Restricted',
    classified: 'Classified',
    covert: 'Covert',
    contraband: 'Contraband'
  },
  PRICE_RANGES: {
    consumer: [0.1, 5],
    industrial: [2, 20],
    milspec: [10, 100],
    restricted: [50, 500],
    classified: [200, 2000],
    covert: [1000, 10000],
    contraband: [5000, 50000]
  }
}

// UI Configuration
export const UI_CONFIG = {
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  ANIMATION_DURATIONS: {
    fast: 150,
    normal: 300,
    slow: 500,
    upgrade: 3000,
    case_opening: 4000
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 24,
    MAX_PAGE_SIZE: 100
  },
  NOTIFICATIONS: {
    DURATION: 5000,
    MAX_VISIBLE: 3
  }
}

// Audio Configuration
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: {
    master: 0.7,
    music: 0.5,
    sfx: 0.8
  },
  SOUND_FILES: {
    win: '/audio/win.mp3',
    lose: '/audio/lose.mp3',
    click: '/audio/click.mp3',
    hover: '/audio/hover.mp3',
    upgrade_spin: '/audio/upgrade-spin.mp3',
    case_open: '/audio/case-open.mp3',
    background_music: '/audio/background-music.mp3',
    notification: '/audio/notification.mp3'
  },
  FORMATS: ['mp3', 'ogg', 'wav']
}

// User Configuration
export const USER_CONFIG = {
  DEFAULT_BALANCE: 1000,
  MAX_BALANCE: 1000000,
  MIN_WITHDRAWAL: 5.00,
  MAX_WITHDRAWAL: 50000,
  TRANSACTION_LIMITS: {
    daily_deposit: 10000,
    daily_withdrawal: 5000,
    monthly_deposit: 50000,
    monthly_withdrawal: 25000
  }
}

// Security Configuration
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  }
}

// Validation Patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  steamId: /^\d{17}$/,
  tradeUrl: /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/
}

// Error Messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Saldo insuficiente',
  INVALID_ITEM: 'Item inválido o no encontrado',
  INVALID_MULTIPLIER: 'Multiplicador inválido',
  ITEM_NOT_OWNED: 'No posees este item',
  UPGRADE_FAILED: 'El upgrade falló',
  NETWORK_ERROR: 'Error de conexión',
  VALIDATION_ERROR: 'Error de validación',
  UNAUTHORIZED: 'No autorizado',
  RATE_LIMITED: 'Demasiadas solicitudes',
  MAINTENANCE_MODE: 'Sitio en mantenimiento'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  UPGRADE_SUCCESS: '¡Upgrade exitoso!',
  ITEM_ADDED: 'Item agregado al inventario',
  ITEM_REMOVED: 'Item removido del inventario',
  BALANCE_UPDATED: 'Balance actualizado',
  SETTINGS_SAVED: 'Configuración guardada',
  TRANSACTION_COMPLETE: 'Transacción completada'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'csgo-upgrade-preferences',
  AUDIO_SETTINGS: 'csgo-upgrade-audio-settings',
  BALANCE: 'csgo-upgrade-balance',
  BALANCE_HISTORY: 'csgo-upgrade-balance-history',
  INVENTORY: 'csgo-upgrade-inventory',
  UPGRADE_HISTORY: 'csgo-upgrade-upgrade-history',
  GAME_HISTORY: 'csgo-upgrade-game-history',
  THEME: 'csgo-upgrade-theme',
  LANGUAGE: 'csgo-upgrade-language'
}

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  }
}

// Feature Flags
export const FEATURE_FLAGS = {
  UPGRADE_SYSTEM: true,
  CASE_OPENING: false,
  ROULETTE: false,
  COINFLIP: false,
  CRASH_GAME: false,
  TRADING: false,
  ACHIEVEMENTS: false,
  LEADERBOARDS: false,
  CHAT_SYSTEM: true,
  NOTIFICATIONS: true,
  SOUND_EFFECTS: true,
  ANIMATIONS: true,
  DARK_MODE: true
}

// Development Configuration
export const DEV_CONFIG = {
  MOCK_DATA: true,
  API_DELAY: 1000, // Simulated API delay in ms
  CONSOLE_LOGS: true,
  ERROR_OVERLAY: true
}

// External URLs
export const EXTERNAL_URLS = {
  STEAM_API: 'https://api.steampowered.com',
  CSGOFLOAT_API: 'https://csgofloat.com/api/v1',
  STEAM_COMMUNITY: 'https://steamcommunity.com',
  CSGO_STASH: 'https://csgostash.com',
  SUPPORT_EMAIL: 'support@csgo-upgrade.com',
  DISCORD: 'https://discord.gg/csgo-upgrade',
  TWITTER: 'https://twitter.com/csgoupgrade'
}

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'CSGO Upgrade - Mejora tus skins de Counter-Strike',
  DEFAULT_DESCRIPTION: 'Plataforma confiable para hacer upgrade de tus skins de CS:GO. Probabilidades justas, pagos instantáneos y soporte 24/7.',
  DEFAULT_KEYWORDS: 'csgo, upgrade, skins, counter-strike, trading, gambling',
  DEFAULT_IMAGE: '/og-image.jpg',
  SITE_NAME: 'CSGO Upgrade',
  LOCALE: 'es_ES'
}