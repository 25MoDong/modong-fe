import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout/Layout';

// lazy-loaded pages for better code-splitting
const Home = lazy(() => import('./pages/Home'));
const Map = lazy(() => import('./pages/Map'));
const Search = lazy(() => import('./pages/Search'));
const Favorites = lazy(() => import('./pages/Favorites'));
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'));
const MyPage = lazy(() => import('./pages/MyPage'));
const Coupons = lazy(() => import('./pages/Coupons'));
const CouponDetail = lazy(() => import('./pages/CouponDetail'));
const WriteReview = lazy(() => import('./pages/WriteReview'));
const ReviewComplete = lazy(() => import('./pages/ReviewComplete'));
const SavedHistory = lazy(() => import('./pages/SavedHistory'));
const MyReviews = lazy(() => import('./pages/MyReviews'));
const Redefinition = lazy(() => import('./components/Onboarding/Redefinition'));


export default function App() {
  return (
    <Suspense fallback={<div className="p-6">로딩 중...</div>}>
      <Routes>
        {/* 모든 페이지들을 레이아웃 포함으로 통합 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route 
            path="redefinition" 
            element={<Redefinition />} 
          />
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
          <Route path="my-reviews" element={<MyReviews />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="coupons/:id" element={<CouponDetail />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
