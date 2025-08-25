import { Map } from 'react-kakao-maps-sdk';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { CATEGORY_CONFIG } from '../lib/constants';
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
import { getStoresByCategory } from '../lib/storeApi';
import userStore from '../lib/userStore';
import { getMyReviews } from '../lib/reviewApi';
import backend from '../lib/backend';
import { useDebounce } from '../hooks/useDebounce';

const MapPage = () => {
  useKakaoLoader();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    viewport,
    selectedPlace,
    places,
    allPlaces,
    loading,
    error,
    filters,
    showFilters,
    bounds,
    updateViewport,
    selectPlace,
    toggleFilter,
    clearFilters,
    setShowFilters,
    zoomIn,
    zoomOut,
    resetView,
    refreshPlaces
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
  const [categoryPlaces, setCategoryPlaces] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  // set of normalized store names that the current user has reviewed
  const [jemStoreNames, setJemStoreNames] = useState(new Set());
  
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
    (async () => {
      try {
        console.log('handleMarkerClick received place:', place);

        // Pause tracking when user manually selects a marker
        setIsTrackingPaused(true);
        setCurrentVisiblePlace(null);

        // Unwrap cluster wrapper if needed to get the raw place object
        const raw = place?.data || (Array.isArray(place?.places) && place.places[0]) || place;

        if (mapInstance && raw?.coordinates) {
          animateToMarker(mapInstance, raw.coordinates, viewport.zoom);
        }

        // Optimistic selection: show lightweight raw place immediately if available
        if (raw) selectPlace(raw, { adjustView: false });

        // Try to fetch detailed, normalized place info via storeApi
        try {
          const storeId = raw?.id || raw?.storeId || raw?._id;
          if (storeId) {
            const detail = await (await import('../lib/storeApi')).getStoreById(storeId);
            if (detail) {
              // Ensure coordinates are preserved: backend detail may lack coordinates,
              // but raw (geocoded) place often has them. Merge to avoid InfoWindow vanishing.
              if ((!detail.coordinates || !detail.coordinates.lat) && raw?.coordinates) {
                detail = { ...detail, coordinates: raw.coordinates };
              }
              // Preserve original id if missing
              if (!detail.id && raw?.id) detail.id = raw.id;
              selectPlace(detail, { adjustView: false });
              console.log('Replaced selected place with backend normalized detail:', detail);
            }
          }
        } catch (err) {
          console.warn('Failed to fetch place detail for marker click:', err);
        }
      } finally {
        if (markerPauseTimeoutRef.current) clearTimeout(markerPauseTimeoutRef.current);
        markerPauseTimeoutRef.current = setTimeout(() => {
          setIsTrackingPaused(false);
          markerPauseTimeoutRef.current = null;
        }, 3000);
      }
    })();
  }, [selectPlace, mapInstance, viewport.zoom]);

  // Handle search bar click - navigate to search page
  const handleSearchClick = useCallback(() => {
    navigate('/search', { state: { variant: 'dark', from: 'map' } });
  }, [navigate]);

  const toggleShowFiltersCallback = useCallback(() => {
    setShowFilters(prev => !prev);
  }, [setShowFilters]);

  // Handle quick category filter toggles (restaurant / cafe)
  const handleCategoryToggle = useCallback(async (key) => {
    const isActive = filters.categories.includes(key);

    // If the category is currently active, simply toggle it off and clear categoryPlaces
    if (isActive) {
      toggleFilter('categories', key);
      setCategoryPlaces([]);
      return;
    }

    // Otherwise, fetch category stores first, merge coordinates from existing places if missing,
    // then set categoryPlaces so markers render immediately, and finally update filter UI state
    // in an exclusive manner (only one category active at a time).
    setCategoryLoading(true);
    try {
      const categoryName = key === 'restaurant' ? '음식점' : '카페';
      const stores = await getStoresByCategory(categoryName);

      // Try to merge coordinates from current known places when backend category results lack them
      const merged = (stores || []).map((s) => {
        const copy = { ...(s || {}) };
        if (!copy.coordinates || !copy.coordinates.lat || !copy.coordinates.lng) {
          const match = (allPlaces || []).find(p => p.id === copy.id || p.storeId === copy.storeId || p.name === copy.name);
          if (match && match.coordinates) copy.coordinates = match.coordinates;
        }
        return copy;
      });

      const withCoords = merged.filter(s => s && s.coordinates && s.coordinates.lat != null && s.coordinates.lng != null);
      setCategoryPlaces(withCoords);

      // Ensure exclusive selection: turn off any other active category filters
      const otherActive = (filters.categories || []).filter(c => c !== key);
      otherActive.forEach((otherKey) => {
        toggleFilter('categories', otherKey);
      });

      // Activate the requested category if it's not already active
      if (!filters.categories.includes(key)) {
        toggleFilter('categories', key);
      }

      console.debug(`Loaded ${withCoords.length} category stores for ${categoryName}`);
    } catch (err) {
      console.error('Failed to load category stores:', err);
      setCategoryPlaces([]);
    } finally {
      setCategoryLoading(false);
    }
  }, [filters.categories, toggleFilter, allPlaces]);

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

  // Load user's reviewed store names and prepare a set of normalized names
  useEffect(() => {
    let mounted = true;
    const loadReviewedPlaceNames = async () => {
      try {
        const uid = userStore.getUserId();
        if (!uid) {
          if (mounted) setJemStoreNames(new Set());
          return;
        }

        const reviews = await getMyReviews(uid) || [];
        // collect unique store names from reviews
        const storeNames = Array.from(new Set((reviews || [])
          .map(r => (r.storeName || r.name || r.store || ''))
          .filter(Boolean)
          .map(s => s.trim().toLowerCase())
        ));

        if (storeNames.length === 0) {
          if (mounted) setJemStoreNames(new Set());
          return;
        }

        // For each reviewed storeName, search backend for matching places and collect normalized names
        const matchedNames = new Set();
        for (const name of storeNames) {
          try {
            const results = await backend.searchStores(name);
            (results || []).forEach(p => {
              const nm = (p.storeName || p.name || '').trim().toLowerCase();
              if (nm) matchedNames.add(nm);
            });
          } catch (e) {
            console.warn('searchStores failed for', name, e);
          }
        }

        if (mounted) setJemStoreNames(matchedNames);
      } catch (e) {
        console.error('Failed to load reviewed place names for jem markers:', e);
      }
    };
    loadReviewedPlaceNames();
    const handler = () => loadReviewedPlaceNames();
    window.addEventListener('UserChanged', handler);
    window.addEventListener('focus', handler);
    return () => { mounted = false; window.removeEventListener('UserChanged', handler); window.removeEventListener('focus', handler); };
  }, []);

  // Show loading state while fetching places
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">가게 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full mx-auto relative overflow-hidden flex flex-col">
      {/* Error notification */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button 
              onClick={refreshPlaces}
              className="ml-2 bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded text-xs font-medium transition-colors"
            >
              재시도
            </button>
          </div>
        </div>
      )}
      
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
            // If category results are loaded, show them directly so markers appear immediately.
            // Otherwise fall back to the normal (filtered) places from state.
            places={categoryPlaces && categoryPlaces.length > 0 ? categoryPlaces : places}
            onMarkerClick={handleMarkerClick}
            viewport={viewport}
            mapInstance={mapInstance}
            jemStoreNames={jemStoreNames}
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
          {/* category quick filter buttons (bottom-left of searchbar) */}
          <div className="absolute left-2 top-full mt-2 flex items-center gap-2">
            {['restaurant','cafe'].map((key) => (
              <button
                key={key}
                onClick={() => handleCategoryToggle(key)}
                disabled={categoryLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm text-sm transition-colors ${filters.categories.includes(key) ? 'bg-[#212842] text-white border-[#212842]' : 'bg-white text-gray-700 border-gray-200'} ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-lg">{CATEGORY_CONFIG[key].icon}</span>
                <span className="font-medium">{CATEGORY_CONFIG[key].name}</span>
              </button>
            ))}
          </div>
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
