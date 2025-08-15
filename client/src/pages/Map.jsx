import React, { useState } from 'react';
import InteractiveMap from '../components/map/InteractiveMap';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Mock locations - replace with API call to fetch actual heritage sites/museums
  const locations = [
    { id: 1, name: 'National Museum of Ethiopia', description: 'Home to Lucy, an ancient hominid fossil.', latitude: 9.0305, longitude: 38.7616 },
    { id: 2, name: 'Ethnological Museum', description: 'Showcases the cultural and social history of Ethiopia.', latitude: 9.0416, longitude: 38.7602 },
    { id: 3, name: 'Holy Trinity Cathedral', description: 'Important Ethiopian Orthodox Tewahedo cathedral.', latitude: 9.0238, longitude: 38.7691 },
    { id: 4, name: 'Unity Park', description: 'A historical and recreational park in Addis Ababa.', latitude: 9.0133, longitude: 38.7568 },
    { id: 5, name: 'Lalibela Rock-Hewn Churches', description: 'UNESCO World Heritage Site, 11 medieval monolithic churches.', latitude: 12.0326, longitude: 39.0433 },
    { id: 6, name: 'Fasil Ghebbi (Gondar)', description: 'Royal enclosure of the Ethiopian emperors.', latitude: 12.6078, longitude: 37.4514 },
  ];

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Explore Heritage Sites</h1>
          <p className="mt-1 text-gray-600">Discover historical and cultural locations across Ethiopia</p>
        </div>
      </div>

      <div className="flex-1 w-full h-[70vh]">
        <InteractiveMap locations={locations} onSelectLocation={handleSelectLocation} />
      </div>

      {selectedLocation && (
        <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLocation.name}</h2>
          <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedLocation(null)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;