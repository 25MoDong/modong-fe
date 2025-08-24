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
    // Parse storeMood into tags array (백엔드에서 개행으로 구분된 문자열)
    const moodTags = store.storeMood ? store.storeMood.split('\n').filter(tag => tag.trim()) : ['인기'];
    
    return {
      id: store.storeId,
      name: store.storeName,
      title: store.storeName, // for compatibility
      category: store.category,
      // coordinates will be null initially, will be geocoded from detail address
      coordinates: null,
      address: {
        full: store.detail || '', // 백엔드의 detail 필드가 주소
        district: '성북구', // 모든 데이터가 성북구로 보임
        street: store.detail
      },
      rating: {
        average: 4.0, // 기본값
        count: 0
      },
      priceRange: '보통',
      images: ['/images/tmp.jpg'],
      tags: moodTags, // storeMood를 태그로 사용
      description: store.description,
      menu: store.mainMenu ? [store.mainMenu] : [], // mainMenu를 배열로 변환
      features: {},
      phone: store.phone,
      website: null,
      hours: store.operatingHours,
      userInteraction: {
        liked: false,
        visited: false
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
      
      // 주소에서 지오코딩 시도 (detail, address.full, address 순으로)
      const addressToGeocode = p.detail || p.address?.full || p.address || '';
      console.log(`Geocoding address for ${p.name}: ${addressToGeocode}`);
      
      const coords = await geocodeOne(addressToGeocode);
      const finalCoords = coords || { lat: 37.5984, lng: 127.0175 }; // 성북구 중심 좌표로 기본값 설정
      
      out.push({ ...p, coordinates: finalCoords });
      console.log(`Geocoded ${p.name}: ${finalCoords.lat}, ${finalCoords.lng}`);
      
      // Basic throttling to be gentle with rate limits
      await new Promise(r => setTimeout(r, 100)); // 100ms로 조금 더 여유
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
