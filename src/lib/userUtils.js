/**
 * 사용자 관련 유틸리티 함수들
 */

import userStore from './userStore';

// 현재 선택된(테스트) 사용자 ID 가져오기
// NOTE: Do not create a hardcoded default (like '1') here — the app should
// require an explicit user selection during onboarding. Return null if none.
export const getCurrentUserId = () => {
  const stored = userStore.getUserId();
  return stored || null;
};

// 사용자 ID 설정
export const setCurrentUserId = async (userId) => {
  // Keep selection in sync with central userStore
  try {
    await userStore.setUser({ id: userId });
  } catch (e) {
    // If userStore fails for any reason, rethrow so callers can handle it.
    throw e;
  }
};

// 사용자 로그아웃 (사용자 ID 제거)
export const clearCurrentUserId = () => {
  try { userStore.clear(); } catch (e) { throw e; }
};

// 사용자가 로그인되어 있는지 확인
export const isUserLoggedIn = () => {
  return !!userStore.getUserId();
};
