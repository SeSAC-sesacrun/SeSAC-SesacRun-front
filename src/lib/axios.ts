import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: API 요청 시마다 토큰을 헤더에 자동으로 추가
api.interceptors.request.use(
  (config) => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택 사항: 토큰 만료 처리 등)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 등의 공통 처리 로직을 여기에 추가할 수 있습니다.
    return Promise.reject(error);
  }
);

export default api;
