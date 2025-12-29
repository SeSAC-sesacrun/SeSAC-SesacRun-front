import { api } from '@/lib/api';
import { AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      // 인증 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('authChange'));
    }
    return response;
  },

  async signup(name: string, email: string, password: string, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN', avatar?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', {
      name,
      email,
      password,
      role,
      avatar,
    });
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      // 인증 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('authChange'));
    }
    return response;
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // 인증 상태 변경 이벤트 발생
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
    }
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
