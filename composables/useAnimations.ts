export const useAnimations = () => {
  // Animation state
  const isAnimating = ref(false)
  const currentAnimation = ref<string | null>(null)
  const animationQueue = ref<Array<() => Promise<void>>>([])

  // GSAP timeline instance (if using GSAP)
  let timeline: any = null

  // Basic animation utilities
  const animate = (element: HTMLElement, properties: Record<string, any>, options: {
    duration?: number
    delay?: number
    easing?: string
    onComplete?: () => void
    onStart?: () => void
  } = {}) => {
    const {
      duration = 300,
      delay = 0,
      easing = 'ease-out',
      onComplete,
      onStart
    } = options

    return new Promise<void>((resolve) => {
      // Create keyframes for the animation
      const keyframes: Keyframe[] = []
      
      // Get initial values
      const computedStyle = getComputedStyle(element)
      const initialValues: Record<string, string> = {}
      
      Object.keys(properties).forEach(prop => {
        const cssProp = camelToKebab(prop)
        initialValues[prop] = computedStyle.getPropertyValue(cssProp)
      })

      // Create from and to keyframes
      keyframes.push(initialValues)
      keyframes.push(properties)

      // Animation options
      const animationOptions: KeyframeAnimationOptions = {
        duration,
        delay,
        easing,
        fill: 'forwards'
      }

      // Start animation
      if (onStart) onStart()
      
      const animation = element.animate(keyframes, animationOptions)
      
      animation.addEventListener('finish', () => {
        if (onComplete) onComplete()
        resolve()
      })
    })
  }

  // Fade animations
  const fadeIn = (element: HTMLElement, duration = 300, delay = 0) => {
    return animate(element, { opacity: '1' }, { duration, delay })
  }

  const fadeOut = (element: HTMLElement, duration = 300, delay = 0) => {
    return animate(element, { opacity: '0' }, { duration, delay })
  }

  const fadeToggle = (element: HTMLElement, duration = 300) => {
    const isVisible = getComputedStyle(element).opacity !== '0'
    return isVisible ? fadeOut(element, duration) : fadeIn(element, duration)
  }

  // Slide animations
  const slideIn = (element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration = 300) => {
    const transforms = {
      up: 'translateY(0)',
      down: 'translateY(0)',
      left: 'translateX(0)',
      right: 'translateX(0)'
    }

    return animate(element, {
      transform: transforms[direction],
      opacity: '1'
    }, { duration })
  }

  const slideOut = (element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration = 300) => {
    const transforms = {
      up: 'translateY(-20px)',
      down: 'translateY(20px)',
      left: 'translateX(-20px)',
      right: 'translateX(20px)'
    }

    return animate(element, {
      transform: transforms[direction],
      opacity: '0'
    }, { duration })
  }

  // Scale animations
  const scaleIn = (element: HTMLElement, duration = 300, scale = 1) => {
    return animate(element, {
      transform: `scale(${scale})`,
      opacity: '1'
    }, { duration })
  }

  const scaleOut = (element: HTMLElement, duration = 300) => {
    return animate(element, {
      transform: 'scale(0.8)',
      opacity: '0'
    }, { duration })
  }

  const pulse = (element: HTMLElement, intensity = 1.1, duration = 600) => {
    return animate(element, { transform: `scale(${intensity})` }, { duration: duration / 2 })
      .then(() => animate(element, { transform: 'scale(1)' }, { duration: duration / 2 }))
  }

  // Bounce animation
  const bounce = (element: HTMLElement, intensity = 10, duration = 600) => {
    const keyframes = [
      { transform: 'translateY(0px)' },
      { transform: `translateY(-${intensity}px)` },
      { transform: 'translateY(0px)' },
      { transform: `translateY(-${intensity / 2}px)` },
      { transform: 'translateY(0px)' }
    ]

    return new Promise<void>((resolve) => {
      const animation = element.animate(keyframes, {
        duration,
        easing: 'ease-out'
      })
      
      animation.addEventListener('finish', () => resolve())
    })
  }

  // Shake animation
  const shake = (element: HTMLElement, intensity = 5, duration = 600) => {
    const keyframes = [
      { transform: 'translateX(0px)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: 'translateX(0px)' }
    ]

    return new Promise<void>((resolve) => {
      const animation = element.animate(keyframes, {
        duration,
        easing: 'ease-in-out'
      })
      
      animation.addEventListener('finish', () => resolve())
    })
  }

  // Spin animation
  const spin = (element: HTMLElement, rotations = 1, duration = 1000) => {
    return animate(element, {
      transform: `rotate(${rotations * 360}deg)`
    }, { duration })
  }

  // Complex upgrade animation
  const upgradeAnimation = async (containerElement: HTMLElement, items: HTMLElement[], winningIndex: number) => {
    isAnimating.value = true
    currentAnimation.value = 'upgrade'

    try {
      // Phase 1: Setup
      items.forEach((item, index) => {
        item.style.transform = 'translateX(0px)'
        item.style.opacity = '1'
      })

      // Phase 2: Fast scroll
      const scrollDistance = -1000
      await Promise.all(
        items.map(item => 
          animate(item, { transform: `translateX(${scrollDistance}px)` }, { duration: 2000 })
        )
      )

      // Phase 3: Slow down and center on winning item
      const winningItem = items[winningIndex]
      if (winningItem) {
        // Center the winning item
        const containerRect = containerElement.getBoundingClientRect()
        const itemRect = winningItem.getBoundingClientRect()
        const centerOffset = (containerRect.width / 2) - (itemRect.width / 2)
        
        await animate(winningItem, {
          transform: `translateX(${centerOffset}px)`,
          scale: '1.2'
        }, { duration: 500 })

        // Highlight effect
        await pulse(winningItem, 1.3, 400)
      }

    } finally {
      isAnimating.value = false
      currentAnimation.value = null
    }
  }

  // Particle effects
  const createParticles = (container: HTMLElement, count = 50, type = 'confetti') => {
    const particles: HTMLElement[] = []

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = `particle particle-${type}`
      
      // Random position
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = '-10px'
      
      // Random color for confetti
      if (type === 'confetti') {
        const colors = ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.width = '8px'
        particle.style.height = '8px'
      }
      
      particle.style.position = 'absolute'
      particle.style.pointerEvents = 'none'
      particle.style.borderRadius = '50%'
      
      container.appendChild(particle)
      particles.push(particle)

      // Animate particle
      const finalY = window.innerHeight + 50
      const rotation = Math.random() * 360
      const drift = (Math.random() - 0.5) * 100

      animate(particle, {
        transform: `translateY(${finalY}px) translateX(${drift}px) rotate(${rotation}deg)`,
        opacity: '0'
      }, {
        duration: 3000 + Math.random() * 2000,
        easing: 'linear',
        onComplete: () => {
          container.removeChild(particle)
        }
      })
    }

    return particles
  }

  // Queue system for sequential animations
  const queueAnimation = (animationFn: () => Promise<void>) => {
    animationQueue.value.push(animationFn)
    processQueue()
  }

  const processQueue = async () => {
    if (isAnimating.value || animationQueue.value.length === 0) return

    isAnimating.value = true
    
    while (animationQueue.value.length > 0) {
      const animation = animationQueue.value.shift()
      if (animation) {
        await animation()
      }
    }
    
    isAnimating.value = false
  }

  // Utility functions
  const camelToKebab = (str: string) => {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  }

  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3)
  }

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // CSS class-based animations
  const addAnimationClass = (element: HTMLElement, className: string, duration = 1000) => {
    return new Promise<void>((resolve) => {
      element.classList.add(className)
      
      setTimeout(() => {
        element.classList.remove(className)
        resolve()
      }, duration)
    })
  }

  // Intersection Observer for scroll animations
  const animateOnScroll = (elements: HTMLElement[], animationFn: (element: HTMLElement) => void, threshold = 0.1) => {
    if (!process.client) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animationFn(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold })

    elements.forEach(element => {
      observer.observe(element)
    })

    return observer
  }

  return {
    // State
    isAnimating: readonly(isAnimating),
    currentAnimation: readonly(currentAnimation),

    // Basic animations
    animate,
    fadeIn,
    fadeOut,
    fadeToggle,
    slideIn,
    slideOut,
    scaleIn,
    scaleOut,
    pulse,
    bounce,
    shake,
    spin,

    // Complex animations
    upgradeAnimation,
    createParticles,

    // Queue system
    queueAnimation,

    // Utilities
    addAnimationClass,
    animateOnScroll,
    easeOutCubic,
    easeInOutCubic
  }
}