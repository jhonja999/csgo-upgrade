<template>
  <div class="audio-player">
    <!-- Audio Controls (when visible) -->
    <div 
      v-if="showControls"
      class="fixed bottom-20 right-4 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg z-30"
    >
      <div class="flex items-center gap-3">
        <h4 class="text-white font-semibold text-sm">Audio</h4>
        
        <!-- Master Volume -->
        <div class="flex items-center gap-2">
          <button
            @click="toggleMute"
            class="text-gray-400 hover:text-white transition-colors"
          >
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
          
          <input
            v-model="masterVolume"
            type="range"
            min="0"
            max="100"
            class="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            @input="updateMasterVolume"
          >
          
          <span class="text-xs text-gray-400 w-8">{{ masterVolume }}%</span>
        </div>
        
        <!-- Music Control -->
        <div class="flex items-center gap-2">
          <button
            @click="toggleMusic"
            class="text-gray-400 hover:text-white transition-colors text-sm"
            :class="{ 'text-green-400': isMusicPlaying }"
          >
            {{ isMusicPlaying ? '⏸️' : '▶️' }}
          </button>
          
          <span class="text-xs text-gray-400">Música</span>
        </div>
        
        <!-- Close Controls -->
        <button
          @click="hideControls"
          class="text-gray-400 hover:text-white transition-colors text-sm ml-2"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Audio Toggle Button (when controls hidden) -->
    <button
      v-else
      @click="showAudioControls"
      class="fixed bottom-20 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-30"
      :class="{ 'animate-pulse': hasAudioActivity }"
    >
      {{ isMuted ? '🔇' : '🎵' }}
    </button>

    <!-- Invisible Audio Elements -->
    <audio ref="backgroundMusic" loop preload="auto">
      <source src="/audio/background-music.mp3" type="audio/mpeg">
    </audio>
    
    <audio ref="winSound" preload="auto">
      <source src="/audio/win.mp3" type="audio/mpeg">
    </audio>
    
    <audio ref="loseSound" preload="auto">
      <source src="/audio/lose.mp3" type="audio/mpeg">
    </audio>
    
    <audio ref="upgradeSpinSound" preload="auto">
      <source src="/audio/upgrade-spin.mp3" type="audio/mpeg">
    </audio>
    
    <audio ref="clickSound" preload="auto">
      <source src="/audio/click.mp3" type="audio/mpeg">
    </audio>
    
    <audio ref="hoverSound" preload="auto">
      <source src="/audio/hover.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup lang="ts">
interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  isMuted: boolean
  musicEnabled: boolean
  sfxEnabled: boolean
}

// State
const showControls = ref(false)
const masterVolume = ref(70)
const isMuted = ref(false)
const isMusicPlaying = ref(false)
const hasAudioActivity = ref(false)

// Audio refs
const backgroundMusic = ref<HTMLAudioElement>()
const winSound = ref<HTMLAudioElement>()
const loseSound = ref<HTMLAudioElement>()
const upgradeSpinSound = ref<HTMLAudioElement>()
const clickSound = ref<HTMLAudioElement>()
const hoverSound = ref<HTMLAudioElement>()

// Settings
const settings = reactive<AudioSettings>({
  masterVolume: 70,
  musicVolume: 50,
  sfxVolume: 80,
  isMuted: false,
  musicEnabled: true,
  sfxEnabled: true
})

// Audio context for better control
let audioContext: AudioContext | null = null
let gainNode: GainNode | null = null

// Methods
const initializeAudio = async () => {
  try {
    // Create audio context
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    gainNode = audioContext.createGain()
    gainNode.connect(audioContext.destination)
    
    // Load settings from localStorage
    loadSettings()
    
    // Set initial volumes
    updateAllVolumes()
    
  } catch (error) {
    console.warn('Could not initialize audio:', error)
  }
}

const showAudioControls = () => {
  showControls.value = true
}

const hideControls = () => {
  showControls.value = false
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  settings.isMuted = isMuted.value
  updateAllVolumes()
  saveSettings()
}

const toggleMusic = () => {
  if (!backgroundMusic.value) return
  
  if (isMusicPlaying.value) {
    pauseMusic()
  } else {
    playMusic()
  }
}

const playMusic = async () => {
  if (!backgroundMusic.value || !settings.musicEnabled) return
  
  try {
    // Resume audio context if suspended
    if (audioContext?.state === 'suspended') {
      await audioContext.resume()
    }
    
    await backgroundMusic.value.play()
    isMusicPlaying.value = true
  } catch (error) {
    console.warn('Could not play background music:', error)
  }
}

const pauseMusic = () => {
  if (!backgroundMusic.value) return
  
  backgroundMusic.value.pause()
  isMusicPlaying.value = false
}

