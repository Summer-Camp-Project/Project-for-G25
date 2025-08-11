import { useState } from "react";
import { Heart, Share2, Eye, MapPin, Clock, Info, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function ArtifactListItem({
  artifact,
  onViewDetails,
  onToggleFavorite,
  onShare,
  isFavorited,
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "weathered":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Image Section */}
          <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {artifact.images && artifact.images.length > 0 && (
              <ImageWithFallback
                src={artifact.images[0]}
                alt={artifact.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:scale-110`}
                onLoad={handleImageLoad}
              />
            )}

            {/* Featured Badge */}
            {artifact.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-600 text-white border-0 shadow-md text-xs">
                  Featured
                </Badge>
              </div>
            )}

            {/* Loading Skeleton */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-200">
                  {artifact.title}
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed overflow-hidden mb-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {artifact.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-200 ${
                    isFavorited
                      ? "text-red-500 border-red-200 hover:bg-red-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => onToggleFavorite(artifact.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-50"
                  onClick={() => onShare(artifact)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  onClick={() => onViewDetails(artifact)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">{artifact.culture}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{artifact.period}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{artifact.region}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{artifact.category}</span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {artifact.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {artifact.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200"
                  >
                    +{artifact.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Condition and Materials */}
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-32">
                    {artifact.materials.slice(0, 2).join(", ")}
                    {artifact.materials.length > 2 && "..."}
                  </span>
                </div>

                <Badge
                  className={`text-xs px-2 py-1 border ${getConditionColor(
                    artifact.condition
                  )}`}
                >
                  {artifact.condition}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
