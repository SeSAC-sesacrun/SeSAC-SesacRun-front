'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id;
    const [activeTab, setActiveTab] = useState<'intro' | 'curriculum'>('intro');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewLecture, setPreviewLecture] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInCart, setIsInCart] = useState(false);

    // 초를 MM:SS 형식으로 변환
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // CourseLevel enum을 한글로 변환
    const getLevelKorean = (level: string): string => {
        const levelMap: Record<string, string> = {
            'BEGINNER': '초급',
            'INTERMEDIATE': '중급',
            'ADVANCED': '고급',
        };
        return levelMap[level] || level;
    };

    // CourseLanguage enum을 한글로 변환
    const getLanguageKorean = (language: string): string => {
        const languageMap: Record<string, string> = {
            'KOREAN': '한국어',
            'ENGLISH': '영어',
        };
        return languageMap[language] || language;
    };

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/api/courses/${courseId}`
                );

                // 백엔드 응답: { success: true, data: {...} }
                const data = response.data.data;

                // 백엔드 데이터를 프론트엔드 형식으로 변환
                const formattedCourse = {
                    courseId: data.id,
                    title: data.title,
                    description: data.description,
                    detailedDescription: data.detailedDescription || '상세 설명이 없습니다.',
                    instructor: {
                        name: data.instructorName || '강사',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                        students: 0,
                        courses: 0,
                        rating: 0,
                    },
                    thumbnail: data.thumbnail,
                    category: data.category,
                    price: data.price,
                    originalPrice: null,
                    discount: 0,
                    rating: 0, // TODO: 리뷰 시스템 연동 후 추가
                    reviewCount: 0, // TODO: 리뷰 시스템 연동 후 추가
                    studentCount: data.studentCount,
                    lastUpdated: new Date(data.updatedAt).toLocaleDateString('ko-KR'),
                    language: data.language,  // Enum 코드 그대로 저장
                    level: data.level,        // Enum 코드 그대로 저장
                    features: data.features || [],
                    canWatch: data.canWatch || false, // 수강 가능 여부
                    curriculum: data.sections?.map((section: any) => ({
                        sectionId: section.id.toString(),
                        title: section.title,
                        lectures: section.lectures?.map((lecture: any) => ({
                            lectureId: lecture.id.toString(),
                            title: lecture.title,
                            duration: formatDuration(lecture.duration),
                            isFree: lecture.isFree,
                            videoUrl: lecture.videoUrl, // null이면 미리보기 불가
                        })) || [],
                    })) || [],
                    reviews: [], // TODO: 리뷰 시스템 연동 후 추가
                    qna: [], // TODO: Q&A 시스템 연동 후 추가
                };

                setCourse(formattedCourse);
                setError(null);
                console.log('📌 Course Data:', formattedCourse);
                console.log('📌 canWatch:', formattedCourse.canWatch);
            } catch (err: any) {
                console.error('강의 상세 정보를 불러오는데 실패했습니다:', err);
                setError(err.response?.data?.message || err.message || '강의 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseDetail();
        }
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">강의 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || '강의를 찾을 수 없습니다.'}</p>
                    <Link href="/courses" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        강의 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const mockCourse = {
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

    const handlePurchase = async () => {
        // 로그인 체크
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
            return;
        }

        try {
            await api.post('/api/carts', { courseId: Number(courseId) });
            // 성공 시 장바구니 상태 업데이트
            setIsInCart(true);
            alert('장바구니에 추가되었습니다.');
        } catch (error: any) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            } else if (error.response?.status === 409) {
                // 이미 장바구니에 있는 경우
                setIsInCart(true);
                alert(error.response?.data?.error?.message || '이미 장바구니에 담긴 강의입니다.');
                console.log(error);
            } else {
                console.error('장바구니 추가 실패:', error);
                alert('장바구니 추가에 실패했습니다.');
            }
        }
    };

    const handleGoToCart = () => {
        window.location.href = '/cart';
    };

    const handleWatchCourse = () => {
        window.location.href = `/watch/${courseId}`;
    };

    const handleLectureClick = (lecture: any) => {
        if (course?.canWatch) {
            // 수강 가능 시 watch 페이지로 이동
            window.location.href = `/watch/${courseId}?lecture=${lecture.lectureId}`;
        } else if (lecture.videoUrl) {
            // videoUrl이 있으면 미리보기 가능
            setPreviewLecture(lecture);
            setShowPreviewModal(true);
        }
    };

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
                                    <span className="text-sm text-gray-300">{course.studentCount.toLocaleString()}명 수강</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium"> {course.instructor.name}</p>
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
                                    {course?.canWatch ? (
                                        <button
                                            onClick={handleWatchCourse}
                                            className="w-full bg-blue-600 dark:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors mb-3"
                                        >
                                            이어보기
                                        </button>
                                    ) : isInCart ? (
                                        <button
                                            onClick={handleGoToCart}
                                            className="w-full bg-green-600 dark:bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors mb-3"
                                        >
                                            장바구니로 이동
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePurchase}
                                            className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors mb-3"
                                        >
                                            장바구니에 담기
                                        </button>
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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">난이도</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{getLevelKorean(course.level)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">언어</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{getLanguageKorean(course.language)}</p>
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
                                    {(['intro', 'curriculum'] as const).map((tab) => (
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
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">
                                    {/* Intro Tab */}
                                    {activeTab === 'intro' && (
                                        <div
                                            className="prose ck-content max-w-none text-gray-900 dark:text-white"
                                            dangerouslySetInnerHTML={{ __html: course.detailedDescription }}
                                        />
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
                                                                className={`p-4 flex items-center justify-between transition-colors ${(course?.canWatch || lecture.videoUrl)
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

                                    {/* Instructor, Reviews, and Q&A tabs removed per user request */}
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
                                {course?.canWatch ? (
                                    <button
                                        onClick={handleWatchCourse}
                                        className="w-full bg-blue-600 dark:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                    >
                                        이어보기
                                    </button>
                                ) : isInCart ? (
                                    <button
                                        onClick={handleGoToCart}
                                        className="w-full bg-green-600 dark:bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                                    >
                                        장바구니로 이동
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePurchase}
                                        className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        장바구니에 담기
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Preview Modal */}
            {showPreviewModal && previewLecture && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPreviewModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {previewLecture.title} - 미리보기
                            </h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>

                        {/* 유튜브 비디오 플레이어 */}
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {previewLecture.videoUrl && getYoutubeVideoId(previewLecture.videoUrl) ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(previewLecture.videoUrl)}?autoplay=1`}
                                    title={previewLecture.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-white">비디오를 불러올 수 없습니다.</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                💡 이 강의를 구매하시면 모든 강의를 시청하실 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
