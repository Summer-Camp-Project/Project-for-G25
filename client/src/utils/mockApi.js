// Mock API service for development without backend
const MOCK_USERS = [
  // Super Administrators (from seed.js)
  {
    id: 1,
    email: 'melkamuwako5@admin.com',
    password: 'melkamuwako5',
    name: 'Melkamu Wako',
    role: 'super_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'abdurazakm343@admin.com',
    password: 'THpisvaHUbQNMsbX',
    name: 'Abdurazak M',
    role: 'super_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: 'student.pasegid@admin.com',
    password: 'Fs4HwlXCW4SJvkyN',
    name: 'Student Pasegid',
    role: 'super_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    email: 'naolaboma@admin.com',
    password: 'QR7ICwI5s6VMgAZD',
    name: 'Naol Aboma',
    role: 'super_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    email: 'superadmin@ethioheritage360.com',
    password: 'SuperAdmin2024!',
    name: 'Super Administrator',
    role: 'super_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    email: 'admin@ethioheritage360.com',
    password: 'AdminPass2024!',
    name: 'System Administrator',
    role: 'admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  
  // Museum Administrators (from ADMIN_CREDENTIALS.md)
  {
    id: 7,
    email: 'nationalmuseum@ethioheritage360.com',
    password: 'NatMuseum2024!',
    name: 'National Museum Admin',
    role: 'museum_admin',
    museum: 'National Museum of Ethiopia',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    email: 'ethnomuseum@ethioheritage360.com',
    password: 'EthnoAdmin2024!',
    name: 'Ethnological Museum Admin',
    role: 'museum_admin',
    museum: 'Ethnological Museum',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    email: 'royalheritage@ethioheritage360.com',
    password: 'RoyalAdmin2024!',
    name: 'Royal Heritage Admin',
    role: 'museum_admin',
    museum: 'Royal Heritage Museum',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    email: 'museum.admin@ethioheritage360.com',
    password: 'museum123',
    name: 'National Museum Admin',
    role: 'museum',
    museum: 'National Museum of Ethiopia',
    verified: true,
    createdAt: new Date().toISOString()
  },
  
  // Tour Organizers
  {
    id: 11,
    email: 'tourguide@ethioheritage360.com',
    password: 'TourGuide2024!',
    name: 'Senior Tour Guide',
    role: 'tour_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    email: 'culturaltours@ethioheritage360.com',
    password: 'CulturalTour2024!',
    name: 'Cultural Tour Specialist',
    role: 'tour_admin',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 13,
    email: 'organizer@heritagetours.et',
    password: 'organizer123',
    name: 'Heritage Tours Ethiopia',
    role: 'organizer',
    verified: true,
    createdAt: new Date().toISOString()
  },
  
  // Educators
  {
    id: 14,
    email: 'educator@ethioheritage360.com',
    password: 'Educator2024!',
    name: 'Heritage Educator',
    role: 'educator',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 15,
    email: 'researcher@ethioheritage360.com',
    password: 'Research2024!',
    name: 'Research Scholar',
    role: 'educator',
    verified: true,
    createdAt: new Date().toISOString()
  },
  
  // Visitors
  {
    id: 16,
    email: 'visitor@ethioheritage360.com',
    password: 'Visitor2024!',
    name: 'General Visitor',
    role: 'visitor',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 17,
    email: 'enthusiast@ethioheritage360.com',
    password: 'Heritage2024!',
    name: 'Heritage Enthusiast',
    role: 'visitor',
    verified: true,
    createdAt: new Date().toISOString()
  }
];

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a mock JWT token
const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  };
  return 'mock_jwt_' + btoa(JSON.stringify(payload));
};

// Parse mock JWT token
const parseMockToken = (token) => {
  if (!token || !token.startsWith('mock_jwt_')) return null;
  try {
    return JSON.parse(atob(token.replace('mock_jwt_', '')));
  } catch {
    return null;
  }
};

