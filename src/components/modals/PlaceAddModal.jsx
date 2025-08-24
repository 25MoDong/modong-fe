import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../common/Toast';
import userStore from '../../lib/userStore';
import { addFavoriteStore } from '../../lib/favoriteStoreApi';

const PlaceAddModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카카오맵 Places API를 사용한 장소 검색
  const searchPlaces = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // 카카오맵 Places 검색 (전역 객체 사용)
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const places = new window.kakao.maps.services.Places();
        
        places.keywordSearch(query, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 최대 5개 결과만 표시
            setSearchResults(result.slice(0, 5));
          } else {
            setSearchResults([]);
          }
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('장소 검색 중 오류 발생:', error);
      setSearchResults([]);
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 디바운싱 (장소가 선택되지 않았을 때만)
  useEffect(() => {
    if (isPlaceSelected) return; // 장소가 선택되었으면 검색하지 않음
    
    const timer = setTimeout(() => {
      searchPlaces(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, isPlaceSelected]);

  // 장소 선택 핸들러
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setSearchTerm(place.place_name);
    setSearchResults([]);
    setIsPlaceSelected(true); // 장소가 선택되었음을 표시
  };

  // 장소 검색창 입력 변경 핸들러
  const handleSearchTermChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // 사용자가 직접 입력하는 경우 장소 선택 상태 해제
    if (isPlaceSelected && newValue !== selectedPlace?.place_name) {
      setIsPlaceSelected(false);
      setSelectedPlace(null);
    }
  };

  // 추가하기 버튼 핸들러
  const handleAddPlace = () => {
    // place name is required (either selectedPlace or typed searchTerm)
    if ((!selectedPlace && !searchTerm.trim()) || isSubmitting) return;

    setIsSubmitting(true);

    // Build favorite place payload. If user selected from results, use that data,
    // otherwise fall back to typed searchTerm as name.
    const name = selectedPlace ? selectedPlace.place_name : searchTerm.trim();
    const address = selectedPlace ? selectedPlace.address_name : '';
    const category = selectedPlace ? (selectedPlace.category_group_name || '기타') : '기타';

    const favoritePlace = {
      name,
      address,
      menu: menuName.trim() || '',
      category,
      addedAt: new Date().toISOString()
    };

    // Try backend add first
    (async () => {
        try {
          const uid = userStore.getUserId();
          if (!uid) throw new Error('User not selected');
          // API expects favorite store payload for v5; include 'detail' field
          const payload = {
            userId: uid,
            storeName: name,
            detail: address,
            menu: menuName.trim() || '',
            category,
          };
          const resp = await addFavoriteStore(payload);

          // Try to keep a local fallback cache in sync (deduplicated).
          try {
            const existingFavorites = JSON.parse(localStorage.getItem('favorite_places') || '[]');
            const keyForNew = `${payload.storeName}||${payload.detail || ''}`;
            const normalized = existingFavorites.filter(f => `${f.storeName || f.name}||${f.address || f.detail || ''}` !== keyForNew);
            const newEntry = {
              id: resp?.id || resp?.storeId || `${payload.storeName}-${Date.now()}`,
              storeName: payload.storeName,
              name: payload.storeName,
              address: payload.detail || '',
              menu: payload.menu || '',
              category: payload.category || '',
              addedAt: new Date().toISOString(),
              raw: resp || payload
            };
            normalized.push(newEntry);
            localStorage.setItem('favorite_places', JSON.stringify(normalized));
          } catch (errLocal) {
            console.warn('Failed to sync local favorite cache after backend add', errLocal);
          }

          setToastMessage('최애장소에 추가되었습니다!');
          setShowToast(true);
        } catch (err) {
          console.warn('Backend add favorite failed, falling back to local storage', err);
          try {
            const existingFavorites = JSON.parse(localStorage.getItem('favorite_places') || '[]');
            // normalize key to deduplicate (storeName + address/detail)
            const keyForNew = `${name}||${address || ''}`;
            const filtered = existingFavorites.filter(f => `${f.storeName || f.name}||${f.address || f.detail || ''}` !== keyForNew);
            const fallbackEntry = { id: `${name}-${Date.now()}`, storeName: name, name, address, menu: menuName.trim() || '', category, addedAt: new Date().toISOString(), raw: { storeName: name, detail: address } };
            filtered.push(fallbackEntry);
            localStorage.setItem('favorite_places', JSON.stringify(filtered));
            setToastMessage('최애장소에 추가되었습니다! (오프라인 저장)');
            setShowToast(true);
          } catch (err2) {
            console.error('Failed to save favorite locally', err2);
            setToastMessage('찜 추가에 실패했습니다.');
            setShowToast(true);
          }
        } finally {
          setTimeout(() => { handleClose(); }, 500);
        }
    })();
  };

  // 하루 동안 보지 않기
  const handleHideForDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    localStorage.setItem('hide_place_modal_until', tomorrow.toISOString());
    onClose();
  };

  // 모달 닫기 및 초기화
  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedPlace(null);
    setMenuName('');
    setIsPlaceSelected(false);
    setShowToast(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            position: 'relative',
            width: '338px',
            height: '319px',
            background: '#FFFFFF',
            boxShadow: '0px 0px 3.5px 1px rgba(0, 0, 0, 0.25)',
            borderRadius: '28px',
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              width: '36px',
              height: '36px',
              right: '28px',
              top: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={24} color="#6A6A6A" />
          </button>

          {/* 제목 (가운데 정렬) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '40px',
            fontFamily: 'Pretendard',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '17px',
            color: '#000000',
            textAlign: 'center'
          }}>
            최근에 방문한 장소 중에
            <br />
            저장하고 싶은 장소가 있나요?
          </div>

          {/* 장소 검색 입력창 */}
          <div style={{
            position: 'absolute',
            width: '239px',
            height: '40px',
            left: '49px',
            top: '86px',
            background: '#EBEBEB',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              width: '42px',
              height: '10px',
              left: '10px',
              top: '6px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '8px',
              lineHeight: '10px',
              color: '#8E98A8'
            }}>
              장소 이름
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="장소를 검색하세요"
              style={{
                position: 'absolute',
                left: '10px',
                top: '20px',
                width: '219px',
                height: '16px',
                border: 'none',
                background: 'transparent',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '16px',
                color: '#000000',
                outline: 'none'
              }}
            />
          </div>

          {/* 검색 결과 드롭다운 (장소가 선택되지 않았을 때만 표시) */}
          {searchResults.length > 0 && !isPlaceSelected && (
            <div style={{
              position: 'absolute',
              left: '49px',
              top: '130px',
              width: '239px',
              maxHeight: '120px',
              background: '#FFFFFF',
              border: '1px solid #EBEBEB',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflowY: 'auto',
              zIndex: 10
            }}>
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handlePlaceSelect(place)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: index < searchResults.length - 1 ? '1px solid #F0F0F0' : 'none',
                    fontSize: '12px',
                    color: '#333',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{place.place_name}</div>
                  <div style={{ fontSize: '10px', color: '#8E98A8', marginTop: '2px' }}>
                    {place.address_name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 메뉴 입력창 */}
          <div style={{
            position: 'absolute',
            width: '239px',
            height: '40px',
            left: '49px',
            top: '146px',
            background: '#EBEBEB',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              width: '42px',
              height: '10px',
              left: '10px',
              top: '6px',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '8px',
              lineHeight: '10px',
              color: '#8E98A8'
            }}>
              먹은 메뉴
            </div>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="메뉴를 입력하세요"
              style={{
                position: 'absolute',
                left: '10px',
                top: '20px',
                width: '219px',
                height: '16px',
                border: 'none',
                background: 'transparent',
                fontFamily: 'Pretendard',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '16px',
                color: '#000000',
                outline: 'none'
              }}
            />
          </div>

          {/* 하루 동안 보지 않기 버튼 */}
          <button
            onClick={handleHideForDay}
            style={{
              position: 'absolute',
              left: '49px',
              bottom: '32px',
              background: 'transparent',
              border: 'none',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '12px',
              color: '#8E98A8',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            오늘 하루 동안 보지 않기
          </button>

          {/* 추가하기 버튼 */}
          <button
            onClick={handleAddPlace}
            disabled={!searchTerm.trim() || isSubmitting}
            style={{
              position: 'absolute',
              width: '115px',
              height: '29px',
              right: '49px',
              bottom: '28px',
              background: (!searchTerm.trim() || isSubmitting) ? '#D9D9D9' : '#6A6F82',
              borderRadius: '10px',
              border: `1px solid ${!searchTerm.trim() || isSubmitting ? '#D9D9D9' : '#6A6F82'}`,
              cursor: !searchTerm.trim() || isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            <span style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '15px',
              lineHeight: '18px',
              color: '#000000'
            }}>
              {isSubmitting ? '추가 중...' : '추가하기'}
            </span>
          </button>

          {/* 로딩 표시 */}
          {isLoading && !isPlaceSelected && (
            <div style={{
              position: 'absolute',
              left: '49px',
              top: '130px',
              width: '239px',
              padding: '8px 12px',
              background: '#FFFFFF',
              border: '1px solid #EBEBEB',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#8E98A8'
            }}>
              검색 중...
            </div>
          )}
          
          {/* 토스트 메시지 */}
          <Toast
            message={toastMessage}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            type="success"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlaceAddModal;
