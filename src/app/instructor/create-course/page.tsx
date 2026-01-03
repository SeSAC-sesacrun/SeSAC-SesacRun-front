'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lecture {
    id: number;
    lectureId?: number;
    title: string;
    videoUrl: string;
    duration: string;
    order: number;
    isFree: boolean;
}

interface Section {
    id: number;
    sectionId?: number;
    title: string;
    order: number;
    lectures: Lecture[];
}

// Sortable 섹션 컴포넌트
function SortableSection({ section, children }: { section: Section; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: section.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded mt-1"
                    title="드래그하여 순서 변경"
                >
                    <span className="material-symbols-outlined">drag_indicator</span>
                </button>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Sortable 강의 컴포넌트
function SortableLecture({ lecture, children }: { lecture: Lecture; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: lecture.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mt-1"
                    title="드래그하여 순서 변경"
                >
                    <span className="material-symbols-outlined text-sm">drag_indicator</span>
                </button>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}

export default function CreateCoursePage() {
    const router = useRouter();
    const [courseId, setCourseId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState('');
    const [sections, setSections] = useState<Section[]>([
        { id: 1, title: '섹션 1', order: 0, lectures: [{ id: 1, title: '', videoUrl: '', duration: '', order: 0, isFree: false }] },
    ]);
    const [isMounted, setIsMounted] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 클라이언트에서만 드래그 앤 드롭 활성화
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Duration을 초 단위로 변환하는 함수 (예: "12:30" -> 750초)
    const convertDurationToSeconds = (duration: string): number => {
        const parts = duration.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            return minutes * 60 + seconds;
        }
        return 0;
    };

    // Course 저장 함수
    const handleSaveCourse = async () => {
        try {
            const requestBody = {
                title,
                description,
                detailedDescription,
                thumbnail,
                category,
                price: parseInt(price) || 0,
                features,
            };

            console.log('Sending request:', requestBody);

            let response;
            if (courseId) {
                // 강의 수정
                response = await api.put(`/api/courses/${courseId}`, requestBody);
            } else {
                // 강의 생성
                response = await api.post('/api/courses', requestBody);
            }

            const result = response.data;
            console.log('Response:', result);

            if (!courseId && result.data) {
                // 생성된 경우 courseId를 저장
                if (result.data.id) {
                    setCourseId(result.data.id);
                    alert('코스가 생성되었습니다!');
                } else {
                    alert('코스가 저장되었습니다!');
                }
            } else {
                alert('코스가 업데이트되었습니다!');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert(`코스 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    // Section 저장 함수
    const handleSaveSection = async (sectionIndex: number) => {
        if (!courseId) {
            alert('먼저 코스를 저장해주세요!');
            return;
        }

        const section = sections[sectionIndex];

        try {
            const requestBody = section.sectionId
                ? { title: section.title, order: section.order }
                : { title: section.title };

            console.log('Saving section:', requestBody);

            let response;
            if (section.sectionId) {
                // 섹션 수정
                response = await api.put(`/api/courses/${courseId}/sections/${section.sectionId}`, requestBody);
            } else {
                // 섹션 생성
                response = await api.post(`/api/courses/${courseId}/sections`, requestBody);
            }

            const result = response.data;
            console.log('Section response:', result);

            if (!section.sectionId && result.data) {
                // 생성된 경우 sectionId를 저장
                const newSections = [...sections];
                newSections[sectionIndex].sectionId = result.data;
                setSections(newSections);
                alert('섹션이 생성되었습니다!');
            } else {
                alert('섹션이 업데이트되었습니다!');
            }
        } catch (error) {
            console.error('Error saving section:', error);
            alert(`섹션 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    // Lecture 저장 함수
    const handleSaveLecture = async (sectionIndex: number, lectureIndex: number) => {
        const section = sections[sectionIndex];

        if (!section.sectionId) {
            alert('먼저 섹션을 저장해주세요!');
            return;
        }

        const lecture = section.lectures[lectureIndex];

        try {
            const durationInSeconds = convertDurationToSeconds(lecture.duration);

            // 필수 필드 검증
            if (!lecture.title.trim()) {
                alert('강의 제목을 입력해주세요.');
                return;
            }
            if (!lecture.videoUrl.trim()) {
                alert('비디오 URL을 입력해주세요.');
                return;
            }
            if (durationInSeconds < 1) {
                alert('영상 길이를 올바른 형식(예: 12:30)으로 입력해주세요. 최소 1초 이상이어야 합니다.');
                return;
            }

            const requestBody = {
                title: lecture.title,
                order: lecture.order,
                videoUrl: lecture.videoUrl,
                duration: durationInSeconds,
                isFree: lecture.isFree,
            };

            console.log('Saving lecture:', requestBody);

            let response;
            if (lecture.lectureId) {
                // 렉쳐 수정
                response = await api.put(`/api/sections/${section.sectionId}/lectures/${lecture.lectureId}`, requestBody);
            } else {
                // 렉쳐 생성
                response = await api.post(`/api/sections/${section.sectionId}/lectures`, requestBody);
            }

            const result = response.data;
            console.log('Lecture response:', result);

            if (!lecture.lectureId && result.data) {
                // 생성된 경우 lectureId를 저장
                const newSections = [...sections];
                newSections[sectionIndex].lectures[lectureIndex].lectureId = result.data;
                setSections(newSections);
                alert('강의가 생성되었습니다!');
            } else {
                alert('강의가 업데이트되었습니다!');
            }
        } catch (error) {
            console.error('Error saving lecture:', error);
            alert(`강의 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    const handleAddSection = () => {
        setSections([
            ...sections,
            {
                id: sections.length + 1,
                title: `섹션 ${sections.length + 1}`,
                order: sections.length,
                lectures: [{ id: 1, title: '', videoUrl: '', duration: '', order: 0, isFree: false }]
            },
        ]);
    };

    const handleAddLecture = (sectionIndex: number) => {
        const newSections = [...sections];
        const currentLectures = newSections[sectionIndex].lectures;
        newSections[sectionIndex].lectures.push({
            id: currentLectures.length + 1,
            title: '',
            videoUrl: '',
            duration: '',
            order: currentLectures.length,
            isFree: false,
        });
        setSections(newSections);
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    // Section 삭제 함수
    const handleDeleteSection = async (sectionIndex: number) => {
        const section = sections[sectionIndex];

        // 저장된 섹션이면 백엔드에서도 삭제
        if (section.sectionId && courseId) {
            if (!confirm('이 섹션을 삭제하시겠습니까?')) {
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/courses/${courseId}/sections/${section.sectionId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('섹션 삭제에 실패했습니다.');
                }

                alert('섹션이 삭제되었습니다!');
            } catch (error) {
                console.error('Error deleting section:', error);
                alert('섹션 삭제 중 오류가 발생했습니다.');
                return;
            }
        }

        // 상태에서 제거
        const newSections = sections.filter((_, index) => index !== sectionIndex);
        setSections(newSections);
    };

    // Lecture 삭제 함수
    const handleDeleteLecture = async (sectionIndex: number, lectureIndex: number) => {
        const section = sections[sectionIndex];
        const lecture = section.lectures[lectureIndex];

        // 저장된 강의면 백엔드에서도 삭제
        if (lecture.lectureId && section.sectionId) {
            if (!confirm('이 강의를 삭제하시겠습니까?')) {
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/sections/${section.sectionId}/lectures/${lecture.lectureId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('강의 삭제에 실패했습니다.');
                }

                alert('강의가 삭제되었습니다!');
            } catch (error) {
                console.error('Error deleting lecture:', error);
                alert('강의 삭제 중 오류가 발생했습니다.');
                return;
            }
        }

        // 상태에서 제거
        const newSections = [...sections];
        newSections[sectionIndex].lectures = newSections[sectionIndex].lectures.filter(
            (_, index) => index !== lectureIndex
        );
        setSections(newSections);
    };

    // 섹션 드래그 핸들러
    const handleSectionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                // order 값 자동 업데이트
                return newItems.map((item, index) => ({
                    ...item,
                    order: index,
                }));
            });
        }
    };

    // 강의 드래그 핸들러
    const handleLectureDragEnd = (sectionIndex: number) => (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newSections = [...sections];
            const lectures = newSections[sectionIndex].lectures;

            const oldIndex = lectures.findIndex((item) => item.id === active.id);
            const newIndex = lectures.findIndex((item) => item.id === over.id);

            newSections[sectionIndex].lectures = arrayMove(lectures, oldIndex, newIndex).map(
                (lecture, index) => ({
                    ...lecture,
                    order: index,
                })
            );

            setSections(newSections);
        }
    };

    // 강의 제출 전 검증 함수
    const validateCourse = (): { isValid: boolean; message: string } => {
        // 코스 기본 정보 검증
        if (!courseId) {
            return { isValid: false, message: '먼저 코스를 저장해주세요.' };
        }
        if (!title.trim()) {
            return { isValid: false, message: '강의 제목을 입력해주세요.' };
        }
        if (!description.trim()) {
            return { isValid: false, message: '간단 소개를 입력해주세요.' };
        }
        if (!detailedDescription.trim()) {
            return { isValid: false, message: '상세 설명을 입력해주세요.' };
        }
        if (!thumbnail.trim()) {
            return { isValid: false, message: '썸네일 이미지 URL을 입력해주세요.' };
        }
        if (!category) {
            return { isValid: false, message: '카테고리를 선택해주세요.' };
        }
        if (!price || parseInt(price) < 0) {
            return { isValid: false, message: '가격을 입력해주세요.' };
        }

        // 섹션 검증
        if (sections.length === 0) {
            return { isValid: false, message: '최소 1개 이상의 섹션을 추가해주세요.' };
        }

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (!section.sectionId) {
                return { isValid: false, message: `섹션 ${i + 1}을(를) 저장해주세요.` };
            }
            if (!section.title.trim()) {
                return { isValid: false, message: `섹션 ${i + 1}의 제목을 입력해주세요.` };
            }
            if (section.lectures.length === 0) {
                return { isValid: false, message: `섹션 ${i + 1}에 최소 1개 이상의 강의를 추가해주세요.` };
            }

            // 강의 검증
            for (let j = 0; j < section.lectures.length; j++) {
                const lecture = section.lectures[j];

                if (!lecture.lectureId) {
                    return { isValid: false, message: `섹션 ${i + 1}의 강의 ${j + 1}을(를) 저장해주세요.` };
                }
                if (!lecture.title.trim()) {
                    return { isValid: false, message: `섹션 ${i + 1}의 강의 ${j + 1} 제목을 입력해주세요.` };
                }
                if (!lecture.videoUrl.trim()) {
                    return { isValid: false, message: `섹션 ${i + 1}의 강의 ${j + 1} 비디오 URL을 입력해주세요.` };
                }
                const durationInSeconds = convertDurationToSeconds(lecture.duration);
                if (durationInSeconds < 1) {
                    return { isValid: false, message: `섹션 ${i + 1}의 강의 ${j + 1} 영상 길이를 입력해주세요.` };
                }
            }
        }

        return { isValid: true, message: '모든 검증을 통과했습니다!' };
    };

    // 강의 제출 핸들러
    const handleSubmitCourse = () => {
        const validation = validateCourse();

        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        // 모든 검증 통과 시 홈으로 이동
        alert('강의가 성공적으로 제출되었습니다!');
        router.push('/');
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

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">기본 정보</h2>
                                {courseId ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        저장됨
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        저장 필요
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveCourse}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                                {courseId ? '업데이트' : '생성'}
                            </button>
                        </div>

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
                                간단 소개 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="강의에 대한 간단한 소개를 작성해주세요..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        {/* Detailed Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                상세 설명 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={detailedDescription}
                                onChange={(e) => setDetailedDescription(e.target.value)}
                                placeholder="강의에 대한 상세한 설명을 작성해주세요..."
                                rows={6}
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
                            {thumbnail && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">미리보기:</p>
                                    <img
                                        src={thumbnail}
                                        alt="썸네일 미리보기"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                                        onError={(e) => {
                                            e.currentTarget.src = '';
                                            e.currentTarget.alt = '이미지를 불러올 수 없습니다';
                                            e.currentTarget.className = 'w-full max-w-md h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
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

                        {/* Features (Tags) */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                특징 (태그)
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddFeature();
                                        }
                                    }}
                                    placeholder="예: 실습 중심, 평생 수강"
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    추가
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="hover:text-primary/70"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
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
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>섹션 추가</span>
                            </button>
                        </div>

                        {isMounted ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleSectionDragEnd}
                            >
                                <SortableContext
                                    items={sections.map((s) => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-6">
                                        {sections.map((section, sectionIndex) => (
                                            <SortableSection key={section.id} section={section}>
                                                <>
                                                <div className="space-y-3 mb-4">
                                                    {/* 섹션 상태 표시 */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                            섹션 {sectionIndex + 1}
                                                        </span>
                                                        {section.sectionId ? (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                                                저장됨
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-xs">warning</span>
                                                                저장 필요
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => {
                                                const newSections = [...sections];
                                                newSections[sectionIndex].title = e.target.value;
                                                setSections(newSections);
                                            }}
                                            placeholder="섹션 제목"
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
                                        />
                                        <input
                                            type="number"
                                            value={section.order}
                                            onChange={(e) => {
                                                const newSections = [...sections];
                                                newSections[sectionIndex].order = parseInt(e.target.value) || 0;
                                                setSections(newSections);
                                            }}
                                            placeholder="순서"
                                            className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleSaveSection(sectionIndex)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                                        >
                                            {section.sectionId ? '업데이트' : '생성'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSection(sectionIndex)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                                            title="섹션 삭제"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                                </div>

                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleLectureDragEnd(sectionIndex)}
                                            >
                                                <SortableContext
                                                    items={section.lectures.map((l) => l.id)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="space-y-3">
                                                        {section.lectures.map((lecture, lectureIndex) => (
                                                            <SortableLecture key={lecture.id} lecture={lecture}>
                                                                <div className="space-y-2">
                                                                    {/* 강의 상태 표시 */}
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                            강의 {lectureIndex + 1}
                                                                        </span>
                                                                        {lecture.lectureId ? (
                                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                                                <span className="material-symbols-outlined" style={{fontSize: '10px'}}>check_circle</span>
                                                                                저장됨
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                                                <span className="material-symbols-outlined" style={{fontSize: '10px'}}>warning</span>
                                                                                저장 필요
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={lecture.title}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].title = e.target.value;
                                                            setSections(newSections);
                                                        }}
                                                        placeholder="강의 제목"
                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={lecture.order}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].order = parseInt(e.target.value) || 0;
                                                            setSections(newSections);
                                                        }}
                                                        placeholder="순서"
                                                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={lecture.videoUrl}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].videoUrl = e.target.value;
                                                            setSections(newSections);
                                                        }}
                                                        placeholder="비디오 URL"
                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                                                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newSections = [...sections];
                                                            newSections[sectionIndex].lectures[lectureIndex].isFree = !lecture.isFree;
                                                            setSections(newSections);
                                                        }}
                                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                                            lecture.isFree
                                                                ? 'bg-green-100 text-green-700 border-2 border-green-500 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-gray-100 text-gray-600 border-2 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                                                        }`}
                                                        title={lecture.isFree ? '무료 강의 (클릭하여 유료로 변경)' : '유료 강의 (클릭하여 무료로 변경)'}
                                                    >
                                                        {lecture.isFree ? '🎁 무료' : '💰 유료'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveLecture(sectionIndex, lectureIndex)}
                                                        className="ml-auto px-4 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                                                    >
                                                        {lecture.lectureId ? '업데이트' : '생성'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteLecture(sectionIndex, lectureIndex)}
                                                        className="px-4 py-1 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                                        title="강의 삭제"
                                                    >
                                                        삭제
                                                    </button>
                                                                </div>
                                                                    </div>
                                                            </SortableLecture>
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>

                                            <button
                                                type="button"
                                                onClick={() => handleAddLecture(sectionIndex)}
                                                className="mt-3 text-sm text-primary font-medium hover:underline"
                                            >
                                                + 강의 추가
                                            </button>
                                            </>
                                        </SortableSection>
                                    ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="space-y-6">
                                {sections.map((section, sectionIndex) => (
                                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                    섹션 {sectionIndex + 1}
                                                </span>
                                                {section.sectionId ? (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">check_circle</span>
                                                        저장됨
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">warning</span>
                                                        저장 필요
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => {
                                                    const newSections = [...sections];
                                                    newSections[sectionIndex].title = e.target.value;
                                                    setSections(newSections);
                                                }}
                                                placeholder="섹션 제목"
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
                                            />
                                            <input
                                                type="number"
                                                value={section.order}
                                                onChange={(e) => {
                                                    const newSections = [...sections];
                                                    newSections[sectionIndex].order = parseInt(e.target.value) || 0;
                                                    setSections(newSections);
                                                }}
                                                placeholder="순서"
                                                className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection(sectionIndex)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                                            >
                                                {section.sectionId ? '업데이트' : '생성'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSection(sectionIndex)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                                                title="섹션 삭제"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                        </div>
                                        <p className="text-sm text-gray-500 text-center py-4">로딩 중...</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            href="/profile"
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            돌아가기
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmitCourse}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            강의 제출
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