// Mock data for Museum Admin and User features
const MOCK_MUSEUM_ARTIFACTS = [
  {
    _id: '1',
    name: 'Ancient Ethiopian Crown',
    description: 'A royal crown from the 15th century Solomonic dynasty',
    category: 'Royal Artifacts',
    period: '15th Century',
    images: ['crown1.jpg'],
    isAvailableForRental: true,
    rentalPrice: 50000,
    status: 'approved',
    museum: 'National Museum of Ethiopia',
    createdAt: new Date('2025-01-10').toISOString()
  },
  {
    _id: '2',
    name: 'Traditional Coffee Set',
    description: 'Complete traditional Ethiopian coffee ceremony set',
    category: 'Cultural Artifacts',
    period: '19th Century',
    images: ['coffee1.jpg'],
    isAvailableForRental: true,
    rentalPrice: 15000,
    status: 'pending',
    museum: 'Ethnological Museum',
    createdAt: new Date('2025-01-08').toISOString()
  },
  {
    _id: '3',
    name: 'Manuscripts Collection',
    description: 'Ancient Ge\'ez manuscripts and religious texts',
    category: 'Documents',
    period: '14th-16th Century',
    images: ['manuscript1.jpg'],
    isAvailableForRental: false,
    rentalPrice: 0,
    status: 'approved',
    museum: 'Trinity Cathedral Museum',
    createdAt: new Date('2025-01-05').toISOString()
  }
];

const MOCK_VIRTUAL_EXHIBITS = [
  {
    _id: '1',
    title: 'Royal Ethiopian Heritage',
    museum: 'National Museum of Ethiopia',
    description: 'Explore the rich royal history of Ethiopia through ancient crowns, ceremonial objects, and manuscripts.',
    artifacts: 25,
    thumbnail: 'royal-heritage.jpg',
    category: 'Royal History',
    rating: 4.8,
    views: 1234,
    isInteractive: true,
    has3D: true,
    status: 'approved',
    createdAt: new Date('2025-01-12').toISOString()
  },
  {
    _id: '2',
    title: 'Coffee Culture Journey',
    museum: 'Ethnological Museum',
    description: 'Discover the birthplace of coffee and its cultural significance in Ethiopian society.',
    artifacts: 18,
    thumbnail: 'coffee-culture.jpg',
    category: 'Cultural Heritage',
    rating: 4.6,
    views: 987,
    isInteractive: true,
    has3D: false,
    status: 'approved',
    createdAt: new Date('2025-01-10').toISOString()
  },
  {
    _id: '3',
    title: 'Ancient Manuscripts',
    museum: 'Trinity Cathedral Museum',
    description: 'Sacred texts and illuminated manuscripts showcasing Ethiopian Orthodox traditions.',
    artifacts: 32,
    thumbnail: 'manuscripts.jpg',
    category: 'Religious Heritage',
    rating: 4.9,
    views: 756,
    isInteractive: false,
    has3D: true,
    status: 'approved',
    createdAt: new Date('2025-01-08').toISOString()
  }
];

const MOCK_HERITAGE_SITES = [
  {
    _id: '1',
    name: 'Lalibela Rock Churches',
    region: 'Amhara',
    description: 'Eleven medieval monolithic churches carved from rock, a UNESCO World Heritage Site.',
    coordinates: { lat: 12.0333, lng: 39.0333 },
    category: 'Religious Site',
    rating: 4.9,
    images: ['lalibela1.jpg', 'lalibela2.jpg'],
    virtualTourAvailable: true,
    audioGuideAvailable: true
  },
  {
    _id: '2',
    name: 'Axum Obelisks',
    region: 'Tigray',
    description: 'Ancient granite stelae marking the heart of the ancient Kingdom of Axum.',
    coordinates: { lat: 14.1333, lng: 38.7167 },
    category: 'Archaeological Site',
    rating: 4.7,
    images: ['axum1.jpg', 'axum2.jpg'],
    virtualTourAvailable: true,
    audioGuideAvailable: true
  },
  {
    _id: '3',
    name: 'Simien Mountains',
    region: 'Amhara',
    description: 'Dramatic mountain landscape with unique wildlife and stunning vistas.',
    coordinates: { lat: 13.2333, lng: 38.0333 },
    category: 'Natural Heritage',
    rating: 4.8,
    images: ['simien1.jpg', 'simien2.jpg'],
    virtualTourAvailable: false,
    audioGuideAvailable: true
  }
];

