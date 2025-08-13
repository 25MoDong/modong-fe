export default function StampCard({ count = 0, onWrite }) {
  return (
    <div className="relative px-5 mt-4">
      {/* 마스코트 반원 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-7 bg-[#E9E7E2] rounded-t-full flex items-end justify-center">
        <div className="w-7 h-7 bg-[#E9E7E2] rounded-full flex items-center justify-center shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
          <div className="w-1.5 h-1.5 bg-black rounded-full mr-1.5" />
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        </div>
      </div>

      {/* 본 카드 */}
      <div className="rounded-[14px] bg-[#1F2746] text-white px-5 py-4 shadow-md">
        <div className="text-[12px] opacity-80">이번 달 모은 들멩이 스탬프</div>
        <div className="mt-1 text-[40px] leading-none font-extrabold tracking-tight">{String(count).padStart(2,'0')}개</div>
        <div className="mt-2 flex justify-end">
          <button onClick={onWrite} className="text-[11px] opacity-90 hover:opacity-100">후기 쓰러가기 &gt;</button>
        </div>
      </div>
    </div>
  );
}
