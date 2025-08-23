import { useState, useEffect, useCallback } from 'react';
import { getAllStores } from '../lib/storeApi';
import { dummyPlaces } from '../lib/dummyData';

/**
 * Custom hook for fetching and managing places data from backend
 */
export const usePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform store data to place format for backward compatibility
  const transformStoreToPlace = useCallback((store) => {
    return {
      id: store.id,
      name: store.name,
      title: store.name, // for compatibility
      category: store.category,
      coordinates: {
        lat: store.coordinates?.lat || 37.5665,
        lng: store.coordinates?.lng || 126.9780
      },
      address: {
        full: store.address || '서울시 강남구',
        district: '강남구',
        street: store.address
      },
      rating: {
        average: store.rating || 4.0,
        count: store.reviewCount || 0
      },
      priceRange: '보통',
      images: store.images || ['/images/tmp.jpg'],
      tags: store.tags || ['인기'],
      description: store.description,
      menu: [],
      features: {},
      phone: store.contact?.phone,
      website: store.website,
      hours: store.hours,
      userInteraction: {
        liked: store.liked || false,
        visited: store.visited || false
      }
    };
  }, []);

  // Fetch places from backend using storeApi
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use our storeApi to get all stores
      const stores = await getAllStores();
      
      if (Array.isArray(stores) && stores.length > 0) {
        // Transform store data to place format
        const transformedPlaces = stores.map(transformStoreToPlace);
        
        setPlaces(transformedPlaces);
        console.log(`✅ Successfully loaded ${transformedPlaces.length} places from store API`);
      } else {
        throw new Error('No stores data received from backend');
      }

    } catch (err) {
      console.warn('Failed to fetch places from backend:', err.message);
      console.log('🔄 Falling back to dummy data for development');
      
      // Fallback to dummy data for development
      setPlaces(dummyPlaces);
      setError('백엔드 연결 실패 - 개발용 더미 데이터 사용');
    } finally {
      setLoading(false);
    }
  }, [transformStoreToPlace]);

  // Fetch places on mount
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Refresh places data
  const refreshPlaces = useCallback(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Get places by category
  const getPlacesByCategory = useCallback((category) => {
    return places.filter(place => place.category === category);
  }, [places]);

  // Get places within bounds
  const getPlacesInBounds = useCallback((bounds) => {
    return places.filter(place => {
      const lat = place.coordinates.lat;
      const lng = place.coordinates.lng;
      return lat >= bounds.south && lat <= bounds.north && 
             lng >= bounds.west && lng <= bounds.east;
    });
  }, [places]);

  // Search places by name or description
  const searchPlaces = useCallback((query) => {
    if (!query) return places;
    
    const lowercaseQuery = query.toLowerCase();
    return places.filter(place => 
      place.name.toLowerCase().includes(lowercaseQuery) ||
      (place.description && place.description.toLowerCase().includes(lowercaseQuery)) ||
      place.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      place.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [places]);

  return {
    places,
    loading,
    error,
    refreshPlaces,
    getPlacesByCategory,
    getPlacesInBounds,
    searchPlaces
  };
};