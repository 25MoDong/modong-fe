import Card from './Card';
import { useRef } from 'react';

export default function PlaceCards({ 
  places = [], 
  variant = 'default',
  layout = 'grid', // 'grid' | 'scroll'
  className = ''
}) {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (layout === 'scroll' && scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };
  const layoutStyles = {
    grid: "grid grid-cols-3 gap-[12px]",
    scroll: "flex gap-[12px] overflow-x-auto scrollbar-hide pb-2 min-w-0"
  };

  const currentLayout = layoutStyles[layout] || layoutStyles.grid;

  return (
    <div 
      ref={layout === 'scroll' ? scrollRef : null}
      className={`${currentLayout} ${className}`}
      onWheel={layout === 'scroll' ? handleWheel : undefined}
    >
      {places.map((place, i) => (
        <Card
          key={i}
          title={place.title}
          category={place.category}
          tags={place.tags}
          liked={place.liked}
          image={place.image}
          variant={variant}
        />
      ))}
    </div>
  );
}