'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id;

    // 임시 데이터 - 실제로는 API에서 가져올 데이터
    const course = {
        id: courseId,
        title: '초보자를 위한 완벽한 웹 개발 마스터클래스',
        description: 'HTML, CSS, Javascript, React, Node.js 등을 한번에 배우고 풀스택 개발자로 거듭나세요.',
        category: ['웹 개발', '프론트엔드'],
        instructor: {
            name: '김철수',
            role: '10년차 풀스택 개발자',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            bio: '안녕하세요! 저는 다양한 스타트업과 대기업에서 웹 개발을 경험한 김철수입니다. 복잡한 개념도 쉽게 이해할 수 있도록 돕는 것을 좋아하며, 이 강의를 통해 여러분이 개발자로서 성장하는 데 든든한 발판이 되어드리겠습니다.',
        },
        rating: 4.7,
        reviewCount: 1234,
        studentCount: 12345,
        lastUpdated: '2024년 7월',
        price: 129000,
        originalPrice: 258000,
        discount: 50,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
        features: [
            { icon: 'smart_display', text: '24.5시간의 동영상 강의' },
            { icon: 'article', text: '12개의 아티클' },
            { icon: 'download_for_offline', text: '다운로드 가능한 리소스' },
            { icon: 'workspace_premium', text: '수료증 발급' },
        ],
    };

    const curriculum = [
        {
            section: '섹션 1: 시작하기',
            lectures: [
                { title: '1-1. 강의 소개', duration: '03:15' },
                { title: '1-2. 개발 환경 설정', duration: '12:30' },
            ],
        },
        {
            section: '섹션 2: HTML 기초',
            lectures: [{ title: '2-1. HTML의 구조', duration: '08:45' }],
        },
        {
            section: '섹션 3: CSS 마스터하기',
            lectures: [{ title: '3-1. CSS 선택자', duration: '15:20' }],
        },
    ];

    const reviews = [
        {
            name: '이영희',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            rating: 5,
            date: '2주 전',
            comment: '비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다! 강사님 최고!',
        },
        {
            name: '박지민',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            rating: 4,
            date: '1개월 전',
            comment: '내용이 조금 어렵긴 했지만, 실무에 바로 적용할 수 있는 팁이 많아서 유용했습니다.',
        },
    ];

    return (
        <main className="w-full">
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-2/3">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.category.map((cat, index) => (
                                    <React.Fragment key={cat}>
                                        <a className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="#">
                                            {cat}
                                        </a>
                                        {index < course.category.length - 1 && (
                                            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight pb-3 pt-2">
                                {course.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal pb-3 pt-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500 font-bold">{course.rating}</span>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                {i < Math.floor(course.rating) ? 'star' : i < course.rating ? 'star_half' : 'star'}
                                            </span>
                                        ))}
                                    </div>
                                    <span>({course.reviewCount.toLocaleString()}개 수강평)</span>
                                </div>
                                <span>|</span>
                                <span>총 {course.studentCount.toLocaleString()}명 수강생</span>
                            </div>
                            <p className="text-sm dark:text-gray-300">
                                강사: <a className="text-primary font-semibold" href="#">{course.instructor.name}</a> | 최종 업데이트: {course.lastUpdated}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sticky Card */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row-reverse gap-8 xl:gap-12 relative">
                    {/* Right Column (Sticky Card) */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div
                                    className="aspect-video bg-cover bg-center"
                                    style={{ backgroundImage: `url('${course.thumbnail}')` }}
                                >
                                    <div className="w-full h-full bg-black/40 flex items-center justify-center">
                                        <button className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/50 transition-colors">
                                            <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₩{course.price.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                            ₩{course.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="bg-primary/20 text-primary text-sm font-bold px-2 py-1 rounded">
                                            {course.discount}% 할인
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold tracking-[0.015em] hover:bg-primary/90">
                                            <span className="truncate">지금 구매</span>
                                        </button>
                                        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-base font-bold tracking-[0.015em] border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <span className="truncate">장바구니 담기</span>
                                        </button>
                                    </div>
                                    <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 space-y-3">
                                        <p className="font-semibold text-base text-gray-900 dark:text-white">이 강의는 다음을 포함합니다:</p>
                                        {course.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-base">{feature.icon}</span>
                                                <span>{feature.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column (Main Content) */}
                    <div className="w-full lg:w-2/3">
                        {/* Navigation Tabs */}
                        <div className="sticky top-16 z-40 bg-background-light dark:bg-background-dark py-2 border-b border-gray-200 dark:border-gray-700 mb-8">
                            <div className="flex gap-6">
                                <a className="text-primary font-bold border-b-2 border-primary pb-2" href="#curriculum">
                                    커리큘럼
                                </a>
                                <a className="text-gray-600 dark:text-gray-400 font-medium hover:text-primary pb-2 border-b-2 border-transparent" href="#instructor">
                                    강사 정보
                                </a>
                                <a className="text-gray-600 dark:text-gray-400 font-medium hover:text-primary pb-2 border-b-2 border-transparent" href="#reviews">
                                    수강평
                                </a>
                                <a className="text-gray-600 dark:text-gray-400 font-medium hover:text-primary pb-2 border-b-2 border-transparent" href="#qa">
                                    Q&A
                                </a>
                            </div>
                        </div>

                        {/* Curriculum Section */}
                        <div className="space-y-6 scroll-mt-32" id="curriculum">
                            <h2 className="text-2xl font-bold dark:text-white">강의 커리큘럼</h2>
                            <div className="space-y-2">
                                {curriculum.map((section, index) => (
                                    <details key={index} className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700" open={index === 0}>
                                        <summary className="flex items-center justify-between p-4 cursor-pointer">
                                            <span className="font-semibold">{section.section}</span>
                                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                                expand_more
                                            </span>
                                        </summary>
                                        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
                                            {section.lectures.map((lecture, lectureIndex) => (
                                                <div key={lectureIndex} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-lg">play_circle</span>
                                                        <span>{lecture.title}</span>
                                                    </div>
                                                    <span className="text-gray-500">{lecture.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Instructor Section */}
                        <div className="mt-16 scroll-mt-32" id="instructor">
                            <h2 className="text-2xl font-bold mb-6 dark:text-white">강사 정보</h2>
                            <div className="flex flex-col sm:flex-row items-start gap-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div
                                    className="w-24 h-24 rounded-full bg-cover bg-center flex-shrink-0"
                                    style={{ backgroundImage: `url('${course.instructor.avatar}')` }}
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-primary">{course.instructor.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">{course.instructor.role}</p>
                                    <p className="text-sm leading-relaxed dark:text-gray-300">{course.instructor.bio}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-16 scroll-mt-32" id="reviews">
                            <h2 className="text-2xl font-bold mb-6 dark:text-white">수강평</h2>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-6 mb-6">
                                    <div className="flex flex-col gap-2 items-center sm:items-start">
                                        <p className="text-gray-900 dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">
                                            {course.rating}
                                        </p>
                                        <div className="flex gap-0.5 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    {i < Math.floor(course.rating) ? 'star' : i < course.rating ? 'star_half' : 'star'}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                                            {course.reviewCount.toLocaleString()}개 수강평
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 mt-6">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                                                    style={{ backgroundImage: `url('${review.avatar}')` }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-bold dark:text-white">{review.name}</p>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                                                    </div>
                                                    <div className="flex gap-0.5 text-yellow-500 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                                {i < review.rating ? 'star' : 'star_border'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm leading-relaxed dark:text-gray-300">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full text-center py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        수강평 더보기
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Q&A Section */}
                        <div className="mt-16 scroll-mt-32" id="qa">
                            <h2 className="text-2xl font-bold mb-6 dark:text-white">Q&A</h2>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="font-semibold mb-2 dark:text-white">궁금한 점이 있으신가요?</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        className="flex-1 form-input rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-primary focus:border-primary"
                                        placeholder="질문을 입력하세요..."
                                        type="text"
                                    />
                                    <button className="flex-shrink-0 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90">
                                        질문하기
                                    </button>
                                </div>
                                <div className="mt-8 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                                            Q
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold dark:text-white">강의 소스 코드는 어디서 받을 수 있나요?</p>
                                            <div className="flex items-start gap-4 mt-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold flex-shrink-0">
                                                    A
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        각 섹션의 첫 번째 강의 자료에 첨부되어 있습니다. 확인 부탁드립니다!
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">강사 {course.instructor.name} · 1일 전</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
