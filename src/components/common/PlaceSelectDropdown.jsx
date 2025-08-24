import { useEffect, useRef, useState } from 'react';
import backend from '../../lib/backend';
import userStore from '../../lib/userStore';

const PlaceSelectDropdown = ({ 
  isOpen, 
  onClose, 
  selectedPlace, 
  onSelectPlace,
  containerRef 
}) => {
  const dropdownRef = useRef(null);
  const [places, setPlaces] = useState([]);

  // load saved places from backend (user's saved stores), excluding those in user's own address
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const uid = userStore.getUserId();
        let list = [];
        if (uid) {
          list = await backend.getUserStores(uid);
        }
        if (!list || list.length === 0) {
          list = await backend.getAllStores();
        }
        const user = uid ? await backend.getUserById(uid) : null;
        const addr = user?.address || user?.detail || '';
        const filtered = (list || []).filter((s) => {
          const detail = (s.detail || s.address || '').toString();
          if (!addr) return true;
          return !detail.includes(addr);
        });
        if (!mounted) return;
        setPlaces(filtered.map(p => ({
          label: p.storeName || p.name || p.title || p.store || p.storeId || '',
          raw: p
        })));
      } catch (err) {
        console.error('Failed to load places for dropdown', err);
        // fallback to some defaults
        if (mounted) setPlaces([
          { label: '연남동 밀리커피', raw: { storeName: '연남동 밀리커피' } },
          { label: '홍대 카페 어딘가', raw: { storeName: '홍대 카페 어딘가' } },
          { label: '망원동 브런치 카페', raw: { storeName: '망원동 브런치 카페' } }
        ]);
      }
    };
    if (isOpen) load();
    return () => { mounted = false; };
  }, [isOpen]);

  // outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          containerRef?.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, containerRef]);

  if (!isOpen) return null;

  const handlePlaceSelect = (place) => {
    onSelectPlace(place.label || place);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#FFC5D2] rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto"
      style={{ minWidth: '200px' }}
    >
      <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l-2 border-t-2 border-[#FFC5D2] transform rotate-45"></div>
      <div className="py-2">
        {places.map((p, index) => (
          <button
            key={index}
            onClick={() => handlePlaceSelect(p)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
              (p.label === selectedPlace) ? 'bg-secondary-100 border-l-4 border-l-[#FFC5D2]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-kcc-hanbit text-[16px] text-gray-900 truncate flex-1 mr-2">{p.label}</span>
              {(p.label === selectedPlace) && <div className="w-2 h-2 bg-[#FFC5D2] rounded-full flex-shrink-0"></div>}
            </div>
            <div className="text-xs text-gray-500 mt-1">{index < 3 ? '최근 방문' : '저장된 장소'}</div>
          </button>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">선택한 장소를 기준으로 추천이 변경됩니다</p>
      </div>
    </div>
  );
};

export default PlaceSelectDropdown;
