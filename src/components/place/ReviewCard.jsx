// src/components/place/ReviewCard.jsx
export default function ReviewCard({ title, badges = [], text }) {
  // userId를 마스킹해서 표시 (예: johndoe123 -> jo***123)
  const getMaskedUserId = (userId) => {
    if (!userId || userId === '익명 사용자') return '익명 사용자';
    if (userId.length <= 4) return userId;
    
    const firstTwo = userId.slice(0, 2);
    const lastTwo = userId.slice(-2);
    return `${firstTwo}***${lastTwo}`;
  };

  return (
    <div className="w-[168px] shrink-0 rounded-xl border border-[#F0E8D5] bg-[#FBF8F1] p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-[12px]">
          👤
        </div>
        <div className="text-[13px] font-semibold leading-none">{getMaskedUserId(title)}</div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {badges.map((b, index) => (
          <span
            key={`${b}-${index}`}
            className="rounded-full border border-orange-200 bg-orange-50 px-2 py-[2px] text-[10px] text-orange-700"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-3 rounded-lg bg-white p-3 text-[12px] leading-5 text-gray-700">
        {text}
      </div>
    </div>
  );
}
