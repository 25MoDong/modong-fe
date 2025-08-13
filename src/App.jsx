import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import MapPage from './pages/Map';
import Prepare from './pages/Prepare';

export default function App() {
  return (
    <Routes>
      {/* 공통 레이아웃 */}
      <Route path="/" element={<Layout />}>
        {/* 루트 진입 = 홈 */}
        <Route index element={<Home />} />

        {/* 과거 링크 호환: /home 으로 오면 / 로 리다이렉트 */}
        <Route path="home" element={<Navigate to="/" replace />} />

        {/* 나머지 페이지 */}
        <Route path="recommend" element={<div className="p-8">찜 페이지 (구현 예정)</div>} />
        <Route path="map" element={<MapPage />} />
        <Route path="profile" element={<div className="p-8">프로필 페이지 (구현 예정)</div>} />
        <Route path="prepare" element={<Prepare />} />

        {/* 그 외 모든 경로 → 홈 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
