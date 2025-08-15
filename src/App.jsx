import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import MapPage from './pages/Map';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="recommend"
          element={<div className="p-8">찜 페이지 (구현 예정)</div>}
        />
        <Route path="map" element={<MapPage />} />
        <Route
          path="community"
          element={<div className="p-8">커뮤니티 페이지 (구현 예정)</div>}
        />
        <Route
          path="profile"
          element={<div className="p-8">프로필 페이지 (구현 예정)</div>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
