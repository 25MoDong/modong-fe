import { motion } from 'framer-motion';

export default function StampCard({ count = 0, onWrite }) {
  return (
    <div className="relative mt-5">
      <img 
          src="images/profile.png"
          alt="돌맹이 캐릭터"
          className="absolute top-0 right-0 w-12 h-8 transform -translate-x-1 -translate-y-5 z-0"
      />

      {/* 본 카드 */}
      <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-brand-navy text-white rounded-stamp px-[16px] pt-[18px] pb-[16px] shadow-stamp z-10"
        >
        <p className="text-xs opacity-80">이번 달 모은 들멩이 스탬프</p>
        <div className="mt-[6px] flex items-end justify-between">
          <p className="text-[36px] leading-[36px] font-extrabold tracking-[-0.3px]">
            00개
          </p>
          <button className="text-[12px] leading-[16px] underline underline-offset-2 opacity-90">
            후기 쓰러가기 &gt;
          </button>
        </div>
      </motion.div>
    </div>
  );
}
