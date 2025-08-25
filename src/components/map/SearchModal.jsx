import { memo, useCallback, useEffect } from 'react';
import { X, Star, Clock, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { useDrag } from '../../hooks/useDrag';
import { useSearchResultTracking } from '../../hooks/useIntersectionObserver';
import { useSearchModeContext } from '../../contexts/SearchModeContext';

/**
 * Search modal component that slides up from bottom with optimized drag performance and map tracking
 * @param {Object} props
 * @param {Array} props.results - Array of search results
 * @param {Function} props.onSelectPlace - Callback when a place is selected
 * @param {boolean} props.isVisible - Whether the modal is visible
 * @param {Function} props.onClose - Close handler
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onVisiblePlaceChange - Callback when visible place changes (for map tracking)
 */
const SearchModal = memo(function SearchModal({ 
  results = [], 
  onSelectPlace, 
  isVisible = false,
  onClose,
  searchQuery = '',
  onVisiblePlaceChange
}) {
  const { 
    modalHeight: contextHeight, 
    setCustomHeight, 
    setHeightPreset,
    HEIGHTS
  } = useSearchModeContext();
  
  // Use optimized drag hook with context integration and preset snapping
  const { value: modalHeight, isDragging, dragHandlers } = useDrag({
    initialValue: contextHeight || HEIGHTS.DEFAULT,
    minValue: 15,     // Minimum 15% height
    maxValue: 85,     // Maximum 85% height
    snapToPresets: [HEIGHTS.COLLAPSED, HEIGHTS.DEFAULT, HEIGHTS.EXPANDED],
    snapThreshold: 25, // Increased snap threshold for better preset detection
    preventCloseOnShortDrag: true,
    transform: (deltaY, startValue) => {
      // Convert pixel delta to percentage based on screen height
      const deltaHeightPercent = (deltaY / window.innerHeight) * 100;
      return startValue + deltaHeightPercent;
    },
    onValueChange: (newHeight) => {
      // Update context when dragging or snapping
      setCustomHeight(newHeight);
    },
    onDragEnd: (finalHeight) => {
      // Ensure final height is set in context after snapping
      setCustomHeight(finalHeight);
    }
  });
  
  // Map tracking with intersection observer - only active in DEFAULT height
  const isTrackingEnabled = (
    Math.abs(modalHeight - HEIGHTS.DEFAULT) < 10 && // Within DEFAULT range
    modalHeight < HEIGHTS.EXPANDED - 10 // Not in EXPANDED mode
  );
  
  // Debug logging for height changes (disabled in production)
  useEffect(() => {
    // Keep lightweight hook for future debugging but avoid console spam in prod
  }, [modalHeight, isTrackingEnabled]);
  
  const { currentVisibleIndex, registerElement } = useSearchResultTracking(
    results,
    useCallback((visiblePlace, index) => {
      // Only trigger tracking if modal is visible and we're in default height range
      if (isVisible && isTrackingEnabled) {
        onVisiblePlaceChange?.(visiblePlace, index);
      }
    }, [onVisiblePlaceChange, isTrackingEnabled, isVisible])
  );

  const handlePlaceClick = useCallback((place) => {
    onSelectPlace && onSelectPlace(place);
    // Modal closing is now handled in handleSelectSearchResult
  }, [onSelectPlace]);

  // Height preset handlers (Kakao Map-like)
  const handleCollapse = useCallback(() => {
    setHeightPreset(HEIGHTS.COLLAPSED);
  }, [setHeightPreset, HEIGHTS.COLLAPSED]);

  const handleExpand = useCallback(() => {
    setHeightPreset(HEIGHTS.EXPANDED);
  }, [setHeightPreset, HEIGHTS.EXPANDED]);

  const handleDefaultHeight = useCallback(() => {
    setHeightPreset(HEIGHTS.DEFAULT);
  }, [setHeightPreset, HEIGHTS.DEFAULT]);

  // Clear tracking when modal becomes invisible
  useEffect(() => {
    if (!isVisible) {
      // Clear any pending tracking when modal is hidden
      onVisiblePlaceChange?.(null);
    }
  }, [isVisible, onVisiblePlaceChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Performance monitor removed for production UI */}
      
      <div 
        className="absolute inset-0 z-50 flex items-end pointer-events-none"
      >
      <div 
        className="bg-white w-full rounded-t-2xl overflow-hidden animate-slide-up flex flex-col pointer-events-auto"
        style={{ 
          height: `${modalHeight}vh`,
          transform: isDragging ? 'translateZ(0)' : 'none', // Hardware acceleration during drag
          willChange: isDragging ? 'transform' : 'auto'
        }}
      >
        {/* Header - Entire area is draggable */}
        <div 
          className={`relative px-6 py-4 border-b border-gray-100 transition-colors duration-200 ${
            isDragging ? 'cursor-grabbing bg-gray-50' : 'cursor-grab'
          }`}
          {...dragHandlers}
        >
          {/* Visual drag handle indicator */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className={`w-8 h-1 rounded-full transition-all duration-200 ${
              isDragging ? 'bg-purple-400 w-12' : 'bg-gray-300 hover:bg-gray-400'
            }`}></div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                검색 결과
              </h2>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">
                  '{searchQuery}' 검색 결과 {results.length}개
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {/* Height preset buttons (Kakao Map style) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCollapse}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    modalHeight <= HEIGHTS.COLLAPSED + 5 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="리스트 축소"
                  aria-label="리스트 축소"
                >
                  <ChevronDown size={16} />
                </button>
                
                <button
                  onClick={handleDefaultHeight}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    modalHeight > HEIGHTS.COLLAPSED + 5 && modalHeight < HEIGHTS.EXPANDED - 5
                      ? 'bg-purple-100 text-purple-600' 
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="기본 크기"
                  aria-label="기본 크기"
                >
                  <div className="w-4 h-1 bg-current rounded-full"></div>
                </button>
                
                <button
                  onClick={handleExpand}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    modalHeight >= HEIGHTS.EXPANDED - 5 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="리스트 확장"
                  aria-label="리스트 확장"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="검색 결과 닫기"
                aria-label="검색 결과 닫기"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Results List - Hide full list in collapsed mode */}
        {modalHeight <= HEIGHTS.COLLAPSED + 8 ? (
          // Collapsed mode - Simple layout only  
          <div 
            className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleDefaultHeight}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {results.length > 0 ? results[0].name || '매물메이트카페' : '검색 결과'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {results.length}개 결과 • 탭해서 더보기
                  </p>
                </div>
              </div>
              <ChevronUp 
                size={16} 
                className="text-gray-400"
              />
            </div>
          </div>
        ) : (
          // Full mode - Complete results list
          <div className="overflow-y-auto flex-1">
            {results.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">🔍</div>
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
              {results.map((place, index) => {
                const isCurrentlyVisible = currentVisibleIndex === index && isTrackingEnabled;
                return (
                  <div
                    key={place.id || index}
                    ref={(el) => registerElement(el, index)}
                    className={`p-4 transition-all duration-200 cursor-pointer ${
                      isCurrentlyVisible 
                        ? 'bg-purple-50 border-l-4 border-l-purple-500 shadow-sm' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Place image placeholder */}
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                        {place.image ? (
                          <img 
                            src={place.image} 
                            alt={place.name}
                            className="w-full h-full object-cover"
                            draggable="false"
                            style={{ WebkitUserDrag: 'none' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                            <span className="text-purple-400 text-lg">📍</span>
                          </div>
                        )}
                      </div>

                      {/* Place info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold truncate text-base transition-colors duration-200 ${
                            isCurrentlyVisible ? 'text-purple-900' : 'text-gray-900'
                          }`}>
                            {place.name || '매물메이트카페'}
                          </h3>
                          <div className="flex items-center text-yellow-400 ml-2">
                            <Star size={14} className="fill-current" />
                            <span className="text-sm font-medium text-gray-700 ml-1">
                              {typeof place.rating === 'object' ? place.rating?.average || '4.5' : place.rating || '4.5'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                            isCurrentlyVisible 
                              ? 'bg-purple-200 text-purple-800' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {place.category || 'cafe'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {typeof place.address === 'string' ? place.address : place.address?.full || place.address?.district || '300m 이내'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span className="text-green-600 font-medium mr-2">영업중</span>
                            <span>{typeof place.hours === 'string' ? place.hours : place.hours?.todayHours || '10:00 - 17:00'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-1">
                          <span className="text-xs text-gray-600">
                            내 위치로부터 유실률: {place.lossRate || '77%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
});

export default SearchModal;
