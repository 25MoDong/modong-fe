import { useEffect, useState } from 'react';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import SearchBar from '../components/common/SearchBar';
import StampCard from '../components/home/StampCard';
import SectionTitle from '../components/home/SectionTitle';
import PlaceCards from '../components/common/PlaceCards';
import BottomTab from '../components/common/BottomTab';
import TagPills from '../components/common/TagPills';

const Home = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
      return !localStorage.getItem('onboarding_completed');
  });

  // 데이터 정의
  const favoriteData = [
    { title: '어나더굿뉴스', category: '카페', tags: ['커피', '디저트'] },
    { title: '슬로카페달팽이', category: '카페', tags: ['브런치'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타', '분위기'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타', '분위기'] },
  ];

  const todayData = [
    { title: '슬로카페달팽이', category: '카페', tags: ['브런치'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타'] },
    { title: '브루클린카페', category: '카페', tags: ['분위기'] }
  ];

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (hasCompletedOnboarding) {
      setIsFirstVisit(false);
    }
  }, []);

  const handleOnboardingComplete = userData => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    setIsFirstVisit(false);
  };

  if (isFirstVisit) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  return (
    <div className="bg-white min-h-screen">
      {/* 화면 좌우 여백: 20px */}
      <div className="px-[20px] pt-[16px] pb-[24px]">
        <LocationBar hasContainer={false} />

        {/* variant -> dark, light 지정 시 검색창 테마 변경 */}
        <SearchBar variant='dark'/>

        {/* 스탬프 카드 */}
        <StampCard />

        {/* 섹션 타이틀 */}
        <SectionTitle title="최애 장소 기반 추천" subtitle="00님의 최근 데이터를 바탕으로 좋아하실 곳을 뽑아봤어요!"/>

        {/* 가로 스크롤 카드 (카드 너비 150 / 높이 170) */}
        <PlaceCards 
          places={favoriteData}
          variant="default"
          layout="scroll"
          className="mt-[12px]"
        />

        {/* 오늘의 추천 */}
        <SectionTitle className='mt-6' title="오늘의 추천"/>

        {/* 날씨/온도 태그 */}
        <TagPills 
          className="mt-[8px]"
          tags={['흐림', '비가주륵주륵', '28도']}
        />

        {/* 3열 카드 그리드 (칸 간격 12px) */}
        <PlaceCards 
          places={todayData}
          variant="compact"
          layout="grid"
          className="mt-[12px]"
        />

        {/* 탭바 여백 */}
        <BottomTab />
      </div>
    </div>
  );
};

export default Home;
