import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePlus, ChevronDown, ChevronUp } from 'lucide-react';

const WriteReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // 이전 페이지에서 전달받은 장소 정보
  const placeInfo = location.state?.place || {};
  
  const [reviewData, setReviewData] = useState({
    placeId: placeInfo.id || '',
    selectedPlace: '',
    selectedCategories: [],
    oneLineReview: '',
    images: []
  });

  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 방문 가능한 장소 목록 (실제로는 API에서 가져올 것)
  const availablePlaces = [
    { id: 1, name: '성북동 카페 온어', category: '카페' },
    { id: 2, name: '한성대입구 돼지국밥', category: '식당' },
    { id: 3, name: '성신여대 베이글 브런치', category: '카페' },
    { id: 4, name: '길상사', category: '관광지' },
  ];

  // 카테고리 옵션들 (그룹 구분 없이 단순화)
  const categoryOptions = [
    '맛있는', '조용한', '친절한', '가성비가 좋은', 
    '인테리어가 이쁜', '주차공간', '메뉴가 다양한', 
    '감성적인', '청결한 매장', '분위기 있는', 
    '서비스가 좋은', '접근성 좋은'
  ];

  // 장소 선택 핸들러
  const handlePlaceSelect = (place) => {
    setReviewData(prev => ({
      ...prev,
      selectedPlace: place.name,
      placeId: place.id
    }));
    setShowPlaceDropdown(false);
  };

  // 카테고리 선택 토글
  const toggleCategory = (category) => {
    if (reviewData.selectedCategories.length >= 3 && !reviewData.selectedCategories.includes(category)) {
      showToastMessage('카테고리는 정확히 3개를 선택해주세요.');
      return;
    }
    
    setReviewData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(cat => cat !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  // 한줄평 입력 핸들러
  const handleReviewChange = (e) => {
    setReviewData(prev => ({
      ...prev,
      oneLineReview: e.target.value
    }));
  };

  // 이미지 선택 핸들러
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 3;
    
    if (files.length + reviewData.images.length > maxFiles) {
      showToastMessage(`최대 ${maxFiles}개의 이미지만 추가할 수 있습니다.`);
      return;
    }

    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file)
    }));

    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // 이미지 제거 핸들러
  const removeImage = (imageId) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  // 토스트 알림 함수
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    // 3초 후 자동으로 사라짐
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 완료 버튼 활성화 상태 확인
  const isCompleteButtonEnabled = () => {
    return reviewData.selectedPlace && 
           reviewData.selectedCategories.length === 3 && 
           reviewData.oneLineReview.trim();
  };

  // 완료 버튼 핸들러
  const handleComplete = () => {
    // 필수 항목 검증
    if (!reviewData.selectedPlace) {
      showToastMessage('방문한 장소를 선택해주세요.');
      return;
    }

    if (reviewData.selectedCategories.length !== 3) {
      showToastMessage('카테고리를 정확히 3개 선택해주세요.');
      return;
    }

    if (!reviewData.oneLineReview.trim()) {
      showToastMessage('후기를 작성해주세요.');
      return;
    }

    // TODO: 실제 API 호출로 후기 저장
    console.log('후기 데이터:', reviewData);
    
    // 후기 완료 페이지로 이동
    navigate('/review-complete');
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="h-screen bg-white flex flex-col max-w-sm mx-auto relative pb-20">
        {/* 헤더 */}
        <div className="flex-shrink-0 text-center py-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-black">후기 작성</h1>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 - 스크롤바 숨김 */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar" 
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
        {/* 방문한 장소 선택 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-black">내가 방문한 장소</h2>
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowPlaceDropdown(!showPlaceDropdown)}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between text-left"
            >
              <span className={`text-sm ${reviewData.selectedPlace ? 'text-black' : 'text-gray-400'}`}>
                {reviewData.selectedPlace || '방문 했던 장소를 선택해주세요'}
              </span>
              {showPlaceDropdown ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>
            
            {/* 드롭다운 메뉴 */}
            {showPlaceDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {availablePlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 카테고리 선정 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-black">카테고리 선정</h2>
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
          
          <p className="text-sm text-gray-500 mb-2">
            이 장소와 어울리는 카테고리 3개를 골라주세요.
          </p>
          <p className="text-xs text-blue-600 mb-6">
            현재 {reviewData.selectedCategories.length}/3개 선택됨
          </p>

          {/* 카테고리 버튼들 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleCategory(option)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    reviewData.selectedCategories.includes(option)
                      ? 'bg-blue-100 border border-blue-500 text-blue-600'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 방문했던 장소는 어떠셨나요? */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-black">방문했던 장소는 어떠셨나요?</h2>
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
          
          <textarea
            value={reviewData.oneLineReview}
            onChange={handleReviewChange}
            placeholder="한마디로 간단하게 적어주세요!"
            className="w-full h-16 px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            maxLength={100}
          />
        </div>

        {/* 사진 추가 */}
        <div className="mb-32">
          <h2 className="text-center text-lg font-semibold text-gray-600 mb-6">사진을 추가해주세요</h2>
          
          <div 
            onClick={handleImageSelect}
            className="w-full h-32 bg-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-3">
              <ImagePlus size={24} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-500">
              돌맹돌맹 후기에 추가할 이미지를 넣어보세요.
            </p>
          </div>

          {/* 선택된 이미지 표시 */}
          {reviewData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {reviewData.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="선택된 이미지"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        </div>

        {/* 완료 버튼 - 하단 고정 */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-gray-100">
          <button
            onClick={handleComplete}
            disabled={!isCompleteButtonEnabled()}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-colors ${
              isCompleteButtonEnabled()
                ? 'bg-slate-800 text-white hover:bg-slate-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            완료
          </button>
        </div>

        {/* 토스트 메시지 - 웹앱뷰 내에서만 표시 */}
        {showToast && (
          <div className="absolute top-20 left-4 right-4 z-50">
            <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-center text-sm">
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WriteReview;