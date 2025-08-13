import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Info, Globe } from 'lucide-react';
import InteractiveMap from '../components/map/InteractiveMap';
import SiteSelector from '../components/map/SiteSelector';

const MapPage = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now (replace with API call)
  useEffect(() => {
    const mockSites = [
      {
        id: 1,
        name: "Rock-Hewn Churches of Lalibela",
        region: "Amhara",
        category: "UNESCO World Heritage",
        lat: 12.0333,
        lng: 39.0333
      },
      {
        id: 2, 
        name: "Aksum Obelisks",
        region: "Tigray",
        category: "UNESCO World Heritage",
        lat: 14.1319,
        lng: 38.7195
      },
      {
        id: 3,
        name: "Simien Mountains",
        region: "Amhara",
        category: "Natural Heritage", 
        lat: 13.1885,
        lng: 38.0404
      }
    ];
    
    setTimeout(() => {
      setSites(mockSites);
      setFilteredSites(mockSites);
      setLoading(false);
    }, 500);
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading heritage sites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <Globe className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">Ethiopian Heritage Map</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Explore Ethiopia's rich cultural and natural heritage sites across the country
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Site Selector */}
        <div className="w-1/3 bg-card border-r border-border overflow-y-auto">
          <SiteSelector 
            sites={sites}
            onSiteSelect={handleSiteSelect}
            selectedSite={selectedSite}
          />
        </div>

        {/* Right Side - Interactive Map */}
        <div className="flex-1">
          <InteractiveMap 
            sites={filteredSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
