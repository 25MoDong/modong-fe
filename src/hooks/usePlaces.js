import { useState, useEffect, useCallback } from 'react';
import { getAllStores } from '../lib/storeApi';

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
      // Keep null when missing; we'll geocode from address.detail later
      coordinates: store.coordinates || null,
      address: {
        full: store.address || '',
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

        // Geocode addresses lacking coords using Kakao Maps services
        const geocoded = await maybeGeocodePlaces(transformedPlaces);
        
        setPlaces(geocoded);
        console.log(`✅ Successfully loaded ${geocoded.length} places (geocoded as needed)`);
      } else {
        throw new Error('No stores data received from backend');
      }

    } catch (err) {
      console.warn('Failed to fetch places from backend:', err.message);
      // Do not use dummy data; surface empty state to UI
      setPlaces([]);
      setError('백엔드 연결 실패');
    } finally {
      setLoading(false);
    }
  }, [transformStoreToPlace]);

  // Geocode any places missing coordinates using Kakao Maps Geocoder
  const maybeGeocodePlaces = async (list) => {
    // If Kakao SDK not loaded or no services, return as-is
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return list;

    const geocoder = new window.kakao.maps.services.Geocoder();

    const geocodeOne = (addr) => new Promise((resolve) => {
      if (!addr) return resolve(null);
      geocoder.addressSearch(addr, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result && result[0]) {
          const { y, x } = result[0];
          resolve({ lat: parseFloat(y), lng: parseFloat(x) });
        } else {
          resolve(null);
        }
      });
    });

    const out = [];
    for (const p of list) {
      if (p.coordinates && typeof p.coordinates.lat === 'number') {
        out.push(p);
        continue;
      }
      const coords = await geocodeOne(p.address?.full || '');
      out.push({ ...p, coordinates: coords || { lat: 37.5665, lng: 126.9780 } });
      // Basic throttling to be gentle with rate limits
      await new Promise(r => setTimeout(r, 60));
    }
    return out;
  };

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
