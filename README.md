# 🏃 SeSAC Run

> **온라인 강의 플랫폼 + 학습 커뮤니티 통합 서비스**  
> 강사와 학생을 연결하고, 스터디 및 프로젝트 팀원 모집을 지원하는 통합 학습 플랫폼

<br/>

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
  <br/>

## 🎯 프로젝트 소개

**SeSAC Run**은 온라인 강의 수강과 학습자 간 협업을 하나의 플랫폼에서 제공하는 통합 학습 서비스입니다.

### 핵심 가치

- 🎓 **체계적인 학습**: 강사가 제공하는 고품질 온라인 강의
- 🤝 **협업 학습**: 스터디 및 프로젝트 팀원 모집 커뮤니티
- 💬 **실시간 소통**: WebSocket 기반 실시간 채팅

### 타겟 사용자

- **사용자**: 온라인 강의 수강, 스터디/프로젝트 참여, 커뮤니티를 통한 팀원 모집 및 협업
- **강사**: 강의 제작 및 관리, 학생 Q&A 답변

<br/>

## 👥 팀원

- **Frontend**: [Your Name]
- **Backend**: [Backend Developer]

## ✨ 주요 기능

### 1️⃣ 강의 플랫폼

- ✅ 강의 검색 및 필터링
- ✅ 강의 상세 정보 및 커리큘럼 확인
- ✅ 동영상 강의 시청
- ✅ 강의 결제 및 환불

### 2️⃣ 커뮤니티

- ✅ 스터디/팀 프로젝트 모집 게시판
- ✅ 모집 상태 관리 (모집중/모집완료)
- ✅ 참여 신청 및 승인 시스템
- ✅ 게시글 필터링

### 3️⃣ 실시간 채팅

- ✅ WebSocket 기반 실시간 메시징
- ✅ 1:1 채팅 지원

### 4️⃣ 강사 기능

- ✅ 강의 생성 및 관리
- ✅ 커리큘럼 구성 (섹션/강의 구조)
- ✅ 강의 자료 업로드

### 5️⃣ 사용자 관리

- ✅ JWT 기반 인증
- ✅ 내 강의
- ✅ 구매 내역 조회
- ✅ 작성한 게시글
- ✅ 참여 중인 모임
- ✅ 운영 중인 강의 (강사)

<br/>

## 🛠 기술 스택

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 주요 라이브러리

- **UI/UX**

  - `Tailwind CSS 4.0` - 유틸리티 기반 CSS 프레임워크
  - `@tailwindcss/forms` - 폼 스타일링
  - `Material Symbols` - 아이콘 시스템

- **에디터**

  - `CKEditor 5` - 리치 텍스트 에디터
  - `react-dropzone` - 파일 업로드

- **실시간 통신**

  - `@stomp/stompjs` - WebSocket STOMP 클라이언트
  - `sockjs-client` - WebSocket 폴백

- **상태 관리 & 데이터**

  - `axios` - HTTP 클라이언트
  - `React Context API` - 전역 상태 관리

- **드래그 앤 드롭**
  - `@dnd-kit/core` - 드래그 앤 드롭 기능

### 개발 도구

- **코드 품질**: ESLint, TypeScript
- **스타일링**: PostCSS, Tailwind CSS
- **번들러**: Next.js (Turbopack)

<br/>

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지
│   │   ├── login/               # 로그인
│   │   └── signup/              # 회원가입
│   ├── courses/                 # 강의 관련
│   │   ├── page.tsx            # 강의 목록
│   │   └── [id]/               # 강의 상세
│   ├── watch/                   # 강의 시청
│   │   └── [id]/
│   ├── community/               # 커뮤니티
│   │   ├── page.tsx            # 게시글 목록
│   │   ├── create/             # 게시글 작성
│   │   └── [id]/               # 게시글 상세
│   ├── chat/                    # 채팅
│   │   └── [id]/               # 채팅방
│   ├── profile/                 # 마이페이지
│   ├── my-courses/              # 내 강의
│   ├── instructor/              # 강사 페이지
│   │   └── create-course/      # 강의 생성
│   └── cart/                    # 장바구니
├── components/                  # 재사용 컴포넌트
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── common/                 # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── community/              # 커뮤니티 컴포넌트
│   ├── course/                 # 강의 컴포넌트
│   ├── editor/                 # 에디터 컴포넌트
│   └── profile/                # 프로필 컴포넌트
├── contexts/                    # React Context
│   └── AuthContext.tsx         # 인증 상태 관리
├── hooks/                       # Custom Hooks
├── types/                       # TypeScript 타입 정의
└── utils/                       # 유틸리티 함수
```

<br/>
