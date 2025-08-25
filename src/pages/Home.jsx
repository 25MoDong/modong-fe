import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import OnboardingFlow from '../components/Onboarding/OnboardingFlow';
import LocationBar from '../components/home/LocationBar';
import StatusCard from '../components/home/StatusCard';
// removed SectionTitle and PlaceCards per redesign
import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx';
import { loadMapping, saveMapping, addCollection as addLocalCollection, recountCollectionCounts, savePlace } from '../lib/favoritesStorage';
import { loadCollections as apiLoadCollections, addPlaceToCollection, removePlaceFromCollection, loadMapping as apiLoadMapping } from '../lib/favoritesApi';
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
  const [favoritesMap, setFavoritesMap] = useState(() => loadMapping());

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
  const handleSelectPlace = useCallback((place, opts = {}) => {
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
        // Try to reuse cached recommendations to avoid re-running AI every navigation
        let userId = userStore.getUserId();
        if (!userId) {
          try {
            const ud = JSON.parse(localStorage.getItem('user_data') || 'null');
            if (ud && (ud.id || ud.userId)) userId = ud.id || ud.userId;
          } catch (e) { /* ignore */ }
        }

        const cacheKey = `ai_recs_${userId || 'anon'}_${encodeURIComponent(lookupName)}`;
        // If selection originated from the dropdown (hero button), force calling AI recommend each time
        const force = Boolean(opts && opts.fromDropdown);
        if (force) {
          // remove any cached AI recommendations for this lookup so next fetch is fresh
          try {
            // remove the specific cache key
            localStorage.removeItem(cacheKey);
            // also remove any leftover ai_recs_* keys for this user to be safe
            const prefix = `ai_recs_${userId || 'anon'}_`;
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && k.startsWith('ai_recs_') && (k.startsWith(prefix) || prefix === `ai_recs_anon_`)) {
                try { localStorage.removeItem(k); } catch (e) {}
                // adjust index and length aren't necessary since we just continue
              }
            }
          } catch (e) { /* ignore */ }
        }
        if (!force) {
          try {
            const raw = localStorage.getItem(cacheKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              const ttl = 30 * 60 * 1000; // 30 minutes
              if (parsed && parsed.ts && (Date.now() - parsed.ts) < ttl) {
                // Use cached results
                if (parsed.recommendations) setRecommendations(parsed.recommendations);
                if (parsed.placeCategories) setPlaceCategories(parsed.placeCategories);
                if (parsed.enrichedRecommendations) setEnrichedRecommendations(parsed.enrichedRecommendations);
                setIsLoadingRecommendations(false);
                return; // skip API call
              }
            }
          } catch (e) {
            console.warn('Failed to read ai recs cache', e);
          }
        }
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
          // New API expects body { target: string } and userId as query parameter
          // Use the display name as the target
          const res = await aiApi.recommend(userId, String(targetStoreName || lookupName || ''));
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
            // Save raw recommendations to cache (enrichment will save enriched results later)
            try {
              const payload = { ts: Date.now(), recommendations: res.results, placeCategories: Array.isArray(res.targetKeywords) ? res.targetKeywords : [] };
              localStorage.setItem(cacheKey, JSON.stringify(payload));
            } catch (e) { console.warn('Failed to write ai recs cache', e); }
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

  // Enrich recommendations with store details for tags - improved /api/v6/search logic
  useEffect(() => {
    let mounted = true;

    const enrichRecommendations = async () => {
      if (!recommendations || recommendations.length === 0) {
        setEnrichedRecommendations([]);
        setIsLoadingRecommendations(false);
        return;
      }

      console.log('🔄 Starting enrichRecommendations with', recommendations.length, 'items');
      
      try {
        setIsLoadingRecommendations(true);
        const enrichedPromises = recommendations.map(async (rec, index) => {
          console.log(`\n📍 Processing recommendation ${index + 1}/${recommendations.length}:`, {
            storeId: rec.storeId,
            storeName: rec.storeName,
            name: rec.name,
            title: rec.title,
            originalCategory: rec.category
          });

          // Skip enrichment if no identifier available
          if (!rec.storeId && !rec.storeName && !rec.name && !rec.title) {
            console.log('⚠️ Skipping - no identifiable information');
            return { ...rec, tags: rec.tags || ['분위기가 좋은'] };
          }

          try {
            // Enhanced search name prioritization: prefer storeName, fallback to other fields
            const searchCandidates = [
              rec.storeName,
              rec.name, 
              rec.title,
              rec.store,
              rec.storeId
            ].filter(Boolean);
            
            let storeDetail = null;
            let searchedName = '';
            
            // Try searching with each candidate name until we find a match
            for (const searchName of searchCandidates) {
              if (!searchName || typeof searchName !== 'string') continue;
              
              searchedName = searchName.trim();
              if (!searchedName) continue;
              
              console.log(`🔍 Searching with name: "${searchedName}"`);
              
              try {
                const results = await backend.searchStores(searchedName);
                console.log(`📊 Search results for "${searchedName}":`, results?.length || 0, 'items');
                
                if (Array.isArray(results) && results.length > 0) {
                  // Look for exact name match first, then fallback to first result
                  storeDetail = results.find(r => {
                    const candidateNames = [r.storeName, r.name, r.title].filter(Boolean);
                    return candidateNames.some(name => 
                      name && name.toLowerCase() === searchedName.toLowerCase()
                    );
                  }) || results[0];
                  
                  console.log('✅ Found store detail:', {
                    storeId: storeDetail.storeId || storeDetail.id,
                    storeName: storeDetail.storeName || storeDetail.name,
                    category: storeDetail.category || storeDetail.categoryName,
                    hasStoreMood: Boolean(storeDetail.storeMood)
                  });
                  break; // Found a match, stop searching
                }
              } catch (searchError) {
                console.warn(`⚠️ Search failed for "${searchedName}":`, searchError.message);
                continue; // Try next candidate
              }
            }
            
            // Fallback: try getStoreById if we have storeId but search failed
            if (!storeDetail && rec.storeId) {
              console.log(`🔄 Fallback: trying getStoreById(${rec.storeId})`);
              try {
                storeDetail = await backend.getStoreById(rec.storeId);
                console.log('✅ Fallback successful:', storeDetail ? 'Got details' : 'No details');
              } catch (fallbackError) {
                console.warn('⚠️ getStoreById fallback failed:', fallbackError.message);
              }
            }
            
            // Enhanced tag extraction with better storeMood parsing
            let tags = Array.isArray(rec.tags) ? [...rec.tags] : [];
            let resolvedCategory = '';
            let resolvedStoreMood = '';
            
            if (storeDetail) {
              // Extract category from multiple possible fields
              resolvedCategory = storeDetail.category || 
                               storeDetail.categoryName || 
                               storeDetail.cat ||
                               storeDetail.type ||
                               rec.category || '';
              
              resolvedStoreMood = storeDetail.storeMood || 
                                storeDetail.store_mood || 
                                storeDetail.mood || 
                                rec.storeMood || '';
              
              console.log('📊 Store data extracted:', {
                category: resolvedCategory,
                storeMoodLength: resolvedStoreMood?.length || 0,
                storeMoodPreview: resolvedStoreMood ? `"${String(resolvedStoreMood).slice(0, 50)}..."` : 'none'
              });
              
              // Enhanced storeMood parsing with better normalization
              if (resolvedStoreMood) {
                console.log('🏷️ Processing storeMood tags...');
                
                const rawMood = String(resolvedStoreMood);
                // Handle various escape sequences and normalize to consistent newlines
                const normalized = rawMood
                  .replaceAll('\\\\r\\\\n', '\n') // Double-escaped CRLF
                  .replaceAll('\\\\n', '\n')      // Double-escaped LF  
                  .replaceAll('\\r\\n', '\n')     // Single-escaped CRLF
                  .replaceAll('\\n', '\n')        // Single-escaped LF
                  .replace(/\r\n/g, '\n')         // Actual CRLF
                  .replace(/\r/g, '\n')           // Standalone CR
                  .replace(/\n+/g, '\n')          // Multiple newlines to single
                  .trim();
                
                // Split by multiple delimiters and clean up
                const moodTags = normalized
                  .split(/[\n,·•\|\-\/]+/)        // Split on newlines, commas, bullets, pipes, dashes, slashes
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0 && tag.length < 20) // Filter out empty and overly long strings
                  .filter(tag => !/^\d+$/.test(tag)) // Filter out pure numbers
                  .slice(0, 10); // Limit to prevent excessive tags
                
                console.log('🏷️ Parsed storeMood tags:', moodTags);
                tags = [...tags, ...moodTags];
              }
              
              // Enhanced menu-based tag inference
              const mainMenu = storeDetail.mainMenu || storeDetail.menu || '';
              if (tags.length < 2 && mainMenu) {
                console.log('📝 Inferring tags from mainMenu:', mainMenu.slice(0, 100));
                
                const menuItems = String(mainMenu)
                  .split(/[,\n\|\/]/)
                  .map(item => item.trim())
                  .filter(Boolean);
                
                const inferredTags = [];
                const menuText = menuItems.join(' ').toLowerCase();
                
                // More comprehensive menu-based inference
                if (/커피|아메리카노|라떼|에스프레소|카푸치노|마키아토/.test(menuText)) {
                  inferredTags.push('음료가 맛있는');
                }
                if (/케이크|디저트|마카롱|쿠키|타르트|티라미수/.test(menuText)) {
                  inferredTags.push('달달한');
                }
                if (/브런치|샐러드|토스트|샌드위치|에그베네딕트/.test(menuText)) {
                  inferredTags.push('분위기가 좋은');
                }
                if (/파스타|피자|리조또|스테이크/.test(menuText)) {
                  inferredTags.push('맛있는');
                }
                if (/맥주|와인|칵테일/.test(menuText)) {
                  inferredTags.push('분위기 좋은');
                }
                
                console.log('🍽️ Menu-inferred tags:', inferredTags);
                tags = [...tags, ...inferredTags];
              }
            } else {
              // Use original recommendation data if no store detail found
              resolvedCategory = rec.category || '';
              console.log('⚠️ No store detail found, using original data');
            }

            // Category-based tag enhancement
            if (tags.length < 2) {
              console.log('🏪 Adding category-based tags for:', resolvedCategory);
              const categoryTags = [];
              
              if (resolvedCategory.includes('카페') || resolvedCategory.includes('cafe')) {
                categoryTags.push('분위기가 좋은', '조용한');
              }
              if (resolvedCategory.includes('베이커리') || resolvedCategory.includes('bakery')) {
                categoryTags.push('베이커리가 많은', '달달한');
              }
              if (resolvedCategory.includes('레스토랑') || resolvedCategory.includes('restaurant')) {
                categoryTags.push('맛있는', '분위기 좋은');
              }
              if (resolvedCategory.includes('술집') || resolvedCategory.includes('바') || resolvedCategory.includes('bar')) {
                categoryTags.push('분위기 좋은', '특별한');
              }
              
              tags = [...tags, ...categoryTags];
            }

            // Clean up and deduplicate tags
            tags = [...new Set(tags)]
              .filter(tag => tag && tag.length > 0 && tag.length < 15)
              .slice(0, 4); // UI shows max 4 tags

            // Final fallback for empty tags
            if (tags.length === 0) {
              const category = resolvedCategory || '기타';
              console.log('🔧 Adding fallback tags for:', category);
              
              if (category.includes('카페')) {
                tags = ['분위기가 좋은', '조용한'];
              } else if (category.includes('레스토랑')) {
                tags = ['맛있는'];
              } else {
                tags = ['분위기가 좋은'];
              }
            }

            const finalResult = {
              ...rec,
              tags: tags,
              category: resolvedCategory,
              storeMood: resolvedStoreMood,
              storeDetail: storeDetail
            };

            console.log(`✅ Enrichment complete for ${rec.storeName || rec.storeId}:`, {
              finalTags: finalResult.tags,
              hasCategory: Boolean(finalResult.category),
              hasStoreMood: Boolean(finalResult.storeMood),
              scoreTotal: finalResult.scoreTotal
            });

            return finalResult;
            
          } catch (enrichError) {
            console.error(`❌ Enrichment failed for ${rec.storeName || rec.storeId}:`, enrichError);
            
            // Enhanced error fallback with category-aware defaults
            const category = rec.category || '기타';
            let defaultTags = ['분위기가 좋은'];
            
            if (category.includes('카페')) {
              defaultTags = ['분위기가 좋은', '조용한'];
            } else if (category.includes('레스토랑')) {
              defaultTags = ['맛있는', '분위기 좋은'];
            } else if (category.includes('베이커리')) {
              defaultTags = ['달달한', '베이커리가 많은'];
            }
            
            return { 
              ...rec, 
              tags: defaultTags,
              category: category,
              enrichmentError: enrichError.message 
            };
          }
        });

        console.log('⏳ Waiting for all enrichment promises...');
        const enrichedResults = await Promise.all(enrichedPromises);
        
        if (mounted) {
          console.log('✅ All recommendations enriched successfully:', enrichedResults.length);
          setEnrichedRecommendations(enrichedResults);
          setIsLoadingRecommendations(false);
          
          // Enhanced caching with error tracking
          try {
            let userId = userStore.getUserId();
            if (!userId) {
              try { 
                const ud = JSON.parse(localStorage.getItem('user_data') || 'null'); 
                if (ud && (ud.id || ud.userId)) userId = ud.id || ud.userId; 
              } catch(e) {
                console.warn('Failed to parse user data for caching');
              }
            }
            const key = `ai_recs_${userId || 'anon'}_${encodeURIComponent(selectedPlace || 'default')}`;
            const payload = { 
              ts: Date.now(), 
              recommendations: recommendations, 
              enrichedRecommendations: enrichedResults, 
              placeCategories: placeCategories,
              enrichmentVersion: '2.0' // Track version for cache invalidation if needed
            };
            localStorage.setItem(key, JSON.stringify(payload));
            console.log('💾 Cached enriched recommendations');
          } catch (cacheError) { 
            console.warn('⚠️ Failed to cache enriched recommendations:', cacheError); 
          }
        }
      } catch (globalError) {
        console.error('💥 Global enrichment error:', globalError);
        if (mounted) {
          // Provide basic fallback data
          setEnrichedRecommendations(recommendations.map(rec => ({ 
            ...rec, 
            tags: rec.tags || ['분위기가 좋은'],
            category: rec.category || '',
            enrichmentError: 'Global enrichment failed'
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
    (async () => {
      if (!pickerPlace) {
        setPickerOpen(false);
        return;
      }

      // current mapping before changes
      const map = loadMapping();
      const before = new Set(map[String(pickerPlace.id)] || []);
      const after = new Set(pickerSelectedIds || []);

      // additions
      for (const cid of after) {
        if (!before.has(cid)) {
          try {
            await addPlaceToCollection(String(pickerPlace.id), cid);
          } catch (err) {
            console.warn('Failed to add place to collection via API', err);
            // fallback: update local cache
            const localCreated = null;
          }
        }
      }

      // removals
      for (const cid of before) {
        if (!after.has(cid)) {
          try {
            await removePlaceFromCollection(String(pickerPlace.id), cid);
          } catch (err) {
            console.warn('Failed to remove place from collection via API', err);
          }
        }
      }

      // Update local mapping cache to reflect the current selection
      const newMap = loadMapping();
      newMap[String(pickerPlace.id)] = Array.from(after);
      try { saveMapping(newMap); } catch (e) {}
      // update local state for immediate UI reflection
      setFavoritesMap(newMap);

      // save place cache for quick lookup
      try { savePlace(pickerPlace); } catch (e) {}

      // refresh local collection counts
      setPickerCollections(recountCollectionCounts());
      setPickerOpen(false);
      setPickerPlace(null);
    })();
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
  // Helper to resolve a stable place id for recommendation items
  const resolvePlaceId = (item) => {
    return item?.storeId || item?.id || item?.placeId || item?.storeDetail?.storeId || item?.storeDetail?.id || null;
  };

  const handleHeartClick = useCallback(async (place, e) => {
    console.log('Home: heart click', place && (place.storeId || place.id || place.storeName));
    e?.stopPropagation(); // Prevent navigation when clicking heart

    const placeId = resolvePlaceId(place);
    if (!placeId) return; // nothing to do for items without stable id

    // If currently favorited somewhere, remove from all collections (toggle off)
    const currentMap = loadMapping();
    const existing = Array.isArray(currentMap[String(placeId)]) ? currentMap[String(placeId)] : [];
    if (existing.length > 0) {
      // optimistic UI: remove locally first so user sees immediate feedback
      const newMap = { ...currentMap };
      delete newMap[String(placeId)];
      try { saveMapping(newMap); } catch (e) {}
      setFavoritesMap(newMap);
      setPickerCollections(recountCollectionCounts());

      // remove from each jtId on the server; if any removal fails, attempt to refresh mapping
      try {
        for (const jtId of existing) {
          await removePlaceFromCollection(String(placeId), jtId);
        }
      } catch (err) {
        console.warn('Failed to remove place from collection via API (home heart):', err);
        // try to reload mapping from backend to reconcile state
        try {
          const remoteMap = await (await import('../lib/favoritesApi')).loadMapping();
          // remoteMap is { placeId: [jtId,...] }
          try { saveMapping(remoteMap); } catch (e) {}
          setFavoritesMap(remoteMap);
        } catch (err2) {
          console.warn('Failed to refresh mapping after remove failure', err2);
        }
      }

      return;
    }

    // Otherwise open picker to add
    const placeData = {
      id: placeId,
      name: place.storeName || place.name,
      title: place.storeName || place.name,
      category: place.category,
      tags: place.tags || [],
      desc: place.description || place.desc || '',
      address: place.address ? { full: place.address } : {},
      image: place.image || '/images/tmp.jpg'
    };

    setPickerPlace(placeData);

    // Load user's collections from API (preferred) and fallback to local
    try {
      const cols = await apiLoadCollections();
      setPickerCollections(cols);
    } catch (err) {
      console.warn('Failed to load collections from API in Home picker', err);
      setPickerCollections(recountCollectionCounts());
    }

    // Preselect collections that already contain this place
    try {
      const map = loadMapping();
      const existing2 = map[String(placeId)] || [];
      setPickerSelectedIds(existing2);
    } catch (err) {
      setPickerSelectedIds([]);
    }

    setPickerOpen(true);
  }, []);

  // Navigate to place detail safely: resolve id and coordinates if missing
  const handleNavigateToPlace = useCallback(async (rec) => {
    try {
      const possibleId = rec.storeId || rec.id || rec.placeId || rec.storeDetail?.id || rec.storeDetail?.storeId || '';

      // Normalize coordinates from several possible shapes
      const coords = rec.coordinates || rec.coord || rec.location || rec.storeDetail?.coordinates || rec.storeDetail?.location || (
        rec.storeDetail && rec.storeDetail.lat && rec.storeDetail.lng ? { lat: rec.storeDetail.lat, lng: rec.storeDetail.lng } : undefined
      );

      const placeForNav = { ...rec, coordinates: coords };

      let placeId = possibleId;
      // If no id, try to lookup by name using backend.searchStores
      if (!placeId) {
        const name = rec.storeName || rec.name || rec.title || rec.label || '';
        if (name) {
          try {
            const results = await backend.searchStores(name);
            if (Array.isArray(results) && results.length > 0) {
              const first = results[0];
              placeId = first.storeId || first.id || '';
              // merge coordinates if available
              if (!placeForNav.coordinates && first.coordinates) placeForNav.coordinates = first.coordinates;
            }
          } catch (e) {
            console.warn('searchStores failed while resolving place id', e);
          }
        }
      }

      if (!placeId) {
        console.warn('Unable to resolve place id for navigation', rec);
        return;
      }

      navigate(`/place/${placeId}`, { state: { place: placeForNav, from: 'home' } });
    } catch (e) {
      console.error('Failed to navigate to place detail', e);
    }
  }, [navigate]);

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

  // Load mapping from backend on mount so hearts reflect server state
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // apiLoadMapping may be heavy; it returns { placeId: [jtId,...] }
        const remote = await apiLoadMapping();
        if (!mounted) return;
        if (remote && typeof remote === 'object') {
          try { saveMapping(remote); } catch (e) {}
          setFavoritesMap(remote);
        }
      } catch (err) {
        // ignore - fallback to local mapping already present
        console.warn('Failed to load remote favorites mapping on Home mount', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
                        notifyParentWithOpts={true}
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
                      onClick={() => handleNavigateToPlace(r)}
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
                                {(r.category || r.storeDetail?.category) || ''}
                              </p>
                            </div>
                            
                            {/* 하트 아이콘 */}
                            <button
                              type="button"
                              onClick={(e) => handleHeartClick(r, e)}
                              aria-label="찜하기"
                              className="flex-none w-[28px] h-[28px] p-1 hover:bg-[#FFC5D2]/10 transition-colors flex items-center justify-center rounded-full z-10"
                            >
                              {(() => {
                                const pid = r.storeId || r.id;
                                const isFav = Boolean((favoritesMap && favoritesMap[String(pid)] || []).length);
                                return (
                                  <Heart
                                    size={14}
                                    className="text-[#FFC5D2]"
                                    fill={isFav ? '#FFC5D2' : 'none'}
                                    strokeWidth={2}
                                  />
                                );
                              })()}
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
