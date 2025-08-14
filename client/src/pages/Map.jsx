import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Info, Globe, AlertCircle } from 'lucide-react';
import LeafletMap from '../components/map/LeafletMap';
import SiteSelector from '../components/map/SiteSelector';

const MapPage = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch heritage sites from API
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API, fallback to mock data
        let sitesData;
        try {
          const response = await fetch('http://localhost:5000/api/map/sites');
          if (response.ok) {
            const result = await response.json();
            sitesData = result.data;
          } else {
            throw new Error('API not available');
          }
        } catch (apiError) {
          console.log('API not available, using mock data');
          // Fallback to mock data with more Ethiopian sites
          sitesData = [
            {
              id: 1,
              name: "Rock-Hewn Churches of Lalibela",
              description: "Eleven medieval monolithic cave churches carved from rock",
              region: "Amhara",
              category: "UNESCO World Heritage",
              lat: 12.0333,
              lng: 39.0333
            },
            {
              id: 2, 
              name: "Aksum Obelisks",
              description: "Ancient granite obelisks marking royal tombs",
              region: "Tigray",
              category: "UNESCO World Heritage",
              lat: 14.1319,
              lng: 38.7195
            },
            {
              id: 3,
              name: "Simien Mountains National Park",
              description: "Dramatic mountain landscape with endemic wildlife",
              region: "Amhara",
              category: "Natural Heritage", 
              lat: 13.1885,
              lng: 38.0404
            },
            {
              id: 4,
              name: "Fasil Ghebbi Castle",
              description: "17th century royal fortress and palace complex",
              region: "Amhara",
              category: "UNESCO World Heritage",
              lat: 12.6087,
              lng: 37.4679
            },
            {
              id: 5,
              name: "Harar Jugol",
              description: "Historic fortified city with unique Islamic architecture",
              region: "Harari",
              category: "UNESCO World Heritage",
              lat: 9.3133,
              lng: 42.1333
            },
            {
              id: 6,
              name: "Lower Valley of the Awash",
              description: "Archaeological site with early human fossils including Lucy",
              region: "Afar",
              category: "Archaeological Site",
              lat: 11.0833,
              lng: 40.5833
            }
          ];
        }
        
        setSites(sitesData);
        setFilteredSites(sitesData);
      } catch (err) {
        setError('Failed to load heritage sites');
        console.error('Error fetching sites:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSites();
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
          <LeafletMap 
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
