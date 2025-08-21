import { useState } from "react";
import { Heart, Plus, Pencil } from "lucide-react";
import CollectionCard from "../components/favorites/CollectionCard";
import AddCollectionModal from "../components/favorites/AddCollectionModal";

export default function Favorites() {
  // 초기 더미 데이터 (이름/카운트)
  const [collections, setCollections] = useState([
    { id: 1, title: "카공하기 좋은 곳", count: 3 },
    { id: 2, title: "빙수 맛있는 곳", count: 2 },
    { id: 3, title: "카공하기 좋은 곳", count: 0 },
    { id: 4, title: "빙수 맛있는 곳", count: 0 },
  ]);

  const [openAdd, setOpenAdd] = useState(false);

  const addCollection = ({ title, description }) => {
    setCollections((prev) => [
      ...prev,
      { id: Date.now(), title, description, count: 0 },
    ]);
    setOpenAdd(false);
  };

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* 상단 네이비 헤더 */}
      <header className="bg-[#1B2340] h-36 rounded-b-2xl flex items-center justify-center text-white">
        <div className="w-full px-5">
          <h1 className="text-[18px] font-semibold text-center">
            내가 찜한 돌멩이 보석함
          </h1>
        </div>
      </header>

      {/* 상단 액션 영역 */}
      <div className="-mt-4 rounded-t-2xl bg-white px-5 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            <Heart size={14} className="text-[#3C4462]" />
            찜 기반 추천받기
          </button>

          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            <Pencil size={14} />
            편집
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
        onClose={() => setOpenAdd(false)}
        onSubmit={addCollection}
      />
    </div>
  );
}
