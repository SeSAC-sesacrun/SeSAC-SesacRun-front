'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MyCoursesPage() {
    const [activeTab, setActiveTab] = useState<'courses' | 'posts' | 'meetings' | 'purchases' | 'instructor'>('courses');
    const [postsSubTab, setPostsSubTab] = useState<'qna' | 'study' | 'project'>('qna');
    const [meetingsFilter, setMeetingsFilter] = useState<'all' | 'organizer' | 'participant'>('all');

    // 사용자 정보
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
        {
            id: '3',
            title: 'React와 TypeScript로 웹 앱 만들기',
            progress: 100,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        },
    ];

    const myQnA = [
        {
            id: '1',
            courseTitle: 'React 완벽 가이드',
            question: '컴포넌트 렌더링 최적화 방법이 궁금합니다',
            answered: true,
            createdAt: '2024-01-15',
        },
    ];

    const myStudyPosts = [
        {
            id: '1',
            category: 'study',
            status: 'recruiting',
            title: '프론트엔드 실전 프로젝트 스터디원 모집',
            currentMembers: 8,
            totalMembers: 10,
            views: 1234,
        },
    ];

    const myProjectPosts = [
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

    const myMeetings = [
        {
            id: '1',
            title: '프론트엔드 실전 프로젝트 스터디원 모집',
            status: 'recruiting',
            role: 'organizer',
        },
        {
            id: '2',
            title: 'React 스터디',
            status: 'approved',
            role: 'participant',
        },
    ];

    const myPurchases = [
        {
            id: '1',
            courseTitle: 'React 완벽 가이드',
            price: 129000,
            purchasedAt: '2024-01-10',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
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
    ];

    return (
        <div className="flex h-full grow flex-col bg-background-light dark:bg-background-dark">
            <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
                    {/* Sidebar */}
                    <aside className="w-full shrink-0 md:w-64">
                        <div className="flex h-full flex-col gap-6 rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
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
                                    onClick={() => setActiveTab('purchases')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'purchases'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                                    <p className="text-sm font-medium">구매 내역</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'posts'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">article</span>
                                    <p className="text-sm font-medium">게시글</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('meetings')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeTab === 'meetings'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">groups</span>
                                    <p className="text-sm font-medium">모임</p>
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
                                        <Link
                                            key={course.id}
                                            href={`/watch/${course.id}`}
                                            className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                        >
                                            <div className="relative">
                                                <div
                                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                                    style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                                />
                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center justify-center size-16 bg-primary rounded-full">
                                                        <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            play_arrow
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                                    {course.title}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Purchases Tab */}
                        {activeTab === 'purchases' && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">구매 내역</h2>
                                <div className="space-y-4">
                                    {myPurchases.map((purchase) => (
                                        <div
                                            key={purchase.id}
                                            className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                                        >
                                            <div
                                                className="w-32 h-20 bg-center bg-cover rounded-lg flex-shrink-0"
                                                style={{ backgroundImage: `url('${purchase.thumbnail}')` }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                    {purchase.courseTitle}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    구매일: {purchase.purchasedAt}
                                                </p>
                                                <p className="text-sm font-bold text-primary mt-2">
                                                    {purchase.price.toLocaleString()}원
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Posts Tab */}
                        {activeTab === 'posts' && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">게시글</h2>

                                {/* Sub Tabs */}
                                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setPostsSubTab('qna')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${postsSubTab === 'qna'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        Q&A
                                    </button>
                                    <button
                                        onClick={() => setPostsSubTab('study')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${postsSubTab === 'study'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        스터디
                                    </button>
                                    <button
                                        onClick={() => setPostsSubTab('project')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${postsSubTab === 'project'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        팀 프로젝트
                                    </button>
                                </div>

                                {/* Q&A List */}
                                {postsSubTab === 'qna' && (
                                    <div className="space-y-4">
                                        {myQnA.map((qna) => (
                                            <div
                                                key={qna.id}
                                                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {qna.courseTitle}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${qna.answered
                                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {qna.answered ? '답변 완료' : '대기 중'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                    {qna.question}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {qna.createdAt}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Study Posts List */}
                                {postsSubTab === 'study' && (
                                    <div className="space-y-4">
                                        {myStudyPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/community/${post.id}`}
                                                className="block bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'recruiting'
                                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {post.status === 'recruiting' ? '모집중' : '모집완료'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {post.currentMembers}/{post.totalMembers}명
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    조회수 {post.views.toLocaleString()}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Project Posts List */}
                                {postsSubTab === 'project' && (
                                    <div className="space-y-4">
                                        {myProjectPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/community/${post.id}`}
                                                className="block bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'recruiting'
                                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {post.status === 'recruiting' ? '모집중' : '모집완료'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {post.currentMembers}/{post.totalMembers}명
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    조회수 {post.views.toLocaleString()}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Meetings Tab */}
                        {activeTab === 'meetings' && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">모임</h2>

                                {/* Filter Buttons */}
                                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setMeetingsFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'all'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        전체
                                    </button>
                                    <button
                                        onClick={() => setMeetingsFilter('organizer')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'organizer'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        모집자
                                    </button>
                                    <button
                                        onClick={() => setMeetingsFilter('participant')}
                                        className={`px-4 py-2 text-sm font-medium border-b-2 ${meetingsFilter === 'participant'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        참여자
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {myMeetings
                                        .filter(meeting =>
                                            meetingsFilter === 'all' || meeting.role === meetingsFilter
                                        )
                                        .map((meeting) => (
                                            <div
                                                key={meeting.id}
                                                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded font-bold ${meeting.status === 'recruiting'
                                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                            : meeting.status === 'approved'
                                                                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {meeting.status === 'recruiting'
                                                            ? '모집중'
                                                            : meeting.status === 'approved'
                                                                ? '참여 중'
                                                                : '완료'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {meeting.role === 'organizer' ? '모집자' : '참여자'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                    {meeting.title}
                                                </h3>
                                            </div>
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
                                            className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800"
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
