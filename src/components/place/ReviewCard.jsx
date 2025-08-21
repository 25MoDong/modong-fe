// src/components/place/ReviewCard.jsx
export default function ReviewCard({ title, badges = [], text }) {
  return (
    <div className="w-[168px] shrink-0 rounded-xl border border-[#F0E8D5] bg-[#FBF8F1] p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-[10px] text-gray-500">
          img
        </div>
        <div className="text-[13px] font-semibold leading-none">{title}</div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-full border border-gray-200 bg-white px-2 py-[2px] text-[10px] text-gray-600"
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
