import { useState, useEffect, useCallback } from 'react';
import { getAllLocations, getStoreById } from '../lib/storeApi';

/**
 * Custom hook for fetching and managing places data from backend
 */
export const usePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform location+detail to place format
  const transformToPlace = useCallback((base, detail) => {
    const moodTags = detail?.storeMood
      ? (typeof detail.storeMood === 'string'
          ? detail.storeMood.split('\n').filter(Boolean)
          : Array.isArray(detail.storeMood) ? detail.storeMood : [])
      : [];
    return {
      id: base.storeId,
      storeId: base.storeId,
      name: detail?.storeName || base.name || '',
      title: detail?.storeName || base.name || '',
      category: detail?.category || base.category || '기타',
      coordinates: base.coordinates || null,
      address: {
        full: detail?.detail || detail?.address || '',
        district: '성북구',
        street: detail?.detail || ''
      },
      rating: { average: detail?.rating || 4.0, count: detail?.reviewCount || 0 },
      priceRange: '보통',
      images: detail?.images?.length ? detail.images : ['/images/tmp.jpg'],
      tags: moodTags,
      description: detail?.description,
      menu: detail?.mainMenu ? [detail.mainMenu] : [],
      features: {},
      phone: detail?.phone,
      website: null,
      hours: detail?.operatingHours,
      userInteraction: { liked: false, visited: false }
    };
  }, []);

  // Fetch places from backend using storeApi
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Get all locations with lat/lng
      const locs = await getAllLocations();
      if (Array.isArray(locs) && locs.length > 0) {
        // 2) Fetch minimal details in parallel (category, name, tags)
        const details = await Promise.all(
          locs.map(async (l) => {
            try { return await getStoreById(l.storeId); } catch { return null; }
          })
        );

        const merged = locs.map((l, idx) => transformToPlace(l, details[idx]));
        setPlaces(merged.filter(p => p.coordinates));
        console.log(`✅ Loaded ${merged.length} places from v7 locations + v6 details`);
      } else {
        throw new Error('No locations data received from backend');
      }

    } catch (err) {
      console.warn('Failed to fetch places from backend:', err.message);
      // Do not use dummy data; surface empty state to UI
      setPlaces([]);
      setError('백엔드 연결 실패');
    } finally {
      setLoading(false);
    }
  }, [transformToPlace]);

  // No client-side geocoding needed anymore (coords come from v7)

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
