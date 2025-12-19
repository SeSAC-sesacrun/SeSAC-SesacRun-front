'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [sections, setSections] = useState([
        { id: 1, title: '섹션 1', lectures: [{ id: 1, title: '', duration: '' }] },
    ]);

    const handleAddSection = () => {
        setSections([
            ...sections,
            { id: sections.length + 1, title: `섹션 ${sections.length + 1}`, lectures: [{ id: 1, title: '', duration: '' }] },
        ]);
    };

    const handleAddLecture = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].lectures.push({
            id: newSections[sectionIndex].lectures.length + 1,
            title: '',
            duration: '',
        });
        setSections(newSections);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API 호출 로직
        console.log({ title, description, category, price, originalPrice, thumbnail, sections });
        router.push('/profile');
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

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                강의 설명 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="강의에 대한 간단한 설명을 작성해주세요..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                required
                            />
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
                                    placeholder="129000"
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
                                    placeholder="258000"
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
                                    />

                                    <div className="space-y-3">
                                        {section.lectures.map((lecture, lectureIndex) => (
                                            <div key={lecture.id} className="flex gap-3">
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
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            강의 생성
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
