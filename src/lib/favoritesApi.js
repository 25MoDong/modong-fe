/**
 * 찜 목록 관련 API 연동
 * - 컬렉션(찜 목록) 생성, 조회, 수정, 삭제
 * - 장소를 컬렉션에 추가/제거
 * - 실제 백엔드 API와 연동
 */

import { 
  createJt, 
  findJtById, 
  updateJt, 
  deleteJt 
} from './jtApi';
import { 
  createJs, 
  getJsByJtId, 
  deleteJs 
} from './jsApi';
import { 
  getUserFavoriteStores,
  getAllFavoriteStores,
  addFavoriteStore,
  deleteFavoriteStore
} from './favoriteStoreApi';
import { getUserById } from './userApi';

// 현재 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
const getCurrentUserId = () => {
  return localStorage.getItem('MODONG_USER_ID') || '1';
};

// 찜 컬렉션 목록 조회 (집제목 목록)
export const loadCollections = async () => {
  try {
    const userId = getCurrentUserId();
    // 사용자별 찜 목록 조회
    const favoriteStores = await getUserFavoriteStores();
    
    // 집제목별로 그룹화하여 컬렉션 형태로 변환
    const collections = [];
    const processedJtIds = new Set();
    
    if (favoriteStores && Array.isArray(favoriteStores)) {
      for (const store of favoriteStores) {
        if (store.jtId && !processedJtIds.has(store.jtId)) {
          try {
            const jtInfo = await findJtById(store.jtId);
            const jsInfo = await getJsByJtId(store.jtId);
            
            collections.push({
              id: store.jtId,
              title: jtInfo.title || `컬렉션 ${store.jtId}`,
              description: jtInfo.description || '',
              count: Array.isArray(jsInfo) ? jsInfo.length : 0
            });
            
            processedJtIds.add(store.jtId);
          } catch (error) {
            console.error(`Failed to load collection ${store.jtId}:`, error);
          }
        }
      }
    }
    
    return collections;
  } catch (error) {
    console.error('Failed to load collections:', error);
    // 에러 시 로컬 저장소에서 캐시된 데이터 반환
    return getLocalCollections();
  }
};

// 로컬 저장소에서 캐시된 컬렉션 목록 조회 (백업용)
const getLocalCollections = () => {
  try {
    const raw = localStorage.getItem('MODONG_COLLECTIONS_CACHE');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// 컬렉션 목록을 로컬 저장소에 캐시
const cacheCollections = (collections) => {
  try {
    localStorage.setItem('MODONG_COLLECTIONS_CACHE', JSON.stringify(collections));
  } catch (error) {
    console.error('Failed to cache collections:', error);
  }
};

// 새 컬렉션 생성
export const addCollection = async (title, description = '') => {
  try {
    const userId = getCurrentUserId();
    
    const jtData = {
      userId: parseInt(userId),
      title,
      description
    };
    
    const result = await createJt(jtData);
    
    return {
      id: result.jtId || result.id,
      title,
      description,
      count: 0
    };
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error;
  }
};

// 컬렉션에 장소 추가
export const addPlaceToCollection = async (placeId, collectionId) => {
  try {
    const jsData = {
      jtId: collectionId,
      storeId: placeId
    };
    
    await createJs(jsData);
    return true;
  } catch (error) {
    console.error('Failed to add place to collection:', error);
    throw error;
  }
};

// 컬렉션에서 장소 제거
export const removePlaceFromCollection = async (placeId, collectionId) => {
  try {
    await deleteJs(collectionId, placeId);
    return true;
  } catch (error) {
    console.error('Failed to remove place from collection:', error);
    throw error;
  }
};

// 컬렉션 삭제
export const deleteCollection = async (collectionId) => {
  try {
    await deleteJt(collectionId);
    return true;
  } catch (error) {
    console.error('Failed to delete collection:', error);
    throw error;
  }
};

// 컬렉션의 장소 목록 조회
export const getCollectionPlaces = async (collectionId) => {
  try {
    const jsInfo = await getJsByJtId(collectionId);
    
    if (!Array.isArray(jsInfo)) {
      return [];
    }
    
    // storeId들을 실제 장소 정보로 변환
    const places = [];
    for (const js of jsInfo) {
      if (js.storeId) {
        // TODO: Store API가 있다면 실제 장소 정보 조회
        // 현재는 기본 구조만 반환
        places.push({
          id: js.storeId,
          name: `장소 ${js.storeId}`,
          category: '카페',
          address: '주소 정보 없음',
          // 추가 필드들...
        });
      }
    }
    
    return places;
  } catch (error) {
    console.error('Failed to get collection places:', error);
    return [];
  }
};

// 장소-컬렉션 매핑 정보 조회
export const loadMapping = async () => {
  try {
    const favoriteStores = await getUserFavoriteStores();
    const mapping = {};
    
    if (favoriteStores && Array.isArray(favoriteStores)) {
      for (const store of favoriteStores) {
        if (store.storeId && store.jtId) {
          if (!mapping[store.storeId]) {
            mapping[store.storeId] = [];
          }
          mapping[store.storeId].push(store.jtId);
        }
      }
    }
    
    return mapping;
  } catch (error) {
    console.error('Failed to load mapping:', error);
    return {};
  }
};

// 컬렉션별 장소 개수 다시 계산
export const recountCollectionCounts = async () => {
  try {
    const collections = await loadCollections();
    const updatedCollections = [];
    
    for (const collection of collections) {
      const places = await getCollectionPlaces(collection.id);
      updatedCollections.push({
        ...collection,
        count: places.length
      });
    }
    
    // 로컬 캐시 업데이트
    cacheCollections(updatedCollections);
    
    return updatedCollections;
  } catch (error) {
    console.error('Failed to recount collection counts:', error);
    return [];
  }
};

// 장소 정보 저장 (캐시용)
export const savePlace = (place) => {
  try {
    const cached = JSON.parse(localStorage.getItem('MODONG_PLACES_CACHE') || '{}');
    cached[place.id] = place;
    localStorage.setItem('MODONG_PLACES_CACHE', JSON.stringify(cached));
  } catch (error) {
    console.error('Failed to cache place:', error);
  }
};

// 캐시된 장소 정보 조회
export const loadPlace = (placeId) => {
  try {
    const cached = JSON.parse(localStorage.getItem('MODONG_PLACES_CACHE') || '{}');
    return cached[placeId] || null;
  } catch {
    return null;
  }
};

// 여러 장소를 컬렉션에서 토글 (추가/제거)
export const togglePlaceInCollection = async (placeId, collectionId) => {
  try {
    const mapping = await loadMapping();
    const currentCollections = mapping[placeId] || [];
    
    if (currentCollections.includes(collectionId)) {
      // 이미 있으면 제거
      await removePlaceFromCollection(placeId, collectionId);
    } else {
      // 없으면 추가
      await addPlaceToCollection(placeId, collectionId);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to toggle place in collection:', error);
    throw error;
  }
};

// 매핑 정보 저장 (API 연동 후 로컬 캐시 업데이트)
export const saveMapping = async (mapping) => {
  try {
    localStorage.setItem('MODONG_MAPPING_CACHE', JSON.stringify(mapping));
    return true;
  } catch (error) {
    console.error('Failed to save mapping cache:', error);
    return false;
  }
};