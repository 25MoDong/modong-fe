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
  deleteJt,
  getAllJt
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
import userStore from './userStore';

// 현재 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
const getCurrentUserId = () => {
  return userStore.getUserId() || null;
};

// 찜 컬렉션 목록 조회 (집제목 목록)
export const loadCollections = async () => {
  try {
    const userId = getCurrentUserId();
    // Use v3 jt listing to build collections (prefer server-side jt model)
    const allJt = await getAllJt();

    // Filter jt records by current user if possible
    const myJt = Array.isArray(allJt)
      ? allJt.filter(j => {
          if (!userId) return false;
          // try common user fields
          return String(j.userId || j.user || j.creator || j.memberId || '') === String(userId);
        })
      : [];

    const collections = [];
    for (const jt of myJt) {
      try {
        const jtId = jt.jtId || jt.id || jt.jt || jt.idx || jt._id;
        const jsInfo = jtId ? await getJsByJtId(jtId) : [];
        collections.push({
          id: jtId,
          title: jt.title || jt.name || `컬렉션 ${jtId}`,
          description: jt.description || '',
          count: Array.isArray(jsInfo) ? jsInfo.length : 0,
          raw: jt
        });
      } catch (err) {
        console.warn('Failed to load js info for jt', jt, err);
        collections.push({ id: jt.jtId || jt.id, title: jt.title || jt.name || '컬렉션', description: jt.description || '', count: 0, raw: jt });
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
    if (!userId) throw new Error('No user selected');

    const jtData = {
      userId,
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
    // Build mapping from v3/v4 data: use getAllJt + getJsByJtId
    const userId = getCurrentUserId();
    const allJt = await getAllJt();
    const mapping = {};

    const myJt = Array.isArray(allJt)
      ? allJt.filter(j => {
          if (!userId) return false;
          return String(j.userId || j.user || j.creator || j.memberId || '') === String(userId);
        })
      : [];

    for (const jt of myJt) {
      const jtId = jt.jtId || jt.id || jt.jt || jt.idx || jt._id;
      if (!jtId) continue;
      try {
        const jsList = await getJsByJtId(jtId) || [];
        (jsList || []).forEach(js => {
          const sid = js.storeId || js.store || js.id || js.storeName || js.name;
          if (!sid) return;
          if (!mapping[String(sid)]) mapping[String(sid)] = [];
          mapping[String(sid)].push(jtId);
        });
      } catch (err) {
        console.warn('Failed to load js list for jt', jtId, err);
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
