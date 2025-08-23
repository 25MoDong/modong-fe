import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Edit3, FileText, Tag } from 'lucide-react';
import { loadMapping, loadPlace } from '../lib/favoritesStorage';
import { dummyPlaces } from '../lib/dummyData';

// hook for places added via PlaceAddModal (key: favorite_places)
function usePlaceAddSaved() {
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('favorite_places');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favorite_places', JSON.stringify(saved));
    } catch (e) {}
  }, [saved]);

  // listen to storage events from other tabs/windows and focus to resync
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'favorite_places') {
        try {
          setSaved(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {
          setSaved([]);
        }
      }
    }

    function handleFocus() {
      try {
        const raw = localStorage.getItem('favorite_places');
        setSaved(raw ? JSON.parse(raw) : []);
      } catch (err) {
        setSaved([]);
      }
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return [saved, setSaved];
}

export default function MyPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = usePlaceAddSaved();
  const [toDelete, setToDelete] = useState(null);
  const [stampCount, setStampCount] = useState(() => {
    return parseInt(localStorage.getItem('stamp_count') || '0');
  });

  useEffect(() => {
    const handleStampUpdate = () => {
      setStampCount(parseInt(localStorage.getItem('stamp_count') || '0'));
    };
    
    window.addEventListener('storage', handleStampUpdate);
    window.addEventListener('focus', handleStampUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStampUpdate);
      window.removeEventListener('focus', handleStampUpdate);
    };
  }, []);

  function openDeleteModal(id) {
    setToDelete(id);
  }

  function doDelete() {
    setSaved((s) => s.filter((i) => i.id !== toDelete));
    setToDelete(null);
  }

  return (
    <div className="bg-secondary-100 min-h-screen">
      <div className="max-w-sm mx-auto h-screen overflow-y-auto scrollbar-hide p-4 pb-24">
        {/* Header */}
        <div className="text-center mt-2">
          <h1 className="text-2xl font-semibold">마이페이지</h1>
        </div>

        {/* Profile card */}
        <section className="bg-white rounded-3xl mt-4 px-6 py-8 relative">
          <div className="flex justify-center -mt-12">
            <div className="w-20 h-20 rounded-full bg-secondary-400 border-2 border-primary-500 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/dolmaeng.png" 
                alt="프로필" 
                className="w-full h-full rounded-full object-contain"
                draggable="false"
                style={{ WebkitUserDrag: 'none' }}
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-semibold">진지한 돌멩이</div>
          </div>

          {/* top stats / shortcuts - styled to match Rectangle 161124025 */}
          <div className="mt-6 w-full flex justify-center">
            <div className="w-[345px] h-[108px] bg-white border border-[#B5B5B5] rounded-[15px] flex items-center justify-between px-4">
              {/* 저장내역 */}
              <button onClick={() => navigate('/saved-history')} className="flex flex-col items-center focus:outline-none">
                <div className="w-[35px] h-[35px] rounded flex items-center justify-center bg-primary-500 text-white">
                  <Bookmark size={18} />
                </div>
                <div className="mt-2 text-[10px] font-[600] text-[#B5B5B5]">저장내역</div>
                <div className="text-[10px] font-[600] text-[#FFC5D2] mt-1">({saved.length})</div>
              </button>

              {/* 내가 쓴 후기 */}
              <button onClick={() => navigate('/my-reviews')} className="flex flex-col items-center focus:outline-none">
                <div className="w-[35px] h-[35px] rounded flex items-center justify-center bg-primary-500 text-white">
                  <FileText size={18} />
                </div>
                <div className="mt-2 text-[10px] font-[600] text-[#B5B5B5]">내가 쓴 후기</div>
                <div className="text-[10px] font-[600] text-[#FFC5D2] mt-1">(5)</div>
              </button>

              {/* 후기쓰기 */}
              <button onClick={() => navigate('/write-review')} className="flex flex-col items-center focus:outline-none">
                <div className="w-[35px] h-[35px] rounded flex items-center justify-center bg-primary-500 text-white">
                  <Edit3 size={18} />
                </div>
                <div className="mt-2 text-[10px] font-[600] text-[#B5B5B5]">후기쓰기</div>
                <div className="text-[10px] font-[600] text-[#FFC5D2] mt-1">(10)</div>
              </button>

              {/* 쿠폰 */}
              <button onClick={() => navigate('/coupons')} className="flex flex-col items-center focus:outline-none">
                <div className="w-[38px] h-[38px] rounded flex items-center justify-center bg-primary-500 text-white">
                  <Tag size={18} />
                </div>
                <div className="mt-2 text-[10px] font-[600] text-[#B5B5B5]">쿠폰</div>
                <div className="text-[10px] font-[600] text-[#B5B5B5] mt-1">&nbsp;</div>
              </button>
            </div>
          </div>

          {/* 돌멩이 스탬프 섹션 */}
          <div className="mt-6 w-full">
            <div className="text-lg font-semibold mb-2">돌멩이 스탬프</div>
            <div className="text-sm text-gray-500 mb-4">스탬프를 다 모아서 특별한 보상을 획득해요!</div>
            
            {/* 스탬프 컨테이너 */}
            <div className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg p-6">
              {/* 진행률 표시 */}
              <div className="mb-4 text-center">
                <span className="text-lg font-semibold text-primary-500">{stampCount}</span>
                <span className="text-gray-600"> / 10</span>
              </div>
              
              {/* 스탬프 그리드 (2행 5열) */}
              <div className="grid grid-cols-5 gap-4 justify-items-center">
                {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      index < stampCount
                        ? 'bg-primary-500 border-primary-500 shadow-md'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {index < stampCount && (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 완료 시 축하 메시지 */}
              {stampCount === 10 && (
                <div className="mt-4 text-center text-primary-500 font-semibold animate-pulse">
                  🎉 모든 스탬프를 수집했습니다! 🎉
                </div>
              )}
            </div>
          </div>
        </section>

        {/* delete confirmation modal overlay (animated) */}
        <AnimatePresence>
          {toDelete !== null && (
            <DeleteModal key="delete-modal" onClose={() => setToDelete(null)} onConfirm={() => { doDelete(); }}>
              <h4 className="text-lg font-semibold">선택한 장소를 삭제하시겠습니까?</h4>
              <p className="text-sm text-gray-500 mt-2">삭제하시면 이 장소에 대한 모든 취향정보가 사라집니다.</p>
            </DeleteModal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DeleteModal({ children, onClose, onConfirm }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // simple focus trap
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length-1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault(); last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault(); first.focus();
          }
        }
      }
    }
    document.addEventListener('keydown', onKey);
    // focus first focusable
    setTimeout(() => {
      const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
    }, 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/40">
      <motion.div ref={modalRef} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-6 rounded-xl w-96">
        <div>{children}</div>
        <div className="mt-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">취소</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-primary-500 text-white rounded">삭제하기</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
