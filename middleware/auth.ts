export default defineNuxtRouteMiddleware((to, from) => {
  // Authentication middleware for protected routes
  
  // This middleware can be used to protect routes that require authentication
  // For now, it's a basic implementation that can be extended later
  
  if (process.client) {
    // Check if user is authenticated
    const isAuthenticated = checkUserAuthentication()
    
    // List of routes that require authentication
    const protectedRoutes = [
      '/admin',
      '/profile',
      '/settings'
    ]
    
    // Check if the current route requires authentication
    const requiresAuth = protectedRoutes.some(route => 
      to.path.startsWith(route)
    )
    
    if (requiresAuth && !isAuthenticated) {
      // Redirect to login page or show authentication modal
      console.log('🔒 Authentication required for:', to.path)
      
      // Store the intended destination
      sessionStorage.setItem('csgo-upgrade-redirect', to.fullPath)
      
      // For now, just redirect to home with a message
      // In a real implementation, you would redirect to a login page
      return navigateTo('/')
    }
    
    // Check for admin routes
    const adminRoutes = ['/admin']
    const requiresAdmin = adminRoutes.some(route => 
      to.path.startsWith(route)
    )
    
    if (requiresAdmin && !checkAdminPermissions()) {
      console.log('🚫 Admin permissions required for:', to.path)
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Forbidden'
      })
    }
  }
})

// Helper function to check user authentication
function checkUserAuthentication(): boolean {
  // Check if user is authenticated
  // This could check for:
  // - JWT token in localStorage/sessionStorage
  // - Session cookie
  // - Pinia store state
  // - API call to verify session
  
  if (process.client) {
    // Check for stored authentication token
    const token = localStorage.getItem('csgo-upgrade-auth-token')
    const userId = localStorage.getItem('csgo-upgrade-user-id')
    
    if (token && userId) {
      // Verify token is still valid (simplified check)
      try {
        // In a real implementation, you would verify the token with your backend
        const tokenData = parseJWT(token)
        const isExpired = tokenData.exp * 1000 < Date.now()
        
        if (isExpired) {
          // Token expired, clear auth data
          clearAuthData()
          return false
        }
        
        return true
      } catch (error) {
        // Invalid token
        clearAuthData()
        return false
      }
    }
  }
  
  return false
}

// Helper function to check admin permissions
function checkAdminPermissions(): boolean {
  if (!checkUserAuthentication()) {
    return false
  }
  
  if (process.client) {
    const userRole = localStorage.getItem('csgo-upgrade-user-role')
    return userRole === 'admin' || userRole === 'superadmin'
  }
  
  return false
}

// Helper function to parse JWT token (simplified)
function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    throw new Error('Invalid JWT token')
  }
}

// Helper function to clear authentication data
function clearAuthData(): void {
  if (process.client) {
    localStorage.removeItem('csgo-upgrade-auth-token')
    localStorage.removeItem('csgo-upgrade-user-id')
    localStorage.removeItem('csgo-upgrade-user-role')
    localStorage.removeItem('csgo-upgrade-user-data')
    sessionStorage.removeItem('csgo-upgrade-redirect')
  }
}

// Helper function to set authentication data
export function setAuthData(authData: {
  token: string
  userId: string
  role: string
  userData?: any
}): void {
  if (process.client) {
    localStorage.setItem('csgo-upgrade-auth-token', authData.token)
    localStorage.setItem('csgo-upgrade-user-id', authData.userId)
    localStorage.setItem('csgo-upgrade-user-role', authData.role)
    
    if (authData.userData) {
      localStorage.setItem('csgo-upgrade-user-data', JSON.stringify(authData.userData))
    }
  }
}

// Helper function to get redirect URL after authentication
export function getAuthRedirect(): string {
  if (process.client) {
    const redirect = sessionStorage.getItem('csgo-upgrade-redirect')
    sessionStorage.removeItem('csgo-upgrade-redirect')
    return redirect || '/'
  }
  return '/'
}

// Helper function to get current user data
export function getCurrentUser(): any {
  if (!checkUserAuthentication()) {
    return null
  }
  
  if (process.client) {
    try {
      const userData = localStorage.getItem('csgo-upgrade-user-data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  
  return null
}

// Helper function to check specific permissions
export function hasPermission(permission: string): boolean {
  const user = getCurrentUser()
  if (!user) return false
  
  // Check if user has specific permission
  return user.permissions?.includes(permission) || false
}

// Helper function to logout user
export function logout(): void {
  clearAuthData()
  
  // Clear any user-related stores
  if (process.client) {
    // You could also clear user-specific data from Pinia stores here
    const balanceStore = useBalanceStore()
    balanceStore.setBalance(0)
    
    // Redirect to home page
    navigateTo('/')
  }
}