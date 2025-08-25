import { useEffect, useRef, useState } from 'react';
import backend from '../../lib/backend';
import userStore from '../../lib/userStore';

const PlaceSelectDropdown = ({ 
  isOpen, 
  onClose, 
  selectedPlace, 
  onSelectPlace,
  containerRef,
  // If true, call onSelectPlace(payload, { fromDropdown: true }) so parent can force recompute
  notifyParentWithOpts = false,
  // source: 'favorites' | 'map' | 'global' - determines initial list
  source = 'favorites',
  // when source === 'map', use this list
  mapPlaces = [],
  // enable free text search input (calls backend.searchStores)
  enableSearch = false
}) => {
  const dropdownRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // load initial places based on source when opened
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (source === 'map') {
          // use provided mapPlaces or fallback to all stores
          if (Array.isArray(mapPlaces) && mapPlaces.length > 0) {
            const mapped = mapPlaces.map(p => ({ label: p.storeName || p.name || p.title || '', raw: p }));
            if (mounted) setPlaces(mapped);
            return;
          }
          const all = await backend.getAllStores();
          if (!mounted) return;
          setPlaces((all || []).map(p => ({ label: p.storeName || p.name || p.title || '', raw: p })));
          return;
        }

        if (source === 'favorites') {
          const uid = userStore.getUserId();
          if (uid) {
            const list = await backend.getUserStores(uid);
            if (!mounted) return;
            setPlaces((list || []).map(p => ({ label: p.storeName || p.name || p.title || '', raw: p })));
            return;
          }
          // no uid - fallback to all stores
          const all = await backend.getAllStores();
          if (!mounted) return;
          setPlaces((all || []).map(p => ({ label: p.storeName || p.name || p.title || '', raw: p })));
          return;
        }

        // global
        const all = await backend.getAllStores();
        if (!mounted) return;
        setPlaces((all || []).map(p => ({ label: p.storeName || p.name || p.title || '', raw: p })));
      } catch (err) {
        console.error('Failed to load places for dropdown', err);
        if (mounted) setPlaces([
          { label: '연남동 밀리커피', raw: { storeName: '연남동 밀리커피' } },
          { label: '홍대 카페 어딘가', raw: { storeName: '홍대 카페 어딘가' } },
          { label: '망원동 브런치 카페', raw: { storeName: '망원동 브런치 카페' } }
        ]);
      }
    };
    if (isOpen) load();
    return () => { mounted = false; };
  }, [isOpen, source, mapPlaces]);

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

  // Search input debounce
  useEffect(() => {
    if (!enableSearch || !isOpen) return;
    const q = (query || '').trim();
    let mounted = true;
    let t = null;
    const run = async () => {
      if (!q) {
        // reload initial list
        try {
          if (source === 'map' && Array.isArray(mapPlaces) && mapPlaces.length > 0) {
            setPlaces(mapPlaces.map(p => ({ label: p.storeName || p.name || '', raw: p })));
            return;
          }
          if (source === 'favorites') {
            const uid = userStore.getUserId();
            if (uid) {
              const list = await backend.getUserStores(uid);
              if (!mounted) return;
              setPlaces((list || []).map(p => ({ label: p.storeName || p.name || '', raw: p })));
              return;
            }
          }
          const all = await backend.getAllStores();
          if (!mounted) return;
          setPlaces((all || []).map(p => ({ label: p.storeName || p.name || '', raw: p })));
        } catch (e) {
          console.warn('Failed to reload list during search clear', e);
        }
        return;
      }
      setSearching(true);
      try {
        const results = await backend.searchStores(q);
        if (!mounted) return;
        setPlaces((results || []).map(p => ({ label: p.storeName || p.name || p.title || '', raw: p })));
      } catch (e) {
        console.warn('SearchStores failed during typing', e);
      } finally {
        if (mounted) setSearching(false);
      }
    };

    t = setTimeout(run, 300);
    return () => { mounted = false; clearTimeout(t); };
  }, [query, enableSearch, isOpen, source, mapPlaces]);

  if (!isOpen) return null;

  const handlePlaceSelect = (place) => {
    // prefer passing the raw backend object when available
    const payload = place.raw || place.label || place;
    if (notifyParentWithOpts) onSelectPlace(payload, { fromDropdown: true });
    else onSelectPlace(payload);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#FFC5D2] rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto"
      style={{ minWidth: '200px' }}
    >
      {enableSearch && (
        <div className="px-3 py-2 border-b">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="가게명으로 검색해보세요"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      )}
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
