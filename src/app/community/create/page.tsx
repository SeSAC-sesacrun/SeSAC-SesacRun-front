'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CommunityCreatePage() {
    const router = useRouter();
    const [category, setCategory] = useState<'study' | 'project'>('study');
    const [status, setStatus] = useState<'recruiting' | 'completed'>('recruiting');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [totalMembers, setTotalMembers] = useState('10');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 로그인 여부 확인
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            alert('로그인이 필요한 페이지입니다.');
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // 로컬 스토리지에서 accessToken 가져오기
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            // 백엔드 요청 데이터 구성
            const requestData = {
                category: category.toUpperCase(), // STUDY 또는 PROJECT
                title: title.trim(),
                content: content.trim(),
                totalMembers: parseInt(totalMembers, 10)
            };

            const response = await fetch('http://localhost:8080/api/recruitments/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                    localStorage.removeItem('accessToken');
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to create post');
            }

            const result = await response.json();

            if (result.success && result.data) {
                // 성공 시 생성된 모집 글의 상세 페이지로 이동
                const postId = result.data.postId || result.data.id || result.data;
                alert('모집 글이 성공적으로 작성되었습니다!');
                router.push(`/community/${postId}`);
            } else {
                throw new Error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('모집 글 작성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const exampleContent = `🚀 스터디 목표
실무 수준의 프로젝트를 경험하며 포트폴리오를 강화하고, 협업 능력을 향상시키는 것을 목표로 합니다.

💻 진행 방식
- 기간: 2023년 11월 5일부터 8주간 진행
- 시간: 매주 일요일 오후 2시 - 5시 (온라인)
- 기술 스택: React, TypeScript, Tailwind CSS
- 협업 툴: Git, GitHub, Discord, Figma

👥 모집 대상
JavaScript에 익숙하고 React 기본 개념을 이해하고 계신 분, 적극적으로 소통하며 스터디에 참여하실 분을 찾습니다.`;

    // 인증 확인 전에는 아무것도 렌더링하지 않음
    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>커뮤니티로 돌아가기</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">모집 글 작성</h1>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                        함께 성장할 팀원을 찾아보세요
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            모집 유형 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setCategory('study')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${category === 'study'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                스터디
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('project')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${category === 'project'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                팀 프로젝트
                            </button>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            모집 상태 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStatus('recruiting')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${status === 'recruiting'
                                    ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                모집중
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('completed')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${status === 'completed'
                                    ? 'border-gray-500 bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400'
                                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                모집완료
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            * 작성 후 수정 시 모집 상태를 변경할 수 있습니다
                        </p>
                    </div>

                    {/* Title */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 프론트엔드 실전 프로젝트 스터디원 모집"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Total Members */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            모집 인원 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={totalMembers}
                            onChange={(e) => setTotalMembers(e.target.value)}
                            min="2"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            상세 내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={exampleContent}
                            rows={15}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            required
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            * 위 예시 형식을 참고하여 작성해주세요
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            href="/community"
                            className="px-6 py-3 border-2 border-primary bg-white dark:bg-gray-900 text-primary rounded-lg font-bold hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 bg-gray-900 dark:bg-primary border-2 border-gray-900 dark:border-primary text-white rounded-lg font-bold transition-colors ${isSubmitting
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-800 dark:hover:bg-primary/90'
                                }`}
                        >
                            {isSubmitting ? '작성 중...' : '작성 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
