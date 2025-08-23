import api from './api';

/**
 * 가게/장소 관련 API 함수들
 * 현재 백엔드에 Store 전용 API가 없으므로, 기존 API들을 활용하여 구현
 */

// 모든 가게 정보 조회 (후기 API를 통해 가게 정보 추출)
export const getAllStores = async () => {
  try {
    // 모든 후기를 조회하여 가게 정보 추출
    const response = await api.get('/api/v2/getAllReview');
    const reviews = response.data;
    
    if (!Array.isArray(reviews)) {
      return [];
    }
    
    // 후기에서 고유한 가게 정보 추출
    const storeMap = new Map();
    
    reviews.forEach(review => {
      if (review.storeId && !storeMap.has(review.storeId)) {
        storeMap.set(review.storeId, {
          id: review.storeId,
          name: review.storeName || `가게 ${review.storeId}`,
          category: review.category || '카페',
          address: review.address || '주소 정보 없음',
          rating: calculateAverageRating(reviews.filter(r => r.storeId === review.storeId)),
          reviewCount: reviews.filter(r => r.storeId === review.storeId).length,
          tags: extractTags(reviews.filter(r => r.storeId === review.storeId)),
          images: review.images || [],
          // 추가 더미 정보
          hours: {
            isOpen: true,
            todayHours: '09:00 - 21:00'
          },
          distance: generateRandomDistance(),
        });
      }
    });
    
    return Array.from(storeMap.values());
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return getDummyStores();
  }
};

// 특정 가게 정보 조회 (후기를 통해)
export const getStoreById = async (storeId) => {
  try {
    const response = await api.get(`/api/v2/storeReview/${storeId}`);
    const reviews = response.data;
    
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return null;
    }
    
    const firstReview = reviews[0];
    
    return {
      id: storeId,
      name: firstReview.storeName || `가게 ${storeId}`,
      category: firstReview.category || '카페',
      address: firstReview.address || '주소 정보 없음',
      rating: calculateAverageRating(reviews),
      reviewCount: reviews.length,
      tags: extractTags(reviews),
      images: firstReview.images || [],
      hours: {
        isOpen: true,
        todayHours: '09:00 - 21:00'
      },
      distance: generateRandomDistance(),
      description: firstReview.description || '매력적인 장소입니다.',
      contact: {
        phone: generateRandomPhone()
      }
    };
  } catch (error) {
    console.error('Failed to fetch store by ID:', error);
    return null;
  }
};

// 가게 검색 (후기 내용으로 검색)
export const searchStores = async (query) => {
  try {
    const allStores = await getAllStores();
    
    if (!query || query.trim() === '') {
      return allStores;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return allStores.filter(store => 
      store.name.toLowerCase().includes(lowerQuery) ||
      store.category.toLowerCase().includes(lowerQuery) ||
      store.address.toLowerCase().includes(lowerQuery) ||
      store.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Failed to search stores:', error);
    return [];
  }
};

// 인기 가게 목록 조회 (후기 많은 순)
export const getPopularStores = async (limit = 10) => {
  try {
    const allStores = await getAllStores();
    
    return allStores
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch popular stores:', error);
    return getDummyStores().slice(0, limit);
  }
};

// 카테고리별 가게 조회
export const getStoresByCategory = async (category) => {
  try {
    const allStores = await getAllStores();
    
    return allStores.filter(store => 
      store.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Failed to fetch stores by category:', error);
    return [];
  }
};

// 유틸리티 함수들
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 4.0;
  
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 4.0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

const extractTags = (reviews) => {
  const tags = new Set();
  
  reviews.forEach(review => {
    if (review.tags) {
      review.tags.split(',').forEach(tag => {
        tags.add(tag.trim());
      });
    }
  });
  
  return Array.from(tags).slice(0, 3);
};

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