<template>
  <div
    class="item-card relative bg-gray-700 rounded-lg border-2 transition-all duration-200 cursor-pointer"
    :class="[
      `rarity-${item.rarity}`,
      {
        'hover:scale-105 hover:shadow-lg': !disabled && !loading,
        'opacity-50 cursor-not-allowed': disabled,
        'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900': selected,
        'animate-pulse': loading
      }
    ]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center z-10"
    >
      <LoadingSpinner size="sm" />
    </div>

    <!-- Selection Indicator -->
    <div
      v-if="showSelection"
      class="absolute top-2 left-2 z-10"
    >
      <input
        type="checkbox"
        :checked="selected"
        class="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
        @click.stop="toggleSelection"
      >
    </div>

    <!-- Special Badges -->
    <div class="absolute top-2 right-2 z-10 flex flex-col gap-1">
      <span
        v-if="item.statTrak"
        class="bg-orange-500 text-white text-xs px-1 py-0.5 rounded font-bold"
      >
        ST
      </span>
      <span
        v-if="item.souvenir"
        class="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded font-bold"
      >
        ★
      </span>
      <span
        v-if="showNew && isNew"
        class="bg-green-500 text-white text-xs px-1 py-0.5 rounded font-bold animate-pulse"
      >
        NEW
      </span>
    </div>

    <!-- Price Tag -->
    <div
      v-if="showPrice"
      class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10"
    >
      <span class="bg-black bg-opacity-75 text-green-400 text-xs px-2 py-1 rounded font-semibold">
        ${{ formatPrice(item.price) }}
      </span>
    </div>

    <!-- Item Image -->
    <div class="aspect-square bg-gray-800 rounded-t-lg p-3 flex items-center justify-center relative overflow-hidden">
      <img
        :src="item.imageUrl"
        :alt="item.name"
        class="w-full h-full object-contain transition-transform duration-200"
        :class="{ 'scale-110': isHovered && !disabled }"
        @error="onImageError"
        loading="lazy"
      >
      
      <!-- Shine Effect -->
      <div
        v-if="showShine"
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shine"
      ></div>
    </div>

    <!-- Item Info -->
    <div class="p-3">
      <!-- Item Name -->
      <h3
        class="text-white font-medium text-sm mb-1 leading-tight"
        :class="{ 'truncate': truncateName }"
        :title="item.name"
      >
        {{ displayName }}
      </h3>

      <!-- Item Details Row 1 -->
      <div class="flex items-center justify-between mb-2">
        <!-- Price -->
        <span class="text-green-400 font-bold text-sm">
          ${{ formatPrice(item.price) }}
        </span>
        
        <!-- Wear/Exterior -->
        <span
          v-if="item.exterior"
          class="text-xs text-gray-400"
        >
          {{ getShortExterior(item.exterior) }}
        </span>
      </div>

      <!-- Item Details Row 2 -->
      <div class="flex items-center justify-between">
        <!-- Rarity -->
        <span
          class="text-xs px-2 py-1 rounded"
          :class="`text-${rarityColor}`"
          :style="{ color: getRarityColor(item.rarity) }"
        >
          {{ getRarityDisplayName(item.rarity) }}
        </span>
        
        <!-- Actions -->
        <div v-if="showActions" class="flex gap-1">
          <button
            v-for="action in availableActions"
            :key="action.key"
            @click.stop="handleAction(action.key)"
            class="text-xs p-1 rounded hover:bg-gray-600 transition-colors"
            :class="action.colorClass"
            :title="action.label"
          >
            {{ action.icon }}
          </button>
        </div>
      </div>

      <!-- Float Value (if available) -->
      <div
        v-if="item.float !== undefined"
        class="mt-2 text-xs text-gray-400"
      >
        Float: {{ item.float.toFixed(4) }}
      </div>

      <!-- Stickers (if any) -->
      <div
        v-if="item.stickers && item.stickers.length > 0"
        class="mt-2 flex gap-1 overflow-hidden"
      >
        <div
          v-for="sticker in item.stickers.slice(0, 4)"
          :key="sticker.name"
          class="w-4 h-4 bg-gray-600 rounded flex-shrink-0"
          :title="sticker.name"
        >
          <img
            :src="sticker.imageUrl"
            :alt="sticker.name"
            class="w-full h-full object-contain"
            @error="onStickerImageError"
          >
        </div>
      </div>
    </div>

    <!-- Hover Overlay -->
    <div
      v-if="isHovered && !disabled && !loading"
      class="absolute inset-0 bg-black bg-opacity-20 rounded-lg pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { CSGOItem } from '~/types'

