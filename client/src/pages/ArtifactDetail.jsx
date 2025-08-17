import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArtifactDetailComponent from '../components/virtual-museum/ArtifactDetail';

const ArtifactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with API call to fetch artifact by ID
  const mockArtifacts = [
    {
      id: '1',
      name: 'Ancient Ethiopian Cross',
      description: 'A beautifully crafted cross from the 12th century, representing the rich Christian heritage of Ethiopia.',
      image: '/api/placeholder/600/400',
      category: 'Religious Artifacts',
      period: '12th Century',
      origin: 'Lalibela',
      museum: 'National Museum of Ethiopia',
      has3DModel: true,
      views: 1250,
      likes: 89,
      rating: 4.8,
      isFavorited: false,
      historicalContext: 'This cross is believed to have been used in ancient religious ceremonies in the rock-hewn churches of Lalibela. Its intricate design reflects the advanced craftsmanship of the era.'
    },
    {
      id: '2',
      name: 'Traditional Coffee Ceremony Set',
      description: 'Complete set used in traditional Ethiopian coffee ceremonies, showcasing the cultural significance of coffee.',
      image: '/api/placeholder/600/400',
      category: 'Cultural Artifacts',
      period: '19th Century',
      origin: 'Kaffa Region',
      museum: 'Ethnological Museum',
      has3DModel: true,
      views: 980,
      likes: 67,
      rating: 4.6,
      isFavorited: true,
      historicalContext: 'The coffee ceremony is a fundamental part of Ethiopian social and cultural life. This set includes a jebena (coffee pot), cups, and an incense burner, all essential for the ritual.'
    },
    {
      id: '3',
      name: 'Ancient Manuscript',
      description: 'Rare illuminated manuscript written in Ge\'ez, containing religious texts and historical records.',
      image: '/api/placeholder/600/400',
      category: 'Manuscripts',
      period: '15th Century',
      origin: 'Gondar',
      museum: 'Institute of Ethiopian Studies',
      has3DModel: false,
      views: 756,
      likes: 45,
      rating: 4.9,
      isFavorited: false,
      historicalContext: 'Ge\'ez is an ancient South Semitic language of Ethiopia. Manuscripts like this one are crucial for understanding the history, religion, and literature of the region.'
    },
    {
      id: '4',
      name: 'Royal Crown of Menelik II',
      description: 'Ornate crown worn by Emperor Menelik II, symbolizing the imperial power of Ethiopia.',
      image: '/api/placeholder/600/400',
      category: 'Royal Artifacts',
      period: '19th Century',
      origin: 'Addis Ababa',
      museum: 'National Museum of Ethiopia',
      has3DModel: true,
      views: 2100,
      likes: 156,
      rating: 4.9,
      isFavorited: false,
      historicalContext: 'Emperor Menelik II was a pivotal figure in Ethiopian history, known for his military victories and modernization efforts. This crown represents his reign and the Solomonic dynasty.'
    },
    {
      id: '5',
      name: 'Ancient Stone Tablet',
      description: 'Stone tablet with inscriptions in ancient Ethiopian script, providing insights into early civilization.',
      image: '/api/placeholder/600/400',
      category: 'Archaeological',
      period: '8th Century',
      origin: 'Axum',
      museum: 'Axum Museum',
      has3DModel: true,
      views: 834,
      likes: 72,
      rating: 4.7,
      isFavorited: true,
      historicalContext: 'Axum was an ancient kingdom and trading nation. Stone tablets with inscriptions are vital archaeological finds that shed light on the language, governance, and daily life of the Axumite civilization.'
    },
    {
      id: '6',
      name: 'Traditional Weaving Tools',
      description: 'Set of traditional tools used for weaving Ethiopian textiles, showcasing ancient craftsmanship.',
      image: '/api/placeholder/600/400',
      category: 'Tools & Crafts',
      period: '18th Century',
      origin: 'Dorze',
      museum: 'Cultural Heritage Museum',
      has3DModel: false,
      views: 567,
      likes: 38,
      rating: 4.4,
      isFavorited: false,
      historicalContext: 'Ethiopian textiles are renowned for their vibrant colors and intricate patterns. These tools represent the traditional weaving techniques passed down through generations, particularly from communities like the Dorze.'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      const foundArtifact = mockArtifacts.find(art => art.id === id);
      if (foundArtifact) {
        setArtifact(foundArtifact);
      } else {
        setError('Artifact not found.');
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading artifact details...</p>
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
          <button
            onClick={() => navigate('/virtual-museum')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Virtual Museum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <ArtifactDetailComponent artifact={artifact} onClose={() => navigate('/virtual-museum')} />
    </div>
  );
};

export default ArtifactDetail;
