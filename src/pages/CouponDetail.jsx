import { useParams, useNavigate } from 'react-router-dom';
import { useCoupons } from '../lib/couponsStorage';

function Barcode({ code }) {
  // simple barcode-like renderer based on binary of chars
  const bits = Array.from(code).flatMap((ch) => {
    const b = ch.charCodeAt(0).toString(2).padStart(8, '0');
    return b.split('');
  });

  return (
    <div className="mt-6 p-4 bg-white rounded-xl flex justify-center">
      <div className="flex items-end" style={{ height: 140 }}>
        {bits.map((bit, i) => (
          <div key={i} style={{ width: 4, margin: '0 1px', height: bit === '1' ? 120 : 40, background: bit === '1' ? '#111' : '#fff' }} />
        ))}
      </div>
    </div>
  );
}

export default function CouponDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupons] = useCoupons();

  const coupon = coupons.find((c) => c.id === id);

  if (!coupon) {
    return (
      <div className="p-6">
        <div className="text-center">해당 쿠폰을 찾을 수 없습니다.</div>
        <div className="mt-4 text-center"><button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary-500 text-white rounded">뒤로</button></div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-100 min-h-screen">
      <div className="max-w-sm mx-auto h-screen overflow-y-auto scrollbar-hide p-4 pb-24">
        <div className="text-center mt-2">
          <h1 className="text-2xl font-semibold">쿠폰 상세</h1>
        </div>

        <section className="mt-4 bg-white rounded-xl p-6">
          <div className="font-semibold text-lg">{coupon.title}</div>
          <div className="text-sm text-gray-500 mt-2">{coupon.description}</div>

          <Barcode code={coupon.code} />

          <div className="mt-4 text-center text-xs text-gray-500">쿠폰 코드: {coupon.code}</div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">목록으로</button>
          </div>
        </section>
      </div>
    </div>
  );
}

