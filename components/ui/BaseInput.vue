<template>
  <div class="base-input" :class="wrapperClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium mb-2"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>

    <!-- Input Wrapper -->
    <div class="relative">
      <!-- Left Icon -->
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-400">{{ leftIcon }}</span>
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >

      <!-- Right Icon / Clear Button -->
      <div
        v-if="rightIcon || (clearable && modelValue)"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          v-if="clearable && modelValue && !disabled"
          type="button"
          @click="clearInput"
          class="text-gray-400 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
        <span v-else-if="rightIcon" class="text-gray-400">{{ rightIcon }}</span>
      </div>

      <!-- Password Toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
      >
        {{ showPassword ? '🙈' : '👁️' }}
      </button>
    </div>

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || errorMessage" class="mt-2">
      <p
        v-if="errorMessage"
        class="text-sm text-red-400 flex items-center gap-1"
      >
        <span>⚠️</span>
        {{ errorMessage }}
      </p>
      <p
        v-else-if="helperText"
        class="text-sm text-gray-400"
      >
        {{ helperText }}
      </p>
    </div>

    <!-- Character Count -->
    <div
      v-if="maxlength && showCharacterCount"
      class="mt-1 text-right text-xs"
      :class="characterCountClasses"
    >
      {{ characterCount }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  leftIcon?: string
  rightIcon?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  min?: number
  max?: number
  step?: number
  maxlength?: number
  showCharacterCount?: boolean
  autocomplete?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'clear'): void
}

// Props
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  showCharacterCount: false
})

// Emits
const emit = defineEmits<Emits>()

// State
const inputRef = ref<HTMLInputElement>()
const showPassword = ref(false)
const isFocused = ref(false)

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Computed
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const wrapperClasses = computed(() => {
  return {
    'opacity-50': props.disabled
  }
})

const labelClasses = computed(() => {
  return {
    'text-gray-300': !props.errorMessage,
    'text-red-400': props.errorMessage
  }
})

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-gray-900',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['text-sm', 'px-3', 'py-1.5'],
    md: ['text-sm', 'px-4', 'py-2'],
    lg: ['text-base', 'px-4', 'py-3']
  }

  // Variant classes
  const variantClasses = {
    default: [
      'bg-gray-700',
      'border-gray-600',
      'text-white',
      'placeholder-gray-400',
      'focus:border-orange-500',
      'focus:ring-orange-500'
    ],
    filled: [
      'bg-gray-800',
      'border-transparent',
      'text-white',
      'placeholder-gray-400',
      'focus:bg-gray-700',
      'focus:ring-orange-500'
    ],
    outlined: [
      'bg-transparent',
      'border-gray-500',
      'text-white',
      'placeholder-gray-400',
      'focus:border-orange-500',
      'focus:ring-orange-500'
    ]
  }

  // Error state
  const errorClasses = props.errorMessage ? [
    'border-red-500',
    'focus:border-red-500',
    'focus:ring-red-500'
  ] : []

  // Icon padding
  const iconPaddingClasses = []
  if (props.leftIcon) {
    iconPaddingClasses.push('pl-10')
  }
  if (props.rightIcon || props.clearable || props.type === 'password') {
    iconPaddingClasses.push('pr-10')
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...errorClasses,
    ...iconPaddingClasses
  ].join(' ')
})

const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const characterCountClasses = computed(() => {
  if (!props.maxlength) return 'text-gray-400'
  
  const ratio = characterCount.value / props.maxlength
  if (ratio >= 1) return 'text-red-400'
  if (ratio >= 0.8) return 'text-yellow-400'
  return 'text-gray-400'
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  // Handle number type
  if (props.type === 'number') {
    value = target.valueAsNumber || 0
  }

  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped>
/* Custom focus styles for better accessibility */
input:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Hide number input spinners in webkit browsers */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input spinners in Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>