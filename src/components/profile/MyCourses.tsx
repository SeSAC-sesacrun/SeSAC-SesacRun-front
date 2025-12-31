import React from 'react';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    progress: number;
    thumbnail: string;
}

interface MyCoursesProps {
    courses: Course[];
}

export default function MyCourses({ courses }: MyCoursesProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">내 강의</h2>
                <Link
                    href="/courses"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    강의 둘러보기
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        href={`/watch/${course.id}`}
                        className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                        <div className="relative">
                            <div
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                style={{ backgroundImage: `url('${course.thumbnail}')` }}
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-center size-16 bg-primary rounded-full">
                                    <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        play_arrow
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {course.title}
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span>진행률</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div
                                        className="bg-primary h-1.5 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
