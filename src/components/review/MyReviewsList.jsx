import { useState, useEffect } from 'react';
import userStore from '../../lib/userStore';
import { Star, MapPin, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { getMyReviews, deleteReview } from '../../lib/reviewApi';

const MyReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // 후기 목록 가져오기
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        // 현재 선택된 사용자 ID를 사용 (온보딩에서 선택되어 있어야 함)
        const userId = userStore.getUserId();
        if (!userId) throw new Error('No user selected');

        const response = await getMyReviews(userId);
        
        // API 응답을 컴포넌트에서 사용할 형식으로 변환
        const formattedReviews = Array.isArray(response) ? response.map(review => ({
          id: review.reviewId || review.id,
          placeId: review.storeId,
          placeName: review.storeName || `장소 ${review.storeId}`,
          placeCategory: review.category || '',
          rating: review.rating || 5.0,
          reviewText: review.content || review.review || review.reviewText,
          categories: review.tags ? review.tags.split(',') : ['맛있는'],
          images: review.images || [],
          createdAt: review.createdAt || new Date().toISOString(),
          updatedAt: review.updatedAt || new Date().toISOString()
        })) : [];
        
        setReviews(formattedReviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        // API 실패 시 더미 데이터 사용
        setReviews(getDummyReviews());
        setError('후기를 불러오는데 실패했습니다. 더미 데이터를 표시합니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  // 더미 데이터 (백엔드 API 연동 전까지 사용)
  const getDummyReviews = () => [
    {
      id: 1,
      placeId: 101,
      placeName: '성북동 카페 온어',
      placeCategory: '카페',
      rating: 4.5,
      reviewText: '정말 분위기 좋고 커피도 맛있어요! 다음에 또 오고 싶네요.',
      categories: ['맛있는', '조용한', '인테리어가 이쁜'],
      images: [],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      placeId: 102,
      placeName: '한성대입구 돼지국밥',
      placeCategory: '식당',
      rating: 5.0,
      reviewText: '진짜 맛있어요!! 국물이 진하고 고기도 부드러워서 최고입니다.',
      categories: ['맛있는', '가성비가 좋은', '친절한'],
      images: ['/images/review1.jpg'],
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      placeId: 103,
      placeName: '성신여대 베이글 브런치',
      placeCategory: '카페',
      rating: 4.0,
      reviewText: '베이글이 정말 맛있고 브런치 메뉴도 다양해요.',
      categories: ['맛있는', '메뉴가 다양한', '감성적인'],
      images: ['/images/review2.jpg', '/images/review3.jpg'],
      createdAt: '2024-01-05T12:15:00Z',
      updatedAt: '2024-01-05T12:15:00Z'
    }
  ];

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 별점 렌더링
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // 후기 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('정말 이 후기를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const userId = userStore.getUserId();
      if (!userId) {
        alert('사용자가 선택되지 않았습니다.');
        return;
      }
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) {
        alert('후기를 찾을 수 없습니다.');
        return;
      }

      // API 엔드포인트: DELETE /api/v2/deleteReview/{userId}/{storeId}
      await deleteReview(userId, review.placeId);
      setReviews(reviews.filter(r => r.id !== reviewId));
      setShowActionMenu(null);
      alert('후기가 성공적으로 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('후기 삭제에 실패했습니다.');
    }
  };

  // 후기 수정 (향후 구현 예정)
  const handleEditReview = (reviewId) => {
    console.log('Edit review:', reviewId);
    setShowActionMenu(null);
    // TODO: 수정 페이지로 이동 또는 수정 모달 열기
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Star size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          아직 작성한 후기가 없어요
        </h3>
        <p className="text-gray-500 text-sm">
          방문한 장소에 대한 후기를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 후기 헤더 */}
          <div className="p-4 pb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-base">
                  {review.placeName}
                </h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {review.placeCategory}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {review.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>

            {/* 액션 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowActionMenu(showActionMenu === review.id ? null : review.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>

              {showActionMenu === review.id && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[100px]">
                  <button
                    onClick={() => handleEditReview(review.id)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 후기 내용 */}
          <div className="px-4 pb-3">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {review.reviewText}
            </p>

            {/* 카테고리 태그 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {review.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  #{category}
                </span>
              ))}
            </div>

            {/* 이미지 (있는 경우) */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReviewsList;
