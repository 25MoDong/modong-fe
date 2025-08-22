import { useState } from 'react';
import { X, MapPin, Clock, ChevronDown } from 'lucide-react';

const SavedHistory = () => {
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'outside'
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'name', 'rating'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  // 더미 데이터 (state로 관리)
  const [localPlaces, setLocalPlaces] = useState([
    {
      id: 1,
      name: '메롱메롱카페',
      distance: '300m 이내',
      hours: '영업시간: 10:00 - 17:00',
      similarity: '내 취향과의 유사도 85%',
      image: null
    },
    {
      id: 2,
      name: '돌멩이 베이커리',
      distance: '450m 이내',
      hours: '영업시간: 08:00 - 20:00',
      similarity: '내 취향과의 유사도 92%',
      image: null
    }
  ]);

  const [outsidePlaces, setOutsidePlaces] = useState([
    {
      id: 3,
      name: '강남 맛집',
      distance: '2.3km',
      hours: '영업시간: 11:00 - 22:00',
      similarity: '내 취향과의 유사도 78%',
      image: null
    }
  ]);

  const currentPlaces = activeTab === 'local' ? localPlaces : outsidePlaces;

  // 삭제 관련 함수들
  const handleDeleteClick = (place) => {
    setPlaceToDelete(place);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!placeToDelete) return;

    if (activeTab === 'local') {
      setLocalPlaces(prev => prev.filter(place => place.id !== placeToDelete.id));
    } else {
      setOutsidePlaces(prev => prev.filter(place => place.id !== placeToDelete.id));
    }

    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '390px',
      height: '100vh',
      margin: '0 auto',
      background: '#FFFFFF',
      borderRadius: '50px',
      overflow: 'hidden'
    }}>
      {/* 제목 */}
      <div style={{
        position: 'absolute',
        width: '83px',
        height: '29px',
        left: 'calc(50% - 83px/2 + 0.5px)',
        top: '49px',
        fontFamily: 'Pretendard',
        fontWeight: 600,
        fontSize: '24px',
        lineHeight: '29px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000000'
      }}>
        저장내역
      </div>

      {/* 탭 네비게이션 */}
      <div style={{
        position: 'absolute',
        top: '94px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '67px',
        paddingRight: '47px'
      }}>
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

      {/* 탭 구분선 */}
      <div style={{
        position: 'absolute',
        width: '390.01px',
        height: '0px',
        left: '-0.01px',
        top: '123.5px',
        border: '1.5px solid #B5B5B5'
      }} />
      
      {/* 활성 탭 표시선 */}
      <div style={{
        position: 'absolute',
        width: activeTab === 'local' ? '200px' : '190px',
        height: '0px',
        left: activeTab === 'local' ? '0px' : '200px',
        top: '123.5px',
        border: '1.5px solid #000000',
        transition: 'all 0.3s ease'
      }} />

      {/* 정렬 버튼 */}
      <div style={{
        position: 'absolute',
        width: '65px',
        height: '22px',
        left: '290px',
        top: '141px'
      }}>
        <div style={{
          position: 'absolute',
          left: '0%',
          right: '0%',
          top: '0%',
          bottom: '0%',
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
      <div style={{
        position: 'absolute',
        top: '179px',
        left: 'calc(50% - 323px/2 + 0.5px)',
        width: '323px',
        bottom: '90px',
        overflowY: 'auto',
        paddingBottom: '20px'
      }}>
        {currentPlaces.map((place, index) => (
          <div
            key={place.id}
            style={{
              width: '323px',
              height: '129px',
              background: '#FFFFFF',
              border: '1px solid #B5B5B5',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '10px',
              marginBottom: index < currentPlaces.length - 1 ? '16px' : '0',
              position: 'relative'
            }}
          >
            {/* 이미지 플레이스홀더 */}
            <div style={{
              position: 'absolute',
              left: '4.72%',
              right: '61.06%',
              top: '9.44%',
              bottom: '9.53%',
              background: '#000000',
              borderRadius: '10px'
            }} />

            {/* 장소명 */}
            <div style={{
              position: 'absolute',
              left: '44.58%',
              right: '29.72%',
              top: '10.85%',
              bottom: '74.42%',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '19px',
              display: 'flex',
              alignItems: 'center',
              color: '#000000'
            }}>
              {place.name}
            </div>

            {/* 거리 */}
            <div style={{
              position: 'absolute',
              left: '44.27%',
              right: '36.53%',
              top: '27.91%',
              bottom: '59.69%',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '16px',
              display: 'flex',
              alignItems: 'center',
              color: '#6A6F82'
            }}>
              {place.distance}
            </div>

            {/* 영업시간 */}
            <div style={{
              position: 'absolute',
              left: '44.58%',
              right: '24.15%',
              top: '43.41%',
              bottom: '47.29%',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: '12px',
              display: 'flex',
              alignItems: 'center',
              color: '#6A6F82'
            }}>
              {place.hours}
            </div>

            {/* 취향 유사도 */}
            <div style={{
              position: 'absolute',
              left: '44.58%',
              right: '25.7%',
              top: '71.32%',
              bottom: '19.38%',
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: '12px',
              display: 'flex',
              alignItems: 'center',
              color: '#6A6F82'
            }}>
              {place.similarity}
            </div>

            {/* X 삭제 아이콘 */}
            <button
              onClick={() => handleDeleteClick(place)}
              style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                right: '15px',
                top: '13px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} color="#9CA3AF" />
            </button>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        gap: '19px',
        position: 'absolute',
        width: '390px',
        height: '70px',
        left: '0px',
        top: '774px',
        background: '#FFFFFF'
      }}>
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

      {/* 하단 구분선 */}
      <div style={{
        position: 'absolute',
        width: '330px',
        height: '0px',
        left: '30px',
        top: '775px',
        border: '2px solid #D9D9D9'
      }} />

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
    </div>
  );
};

export default SavedHistory;