import api from './api';

/**
 * 유저 최애에 대한 API 함수들 - Swagger API에 맞게 구현
 */

// 유저의 모든 찜 목록 조회 (GET /api/v5/getAllFs)
export const getAllFavoriteStores = async () => {
  try {
    const response = await api.get('/api/v5/getAllFs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all favorite stores:', error);
    throw error;
  }
};

// 유저별 찜 목록 조회 (GET /api/v5/getUserFs?userId=...)
export const getUserFavoriteStores = async (userId) => {
  try {
    if (!userId) throw new Error('userId is required for getUserFavoriteStores');
    const response = await api.get(`/api/v5/getUserFs?userId=${encodeURIComponent(userId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user favorite stores:', error);
    throw error;
  }
};

// 특정 가게 찜 목록 조회 (GET /api/v5/store/{storeName})
export const getStoreFavorites = async (storeName) => {
  try {
    const response = await api.get(`/api/v5/store/${storeName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch store favorites:', error);
    throw error;
  }
};

// 특정 가게 찜 상세 정보 조회 (GET /api/v5/store/{storeName}/{detail})
export const getStoreFavoriteDetail = async (storeName, detail) => {
  try {
    const response = await api.get(`/api/v5/store/${storeName}/${detail}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch store favorite detail:', error);
    throw error;
  }
};

// 찜 추가 (POST /api/v5)
export const addFavoriteStore = async (favoriteData) => {
  try {
    const response = await api.post('/api/v5', favoriteData);
    return response.data;
  } catch (error) {
    console.error('Failed to add favorite store:', error);
    throw error;
  }
};

// 찜 삭제 (DELETE /api/v5/delete/{storeName}/{detail})
export const deleteFavoriteStore = async (storeName, detail) => {
  try {
    const response = await api.delete(`/api/v5/delete/${storeName}/${detail}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete favorite store:', error);
    throw error;
  }
};
