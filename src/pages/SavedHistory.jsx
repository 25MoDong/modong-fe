import { useState, useEffect } from 'react';
import { X, MapPin, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';
import { loadMapping, loadPlaceCache, saveMapping } from '../lib/favoritesStorage';
import backend from '../lib/backend';
import { deleteFavoriteStore } from '../lib/favoriteStoreApi';
import userStore from '../lib/userStore';

// Fixed origin: 서울특별시 성북구 정릉로 77 (approx coords)
const ORIGIN = { lat: 37.6047, lng: 127.0139 };

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return '';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const SavedHistory = () => {
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'outside'
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'name', 'rating'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  // 실제 로컬 스토리지 기반 데이터
  const [localPlaces, setLocalPlaces] = useState([]); // '찜한 장소' (favorites mapping + cache)
  const [outsidePlaces, setOutsidePlaces] = useState([]); // PlaceAddModal로 추가된 장소들 (favorite_places key)

  // load from storage on mount
  useLoadSavedPlaces(setLocalPlaces, setOutsidePlaces);

  // also try to fetch user's favorite stores from backend for "outside" tab
  useEffect(() => {
    let mounted = true;
    const fetchFavorites = async () => {
      try {
        const uid = userStore.getUserId();
        if (!uid) return;
        const list = await backend.getUserStores(uid);
        if (!mounted || !Array.isArray(list)) return;
        const mapped = list.map((s, idx) => ({
          id: s.storeName ? `${s.storeName}-${idx}` : String(idx),
          name: s.storeName || s.name || s.detail || `장소 ${idx+1}`,
          distance: s.detail || '',
          hours: s.posX ? `${s.posX}, ${s.posY}` : '',
          similarity: '',
          raw: s
        }));
        setOutsidePlaces(mapped);
      } catch (e) {
        console.error('Failed to load user favorite stores:', e);
      }
    };
    fetchFavorites();
    return () => { mounted = false; };
  }, []);

  const currentPlaces = (activeTab === 'local' ? localPlaces : outsidePlaces).map(p => {
    // Try to compute distance if coords exist on place
    let lat = undefined;
    let lng = undefined;
    if (p.lat != null && p.lng != null) {
      lat = toNumber(p.lat);
      lng = toNumber(p.lng);
    } else if (p.y != null && p.x != null) {
      lat = toNumber(p.y);
      lng = toNumber(p.x);
    } else if (p.posY != null && p.posX != null) {
      lat = toNumber(p.posY);
      lng = toNumber(p.posX);
    } else if (p.raw && (p.raw.posY != null && p.raw.posX != null)) {
      lat = toNumber(p.raw.posY);
      lng = toNumber(p.raw.posX);
    }

    let computedDistance = undefined;
    if (lat != null && lng != null) {
      computedDistance = haversine(ORIGIN.lat, ORIGIN.lng, lat, lng);
    }
    const distanceText = computedDistance != null ? formatDistance(computedDistance) : (p.distance || '');
    return { ...p, _distanceMeters: computedDistance, _distanceText: distanceText };
  }).sort((a, b) => {
    if (sortBy !== 'distance') return 0;
    const da = a._distanceMeters ?? Number.POSITIVE_INFINITY;
    const db = b._distanceMeters ?? Number.POSITIVE_INFINITY;
    return da - db;
  });

  // 안전한 문자열 렌더링: 객체가 들어오면 가능한 텍스트 필드를 선택
  function safeText(val) {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      if (typeof val.todayHours === 'string') return val.todayHours;
      if (typeof val.text === 'string') return val.text;
      if (typeof val.name === 'string') return val.name;
      if (val.isOpen !== undefined) return val.isOpen ? '영업중' : '영업종료';
      try { return JSON.stringify(val); } catch { return ''; }
    }
    return '';
  }

  // 삭제 관련 함수들
  const handleDeleteClick = (place) => {
    setPlaceToDelete(place);
    setShowDeleteModal(true);
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDeleteConfirm = async () => {
    if (!placeToDelete) return;

    if (activeTab === 'local') {
      // remove from mapping entirely
      try {
        const map = loadMapping();
        delete map[String(placeToDelete.id)];
        saveMapping(map);
      } catch (e) {}
      setLocalPlaces(prev => prev.filter(place => place.id !== placeToDelete.id));
      setToastMessage('찜한 장소에서 삭제되었습니다.');
      setShowToast(true);
    } else {
      // Try deleting via backend favorite store API (if raw data available),
      // otherwise fall back to localStorage removal
      try {
        const raw = placeToDelete?.raw || {};
        // prefer explicit keys for deletion; if not available, try best-effort by storeName only
        if (raw && raw.storeName) {
          try {
            await deleteFavoriteStore(raw.storeName, raw.detail || '');
          } catch (errDelete) {
            // log and continue to fallback
            console.warn('Backend delete failed, will fallback to local removal', errDelete);
          }
        }

        // Ensure local fallback removal too (handle various id shapes)
        try {
          const rawJson = localStorage.getItem('favorite_places') || '[]';
          const arr = JSON.parse(rawJson);
          const targetId = placeToDelete?.id != null ? String(placeToDelete.id) : null;
          const filtered = arr.filter(p => {
            if (!targetId) return true; // nothing to compare
            try {
              return String(p.id) !== targetId && String(p.storeName || p.name || '') !== targetId;
            } catch (_) {
              return true;
            }
          });
          localStorage.setItem('favorite_places', JSON.stringify(filtered));
        } catch (errLocal) {
          // ignore localStorage errors
          console.warn('Failed to update local favorite_places during deletion fallback', errLocal);
        }

        setOutsidePlaces(prev => (prev || []).filter(place => String(place.id) !== String(placeToDelete.id)));
        setToastMessage('내 지역 외 장소 목록에서 삭제되었습니다.');
        setShowToast(true);
      } catch (e) {
        console.error('Unexpected error while deleting favorite place', e);
        setToastMessage('삭제 중 오류가 발생했습니다.');
        setShowToast(true);
      }
    }

    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-white rounded-[50px] h-screen overflow-hidden flex flex-col">
      {/* 제목 */}
      <div className="pt-12 pb-2 text-center text-black font-semibold text-2xl">저장내역</div>

      {/* 탭 네비게이션 */}
      <div className="flex justify-between px-16" style={{marginTop: '10px'}}>
        <button
          onClick={() => setActiveTab('local')}
          style={{
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '16px',
            color: activeTab === 'local' ? '#000000' : '#BCBCBC',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          내 지역 장소
        </button>
        <button
          onClick={() => setActiveTab('outside')}
          style={{
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '16px',
            color: activeTab === 'outside' ? '#000000' : '#BCBCBC',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          내 지역 외의 장소
        </button>
      </div>

      {/* 투명 오버레이 제거: 버튼 자체로 클릭 */}

      {/* 탭 구분선 */}
      <div className="border-t border-[#B5B5B5] mt-3" />
      
      {/* 활성 탭 표시선 */}
      {/* simple active underline omitted in flex layout */}

      {/* 정렬 버튼 */}
      <div className="flex justify-end px-5 mt-3">
        <div style={{
          position: 'relative',
          background: '#FFFFFF',
          border: '1px solid #535F8B',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          cursor: 'pointer'
        }}>
          <span style={{
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '12px',
            lineHeight: '14px',
            color: '#535F8B'
          }}>
            거리순
          </span>
          <div style={{
            width: '8px',
            height: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ChevronDown size={8} color="#535F8B" />
          </div>
        </div>
      </div>

      {/* 장소 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        <AnimatePresence>
        {currentPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, height: 0, marginBottom: 0 }}
          className={`relative bg-white border border-[#B5B5B5] shadow-md rounded-lg p-3 mb-4`} 
          >
            <div className="flex gap-3">
              <div className="w-24 h-24 bg-black rounded-lg shrink-0" />
              <div className="flex-1 pr-8">
                <div className="text-black font-semibold text-base">{safeText(place.name)}</div>
                <div className="text-[#6A6F82] font-semibold text-sm mt-1">{safeText(place._distanceText)}</div>
                <div className="text-[#6A6F82] font-semibold text-xs mt-2">{safeText(place.hours)}</div>
                <div className="text-[#6A6F82] font-semibold text-xs mt-2">{safeText(place.similarity)}</div>
              </div>
              <button onClick={() => handleDeleteClick(place)} className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center">
                <X size={20} color="#9CA3AF" />
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* 하단 네비게이션 */}
      <div className="flex flex-row justify-between items-center px-10 gap-5 h-[70px] bg-white border-t" style={{position: 'sticky', bottom: 0}}>
        {/* 네비게이션 아이콘들 */}
        <div style={{
          width: '24px',
          height: '24px',
          background: 'linear-gradient(315deg, #2A3045 0%, #747FA7 100%)',
          margin: '0 auto'
        }} />
        
        <div style={{
          width: '26px',
          height: '24px',
          background: '#FFFFFF',
          border: '3px solid #BCBCBC',
          margin: '0 auto'
        }} />
        
        <div style={{
          width: '30px',
          height: '30px',
          margin: '0 auto'
        }}>
          <MapPin size={30} color="#BCBCBC" />
        </div>
        
        <div style={{
          width: '28px',
          height: '25px',
          background: '#FFFFFF',
          border: '3px solid #BCBCBC',
          margin: '0 auto'
        }} />
        
        <div style={{
          width: '27px',
          height: '25px',
          background: '#FFFFFF',
          border: '3px solid #BCBCBC',
          margin: '0 auto'
        }} />
      </div>

      {/* 하단 구분선 (removed absolute positioning that caused overlap) */}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '30px',
            margin: '20px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* 모달 닫기 버튼 */}
            <button
              onClick={handleDeleteCancel}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#9CA3AF" />
            </button>

            {/* 모달 내용 */}
            <div style={{
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '22px',
              color: '#000000',
              marginBottom: '15px'
            }}>
              선택한 장소를 삭제하시겠습니까?
            </div>

            <div style={{
              fontFamily: 'Pretendard',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '17px',
              color: '#6A6F82',
              marginBottom: '30px'
            }}>
              삭제하시면 이 장소에 대한 모든 취향정보가 사라집니다.
            </div>

            {/* 버튼들 */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#212844',
                  color: '#FFFFFF',
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 토스트 */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
};

// load saved data from localStorage / favorites mapping on mount
// (kept outside the component for clarity)
function useLoadSavedPlaces(setLocalPlaces, setOutsidePlaces) {
  useEffect(() => {
    // load favorites from mapping + cache
    try {
      const mapping = loadMapping();
      const cache = loadPlaceCache();
      const local = Object.keys(mapping).map(pid => {
        const place = cache[String(pid)];
        if (place) return place;
        return { id: Number(pid), name: '알 수 없는 장소' };
      });
      setLocalPlaces(local);
    } catch (e) {
      setLocalPlaces([]);
    }

    // load outside places added via PlaceAddModal
    try {
      const raw = localStorage.getItem('favorite_places') || '[]';
      const outside = JSON.parse(raw);
      setOutsidePlaces(Array.isArray(outside) ? outside : []);
    } catch (e) {
      setOutsidePlaces([]);
    }
  }, [setLocalPlaces, setOutsidePlaces]);
}

export { useLoadSavedPlaces };

export default SavedHistory;
