import { Home, Heart, MapPin, Users, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import communityIcon from '/icon/community.svg';
import myPageIcon from '/icon/myPage.svg';

export default function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();

  // App.jsx의 라우터 정의와 일치하는 네비게이션 설정
  const navItems = [
    { 
      key: 'home', 
      label: '홈', 
      icon: <Home size={22} />, 
      path: '/' 
    },
    { 
      key: 'favorites', 
      label: '찜', 
      icon: <Heart size={22} />, 
      path: '/favorites' 
    },
    { 
      key: 'map', 
      label: '지도', 
      icon: <MapPin size={22} />, 
      path: '/map' 
    },
    { 
      key: 'community', 
      label: '커뮤니티', 
      icon: <img src={communityIcon} alt="커뮤니티" width={22} height={22} />,
      path: '/community' 
    },
    { 
      key: 'profile', 
      label: '내 정보', 
      icon: <img src={myPageIcon} alt="내 정보" width={22} height={22} />,
      path: '/profile' 
    }
  ];

  // 현재 경로 기반으로 active 상태 결정
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const Item = ({ item }) => (
    <button
      aria-label={item.label}
      onClick={() => navigate(item.path)}
      className={`flex flex-col items-center justify-center p-2 transition-colors ${
        isActive(item.path) 
          ? 'text-gray-900' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {item.icon}
      <span className="text-[10px] mt-1">{item.label}</span>
    </button>
  );

  return (
    <nav className="px-5 z-50">
      <div className="rounded-2xl bg-white/90 backdrop-blur shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
        <ul className="grid grid-cols-5 p-2">
          {navItems.map((item) => (
            <li key={item.key} className="flex justify-center">
              <Item item={item} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
