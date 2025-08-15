import React, { useState, useEffect } from 'react';
import { Heart, Eye, Calendar, MapPin, MessageSquare, Star, Play, Image, BookOpen } from 'lucide-react';
import VisitorSidebar from '../components/dashboard/VisitorSidebar';
import { useAuth } from '../hooks/useAuth';

// Import actual images
import museumImg from '../assets/museum.jpg';
import artifactsImg from '../assets/artifacts.jpg';
import cultureImg from '../assets/culture.jpg';
import architectureImg from '../assets/architecture.jpg';
import lucyBoneImg from '../assets/Lucy-Bone.jpg';
import virtualTourImg from '../assets/virtual-tour.jpg';

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [favoriteArtifacts, setFavoriteArtifacts] = useState([]);
  const [bookedTours, setBookedTours] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [featuredMuseums, setFeaturedMuseums] = useState([]);
  const [newArtifacts, setNewArtifacts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Mock data with reliable online images and extensive descriptions
  const mockFavoriteArtifacts = [
    { 
      id: 1, 
      name: 'Ancient Ethiopian Orthodox Cross', 
      image: 'https://picsum.photos/400/300?random=1', 
      category: 'Religious Artifacts', 
      museum: 'National Museum of Ethiopia',
      description: 'A beautifully crafted ancient Ethiopian Orthodox cross made of silver and gold, dating back to the 14th century. Features intricate Ge\'ez inscriptions and traditional Ethiopian religious motifs. This cross represents the deep Christian heritage of Ethiopia.',
      period: '14th Century',
      material: 'Silver, Gold, Copper',
      origin: 'Lalibela, Ethiopia',
      dimensions: '25cm x 18cm',
      weight: '450g',
      condition: 'Excellent',
      significance: 'Used in religious ceremonies and represents Ethiopian Orthodox faith'
    },
    { 
      id: 2, 
      name: 'Traditional Coffee Ceremony Set', 
      image: 'https://picsum.photos/400/300?random=2', 
      category: 'Cultural Heritage', 
      museum: 'Ethnological Museum',
      description: 'Complete traditional Ethiopian coffee ceremony set including the iconic jebena (clay coffee pot), cups, roasting pan, and incense burner. Central to Ethiopian hospitality and social culture. Coffee ceremony is a sacred ritual in Ethiopian culture.',
      period: 'Traditional (19th Century)',
      material: 'Clay, Wood, Natural Fibers',
      origin: 'Kaffa Region, Ethiopia',
      dimensions: 'Jebena: 30cm height',
      weight: '2.1kg (complete set)',
      condition: 'Very Good',
      significance: 'Ethiopia is the birthplace of coffee, ceremony represents hospitality'
    },
    { 
      id: 3, 
      name: 'Emperor Haile Selassie Crown', 
      image: 'https://picsum.photos/400/300?random=3', 
      category: 'Royal Heritage', 
      museum: 'Imperial Palace Museum',
      description: 'Ornate ceremonial crown worn by Emperor Haile Selassie I, the last emperor of Ethiopia. Adorned with precious gems, pearls, and intricate Ethiopian imperial designs featuring the Lion of Judah. Symbol of Ethiopian sovereignty.',
      period: '20th Century (1930-1974)',
      material: 'Gold, Diamonds, Emeralds, Pearls',
      origin: 'Addis Ababa, Ethiopia',
      dimensions: '28cm diameter, 20cm height',
      weight: '1.8kg',
      condition: 'Pristine',
      significance: 'Last imperial crown of Ethiopia, symbol of independence from colonialism'
    },
    {
      id: 4,
      name: 'Aksum Obelisk Miniature',
      image: 'https://picsum.photos/400/300?random=4',
      category: 'Archaeological',
      museum: 'Aksum Archaeological Museum',
      description: 'Scale replica of the famous Aksum Obelisks, ancient monuments from the Kingdom of Aksum. These granite stelae are among the tallest single pieces of stone ever quarried by humans.',
      period: '4th Century AD',
      material: 'Granite Stone',
      origin: 'Aksum, Tigray Region',
      dimensions: '45cm height (1:50 scale)',
      weight: '12kg',
      condition: 'Excellent',
      significance: 'Represents the ancient Kingdom of Aksum, UNESCO World Heritage site'
    },
    {
      id: 5,
      name: 'Queen of Sheba Jewelry',
      image: 'https://picsum.photos/400/300?random=5',
      category: 'Royal Jewelry',
      museum: 'Sheba Heritage Museum',
      description: 'Replica jewelry collection inspired by the legendary Queen of Sheba. Features traditional Ethiopian designs with gold filigree work and precious stones.',
      period: '10th Century BC (Replica)',
      material: 'Gold, Silver, Amber, Coral',
      origin: 'Tigray Region',
      dimensions: 'Various pieces',
      weight: '850g (complete set)',
      condition: 'Mint',
      significance: 'Represents the legendary Queen of Sheba\'s connection to Ethiopia'
    }
  ];

  const mockBookedTours = [
    { 
      id: 1, 
      title: 'Historic Addis Ababa Tour', 
      date: '2025-01-15', 
      status: 'Confirmed', 
      time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
      description: 'Explore the rich history of Ethiopia\'s capital city with expert guides.'
    },
    { 
      id: 2, 
      title: 'Lalibela Churches Expedition', 
      date: '2025-02-20', 
      status: 'Pending', 
      time: '2:00 PM',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
      description: 'Visit the magnificent rock-hewn churches of Lalibela, a UNESCO World Heritage site.'
    },
  ];

  const mockRecentViews = [
    { 
      id: 3, 
      name: 'Ancient Ge\'ez Manuscript', 
      image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Ge\'ez+Manuscript', 
      type: 'Artifact', 
      viewedAt: '2 hours ago',
      description: 'A rare manuscript written in ancient Ge\'ez script, containing religious hymns and biblical texts from the 13th century. Features beautiful illuminated letters.',
      period: '13th Century',
      material: 'Vellum, Natural Pigments'
    },
    { 
      id: 4, 
      name: 'Simien Mountains Virtual Tour', 
      image: 'https://via.placeholder.com/400x300/228B22/FFFFFF?text=Simien+Mountains+Tour', 
      type: 'Virtual Tour', 
      viewedAt: '1 day ago',
      description: 'Experience the breathtaking landscapes of the Simien Mountains National Park, home to rare wildlife including the Gelada monkeys and Ethiopian wolves.',
      location: 'Simien Mountains, Ethiopia',
      duration: '45 minutes'
    },
    { 
      id: 5, 
      name: 'Lucy Australopithecus Fossil', 
      image: 'https://via.placeholder.com/400x300/DEB887/000000?text=Lucy+Fossil+Replica', 
      type: 'Fossil Artifact', 
      viewedAt: '3 days ago',
      description: 'Detailed replica of Lucy (Australopithecus afarensis), one of the most complete early human ancestor fossils ever discovered, found in the Afar region of Ethiopia.',
      period: '3.2 Million Years Ago',
      discoveredIn: 'Hadar, Ethiopia (1974)'
    },
  ];

  const mockFeaturedMuseums = [
    { 
      id: 1, 
      name: 'National Museum of Ethiopia', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop&crop=center', 
      artifacts: 1247, 
      rating: 4.8, 
      type: 'National Heritage',
      description: 'Ethiopia\'s premier museum showcasing the country\'s rich cultural and historical heritage, including Lucy fossil.',
      location: 'Addis Ababa'
    },
    { 
      id: 2, 
      name: 'Ethnological Museum', 
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop&crop=center', 
      artifacts: 892, 
      rating: 4.7, 
      type: 'Cultural Heritage',
      description: 'Dedicated to Ethiopian cultures, traditions, and way of life across different ethnic groups.',
      location: 'Addis Ababa University'
    },
    { 
      id: 3, 
      name: 'Red Terror Martyrs Museum', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop&crop=center', 
      artifacts: 324, 
      rating: 4.9, 
      type: 'Historical Memorial',
      description: 'Memorial museum documenting the history of political repression during the Red Terror period.',
      location: 'Addis Ababa'
    },
  ];

  const mockNewArtifacts = [
    { 
      id: 6, 
      name: 'Ancient Ge\'ez Prayer Book', 
      image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Ge\'ez+Prayer+Book', 
      addedAt: '2 days ago', 
      museum: 'National Library of Ethiopia',
      description: 'Recently digitized ancient prayer book containing religious hymns and liturgical texts in Ge\'ez script, with stunning illuminated initials.',
      period: '15th Century',
      material: 'Vellum, Gold Leaf'
    },
    { 
      id: 7, 
      name: 'Traditional Ethiopian Weaving Loom', 
      image: 'https://via.placeholder.com/400x300/CD853F/FFFFFF?text=Traditional+Weaving+Loom', 
      addedAt: '1 week ago', 
      museum: 'Ethiopian Craft Museum',
      description: 'Complete traditional Ethiopian weaving loom and tools used to create the famous shamma (traditional cotton garments) and other textiles.',
      period: 'Traditional',
      material: 'Wood, Cotton, Natural Fibers'
    },
    { 
      id: 8, 
      name: 'Emperor Tewodros II Ceremonial Sword', 
      image: 'https://via.placeholder.com/400x300/C0C0C0/000000?text=Imperial+Ceremonial+Sword', 
      addedAt: '3 days ago', 
      museum: 'Imperial Palace Museum',
      description: 'Ornate ceremonial sword belonging to Emperor Tewodros II, featuring intricate engravings, royal insignia, and the Lion of Judah emblem.',
      period: '19th Century (1855-1868)',
      material: 'Steel, Silver, Gold Inlay'
    },
  ];

  const mockUpcomingEvents = [
    { id: 1, title: 'Ethiopian Heritage Week', date: '2025-02-01', type: 'Exhibition', location: 'National Museum' },
    { id: 2, title: 'Coffee Culture Workshop', date: '2025-02-15', type: 'Workshop', location: 'Cultural Center' },
    { id: 3, title: 'Ancient Music Concert', date: '2025-03-01', type: 'Event', location: 'Hager Fikir Theatre' },
  ];

  useEffect(() => {
    // Simulate API calls to fetch user data
    setTimeout(() => {
      setFavoriteArtifacts(mockFavoriteArtifacts);
      setBookedTours(mockBookedTours);
      setRecentViews(mockRecentViews);
      setFeaturedMuseums(mockFeaturedMuseums);
      setNewArtifacts(mockNewArtifacts);
      setUpcomingEvents(mockUpcomingEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visitor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, description, color = 'amber' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VisitorSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Visitor'}!</h1>
            <p className="text-gray-600 mt-1">Discover Ethiopia's rich heritage and cultural treasures</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Favorites"
              value={favoriteArtifacts.length}
              icon={Heart}
              description="Items you've saved"
              color="red"
            />
            <StatCard
              title="Booked Tours"
              value={bookedTours.length}
              icon={Calendar}
              description="Upcoming experiences"
              color="blue"
            />
            <StatCard
              title="Recently Viewed"
              value={recentViews.length}
              icon={Eye}
              description="Your viewing history"
              color="green"
            />
            <StatCard
              title="Museums Visited"
              value={5}
              icon={MapPin}
              description="Virtual explorations"
              color="purple"
            />
          </div>

          {/* Featured Museums */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Featured Museums</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMuseums.map(museum => (
                <div key={museum.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <img src={museum.image} alt={museum.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{museum.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{museum.type}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{museum.artifacts} artifacts</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-700">{museum.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Artifacts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Recently Added Artifacts</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">Browse All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {newArtifacts.map(artifact => (
                <div key={artifact.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <img src={artifact.image} alt={artifact.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1">{artifact.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{artifact.museum}</p>
                    <p className="text-xs text-amber-600">Added {artifact.addedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View Calendar</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.date}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Play className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">3D Tours</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Image className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Gallery</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Events</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-8 w-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Learn</span>
              </button>
            </div>
          </div>

          {/* Your Favorites */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Your Favorites</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
            </div>
            {favoriteArtifacts.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't favorited any artifacts yet.</p>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Explore Artifacts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteArtifacts.slice(0, 6).map(artifact => (
                  <div key={artifact.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <img src={artifact.image} alt={artifact.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1">{artifact.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{artifact.museum}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                        {artifact.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Your Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Your Bookings</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">Manage Bookings</button>
            </div>
            {bookedTours.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You don't have any upcoming bookings.</p>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedTours.map(tour => (
                  <div key={tour.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{tour.title}</h3>
                      <p className="text-sm text-gray-600">{tour.date} at {tour.time}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      tour.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tour.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Viewed */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Recently Viewed</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View History</button>
            </div>
            {recentViews.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity to show.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentViews.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-500">{item.viewedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ethiopian Heritage Explorer - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Ethiopian Heritage Explorer</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">Explore More</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://picsum.photos/300/200?random=10" alt="Rock Churches" className="w-full h-24 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Rock-Hewn Churches</h3>
                <p className="text-xs text-gray-600">Lalibela's 11 medieval churches</p>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">UNESCO Site</span>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://picsum.photos/300/200?random=11" alt="Simien Mountains" className="w-full h-24 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Simien Mountains</h3>
                <p className="text-xs text-gray-600">Endemic wildlife & landscapes</p>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">National Park</span>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://picsum.photos/300/200?random=12" alt="Harar Jugol" className="w-full h-24 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Harar Jugol</h3>
                <p className="text-xs text-gray-600">4th holy city of Islam</p>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Historic City</span>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://picsum.photos/300/200?random=13" alt="Aksum Kingdom" className="w-full h-24 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Ancient Aksum</h3>
                <p className="text-xs text-gray-600">Obelisks & ancient kingdom</p>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Archaeological</span>
              </div>
            </div>
          </div>

          {/* Learning Path Progress - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Ethiopian History</span>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Cultural Traditions</span>
                  <span className="text-sm text-gray-500">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Archaeological Sites</span>
                  <span className="text-sm text-gray-500">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Next Recommended</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Queen of Sheba Legend</p>
                      <p className="text-xs text-gray-600">15 min read</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Virtual Aksum Tour</p>
                      <p className="text-xs text-gray-600">30 min experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Section - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Heritage Map Explorer</h2>
              <button className="text-amber-600 hover:text-amber-700 font-medium">Full Map View</button>
            </div>
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 h-64 rounded-lg overflow-hidden">
              <img src="https://picsum.photos/800/300?random=20" alt="Ethiopia Map" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Explore Ethiopia</h3>
                  <p className="text-sm">Discover heritage sites across the country</p>
                  <button className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Launch Interactive Map
                  </button>
                </div>
              </div>
              {/* Map Markers */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-6 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Achievements & Badges - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-900">First Visit</p>
                <p className="text-xs text-gray-600">Explorer</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-900">History Buff</p>
                <p className="text-xs text-gray-600">5 Articles Read</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-b from-green-100 to-green-200 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-900">Artifact Hunter</p>
                <p className="text-xs text-gray-600">10 Items Viewed</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-900">Event Goer</p>
                <p className="text-xs text-gray-600">3 Events Attended</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-xs font-medium text-gray-600">Community Member</p>
                <p className="text-xs text-gray-500">Join Discussions</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-xs font-medium text-gray-600">Collector</p>
                <p className="text-xs text-gray-500">Save 20 Items</p>
              </div>
            </div>
          </div>

          {/* Recommended for You - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <img src="https://picsum.photos/300/200?random=30" alt="Coffee Origins" className="w-full h-32 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Ethiopian Coffee Origins</h3>
                <p className="text-sm text-gray-600 mb-3">Discover the birthplace of coffee and its journey through Ethiopian culture.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Cultural</span>
                  <span className="text-xs text-gray-500">20 min read</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <img src="https://picsum.photos/300/200?random=31" alt="Ancient Scripts" className="w-full h-32 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Ge'ez Script Workshop</h3>
                <p className="text-sm text-gray-600 mb-3">Learn about Ethiopia's ancient writing system still used today.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Educational</span>
                  <span className="text-xs text-gray-500">45 min workshop</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <img src="https://picsum.photos/300/200?random=32" alt="Traditional Music" className="w-full h-32 object-cover rounded-md mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Ethiopian Traditional Music</h3>
                <p className="text-sm text-gray-600 mb-3">Experience the rich musical heritage of Ethiopia's diverse cultures.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Music</span>
                  <span className="text-xs text-gray-500">30 min experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community & Social Features - NEW SECTION */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Community Highlights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Discussions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ahmed K.</p>
                      <p className="text-xs text-gray-600">"The Lucy exhibit was incredible! Any plans for more fossil displays?"</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago • 5 replies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Sara M.</p>
                      <p className="text-xs text-gray-600">"Loved the coffee ceremony workshop! When's the next one?"</p>
                      <p className="text-xs text-gray-500 mt-1">4 hours ago • 8 replies</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular This Week</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <img src="https://picsum.photos/60/60?random=40" alt="Popular Content" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Rock Churches Virtual Tour</p>
                      <p className="text-xs text-gray-600">1.2K views this week</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Trending</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <img src="https://picsum.photos/60/60?random=41" alt="Popular Content" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ancient Script Decoder</p>
                      <p className="text-xs text-gray-600">856 participants</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Interactive</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Join Community Discussions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
