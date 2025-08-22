import Card from './Card';
import { useRef, memo, useCallback, useEffect, useState } from 'react';
import { loadMapping } from '../../lib/favoritesStorage';
import { Link } from 'react-router-dom';

/**
 * PlaceCards component for displaying a collection of place cards
 * @param {Object} props - Component props
 * @param {Array} props.places - Array of place objects
 * @param {'default'|'compact'} props.variant - Card variant to use
 * @param {'grid'|'scroll'} props.layout - Layout type (grid or horizontal scroll)
 * @param {string} props.className - Additional CSS classes
 */
const PlaceCards = memo(function PlaceCards({ 
  places = [], 
  variant = 'default',
  layout = 'grid', // 'grid' | 'scroll'
  className = '',
  onLikeToggle // (place, liked) => void
}) {
  const scrollRef = useRef(null);
  const wheelListenerRef = useRef(null);
  
  // Load favorites mapping once for all cards - performance optimization
  const favoritesMapping = loadMapping();


  // 마우스 진입/이탈 시 페이지 스크롤 제어
  const handleMouseEnter = useCallback(() => {
    if (layout === 'scroll' && scrollRef.current) {
      // passive: false로 이벤트 리스너 등록하여 preventDefault 허용
      const element = scrollRef.current;
      wheelListenerRef.current = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.scrollLeft += e.deltaY;
      };
      
      element.addEventListener('wheel', wheelListenerRef.current, { passive: false });
      // 추가로 body 스크롤도 비활성화
      document.body.style.overflow = 'hidden';
    }
  }, [layout]);

  const handleMouseLeave = useCallback(() => {
    if (layout === 'scroll' && scrollRef.current && wheelListenerRef.current) {
      // 이벤트 리스너 제거
      scrollRef.current.removeEventListener('wheel', wheelListenerRef.current);
      wheelListenerRef.current = null;
      // 페이지 스크롤 재활성화
      document.body.style.overflow = '';
    }
  }, [layout]);

  // 스크롤 상태 관리 (선택적 스크롤 인디케이터를 위해)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current && layout === 'scroll') {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, [layout]);

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    const currentElement = scrollRef.current;
    const currentListener = wheelListenerRef.current;
    
    // 초기 스크롤 버튼 상태 업데이트
    updateScrollButtons();
    
    // 스크롤 이벤트 리스너 추가 (스크롤 버튼 상태 업데이트용)
    const handleScroll = () => updateScrollButtons();
    if (currentElement && layout === 'scroll') {
      currentElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (currentElement && currentListener) {
        currentElement.removeEventListener('wheel', currentListener);
      }
      if (currentElement && layout === 'scroll') {
        currentElement.removeEventListener('scroll', handleScroll);
      }
      document.body.style.overflow = '';
    };
  }, [layout, updateScrollButtons]);
  const layoutStyles = {
    grid: "grid grid-cols-3 gap-3 p-4 bg-gray-50/50 rounded-xl",
    scroll: "flex gap-4 overflow-x-auto scrollbar-hide pb-3 px-4 -mx-4 sm:px-6 sm:-mx-6"
  };

  const currentLayout = layoutStyles[layout] || layoutStyles.grid;

  return (
    <div 
      ref={layout === 'scroll' ? scrollRef : null}
      className={`${currentLayout} ${className}`}
      onMouseEnter={layout === 'scroll' ? handleMouseEnter : undefined}
      onMouseLeave={layout === 'scroll' ? handleMouseLeave : undefined}
      style={layout === 'scroll' ? { 
        touchAction: 'pan-x',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      } : {}}
    >
      {places.map((place, i) => {
        const isFavorited = Boolean(place.id && (favoritesMapping[String(place.id)] || []).length > 0);
        const card = (
          <Card
            key={place.id || i}
            id={place.id}
            title={place.name || place.title}
            category={place.category}
            tags={place.tags}
            liked={place.userInteraction?.liked || place.liked || isFavorited}
            image={place.images?.[0] || place.image}
            variant={variant}
            onLikeToggle={(item, liked) => onLikeToggle?.(place, liked)}
          />
        );
        const to = place.to ?? (place.id != null ? `/place/${place.id}` : null);

        return to ? (
          <Link
            key={place.id ?? i}
            to={to}
            state={{ place }}
            className={`block ${layout === 'scroll' ? 'flex-shrink-0' : ''} cursor-pointer`}
          >
            {card}
          </Link>
        ) : (
          <div key={place.id ?? i} className={layout === 'scroll' ? 'flex-shrink-0' : ''}>
            {card}
          </div>
        );
      })}
    </div>
  );
});

export default PlaceCards;
