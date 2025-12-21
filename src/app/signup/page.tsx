'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.signup(name, email, password, role);
            alert('회원가입이 완료되었습니다!');
            router.push('/courses');
        } catch (err: any) {
            setError(err.message || '회원가입에 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-x-hidden">
            <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 sm:p-10">
                {/* Page Heading */}
                <div className="flex w-full flex-col gap-2 text-center">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                        비디오 교육 코스
                    </p>
                    <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
                        회원가입하고 학습을 시작하세요
                    </p>
                </div>

                <div className="w-full">
                    {/* Tabs */}
                    <div className="pb-3">
                        <div className="flex border-b border-gray-300 dark:border-gray-700">
                            <Link
                                href="/login"
                                className="flex flex-1 flex-col items-center justify-center border-b-[3px] border-b-transparent pb-[13px] pt-4 text-gray-600 dark:text-gray-400"
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">로그인</p>
                            </Link>
                            <div className="flex flex-1 flex-col items-center justify-center border-b-[3px] border-b-primary pb-[13px] pt-4 text-primary">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">회원가입</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                이름
                            </p>
                            <input
                                className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                placeholder="이름을 입력하세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

                        {/* Role Select */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                역할
                            </p>
                            <select
                                className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN')}
                                required
                            >
                                <option value="STUDENT">수강생</option>
                                <option value="INSTRUCTOR">강사</option>
                                <option value="ADMIN">관리자</option>
                            </select>
                        </label>

                        {/* Email Input */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                이메일
                            </p>
                            <input
                                className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                placeholder="이메일 주소를 입력하세요"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        {/* Password Input */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                비밀번호
                            </p>
                            <div className="relative flex w-full flex-1 items-stretch">
                                <input
                                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] pr-10 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                    placeholder="비밀번호를 입력하세요 (최소 8자)"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
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

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#135bec] px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#0d47b8] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? '처리 중...' : '회원가입하기'}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8 flex items-center justify-center">
                        <div className="absolute w-full border-t border-gray-300 dark:border-gray-700" />
                        <span className="relative bg-white px-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                            또는
                        </span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-4">
                        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-base font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                            <img
                                alt="Google logo icon"
                                className="h-5 w-5"
                                src="https://www.google.com/favicon.ico"
                            />
                            <span>Google 계정으로 회원가입</span>
                        </button>
                        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#FEE500] bg-[#FEE500] px-6 text-base font-medium text-[#000000] shadow-sm transition-colors hover:bg-[#FEE500]/90">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                                    fill="#181600"
                                />
                            </svg>
                            <span>카카오 계정으로 회원가입</span>
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            이미 회원이신가요?{' '}
                            <Link href="/login" className="font-medium text-[#135bec] hover:underline">
                                로그인
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
