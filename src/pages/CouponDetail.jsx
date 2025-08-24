import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadCoupons } from '../lib/couponsStorage';

// 간단한 바코드 생성 함수
const generateBarcode = (code) => {
  const bars = [];
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i) % 10;
    // 각 숫자에 따라 다른 패턴의 바 생성
    for (let j = 0; j < char + 1; j++) {
      bars.push(j % 2 === 0 ? 'thick' : 'thin');
    }
  }
  return bars;
};

const BarcodeDisplay = ({ barcode }) => {
  const bars = generateBarcode(barcode.replace('-', ''));
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">바코드</h3>
        
        {/* 바코드 시각화 */}
        <div className="bg-white border border-gray-300 p-4 rounded-lg mb-3 flex justify-center items-center" style={{ height: '120px' }}>
          <div className="flex items-end space-x-px">
            {bars.map((bar, index) => (
              <div
                key={index}
                className="bg-black"
                style={{
                  width: bar === 'thick' ? '3px' : '1px',
                  height: '80px'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* 바코드 번호 */}
        <div className="text-sm font-mono text-gray-700 tracking-widest">
          {barcode}
        </div>
      </div>
    </div>
  );
};

export default function CouponDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // location state에서 쿠폰 정보를 먼저 확인
    if (location.state?.coupon) {
      setCoupon(location.state.coupon);
      setLoading(false);
      return;
    }

    // state가 없으면 로컬 스토리지에서 찾기
    const coupons = loadCoupons();
    const foundCoupon = coupons.find(c => c.id === id);
    
    if (foundCoupon) {
      setCoupon(foundCoupon);
    } else {
      // 쿠폰을 찾을 수 없으면 목록으로 이동
      navigate('/coupons', { replace: true });
    }
    
    setLoading(false);
  }, [id, location.state, navigate]);

  const handleBack = () => {
    navigate('/coupons');
  };

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <span className="text-sm text-gray-600">쿠폰 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">쿠폰을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="p-1 -ml-1 mr-3 hover:bg-gray-100 rounded-full"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">쿠폰</h1>
        </div>
      </div>

      {/* 쿠폰 상세 내용 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* 쿠폰 정보 카드 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {coupon.title}
              </h2>
              <p className="text-lg text-primary-600 font-semibold mb-1">
                {coupon.discountText}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {coupon.description}
              </p>
              
              {/* 매장 정보 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">매장</span>
                    <span>{coupon.store}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">유효기간</span>
                    <span>~{coupon.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* 사용 상태 표시 */}
              {coupon.isUsed ? (
                <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-medium">
                  사용 완료된 쿠폰
                </div>
              ) : (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  사용 가능한 쿠폰
                </div>
              )}
            </div>
          </div>

          {/* 바코드 표시 */}
          <BarcodeDisplay barcode={coupon.barcode} />

          {/* 사용 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">사용 방법</h3>
            <p className="text-sm text-blue-700">
              매장에서 결제 시 위의 바코드를 보여주세요. 쿠폰 할인이 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}