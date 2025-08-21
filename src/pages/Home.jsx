import { useState, useMemo, useCallback } from 'react';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import SearchBar from '../components/common/SearchBar';
import StampCard from '../components/home/StampCard';
import SectionTitle from '../components/home/SectionTitle';
import PlaceCards from '../components/common/PlaceCards';
import TagPills from '../components/common/TagPills';

const Home = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_completed');
  });


  // 데이터 정의 - useMemo로 최적화
  const favoriteData = useMemo(() => [
    { title: '어나더굿뉴스', category: '카페', tags: ['커피', '디저트'] },
    { title: '슬로카페달팽이', category: '카페', tags: ['브런치'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타', '분위기'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타', '분위기'] },
  ], []);

  const todayData = useMemo(() => [
    { title: '슬로카페달팽이', category: '카페', tags: ['브런치'] },
    { title: '모던플레이스', category: '레스토랑', tags: ['파스타'] },
    { title: '브루클린카페', category: '카페', tags: ['분위기'] }
  ], []);

  const handleOnboardingComplete = useCallback((userData) => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    setNeedsOnboarding(false);

    window.dispatchEvent(new CustomEvent('OnboardingCompleted'));
  }, []);

  if(needsOnboarding){
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-4 pb-6">
        <LocationBar hasContainer={false} />

        {/* variant -> dark, light 지정 시 검색창 테마 변경 */}
        <SearchBar variant='' clickable={true} />

        {/* 스탬프 카드 */}
        <StampCard />

        {/* 섹션 타이틀 */}
        <SectionTitle title="최애 장소 기반 추천" subtitle="00님의 최근 데이터를 바탕으로 좋아하실 곳을 뽑아봤어요!"/>

        {/* 가로 스크롤 카드 (카드 너비 150 / 높이 170) */}
        <PlaceCards 
          places={favoriteData}
          variant="default"
          layout="scroll"
          className="mt-3"
        />

        {/* 오늘의 추천 */}
        <SectionTitle className='mt-6' title="오늘의 추천"/>

        {/* 날씨/온도 태그 */}
        <TagPills 
          className="mt-2"
          tags={['흐림', '비가주륵주륵', '28도']}
        />

        {/* 3열 카드 그리드 (칸 간격 12px) */}
        <PlaceCards 
          places={todayData}
          variant="compact"
          layout="grid"
          className="mt-3"
        />
      </div>
    </div>
)};

export default Home;
