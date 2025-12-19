# CourseHub API 명세서

## 목차
- [1. 개요](#1-개요)
- [2. 인증 및 권한](#2-인증-및-권한)
- [3. 사용자 관리](#3-사용자-관리)
- [4. 강의 관리](#4-강의-관리)
- [5. 커뮤니티 관리](#5-커뮤니티-관리)
- [6. 채팅 관리](#6-채팅-관리)
- [7. 수강 관리](#7-수강-관리)
- [8. 리뷰 및 평가](#8-리뷰-및-평가)

---

## 1. 개요

### 1.1 Base URL
```
개발: http://localhost:8080/api/v1
운영: https://api.coursehub.com/api/v1
```

### 1.2 공통 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 1.3 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 2. 인증 및 권한

### 2.1 회원가입
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "role": "student" // "student" | "instructor"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "student",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 2.2 로그인
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "student",
    "avatar": "https://example.com/avatar.jpg",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 2.3 소셜 로그인 (Google)
**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "idToken": "google_id_token"
}
```

### 2.4 소셜 로그인 (Kakao)
**Endpoint:** `POST /auth/kakao`

**Request Body:**
```json
{
  "accessToken": "kakao_access_token"
}
```

### 2.5 토큰 갱신
**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### 2.6 로그아웃
**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 3. 사용자 관리

### 3.1 내 프로필 조회
**Endpoint:** `GET /users/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "avatar": "https://example.com/avatar.jpg",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.2 프로필 수정
**Endpoint:** `PATCH /users/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "홍길동",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

---

## 4. 강의 관리

### 4.1 강의 목록 조회
**Endpoint:** `GET /courses`

**Query Parameters:**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 12)
- `category`: 카테고리 필터
- `search`: 검색어
- `sort`: 정렬 기준 (popular, recent, rating)

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "courseId": "uuid",
        "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
        "description": "HTML, CSS, Javascript, React, Node.js 등을 한번에 배우고...",
        "instructor": {
          "instructorId": "uuid",
          "name": "김철수",
          "avatar": "https://example.com/avatar.jpg"
        },
        "thumbnail": "https://example.com/thumbnail.jpg",
        "category": "프로그래밍",
        "price": 129000,
        "originalPrice": 258000,
        "rating": 4.7,
        "reviewCount": 1234,
        "studentCount": 12345,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 120,
      "itemsPerPage": 12
    }
  }
}
```

### 4.2 강의 상세 조회
**Endpoint:** `GET /courses/:courseId`

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
    "description": "HTML, CSS, Javascript, React, Node.js 등을 한번에 배우고...",
    "instructor": {
      "instructorId": "uuid",
      "name": "김철수",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "10년차 풀스택 개발자",
      "role": "instructor"
    },
    "thumbnail": "https://example.com/thumbnail.jpg",
    "category": "프로그래밍",
    "price": 129000,
    "originalPrice": 258000,
    "discount": 50,
    "rating": 4.7,
    "reviewCount": 1234,
    "studentCount": 12345,
    "features": [
      "24.5시간의 동영상 강의",
      "12개의 아티클",
      "다운로드 가능한 리소스",
      "수료증 발급"
    ],
    "curriculum": [
      {
        "sectionId": "uuid",
        "title": "섹션 1: 시작하기",
        "order": 1,
        "lectures": [
          {
            "lectureId": "uuid",
            "title": "1-1. 강의 소개",
            "duration": "03:15",
            "order": 1,
            "videoUrl": "https://example.com/video.mp4",
            "isFree": true
          }
        ]
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4.3 강의 생성 (강사 전용)
**Endpoint:** `POST /courses`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
  "description": "HTML, CSS, Javascript, React, Node.js 등을 한번에 배우고...",
  "category": "프로그래밍",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "price": 129000,
  "originalPrice": 258000,
  "features": [
    "24.5시간의 동영상 강의",
    "12개의 아티클"
  ],
  "curriculum": [
    {
      "title": "섹션 1: 시작하기",
      "order": 1,
      "lectures": [
        {
          "title": "1-1. 강의 소개",
          "duration": "03:15",
          "order": 1,
          "videoUrl": "https://example.com/video.mp4",
          "isFree": true
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
    "status": "draft"
  }
}
```

### 4.4 강의 수정 (강사 전용)
**Endpoint:** `PATCH /courses/:courseId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:** (4.3과 동일, 부분 수정 가능)

### 4.5 강의 삭제 (강사 전용)
**Endpoint:** `DELETE /courses/:courseId`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 4.6 강사의 강의 목록 조회
**Endpoint:** `GET /instructors/:instructorId/courses`

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수

---

## 5. 커뮤니티 관리

### 5.1 커뮤니티 게시글 목록 조회
**Endpoint:** `GET /community/posts`

**Query Parameters:**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 20)
- `category`: 카테고리 (study, project)
- `status`: 모집 상태 (recruiting, completed)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "postId": "uuid",
        "category": "study",
        "status": "recruiting",
        "title": "프론트엔드 실전 프로젝트 스터디원 모집",
        "description": "React와 TypeScript를 사용한 실전 프론트엔드 프로젝트를...",
        "author": {
          "userId": "uuid",
          "name": "강민준",
          "avatar": "https://example.com/avatar.jpg"
        },
        "currentMembers": 8,
        "totalMembers": 10,
        "views": 1234,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

### 5.2 커뮤니티 게시글 상세 조회
**Endpoint:** `GET /community/posts/:postId`

**Response:**
```json
{
  "success": true,
  "data": {
    "postId": "uuid",
    "category": "study",
    "status": "recruiting",
    "title": "프론트엔드 실전 프로젝트 스터디원 모집",
    "content": "안녕하세요! React와 TypeScript를 사용한...",
    "author": {
      "userId": "uuid",
      "name": "강민준",
      "avatar": "https://example.com/avatar.jpg"
    },
    "currentMembers": 8,
    "totalMembers": 10,
    "views": 1234,
    "likes": 128,
    "tags": ["#프론트엔드", "#프로젝트", "#스터디모집"],
    "schedule": {
      "startDate": "2023-11-05",
      "meetingTime": "매주 일요일 오후 2시 - 5시",
      "location": "온라인 (Discord)"
    },
    "participants": [
      {
        "userId": "uuid",
        "name": "김민지",
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.3 커뮤니티 게시글 작성
**Endpoint:** `POST /community/posts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "category": "study",
  "status": "recruiting",
  "title": "프론트엔드 실전 프로젝트 스터디원 모집",
  "content": "안녕하세요! React와 TypeScript를 사용한...",
  "totalMembers": 10,
  "tags": ["#프론트엔드", "#프로젝트", "#스터디모집"],
  "schedule": {
    "startDate": "2023-11-05",
    "meetingTime": "매주 일요일 오후 2시 - 5시",
    "location": "온라인 (Discord)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "postId": "uuid",
    "title": "프론트엔드 실전 프로젝트 스터디원 모집",
    "status": "recruiting"
  }
}
```

### 5.4 커뮤니티 게시글 수정
**Endpoint:** `PATCH /community/posts/:postId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:** (5.3과 동일, 부분 수정 가능)

### 5.5 커뮤니티 게시글 삭제
**Endpoint:** `DELETE /community/posts/:postId`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 5.6 내가 작성한 게시글 목록
**Endpoint:** `GET /community/posts/my`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수

### 5.7 게시글 좋아요
**Endpoint:** `POST /community/posts/:postId/like`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 5.8 게시글 좋아요 취소
**Endpoint:** `DELETE /community/posts/:postId/like`

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 6. 채팅 관리

### 6.1 채팅방 목록 조회
**Endpoint:** `GET /chats`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "chatId": "uuid",
        "type": "community", // "community" | "support"
        "relatedId": "post_uuid",
        "participant": {
          "userId": "uuid",
          "name": "총괄 매니저",
          "avatar": "https://example.com/avatar.jpg",
          "isOnline": true
        },
        "lastMessage": {
          "content": "네, 확인 후 바로 답변...",
          "sentAt": "2024-01-01T14:45:00Z"
        },
        "unreadCount": 1,
        "updatedAt": "2024-01-01T14:45:00Z"
      }
    ]
  }
}
```

### 6.2 채팅방 상세 조회 (메시지 목록)
**Endpoint:** `GET /chats/:chatId/messages`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 메시지 수 (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "chatId": "uuid",
    "participant": {
      "userId": "uuid",
      "name": "총괄 매니저",
      "avatar": "https://example.com/avatar.jpg",
      "isOnline": true
    },
    "messages": [
      {
        "messageId": "uuid",
        "senderId": "uuid",
        "content": "안녕하세요, 김민준님. 문의주신 내용 확인했습니다.",
        "sentAt": "2024-01-01T14:42:00Z",
        "isRead": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 150
    }
  }
}
```

### 6.3 메시지 전송
**Endpoint:** `POST /chats/:chatId/messages`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "content": "안녕하세요. React 심화 과정 3강의 소스코드 관련해서 질문이 있습니다."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "chatId": "uuid",
    "senderId": "uuid",
    "content": "안녕하세요. React 심화 과정 3강의...",
    "sentAt": "2024-01-01T14:43:00Z"
  }
}
```

### 6.4 채팅방 생성 (커뮤니티 게시글 관련)
**Endpoint:** `POST /chats`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "type": "community",
  "relatedId": "post_uuid",
  "participantId": "user_uuid"
}
```

### 6.5 참여 신청 (참여자)
**Endpoint:** `POST /community/posts/:postId/apply`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "uuid",
    "status": "pending"
  }
}
```

### 6.6 참여 승인 (모집자)
**Endpoint:** `POST /community/applications/:applicationId/approve`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 6.7 참여 거절 (모집자)
**Endpoint:** `POST /community/applications/:applicationId/reject`

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 7. 수강 관리

### 7.1 내 수강 강의 목록
**Endpoint:** `GET /enrollments/my`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status`: 수강 상태 (in_progress, completed)

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "enrollmentId": "uuid",
        "course": {
          "courseId": "uuid",
          "title": "초보자를 위한 UI/UX 디자인 시작하기",
          "thumbnail": "https://example.com/thumbnail.jpg",
          "instructor": {
            "name": "김디자인"
          }
        },
        "progress": 75,
        "lastWatchedLecture": {
          "lectureId": "uuid",
          "title": "3-2. 색상 이론"
        },
        "enrolledAt": "2024-01-01T00:00:00Z",
        "completedAt": null
      }
    ]
  }
}
```

### 7.2 강의 수강 신청
**Endpoint:** `POST /enrollments`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "courseId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollmentId": "uuid",
    "courseId": "uuid",
    "progress": 0,
    "enrolledAt": "2024-01-01T00:00:00Z"
  }
}
```

