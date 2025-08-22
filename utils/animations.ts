// Animation utilities and presets

// Animation timing functions
export const EASING = {
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  EASE_IN_CUBIC: 'cubic-bezier(0.32, 0, 0.67, 0)',
  EASE_OUT_CUBIC: 'cubic-bezier(0.33, 1, 0.68, 1)',
  EASE_IN_OUT_CUBIC: 'cubic-bezier(0.65, 0, 0.35, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
}

// Animation durations in milliseconds
export const DURATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 750,
  SLOWEST: 1000,
  UPGRADE: 3000,
  CASE_OPENING: 4000
}

// Animation presets
export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_IN
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT_CUBIC
  },
  
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.8)', opacity: 0 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_IN_CUBIC
  },
  
  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT_CUBIC
  },
  
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT_CUBIC
  },
  
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT_CUBIC
  },
  
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: DURATION.NORMAL,
    easing: EASING.EASE_OUT_CUBIC
  },
  
  // Bounce animation
  bounce: {
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' },
      { transform: 'translateY(-5px)' },
      { transform: 'translateY(0)' }
    ],
    duration: DURATION.SLOW,
    easing: EASING.EASE_OUT
  },
  
  // Shake animation
  shake: {
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ],
    duration: DURATION.SLOW,
    easing: EASING.EASE_IN_OUT
  },
  
  // Pulse animation
  pulse: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.05)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    duration: DURATION.SLOWER,
    easing: EASING.EASE_IN_OUT
  },
  
  // Spin animation
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    duration: DURATION.SLOWEST,
    easing: EASING.LINEAR
  }
}

// Game-specific animations
export const GAME_ANIMATIONS = {
  // Upgrade reel animation
  upgradeReel: {
    keyframes: [
      { transform: 'translateX(0px)' },
      { transform: 'translateX(-2000px)' },
      { transform: 'translateX(-2100px)' }
    ],
    duration: DURATION.UPGRADE,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  
  // Case opening animation
  caseOpening: {
    phases: [
      {
        keyframes: [
          { transform: 'rotateY(0deg)' },
          { transform: 'rotateY(180deg)' }
        ],
        duration: DURATION.SLOWEST,
        easing: EASING.EASE_IN_OUT
      },
      {
        keyframes: [
          { transform: 'scale(1)' },
          { transform: 'scale(1.2)' },
          { transform: 'scale(1)' }
        ],
        duration: DURATION.SLOW,
        easing: EASING.BOUNCE
      }
    ]
  },
  
  // Roulette wheel animation
  rouletteWheel: {
    duration: 3000,
    easing: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
    rotations: 5 // Number of full rotations before stopping
  },
  
  // Coinflip animation
  coinflip: {
    keyframes: [
      { transform: 'rotateY(0deg) translateY(0px)' },
      { transform: 'rotateY(720deg) translateY(-50px)' },
      { transform: 'rotateY(1440deg) translateY(0px)' }
    ],
    duration: 2000,
    easing: EASING.EASE_OUT
  },
  
  // Crash graph animation
  crashGraph: {
    duration: 100, // Per step
    easing: EASING.LINEAR
  }
}

// Particle system configurations
export const PARTICLE_CONFIGS = {
  confetti: {
    count: 50,
    colors: ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
    shapes: ['circle', 'square'],
    gravity: 0.5,
    wind: 0.1,
    duration: 3000
  },
  
  sparks: {
    count: 20,
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
    size: { min: 2, max: 6 },
    velocity: { min: 5, max: 15 },
    duration: 1500
  },
  
  coins: {
    count: 10,
    colors: ['#eab308', '#f59e0b'],
    size: { min: 8, max: 12 },
    gravity: 0.8,
    duration: 2000
  }
}

// Animation utility functions
export function createAnimation(
  element: HTMLElement,
  config: any
): Animation {
  const { from, to, keyframes, duration, easing, delay = 0 } = config
  
  let animationKeyframes: Keyframe[]
  
  if (keyframes) {
    animationKeyframes = keyframes
  } else if (from && to) {
    animationKeyframes = [from, to]
  } else {
    throw new Error('Animation must have either keyframes or from/to properties')
  }
  
  const options: KeyframeAnimationOptions = {
    duration,
    easing,
    delay,
    fill: 'forwards'
  }
  
  return element.animate(animationKeyframes, options)
}

export function animateSequence(
  element: HTMLElement,
  animations: any[]
): Promise<void> {
  return animations.reduce((promise, animationConfig) => {
    return promise.then(() => {
      return new Promise<void>((resolve) => {
        const animation = createAnimation(element, animationConfig)
        animation.addEventListener('finish', () => resolve())
      })
    })
  }, Promise.resolve())
}

export function animateParallel(
  elements: HTMLElement[],
  animationConfig: any
): Promise<void[]> {
  const promises = elements.map(element => {
    return new Promise<void>((resolve) => {
      const animation = createAnimation(element, animationConfig)
      animation.addEventListener('finish', () => resolve())
    })
  })
  
  return Promise.all(promises)
}

// Stagger animation utility
export function staggerAnimation(
  elements: HTMLElement[],
  animationConfig: any,
  staggerDelay: number = 100
): Promise<void[]> {
  const promises = elements.map((element, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const animation = createAnimation(element, {
          ...animationConfig,
          delay: (animationConfig.delay || 0) + (index * staggerDelay)
        })
        animation.addEventListener('finish', () => resolve())
      }, 0)
    })
  })
  
  return Promise.all(promises)
}

