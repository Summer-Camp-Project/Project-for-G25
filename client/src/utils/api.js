const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
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
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Super Admin endpoints
  async getUsers() {
    return this.request('/admin/users')
  }

  async getSystemStats() {
    return this.request('/admin/stats')
  }

  async getSuperAdminDashboard() {
    return this.request('/super-admin/dashboard')
  }

  async getSuperAdminAnalytics(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/analytics?${queryParams}`)
  }

  async getPerformanceOverview(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/super-admin/performance?${queryParams}`)
  }

  // User management
  async listUsers({ page = 1, limit = 20, role } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (role) q.append('role', role)
    return this.request(`/super-admin/users?${q}`)
  }

  async setUserRole(userId, role) {
    return this.updateUserRole(userId, role)
  }

  async updateUserRole(userId, role) {
    return this.request(`/super-admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role },
    })
  }

  async createUser(data) {
    return this.request('/super-admin/users', {
      method: 'POST',
      body: data,
    })
  }

  async updateUser(userId, data) {
    return this.request(`/super-admin/users/${userId}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteUser(userId) {
    return this.request(`/super-admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Museum management
  async listMuseums({ page = 1, limit = 20 } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    return this.request(`/super-admin/museums?${q}`)
  }

  async setMuseumVerified(userId, verified) {
    return this.request(`/admin/museums/${userId}/verify`, {
      method: 'PUT',
      body: { verified },
    })
  }

  // System settings
  async getSystemSettings() {
    return this.request('/admin/settings')
  }

  async updateSystemSettings(settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: settings,
    })
  }

  // Content management
  async listContent({ page = 1, limit = 20, status, type, museum, q } = {}) {
    const qparams = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) qparams.append('status', status)
    if (type) qparams.append('type', type)
    if (museum) qparams.append('museum', museum)
    if (q) qparams.append('q', q)
    return this.request(`/admin/content?${qparams}`)
  }

  async approveContent(contentId, contentType) {
    return this.request(`/admin/content/${contentType}/${contentId}/approve`, { method: 'PUT' })
  }

  async rejectContent(contentId, contentType, reason = '') {
    return this.request(`/admin/content/${contentType}/${contentId}/reject`, { method: 'PUT', body: { reason } })
  }

  // Museum Admin endpoints
  async getMuseumProfile() {
    return this.request('/museum-admin/profile')
  }

  async updateMuseumProfile(profileData) {
    return this.request('/museum-admin/profile', {
      method: 'PUT',
      body: profileData,
    })
  }

  async uploadMuseumLogo(logoFile) {
    const formData = new FormData()
    formData.append('logo', logoFile)
    return this.request('/museum-admin/logo', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }

  // Museum artifacts
  async getMuseumArtifacts({ page = 1, limit = 20, category, search } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (category) q.append('category', category)
    if (search) q.append('search', search)
    return this.request(`/museum-admin/artifacts?${q}`)
  }

  async createMuseumArtifact(artifactData) {
    return this.request('/museum-admin/artifacts', {
      method: 'POST',
      body: artifactData,
    })
  }

  async updateMuseumArtifact(id, artifactData) {
    return this.request(`/museum-admin/artifacts/${id}`, {
      method: 'PUT',
      body: artifactData,
    })
  }

  async deleteMuseumArtifact(id) {
    return this.request(`/museum-admin/artifacts/${id}`, {
      method: 'DELETE',
    })
  }

  async getMuseumAnalytics() {
    return this.request('/museum-admin/analytics')
  }

  async getMuseumDashboard() {
    return this.request('/museum-admin/dashboard')
  }

  async submitVirtualMuseum(submissionData) {
    return this.request('/museum-admin/virtual-submissions', {
      method: 'POST',
      body: submissionData,
    })
  }

  async getVirtualSubmissions({ page = 1, limit = 20, status } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) q.append('status', status)
    return this.request(`/museum-admin/virtual-submissions?${q}`)
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile')
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: profileData,
    })
  }

  // Virtual exhibits
  async getVirtualExhibits({ search, category, museum } = {}) {
    const q = new URLSearchParams()
    if (search) q.append('search', search)
    if (category) q.append('category', category)
    if (museum) q.append('museum', museum)
    return this.request(`/virtual-exhibits?${q}`)
  }

  // Heritage sites
  async getHeritageSites({ search, region } = {}) {
    const q = new URLSearchParams()
    if (search) q.append('search', search)
    if (region) q.append('region', region)
    return this.request(`/heritage-sites?${q}`)
  }

  async createHeritageSite(data) {
    return this.request('/super-admin/heritage-sites', {
      method: 'POST',
      body: data,
    })
  }

  async updateHeritageSite(siteId, data) {
    return this.request(`/super-admin/heritage-sites/${siteId}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteHeritageSite(siteId) {
    return this.request(`/super-admin/heritage-sites/${siteId}`, {
      method: 'DELETE',
    })
  }

  async getHeritageSite(siteId) {
    return this.request(`/super-admin/heritage-sites/${siteId}`)
  }

  // User artifacts
  async getUserArtifacts({ page = 1, limit = 20, search, category, museum } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) q.append('search', search)
    if (category) q.append('category', category)
    if (museum) q.append('museum', museum)
    return this.request(`/artifacts?${q}`)
  }

  // Events
  async getUpcomingEvents({ search, date, museum } = {}) {
    const q = new URLSearchParams()
    if (search) q.append('search', search)
    if (date) q.append('date', date)
    if (museum) q.append('museum', museum)
    return this.request(`/events?${q}`)
  }

  // Bookings
  async bookTicket(bookingData) {
    return this.request('/user/bookings/ticket', {
      method: 'POST',
      body: bookingData,
    })
  }

  async registerForEvent(eventId, registrationData) {
    return this.request(`/user/events/${eventId}/register`, {
      method: 'POST',
      body: registrationData,
    })
  }

  async requestArtifactRental(artifactId, rentalData) {
    return this.request(`/user/rentals/${artifactId}`, {
      method: 'POST',
      body: rentalData,
    })
  }

  async getUserBookings({ page = 1, limit = 20, status } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) q.append('status', status)
    return this.request(`/user/bookings?${q}`)
  }

  // Favorites
  async addToFavorites(itemId, itemType) {
    return this.request('/user/favorites', {
      method: 'POST',
      body: { itemId, itemType },
    })
  }

  async removeFromFavorites(itemId) {
    return this.request(`/user/favorites/${itemId}`, {
      method: 'DELETE',
    })
  }

  async getUserFavorites() {
    return this.request('/user/favorites')
  }

  // Reviews
  async submitReview(itemId, itemType, reviewData) {
    return this.request(`/user/reviews`, {
      method: 'POST',
      body: { itemId, itemType, ...reviewData },
    })
  }

  async getUserReviews() {
    return this.request('/user/reviews')
  }

  // Rental system endpoints
  async getAllRentalRequests({ page = 1, limit = 1000, status, requestType, search } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status && status !== 'undefined' && status !== 'all') q.append('status', status)
    if (requestType && requestType !== 'undefined' && requestType !== 'all') q.append('requestType', requestType)
    if (search && search !== 'undefined') q.append('search', search)
    return this.request(`/rentals?${q}`)
  }

  async getRentalRequestById(id) {
    return this.request(`/rentals/${id}`)
  }

  async createRentalRequest(data) {
    return this.request('/rentals', {
      method: 'POST',
      body: data,
    })
  }

  async updateRentalRequestStatus(id, status, message = '') {
    return this.request(`/rentals/${id}/status`, {
      method: 'PATCH',
      body: { status, message },
    })
  }

  async addRentalRequestMessage(id, message) {
    return this.request(`/rentals/${id}/messages`, {
      method: 'POST',
      body: { message },
    })
  }

  async updateRentalPaymentStatus(id, paymentStatus, paymentDetails = {}) {
    return this.request(`/rentals/${id}/payment`, {
      method: 'PATCH',
      body: { paymentStatus, paymentDetails },
    })
  }

  async updateRental3DIntegration(id, integrationData) {
    return this.request(`/rentals/${id}/3d-integration`, {
      method: 'PATCH',
      body: integrationData,
    })
  }

  async updateRentalVirtualMuseum(id, virtualMuseumData) {
    return this.request(`/rentals/${id}/virtual-museum`, {
      method: 'PATCH',
      body: virtualMuseumData,
    })
  }

  async getRentalStatistics() {
    return this.request('/rentals/statistics')
  }

  async getRentalArtifacts() {
    return this.request('/rentals/artifacts')
  }

  async getMuseums() {
    return this.request('/museums')
  }

  async getArtifacts({ page = 1, limit = 100 } = {}) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    return this.request(`/artifacts?${q}`)
  }
}

const api = new ApiClient()
export default api