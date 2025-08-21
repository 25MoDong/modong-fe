// Map configuration constants
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 37.6106, // 성북구 중심
    lng: 126.9977
  },
  DEFAULT_ZOOM: 4,
  MIN_ZOOM: 1,
  MAX_ZOOM: 14
};

// Category configuration
export const CATEGORY_CONFIG = {
  restaurant: {
    name: '맛집',
    icon: '🍽️',
    color: '#FF6B6B',
    subcategories: {
      korean_food: '한식',
      chinese_food: '중식',
      japanese_food: '일식',
      western_food: '양식',
      asian_food: '아시안',
      dessert: '디저트'
    }
  },
  cafe: {
    name: '카페',
    icon: '☕',
    color: '#4ECDC4',
    subcategories: {
      specialty_coffee: '스페셜티 커피',
      chain_cafe: '프랜차이즈',
      dessert_cafe: '디저트 카페',
      study_cafe: '스터디 카페'
    }
  },
  attraction: {
    name: '관광지',
    icon: '🏛️',
    color: '#45B7D1',
    subcategories: {
      museum: '박물관',
      park: '공원',
      temple: '사찰',
      historic_site: '역사지'
    }
  },
  shopping: {
    name: '쇼핑',
    icon: '🛍️',
    color: '#9B59B6',
    subcategories: {
      market: '전통시장',
      mall: '쇼핑몰',
      boutique: '부티크',
      bookstore: '서점'
    }
  }
};

// Price range configuration
export const PRICE_RANGES = {
  '$': '1만원 이하',
  '$$': '1-3만원',
  '$$$': '3-5만원',
  '$$$$': '5만원 이상'
};

// Search configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 20
};