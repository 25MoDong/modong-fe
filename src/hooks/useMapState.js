import { useState, useCallback, useMemo } from 'react';
import { MAP_CONFIG } from '../lib/constants';
import { dummyPlaces } from '../lib/dummyData';
import { getBoundsFromViewport, isInBounds, calculateOptimalCenter } from '../lib/mapUtils';

/**
 * Custom hook for managing map state and interactions
 */
export const useMapState = () => {
  // Core map state
  const [viewport, setViewport] = useState({
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places] = useState(dummyPlaces); // In real app, this would come from API
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [],
    features: [],
    rating: 0
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showPlacesList, setShowPlacesList] = useState(false);

  // Calculate map bounds based on current viewport
  const bounds = useMemo(() => {
    return getBoundsFromViewport(viewport);
  }, [viewport]);

  // Filter places based on current filters and viewport
  const filteredPlaces = useMemo(() => {
    let filtered = places;

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(place => 
        filters.categories.includes(place.category)
      );
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(place => 
        filters.priceRange.includes(place.priceRange)
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(place => 
        place.rating.average >= filters.rating
      );
    }

    // Filter by features
    if (filters.features.length > 0) {
      filtered = filtered.filter(place => 
        filters.features.every(feature => place.features[feature])
      );
    }

    // Filter by viewport bounds
    filtered = filtered.filter(place => 
      isInBounds(place.coordinates, bounds)
    );

    return filtered;
  }, [places, filters, bounds]);

  // No need for manual clustering - using native MarkerClusterer

  // Actions
  const updateViewport = useCallback((newViewport) => {
    setViewport(prev => ({ ...prev, ...newViewport }));
  }, []);

  const selectPlace = useCallback((place, options = {}) => {
    setSelectedPlace(place);
    
    // Position place slightly off-center so popup is visible
    if (place && !place.isCluster && options.adjustView !== false) {
      // Use dynamic offset calculation based on zoom level
      const optimalCenter = calculateOptimalCenter(place.coordinates, viewport.zoom);
      
      updateViewport({
        center: optimalCenter,
        // Keep current zoom level to prevent unwanted zoom changes
        zoom: viewport.zoom
      });
    }
  }, [viewport.zoom, updateViewport]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const toggleFilter = useCallback((filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      priceRange: [],
      features: [],
      rating: 0
    });
  }, []);

  // Kakao Map: smaller level = more zoomed in
  const zoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, MAP_CONFIG.MIN_ZOOM)
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, MAP_CONFIG.MAX_ZOOM)
    }));
  }, []);

  const resetView = useCallback(() => {
    setViewport({
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM
    });
    setSelectedPlace(null);
  }, []);

  return {
    // State
    viewport,
    selectedPlace,
    places: filteredPlaces,
    loading,
    filters,
    showFilters,
    showPlacesList,
    bounds,

    // Actions
    updateViewport,
    selectPlace,
    updateFilters,
    toggleFilter,
    clearFilters,
    setShowFilters,
    setShowPlacesList,
    zoomIn,
    zoomOut,
    resetView,
    setLoading
  };
};
