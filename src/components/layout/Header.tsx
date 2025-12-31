'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between whitespace-nowrap py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-6 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tighter">CourseHub</h2>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-9">
                        <Link
                            href="/courses"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                        >
                            전체 강의
                        </Link>
                        <Link
                            href="/profile"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                        >
                            내 강의실
                        </Link>
                        <Link
                            href="/community"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                        >
                            커뮤니티
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <>
                                {/* 채팅 아이콘 */}
                                <Link
                                    href="/chat/1"
                                    className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <span className="material-symbols-outlined">chat</span>
                                </Link>

                                {/* 프로필 아이콘 */}
                                <Link href="/profile" className="flex items-center gap-3">
                                    <Avatar src={user.avatar} alt={user.name || 'User'} size="md" />
                                </Link>
                                
                                {/* 로그아웃 버튼 (임시 추가: 프로필 드롭다운이 아직 없다면) */}
                                <button 
                                    onClick={logout}
                                    className="text-sm text-gray-500 hover:text-red-500 ml-2"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="secondary">로그인</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
