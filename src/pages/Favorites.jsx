// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { Heart, Plus, Pencil, Trash2, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CollectionCard from "../components/favorites/CollectionCard";
import AddCollectionModal from "../components/favorites/AddCollectionModal";
import CollectionDetail from "../components/favorites/CollectionDetail";
// backend-driven store resolution; dummyData fallback removed

// 기존 로컬 저장소 함수들 (백업용)
import {
  loadCollections as loadLocalCollections,
  recountCollectionCounts as recountLocalCounts,
  togglePlaceInCollection as toggleLocalPlace,
  addCollection as addLocalCollection,
  deleteCollection as deleteLocalCollection,
  loadMapping as loadLocalMapping,
  loadPlace,
  removePlaceFromCollection as removeLocalPlace,
} from "../lib/favoritesStorage";

// 새로운 API 연동 함수들
import {
  loadCollections,
  loadMapping,
  addCollection,
  deleteCollection,
  recountCollectionCounts,
  getCollectionPlaces,
  togglePlaceInCollection,
  removePlaceFromCollection
} from '../lib/favoritesApi.js';


export default function Favorites() {
  const [collections, setCollections] = useState([]);
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

  // 컴포넌트 마운트 시 API에서 컬렉션 로드
  useEffect(() => {
    const initializeCollections = async () => {
      try {
        const apiCollections = await loadCollections();
        setCollections(apiCollections);
      } catch (error) {
        console.error('Failed to load collections from API:', error);
        // API 실패 시 로컬 저장소 사용
        const localCollections = await recountLocalCounts();
        setCollections(localCollections);
      }
    };

    initializeCollections();
  }, []);


  // 새 보석함 생성 + (옵션) 해당 place 자동 추가
  const handleAddCollection = async ({ title, description }) => {
    try {
      const created = await addCollection(title, description);
      const updatedCollections = await loadCollections();
      setCollections(updatedCollections);
      setOpenAdd(false);
      setPendingPlaceId(null);
      navigate("/favorites", { replace: true });
    } catch (error) {
      console.error('Failed to add collection:', error);
      // API 실패 시 로컬 저장소 사용
      const created = addLocalCollection({ title, description });
      setCollections(await recountLocalCounts());
      setOpenAdd(false);
      setPendingPlaceId(null);
      navigate("/favorites", { replace: true });
    }
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
                  onClick={async () => {
                    if (isEditMode) return handleCollectionSelect(c.id);
                    try {
                      const map = loadMapping();
                      const placeIds = Object.entries(map)
                        .filter(([placeId, colIds]) => (colIds || []).includes(c.id))
                        .map(([placeId]) => placeId);

                      const places = await Promise.all(placeIds.map(async pid => {
                        try {
                          const store = await backend.getStoreById(pid);
                          if (store) return store;
                        } catch (err) {
                          // ignore and fallback to cache
                        }
                        const cached = loadPlace(pid);
                        return cached || { id: pid, name: `장소 ${pid}`, category: '알 수 없음' };
                      }));

                      setDetailCollection(c);
                      setDetailPlaces(places.filter(Boolean));
                      setDetailOpen(true);
                    } catch (err) {
                      console.error('Failed to load collection places:', err);
                    }
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
