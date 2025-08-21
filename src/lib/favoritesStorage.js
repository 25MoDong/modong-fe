// 키 한 곳에서 관리
const K = {
  collections: 'fav_collections',      // [{id, title, description, count}]
  mapping: 'fav_mapping',              // { [placeId]: number[] }  (보석함 id 배열)
};

// 기본 보석함 샘플 (최초 1회)
const DEFAULT_COLLECTIONS = [
  { id: 1, title: '카공하기 좋은 곳', description: '', count: 3 },
  { id: 2, title: '빙수 맛있는 곳',   description: '', count: 2 },
];

export function loadCollections() {
  const raw = localStorage.getItem(K.collections);
  if (!raw) {
    localStorage.setItem(K.collections, JSON.stringify(DEFAULT_COLLECTIONS));
    return [...DEFAULT_COLLECTIONS];
  }
  try { return JSON.parse(raw) || []; } catch { return []; }
}

export function saveCollections(list) {
  localStorage.setItem(K.collections, JSON.stringify(list));
}

export function loadMapping() {
  const raw = localStorage.getItem(K.mapping);
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export function saveMapping(map) {
  localStorage.setItem(K.mapping, JSON.stringify(map));
}

// placeId 를 보석함들에 저장/해제 토글
export function togglePlaceInCollection(placeId, collectionId) {
  const map = loadMapping();
  const set = new Set(map[placeId] || []);
  set.has(collectionId) ? set.delete(collectionId) : set.add(collectionId);
  map[placeId] = Array.from(set);
  saveMapping(map);
  return map[placeId];
}

// 보석함 추가
export function addCollection({ title, description }) {
  const list = loadCollections();
  const newItem = { id: Date.now(), title, description: description || '', count: 0 };
  const next = [...list, newItem];
  saveCollections(next);
  return newItem;
}

// 보석함별 포함 개수 재계산(카운트 싱크)
export function recountCollectionCounts() {
  const list = loadCollections();
  const map = loadMapping();
  const counter = {};
  Object.values(map).forEach(ids => (ids || []).forEach(id => { counter[id] = (counter[id] || 0) + 1; }));
  const next = list.map(c => ({ ...c, count: counter[c.id] || 0 }));
  saveCollections(next);
  return next;
}
