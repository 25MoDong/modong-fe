import { Map } from 'react-kakao-maps-sdk';
import useKakaoLoader from './useKakaoLoader';

const MapPage = () => {
  useKakaoLoader();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        성북구 맛집 지도
      </h1>

      <Map
        id="map"
        center={{
          lat: 37.5665, // 성북구 좌표로 변경
          lng: 127.0135,
        }}
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
        level={5}
      />
    </div>
  );
};

export default MapPage;
