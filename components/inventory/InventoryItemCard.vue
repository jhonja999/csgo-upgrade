<!-- components/inventory/InventoryItemCard.vue -->
<template>
  <div 
    :class="[
      'group relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg',
      rarityBorderClass,
      { 'opacity-50': item.locked }
    ]"
    @click="$emit('click')"
  >
    <!-- Rarity Background -->
    <div :class="`absolute inset-0 opacity-20 ${rarityBgClass}`" />
    
    <!-- Lock Indicator -->
    <div v-if="item.locked" class="absolute top-2 right-2 z-10">
      <div class="w-4 h-4 text-yellow-400">🔒</div>
    </div>

    <!-- Item Image -->
    <div class="relative p-4">
      <img 
        :src="item.item.image" 
        :alt="item.item.name"
        class="w-full h-24 object-contain group-hover:scale-110 transition-transform duration-200"
      >
    </div>

    <!-- Item Info -->
    <div v-if="!compact" class="p-4 pt-0">
      <h4 class="font-semibold text-sm truncate mb-1">{{ item.item.name }}</h4>
      
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span class="capitalize">{{ formatRarity(item.item.rarity) }}</span>
        <span>{{ formatDate(item.acquiredAt) }}</span>
      </div>
      
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center space-x-1">
          <img src="/dist/img/other/coin.png" alt="Coin" class="w-4 h-4">
          <span class="font-bold text-green-400">${{ item.item.price.toFixed(2) }}</span>
        </div>
        
        <span class="text-xs text-gray-400 capitalize">{{ item.acquiredFrom }}</span>
      </div>
    </div>

    <!-- Hover Actions -->
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
      <button
        @click.stop="$emit('select', item.id)"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
      >
        Select
      </button>
      <button
        @click.stop="$emit('upgrade', item.id)"
        class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
      >
        Upgrade
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/types'

interface Props {
  item: InventoryItem
  compact?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  click: []
  select: [itemId: string]
  upgrade: [itemId: string]
}>()

const rarityBorderClass = computed(() => {
  const colorMap = {
    'consumer': 'border-l-4 border-gray-400',
    'industrial': 'border-l-4 border-blue-400',
    'mil-spec': 'border-l-4 border-blue-600',
    'restricted': 'border-l-4 border-purple-500',
    'classified': 'border-l-4 border-pink-500',
    'covert': 'border-l-4 border-red-500',
    'knife': 'border-l-4 border-yellow-500',
    'gloves': 'border-l-4 border-yellow-500'
  }
  return colorMap[props.item.item.rarity as keyof typeof colorMap] || colorMap.consumer
})

const rarityBgClass = computed(() => {
  const bgMap = {
    'consumer': 'bg-gray-400',
    'industrial': 'bg-blue-400',
    'mil-spec': 'bg-blue-600',
    'restricted': 'bg-purple-500',
    'classified': 'bg-pink-500',
    'covert': 'bg-red-500',
    'knife': 'bg-yellow-500',
    'gloves': 'bg-yellow-500'
  }
  return bgMap[props.item.item.rarity as keyof typeof bgMap] || bgMap.consumer
})

const formatRarity = (rarity: string) => {
  return rarity.replace(/-/g, ' ')
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}
</script>