### 7.3 강의 진행률 업데이트
**Endpoint:** `PATCH /enrollments/:enrollmentId/progress`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "lectureId": "uuid",
  "watchedDuration": 180, // seconds
  "isCompleted": true
}
```

### 7.4 강의 시청 정보 조회
**Endpoint:** `GET /enrollments/:enrollmentId/watch/:lectureId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lecture": {
      "lectureId": "uuid",
      "title": "1. 디자인 입문하기",
      "videoUrl": "https://example.com/video.mp4",
      "duration": 730, // seconds
      "resources": [
        {
          "title": "강의 자료.pdf",
          "url": "https://example.com/resource.pdf"
        }
      ]
    },
    "watchProgress": {
      "watchedDuration": 180,
      "isCompleted": false,
      "lastWatchedAt": "2024-01-01T14:30:00Z"
    },
    "nextLecture": {
      "lectureId": "uuid",
      "title": "2. 디자인 툴 소개"
    },
    "previousLecture": null
  }
}
```

---

## 8. 리뷰 및 평가

### 8.1 강의 리뷰 목록 조회
**Endpoint:** `GET /courses/:courseId/reviews`

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `sort`: 정렬 (recent, rating_high, rating_low)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "reviewId": "uuid",
        "user": {
          "userId": "uuid",
          "name": "이영희",
          "avatar": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "comment": "비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다!",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.7,
      "totalReviews": 1234,
      "ratingDistribution": {
        "5": 75,
        "4": 15,
        "3": 5,
        "2": 3,
        "1": 2
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 1234
    }
  }
}
```

