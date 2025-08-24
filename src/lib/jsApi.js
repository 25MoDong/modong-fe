import api, { encodePathSegment as encSeg } from './api';

/**
 * 집매장 API 함수들 - Swagger API에 맞게 구현
 */

// 집제목에 해당하는 매장 정보 읽기 (GET /api/v4/getJs/{jtId})
export const getJsByJtId = async (jtId) => {
  try {
    const response = await api.get(`/api/v4/getJs/${encSeg(jtId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get Js by JtId:', error);
    throw error;
  }
};

// 집매장 등록 (POST /api/v4/createJs)
export const createJs = async (jsData) => {
  try {
    const response = await api.post('/api/v4/createJs', jsData);
    return response.data;
  } catch (error) {
    console.error('Failed to create Js:', error);
    throw error;
  }
};

// 집제목에 해당하는 집 매장 삭제 (DELETE /api/v4/deleteJs/{jtId}/{storeId})
export const deleteJs = async (jtId, storeId) => {
  try {
    const response = await api.delete(`/api/v4/deleteJs/${encSeg(jtId)}/${encSeg(storeId)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete Js:', error);
    throw error;
  }
};
