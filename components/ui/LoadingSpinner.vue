<template>
  <div
    class="loading-spinner"
    :class="spinnerClasses"
    :style="customStyle"
  >
    <!-- Default Spinner -->
    <div
      v-if="type === 'default'"
      class="spinner-circle"
    ></div>

    <!-- Dots Spinner -->
    <div
      v-else-if="type === 'dots'"
      class="spinner-dots"
    >
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>

    <!-- Pulse Spinner -->
    <div
      v-else-if="type === 'pulse'"
      class="spinner-pulse"
    ></div>

    <!-- Bars Spinner -->
    <div
      v-else-if="type === 'bars'"
      class="spinner-bars"
    >
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <!-- Ring Spinner -->
    <div
      v-else-if="type === 'ring'"
      class="spinner-ring"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <!-- Gradient Spinner -->
    <div
      v-else-if="type === 'gradient'"
      class="spinner-gradient"
    ></div>

    <!-- Text (optional) -->
    <div v-if="text" class="spinner-text">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  text?: string
  textPosition?: 'bottom' | 'right'
  speed?: 'slow' | 'normal' | 'fast'
  inline?: boolean
}

// Props
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'md',
  color: '#f97316', // Orange color
  textPosition: 'bottom',
  speed: 'normal',
  inline: false
})

// Computed
const spinnerClasses = computed(() => {
  const baseClasses = ['loading-spinner']
  
  // Inline vs block
  if (props.inline) {
    baseClasses.push('inline-flex', 'items-center')
  } else {
    baseClasses.push('flex', 'flex-col', 'items-center', 'justify-center')
  }
  
  // Text position
  if (props.text && props.textPosition === 'right') {
    baseClasses.push('flex-row', 'gap-3')
  } else if (props.text) {
    baseClasses.push('gap-2')
  }
  
  return baseClasses.join(' ')
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  
  // Size
  if (typeof props.size === 'number') {
    style['--spinner-size'] = `${props.size}px`
  } else {
    const sizeMap = {
      xs: '16px',
      sm: '20px',
      md: '32px',
      lg: '48px',
      xl: '64px'
    }
    style['--spinner-size'] = sizeMap[props.size]
  }
  
  // Color
  style['--spinner-color'] = props.color
  
  // Speed
  const speedMap = {
    slow: '2s',
    normal: '1s',
    fast: '0.5s'
  }
  style['--spinner-speed'] = speedMap[props.speed]
  
  return style
})
</script>

<style scoped>
.loading-spinner {
  --spinner-size: 32px;
  --spinner-color: #f97316;
  --spinner-speed: 1s;
}

/* Default Spinner */
.spinner-circle {
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid var(--spinner-color);
  border-radius: 50%;
  animation: spin var(--spinner-speed) linear infinite;
}

/* Dots Spinner */
.spinner-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.spinner-dots .dot {
  width: calc(var(--spinner-size) / 4);
  height: calc(var(--spinner-size) / 4);
  background-color: var(--spinner-color);
  border-radius: 50%;
  animation: dots var(--spinner-speed) ease-in-out infinite;
}

.spinner-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-dots .dot:nth-child(3) {
  animation-delay: 0;
}

/* Pulse Spinner */
.spinner-pulse {
  width: var(--spinner-size);
  height: var(--spinner-size);
  background-color: var(--spinner-color);
  border-radius: 50%;
  animation: pulse var(--spinner-speed) ease-in-out infinite;
}

/* Bars Spinner */
.spinner-bars {
  display: flex;
  gap: 2px;
  align-items: center;
  height: var(--spinner-size);
}

.spinner-bars .bar {
  width: calc(var(--spinner-size) / 8);
  height: 100%;
  background-color: var(--spinner-color);
  border-radius: 2px;
  animation: bars var(--spinner-speed) ease-in-out infinite;
}

.spinner-bars .bar:nth-child(1) {
  animation-delay: -0.4s;
}

.spinner-bars .bar:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-bars .bar:nth-child(3) {
  animation-delay: -0.2s;
}

.spinner-bars .bar:nth-child(4) {
  animation-delay: -0.1s;
}

/* Ring Spinner */
.spinner-ring {
  display: inline-block;
  position: relative;
  width: var(--spinner-size);
  height: var(--spinner-size);
}

.spinner-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: calc(var(--spinner-size) * 0.8);
  height: calc(var(--spinner-size) * 0.8);
  margin: calc(var(--spinner-size) * 0.1);
  border: calc(var(--spinner-size) * 0.1) solid var(--spinner-color);
  border-radius: 50%;
  animation: ring var(--spinner-speed) cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--spinner-color) transparent transparent transparent;
}

.spinner-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

/* Gradient Spinner */
.spinner-gradient {
  width: var(--spinner-size);
  height: var(--spinner-size);
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--spinner-color) 0deg,
    transparent 360deg
  );
  animation: spin var(--spinner-speed) linear infinite;
}

.spinner-gradient::before {
  content: '';
  position: absolute;
  inset: 10%;
  background: #1f2937;
  border-radius: 50%;
}

/* Text Styling */
.spinner-text {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes bars {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  20% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .loading-spinner {
    --spinner-size: calc(var(--spinner-size) * 0.8);
  }
}
</style>