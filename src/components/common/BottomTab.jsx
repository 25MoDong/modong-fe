import { Home, Heart, MapPin, Users, User } from 'lucide-react';

export default function BottomTab({ active = 'home' }) {
  const Item = ({ icon, keyName, label }) => (
    <button
      aria-label={label}
      className={`flex items-center justify-center ${active === keyName ? 'text-gray-900' : 'text-gray-500'}`}
    >
      {icon}
    </button>
  );

  return (
    <nav className="absolute bottom-4 left-[20px] right-[20px] z-50">
      <div className="rounded-2xl bg-white/90 backdrop-blur shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
        <ul className="grid grid-cols-5 p-3">
          <li className="flex justify-center">
            <Item icon={<Home size={22} />} keyName="home" label="홈" />
          </li>
          <li className="flex justify-center">
            <Item icon={<Heart size={22} />} keyName="fav" label="찜" />
          </li>
          <li className="flex justify-center">
            <Item icon={<MapPin size={22} />} keyName="map" label="지도" />
          </li>
          <li className="flex justify-center">
            <Item
              icon={<Users size={22} />}
              keyName="community"
              label="커뮤니티"
            />
          </li>
          <li className="flex justify-center">
            <Item icon={<User size={22} />} keyName="me" label="내 정보" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