### 8.2 리뷰 작성
**Endpoint:** `POST /courses/:courseId/reviews`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviewId": "uuid",
    "rating": 5,
    "comment": "비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다!",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 8.3 리뷰 수정
**Endpoint:** `PATCH /reviews/:reviewId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "수정된 리뷰 내용"
}
```

### 8.4 리뷰 삭제
**Endpoint:** `DELETE /reviews/:reviewId`

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 9. Q&A 관리

### 9.1 강의 Q&A 목록 조회
**Endpoint:** `GET /courses/:courseId/qna`

**Query Parameters:**
- `lectureId`: 특정 강의 필터링 (optional)
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "questionId": "uuid",
        "user": {
          "userId": "uuid",
          "name": "김학생",
          "avatar": "https://example.com/avatar.jpg"
        },
        "lecture": {
          "lectureId": "uuid",
          "title": "1. 디자인 입문하기"
        },
        "question": "디자인 툴은 어떤 것을 사용하나요?",
        "answer": {
          "answerId": "uuid",
          "content": "Figma를 주로 사용합니다.",
          "answeredBy": {
            "userId": "uuid",
            "name": "김철수",
            "role": "instructor"
          },
          "answeredAt": "2024-01-01T15:00:00Z"
        },
        "createdAt": "2024-01-01T14:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

