import api, { encodePathSegment as encSeg } from './api';

/**
 * 집제목 API 함수들 - Swagger API에 맞게 구현
 */

// 집제목으로 사용자가 정의한 찜 제목 조회 (GET /api/v3/findJt/{jtId})
export const findJtById = async (jtId) => {
  try {
    const response = await api.get(`/api/v3/findJt/${encSeg(jtId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to find Jt by ID:', error);
    throw error;
  }
};

// 전체 찜 제목 조회 (GET /api/v3/getAllJt)
export const getAllJt = async () => {
  try {
    const response = await api.get('/api/v3/getAllJt');
    return response.data;
  } catch (error) {
    console.error('Failed to get all Jt:', error);
    throw error;
  }
};

// 특정 사용자의 집제목(컬렉션) 조회 (GET /api/v3/findJtByUser/{userId})
export const findJtByUser = async (userId) => {
  try {
    const response = await api.get(`/api/v3/findJtByUser/${encSeg(userId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to find Jt by user:', error);
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
    const response = await api.put(`/api/v3/updateJt/${encSeg(jtId)}`, jtData);
    return response.data;
  } catch (error) {
    console.error('Failed to update Jt:', error);
    throw error;
  }
};

// 집제목 삭제 (DELETE /api/v3/deleteJt/{jtId})
export const deleteJt = async (jtId) => {
  try {
    const response = await api.delete(`/api/v3/deleteJt/${encSeg(jtId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete Jt:', error);
    throw error;
  }
};
