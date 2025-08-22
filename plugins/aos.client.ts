import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // AOS (Animate On Scroll) plugin for smooth scroll animations
  
  if (process.client) {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      console.log('🚫 Animations disabled due to user preference for reduced motion')
      return
    }
    
    // Initialize scroll animations
    const initScrollAnimations = () => {
      // Configuration for scroll animations
      const config = {
        offset: 100, // Trigger animations 100px before element comes into view
        delay: 0, // No delay by default
        duration: 600, // Animation duration
        easing: 'ease-out', // Easing function
        once: true, // Animation happens only once
        mirror: false, // Elements don't animate out while scrolling past them
        anchorPlacement: 'top-bottom' // Defines which position of element and window triggers animation
      }
      
      // Create intersection observer for scroll animations
      const createScrollObserver = () => {
        const observerOptions = {
          root: null,
          rootMargin: `${config.offset}px`,
          threshold: 0.1
        }
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement
            
            if (entry.isIntersecting) {
              // Element is entering viewport
              animateElement(element, 'in')
              
              if (config.once) {
                observer.unobserve(element)
              }
            } else if (config.mirror && !config.once) {
              // Element is leaving viewport (only if mirror is true)
              animateElement(element, 'out')
            }
          })
        }, observerOptions)
        
        return observer
      }
      
      // Animate element function
      const animateElement = (element: HTMLElement, direction: 'in' | 'out') => {
        const animationType = element.getAttribute('data-aos') || 'fade-up'
        const duration = parseInt(element.getAttribute('data-aos-duration') || config.duration.toString())
        const delay = parseInt(element.getAttribute('data-aos-delay') || config.delay.toString())
        
        // Apply animation based on type
        applyAnimation(element, animationType, direction, duration, delay)
      }
      
      // Apply specific animation
      const applyAnimation = (
        element: HTMLElement, 
        animationType: string, 
        direction: 'in' | 'out',
        duration: number,
        delay: number
      ) => {
        // Remove any existing animation classes
        element.classList.remove('aos-animate')
        
        // Apply base styles
        element.style.transition = `all ${duration}ms ${config.easing}`
        element.style.transitionDelay = `${delay}ms`
        
        // Apply animation based on type and direction
        if (direction === 'in') {
          setTimeout(() => {
            element.classList.add('aos-animate')
            applyAnimationStyles(element, animationType, 'in')
          }, 50) // Small delay to ensure styles are applied
        } else {
          element.classList.remove('aos-animate')
          applyAnimationStyles(element, animationType, 'out')
        }
      }
      
      // Apply animation styles
      const applyAnimationStyles = (element: HTMLElement, animationType: string, direction: 'in' | 'out') => {
        const animations: Record<string, { in: any; out: any }> = {
          'fade': {
            in: { opacity: '1' },
            out: { opacity: '0' }
          },
          'fade-up': {
            in: { opacity: '1', transform: 'translateY(0)' },
            out: { opacity: '0', transform: 'translateY(20px)' }
          },
          'fade-down': {
            in: { opacity: '1', transform: 'translateY(0)' },
            out: { opacity: '0', transform: 'translateY(-20px)' }
          },
          'fade-left': {
            in: { opacity: '1', transform: 'translateX(0)' },
            out: { opacity: '0', transform: 'translateX(20px)' }
          },
          'fade-right': {
            in: { opacity: '1', transform: 'translateX(0)' },
            out: { opacity: '0', transform: 'translateX(-20px)' }
          },
          'zoom-in': {
            in: { opacity: '1', transform: 'scale(1)' },
            out: { opacity: '0', transform: 'scale(0.9)' }
          },
          'zoom-out': {
            in: { opacity: '1', transform: 'scale(1)' },
            out: { opacity: '0', transform: 'scale(1.1)' }
          },
          'slide-up': {
            in: { transform: 'translateY(0)' },
            out: { transform: 'translateY(100%)' }
          },
          'slide-down': {
            in: { transform: 'translateY(0)' },
            out: { transform: 'translateY(-100%)' }
          },
          'flip-left': {
            in: { transform: 'perspective(2500px) rotateY(0deg)' },
            out: { transform: 'perspective(2500px) rotateY(-90deg)' }
          },
          'flip-right': {
            in: { transform: 'perspective(2500px) rotateY(0deg)' },
            out: { transform: 'perspective(2500px) rotateY(90deg)' }
          }
        }
        
        const animationStyles = animations[animationType]
        if (animationStyles) {
          const styles = animationStyles[direction]
          Object.assign(element.style, styles)
        }
      }
      
      // Initialize animations for elements with data-aos attributes
      const initializeElements = () => {
        const elements = document.querySelectorAll('[data-aos]')
        const observer = createScrollObserver()
        
        elements.forEach(element => {
          const htmlElement = element as HTMLElement
          
          // Set initial state (out state)
          const animationType = htmlElement.getAttribute('data-aos') || 'fade-up'
          applyAnimationStyles(htmlElement, animationType, 'out')
          
          // Start observing
          observer.observe(htmlElement)
        })
        
        return observer
      }
      
      // Refresh function to reinitialize animations for new elements
      const refresh = () => {
        // Find new elements and initialize them
        setTimeout(initializeElements, 100)
      }
      
      // Initialize animations
      const observer = initializeElements()
      
      // Make refresh function available globally
      window.AOS = {
        refresh,
        observer
      }
      
      console.log('✨ AOS (Animate On Scroll) initialized')
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollAnimations)
    } else {
      initScrollAnimations()
    }
    
    // Reinitialize animations on route changes
    const router = useRouter()
    router.afterEach(() => {
      // Wait for the new page to render
      nextTick(() => {
        if (window.AOS) {
          window.AOS.refresh()
        }
      })
    })
  }
})

// Extend window interface for TypeScript
declare global {
  interface Window {
    AOS?: {
      refresh: () => void
      observer: IntersectionObserver
    }
  }
}