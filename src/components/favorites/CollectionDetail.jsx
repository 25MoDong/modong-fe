/**
 * CollectionDetail Component
 * 
 * A modal component that displays detailed view of a favorites collection with all saved places.
 * Features:
 * - Full-screen modal with 50px border radius as per design specs
 * - Individual place cards with black image placeholders
 * - Distance calculation and similarity percentages
 * - Business hours display with icons
 * - Smooth animations and transitions
 * - Mobile-first responsive design
 * - Integration with existing favorites storage system
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.collection - Collection object with id, title, etc.
 * @param {Array} props.places - Array of place objects to display
 * 
 * @example
 * <CollectionDetail 
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   collection={selectedCollection}
 *   places={collectionPlaces}
 * />
 */
import { ChevronLeft, MapPin, Clock, Navigation, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, memo, useEffect, useMemo } from 'react';
import { calculateMockDistance, calculateMockSimilarity } from '../../hooks/useLocationUtils';
import { removePlaceFromCollection } from '../../lib/favoritesStorage';

// Individual Place Card Component
const PlaceCard = memo(({ place, onClick, onDelete, showDeleteButton = false }) => {
  const distance = calculateMockDistance(place);
  const similarity = calculateMockSimilarity(place);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(place.id);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, place.id, isDeleting]);
  
  return (
    <div className="relative w-full bg-white rounded-[12px] border border-[#E5E5E5] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Image Section - Black placeholder as specified */}
        <div className="w-[100px] h-[100px] bg-black flex-shrink-0 flex items-center justify-center">
          {place.images?.[0] ? (
            <img 
              src={place.images[0]} 
              alt={place.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to black placeholder if image fails to load
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="w-full h-full bg-black"></div>';
              }}
            />
          ) : (
            <div className="w-full h-full bg-black" />
          )}
        </div>

        {/* Delete Button */}
        {showDeleteButton && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
              isDeleting 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 active:scale-95'
            }`}
            aria-label={`${place.name} 삭제`}
          >
            {isDeleting ? (
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <X size={12} className="text-white" />
            )}
          </button>
        )}

        {/* Content Section */}
        <div className="flex-1 p-3 flex flex-col justify-between min-h-[100px]">
          <div className="flex-1">
            {/* Place Name */}
            <h4 className="text-[16px] font-semibold text-black mb-1 leading-tight line-clamp-2">
              {place.name}
            </h4>
            
            {/* Distance */}
            <div className="flex items-center gap-1 mb-2">
              <Navigation size={12} className="text-[#666666] flex-shrink-0" />
              <span className="text-[12px] text-[#666666]">{distance}</span>
            </div>
            
            {/* Business Hours */}
            <div className="flex items-center gap-1 mb-2">
              <Clock size={12} className="text-[#666666] flex-shrink-0" />
              <span className="text-[12px] text-[#666666] line-clamp-1">
                {place.hours?.todayHours || '영업시간 정보 없음'}
              </span>
            </div>
          </div>
          
          {/* Bottom Row: Similarity */}
          <div className="flex items-center justify-end mt-auto">
            <span className="text-[12px] text-[#666666] font-medium">
              유사도 {similarity}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Invisible button overlay for clicking */}
      <button
        onClick={() => onClick(place)}
        className="absolute inset-0 w-full h-full cursor-pointer"
        aria-label={`${place.name} 상세 보기`}
        disabled={isDeleting}
      />
    </div>
  );
});

PlaceCard.displayName = 'PlaceCard';

const CollectionDetail = memo(({ open, onClose, collection, places = [], onPlacesUpdate }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [localPlaces, setLocalPlaces] = useState(places);

  // Update local places when props change
  useEffect(() => {
    setLocalPlaces(places);
  }, [places]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Small delay for smooth closing animation
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  }, [onClose]);

  const handlePlaceClick = useCallback((place) => {
    navigate(`/place/${place.id}`);
  }, [navigate]);

  const handleDeletePlace = useCallback(async (placeId) => {
    if (!collection) return;
    
    try {
      // Remove from storage
      removePlaceFromCollection(placeId, collection.id);
      
      // Update local state
      setLocalPlaces(prevPlaces => {
        const updatedPlaces = prevPlaces.filter(place => place.id !== placeId);
        
        // Notify parent component to update its state
        if (onPlacesUpdate) {
          onPlacesUpdate(updatedPlaces);
        }
        
        return updatedPlaces;
      });
    } catch (error) {
      console.error('Failed to delete place:', error);
    }
  }, [collection, onPlacesUpdate]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Memoize the places list rendering for better performance
  const placesContent = useMemo(() => {
    if (localPlaces.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} className="text-gray-400" />
          </div>
          <p className="text-[16px] text-gray-500 mb-2 font-medium">
            아직 저장된 장소가 없어요
          </p>
          <p className="text-[14px] text-gray-400">
            마음에 드는 장소를 저장해보세요
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {localPlaces.map((place, index) => (
          <div 
            key={place.id || index}
            className="animate-fadeIn"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <PlaceCard 
              place={place} 
              onClick={handlePlaceClick}
              onDelete={handleDeletePlace}
              showDeleteButton={true}
            />
          </div>
        ))}
      </div>
    );
  }, [localPlaces, handlePlaceClick, handleDeletePlace]);

  // Return null before rendering if component should not be shown
  if (!open || !collection) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`} 
        onClick={handleBackdropClick} 
      />

      {/* Main Content Container */}
      <div className={`relative bg-white w-[390px] max-w-[95vw] h-[844px] max-h-[95vh] rounded-[50px] overflow-hidden shadow-2xl transition-transform duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Header with Back Button and Title */}
        <div className="relative flex items-center justify-center px-6 py-5 border-b border-[#F0F0F0]">
          <button 
            onClick={handleClose} 
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#666666] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={22} />
          </button>
          
          <h2 className="text-[20px] font-bold text-black text-center">
            {collection.title}
          </h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="px-5 py-4 overflow-y-auto h-[calc(100%-140px)] scrollbar-hide">
          {placesContent}
        </div>

        {/* Footer/Bottom Action Area */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-[#F0F0F0]">
          <div className="flex items-center justify-between">
            {/* Left: Collection indicators/avatars */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2A3045] to-[#747FA7] border-2 border-white shadow-sm" />
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#BCBCBC] shadow-sm" />
              <div className="text-[#666666]">
                <MapPin size={20} />
              </div>
            </div>
            
            {/* Right: Place count */}
            <div className="text-[12px] text-[#666666] font-medium">
              총 {localPlaces.length}개 장소
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CollectionDetail.displayName = 'CollectionDetail';

export default CollectionDetail;
