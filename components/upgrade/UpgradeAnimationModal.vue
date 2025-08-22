<!-- components/upgrade/UpgradeAnimationModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 text-center">
      <!-- Header -->
      <h2 class="text-3xl font-bold mb-8">Upgrading Items...</h2>

      <!-- Progress Circle -->
      <div class="relative w-48 h-48 mx-auto mb-8">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <!-- Background Circle -->
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            class="text-gray-700"
          />
          <!-- Progress Circle -->
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference - (progress / 100) * circumference"
            class="text-purple-500 transition-all duration-300"
          />
        </svg>
        
        <!-- Center Content -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div>
            <div class="text-3xl font-bold text-purple-400">{{ Math.round(progress) }}%</div>
            <div class="text-sm text-gray-400">{{ currentStage }}</div>
          </div>
        </div>
      </div>

      <!-- Success Chance -->
      <div v-if="calculation" class="mb-6">
        <p class="text-lg mb-2">Success Chance: 
          <span 
            :class="`font-bold ${
              calculation.successChance >= 70 ? 'text-green-400' :
              calculation.successChance >= 30 ? 'text-yellow-400' : 'text-red-400'
            }`"
          >
            {{ calculation.successChance.toFixed(1) }}%
          </span>
        </p>
        
        <div class="w-full bg-gray-700 rounded-full h-3">
          <div 
            :style="{ width: `${calculation.successChance}%` }"
            :class="`h-3 rounded-full transition-all duration-500 ${
              calculation.successChance >= 70 ? 'bg-green-400' :
              calculation.successChance >= 30 ? 'bg-yellow-400' : 'bg-red-400'
            }`"
          />
        </div>
      </div>

      <!-- Result Display -->
      <div v-if="showResult" class="mt-8">
        <div v-if="upgradeSuccess" class="text-center">
          <div class="text-4xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-green-400 mb-4">Upgrade Successful!</h3>
          <p class="text-gray-300">Your items have been upgraded to something better!</p>
        </div>
        
        <div v-else class="text-center">
          <div class="text-4xl mb-4">😞</div>
          <h3 class="text-2xl font-bold text-red-400 mb-4">Upgrade Failed</h3>
          <p class="text-gray-300">Better luck next time!</p>
        </div>
        
        <button
          @click="complete"
          class="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpgradeCalculation } from '~/types'

interface Props {
  calculation: UpgradeCalculation | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  complete: [success: boolean]
}>()

const progress = ref(0)
const currentStage = ref('Preparing...')
const showResult = ref(false)
const upgradeSuccess = ref(false)

const circumference = 2 * Math.PI * 45

const stages = [
  'Preparing...',
  'Analyzing items...',
  'Calculating probabilities...',
  'Processing upgrade...',
  'Finalizing...'
]

const startAnimation = () => {
  let currentStageIndex = 0
  let targetProgress = 0
  
  const stageInterval = setInterval(() => {
    if (currentStageIndex < stages.length) {
      currentStage.value = stages[currentStageIndex]
      targetProgress = ((currentStageIndex + 1) / stages.length) * 100
      
      // Animate progress
      const progressInterval = setInterval(() => {
        if (progress.value < targetProgress) {
          progress.value += 2
        } else {
          clearInterval(progressInterval)
          currentStageIndex++
          
          if (currentStageIndex >= stages.length) {
            clearInterval(stageInterval)
            
            // Determine result based on calculation
            setTimeout(() => {
              if (props.calculation) {
                const random = Math.random() * 100
                upgradeSuccess.value = random <= props.calculation.successChance
              }
              
              showResult.value = true
            }, 500)
          }
        }
      }, 50)
    }
  }, 1000)
}

const complete = () => {
  emit('complete', upgradeSuccess.value)
}

onMounted(() => {
  startAnimation()
})
</script>
