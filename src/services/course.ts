import { api } from '@/lib/api';
import { Course, CourseDetail, CreateCourseData } from '@/types';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const courseService = {
  async getAllCourses(page = 0, size = 12): Promise<PageResponse<Course>> {
    return api.get<PageResponse<Course>>(`/courses?page=${page}&size=${size}`);
  },

  async getCourseDetail(courseId: string): Promise<CourseDetail> {
    return api.get<CourseDetail>(`/courses/${courseId}`);
  },

  async getCoursesByCategory(category: string, page = 0, size = 12): Promise<PageResponse<Course>> {
    return api.get<PageResponse<Course>>(`/courses/category/${category}?page=${page}&size=${size}`);
  },

  async searchCourses(keyword: string, page = 0, size = 12): Promise<PageResponse<Course>> {
    return api.get<PageResponse<Course>>(`/courses/search?keyword=${keyword}&page=${page}&size=${size}`);
  },

  async getPopularCourses(page = 0, size = 12): Promise<PageResponse<Course>> {
    return api.get<PageResponse<Course>>(`/courses/popular?page=${page}&size=${size}`);
  },

  async createCourse(data: CreateCourseData): Promise<Course> {
    return api.post<Course>('/courses', data);
  },

  async getMyCourses(): Promise<Course[]> {
    return api.get<Course[]>('/courses/my');
  },

  async deleteCourse(courseId: string): Promise<void> {
    return api.delete<void>(`/courses/${courseId}`);
  },
};
