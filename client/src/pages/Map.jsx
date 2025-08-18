import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Navigation, Info, Eye, Calendar, Clock, Users, X, Layers } from 'lucide-react';
import MapContainer from '../components/map/MapContainer';
import mapService from '../services/mapService';

const Map = () => {
  const [heritageSites, setHeritageSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    type: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    regions: [],
    types: []
  });

  // Load heritage sites and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load heritage sites
        const sitesResponse = await fetch('/api/map/heritage-sites');
        const sitesData = await sitesResponse.json();
        
        if (sitesData.success) {
          setHeritageSites(sitesData.data);
          setFilteredSites(sitesData.data);
        }
        
        // Load filter options
        const filtersResponse = await fetch('/api/map/heritage-sites/filters');
        const filtersData = await filtersResponse.json();
        
        if (filtersData.success) {
          setFilterOptions(filtersData.data);
        }
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...heritageSites];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(site =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(site => site.category === filters.category);
    }
    
    if (filters.region) {
      filtered = filtered.filter(site => site.region === filters.region);
    }
    
    if (filters.type) {
      filtered = filtered.filter(site => site.type === filters.type);
    }
    
    setFilteredSites(filtered);
  }, [searchQuery, filters, heritageSites]);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    if (site) {
      setShowSiteDetails(true);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', region: '', type: '' });
    setSearchQuery('');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'UNESCO World Heritage':
        return <Star className="w-4 h-4 text-primary" />;
      case 'Natural Heritage':
        return <Layers className="w-4 h-4 text-secondary" />;
      case 'National Museum':
      case 'Museum':
        return <Eye className="w-4 h-4 text-accent" />;
      default:
        return <MapPin className="w-4 h-4 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Ethiopian Heritage Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ethiopian Heritage Map
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Discover {heritageSites.length} heritage sites across Ethiopia
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 mr-2" />
                9 UNESCO World Heritage Sites
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Eye className="w-5 h-5 mr-2" />
                Museums & Cultural Centers
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Layers className="w-5 h-5 mr-2" />
                Natural Heritage Sites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Map Container */}
      <div className="h-[calc(100vh-200px)]">
        <MapContainer 
          sites={heritageSites}
          selectedSite={selectedSite}
          onSiteSelect={handleSiteSelect}
          showSidebar={true}
          showSearch={true}
          showFilters={true}
          mapType="auto"
        />
      </div>

      {/* Site Details Modal */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  {getCategoryIcon(selectedSite.category)}
                  <h2 className="text-2xl font-bold ml-2">{selectedSite.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                    {selectedSite.region} Region
                  </div>
                  {selectedSite.yearInscribed && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                      Inscribed {selectedSite.yearInscribed}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSite.category === 'UNESCO World Heritage'
                      ? 'bg-primary/20 text-primary'
                      : selectedSite.category === 'Natural Heritage'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {selectedSite.category}
                  </span>
                  {selectedSite.type && (
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {selectedSite.type}
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedSite.description}
                  </p>
                </div>
                
                {selectedSite.significance && (
                  <div>
                    <h3 className="font-semibold mb-2">Significance</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedSite.significance}
                    </p>
                  </div>
                )}
                
                {selectedSite.facilities && (
                  <div>
                    <h3 className="font-semibold mb-2">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSite.facilities.map((facility, index) => (
                        <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {selectedSite.bestTimeToVisit && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Best Time to Visit</h4>
                      <p className="text-sm">{selectedSite.bestTimeToVisit}</p>
                    </div>
                  )}
                  {selectedSite.entryFee && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Entry Fee</h4>
                      <p className="text-sm">{selectedSite.entryFee}</p>
                    </div>
                  )}
                  {selectedSite.openingHours && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Opening Hours</h4>
                      <p className="text-sm">{selectedSite.openingHours}</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${selectedSite.lat},${selectedSite.lng}`, '_blank')}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
