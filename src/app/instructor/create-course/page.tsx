'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { courseService } from '@/services/course';
import { CreateCourseData } from '@/types';

// CKEditor를 dynamic import (클라이언트 사이드에서만 로드)
const CKEditor = dynamic(() => import('@/components/editor/CKEditorWrapper'), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('0');
    const [originalPrice, setOriginalPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [sections, setSections] = useState<Array<{
        id: number;
        title: string;
        lectures: Array<{ id: number; title: string; youtubeUrl: string; duration: string }>;
    }>>([
        { id: 1, title: '섹션 1', lectures: [{ id: 1, title: '', youtubeUrl: '', duration: '' }] },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAddSection = () => {
        setSections([
            ...sections,
            { id: sections.length + 1, title: `섹션 ${sections.length + 1}`, lectures: [{ id: 1, title: '', youtubeUrl: '', duration: '' }] },
        ]);
    };

    const handleAddLecture = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].lectures.push({
            id: newSections[sectionIndex].lectures.length + 1,
            title: '',
            youtubeUrl: '',
            duration: '',
        });
        setSections(newSections);
    };

    // MM:SS 형식을 초로 변환
    const durationToSeconds = (duration: string): number => {
        if (!duration) return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            return minutes * 60 + seconds;
        }
        return 0;
    };

    // HTML 태그 제거 및 텍스트 추출
    const stripHtmlTags = (html: string): string => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // description에서 의미있는 특징 배열 생성
    const extractFeatures = (description: string): string[] => {
        if (!description) return [];
        
        // HTML 태그 제거
        const text = stripHtmlTags(description);
        
        // 빈 문자열이면 빈 배열 반환
        if (!text.trim()) return [];
        
        // 문장 단위로 분리 (줄바꿈, 마침표 기준)
        const sentences = text
            .split(/[.\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 100); // 너무 짧거나 긴 문장 제외
        
        // 최대 5개까지만 반환
        return sentences.slice(0, 5);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // 데이터 변환
            const courseData: CreateCourseData = {
                title,
                description,
                thumbnail,
                category,
                price: parseInt(price) || 0,
                originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
                discount: originalPrice && price
                    ? Math.round(((parseInt(originalPrice) - parseInt(price)) / parseInt(originalPrice)) * 100)
                    : 0,
                features: extractFeatures(description), // description에서 특징 추출하여 배열로 변환
                sections: sections.map((section, sectionIndex) => ({
                    title: section.title,
                    order: sectionIndex + 1,
                    lectures: section.lectures.map((lecture, lectureIndex) => ({
                        title: lecture.title,
                        videoUrl: lecture.youtubeUrl,
                        duration: durationToSeconds(lecture.duration),
                        order: lectureIndex + 1,
                        isFree: sectionIndex === 0 && lectureIndex === 0, // 첫 번째 강의만 무료
                    })),
                })),
            };

            console.log('=== 강의 생성 요청 시작 ===');
            console.log('전송할 데이터:', JSON.stringify(courseData, null, 2));
            console.log('Authorization 토큰:', localStorage.getItem('accessToken') ? '있음' : '없음');

            // API 호출
            const result = await courseService.createCourse(courseData);

            console.log('강의 생성 성공:', result);
            alert('강의가 성공적으로 생성되었습니다!');

            // 성공 시 강사 페이지로 이동
            router.push('/profile');
        } catch (err: any) {
            console.error('=== 강의 생성 실패 ===');
            console.error('Error 객체:', err);
            console.error('Error 메시지:', err.message);
            console.error('Error stack:', err.stack);
            setError(err.message || '강의 생성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['프로그래밍', '데이터 사이언스', '디자인', '마케팅', '비즈니스', '기타'];

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>마이페이지로 돌아가기</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">새 강의 만들기</h1>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                        학생들과 지식을 공유하세요
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">기본 정보</h2>

                        {/* Title */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                강의 제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 초보자를 위한 완벽한 웹 개발 마스터클래스"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Features with CKEditor */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                강의 특징 <span className="text-red-500">*</span>
                            </label>
                            <CKEditor
                                value={description}
                                onChange={setDescription}
                            />
                            {!description && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    강의의 특징과 장점을 작성해주세요.
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                카테고리 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            >
                                <option value="">카테고리를 선택하세요</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Thumbnail URL */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                썸네일 이미지 URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt="썸네일 미리보기"
                                    className="mt-3 w-full max-w-md rounded-lg"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    판매 가격 (원) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0 (무료)"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    정가 (원)
                                </label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    placeholder="선택사항"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">커리큘럼</h2>
                            <button
                                type="button"
                                onClick={handleAddSection}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>섹션 추가</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {sections.map((section, sectionIndex) => (
                                <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => {
                                            const newSections = [...sections];
                                            newSections[sectionIndex].title = e.target.value;
                                            setSections(newSections);
                                        }}
                                        placeholder="섹션 제목"
                                        className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
                                        required
                                    />

                                    <div className="space-y-3">
                                        {section.lectures.map((lecture, lectureIndex) => (
                                            <div key={lecture.id} className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={lecture.title}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].title = e.target.value;
                                                            setSections(newSections);
                                                        }}
                                                        placeholder="강의 제목"
                                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        value={lecture.duration}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].duration = e.target.value;
                                                            setSections(newSections);
                                                        }}
                                                        placeholder="12:30"
                                                        className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={lecture.youtubeUrl}
                                                    onChange={(e) => {
                                                        const newSections = [...sections];
                                                        newSections[sectionIndex].lectures[lectureIndex].youtubeUrl = e.target.value;
                                                        setSections(newSections);
                                                    }}
                                                    placeholder="유튜브 링크 (예: https://www.youtube.com/watch?v=...)"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddLecture(sectionIndex)}
                                        className="mt-3 text-sm text-primary font-medium hover:underline"
                                    >
                                        + 강의 추가
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            href="/profile"
                            className="px-6 py-3 border-2 border-primary bg-white dark:bg-gray-900 text-primary rounded-lg font-bold hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '생성 중...' : '강의 생성'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
