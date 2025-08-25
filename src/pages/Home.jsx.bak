import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import StatusCard from '../components/home/StatusCard';
// removed SectionTitle and PlaceCards per redesign
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import { loadMapping, saveMapping, addCollection, recountCollectionCounts, savePlace } from '../lib/favoritesStorage';
import { usePlaces } from '../hooks/usePlaces';
import FilterTags from '../components/common/FilterTags';
import PlaceSelectDropdown from '../components/common/PlaceSelectDropdown';
import AutoSizeText from '../components/common/AutoSizeText.jsx';
import HomeTags from '../components/common/HomeTags.jsx';
import FallbackLoading from '../components/common/FallbackLoading.jsx';
import backend from '../lib/backend';
import aiApi from '../lib/aiApi';
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
  const [addOpen, setAddOpen] = useState(false);
  const [pickerPlace, setPickerPlace] = useState(null);

  // place select dropdown
  const [placeDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const placeContainerRef = useRef(null);
  const [placeCategories, setPlaceCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userRecStores, setUserRecStores] = useState([]);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [enrichedRecommendations, setEnrichedRecommendations] = useState([]);
  
  // Loading states
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingHero, setIsLoadingHero] = useState(true);

  // Place selection handler: normalize input, fetch details, and call AI recommend
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

    // fetch place details and categories if possible and call AI recommend
    (async () => {
      try {
        setIsLoadingRecommendations(true);
        // Prefer favoritePlaces match for details
        const favMatch = favoritePlaces && favoritePlaces.length ? favoritePlaces.find(fp => {
          const n = (fp.storeName || fp.name || fp.title || '').toString();
          return n && n === lookupName;
        }) : null;

        // If not found in favorites, try search
        let detail = favMatch || null;
        if (!detail) {
          const results = await backend.searchStores(lookupName).catch(() => []);
          detail = Array.isArray(results) && results.length ? results[0] : null;
        }

        // Determine targetDetail from available fields
        const targetDetail = detail?.detail || detail?.address?.full || detail?.address || '';
        const targetStoreName = displayName;

        // Call AI recommend with specified contract (include userId)
        try {
          // Resolve userId from userStore first, then try onboarding user data as fallback
          let userId = userStore.getUserId();
          if (!userId) {
            try {
              const ud = JSON.parse(localStorage.getItem('user_data') || 'null');
              if (ud && (ud.id || ud.userId)) userId = ud.id || ud.userId;
            } catch (e) { /* ignore parse errors */ }
          }

          // Only call API if userId is available
          if (!userId) {
            console.warn('No userId available, skipping AI recommendation');
            // Use fallback data if available
            if (detail) {
              if (Array.isArray(detail.tags) && detail.tags.length) setPlaceCategories(detail.tags);
              else if (detail.category) setPlaceCategories([detail.category]);
              else setPlaceCategories([]);
            } else {
              setPlaceCategories([]);
            }
            setRecommendations([]);
            return;
          }

          // Call recommend with userId as a URL parameter and the rest in the request body
          const res = await aiApi.recommend(userId, { targetStoreName, targetDetail });
          // response may contain targetKeywords and results
          if (res && Array.isArray(res.targetKeywords)) {
            setPlaceCategories(res.targetKeywords);
          } else if (detail) {
            if (Array.isArray(detail.tags) && detail.tags.length) setPlaceCategories(detail.tags);
            else if (detail.category) setPlaceCategories([detail.category]);
            else setPlaceCategories([]);
          } else {
            setPlaceCategories([]);
          }

          if (res && Array.isArray(res.results)) {
            setRecommendations(res.results);
          } else {
            setRecommendations([]);
          }
        } catch (err) {
          console.error('AI recommendation failed:', err);
          // on failure, fallback to detail-derived categories
          if (detail) {
            if (Array.isArray(detail.tags) && detail.tags.length) setPlaceCategories(detail.tags);
            else if (detail.category) setPlaceCategories([detail.category]);
            else setPlaceCategories([]);
          } else {
            setPlaceCategories([]);
          }
          setRecommendations([]);
          setIsLoadingRecommendations(false);
        }
      } catch (err) {
        console.error('Error in place selection:', err);
        setPlaceCategories([]);
        setRecommendations([]);
        setIsLoadingRecommendations(false);
      }
    })();
    // optional: could trigger filtering or selection side-effects here
  }, [favoritePlaces]);

  // Load one hero favorite store from v5 and reflect its name/tags in the hero area
  useEffect(() => {
    let mounted = true;

    const loadHero = async () => {
      try {
        setIsLoadingHero(true);
        const uid = userStore.getUserId();
        if (!uid) {
          if (mounted) {
            setIsLoadingHero(false);
            setSelectedPlace('연남 작당모의 카페');
            setPlaceCategories(["달달한", "분위기가 좋은", "베이커리가 많은"]);
          }
          return;
        }
        
        const list = await backend.getUserStores(uid);
        console.log('Hero loaded user stores:', list);
        
        // save favorite places for later lookup
        if (mounted) setFavoritePlaces(Array.isArray(list) ? list : []);
        
        if (!mounted || !Array.isArray(list) || list.length === 0) {
          if (mounted) {
            setIsLoadingHero(false);
            setSelectedPlace('연남 작당모의 카페');
            setPlaceCategories(["달달한", "분위기가 좋은", "베이커리가 많은"]);
          }
          return;
        }
        
        const hero = list[0];
        const name = hero.storeName || hero.name || hero.title || hero.store || '연남 작당모의 카페';
        console.log('Hero place name:', name);
        
        if (mounted) {
          setSelectedPlace(name);
          // prefer hero.tags if available, otherwise show the default three tags requested
          setPlaceCategories(Array.isArray(hero.tags) && hero.tags.length ? hero.tags : ["달달한", "분위기가 좋은", "베이커리가 많은"]);
          setIsLoadingHero(false);
          
          // Auto-trigger recommendation for the hero place
          // handleSelectPlace will be called via dependency effect
        }
      } catch (e) {
        console.error('Failed to load hero:', e);
        if (mounted) {
          setIsLoadingHero(false);
          setSelectedPlace('연남 작당모의 카페');
          setPlaceCategories(["달달한", "분위기가 좋은", "베이커리가 많은"]);
        }
      }
    };

    loadHero();

    const onUserChanged = () => loadHero();
    window.addEventListener('UserChanged', onUserChanged);
    window.addEventListener('OnboardingCompleted', onUserChanged);

    return () => { mounted = false; window.removeEventListener('UserChanged', onUserChanged); window.removeEventListener('OnboardingCompleted', onUserChanged); };
  }, []);

  // Enrich recommendations with store details for tags
  useEffect(() => {
    let mounted = true;

    const enrichRecommendations = async () => {
      if (!recommendations || recommendations.length === 0) {
        setEnrichedRecommendations([]);
        setIsLoadingRecommendations(false);
        return;
      }

      try {
        setIsLoadingRecommendations(true);
        const enrichedPromises = recommendations.map(async (rec) => {
          // Skip if no storeId
          if (!rec.storeId) {
            return { ...rec, tags: rec.tags || [] };
          }

          try {
            // Fetch store details from /api/v6/{storeId}
            console.log(`Fetching store details for storeId: ${rec.storeId}`);
            const storeDetail = await backend.getStoreById(rec.storeId);
            console.log('Store detail received:', storeDetail);
            
            // Extract categories/tags from storeMood field
            let tags = rec.tags || [];
            
            // Parse tags from storeMood if available (main source of tags)
            if (storeDetail && storeDetail.storeMood) {
              console.log('storeMood found:', storeDetail.storeMood);
              // Normalize escaped newlines (literal "\\n") and actual newlines, then split
              const rawMood = String(storeDetail.storeMood || '');
              // First handle literal backslash sequences stored in the DB ("\\n"), then normalize real newlines
              const normalized = rawMood
                .replaceAll('\\r\\n', '\n')
                .replaceAll('\\n', '\n')
                .replace(/\r?\n/g, '\n');
              const moodTags = normalized.split('\n')
                .flatMap(part => part.split(/,|·|•/))
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
              console.log('Parsed mood tags:', moodTags);
              tags = [...tags, ...moodTags];
            }
            
            // Fallback: Parse categories from mainMenu if storeMood not available
            if (tags.length === 0 && storeDetail && storeDetail.mainMenu) {
              console.log('No storeMood found, trying mainMenu:', storeDetail.mainMenu);
              // Extract potential category tags from mainMenu string
              const menuItems = storeDetail.mainMenu.split(/,|\n/).map(item => item.trim()).filter(Boolean);
              // Try to infer category tags from menu items (simplified approach)
              const inferredTags = [];
              
              if (menuItems.some(item => /커피|라떼|아메리카노|에스프레소/.test(item))) {
                inferredTags.push('음료가 맛있는');
              }
              if (menuItems.some(item => /케이크|디저트|마카롱|쿠키/.test(item))) {
                inferredTags.push('달달한');
              }
              if (menuItems.some(item => /브런치|샐러드|토스트/.test(item))) {
                inferredTags.push('분위기가 좋은');
              }
              
              tags = [...tags, ...inferredTags];
              console.log('Inferred tags from menu:', inferredTags);
            }

            // Use category field if still no tags
            if (tags.length === 0 && storeDetail && storeDetail.category) {
              console.log('No storeMood or menu tags, using category:', storeDetail.category);
              if (storeDetail.category.includes('카페')) {
                tags.push('분위기가 좋은', '조용한');
              }
              if (storeDetail.category.includes('베이커리')) {
                tags.push('베이커리가 많은');
              }
            }

            // Remove duplicates and limit to reasonable number
            tags = [...new Set(tags)];
            console.log('Final tags before defaults:', tags);

            // If still no tags, add some defaults based on category
            if (tags.length === 0) {
              const category = rec.category || storeDetail?.category || '카페';
              console.log('Adding default tags for category:', category);
              if (category.includes('카페')) {
                tags = ['분위기가 좋은', '조용한', '음료가 맛있는'];
              } else if (category.includes('레스토랑')) {
                tags = ['맛있는', '분위기 좋은'];
              } else {
                tags = ['분위기가 좋은'];
              }
            }

            console.log(`Final result for ${rec.storeId}:`, {
              storeName: rec.storeName,
              tags: tags.slice(0, 4),
              scoreTotal: rec.scoreTotal,
              matchScore: rec.matchScore
            });

            return {
              ...rec,
              tags: tags.slice(0, 4), // Limit to 4 tags as shown in design
              storeDetail: storeDetail
            };
          } catch (err) {
            console.error(`Failed to fetch details for store ${rec.storeId}:`, err);
            // Return with default tags if API call fails
            const category = rec.category || '카페';
            let defaultTags = ['분위기가 좋은'];
            
            if (category.includes('카페')) {
              defaultTags = ['분위기가 좋은', '조용한', '음료가 맛있는'];
            } else if (category.includes('레스토랑')) {
              defaultTags = ['맛있는', '분위기 좋은'];
            }
            
            return { ...rec, tags: defaultTags };
          }
        });

        const enrichedResults = await Promise.all(enrichedPromises);
        
        if (mounted) {
          setEnrichedRecommendations(enrichedResults);
          setIsLoadingRecommendations(false);
        }
      } catch (err) {
        console.error('Failed to enrich recommendations:', err);
        if (mounted) {
          setEnrichedRecommendations(recommendations.map(rec => ({ 
            ...rec, 
            tags: rec.tags || ['분위기가 좋은'] 
          })));
          setIsLoadingRecommendations(false);
        }
      }
    };

    enrichRecommendations();
    
    return () => { mounted = false; };
  }, [recommendations]);

  // Auto-trigger recommendation for the selected hero place
  useEffect(() => {
    if (selectedPlace && !isLoadingHero && favoritePlaces.length > 0) {
      console.log('Auto-triggering recommendation for hero place:', selectedPlace);
      const heroPlace = favoritePlaces.find(fp => {
        const name = fp.storeName || fp.name || fp.title || '';
        return name === selectedPlace;
      });
      if (heroPlace) {
        handleSelectPlace(heroPlace);
      }
    }
  }, [selectedPlace, isLoadingHero, favoritePlaces, handleSelectPlace]);

  const handleOpenPlaceDropdown = useCallback(() => {
    setPlaceDropdownOpen(true);
  }, []);




  const pickerToggle = useCallback((cid) => {
    setPickerSelectedIds(prev => prev.includes(cid) ? prev.filter(v => v !== cid) : [...prev, cid]);
  }, []);

  const pickerSave = useCallback(() => {
    if (pickerPlace && pickerSelectedIds.length > 0) {
      // Save the place to selected collections
      pickerSelectedIds.forEach(collectionId => {
        savePlace(collectionId, pickerPlace);
      });
    }
    setPickerOpen(false);
    setPickerPlace(null);
  }, [pickerPlace, pickerSelectedIds]);

  const handleCreateNewCollection = useCallback(() => setAddOpen(true), []);

  const handleSubmitNewCollection = useCallback(({ title, description }) => {
    if (!title?.trim()) return;
    addCollection({ title: title.trim(), description: description?.trim() });
    setPickerCollections(recountCollectionCounts());
    // Do NOT auto-add the current place to new collection; user must select and save explicitly.
    setAddOpen(false);
  }, []);

  // Heart/Like functionality
  const handleHeartClick = useCallback((place, e) => {
    e?.stopPropagation(); // Prevent navigation when clicking heart
    
    // Transform recommendation data to place format for favorites
    const placeData = {
      id: place.storeId || place.id,
      name: place.storeName || place.name,
      title: place.storeName || place.name,
      category: place.category,
      tags: place.tags || [],
      desc: place.description || place.desc || '',
      address: place.address ? { full: place.address } : {},
      image: place.image || '/images/tmp.jpg'
    };
    
    setPickerPlace(placeData);
    setPickerCollections(recountCollectionCounts());
    setPickerSelectedIds([]);
    setPickerOpen(true);
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
            {isLoadingHero ? (
              <div className="h-8 flex items-center">
                <div className="text-xs text-gray-400">카테고리를 불러오는 중...</div>
              </div>
            ) : (
              <div className="inline-flex gap-2">
                <FilterTags
                  tags={placeCategories && placeCategories.length ? placeCategories : ["달달한", "분위기가 좋은", "베이커리가 많은", "조용한", "음료가 맛있는"]}
                />
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        {((enrichedRecommendations && enrichedRecommendations.length > 0) || isLoadingRecommendations) && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-3">AI 추천 가게</div>
            
            {isLoadingRecommendations ? (
              <div className="min-h-[200px]">
                <FallbackLoading message="추천 가게를 찾고 있어요..." />
              </div>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {enrichedRecommendations.map((r, idx) => (
                  <div key={idx} className="relative w-[334px] h-[96px]">
                    {/* 상단 구분선 */}
                    <div className="absolute top-0 left-0 w-[334px] h-[2px] bg-[#EAEAEA]" />
                    
                    {/* 메인 컨테이너 (86px 높이) */}
                    <div 
                      className="absolute top-[10px] left-0 w-[334px] h-[86px] cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        if (r.storeId) {
                          navigate(`/place/${r.storeId}`);
                        }
                      }}
                    >
                      {/* Frame 39604 - 메인 콘텐츠 영역 */}
                      <div className="absolute left-[3px] top-[13px] w-[329px] h-[73px] flex justify-between items-center gap-4">
                        
                        {/* 이미지 (Frame 25) */}
                        <div className="flex-none">
                          <div className="w-[114px] h-[73px] bg-gray-200 rounded-[5px] flex items-center justify-center">
                            <span className="text-gray-400 text-xl">🏪</span>
                          </div>
                        </div>
                        
                        {/* Frame 39603 - 텍스트 및 정보 영역 */}
                        <div className="flex-1 flex flex-col gap-[10px] py-[2px] h-[71px]">
                          
                          {/* Frame 39602 - 상단 (제목, 카테고리, 하트) */}
                          <div className="flex justify-between items-center h-4">
                            {/* Frame 39601 - 제목과 카테고리 */}
                            <div className="flex items-center gap-[5px]">
                              <h3 className="text-[13px] font-semibold text-black leading-4 font-pretendard">
                                {r.storeName || r.name || r.storeId || '이름 없음'}
                              </h3>
                              <p className="text-[9px] font-semibold text-[#A2A2A2] leading-[11px] font-pretendard">
                                {r.category || '카페'}
                              </p>
                            </div>
                            
                            {/* 하트 아이콘 */}
                            <button
                              onClick={(e) => handleHeartClick(r, e)}
                              className="flex-none w-[14px] h-[14px] hover:bg-[#FFC5D2]/10 transition-colors flex items-center justify-center rounded-sm"
                            >
                              <Heart 
                                size={14} 
                                className="text-[#FFC5D2] hover:fill-[#FFC5D2]/20"
                                fill="none"
                                strokeWidth={2}
                              />
                            </button>
                          </div>
                          
                          {/* Frame 39599 - 유사도 바와 텍스트 */}
                          <div className="flex items-center gap-[6px] h-3">
                            {/* Group 39608 - 유사도 바 */}
                            <div className="relative w-[73px] h-[5px]">
                              <div className="absolute top-[3.5px] w-[73px] h-[5px] bg-[#D9D9D9] rounded-[5px]" />
                              <div 
                                className="absolute top-[3.5px] h-[5px] bg-[#FFC5D2] rounded-[5px]"
                                style={{ 
                                  width: `${Math.min(
                                    (r.scoreTotal || r.matchScore || 0.8) > 1 
                                      ? (r.scoreTotal || r.matchScore || 0.8) * 73 / 100
                                      : (r.scoreTotal || r.matchScore || 0.8) * 73, 
                                    73
                                  )}px` 
                                }}
                              />
                            </div>
                            
                            {/* 유사도 텍스트 */}
                            <span className="text-[10px] font-semibold text-[#858585] leading-3 font-pretendard">
                              {Math.round(
                                (r.scoreTotal || r.matchScore || 0.8) > 1 
                                  ? (r.scoreTotal || r.matchScore || 0.8)
                                  : (r.scoreTotal || r.matchScore || 0.8) * 100
                              )}% 유사
                            </span>
                          </div>
                          
                          {/* Frame 39600 - 태그들 */}
                          <div className="flex items-center gap-[6px] h-[19px] overflow-hidden">
                            <HomeTags
                              tags={r.tags || []}
                              maxTags={3}
                              gap="gap-[6px]"
                              className="flex-wrap"
                              tagBgClass="bg-[#212842]"
                              tagTextClass="text-[#FFF9ED]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {userRecStores && userRecStores.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">당신을 위한 추천 가게</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {userRecStores.map((s, idx) => (
                <div key={s.id || idx} className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="text-base font-semibold truncate">{s.storeName || s.name || s.title || s.storeId || '이름 없음'}</div>
                  <div className="text-xs text-gray-500">{s.category || ''}</div>
                  { (s.description || s.desc || s.detail) && (
                    <div className="mt-2 text-sm text-gray-700">{s.description || s.desc || s.detail}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 백엔드 연결 에러 표시 */}
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
            {error}
          </div>
        )}
      
      {/* Favorites picker and add modal */}
      <FavoritesPickerSheet
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPickerPlace(null); }}
        collections={pickerCollections}
        selectedIds={pickerSelectedIds}
        onToggle={pickerToggle}
        onCreateNew={handleCreateNewCollection}
        onSave={pickerSave}
        place={pickerPlace}
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
