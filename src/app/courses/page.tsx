import React from 'react';
import CourseCard from '@/components/course/CourseCard';

export default function CoursesPage() {
  const popularCourses = [
    {
      id: '1',
      title: '비즈니스 전략 마스터클래스',
      instructor: '김민준 강사',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      rating: 4.8,
      reviewCount: 1204,
      price: 120000,
    },
    {
      id: '2',
      title: '데이터 시각화 완벽 가이드',
      instructor: '이서연 강사',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      rating: 4.9,
      reviewCount: 2531,
      price: 150000,
    },
    {
      id: '3',
      title: '실전! React & TypeScript',
      instructor: '박서준 강사',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      rating: 4.7,
      reviewCount: 3012,
      price: 180000,
    },
  ];

  const allCourses = [
    {
      id: '4',
      title: '웹 개발 입문',
      instructor: '최지우 강사',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      rating: 4.6,
      reviewCount: 5890,
      price: 99000,
    },
    {
      id: '5',
      title: 'UI/UX 디자인 기초',
      instructor: '윤아영 강사',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      rating: 4.9,
      reviewCount: 4123,
      price: 110000,
    },
    {
      id: '6',
      title: '디지털 마케팅 전략',
      instructor: '강태현 강사',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      rating: 4.7,
      reviewCount: 2245,
      price: 135000,
    },
    {
      id: '7',
      title: '성공하는 비즈니스 협상',
      instructor: '정하윤 강사',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      rating: 4.8,
      reviewCount: 897,
      price: 160000,
    },
  ];

  const categories = ['전체', '프로그래밍', '데이터 사이언스', '디자인', '마케팅', '비즈니스'];

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
            <label className="flex flex-col min-w-40 h-14 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-lg">
                <div className="text-gray-500 flex bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal"
                  placeholder="배우고 싶은 지식을 검색해보세요."
                />
              </div>
            </label>
          </div>
        </div>

        <section className="py-12 md:py-20">
          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight mb-6">
            지금 가장 인기 있는 강의 🔥
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold tracking-tight">
            카테고리별로 찾아보기
          </h2>
          <div className="flex gap-3 p-3 flex-wrap mt-4 -ml-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 cursor-pointer ${
                  index === 0
                    ? 'bg-primary text-black dark:text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <p className={`text-sm ${index === 0 ? 'font-bold' : 'font-medium'}`}>
                  {category}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-6">
            {allCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
