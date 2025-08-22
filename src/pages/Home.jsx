import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import SearchBar from '../components/common/SearchBar';
import StampCard from '../components/home/StampCard';
import SectionTitle from '../components/home/SectionTitle';
import PlaceCards from '../components/common/PlaceCards';
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import { loadCollections, loadMapping, saveMapping, addCollection, recountCollectionCounts, savePlace } from '../lib/favoritesStorage';
import { useEffect } from 'react';
import TagPills from '../components/common/TagPills';


const Home = () => {
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_completed');
  });


  // 데이터 정의 - 상세페이지에 필요한 모든 정보 포함
  const favoriteData = [
    { 
      id: 1, 
      name: '어나더굿뉴스', 
      title: '어나더굿뉴스', // 호환성을 위해 유지
      category: '카페', 
      tags: ['커피', '디저트'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 150m' },
      desc: '회원님이 좋아하실만한 달콤한 디저트와 향긋한 커피를 제공하는 아늑한 카페입니다. 최애 장소와 비슷한 분위기를 자랑합니다.',
      menu: ['아메리카노', '카페라떼', '티라미수', '레드벨벳케이크', '에스프레소'],
      reviews: [
        { id: 1, title: '커피애호가', badges: ['맛있는', '분위기좋은', '친절한'], text: '디저트가 정말 맛있고 커피도 향이 좋아요!' },
        { id: 2, title: '디저트러버', badges: ['달달한', '예쁜', '아늑한'], text: '케이크가 촉촉하고 달달해서 너무 좋았어요' }
      ]
    },
    { 
      id: 2, 
      name: '슬로카페달팽이', 
      title: '슬로카페달팽이',
      category: '카페', 
      tags: ['브런치'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 320m' },
      desc: '여유로운 분위기에서 즐기는 맛있는 브런치 메뉴가 자랑인 카페입니다. 느긋한 시간을 보내기 좋은 곳입니다.',
      menu: ['브런치 플레이트', '팬케이크', '에그베네딕트', '아보카도 토스트', '오렌지 주스'],
      reviews: [
        { id: 3, title: '브런치메니아', badges: ['맛있는', '푸짐한', '분위기좋은'], text: '브런치 메뉴가 정말 푸짐하고 맛있어요' },
        { id: 4, title: '느긋한일상', badges: ['여유로운', '편안한', '조용한'], text: '책 읽기 좋은 조용하고 편안한 공간이에요' }
      ]
    },
    { 
      id: 3, 
      name: '모던플레이스', 
      title: '모던플레이스',
      category: '레스토랑', 
      tags: ['파스타', '분위기'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 280m' },
      desc: '모던한 인테리어와 함께 정통 이탈리안 파스타를 즐길 수 있는 세련된 레스토랑입니다. 특별한 날에 추천합니다.',
      menu: ['크림 파스타', '토마토 파스타', '오일 파스타', '리조또', '와인'],
      reviews: [
        { id: 5, title: '파스타마니아', badges: ['맛있는', '세련된', '로맨틱'], text: '파스타 맛이 정말 훌륭하고 분위기도 좋아요' },
        { id: 6, title: '데이트장소', badges: ['분위기좋은', '예쁜', '특별한'], text: '데이트하기 정말 좋은 분위기의 레스토랑이에요' }
      ]
    },
    { 
      id: 4, 
      name: '카페로얄', 
      title: '카페로얄',
      category: '카페', 
      tags: ['뷰맛집', '분위기'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 420m' },
      desc: '탁 트인 창가에서 바라보는 뷰가 아름다운 카페입니다. SNS 사진 찍기에도 좋고 여유로운 시간을 보내기 완벽합니다.',
      menu: ['시그니처 라떼', '딸기 스무디', '치즈케이크', '마카롱', '허브티'],
      reviews: [
        { id: 7, title: '뷰맛집헌터', badges: ['뷰맛집', '예쁜', '인스타'], text: '창가 자리에서 보는 뷰가 정말 예뻐요' },
        { id: 8, title: '사진쟁이', badges: ['감성적', '예쁜', '분위기좋은'], text: '사진 찍기 좋고 음료도 맛있어요' }
      ]
    }
  ];

  const todayData = [
    { 
      id: 101, 
      name: '슬로카페달팽이', 
      title: '슬로카페달팽이',
      category: '카페', 
      tags: ['브런치'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 320m' },
      desc: '오늘 같은 날씨에 따뜻한 브런치와 함께 여유로운 시간을 보내기 좋은 카페입니다.',
      menu: ['브런치 플레이트', '팬케이크', '에그베네딕트', '아보카도 토스트', '오렌지 주스'],
      reviews: [
        { id: 9, title: '브런치메니아', badges: ['맛있는', '푸짐한', '분위기좋은'], text: '브런치 메뉴가 정말 푸짐하고 맛있어요' }
      ]
    },
    { 
      id: 102, 
      name: '모던플레이스', 
      title: '모던플레이스',
      category: '레스토랑', 
      tags: ['파스타'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 280m' },
      desc: '오늘 날씨에 따뜻한 파스타 한 그릇이 생각나는 모던한 이탈리안 레스토랑입니다.',
      menu: ['크림 파스타', '토마토 파스타', '오일 파스타', '리조또', '와인'],
      reviews: [
        { id: 10, title: '파스타마니아', badges: ['맛있는', '세련된', '따뜻한'], text: '파스타 맛이 정말 훌륭하고 분위기도 좋아요' }
      ]
    },
    { 
      id: 103, 
      name: '브루클린카페', 
      title: '브루클린카페',
      category: '카페', 
      tags: ['분위기'],
      image: '/images/tmp.jpg',
      address: { full: '내 위치에서 180m' },
      desc: '뉴욕 브루클린 감성을 담은 빈티지한 카페로, 오늘 같은 날에 특별한 커피 한 잔을 즐기기 좋습니다.',
      menu: ['브루클린 블렌드', '콜드브루', '바닐라 라떼', '뉴욕 치즈케이크', '베이글'],
      reviews: [
        { id: 11, title: '빈티지러버', badges: ['분위기좋은', '독특한', '감성적'], text: '빈티지한 분위기가 정말 멋있는 카페예요' },
        { id: 12, title: '커피덕후', badges: ['맛있는', '향긋한', '특별한'], text: '원두 향이 정말 좋고 커피 맛도 훌륭해요' }
      ]
    }
  ];

  const handleOnboardingComplete = useCallback((userData) => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    setNeedsOnboarding(false);

    window.dispatchEvent(new CustomEvent('OnboardingCompleted'));
  }, []);

  const handleWriteReview = useCallback(() => {
    navigate('/write-review');
  }, [navigate]);

  // Favorites picker state (for heart button on cards)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCollections, setPickerCollections] = useState([]);
  const [pickerSelectedIds, setPickerSelectedIds] = useState([]);
  const [pickerPlace, setPickerPlace] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const openPickerForPlace = useCallback((place, liked) => {
    if (!place || !place.id) return;
    // If unliking, remove from all collections immediately and do not open picker
    if (liked === false) {
      const map = loadMapping();
      if (map[String(place.id)]) {
        delete map[String(place.id)];
        saveMapping(map);
        setPickerCollections(recountCollectionCounts());
      }
      return;
    }

    // For liking, open picker with NO preselected collections
    const cols = loadCollections();
    setPickerCollections(cols);
    setPickerSelectedIds([]);
    setPickerPlace(place);
    setPickerOpen(true);
  }, []);

  const pickerToggle = useCallback((cid) => {
    setPickerSelectedIds(prev => prev.includes(cid) ? prev.filter(v => v !== cid) : [...prev, cid]);
  }, []);

  const pickerSave = useCallback(() => {
    if (!pickerPlace) return setPickerOpen(false);
    savePlace(pickerPlace);
    const map = loadMapping();
    map[String(pickerPlace.id)] = pickerSelectedIds;
    saveMapping(map);
    setPickerCollections(recountCollectionCounts());
    setPickerOpen(false);
  }, [pickerPlace, pickerSelectedIds]);

  const handleCreateNewCollection = useCallback(() => setAddOpen(true), []);

  const handleSubmitNewCollection = useCallback(({ title, description }) => {
    if (!title?.trim()) return;
    addCollection({ title: title.trim(), description: description?.trim() });
    setPickerCollections(recountCollectionCounts());
    // Do NOT auto-add the current place to new collection; user must select and save explicitly.
    setAddOpen(false);
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
        <StampCard onWrite={handleWriteReview} />

        {/* 섹션 타이틀 */}
        <SectionTitle title="최애 장소 기반 추천" subtitle="00님의 최근 데이터를 바탕으로 좋아하실 곳을 뽑아봤어요!"/>

        {/* 가로 스크롤 카드 (카드 너비 150 / 높이 170) */}
        <PlaceCards 
          places={favoriteData}
          variant="default"
          layout="scroll"
          className="mt-3"
          onLikeToggle={openPickerForPlace}
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
          onLikeToggle={openPickerForPlace}
        />
      
      {/* Favorites picker and add modal */}
      <FavoritesPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        collections={pickerCollections}
        selectedIds={pickerSelectedIds}
        onToggle={pickerToggle}
        onCreateNew={handleCreateNewCollection}
        onSave={pickerSave}
      />

      <AddCollectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleSubmitNewCollection}
      />
      </div>
    </div>
)};

export default Home;
