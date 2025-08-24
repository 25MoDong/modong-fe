import { memo, useEffect, useState } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import { Heart, MapPin, Clock, Phone, Star, X } from 'lucide-react';
import { CATEGORY_CONFIG, PRICE_RANGES } from '../../lib/constants';
import { getStoreReviews } from '../../lib/reviewApi';
import { calculateDistance, formatDistance } from '../../lib/mapUtils';
import { useNavigate } from 'react-router-dom';

/**
 * Info window component for displaying place details
 * @param {Object} props
 * @param {Object} props.place - Place data
 * @param {Function} props.onClose - Close handler
 */
const InfoWindow = memo(function InfoWindow({ place, onClose }) {
  const navigate = useNavigate();
  
  // 디버그: place 객체 구조 확인
  console.log('InfoWindow received place:', place);

  if (!place || place.isCluster) return null;

  const [reviewCount, setReviewCount] = useState(null);
  const [distanceText, setDistanceText] = useState('');

  // 장소 데이터 정규화 - 실제 백엔드 응답 구조에 맞춤
  const placeData = {
    id: place.id || place.storeId || place._id,
    name: place.name || place.storeName || place.title || place.label || '장소명 없음',
    description: place.description || place.desc || '추천받은 장소',
    address: place.detail || place.address?.full || place.address || '',
    tags: Array.isArray(place.tags) ? place.tags : (place.categories || place.keywords || []),
    distance: place.distance || place.distanceText || '',
    coordinates: place.coordinates || place.coords || place.position || { lat: 37.5984, lng: 127.0175 }, // 성북구 중심 기본값
    phone: place.phone || '',
    hours: place.operatingHours || place.hours || '',
    mainMenu: place.mainMenu || (Array.isArray(place.menu) ? place.menu[0] : '') || '',
    category: place.category || '카페'
  };

  console.log('Normalized placeData:', placeData);

  // Load review count and user distance when placeData changes
  useEffect(() => {
    let mounted = true;

    // 1) fetch review count (store reviews)
    (async () => {
      try {
        if (!placeData.id) return;
        const reviews = await getStoreReviews(placeData.id);
        if (!mounted) return;
        if (Array.isArray(reviews)) setReviewCount(reviews.length);
        else if (typeof reviews === 'number') setReviewCount(reviews);
        else if (reviews && typeof reviews.count === 'number') setReviewCount(reviews.count);
        else setReviewCount(0);
      } catch (err) {
        console.warn('Failed to load store reviews for info window:', err);
        if (mounted) setReviewCount(0);
      }
    })();

    // 2) compute distance to current user via geolocation
    (async () => {
      try {
        if (!placeData.coordinates) return;
        // Try navigator geolocation first
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            try {
              const userCoord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              const km = calculateDistance(placeData.coordinates, userCoord);
              const txt = formatDistance(km) + ' 이내';
              if (mounted) setDistanceText(txt);
            } catch (e) {
              if (mounted) setDistanceText('');
            }
          }, (err) => {
            // permission denied or other error - leave empty
            console.warn('Geolocation unavailable for InfoWindow distance:', err);
            if (mounted) setDistanceText('');
          }, { maximumAge: 60000, timeout: 2000 });
        }
      } catch (e) {
        console.warn('Failed to compute distance for InfoWindow:', e);
        if (mounted) setDistanceText('');
      }
    })();

    return () => { mounted = false; };
  }, [placeData.id, placeData.coordinates]);

  const handleDetailClick = () => {
    navigate(`/place/${placeData.id || 1}`);
  };

  return (
    <CustomOverlayMap
      position={placeData.coordinates}
      yAnchor={1.2}
      xAnchor={0.5}
      zIndex={10000}
    >
      <div 
        style={{
          position: 'relative',
          width: '247px',
          height: '163px',
          background: '#FFFFFF',
          border: '2px solid #F0E7D5',
          borderRadius: '20px',
          boxSizing: 'border-box',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="정보창 닫기"
        >
          <X size={14} style={{ color: '#9CA3AF' }} />
        </button>

        {/* Main content description */}
        <div style={{
          position: 'absolute',
          width: '194px',
          height: '13px',
          left: '15px',
          top: '16px',
          fontWeight: 600,
          fontSize: '11px',
          lineHeight: '13px',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          color: '#000000'
        }}>
          {/* Show reviewer-based certification info instead of description */}
          {typeof reviewCount === 'number' ? `내 주변 돌멩이 수집가 ${reviewCount}명에게 인증받은 장소` : placeData.description}
        </div>

        {/* Left section with image placeholder */}
        <div style={{
          position: 'absolute',
          width: '77px',
          height: '48px',
          left: '15px',
          top: '39px',
          background: '#C1C1C1',
          borderRadius: '10px'
        }}>
        </div>

        {/* Place name */}
        <div style={{
          position: 'absolute',
          left: '102px',
          top: '39px',
          fontWeight: 600,
          fontSize: '11px',
          lineHeight: '13px',
          color: '#000000'
        }}>
          {placeData.name}
        </div>

        {/* Distance */}
        <div style={{
          position: 'absolute',
          left: '102px',
          top: '53px',
          fontWeight: 600,
          fontSize: '10px',
          lineHeight: '12px',
          color: '#8E98A8'
        }}>
          {distanceText || placeData.distance}
        </div>

        {/* Detail link */}
        <button
          onClick={handleDetailClick}
          style={{
            position: 'absolute',
            left: '102px',
            top: '72px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}
        >
          이 장소 자세히 보기 &gt;
        </button>

        {/* Tags */}
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '126px',
          display: 'flex',
          gap: '4px',
          maxWidth: '215px',
          flexWrap: 'wrap'
        }}>
          {placeData.tags.slice(0,3).map((tag, idx) => (
            <div key={idx} style={{
              height: '21px',
              padding: '0 8px',
              background: '#FFF5E2',
              border: '1px solid #C0AA92',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontWeight: 600,
                fontSize: '10px',
                lineHeight: '12px',
                color: '#AB9177',
                whiteSpace: 'nowrap'
              }}>
                {typeof tag === 'string' ? tag : (tag?.name || tag?.label || '')}
              </span>
            </div>
          ))}
        </div>

        {/* Road map icon */}
        <div style={{
          position: 'absolute',
          width: '19px',
          height: '19px',
          right: '15px',
          bottom: '15px'
        }}>
          <MapPin size={19} style={{ color: '#535F8B' }} />
        </div>

        {/* Pointer arrow */}
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '16px',
          height: '16px',
          background: '#FFFFFF',
          border: '2px solid #F0E7D5',
          borderTop: 'none',
          borderLeft: 'none'
        }}>
        </div>
      </div>
    </CustomOverlayMap>
  );
});

export default InfoWindow;
