export default function MenuSkeleton({ label = '바나나 푸딩' }) {
  return (
    <div className="shrink-0 w-[90px]">
      <div className="w-[90px] h-[108px] rounded-[10px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-100 shadow-sm">
        {/* 메뉴 아이콘 */}
        <div className="text-3xl text-gray-400">
          🍽️
        </div>
      </div>
      <p className="mt-2 text-[12px] leading-[15px] text-gray-600 text-center font-medium px-1 break-keep">
        {label}
      </p>
    </div>
  );
}
