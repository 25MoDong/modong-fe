import { useNavigate } from 'react-router-dom';
import { useCoupons } from '../lib/couponsStorage';

export default function Coupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useCoupons();

  function handleAddDummy() {
    const id = `coupon-${Date.now()}`;
    const item = {
      id,
      title: '샘플 쿠폰',
      description: '테스트용 쿠폰입니다.',
      code: `MDNG-${Date.now()}`,
      validUntil: null,
    };
    setCoupons((s) => [item, ...s]);
  }

  return (
    <div className="bg-secondary-100 min-h-screen">
      <div className="max-w-sm mx-auto h-screen overflow-y-auto scrollbar-hide p-4 pb-24">
        <div className="text-center mt-2">
          <h1 className="text-2xl font-semibold">내 쿠폰</h1>
        </div>

        <section className="mt-4">
          {coupons.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-600">보유한 쿠폰이 없습니다.</p>
              <div className="mt-4">
                <button onClick={handleAddDummy} className="px-4 py-2 bg-primary-500 text-white rounded">샘플 쿠폰 추가</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <button key={c.id} onClick={() => navigate(`/coupons/${c.id}`)} className="w-full text-left bg-white rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{c.description}</div>
                  </div>
                  <div className="text-xs text-gray-400">보기</div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

