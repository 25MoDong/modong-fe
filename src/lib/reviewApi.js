import api from './api';

/**
 * 후기 관련 API 함수들 - 실제 Swagger API 엔드포인트에 맞게 구현
 */

// 내가 작성한 모든 후기 조회 (GET /api/v2/userReview/{userId})
export const getMyReviews = async (userId) => {
  try {
    const response = await api.get(`/api/v2/userReview/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch my reviews:', error);
    throw error;
  }
};

// 후기 작성 (POST /api/v2/createReview)
export const createReview = async (reviewData) => {
  try {
    const requestBody = {
      userId: reviewData.userId,
      storeId: reviewData.placeId || reviewData.storeId,
      review: reviewData.oneLineReview || reviewData.content || reviewData.review,
      // Swagger에 따라 추가 필드들 매핑
    };

    // Some backend deployments/documentation contain a historical typo
    // (`/api/v2/creatReview`). Try the correct route first and fall back
    // to the documented/legacy typo route if the server responds 404.
    try {
      const response = await api.post('/api/v2/createReview', requestBody);
      return response.data;
    } catch (err) {
      // If backend only exposes the misspelled route, try it as a fallback.
      if (err && err.status === 404) {
        console.warn("Primary review endpoint returned 404, trying legacy '/api/v2/creatReview' route");
        const fallback = await api.post('/api/v2/creatReview', requestBody);
        return fallback.data;
      }
      throw err;
    }
  } catch (error) {
    console.error('Failed to create review:', error);
    throw error;
  }
};

// 후기 전체 조회 (GET /api/v2/getAllReview)
export const getAllReviews = async () => {
  try {
    const response = await api.get('/api/v2/getAllReview');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all reviews:', error);
    throw error;
  }
};

// 특정 가게의 모든 후기 조회 (GET /api/v2/storeReview/{storeId})
export const getStoreReviews = async (storeId) => {
  try {
    const response = await api.get(`/api/v2/storeReview/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch store reviews:', error);
    throw error;
  }
};

// 사용자의 해당 가게 리뷰 삭제 (DELETE /api/v2/deleteReview/{userId}/{storeId})
export const deleteReview = async (userId, storeId) => {
  try {
    const response = await api.delete(`/api/v2/deleteReview/${userId}/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
};

// 사용자의 해당 가게 리뷰 수정 (PUT /api/v2/updateReview/{userId}/{storeId})
export const updateReview = async (userId, storeId, reviewData) => {
  try {
    const requestBody = {
      userId,
      storeId,
      review: reviewData.oneLineReview || reviewData.content || reviewData.review,
      // Swagger에 따라 추가 필드들 매핑
    };

    const response = await api.put(`/api/v2/updateReview/${userId}/${storeId}`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Failed to update review:', error);
    throw error;
  }
};
