// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { Heart, Plus, Pencil, Trash2, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CollectionCard from "../components/favorites/CollectionCard";
import AddCollectionModal from "../components/favorites/AddCollectionModal";
import CollectionDetail from "../components/favorites/CollectionDetail";
import { dummyPlaces } from '../lib/dummyData';

// storage 유틸 불러오기 (이름 겹치지 않도록 alias)
import {
  loadCollections,
  recountCollectionCounts,
  togglePlaceInCollection,
  addCollection as addCollectionStorage,
  deleteCollection,
  loadMapping,
  loadPlace,
  removePlaceFromCollection,
} from "../lib/favoritesStorage";


export default function Favorites() {
  const [collections, setCollections] = useState(() => recountCollectionCounts());
  const [openAdd, setOpenAdd] = useState(false);
  const [pendingPlaceId, setPendingPlaceId] = useState(null); // 상세에서 넘어온 placeId
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
  const [selectedCollections, setSelectedCollections] = useState([]); // 선택된 보석함들
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCollection, setDetailCollection] = useState(null);
  const [detailPlaces, setDetailPlaces] = useState([]);
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
    // Do not auto-add pending place. Keep behavior consistent: user must select and save explicitly.
    setCollections(recountCollectionCounts());                   // 카운트 갱신
    setOpenAdd(false);
    setPendingPlaceId(null);
    navigate("/favorites", { replace: true });                   // 쿼리 제거 (새로고침해도 모달 안뜸)
  };

  // 편집 모드 토글
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setSelectedCollections([]); // 편집 모드 전환 시 선택 초기화
  };

  // 보석함 선택/해제
  const handleCollectionSelect = (collectionId) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // 선택된 보석함들 삭제
  const handleDeleteSelected = () => {
    if (selectedCollections.length === 0) return;
    setShowDeleteModal(true);
  };

  // 삭제 확인
  const confirmDelete = () => {
    selectedCollections.forEach(collectionId => {
      deleteCollection(collectionId);
    });
    setCollections(recountCollectionCounts());
    setSelectedCollections([]);
    setIsEditMode(false);
    setShowDeleteModal(false);
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // 장소 삭제 후 컬렉션 상태 업데이트
  const handlePlacesUpdate = (updatedPlaces) => {
    setDetailPlaces(updatedPlaces);
    // 컬렉션 카운트도 다시 계산
    setCollections(recountCollectionCounts());
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
          {!isEditMode ? (
            <>
              <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                <Heart size={14} className="text-[#3C4462]" />
                찜 기반 추천받기
              </button>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <Pencil size={14} />
                  편집
                </button>
                <button
                  onClick={() => { setPendingPlaceId(null); setOpenAdd(true); }}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <Plus size={14} />
                  추가
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-700">
                {selectedCollections.length}개 선택됨
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedCollections.length === 0}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCollections.length > 0
                      ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 size={14} />
                  삭제
                </button>
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <X size={14} />
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 보석함 그리드 */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {collections.map((c, index) => (
            <div
              key={c.id}
              className="animate-fadeIn relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`relative ${isEditMode ? 'cursor-pointer' : ''}`}>
                {/* 편집 모드일 때 체크박스 표시 */}
                {isEditMode && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedCollections.includes(c.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}>
                      {selectedCollections.includes(c.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                <CollectionCard
                  title={c.title}
                  count={c.count}
                  onClick={() => {
                    if (isEditMode) return handleCollectionSelect(c.id);
                    const map = loadMapping();
                    const placeIds = Object.entries(map)
                      .filter(([placeId, colIds]) => (colIds || []).includes(c.id))
                      .map(([placeId]) => placeId);
                    // Resolve place objects: check dummyPlaces first, then saved place cache
                    const places = placeIds.map(pid => {
                      const numericId = Number(pid);
                      const fromDummy = dummyPlaces.find(p => p.id === numericId);
                      if (fromDummy) return fromDummy;
                      // fallback to cached place object
                      const cached = loadPlace(numericId);
                      return cached;
                    }).filter(Boolean);
                    setDetailCollection(c);
                    setDetailPlaces(places);
                    setDetailOpen(true);
                  }}
                  className={selectedCollections.includes(c.id) ? 'ring-2 ring-blue-500' : ''}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CollectionDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        collection={detailCollection}
        places={detailPlaces}
        onPlacesUpdate={handlePlacesUpdate}
      />

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

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-[350px] rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">보석함 삭제</h3>
              <p className="text-sm text-gray-600">
                선택한 {selectedCollections.length}개의 보석함을 삭제하시겠습니까?
              </p>
              <p className="text-xs text-red-500 mt-2">
                삭제된 보석함과 저장된 모든 장소 정보는 복구할 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-4 bg-red-500 rounded-md text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
