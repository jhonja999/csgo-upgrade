<!-- components/GameCard.vue -->
<template>
  <NuxtLink 
    :to="href"
    class="group relative overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
  >
    <!-- Gradient Overlay -->
    <div :class="`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`" />
    
    <!-- Badge -->
    <div 
      v-if="badge" 
      class="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
    >
      {{ badge }}
    </div>
    
    <!-- Content -->
    <div class="relative p-6 text-center">
      <!-- Image -->
      <div class="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
        <img 
          :src="image" 
          :alt="title"
          class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
        >
      </div>
      
      <!-- Title -->
      <h3 class="text-xl font-bold mb-2 group-hover:text-white transition-colors">
        {{ title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
        {{ description }}
      </p>
      
      <!-- Play Button -->
      <div class="mt-4">
        <span class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-500 transition-colors">
          Play Now
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  image: string
  href: string
  badge?: string
  gradient: string
}

defineProps<Props>()
</script>
