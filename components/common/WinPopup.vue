<template>
  <!-- Win Popup Overlay -->
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="win-popup-overlay fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <Transition
        name="popup"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-if="currentWin"
          class="win-popup-card pointer-events-auto max-w-md w-full mx-4"
          :class="getPopupClass(currentWin.type)"
        >
          <!-- Header -->
          <div class="text-center mb-4">
            <div class="text-6xl mb-2 animate-bounce">
              {{ getEmoji(currentWin.type) }}
            </div>
            <h2 class="text-2xl font-bold" :class="getTitleClass(currentWin.type)">
              {{ getTitle(currentWin.type) }}
            </h2>
          </div>

          <!-- Win Amount -->
          <div class="text-center mb-6">
            <div class="text-4xl font-bold text-green-400 mb-2">
              +${{ currentWin.amount.toFixed(2) }}
            </div>
            <div v-if="currentWin.multiplier" class="text-lg text-gray-300">
              Multiplicador: {{ currentWin.multiplier }}x
            </div>
          </div>

          <!-- Item Display (if applicable) -->
          <div v-if="currentWin.item" class="flex justify-center mb-6">
            <div class="bg-gray-700 rounded-lg p-4 border-2" :class="`rarity-${currentWin.item.rarity}`">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-800 rounded">
                  <img 
                    :src="currentWin.item.imageUrl" 
                    :alt="currentWin.item.name"
                    class="w-full h-full object-contain"
                  >
                </div>
                <div class="text-left">
                  <p class="font-medium text-white text-sm">{{ currentWin.item.name }}</p>
                  <p class="text-green-400 font-semibold">${{ currentWin.item.price.toFixed(2) }}</p>
                  <p class="text-gray-400 text-xs">{{ getRarityDisplayName(currentWin.item.rarity) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Game-specific info -->
          <div v-if="currentWin.gameInfo" class="text-center mb-6 text-sm text-gray-300">
            {{ currentWin.gameInfo }}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="closePopup"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              v-if="currentWin.showPlayAgain"
              @click="playAgain"
              class="flex-1 btn btn-primary py-2 px-4 rounded-lg"
            >
              Jugar Otra Vez
            </button>
          </div>

          <!-- Auto-close timer -->
          <div v-if="autoCloseTime > 0" class="mt-4 text-center">
            <div class="bg-gray-700 rounded-full h-1 overflow-hidden">
              <div 
                class="bg-orange-500 h-full transition-all duration-1000 ease-linear"
                :style="{ width: `${(autoCloseTime / autoCloseDuration) * 100}%` }"
              ></div>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              Se cerrará automáticamente en {{ Math.ceil(autoCloseTime / 1000) }}s
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Confetti Animation -->
    <div
      v-if="showConfetti"
      class="confetti-container fixed inset-0 z-40 pointer-events-none"
    >
      <div
        v-for="i in confettiCount"
        :key="i"
        class="confetti-piece"
        :style="getConfettiStyle(i)"
      ></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface WinData {
  type: 'upgrade' | 'case' | 'roulette' | 'coinflip' | 'crash' | 'jackpot'
  amount: number
  multiplier?: number
  item?: CSGOItem
  gameInfo?: string
  showPlayAgain?: boolean
}

interface Props {
  autoClose?: boolean
  autoCloseDuration?: number
  soundEnabled?: boolean
}

// Props
const props = withDefaults(defineProps<Props>(), {
  autoClose: true,
  autoCloseDuration: 8000, // 8 seconds
  soundEnabled: true
})

// Emits
const emit = defineEmits<{
  'play-again': []
  'popup-closed': []
}>()

// State
const isVisible = ref(false)
const currentWin = ref<WinData | null>(null)
const autoCloseTime = ref(0)
const showConfetti = ref(false)
const confettiCount = ref(50)

// Timer for auto-close
let autoCloseTimer: NodeJS.Timeout | null = null

// Methods
const showWin = (winData: WinData) => {
  currentWin.value = winData
  isVisible.value = true
  
  // Show confetti for big wins
  if (winData.amount >= 100) {
    showConfetti.value = true
    confettiCount.value = Math.min(100, Math.floor(winData.amount / 10))
    
    setTimeout(() => {
      showConfetti.value = false
    }, 3000)
  }
  
  // Start auto-close timer
  if (props.autoClose) {
    startAutoCloseTimer()
  }
  
  // Play sound
  if (props.soundEnabled) {
    playWinSound(winData.type, winData.amount)
  }
}

const closePopup = () => {
  isVisible.value = false
  currentWin.value = null
  autoCloseTime.value = 0
  showConfetti.value = false
  
  if (autoCloseTimer) {
    clearInterval(autoCloseTimer)
    autoCloseTimer = null
  }
  
  emit('popup-closed')
}

const playAgain = () => {
  emit('play-again')
  closePopup()
}

const startAutoCloseTimer = () => {
  autoCloseTime.value = props.autoCloseDuration
  
  autoCloseTimer = setInterval(() => {
    autoCloseTime.value -= 100
    
    if (autoCloseTime.value <= 0) {
      closePopup()
    }
  }, 100)
}

const pauseAutoClose = () => {
  if (autoCloseTimer) {
    clearInterval(autoCloseTimer)
    autoCloseTimer = null
  }
}

const resumeAutoClose = () => {
  if (props.autoClose && autoCloseTime.value > 0) {
    startAutoCloseTimer()
  }
}

// Styling methods
const getPopupClass = (type: string) => {
  const baseClass = 'win-popup bg-gray-800 rounded-lg p-6 border-2 shadow-2xl'
  const typeClasses = {
    upgrade: 'border-orange-500 shadow-orange-500/20',
    case: 'border-blue-500 shadow-blue-500/20',
    roulette: 'border-red-500 shadow-red-500/20',
    coinflip: 'border-yellow-500 shadow-yellow-500/20',
    crash: 'border-purple-500 shadow-purple-500/20',
    jackpot: 'border-green-500 shadow-green-500/20'
  }
  
  return `${baseClass} ${typeClasses[type as keyof typeof typeClasses] || 'border-gray-500'}`
}

const getTitleClass = (type: string) => {
  const typeClasses = {
    upgrade: 'text-orange-400',
    case: 'text-blue-400',
    roulette: 'text-red-400',
    coinflip: 'text-yellow-400',
    crash: 'text-purple-400',
    jackpot: 'text-green-400'
  }
  
  return typeClasses[type as keyof typeof typeClasses] || 'text-white'
}

const getEmoji = (type: string) => {
  const emojis = {
    upgrade: '🚀',
    case: '📦',
    roulette: '🎰',
    coinflip: '🪙',
    crash: '💥',
    jackpot: '💰'
  }
  
  return emojis[type as keyof typeof emojis] || '🎉'
}

const getTitle = (type: string) => {
  const titles = {
    upgrade: '¡UPGRADE EXITOSO!',
    case: '¡CASE GANADOR!',
    roulette: '¡ROULETTE GANADORA!',
    coinflip: '¡COINFLIP GANADOR!',
    crash: '¡CRASH EXITOSO!',
    jackpot: '¡JACKPOT!'
  }
  
  return titles[type as keyof typeof titles] || '¡VICTORIA!'
}

const getRarityDisplayName = (rarity: string) => {
  const rarityNames: Record<string, string> = {
    'consumer': 'Consumer Grade',
    'industrial': 'Industrial Grade',
    'milspec': 'Mil-Spec',
    'restricted': 'Restricted',
    'classified': 'Classified',
    'covert': 'Covert',
    'contraband': 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

// Confetti animation
const getConfettiStyle = (index: number) => {
  const colors = ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
  const color = colors[index % colors.length]
  
  return {
    backgroundColor: color,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  }
}

// Sound effects
const playWinSound = (type: string, amount: number) => {
  // In a real implementation, you would use Howler.js or similar
  // For now, we'll use the Web Audio API for a simple beep
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different frequencies for different win types/amounts
    let frequency = 800
    if (amount >= 1000) frequency = 1200
    else if (amount >= 500) frequency = 1000
    else if (amount >= 100) frequency = 900
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.warn('Could not play win sound:', error)
  }
}

// Animation callbacks
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.transform = 'scale(0.8) translateY(50px)'
  element.style.opacity = '0'
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.transform = 'scale(0.8) translateY(-50px)'
  element.style.opacity = '0'
}

// Expose methods for external use
defineExpose({
  showWin,
  closePopup
})

// Cleanup on unmount
onUnmounted(() => {
  if (autoCloseTimer) {
    clearInterval(autoCloseTimer)
  }
})
</script>

<style scoped>
/* Popup transitions */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}

/* Confetti animation */
.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  animation: confetti-fall linear infinite;
  transform-origin: center;
}

@keyframes confetti-fall {
  0% {
    top: -10px;
    transform: rotateZ(0deg);
  }
  100% {
    top: 100vh;
    transform: rotateZ(360deg);
  }
}

/* Rarity border colors */
.rarity-consumer {
  border-color: #b0c3d9;
}

.rarity-industrial {
  border-color: #5e98d9;
}

.rarity-milspec {
  border-color: #4b69ff;
}

.rarity-restricted {
  border-color: #8847ff;
}

.rarity-classified {
  border-color: #d32ce6;
}

.rarity-covert {
  border-color: #eb4b4b;
}

.rarity-contraband {
  border-color: #e4ae39;
}

/* Glow effect for big wins */
.win-popup {
  position: relative;
}

.win-popup::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  border-radius: inherit;
  z-index: -1;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    opacity: 0.5;
    filter: blur(5px);
  }
  100% {
    opacity: 0.8;
    filter: blur(10px);
  }
}
</style>