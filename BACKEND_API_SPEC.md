# 백엔드 API 명세서

> **작성 기준**: 프론트엔드 코드 분석 결과 기반  
> **목적**: 백엔드 개발자가 이 문서만으로 Entity 설계 + API 구현 가능

---

## 1. 프로젝트 개요

### 1.1 서비스 목적
온라인 강의 플랫폼으로, 강의 수강, 커뮤니티(스터디/팀 프로젝트 모집), 1:1 채팅 기능을 제공

### 1.2 주요 기능
- 강의 구매 및 시청
- 커뮤니티 모집 글 작성/참여
- 1:1 채팅
- 강사 강의 관리
- 장바구니 및 결제

### 1.3 사용자 유형 (프론트 코드 기준)
- **비회원**: 강의 목록 조회, 강의 상세 조회 (미리보기)
- **회원(학생)**: 강의 구매/시청, 커뮤니티 참여, 채팅
- **강사(instructor)**: 강의 생성/관리, 학생 강의 기능 모두 포함

---

## 2. 전체 화면(Path) & API 맵

| 화면 Path | 화면 설명 | 주요 사용 API |
|---------|----------|--------------|
| `/` | 메인 페이지 (강의 목록) | `GET /api/courses`, `GET /api/courses/popular` |
| `/courses` | 강의 목록 | `GET /api/courses` |
| `/courses/:id` | 강의 상세 | `GET /api/courses/:id` |
| `/watch/:id` | 강의 시청 | `GET /api/courses/:id/curriculum`, `GET /api/courses/:id/qna` |
| `/cart` | 장바구니 | `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/:id` |
| `/my-courses` | 내 강의 목록 | `GET /api/users/me/courses` |
| `/profile` | 마이페이지 | `GET /api/users/me`, `GET /api/users/me/purchases` |
| `/community` | 커뮤니티 목록 | `GET /api/community` |
| `/community/:id` | 커뮤니티 상세 | `GET /api/community/:id` |
| `/community/create` | 커뮤니티 작성 | `POST /api/community` |
| `/chat/:id` | 채팅 | `GET /api/chats/:id/messages`, `POST /api/chats/:id/messages` |
| `/search` | 통합 검색 | `GET /api/search` |
| `/instructor/create-course` | 강의 생성 | `POST /api/courses` |
| `/login` | 로그인 | `POST /api/auth/login` |
| `/signup` | 회원가입 | `POST /api/auth/signup` |

---

## 3. 인증 방식 (프론트 코드 기반 추론)

### 3.1 인증 상태 관리
- 프론트에서 `isAuthenticated` 상태로 로그인 여부 판단
- 사용자 정보: `user.name`, `user.email`, `user.avatar`, `user.role`

### 3.2 권장 인증 방식
- **JWT 토큰** 기반 인증
- Header: `Authorization: Bearer {token}`
- 토큰에 포함 정보: `userId`, `email`, `role`

---

## 4. 공통 응답 형식

### 4.1 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지"
}
```

### 4.2 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### 4.3 페이징 응답
```json
{
  "success": true,
  "data": {
    "items": [...],
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

## 5. 공통 규칙

### 5.1 날짜 형식
- ISO 8601 형식: `2024-01-15T10:30:00Z`

### 5.2 정렬
- Query Parameter: `?sort=createdAt,desc`

### 5.3 페이징
- Query Parameters: `?page=1&size=20`
- 기본값: `page=1`, `size=20`

### 5.4 소프트 삭제
- 모든 Entity는 `deletedAt` 필드 포함
- 삭제 시 실제 삭제가 아닌 `deletedAt` 업데이트

---

## 6. HTTP 상태 코드

| 코드 | 설명 |
|-----|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 204 | 성공 (응답 본문 없음) |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 500 | 서버 오류 |

---

**다음 문서**: `BACKEND_ENTITY_DESIGN.md` - Entity 설계  
**다음 문서**: `BACKEND_API_ENDPOINTS.md` - 상세 API 엔드포인트
