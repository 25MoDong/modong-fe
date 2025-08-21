// Map utility functions

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - {lat, lng}
 * @param {Object} coord2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a coordinate is within map bounds
 * @param {Object} coordinate - {lat, lng}
 * @param {Object} bounds - {sw: {lat, lng}, ne: {lat, lng}}
 * @returns {boolean}
 */
export const isInBounds = (coordinate, bounds) => {
  if (!bounds || !coordinate) return true;
  
  return (
    coordinate.lat >= bounds.sw.lat &&
    coordinate.lat <= bounds.ne.lat &&
    coordinate.lng >= bounds.sw.lng &&
    coordinate.lng <= bounds.ne.lng
  );
};

/**
 * Get bounds from viewport center and zoom level
 * @param {Object} viewport - {center: {lat, lng}, zoom: number}
 * @returns {Object} bounds
 */
import { MAP_CONFIG } from './constants.js';

export const getBoundsFromViewport = (viewport) => {
  const { center, zoom } = viewport;

  // Base delta at default zoom (degrees)
  const baseDelta = 0.1;

  // Normalize zoom value
  const z = Math.max(1, Number(zoom) || MAP_CONFIG.DEFAULT_ZOOM);

  // Scale bounds proportionally to zoom level relative to default
  const scale = z / MAP_CONFIG.DEFAULT_ZOOM;

  const latDelta = baseDelta * scale;
  const lngDelta = baseDelta * scale;

  // (debug logs removed)

  return {
    sw: {
      lat: center.lat - latDelta,
      lng: center.lng - lngDelta
    },
    ne: {
      lat: center.lat + latDelta,
      lng: center.lng + lngDelta
    }
  };
};

/**
 * Cluster places based on distance and zoom level
 * @param {Array} places - Array of place objects
 * @param {number} zoom - Current zoom level
 * @param {number} clusterRadius - Clustering radius in pixels
 * @returns {Array} Clustered places
 */
export const clusterPlaces = (places, zoom, clusterRadius = 60) => {
  if (zoom > 10) return places; // No clustering at high zoom levels
  
  const clusters = [];
  const processed = new Set();
  
  places.forEach((place, index) => {
    if (processed.has(index)) return;
    
    const cluster = {
      id: `cluster_${index}`,
      coordinates: place.coordinates,
      places: [place],
      isCluster: true
    };
    
    // Find nearby places to cluster
    places.forEach((otherPlace, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return;
      
      const distance = calculateDistance(place.coordinates, otherPlace.coordinates);
      const clusterDistance = clusterRadius / (Math.pow(2, zoom) * 100); // Adjust based on zoom
      
      if (distance < clusterDistance) {
        cluster.places.push(otherPlace);
        processed.add(otherIndex);
      }
    });
    
    processed.add(index);
    
    // If cluster has only one place, return the place itself
    if (cluster.places.length === 1) {
      clusters.push(place);
    } else {
      // Calculate cluster center
      const avgLat = cluster.places.reduce((sum, p) => sum + p.coordinates.lat, 0) / cluster.places.length;
      const avgLng = cluster.places.reduce((sum, p) => sum + p.coordinates.lng, 0) / cluster.places.length;
      
      cluster.coordinates = { lat: avgLat, lng: avgLng };
      cluster.count = cluster.places.length;
      clusters.push(cluster);
    }
  });
  
  return clusters;
};

/**
 * Get marker icon based on category
 * @param {string} category - Place category
 * @param {boolean} isSelected - Whether the marker is selected
 * @returns {string} Icon emoji or HTML
 */
export const getMarkerIcon = (category, isSelected = false) => {
  const icons = {
    restaurant: isSelected ? '🍽️' : '🍴',
    cafe: isSelected ? '☕' : '🥤',
    attraction: isSelected ? '🏛️' : '📍',
    shopping: isSelected ? '🛍️' : '🛒'
  };
  
  return icons[category] || '📍';
};

/**
 * Get marker color based on category
 * @param {string} category - Place category
 * @returns {string} Color hex code
 */
