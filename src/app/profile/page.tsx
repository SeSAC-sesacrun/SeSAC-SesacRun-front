'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MyPage() {
    const [activeTab, setActiveTab] = useState<'courses' | 'community' | 'instructor'>('courses');

    // 사용자 정보 (실제로는 API에서 가져올 데이터)
    const user = {
        name: '김학습',
        email: 'student@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        role: 'instructor', // 'student' | 'instructor'
    };

    const myCourses = [
        {
            id: '1',
            title: '초보자를 위한 UI/UX 디자인 시작하기',
            progress: 75,
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        },
        {
            id: '2',
            title: '데이터 기반 그로스 마케팅 실전',
            progress: 30,
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        },
    ];

    const myPosts = [
        {
            id: '1',
            category: 'study',
            status: 'recruiting',
            title: '프론트엔드 실전 프로젝트 스터디원 모집',
            currentMembers: 8,
            totalMembers: 10,
            views: 1234,
        },
        {
            id: '2',
            category: 'project',
            status: 'completed',
            title: 'AI 챗봇 서비스 개발 팀원 모집',
            currentMembers: 5,
            totalMembers: 5,
            views: 856,
        },
    ];

    const instructorCourses = [
        {
            id: '1',
            title: 'React 완벽 가이드',
            students: 1234,
            rating: 4.8,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        },
        {
            id: '2',
            title: 'TypeScript 마스터하기',
            students: 856,
            rating: 4.9,
            thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        },
    ];

    return (
        <div className="flex h-full grow flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
                    {/* Sidebar */}
                    <aside className="w-full shrink-0 md:w-64">
                        <div className="flex h-full flex-col gap-6 rounded-lg bg-white p-6 dark:bg-gray-900/50">
                            {/* User Profile */}
                            <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20"
                                    style={{ backgroundImage: `url('${user.avatar}')` }}
                                />
                                <div className="text-center">
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    {user.role === 'instructor' && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                            강사
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveTab('courses')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'courses'
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">school</span>
                                    <p className="text-sm font-medium">내 강의</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('community')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'community'
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">groups</span>
                                    <p className="text-sm font-medium">내 모집 글</p>
                                </button>
                                {user.role === 'instructor' && (
                                    <button
                                        onClick={() => setActiveTab('instructor')}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'instructor'
                                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                        <p className="text-sm font-medium">운영 중인 강의</p>
                                    </button>
                                )}
                            </div>

                            {/* Settings */}
                            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <span className="material-symbols-outlined text-xl">settings</span>
                                    <p className="text-sm font-medium">설정</p>
                                </Link>
                                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                                    <span className="material-symbols-outlined text-xl">logout</span>
                                    <p className="text-sm font-medium">로그아웃</p>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* My Courses Tab */}
                        {activeTab === 'courses' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">내 강의</h2>
                                    <Link
                                        href="/courses"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        강의 둘러보기
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900/50"
                                        >
                                            <div
                                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                                style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                            />
                                            <div className="flex flex-col gap-3">
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {course.title}
                                                </p>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        <span>진행률</span>
                                                        <span>{course.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                        <div
                                                            className="bg-primary h-1.5 rounded-full"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/watch/${course.id}`}
                                                    className="flex w-full items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90"
                                                >
                                                    이어보기
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* My Community Posts Tab */}
                        {activeTab === 'community' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">내 모집 글</h2>
                                    <Link
                                        href="/community/create"
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        <span>새 글 작성</span>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {myPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/community/${post.id}`}
                                            className="block bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${post.status === 'recruiting'
                                                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                                }`}
                                                        >
                                                            {post.status === 'recruiting' ? '모집중' : '모집완료'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {post.category === 'study' ? '스터디' : '팀 프로젝트'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {post.currentMembers}/{post.totalMembers}명
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                                            {post.views.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/community/${post.id}/edit`}
                                                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        수정
                                                    </Link>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructor Courses Tab */}
                        {activeTab === 'instructor' && user.role === 'instructor' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">운영 중인 강의</h2>
                                    <Link
                                        href="/instructor/create-course"
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        <span>새 강의 만들기</span>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {instructorCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900/50"
                                        >
                                            <div
                                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                                style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                            />
                                            <div className="flex flex-col gap-3">
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {course.title}
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">person</span>
                                                        {course.students.toLocaleString()}명
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                                                        {course.rating}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/instructor/courses/${course.id}`}
                                                        className="flex-1 flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90"
                                                    >
                                                        관리
                                                    </Link>
                                                    <Link
                                                        href={`/courses/${course.id}`}
                                                        className="flex items-center justify-center rounded-lg h-9 px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
