"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  studentCount: number;
  price: number;
}

export default function PopularCoursesCarousel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coursesPerView, setCoursesPerView] = useState(4);
  const [loading, setLoading] = useState(true);

  /* =======================
     데이터 로드
  ======================= */
  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/courses/popular?size=12"
        );
        setCourses(res.data.data.content);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCourses();
  }, []);

  /* =======================
     반응형
  ======================= */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 640) setCoursesPerView(1);
      else if (window.innerWidth < 1024) setCoursesPerView(2);
      else if (window.innerWidth < 1280) setCoursesPerView(3);
      else setCoursesPerView(4);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const maxIndex = Math.max(0, courses.length - coursesPerView);

  const prev = () => setCurrentIndex((v) => Math.max(0, v - 1));
  const next = () => setCurrentIndex((v) => Math.min(maxIndex, v + 1));

  if (loading || courses.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* ===== 헤더 ===== */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            🔥 지금 가장 인기 있는 강의
          </h2>
          <p className="text-gray-600 mt-1">
            수강생이 가장 많이 선택한 베스트 강의
          </p>
        </div>

        {/* ===== 캐러셀 ===== */}
        <div className="relative">
          {/* 왼쪽 버튼 */}
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="
                absolute left-[-24px] top-1/2 -translate-y-1/2 z-10
                w-16 h-16 rounded-full
                bg-white hover:bg-gray-100
                shadow-lg
                flex items-center justify-center
                transition
              "
              aria-label="이전"
            >
              <span className="text-4xl text-gray-800">{"<"}</span>
            </button>
          )}

          {/* 트랙 */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / coursesPerView)
                }%)`,
              }}
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 group"
                  style={{
                    width: `calc(${100 / coursesPerView}% - 18px)`,
                  }}
                >
                  <div className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <CourseCard {...course} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 버튼 */}
          {currentIndex < maxIndex && (
            <button
              onClick={next}
              className="
                absolute right-[-24px] top-1/2 -translate-y-1/2 z-10
                w-16 h-16 rounded-full
                bg-white hover:bg-gray-100
                shadow-lg
                flex items-center justify-center
                transition
              "
              aria-label="다음"
            >
              <span className="text-4xl text-gray-800">{">"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
