import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from "./Onboarding/Loading";
import PlaceAddModal from "./modals/PlaceAddModal";
import backend from '../lib/backend';
import userStore from '../lib/userStore';

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

    const navigate = useNavigate();
    const location = useLocation();

    const handleLoadingComplete = () => {
      setShowLoading(false);
    };

    // If onboarding not completed, force redirect to home for any non-home route
    useEffect(() => {
      if (!isInitialized) return;
      const onboardingCompleted = !!localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }, [isInitialized, location.pathname, navigate]);

   // 앱 초기화 완료 후 모달 표시 로직
    useEffect(() => {
      if (showLoading || !isInitialized) return;

    const checkModalVisibility = () => {
        // 재정의 페이지에서는 모달을 표시하지 않음
        if (location.pathname === '/redefinition') {
          return;
        }

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

        // Only show the place modal for users who completed onboarding
        const onboardingCompleted = !!localStorage.getItem('onboarding_completed');
        if (!onboardingCompleted) return; // do not show modal during onboarding

        // 앱 초기화 완료 후 1초 뒤에 모달 표시 (하루에 여러 번 가능)
        const timer = setTimeout(() => {
          setShowPlaceModal(true);
        }, 1000);

        return () => clearTimeout(timer);
      };

      checkModalVisibility();
    }, [showLoading, isInitialized, location.pathname]);

    // Listen for onboarding completion so we can show the place modal
    useEffect(() => {
      const handler = () => {
        // 재정의 페이지에서는 모달을 표시하지 않음
        if (location.pathname === '/redefinition') {
          return;
        }

        const hideUntil = localStorage.getItem('hide_place_modal_until');
        if (hideUntil) {
          const hideUntilDate = new Date(hideUntil);
          const now = new Date();
          if (now < hideUntilDate) return;
          localStorage.removeItem('hide_place_modal_until');
        }

        const onboardingCompleted = !!localStorage.getItem('onboarding_completed');
        if (!onboardingCompleted) return;

        // small delay to let navigation/render settle
        setTimeout(() => setShowPlaceModal(true), 1000);
      };

      window.addEventListener('OnboardingCompleted', handler);
      return () => window.removeEventListener('OnboardingCompleted', handler);
    }, [location.pathname]);


    // Load selected user from storage and hydrate userStore
    useEffect(() => {
      let mounted = true;
      const loadUser = async () => {
        const uid = userStore.getUserId();
        if (!uid) return;
        try {
          const u = await backend.getUserById(uid);
          if (!mounted) return;
          await userStore.setUser(u);
        } catch (e) {
          console.error('Failed to hydrate selected user', e);
        }
      };
      loadUser();
      return () => { mounted = false; };
    }, []);
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
