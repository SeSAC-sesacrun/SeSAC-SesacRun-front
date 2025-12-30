'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

interface Lecture {
    id: number;
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
}

interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}

interface CourseData {
    courseId: number;
    title: string;
    sections: Section[];
}

export default function WatchPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = params.id;

    const [activeTab, setActiveTab] = useState<'curriculum' | 'qa'>('curriculum');
    const [showQnAEditor, setShowQnAEditor] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [course, setCourse] = useState<CourseData | null>(null);
    const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 유튜브 URL에서 비디오 ID 추출
    const getYoutubeVideoId = (url: string): string | null => {
        if (!url) return null;

        // https://www.youtube.com/watch?v=VIDEO_ID 형식
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) return watchMatch[1];

        // https://youtu.be/VIDEO_ID 형식
        const shortMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortMatch) return shortMatch[1];

        // https://www.youtube.com/embed/VIDEO_ID 형식
        const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
        if (embedMatch) return embedMatch[1];

        return null;
    };

    useEffect(() => {
        const fetchCourseForWatch = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    `/api/courses/${courseId}/watch`
                );

                const data: CourseData = response.data.data;
                setCourse(data);

                // URL 쿼리 파라미터에서 강의 ID 확인
                const lectureIdParam = searchParams.get('lecture');

                if (lectureIdParam) {
                    // 특정 강의 찾기
                    let foundLecture: Lecture | null = null;
                    for (const section of data.sections) {
                        const lecture = section.lectures.find(l => l.id === Number(lectureIdParam));
                        if (lecture) {
                            foundLecture = lecture;
                            break;
                        }
                    }
                    if (foundLecture) {
                        setCurrentLecture(foundLecture);
                    } else {
                        // 찾지 못하면 첫 번째 강의
                        setCurrentLecture(data.sections[0]?.lectures[0] || null);
                    }
                } else {
                    // 쿼리 파라미터 없으면 첫 번째 강의
                    setCurrentLecture(data.sections[0]?.lectures[0] || null);
                }

                setError(null);
            } catch (err: any) {
                console.error('강의 시청 권한이 없습니다:', err);

                if (err.response?.status === 403) {
                    alert('수강 권한이 없습니다. 강의를 구매해주세요.');
                    router.push(`/courses/${courseId}`);
                } else if (err.response?.status === 401) {
                    alert('로그인이 필요합니다.');
                    router.push('/login');
                } else {
                    setError(err.response?.data?.message || '강의를 불러올 수 없습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseForWatch();
        }
    }, [courseId, router, searchParams]);

    // 강의 클릭 핸들러
    const handleLectureClick = (lecture: Lecture) => {
        setCurrentLecture(lecture);
    };

    // 이전/다음 강의 찾기
    const findAdjacentLecture = (direction: 'prev' | 'next'): Lecture | null => {
        if (!course || !currentLecture) return null;

        const allLectures: Lecture[] = [];
        course.sections.forEach(section => {
            allLectures.push(...section.lectures);
        });

        const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
        if (currentIndex === -1) return null;

        if (direction === 'prev') {
            return currentIndex > 0 ? allLectures[currentIndex - 1] : null;
        } else {
            return currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
        }
    };

    const handlePrevLecture = () => {
        const prevLecture = findAdjacentLecture('prev');
        if (prevLecture) {
            setCurrentLecture(prevLecture);
        }
    };

    const handleNextLecture = () => {
        const nextLecture = findAdjacentLecture('next');
        if (nextLecture) {
            setCurrentLecture(nextLecture);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">강의를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || '강의를 찾을 수 없습니다.'}</p>
                    <Link href="/courses" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        강의 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const prevLecture = findAdjacentLecture('prev');
    const nextLecture = findAdjacentLecture('next');

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-700 px-6 lg:px-10 py-3 bg-white dark:bg-gray-900 w-full z-10">
                <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                    <Link className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary" href={`/courses/${courseId}`}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">강의 상세로</span>
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{course.title}</h2>
                </div>
            </header>

            <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
                <main className="flex-1 p-6 lg:p-8 bg-white dark:bg-gray-900">
                    <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-[-0.015em] mb-4 text-gray-900 dark:text-white">
                        {currentLecture?.title || '강의를 선택해주세요'}
                    </h1>

                    {/* 유튜브 비디오 플레이어 */}
                    <div className="mb-6">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden">
                            {currentLecture && currentLecture.videoUrl && getYoutubeVideoId(currentLecture.videoUrl) ? (
                                <iframe
                                    key={currentLecture.id}
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(currentLecture.videoUrl)}?autoplay=1&rel=0`}
                                    title={currentLecture.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <span className="material-symbols-outlined text-6xl mb-4">video_library</span>
                                        <p>비디오를 불러올 수 없습니다.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevLecture}
                                disabled={!prevLecture}
                                className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-medium leading-normal px-4 transition-colors ${
                                    prevLecture
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                                <span>이전 강의</span>
                            </button>
                            <button
                                onClick={handleNextLecture}
                                disabled={!nextLecture}
                                className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-bold leading-normal px-4 transition-colors ${
                                    nextLecture
                                        ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                }`}
                            >
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
                                        <p className="text-sm font-bold leading-normal text-primary">0% 완료</p>
                                    </div>
                                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                                        <div className="h-2 rounded-full bg-primary" style={{ width: '0%' }} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pr-2 flex-1">
                                    {course.sections?.map((section: Section) => (
                                        <div key={section.id} className="flex flex-col">
                                            <button className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-left hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <span className="font-bold text-gray-800 dark:text-white">{section.title}</span>
                                                <span className="material-symbols-outlined text-gray-600 dark:text-white">
                                                    expand_more
                                                </span>
                                            </button>
                                            <ul className="flex flex-col mt-1 space-y-1">
                                                {section.lectures?.map((lecture: Lecture) => (
                                                    <li
                                                        key={lecture.id}
                                                        onClick={() => handleLectureClick(lecture)}
                                                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                            currentLecture?.id === lecture.id
                                                                ? 'bg-primary/10 dark:bg-primary/20'
                                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined text-lg mt-0.5 ${
                                                                currentLecture?.id === lecture.id ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                                                            }`}
                                                            style={currentLecture?.id === lecture.id ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                        >
                                                            play_circle
                                                        </span>
                                                        <div className="flex flex-col flex-1">
                                                            <p
                                                                className={`text-sm ${
                                                                    currentLecture?.id === lecture.id
                                                                        ? 'font-bold text-primary'
                                                                        : 'font-medium text-gray-700 dark:text-gray-200'
                                                                }`}
                                                            >
                                                                {lecture.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {Math.floor(lecture.duration / 60)}:{String(lecture.duration % 60).padStart(2, '0')}
                                                            </p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
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
