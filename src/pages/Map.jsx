import { Map } from 'react-kakao-maps-sdk';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import AdvancedMarkerClusterer from '../components/map/AdvancedMarkerClusterer';
import InfoWindow from '../components/map/InfoWindow';
import SearchModal from '../components/map/SearchModal';
import MapControls from '../components/map/MapControls';
import MapFilters from '../components/map/MapFilters';
import useKakaoLoader from '../hooks/useKakaoLoader';
import { useMapState } from '../hooks/useMapState';
import { useSearchModal } from '../hooks/useSearchModal';
import { useSearchModeContext } from '../contexts/SearchModeContext';
import { animateToMarker } from '../lib/mapUtils';
import { useDebounce } from '../hooks/useDebounce';

const MapPage = () => {
  useKakaoLoader();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    viewport,
    selectedPlace,
    places,
    filters,
    showFilters,
    updateViewport,
    selectPlace,
    toggleFilter,
    clearFilters,
    setShowFilters,
    zoomIn,
    zoomOut,
    resetView
  } = useMapState();

  // Use new search modal state management hook
  const {
    searchResults,
    isVisible: showSearchResults,
    showModal: showSearchModal,
    hideModalByUser,
    hideModalBySelection,
    // isUserDismissed (unused)
  } = useSearchModal();

  // Search mode context for navigation control
  const { enterSearchMode, exitSearchMode, config: searchConfig } = useSearchModeContext();

  const [mapInstance, setMapInstance] = useState(null);
  const [currentVisiblePlace, setCurrentVisiblePlace] = useState(null);
  const [isTrackingPaused, setIsTrackingPaused] = useState(false);
  
  // Track if demo has already been initialized to prevent re-triggering
  const demoInitializedRef = useRef(false);
  
  // Track if search results from navigation state have been processed
  const searchStateProcessedRef = useRef(false);
  
  // Timeout refs to avoid stacking multiple timeouts
  const zoomPauseTimeoutRef = useRef(null);
  const markerPauseTimeoutRef = useRef(null);
  const selectPauseTimeoutRef = useRef(null);
  
  // Debounce the visible place change to prevent excessive map updates
  const debouncedVisiblePlace = useDebounce(currentVisiblePlace, 300);
  
  // Use ref to track zoom level without causing useEffect re-runs
  const viewportZoomRef = useRef(viewport.zoom);
  
  // Update zoom ref when viewport changes
  useEffect(() => {
    viewportZoomRef.current = viewport.zoom;
  }, [viewport.zoom]);

  // Handle map events - Updated to use new modal management
  const handleMapDragEnd = useCallback((map) => {
    const center = map.getCenter();
    updateViewport({
      center: { lat: center.getLat(), lng: center.getLng() }
    });
    
    // Keep search results visible during map exploration
    // Users can manually close the modal if needed
  }, [updateViewport]);

  const handleMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  const handleMapZoomChanged = useCallback((map) => {
    const level = map.getLevel();
    updateViewport({ zoom: level });
    
    // Zoom 변경 시 트랙킹 일시 정지하여 자동 팝업 방지
    if (currentVisiblePlace) {
      setIsTrackingPaused(true);
      setCurrentVisiblePlace(null);
      // Clear any existing zoom timeout and set a new one to resume tracking
      if (zoomPauseTimeoutRef.current) clearTimeout(zoomPauseTimeoutRef.current);
      zoomPauseTimeoutRef.current = setTimeout(() => {
        setIsTrackingPaused(false);
        zoomPauseTimeoutRef.current = null;
      }, 3000);
    }
  }, [updateViewport, currentVisiblePlace]);

  // Handle marker click
  const handleMarkerClick = useCallback((place) => {
    // Pause tracking when user manually selects a marker
    setIsTrackingPaused(true);
    
    // Clear tracking state to prevent re-activation
    setCurrentVisiblePlace(null);
    
    // Handle individual place marker click with smooth animation
    if (mapInstance) {
      // Use dynamic offset calculation based on current zoom level
      animateToMarker(mapInstance, place.coordinates, viewport.zoom);
      
      // Set selected place without adjustView to avoid double movement
      selectPlace(place, { adjustView: false });
    } else {
      // Fallback if map instance not available
      selectPlace(place);
    }
    
    // Resume tracking after a delay to allow user interaction
    if (markerPauseTimeoutRef.current) clearTimeout(markerPauseTimeoutRef.current);
    markerPauseTimeoutRef.current = setTimeout(() => {
      setIsTrackingPaused(false);
      markerPauseTimeoutRef.current = null;
    }, 3000); // 3 seconds pause
  }, [selectPlace, mapInstance, viewport.zoom]);

  // Handle search bar click - navigate to search page
  const handleSearchClick = useCallback(() => {
    navigate('/search', { state: { variant: 'dark', from: 'map' } });
  }, [navigate]);

  const toggleShowFiltersCallback = useCallback(() => {
    setShowFilters(prev => !prev);
  }, [setShowFilters]);

  // Handle search results from location state (when returning from search page)
  useEffect(() => {
    const stateSearchResults = location.state?.searchResults;
    const selectedResult = location.state?.selectedResult;
    
    if (stateSearchResults && selectedResult && !searchStateProcessedRef.current) {
      // Create unique search ID for this search session
      const searchId = `search-${Date.now()}-${selectedResult.id}`;
      
      // Enter search mode and show modal
      enterSearchMode(stateSearchResults);
      showSearchModal(stateSearchResults, searchId);
      
      // Move map to selected result
      if (mapInstance && selectedResult.coordinates) {
        animateToMarker(mapInstance, selectedResult.coordinates, viewport.zoom);
        selectPlace(selectedResult, { adjustView: false });
      }
      
      // Mark as processed and clear the state to prevent repeated execution
      searchStateProcessedRef.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state, mapInstance, selectPlace, viewport.zoom, showSearchModal, enterSearchMode]);
  
  // Demo: Simulate search results for testing map tracking (DISABLED FOR DEBUGGING)
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.get('demo') === 'search' && places.length > 0 && !demoInitializedRef.current) {
  //     // Use first 5 places as demo search results
  //     const demoResults = places.slice(0, 5);
  //     const demoSearchId = `demo-${Date.now()}`;
  //     
  //     // Enter search mode and show demo results
  //     enterSearchMode(demoResults);
  //     showSearchModal(demoResults, demoSearchId);
  //     
  //     // Mark demo as initialized to prevent re-triggering
  //     demoInitializedRef.current = true;
  //   }
  // }, [places, showSearchModal, enterSearchMode]);

  // Handle user location
  const handleUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateViewport({
            center: { lat: latitude, lng: longitude },
            zoom: 8
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Avoid blocking alert; use console warning for non-fatal location errors
          console.warn("위치 정보를 가져올 수 없습니다.");
        }
      );
    } else {
      console.warn("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    }
  }, [updateViewport]);

  // Handle selecting place from search results modal
  const handleSelectSearchResult = useCallback((place) => {
    if (mapInstance && place.coordinates) {
      animateToMarker(mapInstance, place.coordinates, viewport.zoom);
      selectPlace(place, { adjustView: false });
    }
    
    // Clear tracking state to prevent re-activation on zoom changes
    setCurrentVisiblePlace(null);
    
    // 상태 초기화는 true로 유지 (재활성화 방지)
    demoInitializedRef.current = true;  // false → true로 변경
    searchStateProcessedRef.current = true;  // false → true로 변경
    
    // Close modal and clear search results when place is selected
    hideModalBySelection();
    exitSearchMode();
    
    // 트랙킹 일시 정지 (사용자의 의도적 선택 이후 충분한 시간)
    setIsTrackingPaused(true);
    if (selectPauseTimeoutRef.current) clearTimeout(selectPauseTimeoutRef.current);
    selectPauseTimeoutRef.current = setTimeout(() => {
      setIsTrackingPaused(false);
      selectPauseTimeoutRef.current = null;
    }, 5000);
  }, [mapInstance, selectPlace, viewport.zoom, hideModalBySelection, exitSearchMode]);

  // Handle visible place change for map tracking
  const handleVisiblePlaceChange = useCallback((visiblePlace) => {
    // Only set visible place if search mode is active and modal is visible
    if (searchConfig.isSearchActive && showSearchResults && visiblePlace) {
      setCurrentVisiblePlace(visiblePlace);
    } else if (!visiblePlace) {
      // Clear tracking when null is passed
      setCurrentVisiblePlace(null);
    }
  }, [searchConfig.isSearchActive, showSearchResults]);

  // Clear tracking state when search modal is hidden or search mode is inactive
  useEffect(() => {
    if (!showSearchResults || !searchConfig.isSearchActive) {
      setCurrentVisiblePlace(null);
    }
  }, [showSearchResults, searchConfig.isSearchActive]);
  
  // Effect to handle debounced map updates with info window
  useEffect(() => {
    if (mapInstance && debouncedVisiblePlace && debouncedVisiblePlace.coordinates && showSearchResults && !isTrackingPaused && searchConfig.isSearchActive) {
      // Only animate if the visible place is different from currently selected place
      // And only when search results modal is visible, tracking is not paused, and search mode is active
      if (!selectedPlace || selectedPlace.id !== debouncedVisiblePlace.id) {
        animateToMarker(mapInstance, debouncedVisiblePlace.coordinates, viewportZoomRef.current);
        // Also select the place to show its info window
        selectPlace(debouncedVisiblePlace, { adjustView: false });
      }
    }
  }, [mapInstance, debouncedVisiblePlace, selectedPlace, selectPlace, showSearchResults, isTrackingPaused, searchConfig.isSearchActive]);

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (zoomPauseTimeoutRef.current) clearTimeout(zoomPauseTimeoutRef.current);
      if (markerPauseTimeoutRef.current) clearTimeout(markerPauseTimeoutRef.current);
      if (selectPauseTimeoutRef.current) clearTimeout(selectPauseTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full mx-auto relative overflow-hidden flex flex-col">
      {/* Map container - fills entire available space */}
      <div className='relative w-full flex-1'>
        {/* Kakao Map */}
        <Map
          id="map"
          center={viewport.center}
          style={{
            width: '100%',
            height: '100%',
          }}
          level={viewport.zoom}
          onDragEnd={handleMapDragEnd}
          onZoomChanged={handleMapZoomChanged}
          onCreate={handleMapLoad}
        >
          {/* 🎨 고급 지리적 거리 기반 마커 클러스터러 */}
          {/* 🔑 key prop 설명: React 리렌더링 최적화를 위해 줌/중심/마커수 변화 시 강제 리렌더링 */}
          <AdvancedMarkerClusterer
            places={places}
            onMarkerClick={handleMarkerClick}
            viewport={viewport}
            mapInstance={mapInstance}
          />

          {/* Info window for selected place */}
          {selectedPlace && (
            <InfoWindow
              place={selectedPlace}
              onClose={() => {
                selectPlace(null);
                setCurrentVisiblePlace(null);
                // Resume tracking when info window is closed
                setIsTrackingPaused(false);
              }}
            />
          )}
        </Map>

        {/* Search bar overlaid on map at bottom */}
        <div className='absolute top-11 left-4 right-4 z-30'>
          <SearchBar
            variant='dark'
            placeholder="장소를 검색해보세요"
            clickable={true}
            onClick={handleSearchClick}
            showBackButton={false}
          />
        </div>

        {/* Map controls - positioned at top right */}
        <div className='absolute top-4 right-4 z-10'>
          <MapControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetView}
            onUserLocation={handleUserLocation}
            onFilterToggle={toggleShowFiltersCallback}
            showFilters={showFilters}
            zoom={viewport.zoom}
          />
        </div>

        {/* Map filters */}
        <MapFilters
          isVisible={showFilters}
          filters={filters}
          onToggleFilter={toggleFilter}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />

        {/* Search Results Modal - Updated with new state management */}
        <SearchModal
          results={searchResults}
          onSelectPlace={handleSelectSearchResult}
          isVisible={showSearchResults}
          onClose={() => {
            hideModalByUser();
            exitSearchMode();
          }}
          searchQuery="검색 결과"
          onVisiblePlaceChange={handleVisiblePlaceChange}
        />

      </div>

    </div>
  );
};

export default MapPage;
