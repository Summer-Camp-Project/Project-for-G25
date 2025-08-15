import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

export function useMap(initialCenter = [38.7578, 9.0292], initialZoom = 9) {
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

    return () => map.current.remove();
  }, []);

  const addMarker = (longitude, latitude, popupHTML = '') => {
    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    if (popupHTML) {
      marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML));
    }
    return marker;
  };

  const flyTo = (center, zoomLevel = 12) => {
    map.current.flyTo({ center, zoom: zoomLevel, essential: true });
  };

  return {
    mapContainer, 
    mapInstance: map.current, 
    lng, 
    lat, 
    zoom, 
    addMarker, 
    flyTo
  };
}