'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function WatchPage() {
    const params = useParams();
    const courseId = params.id;
    const [activeTab, setActiveTab] = useState<'curriculum' | 'qa'>('curriculum');
    const [showQnAEditor, setShowQnAEditor] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

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
                { id: '1', title: '1. 디자인 입문하기', duration: '12:10', active: true },
                { id: '2', title: '2. 디자인 툴 소개', duration: '08:32', active: false },
                { id: '3', title: '3. 타이포그래피 기본', duration: '15:00', active: false },
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

    const qnaList = [
        {
            id: '1',
            user: { name: '김학생', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
            question: '디자인 툴은 어떤 것을 사용하나요?',
            answer: {
                content: 'Figma를 주로 사용합니다. 무료로 사용할 수 있고 협업에도 좋습니다.',
                answeredAt: '2일 전',
            },
            createdAt: '3일 전',
        },
        {
            id: '2',
            user: { name: '이학생', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
            question: '강의 자료는 어디서 다운로드 받나요?',
            createdAt: '1일 전',
        },
    ];

    const handleSubmitQuestion = () => {
        if (newQuestion.trim()) {
            alert('질문이 등록되었습니다!');
            setNewQuestion('');
            setShowQnAEditor(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-700 px-6 lg:px-10 py-3 bg-white dark:bg-gray-900 w-full z-10">
                <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                    <Link className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary" href="/my-courses">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">내 강의</span>
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{course.title}</h2>
                </div>
            </header>

            <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
                <main className="flex-1 p-6 lg:p-8 bg-white dark:bg-gray-900">
                    <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-[-0.015em] mb-4 text-gray-900 dark:text-white">
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
                                        <p className="text-sm font-medium leading-normal text-gray-900 dark:text-white">학습 진행률</p>
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
                                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`material-symbols-outlined text-lg mt-0.5 ${lecture.active ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                                                                    }`}
                                                                style={lecture.active ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                            >
                                                                play_circle
                                                            </span>
                                                            <div className="flex flex-col flex-1">
                                                                <p
                                                                    className={`text-sm ${lecture.active
                                                                            ? 'font-bold text-primary dark:text-white'
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
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        이 강의에 대한 질문
                                    </p>
                                    <button
                                        onClick={() => setShowQnAEditor(!showQnAEditor)}
                                        className="text-sm font-bold text-primary hover:underline"
                                    >
                                        {showQnAEditor ? '취소' : '질문하기'}
                                    </button>
                                </div>

                                {showQnAEditor && (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <textarea
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-primary focus:border-primary resize-none"
                                            placeholder="질문을 입력하세요..."
                                            rows={4}
                                        />
                                        <button
                                            onClick={handleSubmitQuestion}
                                            className="mt-3 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            질문 등록
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto space-y-4">
                                    {qnaList.map((qna) => (
                                        <div key={qna.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-start gap-3 mb-3">
                                                <img
                                                    src={qna.user.avatar}
                                                    alt={qna.user.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {qna.user.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {qna.createdAt}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-900 dark:text-white">{qna.question}</p>
                                                </div>
                                            </div>
                                            {qna.answer && (
                                                <div className="ml-11 pl-3 border-l-2 border-primary">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-primary">강사 답변</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {qna.answer.answeredAt}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{qna.answer.content}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
