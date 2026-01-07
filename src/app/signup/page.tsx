'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth(); // AuthContext에서 login 함수 가져오기
    
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

    // 입력 필드 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (activeTab === 'signup') {
                // 회원가입 요청
                await api.post('/api/auth/signup', {
                     email, 
                     password, 
                     name 
                });

                alert('회원가입이 완료되었습니다. 로그인해주세요.');
                setActiveTab('login');
                setPassword(''); // 비밀번호 초기화
            } else {
                // 로그인 요청
                const response = await api.post('/api/auth/login', {
                    email,
                    password
                });

                // 헤더에서 토큰 추출
                const authHeader = response.headers['authorization'];
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    // Context의 login 함수 호출하여 전역 상태 업데이트 및 라우팅 처리
                    await login(token);
                } else {
                     throw new Error('토큰을 찾을 수 없습니다.');
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            const errorMessage = err.response?.data?.message || err.message || '서버와 통신하는 중 오류가 발생했습니다.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-x-hidden">
            <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 sm:p-10">
                {/* PageHeading */}
                <div className="flex w-full flex-col gap-2 text-center">
                    <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                        비디오 교육 코스
                    </p>
                    <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
                        {activeTab === 'login' ? '로그인하여 학습을 계속하세요' : '회원가입하고 학습을 시작하세요'}
                    </p>
                </div>

                <div className="w-full">
                    {/* Tabs */}
                    <div className="pb-3">
                        <div className="flex border-b border-gray-300 dark:border-gray-700">
                            <button
                                onClick={() => {
                                    setActiveTab('login');
                                    setError(null);
                                }}
                                className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${activeTab === 'login'
                                        ? 'border-b-primary text-primary'
                                        : 'border-b-transparent text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">로그인</p>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('signup');
                                    setError(null);
                                }}
                                className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${activeTab === 'signup'
                                        ? 'border-b-primary text-primary'
                                        : 'border-b-transparent text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">회원가입</p>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* TextField: Name (Signup Only) */}
                        {activeTab === 'signup' && (
                            <label className="flex flex-col">
                                <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                    이름
                                </p>
                                <input
                                    required
                                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                    placeholder="이름을 입력하세요"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>
                        )}
                        

                        {/* TextField: Email */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                이메일
                            </p>
                            <input
                                required
                                type="email"
                                className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                placeholder="이메일 주소를 입력하세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        {/* TextField: Password */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                비밀번호
                            </p>
                            <div className="relative flex w-full flex-1 items-stretch">
                                <input
                                    required
                                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] pr-10 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
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

                        {activeTab === 'login' && (
                            <div className="flex min-h-14 items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="h-4 w-4 rounded border-2 border-gray-300 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 checked:border-primary checked:bg-primary dark:border-gray-600 dark:checked:bg-primary dark:focus:ring-offset-gray-800"
                                        id="keep-logged-in"
                                        type="checkbox"
                                    />
                                    <label
                                        className="text-sm font-normal leading-normal text-gray-900 dark:text-gray-300"
                                        htmlFor="keep-logged-in"
                                    >
                                        로그인 상태 유지
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Primary Button */}
                        <div className="mt-6">
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
                                    activeTab === 'login' ? '로그인하기' : '회원가입하기'
                                )}
                            </button>
                        </div>
                    </form>


                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activeTab === 'login' ? (
                                <>
                                    아직 회원이 아니신가요?{' '}
                                    <button
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => {
                                            setActiveTab('signup');
                                            setError(null);
                                        }}
                                    >
                                        회원가입
                                    </button>
                                </>
                            ) : (
                                <>
                                    이미 회원이신가요?{' '}
                                    <button
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => {
                                            setActiveTab('login');
                                            setError(null);
                                        }}
                                    >
                                        로그인
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