// Scroll-triggered animations
export function observeScrollAnimation(
  elements: HTMLElement[],
  animationConfig: any,
  threshold: number = 0.1
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        createAnimation(entry.target as HTMLElement, animationConfig)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold })
  
  elements.forEach(element => observer.observe(element))
  
  return observer
}

// Transition utilities for Vue components
export const VUE_TRANSITIONS = {
  fade: {
    enterActiveClass: 'transition-opacity duration-300 ease-out',
    leaveActiveClass: 'transition-opacity duration-300 ease-in',
    enterFromClass: 'opacity-0',
    leaveToClass: 'opacity-0'
  },
  
  scale: {
    enterActiveClass: 'transition-all duration-300 ease-out',
    leaveActiveClass: 'transition-all duration-300 ease-in',
    enterFromClass: 'opacity-0 transform scale-95',
    leaveToClass: 'opacity-0 transform scale-95'
  },
  
  slide: {
    enterActiveClass: 'transition-all duration-300 ease-out',
    leaveActiveClass: 'transition-all duration-300 ease-in',
    enterFromClass: 'opacity-0 transform translate-y-4',
    leaveToClass: 'opacity-0 transform -translate-y-4'
  }
}

// CSS class-based animations
export const CSS_ANIMATIONS = {
  'animate-spin': 'animate-spin',
  'animate-ping': 'animate-ping',
  'animate-pulse': 'animate-pulse',
  'animate-bounce': 'animate-bounce',
  'animate-fade-in': 'animate-fade-in',
  'animate-slide-in-up': 'animate-slide-in-up',
  'animate-scale-in': 'animate-scale-in'
}

// Performance optimization
export function reduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function respectMotionPreference(animationConfig: any): any {
  if (reduceMotion()) {
    return {
      ...animationConfig,
      duration: 0,
      delay: 0
    }
  }
  return animationConfig
}

// Animation cleanup
export function cleanupAnimations(animations: Animation[]): void {
  animations.forEach(animation => {
    if (animation.playState !== 'finished') {
      animation.cancel()
    }
  })
}

// Frame rate utilities
export function requestAnimationFramePromise(): Promise<number> {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

export async function waitForFrames(frameCount: number): Promise<void> {
  for (let i = 0; i < frameCount; i++) {
    await requestAnimationFramePromise()
  }
}