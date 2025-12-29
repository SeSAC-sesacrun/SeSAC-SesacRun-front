# API 엔드포인트 명세서 - 인증 & 사용자

> 프론트엔드 코드 기반 API 설계

---

## 1. 인증 (Auth)

### 1.1 [POST] /api/auth/signup
**설명**: 회원가입  
**연관 화면**: `/signup`  
**인증 필요**: ❌

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "role": "USER"
    }
  }
}
```

**상태 코드**:
- `201`: 회원가입 성공
- `400`: 잘못된 요청 (이메일 형식 오류 등)
- `409`: 이미 존재하는 이메일

---

### 1.2 [POST] /api/auth/login
**설명**: 로그인  
**연관 화면**: `/login`  
**인증 필요**: ❌

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "role": "USER",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

**상태 코드**:
- `200`: 로그인 성공
- `401`: 이메일 또는 비밀번호 오류

---

## 2. 사용자 (User)

### 2.1 [GET] /api/users/me
**설명**: 현재 로그인한 사용자 정보 조회  
**연관 화면**: `/profile`, `/my-courses`  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "avatar": "https://example.com/avatar.jpg",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2.2 [GET] /api/users/me/courses
**설명**: 내가 구매한 강의 목록 조회  
**연관 화면**: `/my-courses`, `/profile` (내 강의 탭)  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "초보자를 위한 UI/UX 디자인 시작하기",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "progress": 75,
      "purchasedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

---

### 2.3 [GET] /api/users/me/purchases
**설명**: 구매 내역 조회  
**연관 화면**: `/profile` (구매 내역 탭)  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "courseTitle": "React 완벽 가이드",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "price": 129000,
      "purchasedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

---

### 2.4 [GET] /api/users/me/posts
**설명**: 내가 작성한 게시글 조회  
**연관 화면**: `/profile` (게시글 탭)  
**인증 필요**: ✅

**Query Parameters**:
- `category`: `qna` | `study` | `project` (선택)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category": "study",
      "status": "recruiting",
      "title": "프론트엔드 실전 프로젝트 스터디원 모집",
      "currentMembers": 8,
      "totalMembers": 10,
      "views": 1234,
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### 2.5 [GET] /api/users/me/meetings
**설명**: 내가 참여한 모임 조회  
**연관 화면**: `/profile` (모임 탭)  
**인증 필요**: ✅

**Query Parameters**:
- `role`: `organizer` | `participant` (선택)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "postId": 1,
      "title": "프론트엔드 실전 프로젝트 스터디원 모집",
      "status": "recruiting",
      "role": "organizer",
      "joinedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### 2.6 [GET] /api/users/me/qna
**설명**: 내가 작성한 Q&A 조회  
**연관 화면**: `/profile` (게시글 > Q&A 탭)  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "courseTitle": "React 완벽 가이드",
      "question": "컴포넌트 렌더링 최적화 방법이 궁금합니다",
      "answered": true,
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

## 3. 강사 전용 API

### 3.1 [GET] /api/instructors/me/courses
**설명**: 강사가 운영 중인 강의 목록  
**연관 화면**: `/profile` (운영 중인 강의 탭)  
**인증 필요**: ✅ (role: INSTRUCTOR)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "React 완벽 가이드",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "students": 1234,
      "rating": 4.8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**상태 코드**:
- `200`: 성공
- `403`: 권한 없음 (강사가 아님)
