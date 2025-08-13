import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import MapPage from './pages/Map';
import Prepare from './pages/Prepare';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Prepare />} />
                    <Route path="recommend" element={<div className="p-8">찜 페이지 (구현 예정)</div>} />
                    <Route path='map' element={<MapPage/>}/>
                    <Route path="profile" element={<div className="p-8">프로필 페이지 (구현 예정)</div>} />
                </Route>
            </Routes>
        </Router>
  );
}

export default App;
