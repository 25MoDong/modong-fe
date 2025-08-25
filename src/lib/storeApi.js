import api, { encodePathSegment as encSeg } from './api';

/**
 * 가게/장소 관련 API 함수들 (OpenAPI v6 스펙 준수)
 * - 맵에 가게를 띄우는 기능 우선: 백엔드의 Store 엔드포인트를 직접 사용
 */

// OpenAPI: GET /api/v7/getAllLocations — returns storeId + lat/lng
export const getAllLocations = async () => {
  try {
    const res = await api.get('/api/v7/getAllLocations');
    const items = res.data || res;
    if (!Array.isArray(items)) return [];
    // Expecting [{ storeId, posX, posY, storeName?, category? }]
    return items.map((it) => ({
      id: it.storeId || it.id || it._id,
      storeId: it.storeId || it.id || it._id,
      name: it.storeName || it.name || '',
      category: it.category || '기타',
      coordinates: (it.posX != null && it.posY != null) ? { lat: Number(it.posY), lng: Number(it.posX) } : null,
    }));
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
};

// OpenAPI: GET /api/v7/store/{storeId} - returns posX/posY for specific store
export const getLocationByStoreId = async (storeId) => {
  try {
    if (!storeId) return null;
    const res = await api.get(`/api/v7/store/${encSeg(storeId)}`);
    const it = res.data || res;
    if (!it) return null;
    // Expecting { storeId, posX, posY }
    if (it.posX == null || it.posY == null) return null;
    return { lat: Number(it.posY), lng: Number(it.posX) };
  } catch (error) {
    console.error('Failed to fetch location by storeId:', error);
    return null;
  }
};

// OpenAPI: GET /api/v6/{storeId}
export const getStoreById = async (storeId) => {
  try {
    // Try to return cached normalized store if available and fresh
    const cached = readStoreCache(storeId);
    if (cached) return cached;

    const res = await api.get(`/api/v6/${encSeg(storeId)}`);
    const store = res.data || res;
    const normalized = normalizeStore(store);
    writeStoreCache(normalized.id, normalized);
    return normalized;
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
    return stores.map(s => {
      const id = s.storeId || s.id || s._id;
      const cached = id ? readStoreCache(id) : null;
      if (cached) return cached;
      const norm = normalizeStore(s);
      if (norm && norm.id) writeStoreCache(norm.id, norm);
      return norm;
    });
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
    return stores.map(s => {
      const id = s.storeId || s.id || s._id;
      const cached = id ? readStoreCache(id) : null;
      if (cached) return cached;
      const norm = normalizeStore(s);
      if (norm && norm.id) writeStoreCache(norm.id, norm);
      return norm;
    });
  } catch (error) {
    console.error('Failed to fetch stores by category:', error);
    return [];
  }
};

// OpenAPI: POST /api/v6/createStore
export const createStore = async (payload) => {
  const res = await api.post('/api/v6/createStore', payload);
  const store = res.data || res;
  const norm = normalizeStore(store);
  if (norm && norm.id) writeStoreCache(norm.id, norm);
  return norm;
};

// OpenAPI: PUT /api/v6/{storeId}
export const updateStore = async (storeId, payload) => {
  const res = await api.put(`/api/v6/${encSeg(storeId)}`, payload);
  const store = res.data || res;
  const norm = normalizeStore(store);
  if (norm && norm.id) writeStoreCache(norm.id, norm);
  return norm;
};

// OpenAPI: DELETE /api/v6/{storeId}
export const deleteStore = async (storeId) => {
  await api.delete(`/api/v6/${encSeg(storeId)}`);
  return true;
};

// 정규화: 백엔드 스키마(StoreResponseDto)를 프런트 공용 형태로 변환
function normalizeStore(s) {
  if (!s) return s;

  // Remove noisy debug logs; normalization can be expensive so we cache results externally

  // 실제 백엔드 응답 구조에 맞춤
  return {
    id: s.storeId || s.id || s._id,
    storeId: s.storeId || s.id || s._id, // 호환성 유지
    name: s.storeName || s.name || s.title || s.store || '',
    storeName: s.storeName || s.name || s.title || s.store || '', // 호환성 유지
    category: s.category || '기타',
    address: s.detail || s.address || s.address?.full || '',
    detail: s.detail || s.address || '', // InfoWindow에서 사용
    description: s.description,
    phone: s.phone,
    operatingHours: s.operatingHours,
    mainMenu: s.mainMenu,
    images: s.images || [],
    tags: toTags(s.storeMood || s.tags || s.storeMood),
    storeMood: s.storeMood || s.tags || s.storeMood, // 원본 데이터도 유지
    rating: s.rating || 4.0,
    reviewCount: s.reviewCount || 0,
    contact: { phone: s.phone },
    hours: s.operatingHours,
    // 좌표는 v7 위치 API를 통해 별도로 획득하여 병합함
    coordinates: s.coordinates || (s.location ? { lat: s.location.lat, lng: s.location.lng } : null) || null,
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

// 더미 데이터 제거: v7 위치 API 실패 시 빈 배열 반환

// --- simple localStorage cache for normalized stores ---
const STORE_CACHE_PREFIX = 'MODONG_STORE_';
const STORE_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function readStoreCache(storeId) {
  if (!storeId) return null;
  try {
    const raw = localStorage.getItem(STORE_CACHE_PREFIX + String(storeId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || !parsed.data) return null;
    if (Date.now() - parsed.ts > STORE_CACHE_TTL) {
      localStorage.removeItem(STORE_CACHE_PREFIX + String(storeId));
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
}

function writeStoreCache(storeId, normalized) {
  if (!storeId || !normalized) return;
  try {
    const payload = { ts: Date.now(), data: normalized };
    localStorage.setItem(STORE_CACHE_PREFIX + String(storeId), JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}
