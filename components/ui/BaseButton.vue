<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="linkAttrs"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner mr-2"></div>
    
    <!-- Icon -->
    <span v-if="icon && !loading" class="icon mr-2">{{ icon }}</span>
    
    <!-- Content -->
    <span class="button-content">
      <slot />
    </span>
    
    <!-- Right Icon -->
    <span v-if="rightIcon" class="icon ml-2">{{ rightIcon }}</span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  rounded?: boolean
  icon?: string
  rightIcon?: string
  href?: string
  to?: string
  target?: string
  replace?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

// Props
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  rounded: false
})

// Emits
const emit = defineEmits<Emits>()

// Router
const router = useRouter()

// Computed
const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'button' // We'll handle navigation manually
  return 'button'
})

const linkAttrs = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined
    }
  }
  return {}
})

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-gray-900',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none'
  ]

  // Size classes
  const sizeClasses = {
    xs: ['text-xs', 'px-2', 'py-1'],
    sm: ['text-sm', 'px-3', 'py-1.5'],
    md: ['text-sm', 'px-4', 'py-2'],
    lg: ['text-base', 'px-6', 'py-3'],
    xl: ['text-lg', 'px-8', 'py-4']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-orange-500',
      'hover:bg-orange-600',
      'active:bg-orange-700',
      'text-white',
      'focus:ring-orange-500'
    ],
    secondary: [
      'bg-gray-600',
      'hover:bg-gray-700',
      'active:bg-gray-800',
      'text-white',
      'focus:ring-gray-500'
    ],
    success: [
      'bg-green-500',
      'hover:bg-green-600',
      'active:bg-green-700',
      'text-white',
      'focus:ring-green-500'
    ],
    danger: [
      'bg-red-500',
      'hover:bg-red-600',
      'active:bg-red-700',
      'text-white',
      'focus:ring-red-500'
    ],
    warning: [
      'bg-yellow-500',
      'hover:bg-yellow-600',
      'active:bg-yellow-700',
      'text-white',
      'focus:ring-yellow-500'
    ],
    ghost: [
      'bg-transparent',
      'hover:bg-gray-700',
      'active:bg-gray-800',
      'text-gray-300',
      'hover:text-white',
      'focus:ring-gray-500'
    ],
    outline: [
      'bg-transparent',
      'border-2',
      'border-orange-500',
      'hover:bg-orange-500',
      'active:bg-orange-600',
      'text-orange-500',
      'hover:text-white',
      'focus:ring-orange-500'
    ]
  }

  // Rounded classes
  const roundedClasses = props.rounded ? ['rounded-full'] : ['rounded-lg']

  // Block classes
  const blockClasses = props.block ? ['w-full'] : []

  // Loading classes
  const loadingClasses = props.loading ? ['cursor-wait'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...roundedClasses,
    ...blockClasses,
    ...loadingClasses
  ].join(' ')
})

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  // Handle navigation
  if (props.to) {
    event.preventDefault()
    if (props.replace) {
      router.replace(props.to)
    } else {
      router.push(props.to)
    }
  }

  emit('click', event)
}
</script>

<style scoped>
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover effects */
.button:not(:disabled):hover {
  transform: translateY(-1px);
}

.button:not(:disabled):active {
  transform: translateY(0);
}

/* Focus visible for accessibility */
.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>