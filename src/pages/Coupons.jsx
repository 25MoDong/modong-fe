import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useCoupons, getAvailableCoupons } from '../lib/couponsStorage';

const CouponCard = ({ coupon, onClick }) => (
  <div 
    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(coupon)}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {coupon.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {coupon.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {coupon.store}
          </span>
          <span className="text-xs text-gray-400">
            ~{coupon.validUntil}
          </span>
        </div>
      </div>
      <div className="ml-4 text-right">
        <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {coupon.discountText}
        </div>
        {coupon.isUsed && (
          <div className="text-xs text-gray-400 mt-1">사용완료</div>
        )}
      </div>
    </div>
  </div>
);

export default function Coupons() {
  const navigate = useNavigate();
  const [coupons, loading] = useCoupons();
  
  // 사용 가능한 쿠폰과 사용된 쿠폰 분리
  const availableCoupons = coupons.filter(c => !c.isUsed);
  const usedCoupons = coupons.filter(c => c.isUsed);

  const handleCouponClick = (coupon) => {
    navigate(`/coupons/${coupon.id}`, { state: { coupon } });
  };

  const handleBack = () => {
    navigate(-1);
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

      {/* 쿠폰 개수 표시 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="text-sm text-gray-600">
          사용 가능한 쿠폰 <span className="font-semibold text-primary-600">{availableCoupons.length}</span>개
        </div>
      </div>

      {/* 쿠폰 리스트 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* 사용 가능한 쿠폰 */}
          {availableCoupons.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">사용 가능한 쿠폰</h2>
              {availableCoupons.map(coupon => (
                <CouponCard 
                  key={coupon.id} 
                  coupon={coupon} 
                  onClick={handleCouponClick}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📄</div>
              <p className="text-gray-600">사용 가능한 쿠폰이 없습니다</p>
            </div>
          )}

          {/* 사용된 쿠폰 */}
          {usedCoupons.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 mt-8">사용 완료된 쿠폰</h2>
              <div className="space-y-3 opacity-60">
                {usedCoupons.map(coupon => (
                  <CouponCard 
                    key={coupon.id} 
                    coupon={coupon} 
                    onClick={handleCouponClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}