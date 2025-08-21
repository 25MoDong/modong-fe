import { memo } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import { Heart, MapPin, Clock, Phone, Star, X } from 'lucide-react';
import { CATEGORY_CONFIG, PRICE_RANGES } from '../../lib/constants';

/**
 * Info window component for displaying place details
 * @param {Object} props
 * @param {Object} props.place - Place data
 * @param {Function} props.onClose - Close handler
 */
const InfoWindow = memo(function InfoWindow({ place, onClose }) {
  if (!place || place.isCluster) return null;


  // NOTE: like/call handlers removed (not used). Implement when adding buttons.

  return (
    <CustomOverlayMap
      position={place.coordinates}
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
          내 주변 돌멩이 수집가 0명에게 인증받은 장소
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
          {place.name || '00카페'}
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
          23m 이내
        </div>

        {/* 5-star rating */}
        <div style={{
          position: 'absolute',
          left: '102px',
          top: '72px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={12} 
                style={{ color: '#212842' }}
                fill="#212842"
              />
            ))}
          </div>
          <div style={{
            fontWeight: 600,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000',
            marginLeft: '10px'
          }}>
            후기 보러가기 &gt;
          </div>
        </div>

        {/* Tags */}
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '126px',
          display: 'flex',
          gap: '4px'
        }}>
          <div style={{
            width: '45px',
            height: '21px',
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
              color: '#AB9177'
            }}>
              맛있는
            </span>
          </div>
          
          <div style={{
            width: '60px',
            height: '21px',
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
              color: '#AB9177'
            }}>
              가성비 좋은
            </span>
          </div>
          
          <div style={{
            width: '45px',
            height: '21px',
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
              color: '#AB9177'
            }}>
              맛있는
            </span>
          </div>
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
