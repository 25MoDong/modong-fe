import api from './api';

/**
 * 집제목 API 함수들 - Swagger API에 맞게 구현
 */

// 집제목으로 사용자가 정의한 찜 제목 조회 (GET /api/v3/findJt/{jtId})
export const findJtById = async (jtId) => {
  try {
    const response = await api.get(`/api/v3/findJt/${jtId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to find Jt by ID:', error);
    throw error;
  }
};

// 집제목 생성 (POST /api/v3/createJt)
export const createJt = async (jtData) => {
  try {
    const response = await api.post('/api/v3/createJt', jtData);
    return response.data;
  } catch (error) {
    console.error('Failed to create Jt:', error);
    throw error;
  }
};

// 사용자의 집 제목 수정 (PUT /api/v3/updateJt/{jtId})
export const updateJt = async (jtId, jtData) => {
  try {
    const response = await api.put(`/api/v3/updateJt/${jtId}`, jtData);
    return response.data;
  } catch (error) {
    console.error('Failed to update Jt:', error);
    throw error;
  }
};

// 집제목 삭제 (DELETE /api/v3/deleteJt/{jtId})
export const deleteJt = async (jtId) => {
  try {
    const response = await api.delete(`/api/v3/deleteJt/${jtId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete Jt:', error);
    throw error;
  }
};