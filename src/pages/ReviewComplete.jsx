import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ReviewComplete = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleConfirm = () => {
    // 스탬프 카운트 업데이트
    const currentCount = parseInt(localStorage.getItem('stamp_count') || '0');
    localStorage.setItem('stamp_count', Math.min(currentCount + 1, 10).toString());
    navigate('/profile');
  };

  useEffect(() => {
    // 애니메이션 완료 후 버튼 표시
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);

    return () => clearTimeout(animationTimer);
  }, [navigate]);

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center max-w-sm mx-auto relative">
      {/* 원석→보석 변환 애니메이션 */}
      <div className="mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 transform transition-all duration-1000 ease-in-out animate-stone-to-gem rounded-full shadow-lg"></div>
      </div>

      {/* 완료 메시지 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-16 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
        원석이 보석으로 변했어요!
      </h1>

      {/* 확인 버튼 */}
      {animationComplete && (
        <button
          onClick={handleConfirm}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-12 rounded-full transition-colors animate-fadeIn"
        >
          확인
        </button>
      )}
    </div>
  );
};

export default ReviewComplete;