import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Eye, Heart, Share2 } from 'lucide-react';
import ArtifactCard from '../components/virtual-museum/ArtifactCard';
import FilterPanel from '../components/virtual-museum/FilterPanel';
import ARVRViewer from '../components/virtual-museum/ARVRViewer';

const VirtualMuseum = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [showARVR, setShowARVR] = useState(false);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
};

export default VirtualMuseum;