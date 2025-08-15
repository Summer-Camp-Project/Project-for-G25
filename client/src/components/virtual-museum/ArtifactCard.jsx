import React, { useState } from 'react';
import { Eye, Heart, Share2, Calendar, MapPin, Info } from 'lucide-react';

const ArtifactCard = ({ artifact, onView, onFavorite, onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(artifact.isFavorited || false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite && onFavorite(artifact.id, !isFavorited);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare && onShare(artifact);
  };

  const handleView = () => {
    onView && onView(artifact);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={artifact.image || '/api/placeholder/300/200'} 
          alt={artifact.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {/* Overlay with actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={handleView}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        {artifact.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
              {artifact.category}
            </span>
          </div>
        )}

        {/* 3D Badge */}
        {artifact.has3DModel && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              3D
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {artifact.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {artifact.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          {artifact.period && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{artifact.period}</span>
            </div>
          )}
          
          {artifact.origin && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{artifact.origin}</span>
            </div>
          )}
          
          {artifact.museum && (
            <div className="flex items-center text-xs text-gray-500">
              <Info className="h-3 w-3 mr-1" />
              <span>{artifact.museum}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{artifact.views || 0} views</span>
            <span>{artifact.likes || 0} likes</span>
          </div>
          
          {artifact.rating && (
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(artifact.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({artifact.rating})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactCard;