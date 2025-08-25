import { memo } from 'react';

/**
 * Search results list component that displays below search bar
 * @param {Object} props
 * @param {Array} props.results - Array of search results
 * @param {Function} props.onSelectPlace - Callback when a place is selected
 * @param {boolean} props.isVisible - Whether the results list is visible
 */
const SearchResultsList = memo(function SearchResultsList({ 
  results = [], 
  onSelectPlace, 
  isVisible = false 
}) {
  if (!isVisible || results.length === 0) {
    return null;
  }

  const handlePlaceClick = (place) => {
    onSelectPlace && onSelectPlace(place);
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-lg border-t border-gray-100 max-h-96 overflow-y-auto z-40">
      {results.map((place, index) => (
        <div
          key={place.id || index}
          className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => handlePlaceClick(place)}
        >
          <div className="flex items-center space-x-3">
            {/* Place image placeholder */}
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {place.image ? (
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-full object-cover"
                  draggable="false"
                  style={{ WebkitUserDrag: 'none' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* Place info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">
                  {place.name || '매물메이트카페'}
                </h3>
                <div className="flex items-center text-yellow-400">
                  <span className="text-xs font-medium">
                    ★ {typeof place.rating === 'object' ? place.rating?.average || '4.5' : place.rating || '4.5'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {typeof place.address === 'string' ? place.address : place.address?.full || place.address?.district || '300m 이내'}
              </p>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">
                  영업시간: {typeof place.hours === 'string' ? place.hours : place.hours?.todayHours || '10:00 - 17:00'}
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  내 위치로부터 유실률: {place.lossRate || '77%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default SearchResultsList;