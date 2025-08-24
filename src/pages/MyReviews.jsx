import { useEffect, useState } from 'react';
import userStore from '../lib/userStore';
import api from '../lib/axios';

function normalizeReview(r) {
  // 가능한 키들을 정규화
  const place = r.storeName || r.placeName || r.storeId || '알 수 없는 장소';
  const rating = r.rating ?? r.score;
  const content = r.review ?? r.content ?? r.text ?? '';
  const createdAt = r.createdAt || r.date || r.updatedAt || '';
  return { place, rating, content, createdAt, raw: r };
}

export default function MyReviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = userStore.getUserId();
        if (!userId) {
          setItems([]);
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }
        const res = await api.get(`/api/v2/userReview/${encodeURIComponent(userId)}`);
        const data = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setItems(data.map(normalizeReview));
      } catch (e) {
        setError('리뷰를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="w-full max-w-[390px] mx-auto bg-white rounded-[50px] min-h-screen overflow-hidden flex flex-col">
      <div className="pt-12 pb-2 text-center text-black font-semibold text-2xl">내가 쓴 후기</div>
      <div className="border-t" />
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="text-center text-gray-500 py-10">불러오는 중...</div>
        )}
        {!loading && error && (
          <div className="text-center text-red-500 py-10">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="text-center text-gray-500 py-10">작성한 후기가 없어요.</div>
        )}
        {!loading && !error && items.length > 0 && (
          <ul>
            {items.map((it, idx) => (
              <li key={idx} className="bg-white border border-[#B5B5B5] shadow-sm rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-black font-semibold text-base truncate">{it.place}</div>
                    {it.rating != null && (
                      <div className="text-[#6A6F82] font-medium text-sm mt-1">평점: {it.rating}</div>
                    )}
                    <div className="text-gray-700 text-sm mt-2 whitespace-pre-line">{it.content}</div>
                  </div>
                  <div className="text-gray-400 text-xs shrink-0 ml-2">{it.createdAt}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

