import { useState, useEffect } from 'react';

// Mock implementation for distance calculation
// In a real app, this would use actual geolocation and calculate real distances
export const useDistanceCalculator = () => {
  const [userLocation, setUserLocation] = useState(null);

  const calculateDistance = (place) => {
    // Mock distances for demonstration
    // In production, this would calculate actual distance using:
    // - User's current location from navigator.geolocation
    // - Place coordinates from place.coordinates
    // - Haversine formula or Google Distance Matrix API
    
    const mockDistances = ['0.3km', '0.7km', '1.2km', '0.9km', '1.8km', '2.1km', '0.5km'];
    const placeId = place.id || 0;
    
    // Create consistent distance for each place by using place ID
    const index = (typeof placeId === 'string' ? placeId.length : placeId) % mockDistances.length;
    return mockDistances[index];
  };

  const calculateSimilarity = (place) => {
    // Mock similarity calculation
    // In production, this would analyze:
    // - User's favorites pattern
    // - Place categories and tags
    // - User's previous ratings and visits
    // - Collaborative filtering data
    
    const baseSimilarity = 75 + (Math.abs(place.name?.length || 0) % 20);
    return Math.min(95, Math.max(65, baseSimilarity));
  };

  // Mock function to simulate getting user location
  useEffect(() => {
    // In production, implement actual geolocation
    // navigator.geolocation.getCurrentPosition((position) => {
    //   setUserLocation({
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude
    //   });
    // });
    
    // For now, use mock Seoul location
    setUserLocation({ lat: 37.5665, lng: 126.9780 });
  }, []);

  return {
    userLocation,
    calculateDistance,
    calculateSimilarity
  };
};

// Export individual functions for direct import
export const calculateMockDistance = (place) => {
  const mockDistances = ['0.3km', '0.7km', '1.2km', '0.9km', '1.8km', '2.1km', '0.5km'];
  const placeId = place.id || 0;
  const index = (typeof placeId === 'string' ? placeId.length : placeId) % mockDistances.length;
  return mockDistances[index];
};

export const calculateMockSimilarity = (place) => {
  const baseSimilarity = 75 + (Math.abs(place.name?.length || 0) % 20);
  return Math.min(95, Math.max(65, baseSimilarity));
};
