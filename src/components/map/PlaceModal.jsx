import { memo, useState, useEffect } from 'react';
import api from '../../lib/api';
import backend from '../../lib/backend';
import { X, MapPin, Clock, Phone, Star, Heart } from 'lucide-react';

/**
 * Place details modal component
 * @param {Object} props
 * @param {Object} props.place - Place data
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 */
const PlaceModal = memo(function PlaceModal({ place, isOpen, onClose }) {
  const [detailed, setDetailed] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!isOpen || !place?.id) { setDetailed(null); return; }
    const fetchDetails = async () => {
      try {
        const data = await backend.getPlaceById(place.id);
        if (!mounted) return;
        setDetailed(data || null);
      } catch (err) {
        console.error('Failed to load place details', err);
        if (mounted) setDetailed(null);
      }
    };
    fetchDetails();
    return () => { mounted = false; };
  }, [isOpen, place?.id]);

  const effective = detailed || place;

  if (!isOpen || !place) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (effective.contact?.phone) {
      window.open(`tel:${effective.contact.phone}`);
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-black/50 z-50 flex items-end"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full rounded-t-2xl max-h-[70vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative">
          {/* Place image or placeholder */}
          <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
            {effective.image ? (
              <img 
                src={effective.image} 
                alt={effective.name}
                className="w-full h-full object-cover"
                draggable="false"
                style={{ WebkitUserDrag: 'none' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-4xl font-light opacity-50">📍</span>
              </div>
            )}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg"
            >
              <X size={20} className="text-gray-600" />
            </button>
            
            {/* Like button */}
            <button
              onClick={handleLike}
              className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg"
            >
              <Heart 
                size={20} 
                className={`${effective.userInteraction?.liked ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
              />
            </button>
          </div>
          
          {/* Drag handle for mobile */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-1 bg-white/60 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-12rem)]">
          {/* Title and rating */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {effective.name || '매물메이트카페'}
            </h2>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-medium text-gray-700">
                  {effective.rating?.average || '4.5'}
                </span>
                <span className="text-sm text-gray-500">
                  ({effective.rating?.count || '127'}개 리뷰)
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {effective.category || '카페'}
              </span>
              <span className="text-sm text-gray-500">
                300m 이내
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 mb-4">
            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 leading-relaxed">
              {effective.address?.full || effective.address || '서울시 강남구 역삼동'}
            </span>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 mb-4">
            <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${effective.hours?.isOpen !== false ? 'text-green-600' : 'text-red-600'}`}>
                  {effective.hours?.isOpen !== false ? '영업중' : '영업종료'}
                </span>
                <span className="text-gray-600">
                  {effective.hours?.todayHours || '10:00 - 17:00'}
                </span>
              </div>
              <span className="text-sm text-gray-500 mt-1 block">
                내 위치로부터 유실률: {effective.lossRate || '77%'}
              </span>
            </div>
          </div>

          {/* Description */}
          {effective.description && (
            <div className="mb-4">
              <p className="text-gray-600 leading-relaxed">
                {effective.description}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">경치좋음</span>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">카페인중독</span>
            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">썩썩이</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                effective.userInteraction?.liked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart size={16} className={effective.userInteraction?.liked ? 'fill-current' : ''} />
              찜하기
            </button>

            {effective.contact?.phone && (
              <button
                onClick={handleCall}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                <Phone size={16} />
                전화하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlaceModal;
