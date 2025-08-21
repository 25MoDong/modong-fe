import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { useRef, useMemo, useState, useEffect } from 'react';

import BackBar from '../components/place/BackBar.jsx';
import TagPills from '../components/common/TagPills.jsx';
import ReviewCard from '../components/place/ReviewCard.jsx';
import MenuSkeleton from '../components/place/MenuSkeleton.jsx';

import FavoritesPickerSheet from '../components/favorites/FavoritesPickerSheet.jsx';
import AddCollectionModal from '../components/favorites/AddCollectionModal.jsx'; // ✅ 모달 임포트
import {
  loadCollections, recountCollectionCounts,
  loadMapping, togglePlaceInCollection, addCollection
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

  // 현재 placeId가 포함된 보석함 미리 체크
  useEffect(() => {
    const m = loadMapping();
    setSelected(m[placeId] || []);
  }, [placeId]);

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
    const newC = addCollection({ title: title.trim(), description: description?.trim() });

    // 방금 만든 보석함에 현재 place 담기
    togglePlaceInCollection(placeId, newC.id);

    // 체크 상태/카운트 갱신
    setSelected(prev => (prev.includes(newC.id) ? prev : [...prev, newC.id]));
    setCollections(recountCollectionCounts());

    // 모달만 닫고(시트는 열어둬도 됨)
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
    <div className="min-h-screen bg-white">
      {/* 상단 이미지 영역 (하트 없음) */}
      <div className="relative z-0 h-[120px] w-full bg-gray-200">
        <BackBar title="가게 사진" />
      </div>

      {/* 흰 컨테이너 */}
      <div className="relative -mt-5 rounded-t-[28px] bg-white overflow-hidden shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        {/* 태그 */}
        <div className="px-5 pt-4">
          <TagPills tags={MOCK.tags} variant="outline-navy" />
        </div>

        {/* 타이틀 + 아이콘 (오른쪽: 지도, 하트 순서) */}
        <div className="px-5 mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1B2340]">{MOCK.name}</h1>
            <p className="mt-1 text-[12px] text-gray-600">{MOCK.distance}</p>
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

        {/* 설명 */}
        <div className="px-5 mt-3 pb-4 border-b border-gray-100">
          <p className="text-[13px] leading-5 text-gray-700">
            이 가게는 회원님의 취향인 <span className="text-[#E9A94A]">분위기</span>와
            <span className="text-[#E9A94A]"> 달달한</span> 맛에 적합하며 최애 장소로 입력해 주신
            <span className="text-[#E9A94A]"> 밀리커피</span>와 메뉴가 다양하다는 공통점이 있습니다.
          </p>
        </div>

        {/* 메뉴 (가로 스크롤) */}
        <section className="px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[#1B2340]">메뉴</h2>
          <div
            ref={menuRef}
            onWheel={toHorizontal(menuRef)}
            className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 snap-x snap-mandatory"
          >
            {MOCK.menu.map((m, i) => (
              <div key={i} className="snap-start shrink-0">
                <MenuSkeleton label={m} />
              </div>
            ))}
          </div>
        </section>

        {/* 후기 (가로 스크롤) */}
        <section className="px-5 pb-6">
          <h2 className="text-[16px] font-semibold text-[#1B2340]">내 주변 돌멩이 수집가들의 후기</h2>
          <div
            ref={reviewsRef}
            onWheel={toHorizontal(reviewsRef)}
            className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5"
          >
            {MOCK.reviews.map(r => (
              <ReviewCard key={r.id} title={r.title} badges={r.badges} text={r.text} />
            ))}
          </div>
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
  );
}
