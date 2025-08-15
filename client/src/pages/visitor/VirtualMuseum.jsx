import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Heart, Play, Box, Image as ImageIcon } from 'lucide-react';
import VisitorSidebar from '../../components/dashboard/VisitorSidebar';

const VirtualMuseum = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Mock data for artifacts
  const mockArtifacts = [
    {
      id: 1,
      name: 'Ancient Ethiopian Cross',
      description: 'A beautifully crafted cross from the 12th century, showcasing Ethiopian Orthodox Christian artistry.',
      image: '/api/placeholder/300/200',
      category: 'Religious',
      museum: 'National Museum of Ethiopia',
      era: '12th Century',
      material: 'Bronze',
      has3D: true,
      hasVideo: false,
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      name: 'Traditional Coffee Set',
      description: 'Complete traditional Ethiopian coffee ceremony set including clay pots, cups, and roasting pan.',
      image: '/api/placeholder/300/200',
      category: 'Cultural',
      museum: 'Ethnological Museum',
      era: '19th Century',
      material: 'Clay, Wood',
      has3D: true,
      hasVideo: true,
      views: 892,
      likes: 156
    },
    {
      id: 3,
      name: 'King Lalibela Crown Replica',
      description: 'Replica of the ceremonial crown worn by King Lalibela, famous for the rock-hewn churches.',
      image: '/api/placeholder/300/200',
      category: 'Royal',
      museum: 'Royal Heritage Museum',
      era: '12th-13th Century',
      material: 'Gold, Silver, Gems',
      has3D: true,
      hasVideo: false,
      views: 2103,
      likes: 245
    },
    {
      id: 4,
      name: 'Ancient Ge\'ez Manuscript',
      description: 'Illuminated manuscript written in ancient Ge\'ez script, containing religious texts.',
      image: '/api/placeholder/300/200',
      category: 'Literary',
      museum: 'National Library',
      era: '14th Century',
      material: 'Parchment, Ink',
      has3D: false,
      hasVideo: false,
      views: 678,
      likes: 92
    },
    {
      id: 5,
      name: 'Lucy Fossil Cast',
      description: 'Cast of the famous Lucy fossil, one of the most important paleoanthropological finds.',
      image: '/api/placeholder/300/200',
      category: 'Archaeological',
      museum: 'National Museum of Ethiopia',
      era: '3.2 Million Years Ago',
      material: 'Fossilized Bone',
      has3D: true,
      hasVideo: true,
      views: 5420,
      likes: 892
    },
    {
      id: 6,
      name: 'Traditional Weaving Tools',
      description: 'Set of traditional Ethiopian weaving tools used to create beautiful textiles.',
      image: '/api/placeholder/300/200',
      category: 'Cultural',
      museum: 'Craft Museum',
      era: '18th-19th Century',
      material: 'Wood, Metal',
      has3D: true,
      hasVideo: false,
      views: 445,
      likes: 67
    }
  ];

  const categories = ['all', 'Religious', 'Cultural', 'Royal', 'Literary', 'Archaeological'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArtifacts(mockArtifacts);
      setFilteredArtifacts(mockArtifacts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = artifacts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(artifact => 
        artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.museum.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artifact => artifact.category === selectedCategory);
    }

    setFilteredArtifacts(filtered);
  }, [searchQuery, selectedCategory, artifacts]);

  const ArtifactCard = ({ artifact }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative">
        <img 
          src={artifact.image} 
          alt={artifact.name} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {artifact.has3D && (
            <div className="bg-blue-600 text-white p-1.5 rounded-full">
              <Box className="h-3 w-3" />
            </div>
          )}
          {artifact.hasVideo && (
            <div className="bg-red-600 text-white p-1.5 rounded-full">
              <Play className="h-3 w-3" />
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white text-sm">
          <div className="flex items-center space-x-1 bg-black bg-opacity-50 px-2 py-1 rounded">
            <Eye className="h-3 w-3" />
            <span>{artifact.views}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black bg-opacity-50 px-2 py-1 rounded">
            <Heart className="h-3 w-3" />
            <span>{artifact.likes}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{artifact.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{artifact.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{artifact.museum}</span>
            <span>{artifact.era}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
              {artifact.category}
            </span>
            <span className="text-xs text-gray-500">{artifact.material}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <VisitorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading virtual museum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VisitorSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Museum</h1>
            <p className="text-gray-600">Explore Ethiopian heritage through 3D artifacts, images, and videos</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search artifacts, museums, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <div className="w-5 h-5 flex flex-col space-y-1">
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                    <div className="bg-current h-1 rounded-sm"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredArtifacts.length} artifact{filteredArtifacts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Artifacts Grid */}
          {filteredArtifacts.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artifacts found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredArtifacts.map(artifact => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualMuseum;
