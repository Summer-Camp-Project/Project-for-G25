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

    console.log('=== CHECKING BACKEND AVAILABILITY ===');
    console.log('API Base URL:', this.baseURL);
    console.log('Initial useMockAPI:', this.useMockAPI);

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
        console.log('✅ Backend connected:', data.message || 'Health check passed')
        this.useMockAPI = false
      } else {
        console.warn('❌ Backend health check failed with status:', response.status)
        this.useMockAPI = true
      }
    } catch (error) {
      console.warn('❌ Backend not available, enabling mock API:', error.message)
      this.useMockAPI = true
    }

    this.backendChecked = true
    console.log('Final useMockAPI:', this.useMockAPI);
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
    console.log('API Login attempt with credentials:', { email: credentials.email, password: '***' })

    try {
      await this.checkBackendAvailability()

      if (this.useMockAPI) {
        console.log('Using mock API for login')
        return mockApi.login(credentials)
      }

      console.log('Using real backend for login')
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      console.log('Login successful:', { success: result.success, hasToken: !!result.token, hasUser: !!result.user })
      return result

    } catch (error) {
      console.error('Login failed, falling back to mock API:', error.message)
      // Fallback to mock API if backend fails
      try {
        return mockApi.login(credentials)
      } catch (mockError) {
        console.error('Mock API login also failed:', mockError.message)
        throw new Error('Authentication service unavailable')
      }
    }
  }

  async register(userData) {
    console.log('🌐 API REGISTER: Starting API registration request')
    console.log('📊 API REGISTER: User data received:', {
      ...userData,
      password: '[HIDDEN]'
    })

    await this.checkBackendAvailability()

    if (this.useMockAPI) {
      console.log('🔄 API REGISTER: Using mock API')
      return mockApi.register(userData)
    }

    console.log('🔄 API REGISTER: Using real backend')
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })

    console.log('✅ API REGISTER: Backend response:', {
      success: result?.success,
      hasToken: !!result?.token,
      hasUser: !!result?.user,
      userRole: result?.user?.role,
      userName: result?.user?.name || result?.user?.firstName
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

  // New: explicit admin helpers used by Super Admin UI
  async getAdminStats() {
    if (this.useMockAPI) {
      return mockApi.getSystemStats()
    }
    return this.request('/admin/stats')
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
    return this.request('/admin/users', {
      method: 'POST',
      body: data,
    })
  }

  async updateUser(userId, data) {
    if (this.useMockAPI) {
      return mockApi.updateUser(userId, data)
    }
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteUser(userId) {
    if (this.useMockAPI) {
      return mockApi.deleteUser(userId)
    }
    return this.request(`/admin/users/${userId}`, {
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
    // Force check backend availability before making the call
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      return mockApi.getMuseumProfile()
    }
    // Try to get current user first, then extract museum info
    try {
      const userData = await this.getCurrentUser()
      if (userData?.user?.museumId) {
        const museum = await this.getMuseumById(userData.user.museumId)
        return { museum }
      }
      return { museum: null }
    } catch (error) {
      console.warn('Could not get museum profile:', error.message)
      return { museum: null }
    }
  }

  async updateMuseumProfile(profileData) {
    console.log('=== UPDATE MUSEUM PROFILE API CALL ===');
    console.log('Using mock API:', this.useMockAPI);
    console.log('Profile data:', profileData);

    // Force check backend availability before making the call
    await this.checkBackendAvailability();

    if (this.useMockAPI) {
      console.log('Using mock API for update');
      return mockApi.updateMuseumProfile(profileData)
    }

    console.log('Using real API for update');
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

  // System monitoring
  async getSystemHealth() {
    if (this.useMockAPI) {
      return mockApi.getSystemHealth()
    }
    return this.request('/admin/health')
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