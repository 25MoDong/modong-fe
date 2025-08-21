import Card from './Card';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

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
    grid: "grid grid-cols-3 gap-[12px] bg-secondary-300 py-4 px-3",
    scroll: "flex gap-[12px] overflow-x-auto scrollbar-hide pb-2 pl-5 -mx-5 min-w-0"
  };

  const currentLayout = layoutStyles[layout] || layoutStyles.grid;

  return (
    <div 
      ref={layout === 'scroll' ? scrollRef : null}
      className={`${currentLayout} ${className}`}
      onWheel={layout === 'scroll' ? handleWheel : undefined}
    >
      {places.map((place, i) => {
        const card = (
          <Card
            title={place.title}
            category={place.category}
            tags={place.tags}
            liked={place.liked}
            image={place.image}
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
}