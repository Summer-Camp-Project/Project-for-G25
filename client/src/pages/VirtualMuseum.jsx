import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Eye, Heart, Share2, Box, Calendar, Clock, Users, Star, Play, ArrowRight, Lock } from 'lucide-react';
import ArtifactCard from '../components/virtual-museum/ArtifactCard';
import FilterPanel from '../components/virtual-museum/FilterPanel';
import ARVRViewer from '../components/virtual-museum/SimpleARVRViewer';
import { useAuth } from '../hooks/useAuth';

const VirtualMuseum = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [showARVR, setShowARVR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    period: '',
    origin: '',
    museum: '',
    has3D: false
  });

  // Mock data - replace with API calls
  const mockArtifacts = [
    {
      id: 1,
      name: 'Ancient Ethiopian Cross',
      description: 'A beautifully crafted cross from the 12th century, representing the rich Christian heritage of Ethiopia.',
      image: '/api/placeholder/300/200',
      category: 'Religious Artifacts',
      period: '12th Century',
      origin: 'Lalibela',
      museum: 'National Museum of Ethiopia',
      has3DModel: true,
      views: 1250,
      likes: 89,
      rating: 4.8,
      isFavorited: false
    },
    {
      id: 2,
      name: 'Traditional Coffee Ceremony Set',
      description: 'Complete set used in traditional Ethiopian coffee ceremonies, showcasing the cultural significance of coffee.',
      image: '/api/placeholder/300/200',
      category: 'Cultural Artifacts',
      period: '19th Century',
      origin: 'Kaffa Region',
      museum: 'Ethnological Museum',
      has3DModel: true,
      views: 980,
      likes: 67,
      rating: 4.6,
      isFavorited: true
    },
    {
      id: 3,
      name: 'Ancient Manuscript',
      description: 'Rare illuminated manuscript written in Ge\'ez, containing religious texts and historical records.',
      image: '/api/placeholder/300/200',
      category: 'Manuscripts',
      period: '15th Century',
      origin: 'Gondar',
      museum: 'Institute of Ethiopian Studies',
      has3DModel: false,
      views: 756,
      likes: 45,
      rating: 4.9,
      isFavorited: false
    },
    {
      id: 4,
      name: 'Royal Crown of Menelik II',
      description: 'Ornate crown worn by Emperor Menelik II, symbolizing the imperial power of Ethiopia.',
      image: '/api/placeholder/300/200',
      category: 'Royal Artifacts',
      period: '19th Century',
      origin: 'Addis Ababa',
      museum: 'National Museum of Ethiopia',
      has3DModel: true,
      views: 2100,
      likes: 156,
      rating: 4.9,
      isFavorited: false
    },
    {
      id: 5,
      name: 'Ancient Stone Tablet',
      description: 'Stone tablet with inscriptions in ancient Ethiopian script, providing insights into early civilization.',
      image: '/api/placeholder/300/200',
      category: 'Archaeological',
      period: '8th Century',
      origin: 'Axum',
      museum: 'Axum Museum',
      has3DModel: true,
      views: 834,
      likes: 72,
      rating: 4.7,
      isFavorited: true
    },
    {
      id: 6,
      name: 'Traditional Weaving Tools',
      description: 'Set of traditional tools used for weaving Ethiopian textiles, showcasing ancient craftsmanship.',
      image: '/api/placeholder/300/200',
      category: 'Tools & Crafts',
      period: '18th Century',
      origin: 'Dorze',
      museum: 'Cultural Heritage Museum',
      has3DModel: false,
      views: 567,
      likes: 38,
      rating: 4.4,
      isFavorited: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArtifacts(mockArtifacts);
      setFilteredArtifacts(mockArtifacts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = artifacts.filter(artifact => {
      const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || artifact.category === filters.category;
      const matchesPeriod = !filters.period || artifact.period === filters.period;
      const matchesOrigin = !filters.origin || artifact.origin === filters.origin;
      const matchesMuseum = !filters.museum || artifact.museum === filters.museum;
      const matches3D = !filters.has3D || artifact.has3DModel;

      return matchesSearch && matchesCategory && matchesPeriod && matchesOrigin && matchesMuseum && matches3D;
    });

    setFilteredArtifacts(filtered);
  }, [searchTerm, filters, artifacts]);

  const handleArtifactView = (artifact) => {
    setSelectedArtifact(artifact);
    if (artifact.has3DModel) {
      setShowARVR(true);
    }
  };

  const handleFavorite = (artifactId, isFavorited) => {
    setArtifacts(prev => prev.map(artifact => 
      artifact.id === artifactId ? { ...artifact, isFavorited } : artifact
    ));
  };

  const handleShare = (artifact) => {
    if (navigator.share) {
      navigator.share({
        title: artifact.name,
        text: artifact.description,
        url: window.location.href + '/' + artifact.id
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href + '/' + artifact.id);
      alert('Link copied to clipboard!');
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      period: '',
      origin: '',
      museum: '',
      has3D: false
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading virtual museum...</p>
        </div>
      </div>
    );
  }

  // Virtual Tours Data
  const virtualTours = [
    {
      id: 1,
      title: "Ancient Ethiopia: Aksum to Lalibela",
      description: "Journey through 3000 years of Ethiopian civilization",
      duration: "45 minutes",
      price: 15,
      maxParticipants: 20,
      rating: 4.9,
      image: '/api/placeholder/300/200',
      features: ['3D Artifacts', 'Expert Guide', 'Interactive Q&A']
    },
    {
      id: 2,
      title: "Royal Treasures of Ethiopia",
      description: "Explore the imperial collections and royal regalia",
      duration: "30 minutes", 
      price: 20,
      maxParticipants: 15,
      rating: 4.8,
      image: '/api/placeholder/300/200',
      features: ['3D Crown Viewing', 'Historical Context', 'Royal Stories']
    }
  ];

  const handleBookTour = (tour) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/virtual-museum');
      navigate('/auth');
      return;
    }
    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  // Booking Modal Component
  const BookingModal = ({ tour, isOpen, onClose }) => {
    const [bookingData, setBookingData] = useState({
      date: '',
      time: '',
      participants: 1,
      email: user?.email || '',
      phone: '',
      specialRequests: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Process booking
      alert(`Booking confirmed for ${tour.title}!\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nParticipants: ${bookingData.participants}`);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Virtual Tour</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{tour.title}</h3>
              <p className="text-gray-600">{tour.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {tour.duration} • ${tour.price} per person
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxParticipants}
                  required
                  value={bookingData.participants}
                  onChange={(e) => setBookingData({...bookingData, participants: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${(tour.price * bookingData.participants).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured 3D Artifacts Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Virtual Museum Experience
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Explore Ethiopia's heritage in immersive 3D detail
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Box className="w-5 h-5 mr-2" />
                Interactive 3D Models
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 mr-2" />
                Live Virtual Tours
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5 mr-2" />
                Book Guided Tours
              </div>
            </div>
          </div>

          {/* Featured 3D Artifacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artifacts.filter(artifact => artifact.has3DModel).slice(0, 3).map(artifact => (
              <div key={artifact.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={artifact.image}
                    alt={artifact.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Box className="w-4 h-4 mr-1" />
                      3D View
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleArtifactView(artifact)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Explore in 3D
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{artifact.name}</h3>
                  <p className="text-white/80 mb-4 line-clamp-2">{artifact.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{artifact.origin}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-white/80">{artifact.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual Tours Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Virtual Tours
            </h2>
            <p className="text-xl text-gray-600">
              Join expert-guided tours with interactive 3D experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {virtualTours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{tour.rating}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tour.features.map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-amber-600">
                      ${tour.price}
                    </div>
                    <button
                      onClick={() => handleBookTour(tour)}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center"
                    >
                      {!isAuthenticated ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Login to Book
                        </>
                      ) : (
                        <>
                          Book Tour
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Virtual Museum</h1>
              <p className="mt-1 text-gray-600">
                Explore Ethiopia's rich cultural heritage through our digital collections
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search artifacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                artifacts={artifacts}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredArtifacts.length} of {artifacts.length} artifacts
              </p>
              
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <button
                  onClick={clearFilters}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Artifacts Grid/List */}
            {filteredArtifacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artifacts found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredArtifacts.map(artifact => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    onView={handleArtifactView}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AR/VR Viewer Modal */}
      {showARVR && selectedArtifact && (
        <ARVRViewer
          artifact={selectedArtifact}
          onClose={() => {
            setShowARVR(false);
            setSelectedArtifact(null);
          }}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        tour={selectedTour}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTour(null);
        }}
      />
    </div>
  );
};

export default VirtualMuseum;
