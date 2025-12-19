'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CommunityDetailPage() {
    const params = useParams();
    const postId = params.id;

    // 임시 데이터 - 실제로는 API에서 가져올 데이터
    const post = {
        id: postId,
        title: '프론트엔드 실전 프로젝트 스터디원 모집',
        author: {
            name: '강민준',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        },
        date: '2023.10.27',
        views: 1234,
        category: '스터디 모집',
        likes: 128,
        status: '모집중',
        currentMembers: 8,
        totalMembers: 10,
        tags: ['#프론트엔드', '#프로젝트', '#스터디모집'],
    };

    const participants = [
        { name: '김민지', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
        { name: '이서준', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
        { name: '박하은', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
        { name: '정유진', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
        { name: '최지훈', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
    ];

    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="flex flex-wrap gap-2">
                        <a className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="#">
                            커뮤니티
                        </a>
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
                            {post.category}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 flex flex-col gap-6">
                        <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                                    style={{ backgroundImage: `url('${post.author.avatar}')` }}
                                />
                                <div className="flex flex-col">
                                    <p className="text-gray-900 dark:text-white text-base font-bold leading-normal flex-1 truncate">
                                        {post.author.name}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                                        {post.date} | 조회수 {post.views.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Link href="/chat/1" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300 ease-in-out">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    chat_bubble
                                </span>
                                <span className="truncate">채팅하기</span>
                            </Link>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-300 text-base font-normal leading-relaxed pt-2 space-y-4">
                            <p>안녕하세요! React와 TypeScript를 사용한 실전 프론트엔드 프로젝트를 함께 진행할 스터디원을 모집합니다.</p>
                            <p><strong>🚀 스터디 목표</strong></p>
                            <p>
                                실무 수준의 프로젝트를 경험하며 포트폴리오를 강화하고, 협업 능력을 향상시키는 것을 목표로 합니다. 코드 리뷰와 페어 프로그래밍을 통해 함께 성장하는 스터디를 지향합니다.
                            </p>
                            <p><strong>💻 진행 방식</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>기간:</strong> 2023년 11월 5일부터 8주간 진행</li>
                                <li><strong>시간:</strong> 매주 일요일 오후 2시 - 5시 (온라인)</li>
                                <li><strong>기술 스택:</strong> React, TypeScript, Tailwind CSS, Zustand</li>
                                <li><strong>협업 툴:</strong> Git, GitHub, Discord, Figma</li>
                            </ul>
                            <p><strong>👥 모집 대상</strong></p>
                            <p>
                                JavaScript에 익숙하고 React 기본 개념을 이해하고 계신 분, 적극적으로 소통하며 스터디에 참여하실 분을 찾습니다. 초보자도 열정이 있다면 환영합니다!
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-white/80 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-4 bg-primary/10 text-primary dark:bg-primary/20 dark:text-white/80 text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    thumb_up
                                </span>
                                <span className="truncate">좋아요 {post.likes}</span>
                            </button>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="material-symbols-outlined text-xl">bookmark</span>
                                <span className="truncate">북마크하기</span>
                            </button>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-11 px-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="material-symbols-outlined text-xl">share</span>
                                <span className="truncate">공유하기</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 w-full lg:sticky lg:top-24">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                            <span className="inline-block w-fit text-sm font-bold bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                                {post.status}
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">모집 인원</p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        현재 {post.currentMembers}명 / 총 {post.totalMembers}명
                                    </p>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${(post.currentMembers / post.totalMembers) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">모임 일정</p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    2023년 11월 5일 시작, 매주 일요일 오후 2시
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">장소</p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">온라인 (Discord)</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                현재 참여자 ({post.currentMembers})
                            </h4>
                            <div className="flex flex-col gap-3">
                                {participants.map((participant, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                            style={{ backgroundImage: `url('${participant.avatar}')` }}
                                        />
                                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                            {participant.name}
                                        </span>
                                    </div>
                                ))}
                                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                    +3명 더보기
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
