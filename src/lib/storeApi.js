import api from './api';

/**
 * 가게/장소 관련 API 함수들 (OpenAPI v6 스펙 준수)
 * - 맵에 가게를 띄우는 기능 우선: 백엔드의 Store 엔드포인트를 직접 사용
 */

// OpenAPI: GET /api/v6/getAllStores
export const getAllStores = async () => {
  try {
    const res = await api.get('/api/v6/getAllStores');
    const stores = res.data || res; // fetch 래퍼/axios 혼용 대비
    if (!Array.isArray(stores)) return [];
    return stores.map(normalizeStore);
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return getDummyStores();
  }
};

// OpenAPI: GET /api/v6/{storeId}
export const getStoreById = async (storeId) => {
  try {
    const res = await api.get(`/api/v6/${storeId}`);
    const store = res.data || res;
    return normalizeStore(store);
  } catch (error) {
    console.error('Failed to fetch store by ID:', error);
    return null;
  }
};

// OpenAPI: GET /api/v6/search?name=...
export const searchStores = async (name) => {
  try {
    const res = await api.get(`/api/v6/search?name=${encodeURIComponent(name || '')}`);
    const stores = res.data || res;
    if (!Array.isArray(stores)) return [];
    return stores.map(normalizeStore);
  } catch (error) {
    console.error('Failed to search stores:', error);
    return [];
  }
};

// OpenAPI: GET /api/v6/category/{category}
export const getStoresByCategory = async (category) => {
  try {
    const res = await api.get(`/api/v6/category/${encodeURIComponent(category)}`);
    const stores = res.data || res;
    if (!Array.isArray(stores)) return [];
    return stores.map(normalizeStore);
  } catch (error) {
    console.error('Failed to fetch stores by category:', error);
    return [];
  }
};

// OpenAPI: POST /api/v6/createStore
export const createStore = async (payload) => {
  const res = await api.post('/api/v6/createStore', payload);
  const store = res.data || res;
  return normalizeStore(store);
};

// OpenAPI: PUT /api/v6/{storeId}
export const updateStore = async (storeId, payload) => {
  const res = await api.put(`/api/v6/${storeId}`, payload);
  const store = res.data || res;
  return normalizeStore(store);
};

// OpenAPI: DELETE /api/v6/{storeId}
export const deleteStore = async (storeId) => {
  await api.delete(`/api/v6/${storeId}`);
  return true;
};

// 정규화: 백엔드 스키마(StoreResponseDto)를 프런트 공용 형태로 변환
function normalizeStore(s) {
  if (!s) return s;
  // Note: backend provides address in `detail` string. We geocode later if no coords.
  return {
    id: s.storeId || s.id,
    name: s.storeName || s.name,
    category: s.category || '기타',
    address: s.detail || s.address,
    description: s.description,
    images: s.images || [],
    tags: toTags(s.storeMood),
    rating: s.rating,
    reviewCount: s.reviewCount,
    contact: { phone: s.phone },
    hours: s.operatingHours ? { isOpen: true, todayHours: s.operatingHours } : undefined,
    // 좌표 정보가 스펙에 없다면 null로 두고, 클라이언트에서 지오코딩 수행
    coordinates: s.coordinates || null,
  };
}

function toTags(mood) {
  if (!mood) return [];
  // 문자열 내 개행으로 구분되어 오는 스펙을 태그 배열로 변환
  if (typeof mood === 'string') {
    return mood
      .split(/\r?\n|,/) // 개행 또는 콤마 기준 분리
      .map(v => v.trim())
      .filter(Boolean)
      .slice(0, 4);
  }
  if (Array.isArray(mood)) return mood.slice(0, 4);
  return [];
}

// 유틸리티 함수들
const generateRandomDistance = () => {
  const distances = ['0.2km', '0.5km', '0.8km', '1.1km', '1.5km', '2.0km'];
  return distances[Math.floor(Math.random() * distances.length)];
};

const generateRandomPhone = () => {
  return `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// 더미 데이터 (API 실패 시 사용)
const getDummyStores = () => [
  {
    id: 1,
    name: '돌맹돌맹 카페',
    category: '카페',
    address: '서울시 강남구 역삼동',
    rating: 4.5,
    reviewCount: 127,
    tags: ['조용한', '와이파이', '디저트'],
    images: ['/images/cafe1.jpg'],
    hours: { isOpen: true, todayHours: '08:00 - 22:00' },
    distance: '0.3km'
  },
  {
    id: 2,
    name: '맛있는 파스타집',
    category: '레스토랑',
    address: '서울시 강남구 신사동',
    rating: 4.8,
    reviewCount: 89,
    tags: ['맛있는', '분위기좋은', '데이트'],
    images: ['/images/restaurant1.jpg'],
    hours: { isOpen: true, todayHours: '11:00 - 23:00' },
    distance: '0.7km'
  },
  {
    id: 3,
    name: '독서하기 좋은 북카페',
    category: '카페',
    address: '서울시 강남구 청담동',
    rating: 4.3,
    reviewCount: 156,
    tags: ['조용한', '독서', '힐링'],
    images: ['/images/bookcafe1.jpg'],
    hours: { isOpen: false, todayHours: '09:00 - 21:00' },
    distance: '1.2km'
  }
];
