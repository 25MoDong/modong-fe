import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import StatusCard from '../components/home/StatusCard';
// removed SectionTitle and PlaceCards per redesign
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import { loadCollections, loadMapping, saveMapping, addCollection, recountCollectionCounts, savePlace } from '../lib/favoritesStorage';
import { usePlaces } from '../hooks/usePlaces';
import FilterTags from '../components/common/FilterTags';
import PlaceSelectDropdown from '../components/common/PlaceSelectDropdown';
import AutoSizeText from '../components/common/AutoSizeText.jsx';
import backend from '../lib/backend';
import userStore from '../lib/userStore';
import { useCoupons } from '../lib/couponsStorage';


const Home = () => {
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_completed');
  });

  // 백엔드 데이터 연동
  const { places, loading, error } = usePlaces();


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
    // OnboardingFlow 내에서 이미 localStorage 설정이 완료됨
    localStorage.setItem('user_data', JSON.stringify(userData));
    setNeedsOnboarding(false);

    // 온보딩 완료 후 홈 페이지 유지 (Redefinition에서 이미 처리됨)
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

  // place select dropdown
  const [placeDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const placeContainerRef = useRef(null);
  const [placeCategories, setPlaceCategories] = useState([]);

  // Load one hero favorite store from v5 and reflect its name/tags in the hero area
  useEffect(() => {
    let mounted = true;

    const loadHero = async () => {
      try {
        const uid = userStore.getUserId();
        if (!uid) return;
        const list = await backend.getUserStores(uid);
        if (!mounted || !Array.isArray(list) || list.length === 0) return;
        const hero = list[0];
        const name = hero.storeName || hero.name || hero.title || hero.store || '연남 작당모의 카페';
        if (mounted) setSelectedPlace(name);
        // prefer hero.tags if available, otherwise show the default three tags requested
        if (mounted) setPlaceCategories(Array.isArray(hero.tags) && hero.tags.length ? hero.tags : ["달달한", "분위기가 좋은", "베이커리가 많은"]);
      } catch (e) {
        // ignore and keep defaults
      }
    };

    loadHero();

    const onUserChanged = () => loadHero();
    window.addEventListener('UserChanged', onUserChanged);
    window.addEventListener('OnboardingCompleted', onUserChanged);

    return () => { mounted = false; window.removeEventListener('UserChanged', onUserChanged); window.removeEventListener('OnboardingCompleted', onUserChanged); };
  }, []);

  const handleOpenPlaceDropdown = useCallback(() => {
    setPlaceDropdownOpen(true);
  }, []);

  const handleSelectPlace = useCallback((place) => {
    // `place` may be a string (label) or a raw object from backend. Normalize to display string.
    let displayName = '';
    let lookupName = '';
    if (!place) return;
    if (typeof place === 'string') {
      displayName = place;
      lookupName = place;
    } else if (typeof place === 'object') {
      displayName = place.storeName || place.name || place.title || place.label || JSON.stringify(place);
      lookupName = displayName;
    } else {
      displayName = String(place);
      lookupName = displayName;
    }

    setSelectedPlace(displayName);

    // fetch place details and categories if possible
    (async () => {
      try {
        const detail = await backend.getStoreByNameDetail(lookupName, '');
        if (!detail) return setPlaceCategories([]);
        // prefer tags array, else category or keywords
        if (Array.isArray(detail.tags) && detail.tags.length) return setPlaceCategories(detail.tags);
        if (detail.category) return setPlaceCategories([detail.category]);
        if (detail.userMood) return setPlaceCategories(Array.isArray(detail.userMood)? detail.userMood : [detail.userMood]);
        // fallback: derive simple tags from name
        const derived = lookupName.split(/\s|\-/).slice(0,4).map(s => s.replace(/\W+/g,'')).filter(Boolean);
        setPlaceCategories(derived);
      } catch (e) {
        setPlaceCategories([]);
      }
    })();
    // optional: could trigger filtering or selection side-effects here
  }, []);

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

  // status counts
  const [stampCount, setStampCount] = useState(0);
  const [coupons] = useCoupons();

  const loadStampCount = useCallback(async () => {
    try {
      const uid = userStore.getUserId();
      if (!uid) return setStampCount(0);
      const user = await backend.getUserById(uid);
      if (user && typeof user.user_stamp === 'number') setStampCount(user.user_stamp);
      else setStampCount(Number(user?.user_stamp) || 0);
    } catch (err) {
      console.error('Failed to load user stamp', err);
      setStampCount(0);
    }
  }, []);

  useEffect(() => {
    loadStampCount();
    const onUserChanged = () => loadStampCount();
    window.addEventListener('UserChanged', onUserChanged);
    window.addEventListener('OnboardingCompleted', onUserChanged);
    return () => {
      window.removeEventListener('UserChanged', onUserChanged);
      window.removeEventListener('OnboardingCompleted', onUserChanged);
    };
  }, [loadStampCount]);

  if(needsOnboarding){
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-4 pb-6">
        {/* Top row: location + brand + redefinition button */}
        <div className="flex items-center justify-between">
          <LocationBar hasContainer={false} />
          <div className="flex items-center gap-2">
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding_completed');
                  localStorage.removeItem('redefinition_completed');
                  localStorage.removeItem('user_data');
                  window.location.reload();
                }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                리셋
              </button>
            )}
            <button
              onClick={() => navigate('/redefinition')}
              className="px-3 py-1 text-xs bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              재정의
            </button>
            <div className="text-[24px] font-medium" style={{ fontFamily: 'KCC-Hanbit, sans-serif' }}>돌맹돌맹</div>
          </div>
        </div>

        {/* Status cards (stamp, coupon) + Hero */}
        <div className="mt-4">
          <div className="flex gap-3 justify-center">
            <StatusCard type="stamp" count={stampCount} />
            <StatusCard type="coupon" count={coupons.length} />
          </div>

          <div className="relative mt-3 w-[330px] h-[193px] mx-auto">
            <div className="absolute w-[92px] h-[77px] right-2 top-2 z-20">
              <img alt="돌맹이" className="w-full h-full object-contain" src="/images/dolmaeng.png" />
            </div>

            <div className="absolute w-[330px] h-[143px] left-0 top-[50px] bg-[#212842] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-[10px] z-10">
              <div className="absolute left-[11px] top-[18px] w-[283px] h-[104px] flex flex-col gap-[7px]">
                <div className="flex items-center gap-[3px] w-[146px] h-5">
                  <div className="w-5 h-5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B5B5B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
                  </div>
                  <span className="font-sans font-semibold text-xs text-[#B5B5B5] whitespace-nowrap w-[123px] h-[14px]">눌러서 다른 장소 선택하기</span>
                </div>

                <div className="w-[283px] h-[77px] flex flex-col gap-[7px]">
                  <div className="w-[283px] h-[44px] flex items-center gap-2">
                    <div className="relative w-[165px]" ref={placeContainerRef}>
                      <div onClick={handleOpenPlaceDropdown} className="relative w-[165px] h-[44px] rounded-lg px-[7px] py-2 shadow-[0px_0px_3.1px_rgba(0,0,0,0.25)] flex items-center justify-center border-3 border-[#FFC5D2] cursor-pointer hover:bg-opacity-90 transition-colors"
                        style={{ backgroundImage: "url('/images/border/PlaceSelection.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <AutoSizeText
                          minFontSize={12}
                          maxFontSize={22}
                          containerWidth={165}
                          containerHeight={44}
                          allowWrap={true}
                          className="font-kcc-hanbit text-black text-center block w-full"
                        >
                          {
                            (() => {
                              const raw = String(selectedPlace || '연남동 밀리커피');
                              // split at the first space to two lines if possible
                              const idx = raw.indexOf(' ');
                              if (idx > 0) {
                                const a = raw.slice(0, idx);
                                const b = raw.slice(idx + 1);
                                return (<><div>{a}</div><div>{b}</div></>);
                              }
                              // fallback: try splitting by dash or middle dot
                              const sepIdx = raw.indexOf('-');
                              if (sepIdx > 0) {
                                return (<><div>{raw.slice(0, sepIdx)}</div><div>{raw.slice(sepIdx+1)}</div></>);
                              }
                              return raw;
                            })()
                          }
                        </AutoSizeText>
                      </div>
                      <PlaceSelectDropdown
                        isOpen={placeDropdownOpen}
                        onClose={() => setPlaceDropdownOpen(false)}
                        selectedPlace={selectedPlace}
                        onSelectPlace={handleSelectPlace}
                        containerRef={placeContainerRef}
                      />
                    </div>
                    <span className="font-sans font-semibold text-[22px] text-white whitespace-nowrap w-[106px] h-[26px]">같은 분위기,</span>
                  </div>

                  <div className="w-[283px] h-[26px] font-sans font-semibold text-[22px]">
                    <span className="text-[#FFC5D2]">우리동네</span>
                    <span className="text-white">에서도 찾아봤어요!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category intro + filter tags */}
        <div className="mt-5">
          <div className="text-[12px] font-semibold text-[#B5B5B5]">{(selectedPlace || '연남 작당모의 카페') + '의 카테고리들 중 마음에 드는 것을 골라봐요!'}</div>
          <div className="mt-3 overflow-x-auto pb-2">
            <div className="inline-flex gap-2">
              <FilterTags
                tags={placeCategories && placeCategories.length ? placeCategories : ["달달한", "분위기가 좋은", "베이커리가 많은", "조용한", "음료가 맛있는"]}
              />
            </div>
          </div>
        </div>

        {/* Recommendations removed per design update */}

        {/* 백엔드 연결 에러 표시 */}
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
            {error}
          </div>
        )}
      
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
