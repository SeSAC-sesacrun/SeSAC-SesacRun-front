'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import { authService } from '@/services/auth';

export default function ClientHeader() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

    useEffect(() => {
        // 컴포넌트 마운트 시 인증 상태 확인
        const checkAuth = () => {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                const storedUser = authService.getStoredUser();
                if (storedUser) {
                    setUser({
                        name: storedUser.name,
                        email: storedUser.email,
                        avatar: storedUser.avatar,
                    });
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();

        // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);

        // 커스텀 이벤트 리스너 추가 (같은 탭에서 로그인/로그아웃 시 동기화)
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    return <Header isAuthenticated={isAuthenticated} user={user || undefined} />;
}