export const getMarkerColor = (category) => {
  const colors = {
    restaurant: '#FF6B6B',
    cafe: '#4ECDC4',
    attraction: '#45B7D1',
    shopping: '#9B59B6'
  };
  
  return colors[category] || '#6B7280';
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Create custom marker content for clustering
 * @param {number} count - Number of places in cluster
 * @param {string} color - Cluster color
 * @returns {string} HTML string for marker
 */
export const createClusterMarkerContent = (count, color = '#4ECDC4') => {
  return `
    <div style="
      background-color: ${color};
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      ${count}
    </div>
  `;
};

/**
 * Create custom marker content for individual places
 * @param {Object} place - Place object
 * @param {boolean} isSelected - Whether the marker is selected
 * @returns {string} HTML string for marker
 */
export const createPlaceMarkerContent = (place, isSelected = false) => {
  const size = isSelected ? '28px' : '20px';
  
  return `
    <div style="
      width: ${size};
      height: ${size};
      background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg) ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        font-size: ${isSelected ? '10px' : '8px'};
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        opacity: 0.9;
      "></div>
    </div>
  `;
};
/**
 * Get InfoWindow dimensions for positioning calculations
 * @returns {Object} - {width, height} in pixels
 */
export const getInfoWindowDimensions = () => {
  return {
    width: 280,    // max-w-[280px] from InfoWindow component
    height: 250    // Estimated height based on content
  };
};

/**
 * Get current viewport dimensions
 * @returns {Object} - {width, height} in pixels
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Calculate viewport-based optimal position for marker
 * Ensures InfoWindow is always visible within screen bounds
 * @param {Object} markerCoords - {lat, lng} of the marker
 * @param {number} zoomLevel - Current map zoom level
 * @param {Object} mapInstance - Kakao map instance for pixel conversion
 * @param {Object} options - Positioning options
 * @returns {Object} - {lat, lng} for optimal map center
 */
export const calculateViewportBasedPosition = (markerCoords, zoomLevel, mapInstance) => {
  if (!mapInstance || !window.kakao) return markerCoords;

  const viewport = getViewportDimensions();
  const infoWindow = getInfoWindowDimensions();
  
  // Calculate safe margins (in pixels)
  const margins = {
    top: 80,     // Account for header/status bar
    bottom: 100, // Account for bottom tab bar
    left: 20,
    right: 20
  };

  // Available safe area for InfoWindow
  const safeArea = {
    width: viewport.width - margins.left - margins.right,
    height: viewport.height - margins.top - margins.bottom
  };

  // Calculate desired marker position in pixels from center
  // Position marker slightly below center to show InfoWindow above it
  const markerOffsetY = Math.min(
    (infoWindow.height / 2) + 20, // InfoWindow height + reduced padding (40->20)
    safeArea.height * 0.2         // Max 20% of safe area (reduced from 25%)
  );

  // Convert pixel offset to lat/lng offset based on current map bounds
  const bounds = mapInstance.getBounds();
  const swLatLng = bounds.getSouthWest();
  const neLatLng = bounds.getNorthEast();
  
  // Calculate degrees per pixel for current viewport
  const latDegreesPerPixel = (neLatLng.getLat() - swLatLng.getLat()) / viewport.height;

  // Apply offset to move marker down from center
  const latOffset = markerOffsetY * latDegreesPerPixel;
  
  return {
    lat: markerCoords.lat + latOffset,
    lng: markerCoords.lng // Keep longitude centered
  };
};

/**
 * Calculate dynamic offset based on zoom level (Legacy - simplified version)
 * @param {number} zoomLevel - Current map zoom level
 * @param {Object} options - Offset configuration options
 * @returns {Object} - {latOffset, lngOffset}
 */
export const calculateDynamicOffset = (zoomLevel, options = {}) => {
  const {
    baseLatOffset = 0.001,    // Reduced from 0.003
    baseLngOffset = 0.0005,   // Reduced from 0.0015
    zoomFactor = 3.0          // Increased for less aggressive scaling
  } = options;
  
  // Less aggressive zoom multiplier
  const zoomMultiplier = Math.pow(1.8, (8 - zoomLevel) / zoomFactor);
  
  return {
    latOffset: baseLatOffset * zoomMultiplier,
    lngOffset: baseLngOffset * zoomMultiplier
  };
};

/**
 * Calculate optimal center position for marker with InfoWindow
 * Uses viewport-based positioning when map instance is available, falls back to legacy method
 * @param {Object} markerCoords - {lat, lng} of the marker
 * @param {number} zoomLevel - Current map zoom level
 * @param {Object} options - Positioning options
 * @returns {Object} - {lat, lng} for optimal map center
 */
export const calculateOptimalCenter = (markerCoords, zoomLevel, options = {}) => {
  const { mapInstance, useViewportBased = true } = options;
  
  // Use viewport-based positioning if map instance is available
  if (useViewportBased && mapInstance) {
    return calculateViewportBasedPosition(markerCoords, zoomLevel, mapInstance, options);
  }
  
  // Fallback to legacy offset method
  const { latOffset, lngOffset } = calculateDynamicOffset(zoomLevel, options);
  
  return {
    lat: markerCoords.lat + latOffset,
    lng: markerCoords.lng + lngOffset
  };
};

/**
 * Smoothly animate map to target position using panTo
 * @param {Object} mapInstance - Kakao map instance
 * @param {Object} targetCoords - Target coordinates {lat, lng}
 * @param {number} zoomLevel - Current zoom level for offset calculation
 * @param {Object} options - Animation options
 */
export const animateToMarker = (mapInstance, targetCoords, zoomLevel, options = {}) => {
  if (!mapInstance || !window.kakao) return;
  
  // Pass mapInstance to options for viewport-based positioning
  const enhancedOptions = {
    ...options,
    mapInstance
  };
  
  const optimalCenter = calculateOptimalCenter(targetCoords, zoomLevel, enhancedOptions);
  const kakaoLatLng = new window.kakao.maps.LatLng(optimalCenter.lat, optimalCenter.lng);
  
  mapInstance.panTo(kakaoLatLng);
};
