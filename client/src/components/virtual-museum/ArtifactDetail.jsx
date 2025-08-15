import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, MapPin, Calendar, Info, Globe, Maximize, Minimize } from 'lucide-react';
import ARVRViewer from './ARVRViewer';

const ArtifactDetail = ({ artifact, onClose }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showARVR, setShowARVR] = useState(false);

  useEffect(() => {
    if (artifact) {
      setIsFavorited(artifact.isFavorited || false);
    }
  }, [artifact]);

  if (!artifact) {
    return null;
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In a real app, you'd send this to your backend
    console.log(`Artifact ${artifact.id} favorited: ${!isFavorited}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artifact.name,
        text: artifact.description,
        url: window.location.href + '/' + artifact.id
      });
    } else {
      navigator.clipboard.writeText(window.location.href + '/' + artifact.id);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image/3D Model Section */}
        <div className="lg:w-1/2 relative">
          {artifact.has3DModel && showARVR ? (
            <ARVRViewer artifact={artifact} />
          ) : (
            <img
              src={artifact.image || '/api/placeholder/600/400'}
              alt={artifact.name}
              className="w-full h-96 object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
            />
          )}
          {artifact.has3DModel && (
            <button
              onClick={() => setShowARVR(!showARVR)}
              className="absolute bottom-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-full flex items-center space-x-2 hover:bg-blue-700"
            >
              {showARVR ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              <span>{showARVR ? 'Exit 3D View' : 'View in 3D'}</span>
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 p-6 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">{artifact.name}</h2>
          <p className="text-gray-700 text-lg">{artifact.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>Origin: {artifact.origin}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Period: {artifact.period}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-gray-500" />
              <span>Category: {artifact.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span>Museum: {artifact.museum}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleFavorite}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />
              <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Additional Details (optional) */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Historical Context</h3>
            <p className="text-gray-700 text-sm">
              {artifact.historicalContext || 'No additional historical context available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetail;