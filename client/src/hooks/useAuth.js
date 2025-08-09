import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Create auth context
const AuthContext = createContext();

// Role definitions
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MUSEUM_ADMIN: 'museum_admin',
  CURATOR: 'curator',
  RESEARCHER: 'researcher',
  VISITOR: 'visitor',
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.MUSEUM_ADMIN]: 80,
  [ROLES.CURATOR]: 60,
  [ROLES.RESEARCHER]: 40,
  [ROLES.VISITOR]: 20,
};

// Protected routes configuration
const protectedRoutes = {
  [ROLES.SUPER_ADMIN]: [
    '/admin-dashboard',
    '/user-management',
    '/system-settings',
    '/reports',
  ],
  [ROLES.MUSEUM_ADMIN]: [
    '/museum-dashboard',
    '/artifacts',
    '/exhibitions',
    '/reports',
  ],
  [ROLES.CURATOR]: [
    '/curator-dashboard',
    '/artifacts',
    '/collections',
  ],
  [ROLES.RESEARCHER]: [
    '/research-dashboard',
    '/artifacts',
    '/research-papers',
  ],
  [ROLES.VISITOR]: [
    '/',
    '/artifacts',
    '/exhibitions',
  ],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          // Verify token with backend
          const response = await axios.get('/api/auth/verify-token', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          if (response.data.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            // Token is invalid, clear storage
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      
      // Set auth state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect based on role
      redirectBasedOnRole(user.role);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    // Clear auth state
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    router.push('/login');
  }, [router]);

  // Redirect user based on their role
  const redirectBasedOnRole = (role) => {
    const defaultRoutes = {
      [ROLES.SUPER_ADMIN]: '/admin-dashboard',
      [ROLES.MUSEUM_ADMIN]: '/museum-dashboard',
      [ROLES.CURATOR]: '/curator-dashboard',
      [ROLES.RESEARCHER]: '/research-dashboard',
      [ROLES.VISITOR]: '/',
    };
    
    router.push(defaultRoutes[role] || '/');
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    // Super admin has access to everything
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check role hierarchy
    return ROLE_HIERARCHY[user.role] >= (ROLE_HIERARCHY[requiredRole] || 0);
  };

  // Check if user has any of the required roles
  const hasAnyRole = (roles = []) => {
    if (!user || !user.role) return false;
    return roles.some(role => hasRole(role));
  };

  // Check if user has permission to access a route
  const hasRoutePermission = (path) => {
    if (!user || !user.role) return false;
    
    // Super admin has access to all routes
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check if the path is in the user's allowed routes
    const userRoutes = protectedRoutes[user.role] || [];
    return userRoutes.some(route => path.startsWith(route));
  };

  // Check if current user is the owner of a resource
  const isOwner = (resourceUserId) => {
    if (!user || !user.id) return false;
    return user.id === resourceUserId;
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  // Refresh user data from the server
  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      updateUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasRoutePermission,
    isOwner,
    updateUser,
    refreshUser,
    ROLES,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-Order Component for protecting routes
export const withAuth = (WrappedComponent, options = {}) => {
  const { requiredRole, redirectTo = '/login' } = options;
  
  return (props) => {
    const { isAuthenticated, hasRole, isLoading, user, router } = useAuth();
    
    useEffect(() => {
      if (!isLoading) {
        // Redirect if not authenticated
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }
        
        // Check role if required
        if (requiredRole && !hasRole(requiredRole)) {
          router.push('/unauthorized');
        }
      }
    }, [isAuthenticated, isLoading, hasRole, requiredRole, router]);
    
    if (isLoading || !isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
};

export default useAuth;