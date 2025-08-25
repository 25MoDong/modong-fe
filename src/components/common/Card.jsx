import { FiHeart } from "react-icons/fi";
import { memo } from "react";

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
  id = null,
  title = '어나더굿뉴스',
  category = '카페',
  tags = ['커피'],
  liked = false,
  image = '/images/tmp.jpg',
  variant = 'default', // 'default' | 'compact'
  onLikeToggle
}) {
  const variants = {
    default: {
      container: "w-full max-w-[150px] min-w-[140px] rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0 hover:shadow-lg hover:border-gray-300 transition-all duration-200",
      imageHeight: "h-24 sm:h-28",
      contentPadding: "p-3",
      titleStyle: "text-sm font-semibold truncate flex-1 mr-2 text-gray-900",
      heartStyle: "text-gray-400 flex-shrink-0 hover:text-red-500 transition-colors",
      heartSize: 16,
      subtitleStyle: "mt-1 text-xs text-gray-500 leading-tight"
    },
    compact: {
      container: "w-full rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200",
      imageHeight: "h-20 sm:h-24",
      contentPadding: "p-2.5",
      titleStyle: "text-xs sm:text-sm font-semibold truncate text-gray-900",
      heartStyle: "text-gray-400 hover:text-red-500 transition-colors",
      heartSize: 14,
      subtitleStyle: "mt-1 text-xs text-gray-500 leading-tight"
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={currentVariant.container}>
      <div className={`relative bg-gray-100 ${currentVariant.imageHeight}`}>
        <img src={image} alt={title} className="w-full h-full object-cover" draggable="false" style={{ WebkitUserDrag: 'none' }} />
      </div>
      <div className={currentVariant.contentPadding}>
        <div className="flex items-center justify-between">
          <p className={currentVariant.titleStyle}>
            {title}
          </p>
          <button
            onClick={(e) => {
              // Prevent click from bubbling to parent Link (avoid navigation)
              e.stopPropagation();
              e.preventDefault();
              // Delegate handling to parent (open picker or remove)
              onLikeToggle?.({ id, title, category, image }, !liked);
            }}
            className="transition-colors hover:scale-110"
            aria-label={`${liked ? 'Remove from' : 'Add to'} favorites`}
          >
            <FiHeart 
              className={`${currentVariant.heartStyle} ${liked ? 'fill-current' : ''}`} 
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
