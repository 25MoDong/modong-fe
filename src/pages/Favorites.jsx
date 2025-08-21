// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { Heart, Plus, Pencil } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CollectionCard from "../components/favorites/CollectionCard";
import AddCollectionModal from "../components/favorites/AddCollectionModal";

// storage 유틸 불러오기 (이름 겹치지 않도록 alias)
import {
  loadCollections,
  recountCollectionCounts,
  togglePlaceInCollection,
  addCollection as addCollectionStorage,
} from "../lib/favoritesStorage";

export default function Favorites() {
  const [collections, setCollections] = useState(() => recountCollectionCounts());
  const [openAdd, setOpenAdd] = useState(false);
  const [pendingPlaceId, setPendingPlaceId] = useState(null); // 상세에서 넘어온 placeId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 쿼리로 들어오면 모달 자동 오픈
  useEffect(() => {
    const needCreate = searchParams.get("create") === "1";
    const pid = Number(searchParams.get("placeId"));
    if (needCreate) {
      if (!Number.isNaN(pid)) setPendingPlaceId(pid);
      setOpenAdd(true);
    }
  }, [searchParams]);

  // 초기에 localStorage 동기화(혹시 모를 mismatch 보정)
  useEffect(() => {
    setCollections(recountCollectionCounts());
  }, []);

  // 새 보석함 생성 + (옵션) 해당 place 자동 추가
  const handleAddCollection = ({ title, description }) => {
    const created = addCollectionStorage({ title, description }); // 로컬에 생성
    if (pendingPlaceId) {
      togglePlaceInCollection(created.id, pendingPlaceId);       // 새 보석함에 장소 담기
    }
    setCollections(recountCollectionCounts());                   // 카운트 갱신
    setOpenAdd(false);
    setPendingPlaceId(null);
    navigate("/favorites", { replace: true });                   // 쿼리 제거 (새로고침해도 모달 안뜸)
  };

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* 상단 네이비 헤더 */}
      <header className="bg-[#1B2340] h-36 rounded-b-2xl flex items-center justify-center text-white">
        <div className="w-full px-5">
          <h1 className="text-[18px] font-semibold text-center">내가 찜한 돌멩이 보석함</h1>
        </div>
      </header>

      {/* 상단 액션 영역 */}
      <div className="-mt-4 rounded-t-2xl bg-white px-5 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            <Heart size={14} className="text-[#3C4462]" />
            찜 기반 추천받기
          </button>
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            <Pencil size={14} />
            편집
          </button>
          <button
            onClick={() => { setPendingPlaceId(null); setOpenAdd(true); }} // 찜 화면에서 직접 추가
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
          >
            <Plus size={14} />
            추가
          </button>
        </div>
      </div>

      {/* 보석함 그리드 */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {collections.map((c, index) => (
            <div
              key={c.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CollectionCard
                title={c.title}
                count={c.count}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 새 보석함 추가 모달 */}
      <AddCollectionModal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setPendingPlaceId(null);
          navigate("/favorites", { replace: true });
        }}
        onSubmit={handleAddCollection}
      />
    </div>
  );
}
