'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      // 헤더에서 토큰 추출
      const authHeader = response.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          await login(token);
      } else {
            throw new Error('토큰을 찾을 수 없습니다.');
      }
    } catch (err: any) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || err.message || '이메일 또는 비밀번호를 확인해주세요.';
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-x-hidden">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-white p-6 shadow-sm dark:bg-[#18202F] sm:p-10">
        {/* Page Heading */}
        <div className="flex w-full flex-col gap-2 text-center">
          <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
            비디오 교육 코스
          </p>
          <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
            로그인하여 학습을 계속하세요
          </p>
        </div>

        <div className="w-full">
          {/* Tabs */}
          <div className="pb-3">
            <div className="flex border-b border-gray-300 dark:border-gray-700">
              <Link
                href="/login"
                className="flex flex-1 flex-col items-center justify-center border-b-[3px] border-b-primary pb-[13px] pt-4 text-primary"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">로그인</p>
              </Link>
              <Link
                href="/signup"
                className="flex flex-1 flex-col items-center justify-center border-b-[3px] border-b-transparent pb-[13px] pt-4 text-gray-600 dark:text-gray-400"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">회원가입</p>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
             {/* Error Message */}
             {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Email Input */}
            <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                    이메일 또는 사용자 이름
                </p>
                <input
                    required
                    type="text"
                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            {/* Password Input */}
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                비밀번호
              </p>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  required
                  className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-[15px] pr-10 text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="비밀번호를 입력하세요"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400">
                  <span
                    className="material-symbols-outlined cursor-pointer select-none"
                    style={{ fontSize: '20px' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>
            </label>

            {/* Keep Logged In & Forgot Password */}
            <div className="flex min-h-14 items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  className="h-4 w-4 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 checked:border-primary checked:bg-primary dark:checked:bg-primary dark:focus:ring-offset-gray-800"
                  id="keep-logged-in"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <label
                  className="text-sm font-normal leading-normal text-gray-900 dark:text-gray-300"
                  htmlFor="keep-logged-in"
                >
                  로그인 상태 유지
                </label>
              </div>
              <div className="shrink-0">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium leading-normal text-primary hover:underline"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <div className="mt-2">
                <button
                    disabled={isLoading}
                    type="submit"
                    className={`flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            처리 중...
                        </span>
                    ) : (
                        '로그인하기'
                    )}
                </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
            <span className="relative bg-white px-3 text-sm text-gray-600 dark:bg-[#18202F] dark:text-gray-400">
              또는
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-4">
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 text-base font-medium text-gray-900 dark:text-white shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="relative h-5 w-5">
                <Image
                  src="https://www.google.com/favicon.ico"
                  alt="Google logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span>Google 계정으로 로그인</span>
            </button>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#FEE500] bg-[#FEE500] px-6 text-base font-medium text-[#000000] shadow-sm transition-colors hover:bg-[#FEE500]/90">
              <span className="text-xl">💬</span>
              <span>카카오 계정으로 로그인</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              아직 회원이 아니신가요?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
