# API 엔드포인트 명세서 - 강의

> 프론트엔드 코드 기반 API 설계

---

## 1. 강의 조회

### 1.1 [GET] /api/courses
**설명**: 강의 목록 조회  
**연관 화면**: `/`, `/courses`  
**인증 필요**: ❌

**Query Parameters**:
- `category`: 카테고리 필터 (선택)
- `page`: 페이지 번호 (기본값: 1)
- `size`: 페이지 크기 (기본값: 20)
- `sort`: 정렬 (예: `createdAt,desc`)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "비즈니스 전략 마스터클래스",
        "instructor": "김민준 강사",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "rating": 4.8,
        "reviewCount": 1204,
        "price": 120000,
        "category": "비즈니스"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### 1.2 [GET] /api/courses/popular
**설명**: 인기 강의 목록 조회  
**연관 화면**: `/` (인기 강의 섹션)  
**인증 필요**: ❌

**Query Parameters**:
- `limit`: 조회 개수 (기본값: 3)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "비즈니스 전략 마스터클래스",
      "instructor": "김민준 강사",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "rating": 4.8,
      "reviewCount": 1204,
      "price": 120000
    }
  ]
}
```

---

### 1.3 [GET] /api/courses/:id
**설명**: 강의 상세 조회  
**연관 화면**: `/courses/:id`  
**인증 필요**: ❌

**Path Parameters**:
- `id`: 강의 ID

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
    "description": "HTML, CSS, Javascript부터 React, Node.js까지...",
    "detailedDescription": "이 강의는 웹 개발의 기초부터...",
    "instructor": {
      "id": 1,
      "name": "김철수",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "10년차 풀스택 개발자...",
      "students": 52341,
      "courses": 12,
      "rating": 4.9
    },
    "thumbnail": "https://example.com/thumbnail.jpg",
    "category": "프로그래밍",
    "price": 129000,
    "originalPrice": 258000,
    "discount": 50,
    "rating": 4.7,
    "reviewCount": 1234,
    "studentCount": 12345,
    "lastUpdated": "2024-01-15",
    "language": "한국어",
    "level": "초급",
    "duration": "24.5시간",
    "features": [
      "24.5시간의 온디맨드 비디오",
      "12개의 다운로드 가능한 리소스"
    ],
    "isPurchased": false
  }
}
```

**상태 코드**:
- `200`: 성공
- `404`: 강의 없음

---

### 1.4 [GET] /api/courses/:id/curriculum
**설명**: 강의 커리큘럼 조회  
**연관 화면**: `/courses/:id`, `/watch/:id`  
**인증 필요**: ❌ (구매 여부에 따라 잠금 처리는 프론트에서)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "sectionId": 1,
      "title": "섹션 1: 시작하기",
      "lectures": [
        {
          "lectureId": 1,
          "title": "1-1. 강의 소개",
          "duration": "03:15",
          "isFree": true,
          "youtubeUrl": "https://youtube.com/watch?v=..."
        },
        {
          "lectureId": 2,
          "title": "1-2. 개발 환경 설정",
          "duration": "12:30",
          "isFree": false,
          "youtubeUrl": null
        }
      ]
    }
  ]
}
```

---

### 1.5 [GET] /api/courses/:id/reviews
**설명**: 강의 수강평 조회  
**연관 화면**: `/courses/:id` (수강평 탭)  
**인증 필요**: ❌

**Query Parameters**:
- `page`: 페이지 번호
- `size`: 페이지 크기

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "reviewId": 1,
        "user": {
          "name": "이영희",
          "avatar": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "comment": "비전공자도 따라가기 쉽게 설명해주셔서 정말 좋았습니다!",
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### 1.6 [GET] /api/courses/:id/qna
**설명**: 강의 Q&A 조회  
**연관 화면**: `/courses/:id` (Q&A 탭), `/watch/:id` (Q&A 탭)  
**인증 필요**: ❌

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "questionId": 1,
      "user": {
        "name": "김학생",
        "avatar": "https://example.com/avatar.jpg"
      },
      "question": "React 버전은 어떤 것을 사용하나요?",
      "answer": {
        "content": "React 18 최신 버전을 사용합니다!",
        "answeredAt": "2024-01-14T00:00:00Z"
      },
      "createdAt": "2024-01-13T00:00:00Z"
    }
  ]
}
```

