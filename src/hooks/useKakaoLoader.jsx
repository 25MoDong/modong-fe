import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';

export default function useKakaoLoader() {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  const opts = {
    appkey: apiKey && apiKey !== 'YOUR_KAKAO_MAP_API_KEY_HERE' ? apiKey : undefined,
    libraries: ['clusterer', 'drawing', 'services']
  };

  // Always call the original hook to satisfy Rules of Hooks
  const loader = useKakaoLoaderOrigin(opts);

  if (!apiKey || apiKey === 'YOUR_KAKAO_MAP_API_KEY_HERE') {
    // Warn but do not early-return (hook already invoked)
    console.warn('카카오맵 API 키가 설정되지 않았습니다. .env.local 파일에 VITE_KAKAO_MAP_API_KEY를 실제 API 키로 설정해주세요.');
  }

  return loader;
}