### 9.2 질문 작성
**Endpoint:** `POST /courses/:courseId/qna`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "lectureId": "uuid",
  "question": "디자인 툴은 어떤 것을 사용하나요?"
}
```

### 9.3 답변 작성 (강사 전용)
**Endpoint:** `POST /qna/:questionId/answer`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "content": "Figma를 주로 사용합니다."
}
```

---

## 10. 알림 관리

### 10.1 알림 목록 조회
**Endpoint:** `GET /notifications`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `isRead`: 읽음 여부 필터 (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notificationId": "uuid",
        "type": "new_message", // "new_message", "application_approved", "new_review", etc.
        "title": "새로운 메시지가 도착했습니다",
        "content": "총괄 매니저님이 메시지를 보냈습니다.",
        "relatedId": "chat_uuid",
        "isRead": false,
        "createdAt": "2024-01-01T14:45:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 50
    }
  }
}
```

### 10.2 알림 읽음 처리
**Endpoint:** `PATCH /notifications/:notificationId/read`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 10.3 모든 알림 읽음 처리
**Endpoint:** `PATCH /notifications/read-all`

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 11. 검색

### 11.1 통합 검색
**Endpoint:** `GET /search`

**Query Parameters:**
- `q`: 검색어 (required)
- `type`: 검색 타입 (courses, community, all)
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "courseId": "uuid",
        "title": "React 완벽 가이드",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "instructor": "김철수",
        "rating": 4.8
      }
    ],
    "communityPosts": [
      {
        "postId": "uuid",
        "title": "React 스터디원 모집",
        "category": "study",
        "status": "recruiting"
      }
    ],
    "totalResults": {
      "courses": 15,
      "communityPosts": 8
    }
  }
}
```

---

## 부록: 에러 코드

| 코드 | 설명 |
|------|------|
| AUTH_001 | 인증 토큰이 없습니다 |
| AUTH_002 | 유효하지 않은 토큰입니다 |
| AUTH_003 | 토큰이 만료되었습니다 |
| AUTH_004 | 권한이 없습니다 |
| USER_001 | 사용자를 찾을 수 없습니다 |
| USER_002 | 이미 존재하는 이메일입니다 |
| COURSE_001 | 강의를 찾을 수 없습니다 |
| COURSE_002 | 이미 수강 중인 강의입니다 |
| COMMUNITY_001 | 게시글을 찾을 수 없습니다 |
| COMMUNITY_002 | 모집이 마감되었습니다 |
| CHAT_001 | 채팅방을 찾을 수 없습니다 |
| REVIEW_001 | 수강하지 않은 강의는 리뷰를 작성할 수 없습니다 |
| VALIDATION_001 | 필수 필드가 누락되었습니다 |
| VALIDATION_002 | 유효하지 않은 형식입니다 |
| SERVER_001 | 서버 내부 오류가 발생했습니다 |