const updateMasterVolume = () => {
  settings.masterVolume = masterVolume.value
  updateAllVolumes()
  saveSettings()
}

const updateAllVolumes = () => {
  const effectiveVolume = isMuted.value ? 0 : masterVolume.value / 100
  
  // Update background music
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = effectiveVolume * (settings.musicVolume / 100)
  }
  
  // Update SFX volumes
  const sfxVolume = effectiveVolume * (settings.sfxVolume / 100)
  
  if (winSound.value) winSound.value.volume = sfxVolume
  if (loseSound.value) loseSound.value.volume = sfxVolume
  if (upgradeSpinSound.value) upgradeSpinSound.value.volume = sfxVolume
  if (clickSound.value) clickSound.value.volume = sfxVolume * 0.5 // Quieter for UI sounds
  if (hoverSound.value) hoverSound.value.volume = sfxVolume * 0.3
}

// Sound effect methods
const playWinSound = () => {
  if (settings.sfxEnabled && winSound.value) {
    playSound(winSound.value)
  }
}

const playLoseSound = () => {
  if (settings.sfxEnabled && loseSound.value) {
    playSound(loseSound.value)
  }
}

const playUpgradeSpinSound = () => {
  if (settings.sfxEnabled && upgradeSpinSound.value) {
    playSound(upgradeSpinSound.value)
  }
}

const playClickSound = () => {
  if (settings.sfxEnabled && clickSound.value) {
    playSound(clickSound.value)
  }
}

const playHoverSound = () => {
  if (settings.sfxEnabled && hoverSound.value) {
    playSound(hoverSound.value)
  }
}

const playSound = async (audioElement: HTMLAudioElement) => {
  try {
    // Reset to beginning if already playing
    audioElement.currentTime = 0
    
    // Resume audio context if needed
    if (audioContext?.state === 'suspended') {
      await audioContext.resume()
    }
    
    await audioElement.play()
    
    // Show activity indicator briefly
    hasAudioActivity.value = true
    setTimeout(() => {
      hasAudioActivity.value = false
    }, 200)
    
  } catch (error) {
    console.warn('Could not play sound:', error)
  }
}

// Synthesized sound effects (fallback)
const playBeep = (frequency = 800, duration = 200, volume = 0.1) => {
  if (!audioContext || isMuted.value) return
  
  try {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = 'sine'
    
    const effectiveVolume = (masterVolume.value / 100) * volume
    gainNode.gain.setValueAtTime(effectiveVolume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
    
    hasAudioActivity.value = true
    setTimeout(() => {
      hasAudioActivity.value = false
    }, duration)
    
  } catch (error) {
    console.warn('Could not play synthesized sound:', error)
  }
}

// Settings persistence
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
        isMuted.value = settings.isMuted
        
      } catch (error) {
        console.warn('Could not load audio settings:', error)
      }
    }
  }
}

// Auto-play background music when user interacts
const startBackgroundMusic = () => {
  if (settings.musicEnabled && !isMusicPlaying.value) {
    playMusic()
  }
}

// Global click listener for UI sounds
const addGlobalListeners = () => {
  if (!process.client) return
  
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    
    // Play click sound for buttons
    if (target.matches('button, .btn, [role="button"]')) {
      playClickSound()
    }
  })
  
  // Add hover listeners for certain elements
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement
    
    // Play hover sound for interactive elements
    if (target.matches('button, .btn, [role="button"], .card-hover')) {
      playHoverSound()
    }
  })
  
  // Listen for user interaction to start audio context
  const startAudio = () => {
    startBackgroundMusic()
    document.removeEventListener('click', startAudio)
    document.removeEventListener('keydown', startAudio)
  }
  
  document.addEventListener('click', startAudio)
  document.addEventListener('keydown', startAudio)
}

// Lifecycle
onMounted(() => {
  initializeAudio()
  addGlobalListeners()
  
  // Auto-hide controls after inactivity
  let hideTimeout: NodeJS.Timeout
  
  watch(showControls, (isShown) => {
    if (isShown) {
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        showControls.value = false
      }, 10000) // Hide after 10 seconds of inactivity
    }
  })
})

onUnmounted(() => {
  if (audioContext) {
    audioContext.close()
  }
})

// Expose methods for external use
defineExpose({
  playWinSound,
  playLoseSound,
  playUpgradeSpinSound,
  playClickSound,
  playHoverSound,
  playBeep,
  playMusic,
  pauseMusic,
  toggleMute,
  updateMasterVolume
})
</script>

<style scoped>
/* Custom range slider styling */
input[type="range"] {
  background: linear-gradient(to right, #f97316, #374151);
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  border: 2px solid #1f2937;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  border: 2px solid #1f2937;
}

/* Audio activity animation */
@keyframes audio-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.audio-activity {
  animation: audio-pulse 0.2s ease-in-out;
}
</style>