export default function PlaceCard({
  title = '어너더굿뉴스',
  category = '카페',
  tags = ['커피', '별점 높음 주거라벨'],
  liked = false,
  image = '/images/tmp.jpg'
}) {
  return (
    <div className="w-[150px] flex-shrink-0">
      <div className="relative rounded-[12px] bg-gray-100 h-[100px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover"/>
      </div>
      <div className="mt-2 flex items-start justify-between">
        <div className="pr-2">
          <div className="text-[13px] font-semibold truncate">{title}</div>
          <div className="text-[11px] text-gray-500 truncate">
            {category} · {tags.join(', ')}
          </div>
        </div>
        <button aria-label="like" className={`text-[16px] ${liked? 'text-rose-500':'text-gray-400'}`}>♡</button>
      </div>
    </div>
  );
}
