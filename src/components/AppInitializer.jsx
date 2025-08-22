import { useEffect, useState } from "react"
import Loading from "./Onboarding/Loading";
import PlaceAddModal from "./modals/PlaceAddModal";

const AppInitializer = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showPlaceModal, setShowPlaceModal] = useState(false);

    useEffect(() => {
      // 이미 초기화되었으면 로딩 건너뛰기
      if (isInitialized) return;

      const navigationType = performance.getEntriesByType('navigation')[0]?.type;

      // 새로고침 또는 처음 방문 시에만 로딩 표시
      const shouldShowLoading = navigationType === 'reload' || navigationType === 'navigate';

      setShowLoading(shouldShowLoading);
      setIsInitialized(true);
    }, [isInitialized]);

    const handleLoadingComplete = () => {
      setShowLoading(false);
    };

    // 앱 초기화 완료 후 모달 표시 로직
    useEffect(() => {
      if (showLoading || !isInitialized) return;

      const checkModalVisibility = () => {
        const hideUntil = localStorage.getItem('hide_place_modal_until');
        
        if (hideUntil) {
          const hideUntilDate = new Date(hideUntil);
          const now = new Date();
          
          // 숨김 기간이 아직 유효하면 모달 표시하지 않음
          if (now < hideUntilDate) {
            return;
          } else {
            // 숨김 기간이 만료되었으면 localStorage에서 제거
            localStorage.removeItem('hide_place_modal_until');
          }
        }

        // 앱 초기화 완료 후 1초 뒤에 모달 표시 (하루에 여러 번 가능)
        const timer = setTimeout(() => {
          setShowPlaceModal(true);
        }, 1000);

        return () => clearTimeout(timer);
      };

      checkModalVisibility();
    }, [showLoading, isInitialized]);

    if (!isInitialized || showLoading) {
      return <Loading onComplete={handleLoadingComplete} />;
    }

    return (
      <>
        {children}
        
        {/* 장소 추가 모달 */}
        <PlaceAddModal 
          isOpen={showPlaceModal}
          onClose={() => setShowPlaceModal(false)}
        />
      </>
    );
  };

export default AppInitializer;
