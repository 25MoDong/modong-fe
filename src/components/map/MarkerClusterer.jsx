import { MarkerClusterer as KakaoMarkerClusterer, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect, useRef } from 'react';

/**
 * React Kakao Maps SDK MarkerClusterer component with improved rendering
 * @param {Object} props
 * @param {Array} props.places - Array of place objects
 * @param {Function} props.onMarkerClick - Callback when marker is clicked
 */
const MarkerClusterer = ({ places, onMarkerClick }) => {
  const clustererRef = useRef(null);
  
  // Force re-render when places change to ensure clustering works properly
  useEffect(() => {
    if (clustererRef.current) {
      // Small delay to ensure proper re-clustering
      const timer = setTimeout(() => {
        if (clustererRef.current && clustererRef.current.redraw) {
          clustererRef.current.redraw();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [places]);

  return (
    <KakaoMarkerClusterer
      ref={clustererRef}
      averageCenter={true}
      minLevel={5} // Enable clustering from zoom level 5 (more zoomed out than default level 4)
      maxLevel={14} // Enable clustering up to most zoomed out level
      calculator={[2, 5, 10, 20]} // Enhanced thresholds for better clustering
      gridSize={80} // Increased grid size for better multi-clustering
      clickable={true}
      disableClickZoom={false} // Allow clicking to zoom into cluster
      styles={[
        // 첫 번째 스타일 (마커 2-4개) - Small cluster
        {
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '50%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          lineHeight: '40px',
          border: '2px solid white',
          boxShadow: '0 3px 8px rgba(0,0,0,0.3)'
        },
        // 두 번째 스타일 (마커 5-9개) - Medium cluster
        {
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          borderRadius: '50%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          lineHeight: '50px',
          border: '2px solid white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
        },
        // 세 번째 스타일 (마커 10-19개) - Large cluster
        {
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
          borderRadius: '50%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '60px',
          border: '2px solid white',
          boxShadow: '0 5px 12px rgba(0,0,0,0.5)'
        },
        // 네 번째 스타일 (마커 20개 이상) - Extra large cluster
        {
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          borderRadius: '50%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          lineHeight: '70px',
          border: '3px solid white',
          boxShadow: '0 6px 15px rgba(0,0,0,0.6)'
        }
      ]}
    >
      {places.map((place) => (
        <MapMarker
          key={place.id}
          position={{
            lat: place.coordinates.lat,
            lng: place.coordinates.lng,
          }}
          onClick={() => onMarkerClick && onMarkerClick(place)}
          image={{
            src: "data:image/svg+xml;base64," + window.btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#6366F1;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
                  </filter>
                </defs>
                <circle cx="12" cy="8" r="6" fill="url(#grad)" stroke="white" stroke-width="2" filter="url(#shadow)"/>
                <circle cx="12" cy="8" r="2" fill="white" opacity="0.9"/>
                <path d="M12 14 L8 20 L16 20 Z" fill="url(#grad)" stroke="white" stroke-width="2" filter="url(#shadow)"/>
              </svg>
            `),
            size: { width: 24, height: 24 },
            options: { offset: { x: 12, y: 24 } },
          }}
        />
      ))}
    </KakaoMarkerClusterer>
  );
};

export default MarkerClusterer;
