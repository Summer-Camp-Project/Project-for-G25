import { api } from '../utils/api.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('token');
  }

  /**
   * Login user with credentials
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} User and token data
   */
  async login(credentials) {
    try {
      const response = await api.login(credentials);
      
      if (response.token) {
        this.token = response.token;
        this.currentUser = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user data
   */
  async register(userData) {
    try {
      const response = await api.register(userData);
      
      if (response.token) {
        this.token = response.token;
        this.currentUser = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object|null>} Current user data
   */
  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      if (!this.currentUser) {
        const response = await api.getCurrentUser();
        this.currentUser = response.user || response;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      }
      return this.currentUser;
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Role check result
   */
  hasRole(role) {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Array of roles to check
   * @returns {boolean} Role check result
   */
  hasAnyRole(roles) {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return roles.includes(this.currentUser?.role);
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await api.updateUser(this.currentUser.id, userData);
      this.currentUser = { ...this.currentUser, ...response.user };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise<Object>} Password change result
   */
  async changePassword(passwordData) {
    try {
      const response = await api.request('/auth/change-password', {
        method: 'POST',
        body: passwordData
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request result
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.request('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.request('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword }
      });
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Verification result
   */
  async verifyEmail(token) {
    try {
      const response = await api.request('/auth/verify-email', {
        method: 'POST',
        body: { token }
      });
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
}

export default new AuthService();
