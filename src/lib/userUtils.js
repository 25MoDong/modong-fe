/**
 * 사용자 관련 유틸리티 함수들
 */

// 현재 로그인된 사용자 ID 가져오기
export const getCurrentUserId = () => {
  // 로컬 스토리지에서 사용자 ID 조회
  const userId = localStorage.getItem('MODONG_USER_ID');
  
  // 없으면 기본값 설정 (임시)
  if (!userId) {
    const defaultUserId = '1';
    localStorage.setItem('MODONG_USER_ID', defaultUserId);
    return defaultUserId;
  }
  
  return userId;
};

// 사용자 ID 설정
export const setCurrentUserId = (userId) => {
  localStorage.setItem('MODONG_USER_ID', String(userId));
};

// 사용자 로그아웃 (사용자 ID 제거)
export const clearCurrentUserId = () => {
  localStorage.removeItem('MODONG_USER_ID');
};

// 사용자가 로그인되어 있는지 확인
export const isUserLoggedIn = () => {
  return !!localStorage.getItem('MODONG_USER_ID');
};