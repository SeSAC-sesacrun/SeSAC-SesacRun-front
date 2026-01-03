'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';

interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, redirectUrl?: string) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      // API 명세를 기반으로 사용자 정보 조회 시도
      // 1순위: /api/users/me (명세서에 정의된 엔드포인트)
      const response = await api.get('/api/auth/me');
      if (response.data && response.data.data) {
        const userData = response.data.data;

        // 백엔드가 문자열로 응답하는 경우 처리
        if (typeof userData === 'string') {
          // "인증 성공! 이메일: user1@test.com, 권한: USER, ID: 2"에서 추출
          const emailMatch = userData.match(/이메일:\s*([^,]+)/);
          const roleMatch = userData.match(/권한:\s*([^,]+)/);
          const idMatch = userData.match(/ID:\s*(\d+)/);

          const parsedUser = {
            id: idMatch ? parseInt(idMatch[1], 10) : undefined,
            email: emailMatch ? emailMatch[1].trim() : '',
            role: roleMatch ? roleMatch[1].trim() : '',
          };

          setUser(parsedUser);

          // userId를 localStorage에 저장 (채팅에서 사용)
          if (parsedUser.id) {
            localStorage.setItem('userId', parsedUser.id.toString());
            console.log('✅ Saved userId to localStorage:', parsedUser.id);
          }
        } else {
          // 객체로 응답하는 경우 (정상)
          setUser(userData);

          // userId를 localStorage에 저장 (채팅에서 사용)
          if (userData.id) {
            localStorage.setItem('userId', userData.id.toString());
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 토큰이 만료되었거나 유효하지 않은 경우
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string, redirectUrl = '/') => {
    localStorage.setItem('accessToken', token);
    await fetchUser();
    router.push(redirectUrl);
    router.refresh();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const updateUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
