import mockApi from './mockApi.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.useMockAPI = USE_MOCK_API
    this.backendChecked = false
    // Check backend availability on initialization
    this.checkBackendAvailability()
  }

  async checkBackendAvailability() {
    if (this.backendChecked) return !this.useMockAPI

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        this.useMockAPI = false
      } else {
        this.useMockAPI = true
      }
    } catch (error) {
      this.useMockAPI = true
    }

    this.backendChecked = true
    return !this.useMockAPI
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      let data

      try {
        data = await response.json()
      } catch (parseError) {
        // If response is not JSON, use the text
        data = { message: await response.text() }
      }

      if (!response.ok) {
        // Extract more specific error message
        const errorMessage = data?.error?.message || data?.message || `HTTP ${response.status}: ${response.statusText}`
        console.error('API Error:', { url, status: response.status, error: data })
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error('API request failed:', { url, error: error.message })
      throw error
    }
  }

  // Auth endpoints
  async login(credentials) {
    try {
      await this.checkBackendAvailability()

      if (this.useMockAPI) {
        return mockApi.login(credentials)
      }

      const result = await this.request('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      return result

    } catch (error) {
      // Don't fall back to mock API for authentication errors (4xx)
      // Only fall back for network/server errors (5xx)
      if (error.message.includes('Invalid email or password') || 
          error.message.includes('User not found') ||
          error.message.includes('400') ||
          error.message.includes('401') ||
          error.message.includes('403')) {
        // These are authentication errors, don't fall back
        throw error
      }
      
      // Fall back to mock API only for network/server errors
      try {
        return mockApi.login(credentials)
      } catch (mockError) {
        throw new Error('Authentication service unavailable')
      }
    }
  }

  async register(userData) {
    await this.checkBackendAvailability()

    if (this.useMockAPI) {
      return mockApi.register(userData)
    }

    const result = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })

    return result
  }

  async logout() {
    if (this.useMockAPI) {
      return mockApi.logout()
    }

    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async refreshToken(refreshToken) {
    if (this.useMockAPI) {
      // Mock API doesn't need refresh tokens, return current session
      const token = localStorage.getItem('token')
      if (token) {
        return { token, success: true }
      }
      throw new Error('No valid session')
    }

    return this.request('/auth/refresh', {
      method: 'POST',
      body: { refreshToken }
    })
  }

  async getCurrentUser() {
    try {
      if (this.useMockAPI) {
        const token = localStorage.getItem('token')
        return mockApi.getCurrentUser(token)
      }

      const result = await this.request('/auth/me')

      // Ensure we return the expected structure
      if (result && typeof result === 'object') {
        // If the result already has a 'user' property, return as-is
        if (result.user) {
          return result
        }
        // If the result IS the user object, wrap it
        if (result.id || result.email) {
          return { user: result }
        }
      }

      // If we get here, the result is unexpected
      console.warn('Unexpected response structure from getCurrentUser:', result)
      return { user: null }

    } catch (error) {
      console.error('getCurrentUser failed:', error)

      // If token is invalid, clear it and throw error
      if (error.message.includes('Token is not valid') || error.message.includes('invalid token')) {
        console.warn('Invalid token detected, clearing localStorage')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      // Try fallback to mock API if real API fails
      try {
        const token = localStorage.getItem('token')
        if (token) {
          return mockApi.getCurrentUser(token)
        }
      } catch (mockError) {
        console.error('Mock API fallback also failed:', mockError)
      }

      throw error
    }
  }


  // Museum endpoints (align with backend /api/museums)
  async getMuseums() {
    return this.request('/museums')
  }

  async getMuseumById(id) {
    return this.request(`/museums/${id}`)
  }

  async createMuseum(museumData) {
    return this.request('/museums', {
      method: 'POST',
      body: museumData,
    })
  }

  async updateMuseum(id, museumData) {
    return this.request(`/museums/${id}`, {
      method: 'PUT',
      body: museumData,
    })
  }

  async deleteMuseum(id) {
    return this.request(`/museums/${id}`, {
      method: 'DELETE',
    })
  }

  // Artifact endpoints (align with backend /api/artifacts)
  async getArtifacts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/artifacts${queryParams ? `?${queryParams}` : ''}`)
  }

  async getArtifactById(id) {
    return this.request(`/artifacts/${id}`)
  }

  async createArtifact(artifactData) {
    return this.request('/artifacts', {
      method: 'POST',
      body: artifactData,
    })
  }

  async updateArtifact(id, artifactData) {
    return this.request(`/artifacts/${id}`, {
      method: 'PUT',
      body: artifactData,
    })
  }

  async deleteArtifact(id) {
    return this.request(`/artifacts/${id}`, {
      method: 'DELETE',
    })
  }

  async uploadArtifactImages(id, images) {
    const formData = new FormData()
    images.forEach((file) => formData.append('images', file))

    const token = localStorage.getItem('token')
    const response = await fetch(`${this.baseURL}/artifacts/${id}/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      let message = 'Image upload failed'
      try {
        const errJson = await response.json()
        message = errJson?.error?.message || errJson?.message || message
      } catch { }
      throw new Error(message)
    }
    return response.json()
  }

  async updateArtifactImages(id, images) {
    const formData = new FormData()
    images.forEach((file) => formData.append('images', file))

    const token = localStorage.getItem('token')
    const response = await fetch(`${this.baseURL}/artifacts/${id}/images`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      let message = 'Image update failed'
      try {
        const errJson = await response.json()
        message = errJson?.error?.message || errJson?.message || message
      } catch { }
      throw new Error(message)
    }
    return response.json()
  }

  async uploadArtifactModel(id, modelFile) {
    const formData = new FormData()
    formData.append('model', modelFile)

    const token = localStorage.getItem('token')
    const response = await fetch(`${this.baseURL}/artifacts/${id}/model`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const err = await response.text().catch(() => '')
      throw new Error(err || '3D model upload failed')
    }
    return response.json()
  }

  async updateArtifactStatus(id, status) {
    return this.request(`/artifacts/${id}/status`, {
      method: 'PUT',
      body: { status },
    })
  }

  async toggleArtifactFeatured(id, featured) {
    return this.request(`/artifacts/${id}/featured`, {
      method: 'PUT',
      body: { featured },
    })
  }

  // Tours endpoints
  async getTours() {
    return this.request('/tours')
  }

  async getTourById(id) {
    return this.request(`/tours/${id}`)
  }

  async createTour(tourData) {
    return this.request('/tours', {
      method: 'POST',
      body: tourData,
    })
  }

  async bookTour(tourId, bookingData) {
    return this.request(`/tours/${tourId}/book`, {
      method: 'POST',
      body: bookingData,
    })
  }

  // Public booking endpoints (for customers)
  async createPublicBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    })
  }

  // Public message endpoints (for customer inquiries)
  async createCustomerMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: messageData,
    })
  }

  // Map endpoints
  async getSites() {
    return this.request('/map/sites')
  }

  async getSiteById(id) {
    return this.request(`/map/sites/${id}`)
  }

  // Chat endpoints
  async getChatHistory(userId) {
    return this.request(`/chat/history/${userId}`)
  }

  async sendMessage(messageData) {
    return this.request('/chat/message', {
      method: 'POST',
      body: messageData,
    })
  }

  // Admin endpoints
  async getUsers() {
    if (this.useMockAPI) {
      return mockApi.getUsers()
    }
    return this.request('/admin/users')
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role },
    })
  }


  async getSystemStats() {
    if (this.useMockAPI) {
      return mockApi.getSystemStats()
    }
    return this.request('/admin/stats')
  }

  // New: Super Admin API endpoints for enhanced dashboard
  async getSuperAdminDashboard() {
    if (this.useMockAPI) {
      return mockApi.getSystemStats()
    }
    return this.request('/super-admin/dashboard')
  }

  async getSuperAdminAnalytics(params = {}) {
    if (this.useMockAPI) {
      return mockApi.getSystemStats()
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/analytics?${queryParams}`)
  }

  async getSuperAdminAuditLogs(params = {}) {
    if (this.useMockAPI) {
      return { success: true, logs: [], pagination: { total: 0, page: 1, limit: 50, pages: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/audit-logs?${queryParams}`)
  }

  async getSuperAdminAuditLogsSummary(params = {}) {
    if (this.useMockAPI) {
      return { success: true, summary: { totalActions: 0, successRate: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/audit-logs/summary?${queryParams}`)
  }

  // Legacy method for backward compatibility
  async getAdminStats() {
    return this.getSuperAdminDashboard()
  }

  // Performance Analytics API endpoints
  async getPerformanceOverview(params = {}) {
    if (this.useMockAPI) {
      return mockApi.getSystemStats()
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/overview?${queryParams}`)
  }

  async getSystemHealth(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { systemMetrics: {}, apiMetrics: {}, dbMetrics: {} } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/system-health?${queryParams}`)
  }

  async getUserActivityMetrics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { activityTrends: [], userDemographics: [], peakHours: [] } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/user-activity?${queryParams}`)
  }

  async getMuseumPerformanceMetrics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { topMuseums: [], performanceTrends: [], museumStats: [] } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/museum-performance?${queryParams}`)
  }

  async getArtifactPerformanceMetrics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { performanceTrends: [], topArtifacts: [], categoryPerformance: [] } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/artifact-performance?${queryParams}`)
  }

  async getRentalPerformanceMetrics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { rentalTrends: [], rentalStats: [], topRentedItems: [] } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/rental-performance?${queryParams}`)
  }

  async getApiPerformanceMetrics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, data: { apiTrends: [], endpointPerformance: [], errorAnalysis: [] } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance-analytics/api-performance?${queryParams}`)
  }

  // Enhanced User Management API endpoints
  async bulkUserActions(action, userIds, data = {}) {
    if (this.useMockAPI) {
      return { success: true, message: 'Bulk action completed', modifiedCount: userIds.length }
    }
    return this.request('/super-admin/users/bulk-actions', {
      method: 'POST',
      body: { action, userIds, data }
    })
  }

  async getUserStatistics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, statistics: { totalUsers: 0, activeUsers: 0, newUsers: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/users/statistics?${queryParams}`)
  }

  async searchUsers(params = {}) {
    if (this.useMockAPI) {
      return { success: true, users: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/users/search?${queryParams}`)
  }

  // Enhanced Museum Oversight API endpoints
  async getMuseumStatistics(params = {}) {
    if (this.useMockAPI) {
      return { success: true, statistics: { totalMuseums: 0, activeMuseums: 0, pendingMuseums: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/museums/statistics?${queryParams}`)
  }

  async bulkMuseumActions(action, museumIds, data = {}) {
    if (this.useMockAPI) {
      return { success: true, message: 'Bulk action completed', modifiedCount: museumIds.length }
    }
    return this.request('/super-admin/museums/bulk-actions', {
      method: 'POST',
      body: { action, museumIds, data }
    })
  }

  async searchMuseums(params = {}) {
    if (this.useMockAPI) {
      return { success: true, museums: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/museums/search?${queryParams}`)
  }

  async getMuseumPerformance(params = {}) {
    if (this.useMockAPI) {
      return { success: true, performance: { museumStats: [], artifactStats: { total: 0, active: 0 } } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/museums/performance?${queryParams}`)
  }

  async getMuseumAuditLogs(params = {}) {
    if (this.useMockAPI) {
      return { success: true, logs: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } }
    }
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/museums/audit-logs?${queryParams}`)
  }

  async listUsers({ page = 1, limit = 20, role } = {}) {
    if (this.useMockAPI) {
      return mockApi.listUsers({ page, limit, role })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (role) q.set('role', role)
    return this.request(`/admin/users?${q.toString()}`)
  }

  async setUserRole(userId, role) {
    if (this.useMockAPI) {
      return mockApi.setUserRole(userId, role)
    }
    return this.updateUserRole(userId, role)
  }

  async createUser(data) {
    if (this.useMockAPI) {
      return mockApi.createUser(data)
    }
    return this.request('/super-admin/users', {
      method: 'POST',
      body: data,
    })
  }

  async updateUser(userId, data) {
    if (this.useMockAPI) {
      return mockApi.updateUser(userId, data)
    }
    return this.request(`/super-admin/users/${userId}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteUser(userId) {
    if (this.useMockAPI) {
      return mockApi.deleteUser(userId)
    }
    return this.request(`/super-admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Museums oversight
  async listMuseums({ page = 1, limit = 20 } = {}) {
    if (this.useMockAPI) {
      return mockApi.listMuseums({ page, limit })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    return this.request(`/admin/museums?${q.toString()}`)
  }

  async setMuseumVerified(userId, verified) {
    if (this.useMockAPI) {
      return mockApi.setMuseumVerified(userId, verified)
    }
    return this.request(`/admin/museums/${userId}/verify`, {
      method: 'PUT',
      body: { verified },
    })
  }

  // System management
  async getSystemSettings() {
    if (this.useMockAPI) {
      return mockApi.getSystemSettings()
    }
    return this.request('/admin/settings')
  }

  async updateSystemSettings(settings) {
    if (this.useMockAPI) {
      return mockApi.updateSystemSettings(settings)
    }
    return this.request('/admin/settings', {
      method: 'PUT',
      body: settings,
    })
  }

  // Content moderation (multi-type)
  async listContent({ page = 1, limit = 20, status, type, museum, q } = {}) {
    if (this.useMockAPI) {
      return mockApi.listContent({ page, limit, status, type, museum, q })
    }
    const qparams = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) qparams.set('status', status)
    if (type) qparams.set('type', type)
    if (museum) qparams.set('museum', museum)
    if (q) qparams.set('q', q)
    return this.request(`/admin/content?${qparams.toString()}`)
  }

  async approveContent(contentId, contentType) {
    if (this.useMockAPI) {
      return mockApi.approveContent(contentId, contentType)
    }
    return this.request(`/admin/content/${contentType}/${contentId}/approve`, { method: 'PUT' })
  }

  async rejectContent(contentId, contentType, reason = '') {
    if (this.useMockAPI) {
      return mockApi.rejectContent(contentId, contentType, reason)
    }
    return this.request(`/admin/content/${contentType}/${contentId}/reject`, { method: 'PUT', body: { reason } })
  }

  // Museum Admin endpoints
  async getMuseumProfile() {
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return mockApi.getMuseumProfile()
    }

    return this.request('/museums/profile', {
      method: 'GET',
    });
  }

  async updateMuseumProfile(profileData) {
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return mockApi.updateMuseumProfile(profileData)
    }

    return this.request('/museums/profile', {
      method: 'PUT',
      body: profileData,
    })
  }

  async uploadMuseumLogo(logoFile) {
    if (this.useMockAPI) {
      return mockApi.uploadMuseumLogo(logoFile)
    }

    const formData = new FormData()
    formData.append('logo', logoFile)

    const token = localStorage.getItem('token')
    const response = await fetch(`${this.baseURL}/museums/profile/logo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      let message = 'Logo upload failed'
      try {
        const errJson = await response.json()
        message = errJson?.error?.message || errJson?.message || message
      } catch { }
      throw new Error(message)
    }
    return response.json()
  }

  // Museum Dashboard endpoints
  async getMuseumDashboardStats() {
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return {
        totalArtifacts: 45,
        artifactsInStorage: 12,
        activeRentals: 3,
        monthlyVisitors: 0
      }
    }

    return this.request('/museums/dashboard/stats', {
      method: 'GET',
    });
  }

  async getRecentArtifacts() {
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return [
        { id: 1, name: 'Ancient Vase', status: 'on_display', lastUpdated: '2025-08-01' },
        { id: 2, name: 'Historical Painting', status: 'in_storage', lastUpdated: '2025-08-05' }
      ]
    }

    return this.request('/museums/dashboard/recent-artifacts', {
      method: 'GET',
    });
  }

  async getPendingTasks() {
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return [
        { id: 1, type: 'rental_request', title: '3 Rental requests awaiting approval', priority: 'medium' },
        { id: 2, type: 'draft_event', title: '2 Virtual museum submissions in review', priority: 'low' },
        { id: 3, type: 'staff_approval', title: '1 New staff member to onboard', priority: 'high' }
      ]
    }

    return this.request('/museums/dashboard/pending-tasks', {
      method: 'GET',
    });
  }

  async getMuseumArtifacts({ page = 1, limit = 20, category, search } = {}) {
    if (this.useMockAPI) {
      return mockApi.getMuseumArtifacts({ page, limit, category, search })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (category) q.set('category', category)
    if (search) q.set('search', search)
    return this.request(`/museum-admin/artifacts?${q.toString()}`)
  }

  async createMuseumArtifact(artifactData) {
    if (this.useMockAPI) {
      return mockApi.createMuseumArtifact(artifactData)
    }
    return this.request('/museum-admin/artifacts', {
      method: 'POST',
      body: artifactData,
    })
  }

  async updateMuseumArtifact(id, artifactData) {
    if (this.useMockAPI) {
      return mockApi.updateMuseumArtifact(id, artifactData)
    }
    return this.request(`/museum-admin/artifacts/${id}`, {
      method: 'PUT',
      body: artifactData,
    })
  }

  async deleteMuseumArtifact(id) {
    if (this.useMockAPI) {
      return mockApi.deleteMuseumArtifact(id)
    }
    return this.request(`/museum-admin/artifacts/${id}`, {
      method: 'DELETE',
    })
  }

  async getMuseumAnalytics() {
    if (this.useMockAPI) {
      return mockApi.getMuseumAnalytics()
    }
    return this.request('/museum-admin/analytics')
  }

  async submitVirtualMuseum(submissionData) {
    if (this.useMockAPI) {
      return mockApi.submitVirtualMuseum(submissionData)
    }
    return this.request('/museum-admin/virtual-submissions', {
      method: 'POST',
      body: submissionData,
    })
  }

  async getVirtualSubmissions({ page = 1, limit = 20, status } = {}) {
    if (this.useMockAPI) {
      return mockApi.getVirtualSubmissions({ page, limit, status })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) q.set('status', status)
    return this.request(`/museum-admin/virtual-submissions?${q.toString()}`)
  }

  // User/Visitor endpoints
  async getUserProfile() {
    if (this.useMockAPI) {
      return mockApi.getUserProfile()
    }
    return this.request('/user/profile')
  }

  async updateUserProfile(profileData) {
    if (this.useMockAPI) {
      return mockApi.updateUserProfile(profileData)
    }
    return this.request('/user/profile', {
      method: 'PUT',
      body: profileData,
    })
  }

  async getVirtualExhibits({ search, category, museum } = {}) {
    if (this.useMockAPI) {
      return mockApi.getVirtualExhibits({ search, category, museum })
    }
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (category) q.set('category', category)
    if (museum) q.set('museum', museum)
    return this.request(`/user/virtual-exhibits?${q.toString()}`)
  }

  async getHeritageSites({ search, region } = {}) {
    if (this.useMockAPI) {
      return mockApi.getHeritageSites({ search, region })
    }
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (region) q.set('region', region)
    return this.request(`/user/heritage-sites?${q.toString()}`)
  }

  // Super Admin Heritage Sites API methods
  async getSuperAdminHeritageSites(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return this.request(`/super-admin/heritage-sites?${queryParams.toString()}`);
  }

  async getHeritageSiteStatistics(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return this.request(`/super-admin/heritage-sites/statistics?${queryParams.toString()}`);
  }

  async searchHeritageSites(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return this.request(`/super-admin/heritage-sites/search?${queryParams.toString()}`);
  }

  async bulkHeritageSiteActions(action, siteIds, data = {}) {
    return this.request('/super-admin/heritage-sites/bulk-actions', {
      method: 'POST',
      body: JSON.stringify({ action, siteIds, data })
    });
  }

  async getHeritageSitePerformance(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return this.request(`/super-admin/heritage-sites/performance?${queryParams.toString()}`);
  }

  async getHeritageSiteAuditLogs(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return this.request(`/super-admin/heritage-sites/audit-logs?${queryParams.toString()}`);
  }

  // Heritage Site CRUD Operations
  async createHeritageSite(data) {
    if (this.useMockAPI) {
      return mockApi.createHeritageSite(data);
    }
    return this.request('/super-admin/heritage-sites', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateHeritageSite(siteId, data) {
    if (this.useMockAPI) {
      return mockApi.updateHeritageSite(siteId, data);
    }
    return this.request(`/super-admin/heritage-sites/${siteId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteHeritageSite(siteId) {
    if (this.useMockAPI) {
      return mockApi.deleteHeritageSite(siteId);
    }
    return this.request(`/super-admin/heritage-sites/${siteId}`, {
      method: 'DELETE'
    });
  }

  async getHeritageSite(siteId) {
    if (this.useMockAPI) {
      return mockApi.getHeritageSite(siteId);
    }
    return this.request(`/super-admin/heritage-sites/${siteId}`);
  }

  async getUserArtifacts({ page = 1, limit = 20, search, category, museum } = {}) {
    if (this.useMockAPI) {
      return mockApi.getUserArtifacts({ page, limit, search, category, museum })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) q.set('search', search)
    if (category) q.set('category', category)
    if (museum) q.set('museum', museum)
    return this.request(`/user/artifacts?${q.toString()}`)
  }

  async getUpcomingEvents({ search, date, museum } = {}) {
    if (this.useMockAPI) {
      return mockApi.getUpcomingEvents({ search, date, museum })
    }
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (date) q.set('date', date)
    if (museum) q.set('museum', museum)
    return this.request(`/user/events?${q.toString()}`)
  }

  async bookTicket(bookingData) {
    if (this.useMockAPI) {
      return mockApi.bookTicket(bookingData)
    }
    return this.request('/user/bookings/ticket', {
      method: 'POST',
      body: bookingData,
    })
  }

  async registerForEvent(eventId, registrationData) {
    if (this.useMockAPI) {
      return mockApi.registerForEvent(eventId, registrationData)
    }
    return this.request(`/user/events/${eventId}/register`, {
      method: 'POST',
      body: registrationData,
    })
  }

  async requestArtifactRental(artifactId, rentalData) {
    if (this.useMockAPI) {
      return mockApi.requestArtifactRental(artifactId, rentalData)
    }
    return this.request(`/user/rentals/${artifactId}`, {
      method: 'POST',
      body: rentalData,
    })
  }

  async getUserBookings({ page = 1, limit = 20, status } = {}) {
    if (this.useMockAPI) {
      return mockApi.getUserBookings({ page, limit, status })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) q.set('status', status)
    return this.request(`/user/bookings?${q.toString()}`)
  }

  async addToFavorites(itemId, itemType) {
    if (this.useMockAPI) {
      return mockApi.addToFavorites(itemId, itemType)
    }
    return this.request('/user/favorites', {
      method: 'POST',
      body: { itemId, itemType },
    })
  }

  async removeFromFavorites(itemId) {
    if (this.useMockAPI) {
      return mockApi.removeFromFavorites(itemId)
    }
    return this.request(`/user/favorites/${itemId}`, {
      method: 'DELETE',
    })
  }

  async getUserFavorites() {
    if (this.useMockAPI) {
      return mockApi.getUserFavorites()
    }
    return this.request('/user/favorites')
  }

  async submitReview(itemId, itemType, reviewData) {
    if (this.useMockAPI) {
      return mockApi.submitReview(itemId, itemType, reviewData)
    }
    return this.request(`/user/reviews`, {
      method: 'POST',
      body: { itemId, itemType, ...reviewData },
    })
  }

  async getUserReviews() {
    if (this.useMockAPI) {
      return mockApi.getUserReviews()
    }
    return this.request('/user/reviews')
  }

  // Artifacts management
  async listArtifacts({ page = 1, limit = 20, status } = {}) {
    if (this.useMockAPI) {
      return mockApi.listArtifacts({ page, limit, status })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) q.set('status', status)
    return this.request(`/admin/artifacts?${q.toString()}`)
  }

  async approveArtifact(artifactId) {
    if (this.useMockAPI) {
      return mockApi.approveArtifact(artifactId)
    }
    return this.request(`/admin/artifacts/${artifactId}/approve`, {
      method: 'PUT',
    })
  }

  async rejectArtifact(artifactId, reason = '') {
    if (this.useMockAPI) {
      return mockApi.rejectArtifact(artifactId, reason)
    }
    return this.request(`/admin/artifacts/${artifactId}/reject`, {
      method: 'PUT',
      body: { reason },
    })
  }


  async getActivityLogs({ page = 1, limit = 50 } = {}) {
    if (this.useMockAPI) {
      return mockApi.getActivityLogs({ page, limit })
    }
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    return this.request(`/admin/activity-logs?${q.toString()}`)
  }

  // Analytics
  async getAnalytics(timeRange = 'month') {
    if (this.useMockAPI) {
      return mockApi.getAnalytics(timeRange)
    }
    return this.request(`/admin/analytics?timeRange=${timeRange}`)
  }

  // Backup and maintenance
  async createBackup() {
    if (this.useMockAPI) {
      return mockApi.createBackup()
    }
    return this.request('/admin/backup', {
      method: 'POST',
    })
  }

  // Standard HTTP methods for general API usage
  async get(url, params = {}) {
    const queryString = Object.keys(params).length > 0 ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`${url}${queryString}`, {
      method: 'GET'
    });
  }

  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: data
    });
  }

  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: data
    });
  }

  async delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  }

  // Course/Education endpoints
  async getCourses(filters = {}) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        const params = new URLSearchParams(filters);
        const endpoint = `/education/public/courses?${params.toString()}`;
        return mockApi.getCourses(endpoint);
      }
      
      const params = new URLSearchParams(filters);
      return this.request(`/learning/courses?${params.toString()}`);
    } catch (error) {
      // Fallback to mock API on error
      const params = new URLSearchParams(filters);
      const endpoint = `/education/public/courses?${params.toString()}`;
      return mockApi.getCourses(endpoint);
    }
  }

  async getCourseById(courseId) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.getCourseById(courseId);
      }
      
      return this.request(`/learning/courses/${courseId}`);
    } catch (error) {
      return mockApi.getCourseById(courseId);
    }
  }

  async getCourseLessons(courseId) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.getCourseLessons(courseId);
      }
      
      return this.request(`/learning/courses/${courseId}/lessons`);
    } catch (error) {
      return mockApi.getCourseLessons(courseId);
    }
  }

  async enrollInCourse(courseId) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.enrollInCourse(courseId);
      }
      
      return this.request(`/learning/courses/${courseId}/enroll`, {
        method: 'POST'
      });
    } catch (error) {
      return mockApi.enrollInCourse(courseId);
    }
  }

  async getCourseProgress(courseId) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.getCourseProgress(courseId);
      }
      
      return this.request(`/learning/courses/${courseId}/progress`);
    } catch (error) {
      return mockApi.getCourseProgress(courseId);
    }
  }

  async updateLessonProgress(courseId, lessonId, completed = true) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.updateLessonProgress(courseId, lessonId, completed);
      }
      
      return this.request(`/learning/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: 'PUT',
        body: { completed }
      });
    } catch (error) {
      return mockApi.updateLessonProgress(courseId, lessonId, completed);
    }
  }

  // Course management for educators
  async createCourse(courseData) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.createCourse(courseData);
      }
      
      return this.request('/learning/courses', {
        method: 'POST',
        body: courseData
      });
    } catch (error) {
      return mockApi.createCourse(courseData);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.updateCourse(courseId, courseData);
      }
      
      return this.request(`/learning/courses/${courseId}`, {
        method: 'PUT',
        body: courseData
      });
    } catch (error) {
      return mockApi.updateCourse(courseId, courseData);
    }
  }

  async deleteCourse(courseId) {
    try {
      await this.checkBackendAvailability();
      
      if (this.useMockAPI) {
        return mockApi.deleteCourse(courseId);
      }
      
      return this.request(`/learning/courses/${courseId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return mockApi.deleteCourse(courseId);
    }
  }

  // File upload
  async uploadFile(file, type = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const token = localStorage.getItem('token')

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  }
}

export const api = new ApiClient()
export default api
