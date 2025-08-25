import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { calculateDistance, formatDistance } from '../lib/mapUtils';
import { getStoreById } from '../lib/storeApi';
import { getStoreReviews } from '../lib/reviewApi';

import BackBar from '../components/place/BackBar.jsx';
import ReviewCard from '../components/place/ReviewCard.jsx';
import FilterTags from '../components/common/FilterTags.jsx';
import MenuSkeleton from '../components/place/MenuSkeleton.jsx';

import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx'; // ✅ 모달 임포트
import {
  loadCollections, recountCollectionCounts,
  loadMapping, togglePlaceInCollection, addCollection, loadPlace, savePlace
} from '../lib/favoritesStorage.js';

const MOCK = {
  name: '카페 기웃기웃',
  distance: '내 위치에서 234m',
  tags: ['달달한', '메뉴가 다양한', '조용한'],
  desc:
    '이 가게는 회원님의 취향인 분위기와 달달한 맛에 적합하며 최애 장소로 입력해 주신 밀리커피와 메뉴가 다양하다는 공통점이 있습니다.',
  menu: ['바나나 푸딩', '아메리카노', '바나나라떼', '바나나브레드', '바나나쉐이크'],
  reviews: [
    { id: 1, title: '장꾸 돌멩이', badges: ['맛있는', '내부좌석 편안', '조용함'], text: '사장님이 친절하고 커피가 맛있어요' },
    { id: 2, title: '장꾸 돌멩이', badges: ['맛있는', '내부좌석 편안', '조용함'], text: '사장님이 친절하고 커피가 맛있어요' },
    { id: 3, title: '장꾸 돌멩이', badges: ['맛있는', '내부좌석 편안', '조용함'], text: '사장님이 친절하고 커피가 맛있어요' },
  ],
};

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const placeId = useMemo(() => String(id || 'demo-1'), [id]);

  // 바텀시트 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [collections, setCollections] = useState(() => loadCollections());
  const [selected, setSelected] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [distanceText, setDistanceText] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const location = useLocation();

  // 현재 placeId가 포함된 보석함 미리 체크
  useEffect(() => {
    const m = loadMapping();
    setSelected(m[placeId] || []);
  }, [placeId]);

  // 어디서 넘어왔는지 판단: 명시된 from 값을 우선 사용
  const isFromHome = location.state?.from === 'home';
  const isFromMap = location.state?.from === 'map';

  // Prefer place passed via navigation state (faster, accurate), otherwise load cached place
  useEffect(() => {
    const navPlace = location.state?.place;
    if (navPlace) {
      setPlace(navPlace);
      try { savePlace(navPlace); } catch (e) {}

      // If navigated from map, compute distance using geolocation and persist last known location
      try {
        if (navPlace.coordinates && navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            try {
              const userCoord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              // save for other callers
              try { window.localStorage.setItem('last_known_location', JSON.stringify(userCoord)); } catch (e) {}
              const km = calculateDistance(navPlace.coordinates, userCoord);
              const txt = formatDistance(km) + ' 이내';
              setDistanceText(txt);
            } catch (e) {
              setDistanceText('');
            }
          }, (err) => {
            setDistanceText('');
          }, { maximumAge: 60000, timeout: 2000 });
        }
      } catch (e) {}

      return;
    }

    const fetchPlace = async () => {
      const cached = loadPlace(placeId);
      if (cached) { setPlace(cached); }
      try {
        const data = await getStoreById(placeId);
        if (data) {
          // 좌표는 네비게이션 state가 가진 값이 더 정확할 수 있음. 병합 유지.
          const merged = { ...data, coordinates: data.coordinates || cached?.coordinates || location.state?.place?.coordinates };
          setPlace(merged);
          try { savePlace(merged); } catch (e) { }
        } else if (!cached) {
          setPlace(null);
        }
      } catch (err) {
        console.error('Failed to fetch place details', err);
        if (!cached) setPlace(null);
      }
    };

    fetchPlace();
  }, [placeId, location.state]);

  // Ensure distance is computed whenever place coordinates become available
  useEffect(() => {
    let mounted = true;
    if (!place?.coordinates) return;
    try {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          if (!mounted) return;
          try {
            const userCoord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            try { window.localStorage.setItem('last_known_location', JSON.stringify(userCoord)); } catch (e) {}
            const km = calculateDistance(place.coordinates, userCoord);
            const txt = formatDistance(km) + ' 이내';
            setDistanceText(txt);
          } catch (e) {
            setDistanceText('');
          }
        }, (err) => {
          if (!mounted) return;
          setDistanceText('');
        }, { maximumAge: 60000, timeout: 2000 });
      }
    } catch (e) {
      if (mounted) setDistanceText('');
    }
    return () => { mounted = false; };
  }, [place?.coordinates]);

  // 상세에서 항상 리뷰 데이터 가져오기
  useEffect(() => {
    if (place?.id || place?.storeId) {
      const fetchReviews = async () => {
        try {
          setLoadingReviews(true);
          const storeId = place.storeId || place.id;
          const reviewsData = await getStoreReviews(storeId);
          const reviewArray = Array.isArray(reviewsData) ? reviewsData : [];
          setReviews(reviewArray);
          setReviewCount(reviewArray.length);
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
          setReviews([]);
          setReviewCount(0);
        } finally {
          setLoadingReviews(false);
        }
      };
      
      fetchReviews();
    }
  }, [place?.id, place?.storeId]);

  const toggleSelect = (cid) =>
    setSelected(prev => prev.includes(cid) ? prev.filter(v => v !== cid) : [...prev, cid]);

  const handleSaveFavorites = () => {
    // 선택된 보석함들로 동기화(간단 토글 방식)
    const before = new Set(loadMapping()[placeId] || []);
    const after  = new Set(selected);

    // 제거
    before.forEach(cid => { if (!after.has(cid)) togglePlaceInCollection(placeId, cid); });
    // 추가
    after.forEach(cid => { if (!before.has(cid)) togglePlaceInCollection(placeId, cid); });

    setCollections(recountCollectionCounts()); // 카운트 재계산
    setSheetOpen(false);
  };

  // 바텀시트에서 "새 보석함" 클릭 → 모달 열기
  const handleCreateNew = () => setAddOpen(true);

  // 모달에서 "추가하기" 제출 → 보석함 생성 + 현재 가게 자동담기 + 체크 반영
  const handleSubmitNewCollection = ({ title, description }) => {
    if (!title?.trim()) return;
    addCollection({ title: title.trim(), description: description?.trim() });
    // Do NOT automatically add the current place to the new collection; user must select and save explicitly.
    setCollections(recountCollectionCounts());
    setAddOpen(false);
  };


  // 가로 휠 스크롤 핸들러
  const toHorizontal = (ref) => (e) => {
    if (!ref.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  };
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        {/* 상단 이미지 영역 (하트 없음) */}
        <div className="relative z-0 h-[120px] w-full bg-gray-200 flex-shrink-0 overflow-hidden">
          <BackBar />
          {place?.image && (
            <img 
              src={place.image} 
              alt={place?.name || "장소 이미지"} 
              className="absolute inset-0 w-full h-full object-cover z-[-1]" 
              onError={(e) => e.target.style.display = "none"} 
            />
          )}        </div>

        {/* 흰 컨테이너 - 스크롤 가능 */}
        <div className="relative -mt-5 rounded-t-[28px] bg-white overflow-hidden shadow-[0_-8px_24px_rgba(0,0,0,0.06)] flex-1 overflow-y-auto hide-scrollbar pb-24" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        {/* 태그 */}
        <div className="px-5 pt-4">
          <FilterTags 
            tags={(place?.tags && Array.isArray(place.tags) ? place.tags.map(t => (typeof t === 'string' ? t : (t?.name || t?.label || ''))).filter(Boolean) : MOCK.tags)} 
            selectedTag={null}
            onTagSelect={(tag) => console.log('Selected tag:', tag)}
          />
        </div>

        {/* 타이틀 + 아이콘 (오른쪽: 지도, 하트 순서) */}
        <div className="px-5 mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1B2340]">{(place?.name || place?.title || MOCK.name)}</h1>
            <p className="mt-1 text-[12px] text-gray-600">{distanceText || place?.address?.full || MOCK.distance}</p>
          </div>
          <div className="flex gap-3">
            <button
              aria-label="지도"
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-[#1B2340]"
            >
              <MapPin size={18} />
            </button>
            <button
              aria-label="찜"
              onClick={() => setSheetOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-[#1B2340]"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* 설명 - 어디서 왔는지에 따라 다른 내용 표시 */}
        <div className="px-5 mt-3 pb-4 border-b border-gray-100">
          {isFromHome ? (
            // 홈에서 넘어온 경우: desc + 유사도 표시
            <p className="text-[13px] leading-5 text-gray-700">
              {place?.desc || place?.description || MOCK.desc}
            </p>
          ) : isFromMap ? (
            // 지도에서 넘어온 경우: 후기 개수 설명 표시  
            <p className="text-[13px] leading-5 text-gray-700">
              내 주변 돌멩이 수집가들 <span className="text-secondary-700">{reviewCount}명</span>이 방문해서 후기를 남겼어요.
            </p>
          ) : (
            // 기본값
            <p className="text-[13px] leading-5 text-gray-700">
              {place?.desc || place?.description || MOCK.desc}
            </p>
          )}
        </div>

        {/* 메뉴 (가로 스크롤) */}
        <section className="px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[#1B2340]">메뉴</h2>
          <div
            ref={menuRef}
            onWheel={toHorizontal(menuRef)}
            className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 snap-x snap-mandatory"
          >
            {(() => {
              // mainMenu를 파싱해서 배열로 만들기
              let menuItems = [];
              if (place?.mainMenu) {
                // mainMenu가 문자열인 경우 콤마나 줄바꿈으로 분리
                if (typeof place.mainMenu === 'string') {
                  menuItems = place.mainMenu.split(/,|\n/).map(item => item.trim()).filter(Boolean);
                } else if (Array.isArray(place.mainMenu)) {
                  menuItems = place.mainMenu;
                }
              }
              
              // 기본값 사용 (빈 배열인 경우)
              if (menuItems.length === 0) {
                menuItems = MOCK.menu;
              }

              return menuItems.map((m, i) => (
                <div key={i} className="snap-start shrink-0">
                  <MenuSkeleton label={m} />
                </div>
              ));
            })()}
          </div>
        </section>

        {/* 후기 (가로 스크롤) */}
        <section className="px-5 pb-6">
          <h2 className="text-[16px] font-semibold text-[#1B2340]">내 주변 돌멩이 수집가들의 후기</h2>
          {loadingReviews ? (
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {/* 로딩 스켈레톤 */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-[168px] shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-4 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-10 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="mt-3 h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div
              ref={reviewsRef}
              onWheel={toHorizontal(reviewsRef)}
              className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5"
            >
              {reviews.map((review, index) => (
                <ReviewCard 
                  key={review.id || index}
                  title={review.userId || '익명 사용자'}
                  badges={['후기']} // API에서 뱃지 정보가 없으므로 기본값
                  text={review.review || review.content || '리뷰 내용이 없습니다'}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center h-24 text-gray-500 text-sm">
              아직 등록된 후기가 없습니다
            </div>
          )}
        </section>
        </div>

        {/* 바텀시트 (보석함 선택) */}
      <FavoritesPickerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        collections={collections}
        selectedIds={selected}
        onToggle={toggleSelect}
        onCreateNew={handleCreateNew}        //  새 보석함 → 모달 오픈
        onSave={handleSaveFavorites}
      />

      {/* 새 보석함 모달 (팝업) — 디자인 스샷처럼 오버레이로 뜸 */}
      <AddCollectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleSubmitNewCollection} // 보석함 생성 + 현재 가게 자동 저장
      />
      </div>
    </>
  );
}
