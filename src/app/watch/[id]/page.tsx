'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function WatchPage() {
    const params = useParams();
    const courseId = params.id;
    const [activeTab, setActiveTab] = useState<'curriculum' | 'qa'>('curriculum');

    const course = {
        id: courseId,
        title: 'UI/UX 마스터 클래스',
        currentLesson: '1. 디자인 입문하기',
        progress: 25,
        currentTime: '03:45',
        totalTime: '12:10',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
    };

    const curriculum = [
        {
            section: '섹션 1: 디자인 기초',
            expanded: true,
            lectures: [
                { id: '1', title: '1. 디자인 입문하기', duration: '12:10', locked: false, active: true },
                { id: '2', title: '2. 디자인 툴 소개', duration: '08:32', locked: false, active: false },
                { id: '3', title: '3. 타이포그래피 기본', duration: '15:00', locked: true, active: false },
            ],
        },
        {
            section: '섹션 2: UI 디자인',
            expanded: false,
            lectures: [],
        },
        {
            section: '섹션 3: UX 리서치',
            expanded: false,
            lectures: [],
        },
    ];

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-700 px-6 lg:px-10 py-3 bg-white dark:bg-gray-900 w-full z-10">
                <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                    <Link className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary" href="/my-courses">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">내 강의</span>
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{course.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400')",
                        }}
                    />
                </div>
            </header>

            <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
                <main className="flex-1 p-6 lg:p-8">
                    <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-[-0.015em] mb-4">
                        {course.currentLesson}
                    </h1>
                    <div className="mb-6">
                        <div
                            className="relative flex items-center justify-center bg-black aspect-video rounded-xl overflow-hidden"
                            style={{
                                backgroundImage: `url('${course.thumbnail}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black/30" />
                            <button className="relative flex shrink-0 items-center justify-center rounded-full size-20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors">
                                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_arrow
                                </span>
                            </button>

                            {/* Video Controls */}
                            <div className="absolute inset-x-4 bottom-4 z-10">
                                <div className="w-full group">
                                    <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer">
                                        <div className="h-1 rounded-full bg-primary" style={{ width: `${course.progress}%` }}>
                                            <div className="w-full h-full flex justify-end items-center">
                                                <div className="size-3 rounded-full bg-white ring-2 ring-primary scale-0 group-hover:scale-100 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-white text-xs font-medium leading-normal tracking-wider">
                                        {course.currentTime} / {course.totalTime}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">skip_previous</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">replay_10</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">forward_10</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">skip_next</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">volume_up</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">settings</span>
                                        </button>
                                        <button className="text-white hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">fullscreen</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                        <div className="flex gap-2">
                            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white gap-2 text-sm font-medium leading-normal px-4 hover:bg-gray-300 dark:hover:bg-gray-600">
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                                <span>이전 강의</span>
                            </button>
                            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal px-4 hover:bg-primary/90">
                                <span>다음 강의</span>
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border-2 border-primary text-primary text-sm font-bold hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-lg">rate_review</span>
                            <span>수강평 작성</span>
                        </button>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-[380px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex-col hidden lg:flex">
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('curriculum')}
                            className={`flex-1 py-4 text-center text-sm font-bold border-b-2 ${activeTab === 'curriculum'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            커리큘럼
                        </button>
                        <button
                            onClick={() => setActiveTab('qa')}
                            className={`flex-1 py-4 text-center text-sm font-bold border-b-2 ${activeTab === 'qa'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Q&A
                        </button>
                    </div>

                    <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                        {activeTab === 'curriculum' && (
                            <>
                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex gap-6 justify-between items-center">
                                        <p className="text-sm font-medium leading-normal">학습 진행률</p>
                                        <p className="text-sm font-bold leading-normal text-primary">{course.progress}% 완료</p>
                                    </div>
                                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                                        <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pr-2 flex-1">
                                    {curriculum.map((section, sectionIndex) => (
                                        <div key={sectionIndex} className="flex flex-col">
                                            <button className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-left hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <span className="font-bold text-gray-800 dark:text-white">{section.section}</span>
                                                <span className="material-symbols-outlined text-gray-600 dark:text-white">
                                                    {section.expanded ? 'expand_less' : 'expand_more'}
                                                </span>
                                            </button>
                                            {section.expanded && section.lectures.length > 0 && (
                                                <ul className="flex flex-col mt-1 space-y-1">
                                                    {section.lectures.map((lecture) => (
                                                        <li
                                                            key={lecture.id}
                                                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${lecture.active
                                                                    ? 'bg-primary/10 dark:bg-primary/20'
                                                                    : lecture.locked
                                                                        ? 'opacity-60'
                                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`material-symbols-outlined text-lg mt-0.5 ${lecture.active
                                                                        ? 'text-primary'
                                                                        : lecture.locked
                                                                            ? 'text-gray-400'
                                                                            : 'text-gray-400'
                                                                    }`}
                                                                style={lecture.active ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                            >
                                                                {lecture.locked ? 'lock' : 'play_circle'}
                                                            </span>
                                                            <div className="flex flex-col flex-1">
                                                                <p
                                                                    className={`text-sm ${lecture.active
                                                                            ? 'font-bold text-primary dark:text-white'
                                                                            : lecture.locked
                                                                                ? 'font-medium text-gray-400 dark:text-gray-500'
                                                                                : 'font-medium text-gray-700 dark:text-gray-200'
                                                                        }`}
                                                                >
                                                                    {lecture.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{lecture.duration}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeTab === 'qa' && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    이 강의에 대한 질문을 남겨주세요
                                </p>
                                <textarea
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-primary focus:border-primary resize-none"
                                    placeholder="질문을 입력하세요..."
                                    rows={4}
                                />
                                <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                                    질문하기
                                </button>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">최근 질문</p>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                디자인 툴은 어떤 것을 사용하나요?
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">김학생 · 2일 전</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
