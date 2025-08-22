// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const preferences = ref<UserPreferences>({
    theme: 'dark',
    soundEnabled: true,
    animationsEnabled: true,
    language: 'en',
    autoSaveEnabled: true,
    notificationsEnabled: true
  })
  
  const profile = ref<UserProfile>({
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalPlayed: 0,
    achievement: [],
    badges: [],
    favoriteGame: null
  })

  const statistics = ref<UserStatistics>({
    gamesPlayed: 0,
    totalWagered: 0,
    totalWon: 0,
    biggestWin: 0,
    winRate: 0,
    profitLoss: 0,
    timeSpent: 0,
    lastLoginAt: new Date(),
    accountCreatedAt: new Date()
  })

  const sessions = ref<UserSession[]>([])

  // Getters
  const getUserInfo = computed(() => user.value)
  const getUserLevel = computed(() => profile.value.level)
  const getUserExperience = computed(() => profile.value.experience)
  const getExperienceProgress = computed(() => 
    profile.value.experienceToNext > 0 
      ? (profile.value.experience / profile.value.experienceToNext) * 100 
      : 100
  )
  
  const getUserStats = computed(() => statistics.value)
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)
  
  const getAchievements = computed(() => 
    profile.value.achievement.filter(a => a.unlocked).sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
  )

  const getAvailableAchievements = computed(() => 
    profile.value.achievement.filter(a => !a.unlocked)
  )

  // Actions
  const setUser = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    
    try {
      // Mock login implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: 'user_' + Date.now(),
        username: credentials.username,
        email: credentials.email || `${credentials.username}@example.com`,
        avatar: '/dist/img/avatars/default.png',
        steamId: null,
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        verified: true
      }
      
      setUser(mockUser)
      
      // Create login session
      const session: UserSession = {
        id: Date.now().toString(),
        userId: mockUser.id,
        startedAt: new Date(),
        endedAt: null,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent
      }
      sessions.value.push(session)
      
      // Update last login
      statistics.value.lastLoginAt = new Date()
      
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed' }
    } finally {
      isLoading.value = false
    }
  }

  const loginWithSteam = async () => {
    isLoading.value = true
    
    try {
      // Mock Steam login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: 'steam_' + Date.now(),
        username: 'SteamUser',
        email: 'steamuser@steam.com',
        avatar: '/dist/img/avatars/steam.png',
        steamId: '76561198000000000',
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        verified: true
      }
      
      setUser(mockUser)
      statistics.value.lastLoginAt = new Date()
      
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Steam login failed:', error)
      return { success: false, error: 'Steam login failed' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    // End current session
    const currentSession = sessions.value.find(s => s.endedAt === null)
    if (currentSession) {
      currentSession.endedAt = new Date()
    }
    
    user.value = null
    isAuthenticated.value = false
    
    // Clear sensitive data but keep preferences
    saveUserData()
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...updates }
    saveUserData()
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    preferences.value = { ...preferences.value, ...updates }
    saveUserData()
  }

  const updateStatistics = (updates: Partial<UserStatistics>) => {
    statistics.value = { ...statistics.value, ...updates }
    saveUserData()
  }

  const addExperience = (amount: number, reason?: string) => {
    profile.value.experience += amount
    
    // Check for level up
    while (profile.value.experience >= profile.value.experienceToNext) {
      profile.value.experience -= profile.value.experienceToNext
      profile.value.level++
      profile.value.experienceToNext = Math.floor(100 * Math.pow(1.5, profile.value.level - 1))
      
      // Trigger level up achievement
      unlockAchievement(`level_${profile.value.level}`)
    }
    
    saveUserData()
  }

  const unlockAchievement = (achievementId: string) => {
    const achievement = profile.value.achievement.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date()
      
      // Add experience reward
      addExperience(achievement.experienceReward || 50)
      
      saveUserData()
      return true
    }
    return false
  }

  const checkAchievements = () => {
    // Check various achievement conditions
    const stats = statistics.value
    const achievements = [
      { id: 'first_game', condition: () => stats.gamesPlayed >= 1 },
      { id: 'games_10', condition: () => stats.gamesPlayed >= 10 },
      { id: 'games_100', condition: () => stats.gamesPlayed >= 100 },
      { id: 'games_1000', condition: () => stats.gamesPlayed >= 1000 },
      { id: 'wagered_100', condition: () => stats.totalWagered >= 100 },
      { id: 'wagered_1000', condition: () => stats.totalWagered >= 1000 },
      { id: 'big_win_100', condition: () => stats.biggestWin >= 100 },
      { id: 'big_win_1000', condition: () => stats.biggestWin >= 1000 },
      { id: 'profitable', condition: () => stats.profitLoss > 0 },
      { id: 'high_roller', condition: () => stats.totalWagered >= 10000 }
    ]
    
    achievements.forEach(({ id, condition }) => {
      if (condition()) {
        unlockAchievement(id)
      }
    })
  }

  const resetProgress = () => {
    profile.value = {
      level: 1,
      experience: 0,
      experienceToNext: 100,
      totalPlayed: 0,
      achievement: initializeAchievements(),
      badges: [],
      favoriteGame: null
    }
    
    statistics.value = {
      gamesPlayed: 0,
      totalWagered: 0,
      totalWon: 0,
      biggestWin: 0,
      winRate: 0,
      profitLoss: 0,
      timeSpent: 0,
      lastLoginAt: new Date(),
      accountCreatedAt: statistics.value.accountCreatedAt
    }
    
    saveUserData()
  }

  const loadUserData = () => {
    try {
      const saved = localStorage.getItem('csgo-upgrade-user')
      if (saved) {
        const data = JSON.parse(saved)
        
        if (data.user) {
          user.value = {
            ...data.user,
            joinedAt: new Date(data.user.joinedAt),
            lastActiveAt: new Date(data.user.lastActiveAt)
          }
          isAuthenticated.value = true
        }
        
        if (data.preferences) {
          preferences.value = { ...preferences.value, ...data.preferences }
        }
        
        if (data.profile) {
          profile.value = {
            ...profile.value,
            ...data.profile,
            achievement: (data.profile.achievement || []).map((a: any) => ({
              ...a,
              unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : null
            }))
          }
        }
        
        if (data.statistics) {
          statistics.value = {
            ...statistics.value,
            ...data.statistics,
            lastLoginAt: new Date(data.statistics.lastLoginAt),
            accountCreatedAt: new Date(data.statistics.accountCreatedAt)
          }
        }
        
        if (data.sessions) {
          sessions.value = data.sessions.map((s: any) => ({
            ...s,
            startedAt: new Date(s.startedAt),
            endedAt: s.endedAt ? new Date(s.endedAt) : null
          }))
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const saveUserData = () => {
    try {
      const data = {
        user: user.value,
        preferences: preferences.value,
        profile: profile.value,
        statistics: statistics.value,
        sessions: sessions.value
      }
      localStorage.setItem('csgo-upgrade-user', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  }

  const initializeAchievements = (): Achievement[] => {
    return [
      {
        id: 'first_game',
        name: 'First Steps',
        description: 'Play your first game',
        icon: '🎮',
        unlocked: false,
        experienceReward: 25
      },
      {
        id: 'games_10',
        name: 'Getting Started',
        description: 'Play 10 games',
        icon: '🎯',
        unlocked: false,
        experienceReward: 50
      },
      {
        id: 'big_win_100',
        name: 'Big Winner',
        description: 'Win $100 in a single game',
        icon: '💰',
        unlocked: false,
        experienceReward: 100
      }
    ]
  }

  // Initialize achievements if not present
  if (profile.value.achievement.length === 0) {
    profile.value.achievement = initializeAchievements()
  }

  // Auto-save when data changes
  watch([user, preferences, profile, statistics], () => {
    if (user.value) {
      saveUserData()
    }
  }, { deep: true })

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    preferences: readonly(preferences),
    profile: readonly(profile),
    statistics: readonly(statistics),
    
    // Getters
    getUserInfo,
    getUserLevel,
    getUserExperience,
    getExperienceProgress,
    getUserStats,
    isLoggedIn,
    getAchievements,
    getAvailableAchievements,
    
    // Actions
    setUser,
    login,
    loginWithSteam,
    logout,
    updateProfile,
    updatePreferences,
    updateStatistics,
    addExperience,
    unlockAchievement,
    checkAchievements,
    resetProgress,
    loadUserData,
    saveUserData
  }
})

// Types
interface User {
  id: string
  username: string
  email: string
  avatar: string
  steamId: string | null
  joinedAt: Date
  lastActiveAt: Date
  verified: boolean
}

interface UserPreferences {
  theme: 'light' | 'dark'
  soundEnabled: boolean
  animationsEnabled: boolean
  language: string
  autoSaveEnabled: boolean
  notificationsEnabled: boolean
}

interface UserProfile {
  level: number
  experience: number
  experienceToNext: number
  totalPlayed: number
  achievement: Achievement[]
  badges: Badge[]
  favoriteGame: string | null
}

interface UserStatistics {
  gamesPlayed: number
  totalWagered: number
  totalWon: number
  biggestWin: number
  winRate: number
  profitLoss: number
  timeSpent: number
  lastLoginAt: Date
  accountCreatedAt: Date
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  experienceReward?: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

interface UserSession {
  id: string
  userId: string
  startedAt: Date
  endedAt: Date | null
  ipAddress: string
  userAgent: string
}

interface LoginCredentials {
  username: string
  password: string
  email?: string
}