const MOCK_EVENTS = [
  {
    _id: '1',
    title: 'Ethiopian Coffee Ceremony Workshop',
    museum: 'Ethnological Museum',
    date: '2025-02-15',
    time: '14:00',
    duration: '2 hours',
    price: 25,
    capacity: 20,
    registered: 15,
    category: 'Workshop',
    description: 'Learn the traditional Ethiopian coffee ceremony from expert practitioners.',
    status: 'upcoming'
  },
  {
    _id: '2',
    title: 'Ancient Manuscripts Exhibition Opening',
    museum: 'Trinity Cathedral Museum',
    date: '2025-02-20',
    time: '18:00',
    duration: '3 hours',
    price: 0,
    capacity: 100,
    registered: 67,
    category: 'Exhibition',
    description: 'Grand opening of our new manuscripts collection with guided tours.',
    status: 'upcoming'
  },
  {
    _id: '3',
    title: 'Virtual Reality Heritage Tour',
    museum: 'National Museum',
    date: '2025-02-25',
    time: '10:00',
    duration: '1 hour',
    price: 15,
    capacity: 12,
    registered: 8,
    category: 'VR Experience',
    description: 'Immersive VR journey through Ethiopian historical sites.',
    status: 'upcoming'
  }
];

const MOCK_USER_BOOKINGS = [
  {
    id: '1',
    type: 'ticket',
    museum: 'National Museum of Ethiopia',
    date: '2025-01-10',
    status: 'completed',
    price: 20,
    visitors: 2
  },
  {
    id: '2',
    type: 'event',
    title: 'Coffee Workshop',
    museum: 'Ethnological Museum',
    date: '2025-01-15',
    status: 'completed',
    price: 25,
    visitors: 1
  },
  {
    id: '3',
    type: 'rental',
    artifactName: 'Traditional Coffee Set',
    museum: 'Ethnological Museum',
    date: '2025-02-01',
    status: 'upcoming',
    price: 15000,
    duration: '7 days'
  }
];

// Mixed content store for moderation demo
const MOCK_CONTENT = [
  {
    _id: '1',
    name: 'Ancient Ethiopian Crown',
    museum: 'National Museum',
    submittedAt: '2025-01-12',
    status: 'pending',
    type: 'artifact',
    description: 'A royal crown from the 15th century',
    category: 'Royal Artifacts'
  },
  {
    _id: '2', 
    name: 'Ethiopian Heritage Virtual Tour',
    museum: 'National Museum',
    submittedAt: '2025-01-11',
    status: 'pending',
    type: 'virtualMuseum',
    description: '360-degree virtual tour of main exhibition halls',
    artifacts: 25
  },
  {
    _id: '3',
    name: 'Coffee Ceremony Workshop', 
    museum: 'Ethnological Museum',
    submittedAt: '2025-01-10',
    status: 'rejected',
    type: 'event',
    date: '2025-02-15',
    feedback: 'Event date conflicts with national holiday. Please select alternative date.'
  },
  {
    _id: '4',
    artifactName: 'Ceremonial Sword',
    name: 'Ceremonial Sword',
    museum: 'National Museum',
    renter: 'University of Addis Ababa',
    submittedAt: '2025-01-09',
    status: 'pending',
    type: 'rental',
    duration: '30 days',
    fee: '₹20,000'
  },
  {
    _id: '5',
    name: 'Traditional Coffee Set',
    museum: 'Ethnological Museum',
    submittedAt: '2025-01-08',
    status: 'approved',
    type: 'artifact',
    description: 'Complete traditional Ethiopian coffee ceremony set'
  }
]

class MockApiClient {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    // Simulate network delay
    await delay(300);

    const token = localStorage.getItem('token');
    const user = token ? this.getUserFromToken(token) : null;

