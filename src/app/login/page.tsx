'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(email, password);
      router.push('/courses');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다');
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
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <Input
              label="이메일 또는 사용자 이름"
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            {/* Password Input */}
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                비밀번호
              </p>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-[15px] pr-10 text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="비밀번호를 입력하세요"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400">
                  <span
                    className="material-symbols-outlined cursor-pointer"
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
            <div className="mt-6">
              <Button variant="secondary" fullWidth size="lg" type="submit" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인하기'}
              </Button>
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
