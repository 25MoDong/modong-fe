import React, { useState, useCallback, memo } from 'react';

/**
 * 🎯 마커 아이콘 (Fallback 지원)
 * 
 * 주요 기능:
 * - 원본 SVG 파일 로드 시도
 * - 로드 실패 시 인라인 SVG로 fallback
 * - 성능 최적화된 렌더링
 * - 에러 핸들링 및 재시도 로직
 */
const MarkerIconWithFallback = memo(({ onClick, data, markerSvgPath = '/marker.svg' }) => {
  const [loadState, setLoadState] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  
  const handleImageLoad = useCallback(() => {
    setLoadState('loaded');
  }, []);
  
  const handleImageError = useCallback(() => {
    if (retryCount < 2) {
      // 최대 2번까지 재시도
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setLoadState('loading');
      }, 100 * (retryCount + 1)); // 지연 시간 증가
    } else {
      setLoadState('fallback');
      console.warn('Failed to load marker SVG, using fallback');
    }
  }, [retryCount]);
  
  const baseStyle = {
    cursor: 'pointer',
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center bottom',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
    zIndex: 1000,
    willChange: 'transform',
  };
  
  const hoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'scale(1.15)';
      e.currentTarget.style.zIndex = '1001';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.zIndex = '1000';
    },
  };
  
  // 원본 SVG 파일 사용 (성공 시)
  if (loadState === 'loaded') {
    return (
      <div onClick={onClick} style={baseStyle} {...hoverHandlers}>
        <img
          src={markerSvgPath}
          alt="장소 마커"
          draggable="false"
          style={{
            width: '36px',
            height: '46px',
            display: 'block',
            WebkitUserDrag: 'none',
          }}
          onError={handleImageError}
        />
      </div>
    );
  }
  
  // 로딩 중 (첫 로드 또는 재시도 중)
  if (loadState === 'loading') {
    return (
      <div onClick={onClick} style={baseStyle} {...hoverHandlers}>
        <img
          src={markerSvgPath}
          alt="장소 마커"
          draggable="false"
          style={{
            width: '36px',
            height: '46px',
            display: 'block',
            WebkitUserDrag: 'none',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* 로딩 중에도 fallback을 숨김으로 준비 */}
        <OptimizedFallbackIcon 
          style={{ display: 'none' }}
        />
      </div>
    );
  }
  
  // Fallback SVG 사용
  return (
    <div onClick={onClick} style={baseStyle} {...hoverHandlers}>
      <OptimizedFallbackIcon />
    </div>
  );
});

/**
 * 🔧 최적화된 Fallback 마커
 * 
 * - 작고 효율적인 인라인 SVG
 * - 모든 브라우저에서 안정적 동작
 * - 빠른 렌더링과 메모리 효율성
 */
const OptimizedFallbackIcon = memo(({ style }) => (
  <svg
    width="36"
    height="46"
    viewBox="0 0 36 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'block',
      ...style,
    }}
  >
    <defs>
      <filter id="fallback-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="fallback-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4285F4"/>
        <stop offset="100%" stopColor="#1a73e8"/>
      </linearGradient>
    </defs>
    
    {/* 메인 마커 모양 */}
    <path 
      d="M29 18.5C29 24.7413 22.0763 31.2413 19.7512 33.2488C19.5347 33.4116 19.271 33.4997 19 33.4997C18.729 33.4997 18.4653 33.4116 18.2488 33.2488C15.9238 31.2413 9 24.7413 9 18.5C9 15.8478 10.0536 13.3043 11.9289 11.4289C13.8043 9.5536 16.3478 8.5 19 8.5C21.6522 8.5 24.1957 9.5536 26.0711 11.4289C27.9464 13.3043 29 15.8478 29 18.5Z" 
      fill="url(#fallback-gradient)"
      stroke="white"
      strokeWidth="1.5"
      filter="url(#fallback-shadow)"
    />
    
    {/* 내부 원형 아이콘 */}
    <circle 
      cx="18" 
      cy="18.5" 
      r="4" 
      fill="white"
      opacity="0.9"
    />
    
    {/* 작은 내부 점 */}
    <circle 
      cx="18" 
      cy="18.5" 
      r="2" 
      fill="#1a73e8"
    />
  </svg>
));

MarkerIconWithFallback.displayName = 'MarkerIconWithFallback';
OptimizedFallbackIcon.displayName = 'OptimizedFallbackIcon';

export default MarkerIconWithFallback;
export { OptimizedFallbackIcon };