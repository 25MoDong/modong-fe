import Card from './Card';
import { useRef, memo, useCallback, useEffect } from 'react';
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
  className = ''
}) {
  const scrollRef = useRef(null);
  const wheelListenerRef = useRef(null);


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

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    const currentElement = scrollRef.current;
    const currentListener = wheelListenerRef.current;
    return () => {
      if (currentElement && currentListener) {
        currentElement.removeEventListener('wheel', currentListener);
      }
      document.body.style.overflow = '';
    };
  }, []);
  const layoutStyles = {
    grid: "grid grid-cols-2 xs:grid-cols-3 gap-3 bg-secondary-300 py-4 px-3 rounded-lg",
    scroll: "flex gap-3 overflow-x-auto scrollbar-hide pb-2 pl-4 sm:pl-6 -mx-4 sm:-mx-6 min-w-0"
  };

  const currentLayout = layoutStyles[layout] || layoutStyles.grid;

  return (
    <div 
      ref={layout === 'scroll' ? scrollRef : null}
      className={`${currentLayout} ${className}`}
      onMouseEnter={layout === 'scroll' ? handleMouseEnter : undefined}
      onMouseLeave={layout === 'scroll' ? handleMouseLeave : undefined}
      style={layout === 'scroll' ? { touchAction: 'pan-x' } : {}}
    >
      {places.map((place, i) => {
        const card = (
          <Card
            key={place.id || i}
            title={place.name || place.title}
            category={place.category}
            tags={place.tags}
            liked={place.userInteraction?.liked || place.liked}
            image={place.images?.[0] || place.image}
            variant={variant}
          />
        );
        const to = place.to ?? (place.id != null ? `/place/${place.id}` : null);

        return to ? (
          <Link
            key={place.id ?? i}
            to={to}
            className="block shrink-0 cursor-pointer"
          >
            {card}
          </Link>
        ) : (
          <div key={place.id ?? i} className="shrink-0">
            {card}
          </div>
        );
      })}
    </div>
  );
});

export default PlaceCards;
