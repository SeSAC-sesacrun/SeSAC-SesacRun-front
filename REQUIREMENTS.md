# CourseHub 기능 요구사항 명세서

## 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 사용자 역할](#2-사용자-역할)
- [3. 핵심 기능](#3-핵심-기능)
- [4. 데이터 모델](#4-데이터-모델)
- [5. 비즈니스 로직](#5-비즈니스-로직)
- [6. 보안 요구사항](#6-보안-요구사항)
- [7. 성능 요구사항](#7-성능-요구사항)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 설명
CourseHub는 온라인 강의 플랫폼으로, 강사가 강의를 등록하고 학생이 수강할 수 있으며, 커뮤니티를 통해 스터디 및 프로젝트 팀원을 모집할 수 있는 통합 학습 플랫폼입니다.

### 1.2 주요 목표
- 강사와 학생을 연결하는 온라인 강의 플랫폼 제공
- 학습자 간 협업을 위한 커뮤니티 기능 제공
- 실시간 채팅을 통한 원활한 소통 지원
- 학습 진행률 추적 및 관리

---

## 2. 사용자 역할

### 2.1 학생 (Student)
- 강의 검색 및 수강
- 강의 시청 및 진행률 관리
- 리뷰 및 Q&A 작성
- 커뮤니티 게시글 작성 및 참여
- 채팅을 통한 소통

### 2.2 강사 (Instructor)
- 강의 생성, 수정, 삭제
- 커리큘럼 관리
- 학생 Q&A 답변
- 수강생 관리
- 강의 통계 확인

### 2.3 관리자 (Admin) - 향후 구현
- 사용자 관리
- 강의 승인 및 관리
- 신고 처리
- 플랫폼 통계 확인

---

## 3. 핵심 기능

### 3.1 인증 및 회원 관리

#### 3.1.1 회원가입
**기능 설명:**
- 이메일/비밀번호 기반 회원가입
- 소셜 로그인 (Google, Kakao)
- 회원 유형 선택 (학생/강사)

**요구사항:**
- 이메일 중복 검증
- 비밀번호 암호화 (bcrypt 또는 유사 알고리즘)
- 이메일 인증 (선택사항)
- 비밀번호 강도 검증 (최소 8자, 영문+숫자 조합)

**비즈니스 규칙:**
- 이메일은 고유해야 함
- 소셜 로그인 시 기존 계정과 연동 가능
- 회원가입 시 기본 프로필 이미지 제공

#### 3.1.2 로그인
**기능 설명:**
- 이메일/비밀번호 로그인
- 소셜 로그인
- 자동 로그인 (Remember Me)

**요구사항:**
- JWT 기반 인증
- Access Token (1시간) + Refresh Token (2주)
- 로그인 실패 시 5회 제한 (계정 잠금)

#### 3.1.3 프로필 관리
**기능 설명:**
- 프로필 정보 조회 및 수정
- 프로필 이미지 업로드
- 비밀번호 변경

---

### 3.2 강의 관리

#### 3.2.1 강의 목록 조회
**기능 설명:**
- 전체 강의 목록 조회
- 카테고리별 필터링
- 검색 기능
- 정렬 (인기순, 최신순, 평점순)

**요구사항:**
- 페이지네이션 (기본 12개/페이지)
- 검색어 하이라이팅
- 썸네일 이미지 최적화

**비즈니스 규칙:**
- 승인된 강의만 목록에 표시
- 삭제된 강의는 표시하지 않음

#### 3.2.2 강의 상세 조회
**기능 설명:**
- 강의 기본 정보 표시
- 커리큘럼 구조 표시
- 강사 정보 표시
- 리뷰 및 평점 표시
- Q&A 목록 표시

**요구사항:**
- 무료 강의 미리보기 제공
- 수강 전/후 UI 구분
- 관련 강의 추천

#### 3.2.3 강의 생성 (강사 전용)
**기능 설명:**
- 강의 기본 정보 입력
- 커리큘럼 구성 (섹션 및 강의)
- 가격 설정
- 썸네일 업로드

**요구사항:**
- 강사 권한 검증
- 필수 필드 검증
- 임시 저장 기능
- 미리보기 기능

**비즈니스 규칙:**
- 강의는 초안(draft) 상태로 생성
- 관리자 승인 후 공개 (선택사항)
- 최소 1개 이상의 섹션 필요
- 각 섹션은 최소 1개 이상의 강의 필요

#### 3.2.4 강의 수정/삭제 (강사 전용)
**기능 설명:**
- 강의 정보 수정
- 커리큘럼 수정
- 강의 삭제 (소프트 삭제)

**비즈니스 규칙:**
- 수강생이 있는 강의는 삭제 불가 (비활성화만 가능)
- 수정 시 수강생에게 알림 발송

---

### 3.3 수강 관리

#### 3.3.1 강의 수강 신청
**기능 설명:**
- 강의 구매 및 수강 신청
- 장바구니 기능 (향후 구현)
- 결제 처리 (향후 구현)

**요구사항:**
- 중복 수강 방지
- 수강 신청 시 즉시 접근 권한 부여

**비즈니스 규칙:**
- 이미 수강 중인 강의는 재구매 불가
- 무료 강의는 즉시 수강 가능

#### 3.3.2 강의 시청
**기능 설명:**
- 동영상 플레이어
- 재생 속도 조절
- 자막 지원 (선택사항)
- 이전/다음 강의 이동
- 진행률 자동 저장

**요구사항:**
- HLS 또는 DASH 스트리밍
- 시청 기록 자동 저장 (5초마다)
- 마지막 시청 위치 복원
- 강의 자료 다운로드

**비즈니스 규칙:**
- 수강 권한이 있는 사용자만 시청 가능
- 강의의 80% 이상 시청 시 완료 처리
- 순차 학습 강제 (선택사항)

#### 3.3.3 학습 진행률 관리
**기능 설명:**
- 전체 진행률 표시
- 강의별 진행률 표시
- 완료한 강의 표시
- 학습 통계 제공

**요구사항:**
- 실시간 진행률 업데이트
- 진행률 백분율 계산
- 수료증 발급 조건 확인

**비즈니스 규칙:**
- 진행률 = (완료한 강의 수 / 전체 강의 수) × 100
- 모든 강의 완료 시 수료증 발급 가능

---

### 3.4 리뷰 및 평가

#### 3.4.1 리뷰 작성
**기능 설명:**
- 별점 평가 (1-5점)
- 텍스트 리뷰 작성
- 리뷰 수정/삭제

**요구사항:**
- 수강한 강의만 리뷰 작성 가능
- 1인 1리뷰 제한
- 욕설 필터링

**비즈니스 규칙:**
- 최소 1개 강의 완료 후 리뷰 작성 가능
- 리뷰 작성 시 강의 평점 자동 업데이트
- 리뷰 삭제 시 평점 재계산

#### 3.4.2 리뷰 조회
**기능 설명:**
- 강의별 리뷰 목록
- 평점 분포 표시
- 정렬 (최신순, 평점 높은순, 평점 낮은순)
- 도움이 되었어요 기능

**요구사항:**
- 페이지네이션
- 평균 평점 실시간 계산
- 리뷰 신고 기능

---

### 3.5 Q&A

#### 3.5.1 질문 작성
**기능 설명:**
- 강의별 질문 작성
- 특정 강의(Lecture)에 대한 질문
- 질문 수정/삭제

**요구사항:**
- 수강 중인 강의만 질문 가능
- 이미지 첨부 (선택사항)
- 코드 블록 지원

**비즈니스 규칙:**
- 질문 작성 시 강사에게 알림 발송
- 답변 완료 시 질문자에게 알림 발송

#### 3.5.2 답변 작성 (강사)
**기능 설명:**
- 질문에 대한 답변 작성
- 답변 수정/삭제
- 베스트 답변 선택 (선택사항)

**요구사항:**
- 강사만 답변 가능
- 이미지 첨부 지원
- 코드 블록 지원

---

### 3.6 커뮤니티

#### 3.6.1 게시글 목록 조회
**기능 설명:**
- 스터디/팀프로젝트 탭 구분
- 모집 상태 필터 (전체/모집중/모집완료)
- 검색 기능

**요구사항:**
- 페이지네이션
- 모집 인원 표시
- 조회수 표시

**비즈니스 규칙:**
- 모집 완료된 게시글도 목록에 표시
- 삭제된 게시글은 표시하지 않음

#### 3.6.2 게시글 작성
**기능 설명:**
- 제목, 내용 입력
- 카테고리 선택 (스터디/팀프로젝트)
- 모집 인원 설정
- 모집 상태 설정
- 태그 추가

**요구사항:**
- 로그인한 사용자만 작성 가능
- 작성 형식 예시 제공 (플레이스홀더)
- 마크다운 지원 (선택사항)

**비즈니스 규칙:**
- 작성 시 기본 상태는 '모집중'
- 현재 참여자는 작성자 본인만 포함

#### 3.6.3 게시글 상세 조회
**기능 설명:**
- 게시글 내용 표시
- 작성자 정보 표시
- 모집 정보 표시
- 참여자 목록 표시 (모집자만 확인 가능)
- 좋아요 기능
- 북마크 기능

**요구사항:**
- 조회수 증가 (중복 방지)
- 채팅하기 버튼
- 공유 기능

#### 3.6.4 게시글 수정/삭제
**기능 설명:**
- 게시글 수정
- 모집 상태 변경
- 게시글 삭제

**비즈니스 규칙:**
- 작성자만 수정/삭제 가능
- 참여자가 있는 경우 삭제 불가 (비활성화만 가능)
- 모집 상태 변경 시 참여자에게 알림

---

### 3.7 채팅

#### 3.7.1 채팅방 목록
**기능 설명:**
- 내 채팅방 목록 조회
- 마지막 메시지 표시
- 읽지 않은 메시지 수 표시
- 온라인 상태 표시

**요구사항:**
- 실시간 업데이트 (WebSocket)
- 최근 대화 순 정렬
- 채팅방 검색

#### 3.7.2 채팅 메시지
**기능 설명:**
- 메시지 전송/수신
- 메시지 읽음 처리
- 메시지 기록 조회

**요구사항:**
- 실시간 메시지 전송 (WebSocket)
- 메시지 페이지네이션
- 이미지 전송 (선택사항)
- 메시지 알림

**비즈니스 규칙:**
- 채팅방은 1:1만 지원
- 커뮤니티 게시글 관련 채팅방 자동 생성
- 메시지는 영구 보관

#### 3.7.3 참여 신청/승인
**기능 설명:**
- 참여자: 신청하기 버튼
- 모집자: 승인/거절 버튼
- 신청 상태 관리

**요구사항:**
- Role 기반 버튼 표시
- 신청/승인 시 알림 발송
- 신청 내역 관리

**비즈니스 규칙:**
- 모집 인원 초과 시 신청 불가
- 승인 시 참여자 목록에 추가
- 거절 시 사유 입력 (선택사항)

---

### 3.8 알림

#### 3.8.1 알림 목록
**기능 설명:**
- 알림 목록 조회
- 읽지 않은 알림 수 표시
- 알림 읽음 처리

**요구사항:**
- 실시간 알림 (WebSocket)
- 알림 타입별 아이콘
- 알림 클릭 시 해당 페이지 이동

**알림 타입:**
- 새 메시지
- 참여 신청
- 참여 승인/거절
- 새 리뷰
- Q&A 답변
- 강의 업데이트

---

### 3.9 검색

#### 3.9.1 통합 검색
**기능 설명:**
- 강의 검색
- 커뮤니티 게시글 검색
- 자동완성 (선택사항)

**요구사항:**
- 전체 텍스트 검색
- 검색어 하이라이팅
- 검색 기록 저장 (선택사항)

**비즈니스 규칙:**
- 최소 2자 이상 입력 시 검색
- 검색 결과는 관련도 순 정렬

---

## 4. 데이터 모델

### 4.1 User (사용자)
```typescript
{
  userId: string;          // UUID
  email: string;           // 이메일 (고유)
  password: string;        // 암호화된 비밀번호
  name: string;            // 이름
  avatar?: string;         // 프로필 이미지 URL
  role: 'student' | 'instructor' | 'admin';
  provider?: 'google' | 'kakao';  // 소셜 로그인 제공자
  providerId?: string;     // 소셜 로그인 ID
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;        // 소프트 삭제
}
```

### 4.2 Course (강의)
```typescript
{
  courseId: string;
  instructorId: string;    // User.userId (FK)
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;          // 평균 평점 (계산 필드)
  reviewCount: number;     // 리뷰 수 (계산 필드)
  studentCount: number;    // 수강생 수 (계산 필드)
  features: string[];      // 강의 특징
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### 4.3 Section (섹션)
```typescript
{
  sectionId: string;
  courseId: string;        // Course.courseId (FK)
  title: string;
  order: number;           // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.4 Lecture (강의)
```typescript
{
  lectureId: string;
  sectionId: string;       // Section.sectionId (FK)
  title: string;
  duration: number;        // 초 단위
  order: number;
  videoUrl: string;
  isFree: boolean;         // 무료 미리보기 여부
  resources?: Resource[];  // 강의 자료
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.5 Enrollment (수강)
```typescript
{
  enrollmentId: string;
  userId: string;          // User.userId (FK)
  courseId: string;        // Course.courseId (FK)
  progress: number;        // 진행률 (0-100)
  lastWatchedLectureId?: string;
  enrolledAt: Date;
  completedAt?: Date;
}
```

### 4.6 WatchProgress (시청 기록)
```typescript
{
  progressId: string;
  enrollmentId: string;    // Enrollment.enrollmentId (FK)
  lectureId: string;       // Lecture.lectureId (FK)
  watchedDuration: number; // 시청한 시간 (초)
  isCompleted: boolean;
  lastWatchedAt: Date;
}
```

### 4.7 Review (리뷰)
```typescript
{
  reviewId: string;
  courseId: string;        // Course.courseId (FK)
  userId: string;          // User.userId (FK)
  rating: number;          // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### 4.8 Question (질문)
```typescript
{
  questionId: string;
  courseId: string;        // Course.courseId (FK)
  lectureId?: string;      // Lecture.lectureId (FK)
  userId: string;          // User.userId (FK)
  question: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.9 Answer (답변)
```typescript
{
  answerId: string;
  questionId: string;      // Question.questionId (FK)
  userId: string;          // User.userId (FK, 강사)
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.10 CommunityPost (커뮤니티 게시글)
```typescript
{
  postId: string;
  authorId: string;        // User.userId (FK)
  category: 'study' | 'project';
  status: 'recruiting' | 'completed';
  title: string;
  content: string;
  currentMembers: number;  // 계산 필드
  totalMembers: number;
  views: number;
  likes: number;           // 계산 필드
  tags: string[];
  schedule?: {
    startDate: string;
    meetingTime: string;
    location: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### 4.11 PostParticipant (게시글 참여자)
```typescript
{
  participantId: string;
  postId: string;          // CommunityPost.postId (FK)
  userId: string;          // User.userId (FK)
  status: 'pending' | 'approved' | 'rejected';
  joinedAt: Date;
}
```

### 4.12 Chat (채팅방)
```typescript
{
  chatId: string;
  type: 'community' | 'support';
  relatedId?: string;      // CommunityPost.postId 또는 Course.courseId
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.13 ChatParticipant (채팅 참여자)
```typescript
{
  chatParticipantId: string;
  chatId: string;          // Chat.chatId (FK)
  userId: string;          // User.userId (FK)
  lastReadAt?: Date;
  joinedAt: Date;
}
```

### 4.14 Message (메시지)
```typescript
{
  messageId: string;
  chatId: string;          // Chat.chatId (FK)
  senderId: string;        // User.userId (FK)
  content: string;
  isRead: boolean;
  sentAt: Date;
}
```

### 4.15 Notification (알림)
```typescript
{
  notificationId: string;
  userId: string;          // User.userId (FK)
  type: 'new_message' | 'application_approved' | 'new_review' | 'qna_answer' | 'course_update';
  title: string;
  content: string;
  relatedId?: string;      // 관련 엔티티 ID
  isRead: boolean;
  createdAt: Date;
}
```

---

## 5. 비즈니스 로직

### 5.1 강의 평점 계산
```
평균 평점 = SUM(모든 리뷰의 rating) / COUNT(리뷰 수)
소수점 첫째 자리까지 표시
```

### 5.2 강의 진행률 계산
```
진행률 = (완료한 강의 수 / 전체 강의 수) × 100
소수점 반올림하여 정수로 표시
```

### 5.3 강의 완료 조건
```
강의 완료 = 시청 시간 >= 강의 시간 × 0.8
```

### 5.4 수료증 발급 조건
```
수료증 발급 = 모든 강의 완료 AND 진행률 = 100%
```

### 5.5 모집 상태 자동 변경
```
IF 현재 참여자 수 >= 총 모집 인원 THEN
  status = 'completed'
END IF
```

### 5.6 할인율 계산
```
할인율 = ((정가 - 판매가) / 정가) × 100
```

---

## 6. 보안 요구사항

### 6.1 인증 및 권한
- JWT 기반 인증
- Access Token 만료 시간: 1시간
- Refresh Token 만료 시간: 2주
- HTTPS 필수
- CORS 설정

### 6.2 데이터 보호
- 비밀번호 암호화 (bcrypt, salt rounds: 10)
- 개인정보 암호화 (선택사항)
- SQL Injection 방지
- XSS 방지

### 6.3 API 보안
- Rate Limiting (1분당 100 요청)
- API Key 검증 (선택사항)
- 입력 값 검증 및 Sanitization

---

## 7. 성능 요구사항

### 7.1 응답 시간
- API 응답 시간: 평균 200ms 이하
- 페이지 로딩 시간: 3초 이하
- 동영상 스트리밍 버퍼링: 2초 이하

### 7.2 동시 접속
- 최소 1,000명 동시 접속 지원
- WebSocket 연결: 최소 500개 동시 지원

### 7.3 데이터베이스
- 인덱스 최적화
- 쿼리 최적화
- 캐싱 전략 (Redis)

### 7.4 파일 저장
- 이미지 최적화 (WebP 변환)
- CDN 사용
- 동영상 스트리밍 최적화 (HLS/DASH)

---

## 8. 추가 고려사항

### 8.1 향후 구현 예정
- 장바구니 및 결제 시스템
- 쿠폰 및 프로모션
- 수료증 발급 시스템
- 강의 추천 알고리즘
- 학습 분석 대시보드
- 관리자 페이지

### 8.2 확장성
- 마이크로서비스 아키텍처 고려
- 메시지 큐 (RabbitMQ, Kafka)
- 로드 밸런싱
- 데이터베이스 샤딩

### 8.3 모니터링
- 에러 로깅 (Sentry)
- 성능 모니터링 (New Relic, DataDog)
- 사용자 행동 분석 (Google Analytics)

---

## 부록: 프론트엔드 라우팅

### 페이지 경로
| 경로 | 설명 |
|------|------|
| `/` | 홈페이지 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/courses` | 강의 목록 |
| `/courses/:id` | 강의 상세 |
| `/my-courses` | 내 강의 목록 |
| `/watch/:id` | 강의 시청 |
| `/community` | 커뮤니티 목록 |
| `/community/:id` | 커뮤니티 상세 |
| `/community/create` | 커뮤니티 작성 |
| `/chat/:id` | 채팅 |
| `/profile` | 마이페이지 |
| `/instructor/create-course` | 강의 생성 (강사) |
