import { Map } from 'react-kakao-maps-sdk';
import SearchBar from '../components/common/SearchBar';
import useKakaoLoader from '../hooks/useKakaoLoader';

const MapPage = () => {
  useKakaoLoader();

  return (
    <div className="w-full h-screen mx-auto">
      <div className='relative w-full h-full'>
        <Map
          id="map"
          center={{
            lat: 37.6106, // 성북구 좌표로 변경
            lng: 126.9977,
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
          level={4}
          />
          <div className='absolute top-12 left-5 right-5 z-10'>
            <SearchBar variant='dark'/>
          </div>


      </div>
    </div>
  );
};

export default MapPage;
