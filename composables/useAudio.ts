export const useAudio = () => {
  // Audio context and settings
  const audioContext = ref<AudioContext | null>(null)
  const masterVolume = ref(0.7)
  const musicVolume = ref(0.5)
  const sfxVolume = ref(0.8)
  const isMuted = ref(false)
  const isInitialized = ref(false)

  // Audio elements
  const audioElements = reactive<Record<string, HTMLAudioElement>>({})
  
  // Settings
  const settings = reactive({
    masterVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.8,
    isMuted: false,
    musicEnabled: true,
    sfxEnabled: true
  })

  // Initialize audio context
  const initializeAudio = async () => {
    if (isInitialized.value || !process.client) return

    try {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load settings from localStorage
      loadSettings()
      
      isInitialized.value = true
      console.log('Audio initialized successfully')
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  // Load audio file
  const loadAudio = (key: string, src: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      if (audioElements[key]) {
        resolve(audioElements[key])
        return
      }

      const audio = new Audio()
      audio.preload = 'auto'
      
      audio.addEventListener('canplaythrough', () => {
        audioElements[key] = audio
        updateAudioVolume(audio, 'sfx')
        resolve(audio)
      })
      
      audio.addEventListener('error', () => {
        reject(new Error(`Failed to load audio: ${src}`))
      })

      audio.src = src
      audio.load()
    })
  }

  // Play sound effect
  const playSfx = async (key: string, src?: string) => {
    if (!settings.sfxEnabled || isMuted.value) return

    try {
      let audio: HTMLAudioElement

      if (audioElements[key]) {
        audio = audioElements[key]
      } else if (src) {
        audio = await loadAudio(key, src)
      } else {
        console.warn(`Audio not found: ${key}`)
        return
      }

      // Reset audio to beginning
      audio.currentTime = 0
      
      // Resume audio context if suspended
      if (audioContext.value?.state === 'suspended') {
        await audioContext.value.resume()
      }

      await audio.play()
    } catch (error) {
      console.warn(`Failed to play sound: ${key}`, error)
    }
  }

  // Play background music
  const playMusic = async (key: string, src?: string) => {
    if (!settings.musicEnabled || isMuted.value) return

    try {
      let audio: HTMLAudioElement

      if (audioElements[key]) {
        audio = audioElements[key]
      } else if (src) {
        audio = await loadAudio(key, src)
        audio.loop = true
      } else {
        console.warn(`Music not found: ${key}`)
        return
      }

      updateAudioVolume(audio, 'music')

      // Resume audio context if suspended
      if (audioContext.value?.state === 'suspended') {
        await audioContext.value.resume()
      }

      await audio.play()
    } catch (error) {
      console.warn(`Failed to play music: ${key}`, error)
    }
  }

  // Stop music
  const stopMusic = (key: string) => {
    const audio = audioElements[key]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  // Pause music
  const pauseMusic = (key: string) => {
    const audio = audioElements[key]
    if (audio) {
      audio.pause()
    }
  }

  // Resume music
  const resumeMusic = (key: string) => {
    const audio = audioElements[key]
    if (audio && settings.musicEnabled && !isMuted.value) {
      audio.play().catch(console.warn)
    }
  }

  // Update audio volume
  const updateAudioVolume = (audio: HTMLAudioElement, type: 'music' | 'sfx') => {
    const baseVolume = type === 'music' ? settings.musicVolume : settings.sfxVolume
    const effectiveVolume = isMuted.value ? 0 : settings.masterVolume * baseVolume
    audio.volume = Math.max(0, Math.min(1, effectiveVolume))
  }

  // Update all audio volumes
  const updateAllVolumes = () => {
    Object.entries(audioElements).forEach(([key, audio]) => {
      const type = audio.loop ? 'music' : 'sfx'
      updateAudioVolume(audio, type)
    })
  }

  // Synthesized beep (fallback when no audio files available)
  const playBeep = (frequency = 800, duration = 200, volume = 0.1) => {
    if (!audioContext.value || isMuted.value || !settings.sfxEnabled) return

    try {
      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.value.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime)
      oscillator.type = 'sine'

      const effectiveVolume = settings.masterVolume * settings.sfxVolume * volume
      gainNode.gain.setValueAtTime(effectiveVolume, audioContext.value.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + duration / 1000)

      oscillator.start(audioContext.value.currentTime)
      oscillator.stop(audioContext.value.currentTime + duration / 1000)
    } catch (error) {
      console.warn('Failed to play synthesized beep:', error)
    }
  }

  // Convenience methods for common sounds
  const playWinSound = () => playSfx('win', '/audio/win.mp3')
  const playLoseSound = () => playSfx('lose', '/audio/lose.mp3')
  const playClickSound = () => playSfx('click', '/audio/click.mp3')
  const playHoverSound = () => playSfx('hover', '/audio/hover.mp3')
  const playUpgradeSpinSound = () => playSfx('upgrade-spin', '/audio/upgrade-spin.mp3')
  const playNotificationSound = () => playSfx('notification', '/audio/notification.mp3')

  // Background music controls
  const playBackgroundMusic = () => playMusic('background', '/audio/background-music.mp3')
  const stopBackgroundMusic = () => stopMusic('background')
  const pauseBackgroundMusic = () => pauseMusic('background')
  const resumeBackgroundMusic = () => resumeMusic('background')

  // Settings management
  const setMasterVolume = (volume: number) => {
    settings.masterVolume = Math.max(0, Math.min(1, volume))
    masterVolume.value = settings.masterVolume
    updateAllVolumes()
    saveSettings()
  }

  const setMusicVolume = (volume: number) => {
    settings.musicVolume = Math.max(0, Math.min(1, volume))
    musicVolume.value = settings.musicVolume
    updateAllVolumes()
    saveSettings()
  }

  const setSfxVolume = (volume: number) => {
    settings.sfxVolume = Math.max(0, Math.min(1, volume))
    sfxVolume.value = settings.sfxVolume
    updateAllVolumes()
    saveSettings()
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    settings.isMuted = isMuted.value
    updateAllVolumes()
    saveSettings()
  }

  const toggleMusic = () => {
    settings.musicEnabled = !settings.musicEnabled
    
    if (settings.musicEnabled) {
      resumeBackgroundMusic()
    } else {
      pauseBackgroundMusic()
    }
    
    saveSettings()
  }

  const toggleSfx = () => {
    settings.sfxEnabled = !settings.sfxEnabled
    saveSettings()
  }

  // Persistence
  const saveSettings = () => {
    if (process.client) {
      localStorage.setItem('csgo-upgrade-audio-settings', JSON.stringify(settings))
    }
  }

  const loadSettings = () => {
    if (process.client) {
      const saved = localStorage.getItem('csgo-upgrade-audio-settings')
      if (saved) {
        try {
          const savedSettings = JSON.parse(saved)
          Object.assign(settings, savedSettings)
          
          // Update reactive refs
          masterVolume.value = settings.masterVolume
          musicVolume.value = settings.musicVolume
          sfxVolume.value = settings.sfxVolume
          isMuted.value = settings.isMuted
        } catch (error) {
          console.error('Failed to load audio settings:', error)
        }
      }
    }
  }

  // Auto-initialization on user interaction
  const handleUserInteraction = () => {
    if (!isInitialized.value) {
      initializeAudio()
    }
  }

  // Setup global listeners
  onMounted(() => {
    if (process.client) {
      // Initialize on first user interaction
      const events = ['click', 'keydown', 'touchstart']
      const initOnce = () => {
        handleUserInteraction()
        events.forEach(event => {
          document.removeEventListener(event, initOnce)
        })
      }
      
      events.forEach(event => {
        document.addEventListener(event, initOnce, { once: true })
      })
    }
  })

  // Cleanup
  onUnmounted(() => {
    if (audioContext.value) {
      audioContext.value.close()
    }
    
    Object.values(audioElements).forEach(audio => {
      audio.pause()
      audio.src = ''
    })
  })

  return {
    // State
    isInitialized: readonly(isInitialized),
    masterVolume: readonly(masterVolume),
    musicVolume: readonly(musicVolume),
    sfxVolume: readonly(sfxVolume),
    isMuted: readonly(isMuted),
    settings: readonly(settings),

    // Core methods
    initializeAudio,
    playSfx,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    playBeep,

    // Convenience methods
    playWinSound,
    playLoseSound,
    playClickSound,
    playHoverSound,
    playUpgradeSpinSound,
    playNotificationSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,

    // Settings
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
    toggleMusic,
    toggleSfx,

    // Utilities
    loadAudio,
    updateAllVolumes,
    saveSettings,
    loadSettings
  }
}