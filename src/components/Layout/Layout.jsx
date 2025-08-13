import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen items-center justify-center flex">
      <div className="hidden h-full lg:block lg:flex-1 lg:justify-end bg-gray-100">
        <img 
          src="/images/tmp.jpg" 
          alt="서비스 설명 이미지"
          className="w-full h-full object-cover object-left opacity-50"
        />
      </div>
      
        {/* flex-shiring-0 : flexbox에서 웹앱 영역 너비를 고정으로 유지해 줌. */}
      <div className="min-w-[375px] max-w-[400px] lg:w-[390px] lg:flex-shrink-0 mx-auto lg:mx-20">
        <div className="bg-white w-full h-screen overflow-y-auto scrollbar-hide  lg:shadow-2xl">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};

export default Layout;