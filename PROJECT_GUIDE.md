# CourseHub 프로젝트 구조 및 개발 가이드

## 📋 프로젝트 개요

인프런 스타일의 온라인 교육 플랫폼을 Next.js + TypeScript로 구현한 프로젝트입니다.

## ✅ 완료된 작업

### 1. 프로젝트 초기 설정
- ✅ Next.js 16 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- ✅ Tailwind CSS 설정 (디자인 시스템 적용)
- ✅ 전역 스타일 설정 (Google Fonts, Material Symbols)
- ✅ 프로젝트 디렉토리 구조 생성

### 2. 공통 컴포넌트 구현
- ✅ **Button**: 다양한 variant와 크기 지원
- ✅ **Input**: 라벨, 에러, 아이콘 지원
- ✅ **Card**: hover 효과, padding 옵션
- ✅ **Badge**: 색상별 variant
- ✅ **Avatar**: 크기 옵션, fallback
- ✅ **SearchBar**: 검색 기능

### 3. 레이아웃 컴포넌트 구현
- ✅ **Header**: 네비게이션, 검색, 사용자 프로필
- ✅ **Footer**: 링크, 저작권 정보

### 4. 도메인 컴포넌트 구현
- ✅ **CourseCard**: 강의 정보 카드
- ✅ **CommunityCard**: 커뮤니티 게시글 카드

### 5. 페이지 구현
- ✅ **홈페이지** (`/`): Hero 섹션, 인기 강의, 카테고리별 강의
- ✅ **로그인** (`/login`): 이메일/비밀번호, 소셜 로그인
- ✅ **커뮤니티** (`/community`): 스터디/프로젝트 모집 게시판

## 📂 디렉토리 구조

```
SeSAC-SesacRun-front/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # 홈페이지
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── globals.css              # 전역 스타일
│   │   ├── login/
│   │   │   └── page.tsx            # 로그인 페이지
│   │   └── community/
│   │       └── page.tsx            # 커뮤니티 페이지
│   │
│   └── components/
│       ├── common/                  # 공통 컴포넌트
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Card.tsx
│       │   ├── Badge.tsx
│       │   ├── Avatar.tsx
│       │   ├── SearchBar.tsx
│       │   └── index.ts            # Export 인덱스
│       │
│       ├── layout/                  # 레이아웃 컴포넌트
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       │
│       ├── course/                  # 강의 관련 컴포넌트
│       │   └── CourseCard.tsx
│       │
│       └── community/               # 커뮤니티 관련 컴포넌트
│           └── CommunityCard.tsx
│
├── design-references/               # HTML 디자인 참고 파일
├── tailwind.config.ts              # Tailwind 설정
├── package.json
└── README.md
```

## 🎯 다음 단계 (구현 예정)

### 우선순위 1: 핵심 페이지
1. **회원가입 페이지** (`/signup`)
   - 이메일/비밀번호 입력
   - 약관 동의
   - 소셜 회원가입

2. **강의 상세 페이지** (`/courses/[id]`)
   - 강의 정보
   - 커리큘럼
   - 강사 정보
   - 수강평
   - Q&A
   - 구매 카드 (sticky)

3. **강의 목록 페이지** (`/courses`)
   - 필터링 (카테고리, 가격, 난이도)
   - 정렬
   - 페이지네이션

### 우선순위 2: 사용자 기능
4. **내 강의실** (`/my-courses`)
   - 수강 중인 강의 목록
   - 학습 진도율
   - 최근 학습 강의

5. **학습 대시보드** (`/my-courses/[id]`)
   - 비디오 플레이어
   - 강의 목차
   - 학습 노트
   - 진도율 표시

6. **마이 페이지** (`/profile`)
   - 프로필 정보 수정
   - 비밀번호 변경
   - 알림 설정

### 우선순위 3: 결제 및 커뮤니티
7. **장바구니** (`/cart`)
   - 장바구니 목록
   - 쿠폰 적용
   - 총 금액 계산

