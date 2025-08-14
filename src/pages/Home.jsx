import { FiSearch, FiChevronDown, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';

const Home = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (hasCompletedOnboarding) {
      setIsFirstVisit(false);
      setOnboardingComplete(true);
    }
  }, []);

  const handleOnboardingComplete = userData => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    setIsFirstVisit(false);
    setOnboardingComplete(true);
  };

  if (isFirstVisit) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  return (
    <div className="bg-white min-h-screen">
      {/* 화면 좌우 여백: 20px */}
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* 상단 위치 (좌측 20, 상단 16) */}
        <div className="flex items-center gap-[4px] title-18">
          <span>정릉로 77</span>
          <FiChevronDown className="text-gray-500" size={18} />
        </div>

        {/* 검색창 (상단 12px, 높이 44px, 라운드 22px) */}
        <div className="mt-[12px] relative">
          <input
            type="text"
            placeholder="최애 장소나 메뉴를 입력해 주세요."
            className="w-full h-[44px] pl-[16px] pr-[40px] text-[14px] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-full"
          />
          <FiSearch
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        {/* 스탬프 카드 */}
        <div className="relative mt-[20px]">
          {/* 돌멩이 (지름 56px) */}
          <div className="absolute -top-[28px] right-[16px] w-[56px] h-[56px] rounded-full grid place-items-center">
            {/* 실제 이미지가 있으면 아래 div 대신 <img/>로 교체 */}
            <img src="images/profile.png" alt="돌맹이미지" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-brand-navy text-white rounded-stamp px-[16px] pt-[18px] pb-[16px] shadow-stamp"
          >
            <p className="body-12 opacity-90">이번 달 모은 돌멩이 스탬프</p>
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

        {/* 섹션 타이틀 */}
        <h2 className="mt-[22px] text-[16px] leading-[20px] font-semibold">
          최애 장소 기반 추천
        </h2>
        <p className="mt-[4px] cap-11">
          00님의 최근 데이터를 바탕으로 좋아하실 곳을 뽑아봤어요!
        </p>

        {/* 가로 스크롤 카드 (카드 너비 150 / 높이 170) */}
        <div className="mt-[12px] flex gap-[12px] overflow-x-auto scrollbar-hide">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="min-w-[150px] w-[150px] rounded-card border border-[#EFEFEF] bg-white shadow-soft"
            >
              <div className="h-[110px] bg-[#E6E7EA] rounded-t-card" />
              <div className="p-[10px]">
                <div className="flex items-center justify-between">
                  <p className="body-13 font-semibold truncate max-w-[115px]">
                    어나더굿뉴스
                  </p>
                  <FiHeart className="text-gray-400" size={16} />
                </div>
                <p className="mt-[2px] text-[11px] leading-[14px] text-gray-500">
                  카페 (위치, 별점 등 추가정보)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 오늘의 추천 */}
        <h2 className="mt-[24px] text-[16px] leading-[20px] font-semibold">
          오늘의 추천
        </h2>

        {/* 카테고리 (높이 24px) */}
        <div className="mt-[8px] flex gap-[8px]">
          {['흐림', '비가주륵주륵', '28도'].map(c => (
            <button
              key={c}
              className="px-[10px] h-[24px] rounded-full bg-[#F3F4F6] text-[11px] text-[#6B7280]"
            >
              {c}
            </button>
          ))}
        </div>

        {/* 3열 카드 그리드 (칸 간격 12px) */}
        <div className="mt-[12px] grid grid-cols-3 gap-[12px]">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-card bg-brand-cream border border-brand-accent/20 overflow-hidden"
            >
              <div className="h-[110px] bg-[#E6E7EA]" />
              <div className="p-[8px]">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] leading-[16px] font-semibold truncate max-w-[90px]">
                    슬로카페달팽이
                  </p>
                  <FiHeart className="text-brand-accent" size={14} />
                </div>
                <p className="mt-[2px] text-[10px] leading-[13px] text-gray-500">
                  카페 (위치, 별점 등 추가정보)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 탭바 여백 */}
        <div className="h-[68px]" />
      </div>
    </div>
  );
};

export default Home;
