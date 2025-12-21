export interface User {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface Course {
  courseId: string;
  instructorName: string;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  lectureId: string;
  title: string;
  duration: number;
  order: number;
  videoUrl: string;
  isFree: boolean;
}

export interface Section {
  sectionId: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

export interface CourseDetail extends Course {
  instructor: {
    userId: string;
    name: string;
    avatar?: string;
  };
  features?: string;
  sections: Section[];
}

export interface Purchase {
  purchaseId: string;
  userId: string;
  course: Course;
  status: string;
  purchasedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  features?: string;
  sections: {
    title: string;
    order: number;
    lectures: {
      title: string;
      videoUrl: string;
      duration: number;
      order: number;
      isFree?: boolean;
    }[];
  }[];
}
