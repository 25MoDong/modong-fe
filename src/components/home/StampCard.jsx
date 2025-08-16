import { motion } from 'framer-motion';

export default function StampCard({ count = 0, onWrite }) {
  return (
    <div className="relative mt-5">
      
      {/* 본 카드 */}
      <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative bg-primary-500 text-secondary-500 h-[150px] rounded-stamp px-[16px] pt-[18px] pb-[16px] shadow-stamp z-10"
        >
        <p className="text-xs opacity-80">이번 달 모은 돌멩이 스탬프</p>
        <div className="mt-[6px] flex items-end justify-between">
          <p className="text-[36px] leading-[36px] transfrom translate-y-1/2 font-extrabold tracking-[-0.3px]">
            00개
          </p>
          <img 
            src="images/dolmaeng.png"
            alt="돌맹이 캐릭터"
            className="absolute top-0 right-0 w-[92px] h-[77px] transform -translate-x-5 translate-y-1/3 z-0"
          />
          <button className="absolute bottom-3 right-5 text-[12px] leading-[16px] underline underline-offset-2 opacity-90">
            후기 쓰러가기 &gt;
          </button>
        </div>
      </motion.div>
    </div>
  );
}