    // Handle authentication endpoints
    if (endpoint === '/auth/login' && options.method === 'POST') {
      return this.login(JSON.parse(options.body));
    }

    if (endpoint === '/auth/register' && options.method === 'POST') {
      return this.register(JSON.parse(options.body));
    }

    if (endpoint === '/auth/logout' && options.method === 'POST') {
      return this.logout();
    }

    if (endpoint === '/auth/me') {
      return this.getCurrentUser(token);
    }

    // For other endpoints, return mock success
    return { success: true, message: 'Mock API response' };
  }

  async login(credentials) {
    const { email, password } = credentials;
    
    // Find user by email and password
    const user = MOCK_USERS.find(u => 
      u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateMockToken(user);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }

  async register(userData) {
    const { email, name, password, role = 'visitor' } = userData;

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser = {
      id: MOCK_USERS.length + 1,
      email,
      name,
      password,
      role,
      verified: false,
      createdAt: new Date().toISOString()
    };

    MOCK_USERS.push(newUser);

    // Generate token
    const token = generateMockToken(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      token,
      user: userWithoutPassword
    };
  }

  async logout() {
    return { success: true, message: 'Logged out successfully' };
  }

  async getCurrentUser(token) {
    if (!token) {
      throw new Error('No token provided');
    }

    const tokenData = parseMockToken(token);
    if (!tokenData) {
      throw new Error('Invalid token');
    }

    const user = MOCK_USERS.find(u => u.id === tokenData.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword
    };
  }

  getUserFromToken(token) {
    const tokenData = parseMockToken(token);
    if (!tokenData) return null;

    const user = MOCK_USERS.find(u => u.id === tokenData.id);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Mock other API methods
  async getMuseums() {
    return { museums: [] };
  }

  async getArtifacts() {
    return { artifacts: [] };
  }

  async getTours() {
    return { tours: [] };
  }

  async getSites() {
    return { sites: [] };
  }

  async getUsers() {
    const users = MOCK_USERS.map(({ password: _, ...user }) => user);
    return { users };
  }

  async getSystemStats() {
    return {
      stats: {
        totalUsers: MOCK_USERS.length,
        totalMuseums: 12,
        totalArtifacts: 487,
        totalTours: 23,
        recentActivity: []
      }
    };
  }

  // Enhanced user management for Super Admin
  async listUsers({ page = 1, limit = 20, role } = {}) {
    let filteredUsers = MOCK_USERS;
    if (role) {
      filteredUsers = MOCK_USERS.filter(user => user.role === role);
    }
    
    const startIndex = (page - 1) * limit;
    const items = filteredUsers
      .slice(startIndex, startIndex + limit)
      .map(({ password: _, ...user }) => user);
    
    return {
      items,
      total: filteredUsers.length,
      page,
      limit
    };
  }

  async createUser(userData) {
    const { email, name, password, role = 'visitor', isActive = true } = userData;
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      _id: (MOCK_USERS.length + 1).toString(),
      id: MOCK_USERS.length + 1,
      email,
      name,
      password,
      role,
      isActive,
      verified: role !== 'visitor',
      createdAt: new Date().toISOString()
    };
    
    MOCK_USERS.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async updateUser(userId, userData) {
    const userIndex = MOCK_USERS.findIndex(u => u._id === userId || u.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Don't update password if it's empty
    if (userData.password && userData.password.trim() === '') {
      delete userData.password;
    }
    
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
    const { password: _, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return { user: userWithoutPassword };
  }

  async deleteUser(userId) {
    const userIndex = MOCK_USERS.findIndex(u => u._id === userId || u.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    MOCK_USERS.splice(userIndex, 1);
    return { success: true, message: 'User deleted successfully' };
  }

  async setUserRole(userId, role) {
    const userIndex = MOCK_USERS.findIndex(u => u._id === userId || u.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    MOCK_USERS[userIndex].role = role;
    const { password: _, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return { user: userWithoutPassword };
  }

  // Museum management
  async listMuseums({ page = 1, limit = 20 } = {}) {
    const mockMuseums = [
      {
        _id: '1',
        name: 'National Museum of Ethiopia',
        email: 'nationalmuseum@ethioheritage360.com',
        museumInfo: {
          name: 'National Museum of Ethiopia',
          verified: true,
          location: 'Addis Ababa',
          description: 'The premier museum of Ethiopia'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2', 
        name: 'Ethnological Museum',
        email: 'ethnomuseum@ethioheritage360.com',
        museumInfo: {
          name: 'Ethnological Museum',
          verified: true,
          location: 'Addis Ababa',
          description: 'Showcasing Ethiopian cultures'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Regional Heritage Center', 
        email: 'heritage@center.com',
        museumInfo: {
          name: 'Regional Heritage Center',
          verified: false,
          location: 'Bahir Dar',
          description: 'Local heritage preservation'
        },
        createdAt: new Date().toISOString()
      }
    ];
    
    const startIndex = (page - 1) * limit;
    const items = mockMuseums.slice(startIndex, startIndex + limit);
    
    return {
      items,
      total: mockMuseums.length,
      page,
      limit
    };
  }

  async setMuseumVerified(museumId, verified) {
    // Mock implementation - in real app would update database
    return { success: true, message: `Museum ${verified ? 'verified' : 'unverified'} successfully` };
  }

  // Content moderation (multi-type)
  async listContent({ page = 1, limit = 20, status, type, museum, q } = {}) {
    // Filter
    let items = [...MOCK_CONTENT]
    if (status) items = items.filter(i => i.status === status)
    if (type) items = items.filter(i => i.type === type)
    if (museum) items = items.filter(i => i.museum === museum)
    if (q) {
      const qq = q.toLowerCase()
      items = items.filter(i => (i.name || i.artifactName || '').toLowerCase().includes(qq) || (i.museum || '').toLowerCase().includes(qq))
    }
    const total = items.length
    const start = (page - 1) * limit
    const paged = items.slice(start, start + limit)
    return { items: paged, total, page, limit }
  }

  async approveContent(id, type) {
    const idx = MOCK_CONTENT.findIndex(i => i._id === id && (!type || i.type === type))
    if (idx === -1) throw new Error('Content not found')
    MOCK_CONTENT[idx] = { ...MOCK_CONTENT[idx], status: 'approved', feedback: undefined }
    return { success: true, item: MOCK_CONTENT[idx] }
  }

  async rejectContent(id, type, reason = '') {
    const idx = MOCK_CONTENT.findIndex(i => i._id === id && (!type || i.type === type))
    if (idx === -1) throw new Error('Content not found')
    MOCK_CONTENT[idx] = { ...MOCK_CONTENT[idx], status: 'rejected', feedback: reason }
    return { success: true, item: MOCK_CONTENT[idx] }
  }

  // Artifacts management
  async listArtifacts({ page = 1, limit = 20, status } = {}) {
    const mockArtifacts = [
      {
        _id: '1',
        name: 'Ancient Ethiopian Crown',
        museum: 'National Museum',
        category: 'Jewelry',
        status: 'pending',
        submittedBy: 'museum@example.com',
        period: 'Ancient',
        condition: 'Excellent',
        dateSubmitted: '2025-08-12',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Traditional Coffee Set',
        museum: 'Ethnological Museum',
        category: 'Pottery',
        status: 'approved',
        submittedBy: 'ethno@example.com',
        period: 'Medieval',
        condition: 'Good',
        dateSubmitted: '2025-08-11',
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Historical Manuscript',
        museum: 'Heritage Center',
        category: 'Manuscripts',
        status: 'rejected',
        submittedBy: 'heritage@example.com',
        period: 'Medieval',
        condition: 'Fair',
        dateSubmitted: '2025-08-10',
        createdAt: new Date().toISOString()
      }
    ];
    
    let filteredArtifacts = mockArtifacts;
    if (status) {
      filteredArtifacts = mockArtifacts.filter(artifact => artifact.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const items = filteredArtifacts.slice(startIndex, startIndex + limit);
    
    return {
      items,
      total: filteredArtifacts.length,
      page,
      limit
    };
  }

  async approveArtifact(artifactId) {
    return { success: true, message: 'Artifact approved successfully' };
  }

  async rejectArtifact(artifactId, reason) {
    return { success: true, message: 'Artifact rejected successfully' };
  }

  // System management
  async getSystemSettings() {
    return {
      settings: {
        platformName: 'Ethiopian Heritage 360',
        defaultLanguage: 'en',
        maxUploadSize: 50,
        defaultRentalPeriod: 30,
        securityDeposit: 20,
        lateFee: 100,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        notifications: {
          newUsers: true,
          artifactApprovals: true,
          rentalActivities: true,
          weeklyReports: false
        }
      }
    };
  }

  async updateSystemSettings(settings) {
    // Mock implementation - in real app would save to database
    return { success: true, message: 'Settings updated successfully', settings };
  }

  // System monitoring
  async getSystemHealth() {
    return {
      health: {
        status: 'operational',
        uptime: '99.8%',
        responseTime: '245ms',
        services: {
          database: 'operational',
          authentication: 'operational',
          fileStorage: 'degraded',
          emailService: 'operational'
        },
        lastChecked: new Date().toISOString()
      }
    };
  }

  async getActivityLogs({ page = 1, limit = 50 } = {}) {
    const mockLogs = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        activity: 'User login',
        user: 'user@example.com',
        type: 'authentication',
        details: 'Successful login from IP: 192.168.1.1'
      },
      {
        id: '2', 
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        activity: 'Artifact uploaded',
        user: 'museum@example.com',
        type: 'content',
        details: 'New artifact "Ancient Vase" uploaded'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        activity: 'Museum verified',
        user: 'admin@heritage360.et',
        type: 'administration',
        details: 'Heritage Center museum verified'
      }
    ];
    
    const startIndex = (page - 1) * limit;
    const items = mockLogs.slice(startIndex, startIndex + limit);
    
    return {
      logs: items,
      total: mockLogs.length,
      page,
      limit
    };
  }

  // Analytics
  async getAnalytics(timeRange = 'month') {
    const mockAnalytics = {
      timeRange,
      metrics: {
        users: {
          total: MOCK_USERS.length,
          active: Math.floor(MOCK_USERS.length * 0.7),
          growth: 12.5
        },
        museums: {
          total: 45,
          verified: 42,
          growth: 8.3
        },
        artifacts: {
          total: 1256,
          approved: 1180,
          pending: 76,
          growth: 15.2
        },
        revenue: {
          total: 285400,
          growth: 22.7
        }
      },
      charts: {
        userGrowth: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
          users: Math.floor(Math.random() * 200) + 50,
          museums: Math.floor(Math.random() * 10) + 2
        })),
        popularMuseums: [
          { name: 'National Museum', visits: 4500 },
          { name: 'Ethnological Museum', visits: 2800 },
          { name: 'Heritage Center', visits: 1500 }
        ]
      }
    };
    
    return mockAnalytics;
  }

  // Backup and maintenance
  async createBackup() {
    await delay(2000); // Simulate backup time
    return {
      success: true,
      backupId: `backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
      size: '125.4 MB',
      message: 'Database backup created successfully'
    };
  }

  // File upload mock
  async uploadFile(file, type = 'image') {
    await delay(1000);
    return {
      url: '/api/placeholder/400/300',
      filename: file.name,
      type
    };
  }

  // Museum Admin endpoints
  async getMuseumProfile() {
    return {
      museum: {
        name: 'National Museum of Ethiopia',
        description: 'The premier cultural institution showcasing Ethiopian heritage.',
        address: 'King George VI St, Addis Ababa, Ethiopia',
        phone: '+251-11-117-150',
        email: 'info@nationalmuseum.et',
        website: 'https://nationalmuseum.ethiopia.gov.et',
        openingHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true }
        },
        socialMedia: {
          facebook: 'https://facebook.com/nationalmuseumethiopia',
          twitter: 'https://twitter.com/nationalmuseumet',
          instagram: 'https://instagram.com/nationalmuseumethiopia'
        }
      }
    };
  }

  async updateMuseumProfile(profileData) {
    await delay(500);
    return { success: true, message: 'Museum profile updated successfully' };
  }

  async getMuseumArtifacts({ page = 1, limit = 20, category, search } = {}) {
    let filteredArtifacts = [...MOCK_MUSEUM_ARTIFACTS];
    
    if (category) {
      filteredArtifacts = filteredArtifacts.filter(artifact => artifact.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArtifacts = filteredArtifacts.filter(artifact => 
        artifact.name.toLowerCase().includes(searchLower) ||
        artifact.description.toLowerCase().includes(searchLower)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const items = filteredArtifacts.slice(startIndex, startIndex + limit);
    
    return {
      items,
      total: filteredArtifacts.length,
      page,
      limit
    };
  }

  async createMuseumArtifact(artifactData) {
    const newArtifact = {
      ...artifactData,
      _id: (MOCK_MUSEUM_ARTIFACTS.length + 1).toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_MUSEUM_ARTIFACTS.push(newArtifact);
    return { artifact: newArtifact };
  }

  async updateMuseumArtifact(id, artifactData) {
    const index = MOCK_MUSEUM_ARTIFACTS.findIndex(a => a._id === id);
    if (index === -1) throw new Error('Artifact not found');
    
    MOCK_MUSEUM_ARTIFACTS[index] = { ...MOCK_MUSEUM_ARTIFACTS[index], ...artifactData };
    return { artifact: MOCK_MUSEUM_ARTIFACTS[index] };
  }

  async deleteMuseumArtifact(id) {
    const index = MOCK_MUSEUM_ARTIFACTS.findIndex(a => a._id === id);
    if (index === -1) throw new Error('Artifact not found');
    
    MOCK_MUSEUM_ARTIFACTS.splice(index, 1);
    return { success: true, message: 'Artifact deleted successfully' };
  }

  async getMuseumAnalytics() {
    return {
      analytics: {
        visitors: { total: 12543, growth: 15.2 },
        artifacts: { 
          total: 247, 
          popular: [
            { name: 'Ancient Ethiopian Crown', views: 1234 },
            { name: 'Traditional Coffee Set', views: 987 },
            { name: 'Manuscripts Collection', views: 765 }
          ]
        },
        revenue: { total: 450000, growth: 22.8 },
        events: { upcoming: 3, total: 28 }
      }
    };
  }

  async submitVirtualMuseum(submissionData) {
    await delay(1000);
    return { success: true, message: 'Virtual museum submission sent for approval' };
  }

  async getVirtualSubmissions({ page = 1, limit = 20, status } = {}) {
    const mockSubmissions = [
      {
        _id: '1',
        title: 'Ethiopian Heritage Virtual Tour',
        description: '360-degree virtual tour of main exhibition halls',
        artifacts: 25,
        status: 'pending',
        submittedAt: new Date('2025-01-11').toISOString()
      },
      {
        _id: '2',
        title: 'Royal Artifacts Showcase',
        description: 'Collection of royal Ethiopian artifacts',
        artifacts: 12,
        status: 'rejected',
        feedback: 'Images need better resolution',
        submittedAt: new Date('2025-01-08').toISOString()
      }
    ];
    
    let filtered = status ? mockSubmissions.filter(s => s.status === status) : mockSubmissions;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    
    return { items, total: filtered.length, page, limit };
  }

  // User/Visitor endpoints
  async getUserProfile() {
    return {
      profile: {
        name: 'Heritage Explorer',
        email: 'explorer@example.com',
        preferences: {
          favoriteCategories: ['Royal History', 'Cultural Heritage'],
          notifications: true,
          language: 'en'
        },
        bookingHistory: MOCK_USER_BOOKINGS,
        favorites: ['1', '3'],
        reviews: []
      }
    };
  }

  async updateUserProfile(profileData) {
    await delay(500);
    return { success: true, message: 'Profile updated successfully' };
  }

  async getVirtualExhibits({ search, category, museum } = {}) {
    let filtered = [...MOCK_VIRTUAL_EXHIBITS];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(exhibit => 
        exhibit.title.toLowerCase().includes(searchLower) ||
        exhibit.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (category) {
      filtered = filtered.filter(exhibit => exhibit.category === category);
    }
    
    if (museum) {
      filtered = filtered.filter(exhibit => exhibit.museum === museum);
    }
    
    return { exhibits: filtered };
  }

  async getHeritageSites({ search, region } = {}) {
    let filtered = [...MOCK_HERITAGE_SITES];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(searchLower) ||
        site.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (region) {
      filtered = filtered.filter(site => site.region === region);
    }
    
    return { sites: filtered };
  }

  async getUserArtifacts({ page = 1, limit = 20, search, category, museum } = {}) {
    let filtered = [...MOCK_MUSEUM_ARTIFACTS.filter(a => a.status === 'approved')];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(artifact => 
        artifact.name.toLowerCase().includes(searchLower) ||
        artifact.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (category) {
      filtered = filtered.filter(artifact => artifact.category === category);
    }
    
    if (museum) {
      filtered = filtered.filter(artifact => artifact.museum === museum);
    }
    
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    
    return { items, total: filtered.length, page, limit };
  }

  async getUpcomingEvents({ search, date, museum } = {}) {
    let filtered = [...MOCK_EVENTS];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (date) {
      filtered = filtered.filter(event => event.date === date);
    }
    
    if (museum) {
      filtered = filtered.filter(event => event.museum === museum);
    }
    
    return { events: filtered };
  }

  async bookTicket(bookingData) {
    await delay(500);
    const newBooking = {
      id: (MOCK_USER_BOOKINGS.length + 1).toString(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    MOCK_USER_BOOKINGS.push(newBooking);
    return { booking: newBooking };
  }

  async registerForEvent(eventId, registrationData) {
    await delay(500);
    const newRegistration = {
      id: (MOCK_USER_BOOKINGS.length + 1).toString(),
      type: 'event',
      eventId,
      ...registrationData,
      status: 'registered',
      createdAt: new Date().toISOString()
    };
    MOCK_USER_BOOKINGS.push(newRegistration);
    return { registration: newRegistration };
  }

  async requestArtifactRental(artifactId, rentalData) {
    await delay(500);
    const newRental = {
      id: (MOCK_USER_BOOKINGS.length + 1).toString(),
      type: 'rental',
      artifactId,
      ...rentalData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_USER_BOOKINGS.push(newRental);
    return { rental: newRental };
  }

  async getUserBookings({ page = 1, limit = 20, status } = {}) {
    let filtered = status ? MOCK_USER_BOOKINGS.filter(b => b.status === status) : MOCK_USER_BOOKINGS;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    return { items, total: filtered.length, page, limit };
  }

  async addToFavorites(itemId, itemType) {
    await delay(200);
    return { success: true, message: 'Added to favorites' };
  }

  async removeFromFavorites(itemId) {
    await delay(200);
    return { success: true, message: 'Removed from favorites' };
  }

  async getUserFavorites() {
    return {
      favorites: [
        { id: '1', type: 'exhibit', item: MOCK_VIRTUAL_EXHIBITS[0] },
        { id: '3', type: 'artifact', item: MOCK_MUSEUM_ARTIFACTS[2] }
      ]
    };
  }

  async submitReview(itemId, itemType, reviewData) {
    await delay(500);
    return { success: true, message: 'Review submitted successfully' };
  }

  async getUserReviews() {
    return {
      reviews: [
        {
          id: '1',
          itemId: '1',
          itemType: 'exhibit',
          itemTitle: 'Royal Ethiopian Heritage',
          rating: 5,
          comment: 'Amazing virtual tour!',
          createdAt: new Date('2025-01-10').toISOString()
        }
      ]
    };
  }
}

export const mockApi = new MockApiClient();
export default mockApi;
