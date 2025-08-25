import { Outlet } from 'react-router-dom';
import BottomTab from '../common/BottomTab';
import FallbackLoading from '../common/FallbackLoading';
import { useEffect, useState, useCallback, Suspense } from 'react';
import OnboardingFlow from '../Onboarding/OnboardingFlow';
import AppInitializer from '../AppInitializer';
import { SearchModeProvider, useSearchModeContext } from '../../contexts/SearchModeContext';

/**
 * Inner Layout component that has access to SearchModeContext
 */
const LayoutContent = () => {
  const [showBottomTab, setShowBottomTab] = useState(() => {
    // Initialize from localStorage to prevent layout shift
    return !!localStorage.getItem('onboarding_completed');
  });

  const { config: searchConfig } = useSearchModeContext();

  const updateBottomTab = useCallback(() => {
    const completed = localStorage.getItem('onboarding_completed');
    setShowBottomTab(!!completed); 
  }, []);

  // Determine if navigation should be visible
  // Hide navigation when search is active (Kakao Map UX pattern)
  const shouldShowNavigation = showBottomTab && searchConfig.showNavigation;

  useEffect(() => {
    updateBottomTab();
    window.addEventListener('storage', updateBottomTab);
    window.addEventListener('OnboardingCompleted', updateBottomTab);
    
    return () => {
      window.removeEventListener('storage', updateBottomTab);
      window.removeEventListener('OnboardingCompleted', updateBottomTab);
    };
  }, [updateBottomTab]);

  return (
    <div className="min-h-[100dvh] items-center justify-center flex select-none bg-gray-50 lg:bg-gray-100">
        {/* Desktop background image */}
        <div className="hidden h-full lg:block lg:flex-1 lg:justify-end bg-gray-100">
          <img
            src="/images/tmp.jpg"
            alt="서비스 설명 이미지"
            className="w-full h-full object-cover object-left opacity-50"
            draggable="false"
            style={{
              WebkitUserDrag: 'none',
            }}
            />
        </div>

        {/* Mobile-first responsive container */}
        <div className="w-full max-w-sm sm:max-w-md lg:w-[390px] lg:max-w-[400px] lg:flex-shrink-0 mx-auto lg:mx-20">
          <div id="webapp-container" data-webapp-root className="bg-white w-full h-[100dvh] lg:h-screen lg:shadow-2xl lg:rounded-lg overflow-y-auto flex flex-col relative">
            <AppInitializer>
              {/* Main content area - scrollable */}
              <main className="flex-1 overflow-y-auto">
                <Suspense fallback={<FallbackLoading message={"로딩 중..."} />}>
                  <Outlet />
                </Suspense>
              </main>

              {/* Modal root inside the web-app view so portals render within the app container (deprecated - keep for compatibility) */}
              <div id="webapp-modal-root" className="absolute inset-0 z-[70] pointer-events-none" />
              
              {/* Bottom navigation - conditionally visible based on search mode */}
              {shouldShowNavigation && (
                <div 
                  className={`flex-shrink-0 pb-safe-bottom transition-all duration-300 ease-in-out ${
                    searchConfig.isSearchActive 
                      ? 'opacity-0 transform translate-y-full pointer-events-none' 
                      : 'opacity-100 transform translate-y-0'
                  }`}
                >
                  <BottomTab />
                </div>
              )}
            </AppInitializer>
          </div>
        </div>
      </div>
  );
};

/**
 * Main Layout component with SearchModeProvider wrapper
 * Provides search mode context to entire app
 */
const Layout = () => {
  return (
    <SearchModeProvider>
      <LayoutContent />
    </SearchModeProvider>
  );
};

export default Layout;
