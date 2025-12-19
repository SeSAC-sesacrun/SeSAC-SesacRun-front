'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

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
                                onClick={() => setActiveTab('login')}
                                className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'login'
                                        ? 'border-b-primary text-primary'
                                        : 'border-b-transparent text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">로그인</p>
                            </button>
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'signup'
                                        ? 'border-b-primary text-primary'
                                        : 'border-b-transparent text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">회원가입</p>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                        {/* TextField: Email */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                이메일 또는 사용자 이름
                            </p>
                            <input
                                className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                placeholder="이메일 주소를 입력하세요"
                            />
                        </label>

                        {/* TextField: Password */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
                                비밀번호
                            </p>
                            <div className="relative flex w-full flex-1 items-stretch">
                                <input
                                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] pr-10 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-600 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary"
                                    placeholder="비밀번호를 입력하세요"
                                    type={showPassword ? 'text' : 'password'}
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

                        {activeTab === 'login' && (
                            <div className="flex min-h-14 items-center justify-between gap-4">
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
                                <div className="shrink-0">
                                    <Link className="text-sm font-medium leading-normal text-primary hover:underline" href="#">
                                        비밀번호 찾기
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary Button */}
                    <div className="mt-6">
                        <button className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary/90">
                            {activeTab === 'login' ? '로그인하기' : '회원가입하기'}
                        </button>
                    </div>

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
                            <span>Google 계정으로 {activeTab === 'login' ? '로그인' : '회원가입'}</span>
                        </button>
                        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#FEE500] bg-[#FEE500] px-6 text-base font-medium text-[#000000] shadow-sm transition-colors hover:bg-[#FEE500]/90">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                                    fill="#181600"
                                />
                            </svg>
                            <span>카카오 계정으로 {activeTab === 'login' ? '로그인' : '회원가입'}</span>
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activeTab === 'login' ? (
                                <>
                                    아직 회원이 아니신가요?{' '}
                                    <button
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => setActiveTab('signup')}
                                    >
                                        회원가입
                                    </button>
                                </>
                            ) : (
                                <>
                                    이미 회원이신가요?{' '}
                                    <button
                                        className="font-medium text-primary hover:underline"
                                        onClick={() => setActiveTab('login')}
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
