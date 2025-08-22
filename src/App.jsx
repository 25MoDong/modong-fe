import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Map from './pages/Map';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import PlaceDetail from './pages/PlaceDetail'; 
import MyPage from './pages/MyPage';
import WriteReview from './pages/WriteReview';
import ReviewComplete from './pages/ReviewComplete';
import SavedHistory from './pages/SavedHistory';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="favorites"
          element={<Favorites />}
        />
        <Route path="map" element={<Map />} />
        <Route
          path="community"
          element={<div className="p-8">커뮤니티 페이지 (구현 예정)</div>}
        />
        <Route path="profile" element={<MyPage />} />
        <Route
          path="search"
          element={<Search/>}
        />
        <Route 
          path="place/:id" 
          element={<PlaceDetail />} 
        />
        <Route 
          path="write-review" 
          element={<WriteReview />} 
        />
        <Route 
          path="review-complete" 
          element={<ReviewComplete />} 
        />
        <Route 
          path="saved-history" 
          element={<SavedHistory />} 
        />
        <Route 
          path="my-reviews" 
          element={<div className="p-8 text-center"><h1 className="text-2xl font-semibold mb-4">내가 쓴 후기</h1><p className="text-gray-600">구현 예정입니다.</p></div>} 
        />
        <Route 
          path="coupons" 
          element={<div className="p-8 text-center"><h1 className="text-2xl font-semibold mb-4">쿠폰</h1><p className="text-gray-600">구현 예정입니다.</p></div>} 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
