import React from 'react';
import { Eye, MapPin, Heart, Share2, Star } from 'lucide-react';

const ArtifactCard = ({ artifact, onView, onFavorite, onShare }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavorite(artifact.id, !artifact.isFavorited);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(artifact);
  };

  const handleViewClick = () => {
    onView(artifact);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={artifact.image || '/api/placeholder/300/200'}
          alt={artifact.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                artifact.isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${artifact.isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShareClick}
              className="w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* 3D Badge */}
        {artifact.has3DModel && (
          <div className="absolute top-3 left-3">
            <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              3D View
            </span>
          </div>
        )}
        
        {/* Rating */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
            <span className="text-xs font-medium text-gray-700">{artifact.rating}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Header with category */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
            {artifact.name}
          </h3>
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {artifact.category}
          </span>
        </div>

        {/* Origin and Period */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{artifact.origin}</span>
          <span className="mx-2">•</span>
          <span>{artifact.period}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {artifact.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span>{artifact.views} views</span>
            <span>{artifact.likes} likes</span>
          </div>
          <span className="text-gray-400">{artifact.museum}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewClick}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center group/btn"
        >
          <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          {artifact.has3DModel ? 'Explore in 3D' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default ArtifactCard;
