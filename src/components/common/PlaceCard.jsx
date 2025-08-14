import { FiHeart } from "react-icons/fi";

export default function PlaceCard({
  title = '어나더굿뉴스',
  category = '카페',
  tags = ['커피'],
  liked = false,
  image = '/images/tmp.jpg',
  variant = 'default', // 'default' | 'compact'
}) {
  const variants = {
    default: {
      container: "w-36 rounded-card border border-[#EFEFEF] bg-white shadow-soft overflow-hidden flex-shrink-0",
      imageHeight: "h-28",
      contentPadding: "py-2 px-3",
      titleStyle: "text-[13px] font-semibold truncate flex-1 mr-2",
      heartStyle: "text-gray-400 flex-shrink-0",
      heartSize: 16,
      subtitleStyle: "mt-[2px] text-xs leading-3 text-gray-500"
    },
    compact: {
      container: "rounded-card bg-brand-cream border border-brand-accent/20 overflow-hidden",
      imageHeight: "h-[110px]",
      contentPadding: "p-[8px]",
      titleStyle: "text-[12px] leading-[16px] font-semibold truncate max-w-[90px]",
      heartStyle: "text-brand-accent",
      heartSize: 14,
      subtitleStyle: "mt-[2px] text-[10px] leading-[13px] text-gray-500"
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
          <FiHeart className={currentVariant.heartStyle} size={currentVariant.heartSize} />
        </div>
        <p className={currentVariant.subtitleStyle}>
          {category} · {tags.join(', ')}
        </p>
      </div>
    </div>
  );
}
