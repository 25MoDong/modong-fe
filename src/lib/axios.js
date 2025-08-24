import axios from 'axios';

// 안전한 기본값 결정:
// - 우선순위 1: VITE_API_BASE_URL 환경변수(존재하고 공백이 아닐 때)
// - 우선순위 2: window.location.origin + '/api' (런타임 기준 동일 오리진 프록시)
// - 우선순위 3: '/api' (상대 경로; SSR/테스트 등 window가 없을 때 대비)
const envBase = (import.meta.env?.VITE_API_BASE_URL ?? '').trim();
const runtimeBase = (typeof window !== 'undefined' && window.location?.origin)
  ? `${window.location.origin}/api`
  : '/api';
const resolvedBase = envBase || runtimeBase || '/api';

const api = axios.create({
  baseURL: resolvedBase,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