---

## 2. 강의 생성/수정 (강사 전용)

### 2.1 [POST] /api/courses
**설명**: 강의 생성  
**연관 화면**: `/instructor/create-course`  
**인증 필요**: ✅ (role: INSTRUCTOR)

**Request Body**:
```json
{
  "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
  "description": "HTML, CSS, Javascript부터...",
  "category": "프로그래밍",
  "price": 129000,
  "originalPrice": 258000,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "sections": [
    {
      "title": "섹션 1: 시작하기",
      "lectures": [
        {
          "title": "1-1. 강의 소개",
          "youtubeUrl": "https://youtube.com/watch?v=...",
          "duration": "03:15"
        }
      ]
    }
  ]
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

**상태 코드**:
- `201`: 생성 성공
- `400`: 잘못된 요청
- `403`: 권한 없음

---

### 2.2 [PUT] /api/courses/:id
**설명**: 강의 수정  
**인증 필요**: ✅ (본인 강의만)

**Request Body**: 2.1과 동일

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 2.3 [DELETE] /api/courses/:id
**설명**: 강의 삭제 (소프트 삭제)  
**인증 필요**: ✅ (본인 강의만)

**Response (204)**: No Content

---

## 3. 강의 구매

### 3.1 [POST] /api/courses/:id/purchase
**설명**: 강의 구매  
**연관 화면**: `/courses/:id`, `/cart`  
**인증 필요**: ✅

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "purchaseId": 1,
    "courseId": 1,
    "price": 129000,
    "purchasedAt": "2024-01-15T00:00:00Z"
  }
}
```

**상태 코드**:
- `201`: 구매 성공
- `400`: 이미 구매한 강의
- `401`: 인증 필요

---

## 4. 수강평

### 4.1 [POST] /api/courses/:id/reviews
**설명**: 수강평 작성  
**연관 화면**: `/watch/:id`  
**인증 필요**: ✅ (구매한 강의만)

**Request Body**:
```json
{
  "rating": 5,
  "comment": "정말 유익한 강의였습니다!"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "reviewId": 1,
    "rating": 5,
    "comment": "정말 유익한 강의였습니다!",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 4.2 [PUT] /api/reviews/:id
**설명**: 수강평 수정  
**인증 필요**: ✅ (본인 리뷰만)

**Request Body**: 4.1과 동일

---

### 4.3 [DELETE] /api/reviews/:id
**설명**: 수강평 삭제  
**인증 필요**: ✅ (본인 리뷰만)

**Response (204)**: No Content

---

## 5. Q&A

### 5.1 [POST] /api/courses/:id/qna
**설명**: 질문 작성  
**연관 화면**: `/watch/:id` (Q&A 탭)  
**인증 필요**: ✅

**Request Body**:
```json
{
  "question": "React 버전은 어떤 것을 사용하나요?"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "questionId": 1,
    "question": "React 버전은 어떤 것을 사용하나요?",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 5.2 [POST] /api/qna/:id/answer
**설명**: 답변 작성 (강사만)  
**인증 필요**: ✅ (강의 강사만)

**Request Body**:
```json
{
  "answer": "React 18 최신 버전을 사용합니다!"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "questionId": 1,
    "answer": "React 18 최신 버전을 사용합니다!",
    "answeredAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## 6. 시청 기록

### 6.1 [POST] /api/lectures/:id/progress
**설명**: 시청 진행률 업데이트  
**연관 화면**: `/watch/:id`  
**인증 필요**: ✅

**Request Body**:
```json
{
  "progress": 75
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "lectureId": 1,
    "progress": 75,
    "lastWatchedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 6.2 [GET] /api/courses/:id/progress
**설명**: 강의 전체 진행률 조회  
**연관 화면**: `/my-courses`, `/profile`  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "courseId": 1,
    "overallProgress": 75,
    "lastWatchedLectureId": 5,
    "lastWatchedAt": "2024-01-15T10:30:00Z"
  }
}
```
