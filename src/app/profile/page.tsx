'use client';

import React, { useState } from 'react';
import MyCourses from '@/components/profile/MyCourses';
import MyPurchases from '@/components/profile/MyPurchases';
import MyQnA from '@/components/profile/MyQnA';
import MyStudyPosts from '@/components/profile/MyStudyPosts';
import MyProjectPosts from '@/components/profile/MyProjectPosts';
import MyMeetings from '@/components/profile/MyMeetings';
import InstructorCourses from '@/components/profile/InstructorCourses';

export default function MyPage() {
    const [activeTab, setActiveTab] = useState<'courses' | 'posts' | 'meetings' | 'purchases' | 'instructor'>('courses');
    const [postsSubTab, setPostsSubTab] = useState<'qna' | 'study' | 'project'>('qna');

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
        <div className="flex h-full grow flex-col">
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
                            <MyCourses courses={myCourses} />
                        )}

                        {/* Purchases Tab */}
                        {activeTab === 'purchases' && (
                            <MyPurchases purchases={myPurchases} />
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
                                    <MyQnA qnaList={myQnA} />
                                )}

                                {/* Study Posts List */}
                                {postsSubTab === 'study' && (
                                    <MyStudyPosts posts={myStudyPosts} />
                                )}

                                {/* Project Posts List */}
                                {postsSubTab === 'project' && (
                                    <MyProjectPosts posts={myProjectPosts} />
                                )}
                            </div>
                        )}

                        {/* Meetings Tab */}
                        {activeTab === 'meetings' && (
                            <MyMeetings meetings={myMeetings} />
                        )}

                        {/* Instructor Courses Tab */}
                        {activeTab === 'instructor' && user.role === 'instructor' && (
                            <InstructorCourses courses={instructorCourses} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
