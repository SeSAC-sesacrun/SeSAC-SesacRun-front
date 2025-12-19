'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MyCoursesPage() {
    const [selectedFilter, setSelectedFilter] = useState('전체');

    const courses = [
        {
            id: '1',
            category: '디자인 기초',
            title: '초보자를 위한 UI/UX 디자인 시작하기',
            instructor: '김디자인',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
            progress: 75,
            status: '수강 중',
        },
        {
            id: '2',
            category: '마케팅',
            title: '데이터 기반 그로스 마케팅 실전',
            instructor: '박마케터',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            progress: 30,
            status: '수강 중',
        },
        {
            id: '3',
            category: '개발',
            title: 'React와 TypeScript로 웹 앱 만들기',
            instructor: '이개발',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            progress: 100,
            status: '완강',
        },
    ];

    const filters = ['전체', '수강 중', '완강'];

    return (
        <div className="flex h-full grow flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
                    {/* SideNavBar */}
                    <aside className="w-full shrink-0 md:w-56">
                        <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 dark:bg-gray-900/50">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                        style={{
                                            backgroundImage:
                                                "url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400')",
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <h1 className="text-base font-medium text-gray-900 dark:text-white">김학습</h1>
                                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">환영합니다!</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Link
                                        className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20"
                                        href="/my-courses"
                                    >
                                        <span className="material-symbols-outlined !fill-1 text-xl">personal_video</span>
                                        <p className="text-sm font-medium">내 강의</p>
                                    </Link>
                                    <Link
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        href="#"
                                    >
                                        <span className="material-symbols-outlined text-xl">map</span>
                                        <p className="text-sm font-medium">학습 로드맵</p>
                                    </Link>
                                    <Link
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                        href="#"
                                    >
                                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                        <p className="text-sm font-medium">수료증</p>
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col gap-1">
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    href="#"
                                >
                                    <span className="material-symbols-outlined text-xl">settings</span>
                                    <p className="text-sm font-medium">설정</p>
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    href="#"
                                >
                                    <span className="material-symbols-outlined text-xl">logout</span>
                                    <p className="text-sm font-medium">로그아웃</p>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex flex-col gap-6">
                            {/* PageHeading */}
                            <div className="flex flex-wrap justify-between gap-4">
                                <div className="flex min-w-72 flex-col gap-1">
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                                        내 강의/학습 대시보드
                                    </p>
                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                        학습 진행 상황을 확인하고 강의를 이어보세요.
                                    </p>
                                </div>
                            </div>

                            {/* Chips */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {filters.map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setSelectedFilter(filter)}
                                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 text-sm font-medium ${selectedFilter === filter
                                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <button className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white pl-3 pr-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        최근 학습 순
                                        <span className="material-symbols-outlined text-lg">expand_more</span>
                                    </button>
                                </div>
                            </div>

                            {/* Course Cards Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900/50"
                                    >
                                        <div
                                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                            style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                        />
                                        <div className="flex h-full flex-col justify-between gap-3">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                    {course.category}
                                                </p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {course.title}
                                                </p>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                    {course.instructor}
                                                </p>
                                            </div>
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
                                                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 text-sm font-medium leading-normal ${course.progress === 100
                                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                                    : 'bg-primary text-white hover:bg-primary/90'
                                                    }`}
                                            >
                                                <span className="truncate">
                                                    {course.progress === 100 ? '다시보기' : '이어보기'}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