8. **결제 페이지** (`/checkout`)
   - 결제 정보 입력
   - 결제 수단 선택
   - 주문 확인

9. **커뮤니티 게시글 상세** (`/community/[id]`)
   - 게시글 내용
   - 댓글
   - 좋아요

10. **1:1 문의 채팅** (`/support`)
    - 실시간 채팅
    - 문의 내역

### 우선순위 4: 관리자
11. **관리자 대시보드** (`/admin`)
    - 회원 관리
    - 강의 승인
    - 주문 관리
    - 통계

## 🛠️ 개발 가이드

### 새 페이지 추가하기

1. `src/app` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 필요한 컴포넌트 import 및 사용

```tsx
// src/app/signup/page.tsx
import React from 'react';
import { Button, Input } from '@/components/common';

export default function SignupPage() {
  return (
    <div>
      {/* 페이지 내용 */}
    </div>
  );
}
```

### 새 컴포넌트 추가하기

1. 적절한 디렉토리에 컴포넌트 파일 생성
   - 공통: `src/components/common/`
   - 도메인별: `src/components/[domain]/`
2. TypeScript 인터페이스 정의
3. 컴포넌트 구현
4. 필요시 `index.ts`에 export 추가

```tsx
// src/components/common/NewComponent.tsx
import React from 'react';

export interface NewComponentProps {
  // props 정의
}

const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <div>
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default NewComponent;
```

### 스타일링 가이드

1. **Tailwind CSS 사용**
   - 유틸리티 클래스 우선 사용
   - 다크 모드: `dark:` prefix
   - 반응형: `sm:`, `md:`, `lg:`, `xl:` prefix

2. **색상 사용**
   - Primary: `bg-primary`, `text-primary`
   - 배경: `bg-background-light`, `dark:bg-background-dark`
   - 텍스트: `text-gray-900`, `dark:text-white`

3. **간격**
   - padding: `p-4`, `px-6`, `py-3`
   - margin: `m-4`, `mx-auto`, `my-6`
   - gap: `gap-4`, `gap-x-2`, `gap-y-4`

## 📝 코딩 컨벤션

### 파일명
- 컴포넌트: PascalCase (예: `Button.tsx`)
- 페이지: kebab-case 폴더 + `page.tsx`
- 유틸리티: camelCase (예: `formatDate.ts`)

### 컴포넌트 구조
```tsx
// 1. Import
import React from 'react';
import { OtherComponent } from './OtherComponent';

// 2. Types/Interfaces
export interface ComponentProps {
  // ...
}

// 3. Component
const Component: React.FC<ComponentProps> = (props) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default Component;
```

### Import 순서
1. React 관련
2. Next.js 관련
3. 외부 라이브러리
4. 내부 컴포넌트
5. 타입
6. 스타일

## 🔧 유용한 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 📚 참고 자료

- HTML 디자인 파일: `design-references/` 디렉토리
- Next.js 문서: https://nextjs.org/docs
- Tailwind CSS 문서: https://tailwindcss.com/docs
- Material Symbols: https://fonts.google.com/icons

## 🎨 디자인 토큰

```typescript
// tailwind.config.ts
colors: {
  primary: "#135bec",
  "background-light": "#f6f6f8",
  "background-dark": "#101622",
}

fontFamily: {
  display: ["Lexend", "Noto Sans KR", "sans-serif"],
}

borderRadius: {
  DEFAULT: "0.25rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
}
```

## 🚀 배포

배포 전 체크리스트:
- [ ] 빌드 에러 없음
- [ ] 타입 에러 없음
- [ ] 린트 에러 없음
- [ ] 모든 페이지 동작 확인
- [ ] 반응형 확인
- [ ] 다크 모드 확인
- [ ] 환경 변수 설정

---

**작성일**: 2024-12-19
**버전**: 1.0.0
