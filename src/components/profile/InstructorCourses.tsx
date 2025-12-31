import React from 'react';
import Link from 'next/link';

interface InstructorCourse {
    id: string;
    title: string;
    students: number;
    rating: number;
    thumbnail: string;
}

interface InstructorCoursesProps {
    courses: InstructorCourse[];
}

export default function InstructorCourses({ courses }: InstructorCoursesProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">운영 중인 강의</h2>
                <Link
                    href="/instructor/create-course"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span>새 강의 만들기</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800"
                    >
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                            style={{ backgroundImage: `url('${course.thumbnail}')` }}
                        />
                        <div className="flex flex-col gap-3">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {course.title}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">person</span>
                                    {course.students.toLocaleString()}명
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-yellow-500">star</span>
                                    {course.rating}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/instructor/courses/${course.id}`}
                                    className="flex-1 flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90"
                                >
                                    관리
                                </Link>
                                <Link
                                    href={`/courses/${course.id}`}
                                    className="flex items-center justify-center rounded-lg h-9 px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
