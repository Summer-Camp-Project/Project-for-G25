import axios from 'axios';

const API_URL = '/api/map';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const getMuseumLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/museums`);
    return response.data;
  } catch (error) {
    console.error('Error fetching museum locations', error);
    throw error;
  }
};

const getHeritageSites = async () => {
  try {
    const response = await axios.get(`${API_URL}/heritage-sites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching heritage sites', error);
    throw error;
  }
};

const getLocationsByCoordinates = async (lat, lng, radius = 10) => {
  try {
    const response = await axios.get(`${API_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby locations', error);
    throw error;
  }
};

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=ET`
    );
    return response.data;
  } catch (error) {
    console.error('Error geocoding address', error);
    throw error;
  }
};

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding', error);
    throw error;
  }
};

const getDirections = async (start, end) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${MAPBOX_TOKEN}&geometries=geojson`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting directions', error);
    throw error;
  }
};

const addLocation = async (locationData) => {
  try {
    const response = await axios.post(`${API_URL}/locations`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error adding location', error);
    throw error;
  }
};

const updateLocation = async (locationId, locationData) => {
  try {
    const response = await axios.put(`${API_URL}/locations/${locationId}`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error updating location', error);
    throw error;
  }
};

export default {
  getMuseumLocations,
  getHeritageSites,
  getLocationsByCoordinates,
  geocodeAddress,
  reverseGeocode,
  getDirections,
  addLocation,
  updateLocation,
};
