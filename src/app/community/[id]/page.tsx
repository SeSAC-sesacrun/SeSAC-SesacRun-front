'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostDetail {
    postId: number;
    title: string;
    content: string;
    status: string;
    authorName: string;
    views: number;
    currentMembers: number;
    totalMembers: number;
    createdAt: string;
    author: boolean;
}

interface ApiResponse {
    success: boolean;
    data: PostDetail;
}

export default function CommunityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id;
    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchPostDetail = async () => {
            setLoading(true);
            try {
                // 헤더 구성 (토큰이 있으면 포함)
                const headers: HeadersInit = {};
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                const response = await fetch(
                    `http://localhost:8080/api/recruitments/posts/${postId}`,
                    {
                        signal: abortController.signal,
                        headers
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch post detail');
                }

                const result: ApiResponse = await response.json();

                if (result.success && result.data) {
                    setPost(result.data);
                }
            } catch (error) {
                // AbortError는 무시 (정상적인 취소)
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching post detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostDetail();
        }

        // cleanup 함수: 컴포넌트 언마운트 시 요청 취소
        return () => {
            abortController.abort();
        };
    }, [postId]);

    // 로딩 중일 때
    if (loading) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
                </div>
            </main>
        );
    }

    // 데이터가 없을 때
    if (!post) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">게시글을 찾을 수 없습니다.</p>
                </div>
            </main>
        );
    }

    // 모집 상태 (백엔드에서 받은 status 사용)
    const isRecruiting = post.status === 'RECRUITING';
    const statusText = isRecruiting ? '모집중' : '모집완료';

    // 프로그레스 바 계산
    const progressPercentage = post.totalMembers > 0
        ? Math.round((post.currentMembers / post.totalMembers) * 100)
        : 0;

    console.log('📊 Progress Bar Debug:', {
        currentMembers: post.currentMembers,
        totalMembers: post.totalMembers,
        percentage: progressPercentage,
        calculation: `${post.currentMembers} / ${post.totalMembers} * 100 = ${progressPercentage}%`
    });

    // 삭제 핸들러
    const handleDelete = async () => {
        if (!confirm('정말로 이 모집 글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/recruitments/posts/${post.postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                    localStorage.removeItem('accessToken');
                    router.push('/login');
                    return;
                }
                if (response.status === 403) {
                    alert('삭제 권한이 없습니다.');
                    return;
                }
                throw new Error('Failed to delete post');
            }

            alert('모집 글이 삭제되었습니다.');
            router.push('/community');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('모집 글 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 채팅방 생성 핸들러
    const handleCreateChat = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/recruitments/posts/${post.postId}/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                    localStorage.removeItem('accessToken');
                    router.push('/login');
                    return;
                }

                // 백엔드 에러 메시지 표시
                if (result.error && result.error.message) {
                    alert(result.error.message);
                } else {
                    alert('채팅방 생성에 실패했습니다.');
                }
                return;
            }

            if (result.success && result.data) {
                // 채팅방 ID로 이동 (쿼리 파라미터 불필요)
                const { roomId } = result.data;
                router.push(`/chat/${roomId}`);
            } else if (result.error && result.error.message) {
                // success: false인 경우
                alert(result.error.message);
            } else {
                alert('채팅방 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
            alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-wrap gap-2 mb-8">
                <Link className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="/community">
                    커뮤니티
                </Link>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
                    모집 글
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 flex flex-col gap-6">
                        <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 dark:bg-primary/20 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary dark:text-white/80">person</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-900 dark:text-white text-base font-bold leading-normal flex-1 truncate">
                                        {post.authorName}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} | 조회수 {post.views.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {post.author && (
                                    <>
                                        <Link
                                            href={`/community/${post.postId}/edit`}
                                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                        >
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                            <span className="truncate">수정</span>
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 ease-in-out"
                                        >
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                            <span className="truncate">삭제</span>
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleCreateChat}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300 ease-in-out"
                                >
                                    <span className="material-symbols-outlined text-xl text-black dark:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        chat_bubble
                                    </span>
                                    <span className="truncate text-black dark:text-white">채팅하기</span>
                                </button>
                            </div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-300 text-base font-normal leading-relaxed pt-2 space-y-4">
                            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-4 bg-primary/10 text-primary dark:bg-primary/20 dark:text-white/80 text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    thumb_up
                                </span>
                                <span className="truncate">좋아요</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 w-full">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <span className={`inline-block w-fit text-sm font-bold px-3 py-1 rounded-full ${isRecruiting
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                {statusText}
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">모집 인원</p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        현재 {post.currentMembers}명 / 총 {post.totalMembers}명
                                    </p>
                                </div>
                                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 mt-2">
                                    <div
                                        className="bg-green-600 dark:bg-green-400 h-3 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${progressPercentage}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
