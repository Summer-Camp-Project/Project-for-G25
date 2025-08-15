import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

const InteractiveMap = ({ locations, onSelectLocation, initialCenter = [38.7578, 9.0292], initialZoom = 9 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(initialCenter[0]);
  const [lat, setLat] = useState(initialCenter[1]);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for locations
    if (locations) {
      locations.forEach(location => {
        const marker = new mapboxgl.Marker()
          .setLngLat([location.longitude, location.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${location.name}</h3><p>${location.description}</p>`))
          .addTo(map.current);

        if (onSelectLocation) {
          marker.getElement().addEventListener('click', () => onSelectLocation(location));
        }
      });
    }

    return () => map.current.remove();
  }, [locations, onSelectLocation, initialCenter, initialZoom]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="map-container w-full h-full" />
      <div className="sidebar absolute top-0 left-0 m-2 p-2 bg-white bg-opacity-75 rounded-lg text-sm z-10">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
};

export default InteractiveMap;