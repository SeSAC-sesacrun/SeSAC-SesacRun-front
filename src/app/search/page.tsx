'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseCard from '@/components/course/CourseCard';
import Link from 'next/link';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    // 임시 데이터 - 실제로는 API에서 검색 결과를 가져옴
    const searchResults = {
        courses: [
            {
                id: '1',
                title: '비즈니스 전략 마스터클래스',
                instructor: '김민준 강사',
                thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
                rating: 4.8,
                reviewCount: 1204,
                price: 120000,
            },
            {
                id: '3',
                title: '실전! React & TypeScript',
                instructor: '박서준 강사',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                rating: 4.7,
                reviewCount: 3012,
                price: 180000,
            },
        ],
        communityPosts: [
            {
                id: '1',
                category: 'study',
                status: 'recruiting',
                title: '프론트엔드 실전 프로젝트 스터디원 모집',
                description: 'React와 TypeScript를 사용한 실전 프로젝트...',
                author: '강민준',
                views: 1234,
            },
        ],
    };

    const totalResults = searchResults.courses.length + searchResults.communityPosts.length;

    return (
        <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        "{query}" 검색 결과
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                        총 {totalResults}개의 결과를 찾았습니다
                    </p>
                </div>

                {/* Courses Section */}
                {searchResults.courses.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            강의 ({searchResults.courses.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.courses.map((course) => (
                                <CourseCard key={course.id} {...course} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Community Posts Section */}
                {searchResults.communityPosts.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            커뮤니티 ({searchResults.communityPosts.length})
                        </h2>
                        <div className="space-y-4">
                            {searchResults.communityPosts.map((post) => (
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
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                {post.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    {post.author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    {post.views.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                                search_off
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            검색 결과가 없습니다
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            다른 검색어로 다시 시도해보세요
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                        >
                            홈으로 돌아가기
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">로딩 중...</div>}>
            <SearchResults />
        </Suspense>
    );
}