interface ItemAction {
  key: string
  icon: string
  label: string
  colorClass: string
}

interface Props {
  item: CSGOItem
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  showSelection?: boolean
  showPrice?: boolean
  showActions?: boolean
  showNew?: boolean
  showShine?: boolean
  truncateName?: boolean
  maxNameLength?: number
  actions?: ItemAction[]
}

interface Emits {
  (e: 'click', item: CSGOItem): void
  (e: 'selection-change', itemId: string, selected: boolean): void
  (e: 'action', action: string, item: CSGOItem): void
  (e: 'hover', item: CSGOItem, isHovered: boolean): void
}

// Props
const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  loading: false,
  showSelection: false,
  showPrice: true,
  showActions: true,
  showNew: false,
  showShine: false,
  truncateName: true,
  maxNameLength: 30,
  actions: () => [
    { key: 'upgrade', icon: '🚀', label: 'Upgrade', colorClass: 'text-orange-400 hover:text-orange-300' },
    { key: 'sell', icon: '💰', label: 'Vender', colorClass: 'text-green-400 hover:text-green-300' },
    { key: 'details', icon: 'ℹ️', label: 'Detalles', colorClass: 'text-blue-400 hover:text-blue-300' }
  ]
})

// Emits
const emit = defineEmits<Emits>()

// Audio
const { playHoverSound, playClickSound } = useAudio()

// State
const isHovered = ref(false)
const isNew = ref(false)

// Computed
const displayName = computed(() => {
  if (!props.truncateName) return props.item.name
  
  if (props.item.name.length <= props.maxNameLength) {
    return props.item.name
  }
  
  return `${props.item.name.substring(0, props.maxNameLength - 3)}...`
})

const availableActions = computed(() => {
  return props.actions.filter(action => {
    // Filter actions based on item properties or conditions
    if (action.key === 'upgrade' && props.item.price < 0.5) {
      return false // Can't upgrade very cheap items
    }
    return true
  })
})

const rarityColor = computed(() => {
  const colorMap: Record<string, string> = {
    consumer: 'blue-300',
    industrial: 'blue-400',
    milspec: 'blue-500',
    restricted: 'purple-400',
    classified: 'pink-400',
    covert: 'red-400',
    contraband: 'yellow-400'
  }
  return colorMap[props.item.rarity] || 'gray-400'
})

// Methods
const handleClick = () => {
  if (props.disabled || props.loading) return
  
  playClickSound()
  emit('click', props.item)
}

const handleMouseEnter = () => {
  if (props.disabled || props.loading) return
  
  isHovered.value = true
  playHoverSound()
  emit('hover', props.item, true)
}

const handleMouseLeave = () => {
  isHovered.value = false
  emit('hover', props.item, false)
}

const toggleSelection = () => {
  if (props.disabled || props.loading) return
  
  emit('selection-change', props.item.id, !props.selected)
}

const handleAction = (actionKey: string) => {
  if (props.disabled || props.loading) return
  
  playClickSound()
  emit('action', actionKey, props.item)
}

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K`
  }
  return price.toFixed(2)
}

const getRarityDisplayName = (rarity: string): string => {
  const rarityNames: Record<string, string> = {
    consumer: 'Consumer',
    industrial: 'Industrial',
    milspec: 'Mil-Spec',
    restricted: 'Restricted',
    classified: 'Classified',
    covert: 'Covert',
    contraband: 'Contraband'
  }
  
  return rarityNames[rarity] || rarity
}

const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    consumer: '#b0c3d9',
    industrial: '#5e98d9',
    milspec: '#4b69ff',
    restricted: '#8847ff',
    classified: '#d32ce6',
    covert: '#eb4b4b',
    contraband: '#e4ae39'
  }
  
  return colors[rarity] || '#9ca3af'
}

const getShortExterior = (exterior: string): string => {
  const shortNames: Record<string, string> = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS'
  }
  
  return shortNames[exterior] || exterior
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-item.jpg'
}

const onStickerImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-sticker.jpg'
}

// Check if item is new (added recently)
const checkIfNew = () => {
  // In a real app, you would check against a timestamp
  // For now, we'll just use a random chance for demo
  if (props.showNew) {
    isNew.value = Math.random() < 0.1 // 10% chance
  }
}

// Lifecycle
onMounted(() => {
  checkIfNew()
})
</script>

<style scoped>
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

/* Shine animation */
@keyframes shine {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

.animate-shine {
  animation: shine 2s infinite;
}

/* Hover effects */
.item-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}

/* Selection animation */
.item-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Image zoom effect */
.item-card:hover img {
  transform: scale(1.1);
}
</style>