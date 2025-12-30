'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from '@/components/course/CourseCard';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  studentCount: number;
  price: number;
}

export default function CoursesPage() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // 실제 검색에 사용될 값
  const [inputValue, setInputValue] = useState(''); // 입력 필드 값
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '프로그래밍', '웹 개발', '데이터 사이언스', '디자인', '마케팅', '비즈니스'];

  // 한글 → 영어 카테고리 매핑
  const categoryMap: Record<string, string> = {
    '전체': 'all',
    '프로그래밍': 'Development',
    '웹 개발': 'Web',
    '데이터 사이언스': 'Data Science',
    '디자인': 'Design',
    '마케팅': 'Marketing',
    '비즈니스': 'Business',
  };

  // 검색 실행 함수
  const handleSearch = () => {
    setSearchQuery(inputValue);
    setSelectedCategory('전체'); // 검색 시 카테고리 초기화
  };

  const fetchCourses = async (category: string = '전체', keyword: string = '') => {
    try {
      setLoading(true);

      let response;

      // 검색어가 있으면 검색 API 호출
      if (keyword.trim()) {
        response = await axios.get(`http://localhost:8080/api/courses/search?keyword=${encodeURIComponent(keyword)}`);
      }
      // 카테고리가 '전체'가 아니면 카테고리 API 호출
      else if (category !== '전체') {
        // 한글 카테고리를 영어로 변환
        const englishCategory = categoryMap[category] || category;
        response = await axios.get(`http://localhost:8080/api/courses/category/${encodeURIComponent(englishCategory)}`);
      }
      // 그 외에는 전체 강의 조회
      else {
        response = await axios.get('http://localhost:8080/api/courses');
      }

      // 백엔드 응답: { success: true, data: { content: [...], ... } }
      const courses = response.data.data.content;

      // 인기 강의: 수강생 수가 많은 순으로 정렬하여 상위 3개
      const sortedByStudents = [...courses].sort((a: Course, b: Course) => b.studentCount - a.studentCount);
      setPopularCourses(sortedByStudents.slice(0, 3));

      // 전체 강의
      setAllCourses(courses);
      setError(null);
    } catch (err: any) {
      console.error('강의 목록을 불러오는데 실패했습니다:', err);
      const errorMessage = err.response?.data?.message || err.message || '강의 목록을 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">강의 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div
          className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200')",
          }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tighter">
              성장의 기회를 발견하세요
            </h1>
            <h2 className="text-white/80 text-base md:text-lg font-normal max-w-2xl mx-auto">
              최고의 전문가들이 만든 다양한 강의를 통해 새로운 기술을 배우고 커리어를 발전시켜 보세요.
            </h2>
          </div>
          <div className="w-full max-w-lg mt-4">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-14 shadow-lg">
              <div className="text-gray-500 flex bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-0 border-none bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal"
                placeholder="배우고 싶은 지식을 검색해보세요."
              />
              <button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white px-6 rounded-r-lg transition-colors font-medium"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <section className="py-12 md:py-20">
          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight mb-6">
            지금 가장 인기 있는 강의 🔥
          </h2>
          {popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10">
              인기 강의가 없습니다.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
            카테고리별로 찾아보기
          </h2>
          <div className="flex gap-3 p-3 flex-wrap mt-4 -ml-3">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery(''); // 카테고리 선택 시 검색어 초기화
                  setInputValue(''); // 입력 필드도 초기화
                }}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-black dark:text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <p className={`text-sm ${selectedCategory === category ? 'font-bold' : 'font-medium'}`}>
                  {category}
                </p>
              </div>
            ))}
          </div>
          {allCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-6">
              {allCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10 mt-6">
              강의가 없습니다.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
