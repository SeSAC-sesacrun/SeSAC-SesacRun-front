# SeSAC Run - 온라인 강의 플랫폼

인프런 스타일의 온라인 교육 플랫폼입니다. Next.js, TypeScript, Tailwind CSS를 사용하여 구축되었습니다.

## 🚀 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols
- **Fonts**: Lexend, Noto Sans KR

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈페이지 (강의 목록)
│   ├── login/             # 로그인 페이지
│   ├── community/         # 커뮤니티 허브
│   └── layout.tsx         # 루트 레이아웃
├── components/
│   ├── common/            # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   └── SearchBar.tsx
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── course/            # 강의 관련 컴포넌트
│   │   └── CourseCard.tsx
│   └── community/         # 커뮤니티 관련 컴포넌트
│       └── CommunityCard.tsx
└── design-references/     # HTML 디자인 참고 파일
```

## 🎨 주요 기능

### 구현된 페이지
- ✅ **홈페이지**: Hero 섹션, 인기 강의, 카테고리별 강의 목록
- ✅ **로그인**: 이메일/비밀번호 로그인, 소셜 로그인 (Google, Kakao)
- ✅ **커뮤니티**: 스터디/프로젝트 모집 게시판

### 구현 예정 페이지
- ⏳ 회원가입
- ⏳ 강의 상세 페이지
- ⏳ 내 강의실 (학습 대시보드)
- ⏳ 마이 페이지 (프로필 관리)
- ⏳ 장바구니/결제
- ⏳ 커뮤니티 게시글 상세
- ⏳ 1:1 문의 채팅
- ⏳ 관리자 대시보드

### 재사용 가능한 컴포넌트
- **Button**: 다양한 variant (primary, secondary, outline, ghost)
- **Input**: 라벨, 에러 메시지, 아이콘 지원
- **Card**: hover 효과, 다양한 padding 옵션
- **Badge**: 색상별 variant (primary, success, warning, danger, info, gray)
- **Avatar**: 다양한 크기, fallback 지원
- **SearchBar**: 검색 아이콘, Enter 키 처리
- **Header**: 네비게이션, 검색, 사용자 프로필
- **Footer**: 링크, 저작권 정보
- **CourseCard**: 강의 정보 카드
- **CommunityCard**: 커뮤니티 게시글 카드

## 🛠️ 개발 가이드

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 🎨 디자인 시스템

### 색상
- **Primary**: `#135bec` (파란색)
- **Background Light**: `#f6f6f8`
- **Background Dark**: `#101622`

### 폰트
- **Display**: Lexend, Noto Sans KR

### Border Radius
- **Default**: `0.25rem`
- **Large**: `0.5rem`
- **Extra Large**: `0.75rem`
- **Full**: `9999px`

## 📝 컴포넌트 사용 예시

### Button

```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="md">
  클릭하세요
</Button>
```

### Input

```tsx
import { Input } from '@/components/common';

<Input
  label="이메일"
  type="email"
  placeholder="이메일을 입력하세요"
  fullWidth
/>
```

### CourseCard

```tsx
import CourseCard from '@/components/course/CourseCard';

<CourseCard
  id="1"
  title="React 마스터클래스"
  instructor="김철수"
  thumbnail="/images/course.jpg"
  rating={4.8}
  reviewCount={1234}
  price={120000}
  originalPrice={240000}
/>
```

## 🌙 다크 모드

다크 모드는 Tailwind CSS의 `dark:` prefix를 사용하여 구현되었습니다.

```tsx
<div className="bg-white dark:bg-gray-800">
  컨텐츠
</div>
```

## 📱 반응형 디자인

모든 컴포넌트와 페이지는 모바일, 태블릿, 데스크톱에서 최적화되어 있습니다.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 카드 목록 */}
</div>
```

## 🔗 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
