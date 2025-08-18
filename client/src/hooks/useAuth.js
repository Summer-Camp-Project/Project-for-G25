import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await api.getCurrentUser()
          // Add null check for userData and userData.user
          if (userData && userData.user) {
            setUser(userData.user)
          } else {
            console.warn('No user data received from API')
            // Clear invalid tokens
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          }
        } catch (error) {
          console.error('Failed to get user data:', error)
          // Clear invalid tokens
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      const { token, user } = response
      
      localStorage.setItem('token', token)
      setUser(user)
      
      // Check if there's a redirect URL stored
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin')
        navigate(redirectUrl)
        return { success: true }
      }
      
      // Default redirect based on role
      switch (user.role) {
        case 'super_admin':
          navigate('/super-admin')
          break
        case 'admin':
          navigate('/admin')
          break
        case 'museum':
        case 'museum_admin':
          navigate('/museum-dashboard')
          break
        case 'organizer':
          navigate('/organizer-dashboard')
          break
        case 'visitor':
        default:
          navigate('/visitor-dashboard')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, message: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Force role to visitor on registration
      const payload = { ...userData, role: 'visitor' }
      const response = await api.register(payload)
      const { token, user } = response
      
      localStorage.setItem('token', token)
      setUser(user)
      
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'super_admin':
          navigate('/super-admin')
          break
        case 'admin':
          navigate('/admin')
          break
        case 'museum':
        case 'museum_admin':
          navigate('/museum-dashboard')
          break
        case 'organizer':
          navigate('/organizer-dashboard')
          break
        case 'visitor':
        default:
          navigate('/visitor-dashboard')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      navigate('/')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}