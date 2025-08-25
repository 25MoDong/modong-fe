import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backend from '../../lib/backend';
import userStore from '../../lib/userStore';

const Redefinition = ({ onComplete, fromOnboarding }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [aiSuggestedCategories, setAiSuggestedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 온보딩 플로우에서 온 것인지 확인 (prop 또는 location state)
  const isFromOnboarding = fromOnboarding === true || location.state?.fromOnboarding === true;

  const [isCompleting, setIsCompleting] = useState(false);

  // 완료 처리 함수
  const handleComplete = async () => {
    if (isCompleting) return; // 중복 클릭 방지
    
    setIsCompleting(true);
    
    try {
      const userId = userStore.getUserId();
      if (!userId) {
        setIsCompleting(false);
        return;
      }

      // 백엔드 요청과 최소 지연 시간을 병렬로 실행
      const [_, __] = await Promise.all([
        backend.updateUser(userId, {
          id: userId,
          address: userData.address,
          userMood: selectedCategories
        }),
        new Promise(resolve => setTimeout(resolve, 1500)) // 최소 1.5초 지연
      ]);

      // 재정의 완료 표시
      localStorage.setItem('redefinition_completed', 'true');
      
      // 온보딩 플로우에서 온 경우 onComplete 콜백 호출, 아니면 홈으로 이동
      if (isFromOnboarding && onComplete) {
        // 온보딩 완료 처리
        localStorage.setItem('onboarding_completed', 'true');
        window.dispatchEvent(new Event('OnboardingCompleted'));
        onComplete();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      // 에러가 발생해도 최소 지연 시간 후 홈으로 이동
      setTimeout(() => {
        if (isFromOnboarding && onComplete) {
          localStorage.setItem('onboarding_completed', 'true');
          window.dispatchEvent(new Event('OnboardingCompleted'));
          onComplete();
        } else {
          navigate('/');
        }
        setIsCompleting(false);
      }, 1500);
    }
  };

  // 백엔드에서 사용자 데이터 가져오기
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = userStore.getUserId();
        if (!userId) {
          // 사용자 ID가 없으면 홈으로 리다이렉트
          navigate('/');
          return;
        }

        const user = await backend.getUserById(userId);
        setUserData(user);
        
        // 사용자의 기존 선호 분위기를 선택된 카테고리로 설정
        if (user.userMood && Array.isArray(user.userMood)) {
          setSelectedCategories(user.userMood);
        }

        // AI 추천 카테고리 설정 (백엔드에서 추가 데이터가 있다면 활용)
        const suggestedTags = [
          '분위기가 좋은',
          '조용한',
          '힙한 감성',
          '인스타 감성'
        ];
        setAiSuggestedCategories(suggestedTags);
        
        setLoading(false);
        
        // 데이터 로드 완료 후 자동으로 완료 처리 시작
        setTimeout(() => {
          handleComplete();
        }, 100); // 화면이 잠시 보이도록 100ms 지연
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);



  if (loading) {
    return (
      <div className="h-full bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FFFDF8] flex flex-col overflow-hidden">
      <div className="flex-1 px-5 py-4">
        {/* 메인 타이틀 */}
        <div className="text-center mb-6">
          <h1 className="font-sans font-bold text-[28px] leading-[32px] text-[#6B6B6B] mb-4">
            당신은 "{userData?.id || userData?.name || '느좋돌멩이'}" !
          </h1>
          
          {/* 프로필 이미지 영역 */}
          <div className="w-24 h-20 mx-auto mb-6 drop-shadow-[2px_10px_8px_rgba(0,0,0,0.25)]">
            <img 
              src="/images/dolmaeng.png" 
              alt="돌맹이 프로필" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 내가 고른 카테고리 섹션 */}
        <div className="mb-6">
          <h2 className="font-sans font-semibold text-[18px] leading-[22px] text-black mb-3">
            내가 고른 카테고리
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((category, index) => (
              <div
                key={index}
                className="flex justify-center items-center px-3 py-2 bg-white border-2 border-[#212842] rounded-[12px]"
              >
                <span className="font-sans font-semibold text-[13px] leading-[16px] text-[#212842]">
                  # {category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI 추천 섹션 */}
        <div className="mb-6">
          <p className="font-sans font-normal text-[11px] leading-[13px] text-[#B5B5B5] mb-1">
            AI가 구체화 해주는 취향
          </p>
          <h3 className="font-sans font-semibold text-[18px] leading-[22px] text-black mb-3">
            이런 것도 좋아하실 것 같아요!
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {aiSuggestedCategories.map((category, index) => (
              <div
                key={index}
                className={`flex justify-center items-center px-3 py-2 rounded-[12px] border-2 border-[#212842] ${
                  selectedCategories.includes(category)
                    ? 'bg-[#212842] text-[#FFFEFD]'
                    : 'bg-[#212842] text-[#FFFEFD]'
                }`}
              >
                <span className="font-sans font-semibold text-[13px] leading-[16px]">
                  # {category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 진행 상황 텍스트 */}
        <div className="text-center mb-6">
          <p className="font-sans font-normal text-[14px] leading-[16px] text-black">
            {isFromOnboarding ? '취향에 딱 맞는 원석 탐색중 . . . .' : '취향 재정의 중 . . . .'}
          </p>
        </div>

        {/* 로딩 스피너 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-[50px] h-[50px]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#212842]"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Redefinition;