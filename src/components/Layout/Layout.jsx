import { Outlet } from 'react-router-dom';
import BottomTab from '../common/BottomTab';
import { useEffect, useState } from 'react';
import OnboardingFlow from '../Onboarding/OnboardingFlow';
import AppInitializer from '../AppInitializer';

const Layout = () => {
  const [showBottomTab, setShowBottomTab] = useState(false);

  useEffect(()=>{
    const updateBottomTab = () => {
      const completed = localStorage.getItem('onboarding_completed');
      setShowBottomTab(!!completed); 
    };

    updateBottomTab();
    window.addEventListener('storage', updateBottomTab);
    window.addEventListener('OnboardingCompleted', updateBottomTab);
    
    return ()=>{
      window.removeEventListener('storage',updateBottomTab);
      window.removeEventListener('OnboardingCompleted', updateBottomTab);
    };
  },[]);

  return (
    
    <div className="h-screen items-center justify-center flex select-none">
        <div className="hidden h-full lg:block lg:flex-1 lg:justify-end bg-gray-100">
          <img
            src="/images/tmp.jpg"
            alt="서비스 설명 이미지"
            className="w-full h-full object-cover object-left opacity-50"
            style={{
              WebkitUserDrag: 'none',
            }}
            />
        </div>

        {/* flex-shiring-0 : flexbox에서 웹앱 영역 너비를 고정으로 유지해 줌. */}
        <div className="min-w-[375px] max-w-[400px] lg:w-[390px] lg:flex-shrink-0 mx-auto lg:mx-20">
          <div className='bg-white w-full flex flex-col h-screen lg:shadow-2xl'>
            <AppInitializer>
            <main className="flex-1  overflow-y-auto scrollbar-hide relative">
                <Outlet />
            </main>
            { showBottomTab && (
              <footer className='flex-shirink-0'>
                <BottomTab />
              </footer>
            )}
            </AppInitializer>
          </div>
        </div>
      </div>
  );
};

export default Layout;
