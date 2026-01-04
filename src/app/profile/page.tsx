'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

// --- Interfaces based on Backend DTOs ---

interface UserResDto {
    id: number;
    email: string;
    name: string;
    role: string;
    createdTime: string;
    updatedTime: string;
    // 프론트에서 사용할 추가 속성 (옵션)
    avatar?: string;
}

interface OrderResponse {
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    status: string; // 'PAID', 'PENDING' etc
    createdAt: string;
}

interface MyPostResDto {
    id: number;
    category: 'STUDY' | 'PROJECT' | 'QNA'; // Backend enum Assumption
    status: 'RECRUITING' | 'COMPLETED' | 'APPROVED'; // Backend enum Assumption
    title: string;
    currentMembers: number;
    totalMembers: number;
    view: number;
    createdAt: string;
}

interface MyMeetingResDto {
    id: number;
    postId: number;
    title: string;
    status: string;
    role: 'ORGANIZER' | 'PARTICIPANT';
}

export default function MyPage() {
    const { logout } = useAuth(); // AuthContext 리소스 활용
    const [activeTab, setActiveTab] = useState<'courses' | 'posts' | 'meetings' | 'purchases' | 'instructor'>('courses');
    const [postsSubTab, setPostsSubTab] = useState<'qna' | 'study' | 'project'>('qna');
    const [meetingsFilter, setMeetingsFilter] = useState<'all' | 'organizer' | 'participant'>('all');

    // --- State ---
    const [profile, setProfile] = useState<UserResDto | null>(null);
    const [purchases, setPurchases] = useState<OrderResponse[]>([]);
    const [posts, setPosts] = useState<MyPostResDto[]>([]);
    const [meetings, setMeetings] = useState<MyMeetingResDto[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Fetch Data ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. Profile
                const profileRes = await api.get('/api/users/me');
                if (profileRes.data.success) {
                    setProfile(profileRes.data.data);
                }

                // 2. Purchases
                const purchasesRes = await api.get('/api/users/me/purchases');
                if (purchasesRes.data.success) {
                    setPurchases(purchasesRes.data.data);
                }

                // 3. Posts
                const postsRes = await api.get('/api/users/me/posts');
                if (postsRes.data.success) {
                    setPosts(postsRes.data.data);
                }

                // 4. Meetings
                const meetingsRes = await api.get('/api/users/me/meetings');
                if (meetingsRes.data.success) {
                    setMeetings(meetingsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
                // 필요한 경우 에러 처리 (예: 토큰 만료 시 로그아웃 등은 axios interceptor에서 처리됨)
            } finally {
                setLoading(false);
            }
        };

        // 토큰이 있는 경우에만 호출 (AuthContext 보호 하에 있지만 안전하게)
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchAllData();
        }
    }, []);

    // --- Dummy Data for Courses (User provided API only for others) ---
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

    const instructorCourses = [
        {
            id: '1',
            title: 'React 완벽 가이드',
            students: 1234,
            rating: 4.8,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        },
    ];

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!profile) return null; // Should redirect or show error

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
                                    style={{ backgroundImage: `url('${profile.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"}')` }}
                                />
                                <div className="text-center">
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                                    {profile.role === 'INSTRUCTOR' && (
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
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeTab === 'courses'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20 font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">school</span>
                                    <p className="text-sm">내 강의</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('purchases')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeTab === 'purchases'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20 font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                                    <p className="text-sm">구매 내역</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeTab === 'posts'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20 font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">article</span>
                                    <p className="text-sm">게시글</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('meetings')}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeTab === 'meetings'
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20 font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">groups</span>
                                    <p className="text-sm">모임</p>
                                </button>
                                {profile.role === 'INSTRUCTOR' && (
                                    <button
                                        onClick={() => setActiveTab('instructor')}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeTab === 'instructor'
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20 font-bold'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                        <p className="text-sm">운영 중인 강의</p>
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
                                    {purchases.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            구매 내역이 없습니다.
                                        </div>
                                    ) : (
                                        purchases.map((purchase) => (
                                            <div
                                                key={purchase.orderId}
                                                className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                                            >
                                                {/* 썸네일 정보가 없으므로 아이콘으로 대체하거나 생략 */}
                                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                                                     <span className="material-symbols-outlined text-gray-400">receipt</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                        주문번호: {purchase.orderNumber}
                                                    </h3>
                                                    <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <span>주문일: {new Date(purchase.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span className={purchase.status === 'PAID' ? 'text-green-500' : 'text-gray-500'}>
                                                            {purchase.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-primary mt-2">
                                                        {purchase.totalAmount.toLocaleString()}원
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${postsSubTab === 'qna'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        Q&A
                                    </button>
                                    <button
                                        onClick={() => setPostsSubTab('study')}
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${postsSubTab === 'study'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        스터디
                                    </button>
                                    <button
                                        onClick={() => setPostsSubTab('project')}
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${postsSubTab === 'project'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        팀 프로젝트
                                    </button>
                                </div>

                                {/* LIST - Filtered by subTab */}
                                <div className="space-y-4">
                                     {posts.filter(post => {
                                         if (postsSubTab === 'qna') return post.category === 'QNA'; // API 카테고리 확인 필요
                                         if (postsSubTab === 'study') return post.category === 'STUDY';
                                         if (postsSubTab === 'project') return post.category === 'PROJECT';
                                         return false;
                                     }).length === 0 ? (
                                         <div className="text-center py-8 text-gray-500">
                                             작성한 게시글이 없습니다.
                                         </div>
                                     ) : (
                                         posts.filter(post => {
                                             if (postsSubTab === 'qna') return post.category === 'QNA'; 
                                             if (postsSubTab === 'study') return post.category === 'STUDY';
                                             if (postsSubTab === 'project') return post.category === 'PROJECT';
                                             return false;
                                         }).map((post) => (
                                             <Link
                                                 key={post.id}
                                                 href={`/community/${post.id}`}
                                                 className="block bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                                             >
                                                 <div className="flex items-center gap-2 mb-2">
                                                     <span
                                                         className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'RECRUITING'
                                                             ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                             : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                             }`}
                                                     >
                                                         {post.status === 'RECRUITING' ? '모집중' : '모집완료'}
                                                     </span>
                                                     {/* QnA가 아닌 경우에만 멤버 수 표시 */}
                                                     {post.category !== 'QNA' && (
                                                         <span className="text-xs text-gray-500 dark:text-gray-400">
                                                             {post.currentMembers}/{post.totalMembers}명
                                                         </span>
                                                     )}
                                                 </div>
                                                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                                     {post.title}
                                                 </h3>
                                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                                     조회수 {post.view.toLocaleString()} • 작성일 {new Date(post.createdAt).toLocaleDateString()}
                                                 </p>
                                             </Link>
                                         ))
                                     )}
                                </div>
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
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${meetingsFilter === 'all'
                                                ? 'border-primary text-primary font-bold'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        전체
                                    </button>
                                    <button
                                        onClick={() => setMeetingsFilter('organizer')}
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${meetingsFilter === 'organizer'
                                                ? 'border-primary text-primary font-bold'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        모집자
                                    </button>
                                    <button
                                        onClick={() => setMeetingsFilter('participant')}
                                        className={`px-4 py-2 text-sm transition-all border-b-2 ${meetingsFilter === 'participant'
                                                ? 'border-primary text-primary font-bold'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 font-medium'
                                            }`}
                                    >
                                        참여자
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {meetings.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            참여 중인 모임이 없습니다.
                                        </div>
                                    ) : (
                                        meetings
                                            .filter(meeting =>
                                                meetingsFilter === 'all' || 
                                                (meetingsFilter === 'organizer' && meeting.role === 'ORGANIZER') ||
                                                (meetingsFilter === 'participant' && meeting.role === 'PARTICIPANT')
                                            )
                                            .map((meeting) => (
                                                <div
                                                    key={meeting.id}
                                                    className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded font-bold ${meeting.status === 'RECRUITING'
                                                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                                }`}
                                                        >
                                                            {meeting.status === 'RECRUITING'
                                                                ? '모집중'
                                                                : '완료'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {meeting.role === 'ORGANIZER' ? '모집자' : '참여자'}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {meeting.title}
                                                    </h3>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Instructor Courses Tab */}
                        {activeTab === 'instructor' && profile.role === 'INSTRUCTOR' && (
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
