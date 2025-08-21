import { FiHeart } from "react-icons/fi";
import { useState, memo } from "react";

/**
 * Card component for displaying place information
 * @param {Object} props - Component props
 * @param {string} props.title - Place title
 * @param {string} props.category - Place category (e.g., '카페', '레스토랑')
 * @param {string[]} props.tags - Array of tags
 * @param {boolean} props.liked - Whether the place is liked
 * @param {string} props.image - Image URL
 * @param {'default'|'compact'} props.variant - Card variant
 * @param {Function} props.onLikeToggle - Callback when like status changes
 */
const Card = memo(function Card({
  title = '어나더굿뉴스',
  category = '카페',
  tags = ['커피'],
  liked = false,
  image = '/images/tmp.jpg',
  variant = 'default', // 'default' | 'compact'
  onLikeToggle
}) {
  const [isLiked, setIsLiked] = useState(liked);
  const variants = {
    default: {
      container: "w-36 min-w-36 sm:w-40 sm:min-w-40 rounded-card border border-[#EFEFEF] bg-white shadow-soft overflow-hidden flex-shrink-0 hover:shadow-md transition-shadow",
      imageHeight: "h-28 sm:h-32",
      contentPadding: "py-2 px-3",
      titleStyle: "text-[13px] sm:text-sm font-semibold truncate flex-1 mr-2",
      heartStyle: "text-gray-400 flex-shrink-0",
      heartSize: 16,
      subtitleStyle: "mt-[2px] text-xs leading-3 text-gray-500"
    },
    compact: {
      container: "rounded-card bg-brand-cream border border-brand-accent/20 overflow-hidden hover:shadow-sm transition-shadow",
      imageHeight: "h-[110px] sm:h-[120px]",
      contentPadding: "p-2 sm:p-[8px]",
      titleStyle: "text-[12px] sm:text-[13px] leading-[16px] font-semibold truncate",
      heartStyle: "text-brand-accent",
      heartSize: 14,
      subtitleStyle: "mt-[2px] text-[10px] sm:text-[11px] leading-[13px] text-gray-500"
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={currentVariant.container}>
      <div className={`relative bg-gray-100 ${currentVariant.imageHeight}`}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className={currentVariant.contentPadding}>
        <div className="flex items-center justify-between">
          <p className={currentVariant.titleStyle}>
            {title}
          </p>
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              onLikeToggle?.(title, !isLiked);
            }}
            className="transition-colors hover:scale-110"
            aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites`}
          >
            <FiHeart 
              className={`${currentVariant.heartStyle} ${isLiked ? 'fill-current' : ''}`} 
              size={currentVariant.heartSize} 
            />
          </button>
        </div>
        <p className={currentVariant.subtitleStyle}>
          {category}{tags && Array.isArray(tags) && tags.length > 0 ? ` · ${tags.join(', ')}` : ''}
        </p>
      </div>
    </div>
  );
});

export default Card;