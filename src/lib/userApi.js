import api, { encodePathSegment as encSeg } from './api';

/**
 * 사용자 정보 API 함수들 - Swagger API에 맞게 구현
 */

// 유저 전체 조회 (GET /api/v1)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/v1');
    return response.data;
  } catch (error) {
    console.error('Failed to get all users:', error);
    throw error;
  }
};

// 해당 유저 조회 (GET /api/v1/{id})
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/v1/${encSeg(id)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get user by ID:', error);
    throw error;
  }
};

// 유저 생성 (POST /api/v1)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/v1', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

// 해당 유저 삭제 (DELETE /api/v1/{id})
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/v1/${encSeg(id)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

// 해당 유저 수정 (PUT /api/v1/{id})
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/v1/${encSeg(id)}`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};
