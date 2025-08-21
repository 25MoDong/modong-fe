import { memo } from 'react';
import { X, Star } from 'lucide-react';
import { CATEGORY_CONFIG, PRICE_RANGES } from '../../lib/constants';

/**
 * Map filters component
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether filters are visible
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onToggleFilter - Toggle filter handler
 * @param {Function} props.onClearFilters - Clear all filters handler
 * @param {Function} props.onClose - Close filters handler
 */
const MapFilters = memo(function MapFilters({
  isVisible,
  filters,
  onToggleFilter,
  onClearFilters,
  onClose
}) {
  if (!isVisible) return null;

  const handleCategoryToggle = (category) => {
    onToggleFilter('categories', category);
  };

  const handlePriceRangeToggle = (priceRange) => {
    onToggleFilter('priceRange', priceRange);
  };

  const handleFeatureToggle = (feature) => {
    onToggleFilter('features', feature);
  };

  const handleRatingChange = (rating) => {
    onToggleFilter('rating', rating);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRange.length > 0 ||
    filters.features.length > 0 ||
    filters.rating > 0;

  return (
    <div className="absolute top-4 left-4 right-4 z-20">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">필터</h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                전체 해제
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="필터 닫기"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">카테고리</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleCategoryToggle(key)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  filters.categories.includes(key)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-sm font-medium">{config.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">가격대</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PRICE_RANGES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handlePriceRangeToggle(key)}
                className={`p-2 rounded-lg border text-sm transition-all ${
                  filters.priceRange.includes(key)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{key}</div>
                  <div className="text-xs opacity-75">{label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">최소 평점</h4>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                  filters.rating === rating
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>{rating === 0 ? '전체' : `${rating}+`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">편의시설</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'hasParking', label: '주차가능', icon: '🅿️' },
              { key: 'hasWifi', label: 'WiFi', icon: '📶' },
              { key: 'petFriendly', label: '반려동물', icon: '🐕' },
              { key: 'takeout', label: '포장가능', icon: '🥡' }
            ].map((feature) => (
              <button
                key={feature.key}
                onClick={() => handleFeatureToggle(feature.key)}
                className={`p-2 rounded-lg border text-sm transition-all ${
                  filters.features.includes(feature.key)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{feature.icon}</div>
                  <div className="font-medium">{feature.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active filters count */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 text-center">
              {filters.categories.length + filters.priceRange.length + filters.features.length + (filters.rating > 0 ? 1 : 0)}개 필터 적용 중
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MapFilters;