'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id;
    const [activeTab, setActiveTab] = useState<'intro' | 'curriculum' | 'instructor' | 'reviews' | 'qna'>('intro');
    const [isInCart, setIsInCart] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewLecture, setPreviewLecture] = useState<any>(null);

    // 사용자 구매 여부 (실제로는 API에서 확인)
    const isPurchased = false; // true면 구매한 사용자

    const course = {
        courseId: courseId,
        title: '초보자를 위한 완벽한 웹 개발 마스터클래스',
        description:
            'HTML, CSS, Javascript부터 React, Node.js까지 웹 개발의 모든 것을 배우는 완벽한 강의입니다. 실전 프로젝트를 통해 포트폴리오도 완성하세요!',
        detailedDescription: `이 강의는 웹 개발의 기초부터 실전까지 모든 것을 다룹니다.

📚 무엇을 배우나요?
- HTML5, CSS3의 모든 기능
- JavaScript ES6+ 최신 문법
- React를 활용한 SPA 개발
- Node.js와 Express로 백엔드 구축
- MongoDB를 활용한 데이터베이스 설계
- 실전 프로젝트 3개 완성

👨‍💻 이런 분들께 추천합니다
- 웹 개발을 처음 시작하는 분
- 프론트엔드와 백엔드를 모두 배우고 싶은 분
- 실무 프로젝트 경험이 필요한 분
- 포트폴리오를 만들고 싶은 분`,
        instructor: {
            name: '김철수',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            bio: '10년차 풀스택 개발자이자 유튜버입니다. 5만명 이상의 수강생에게 웹 개발을 가르쳤습니다.',
            students: 52341,
            courses: 12,
            rating: 4.9,
        },
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
        category: '프로그래밍',
        price: 129000,
        originalPrice: 258000,
        discount: 50,
        rating: 4.7,
        reviewCount: 1234,
        studentCount: 12345,
        lastUpdated: '2024년 1월',
        language: '한국어',
        level: '초급',
        duration: '24.5시간',
        features: [
            '24.5시간의 온디맨드 비디오',
            '12개의 다운로드 가능한 리소스',
            '모바일 및 TV 액세스',
            '수료증 발급',
            '평생 액세스',
        ],
        curriculum: [
            {
                sectionId: '1',
                title: '섹션 1: 시작하기',
                lectures: [
                    { lectureId: '1', title: '1-1. 강의 소개', duration: '03:15', isFree: true },
                    { lectureId: '2', title: '1-2. 개발 환경 설정', duration: '12:30', isFree: true },
                    { lectureId: '3', title: '1-3. HTML 기초', duration: '25:45', isFree: false },
                ],
            },
            {
                sectionId: '2',
                title: '섹션 2: CSS 마스터하기',
                lectures: [
                    { lectureId: '4', title: '2-1. CSS 선택자', duration: '18:20', isFree: false },
                    { lectureId: '5', title: '2-2. Flexbox 완벽 가이드', duration: '32:10', isFree: false },
                ],
            },
        ],
        reviews: [
            {
                reviewId: '1',
                user: { name: '이영희', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
                rating: 5,
                comment: '비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다!',
                createdAt: '2024-01-15',
            },
            {
                reviewId: '2',
                user: { name: '박민수', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
                rating: 4,
                comment: '내용은 좋은데 조금 길어요. 그래도 추천합니다.',
                createdAt: '2024-01-10',
            },
        ],
        qna: [
            {
                questionId: '1',
                user: { name: '김학생', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
                question: 'React 버전은 어떤 것을 사용하나요?',
                answer: {
                    content: 'React 18 최신 버전을 사용합니다!',
                    answeredAt: '2024-01-14',
                },
                createdAt: '2024-01-13',
            },
        ],
    };

    const handleAddToCart = () => {
        setIsInCart(true);
        alert('장바구니에 담겼습니다!');
    };

    const handleGoToCart = () => {
        window.location.href = '/cart';
    };

    const handleEnroll = () => {
        window.location.href = '/cart';
    };

    const handleLectureClick = (lecture: any) => {
        if (isPurchased) {
            window.location.href = `/watch/${courseId}?lecture=${lecture.lectureId}`;
        } else if (lecture.isFree) {
            setPreviewLecture(lecture);
            setShowPreviewModal(true);
        }
    };

    return (
        <>
            <main className="flex-1 bg-background-light dark:bg-background-dark">
                {/* Hero Section */}
                <div className="bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="mb-4">
                                    <span className="text-sm text-gray-300">{course.category}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                                <p className="text-lg text-gray-300 mb-6">{course.description}</p>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400 font-bold">{course.rating}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-yellow-400 text-sm">
                                                    {i < Math.floor(course.rating) ? 'star' : 'star_border'}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-300">({course.reviewCount.toLocaleString()}개 평가)</span>
                                    </div>
                                    <span className="text-sm text-gray-300">{course.studentCount.toLocaleString()}명 수강</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium">강사: {course.instructor.name}</p>
                                        <p className="text-sm text-gray-300">{course.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Desktop */}
                            <div className="hidden lg:block">
                                <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <div
                                        className="relative w-full aspect-video bg-cover bg-center rounded-lg mb-4 group cursor-pointer"
                                        style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                        onClick={() => {
                                            if (course.curriculum[0]?.lectures[0]) {
                                                handleLectureClick(course.curriculum[0].lectures[0]);
                                            }
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg group-hover:bg-black/40 transition-colors">
                                            <div className="flex items-center justify-center size-16 bg-white/90 rounded-full">
                                                <span className="material-symbols-outlined text-gray-900 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    play_arrow
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        미리보기
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                ₩{course.price.toLocaleString()}
                                            </span>
                                            {course.originalPrice && (
                                                <>
                                                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                                        ₩{course.originalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                                        {course.discount}% 할인
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {isPurchased ? (
                                        <button
                                            onClick={() => window.location.href = `/watch/${courseId}`}
                                            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-3"
                                        >
                                            학습하기
                                        </button>
                                    ) : (
                                        <>
                                            {isInCart ? (
                                                <button
                                                    onClick={handleGoToCart}
                                                    className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors mb-3"
                                                >
                                                    장바구니로 이동
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="w-full bg-white dark:bg-gray-700 border-2 border-primary text-primary dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors mb-3"
                                                >
                                                    장바구니 담기
                                                </button>
                                            )}
                                            <button
                                                onClick={handleEnroll}
                                                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                지금 구매하기
                                            </button>
                                        </>
                                    )}
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">이 강의에 포함된 내용</h3>
                                        <ul className="space-y-2">
                                            {course.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Course Info */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">강의 정보</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">난이도</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{course.level}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">총 시간</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{course.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">언어</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{course.language}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">최근 업데이트</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{course.lastUpdated}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                                    {(['intro', 'curriculum', 'instructor', 'reviews', 'qna'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            {tab === 'intro' && '강의 소개'}
                                            {tab === 'curriculum' && '커리큘럼'}
                                            {tab === 'instructor' && '강사 정보'}
                                            {tab === 'reviews' && '수강평'}
                                            {tab === 'qna' && 'Q&A'}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">
                                    {/* Intro Tab */}
                                    {activeTab === 'intro' && (
                                        <div className="prose dark:prose-invert max-w-none">
                                            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                                                {course.detailedDescription}
                                            </div>
                                        </div>
                                    )}

                                    {/* Curriculum Tab */}
                                    {activeTab === 'curriculum' && (
                                        <div className="space-y-4">
                                            {course.curriculum.map((section) => (
                                                <div key={section.sectionId} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 font-bold text-gray-900 dark:text-white">
                                                        {section.title}
                                                    </div>
                                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {section.lectures.map((lecture) => (
                                                            <div
                                                                key={lecture.lectureId}
                                                                onClick={() => handleLectureClick(lecture)}
                                                                className={`p-4 flex items-center justify-between transition-colors ${(isPurchased || lecture.isFree)
                                                                        ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                                                                        : 'opacity-60 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                                                                        play_circle
                                                                    </span>
                                                                    <span className="text-gray-900 dark:text-white">{lecture.title}</span>
                                                                    {lecture.isFree && (
                                                                        <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                                                            무료
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">{lecture.duration}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Instructor Tab */}
                                    {activeTab === 'instructor' && (
                                        <div>
                                            <div className="flex items-start gap-6 mb-6">
                                                <img
                                                    src={course.instructor.avatar}
                                                    alt={course.instructor.name}
                                                    className="w-24 h-24 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {course.instructor.name}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{course.instructor.bio}</p>
                                                    <div className="flex gap-6 text-sm">
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-400">평점: </span>
                                                            <span className="font-bold text-gray-900 dark:text-white">{course.instructor.rating}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-400">수강생: </span>
                                                            <span className="font-bold text-gray-900 dark:text-white">
                                                                {course.instructor.students.toLocaleString()}명
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-400">강의: </span>
                                                            <span className="font-bold text-gray-900 dark:text-white">
                                                                {course.instructor.courses}개
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reviews Tab */}
                                    {activeTab === 'reviews' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {course.rating}
                                                    </div>
                                                    <div className="flex justify-center mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="material-symbols-outlined text-yellow-400">
                                                                {i < Math.floor(course.rating) ? 'star' : 'star_border'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {course.reviewCount.toLocaleString()}개 평가
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                {course.reviews.map((review) => (
                                                    <div key={review.reviewId} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                                                        <div className="flex items-start gap-4">
                                                            <img
                                                                src={review.user.avatar}
                                                                alt={review.user.name}
                                                                className="w-12 h-12 rounded-full"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="font-bold text-gray-900 dark:text-white">{review.user.name}</span>
                                                                    <div className="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i} className="material-symbols-outlined text-yellow-400 text-sm">
                                                                                {i < review.rating ? 'star' : 'star_border'}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{review.createdAt}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Q&A Tab */}
                                    {activeTab === 'qna' && (
                                        <div className="space-y-6">
                                            {course.qna.map((item) => (
                                                <div key={item.questionId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <img
                                                            src={item.user.avatar}
                                                            alt={item.user.name}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-bold text-gray-900 dark:text-white">{item.user.name}</span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">{item.createdAt}</span>
                                                            </div>
                                                            <p className="text-gray-900 dark:text-white">{item.question}</p>
                                                        </div>
                                                    </div>
                                                    {item.answer && (
                                                        <div className="ml-14 pl-4 border-l-2 border-primary">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-bold text-primary">강사 답변</span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {item.answer.answeredAt}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300">{item.answer.content}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sidebar */}
                        <div className="lg:hidden">
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₩{course.price.toLocaleString()}
                                        </span>
                                        {course.originalPrice && (
                                            <>
                                                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                                    ₩{course.originalPrice.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                                    {course.discount}% 할인
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {isPurchased ? (
                                    <button
                                        onClick={() => window.location.href = `/watch/${courseId}`}
                                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-3"
                                    >
                                        학습하기
                                    </button>
                                ) : (
                                    <>
                                        {isInCart ? (
                                            <button
                                                onClick={handleGoToCart}
                                                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors mb-3"
                                            >
                                                장바구니로 이동
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full bg-white dark:bg-gray-700 border-2 border-primary text-primary dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors mb-3"
                                            >
                                                장바구니 담기
                                            </button>
                                        )}
                                        <button
                                            onClick={handleEnroll}
                                            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            지금 구매하기
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Preview Modal */}
            {showPreviewModal && previewLecture && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{previewLecture.title}</h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>
                        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white">미리보기 영상 플레이어</span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            이 강의를 구매하시면 모든 강의를 시청하실 수 있습니다.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
