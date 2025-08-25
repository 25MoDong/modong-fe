import { memo } from 'react';
import { Plus, Minus, RotateCcw, Navigation, Filter } from 'lucide-react';

/**
 * Map control buttons component
 * @param {Object} props
 * @param {Function} props.onZoomIn - Zoom in handler
 * @param {Function} props.onZoomOut - Zoom out handler
 * @param {Function} props.onReset - Reset view handler
 * @param {Function} props.onUserLocation - Get user location handler
 * @param {Function} props.onFilterToggle - Toggle filters handler
 * @param {boolean} props.showFilters - Whether filters are visible
 * @param {number} props.zoom - Current zoom level
 */
const MapControls = memo(function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onUserLocation,
  onFilterToggle,
  showFilters,
  zoom
}) {
  return (
    <div className="absolute right-4 bottom-20 z-10 flex flex-col gap-2">
      {/* Filter toggle */}
      <button
        onClick={onFilterToggle}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          showFilters
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
        aria-label="필터 토글"
      >
        <Filter size={20} />
      </button>

      {/* User location */}
      <button
        onClick={onUserLocation}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="내 위치"
      >
        <Navigation size={20} />
      </button>

      {/* Zoom controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          disabled={zoom <= 1}
          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
          aria-label="확대"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={onZoomOut}
          disabled={zoom >= 14}
          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="축소"
        >
          <Minus size={20} />
        </button>
      </div>

      {/* Reset view */}
      <button
        onClick={onReset}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="초기 위치로 이동"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
});

export default MapControls;
