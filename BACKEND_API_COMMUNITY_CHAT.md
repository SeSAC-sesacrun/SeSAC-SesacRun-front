# API 엔드포인트 명세서 - 커뮤니티, 채팅, 기타

> 프론트엔드 코드 기반 API 설계

---

## 1. 커뮤니티

### 1.1 [GET] /api/community
**설명**: 커뮤니티 게시글 목록 조회  
**연관 화면**: `/community`  
**인증 필요**: ❌

**Query Parameters**:
- `category`: `study` | `project` (선택)
- `status`: `recruiting` | `completed` (선택)
- `page`: 페이지 번호
- `size`: 페이지 크기

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "category": "study",
        "status": "recruiting",
        "title": "프론트엔드 실전 프로젝트 스터디원 모집",
        "author": {
          "id": 1,
          "name": "김철수",
          "avatar": "https://example.com/avatar.jpg"
        },
        "currentMembers": 8,
        "totalMembers": 10,
        "views": 1234,
        "tags": ["React", "TypeScript"],
        "createdAt": "2024-01-15T00:00:00Z"
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

### 1.2 [GET] /api/community/:id
**설명**: 커뮤니티 게시글 상세 조회  
**연관 화면**: `/community/:id`  
**인증 필요**: ❌

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category": "study",
    "status": "recruiting",
    "title": "프론트엔드 실전 프로젝트 스터디원 모집",
    "content": "안녕하세요! React와 TypeScript를 사용한...",
    "author": {
      "id": 1,
      "name": "김철수",
      "avatar": "https://example.com/avatar.jpg"
    },
    "currentMembers": 8,
    "totalMembers": 10,
    "views": 1234,
    "tags": ["React", "TypeScript", "프론트엔드"],
    "members": [
      {
        "userId": 2,
        "name": "이영희",
        "avatar": "https://example.com/avatar2.jpg",
        "role": "participant",
        "status": "approved"
      }
    ],
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

**상태 코드**:
- `200`: 성공
- `404`: 게시글 없음

---

### 1.3 [POST] /api/community
**설명**: 커뮤니티 게시글 작성  
**연관 화면**: `/community/create`  
**인증 필요**: ✅

**Request Body**:
```json
{
  "category": "study",
  "title": "프론트엔드 실전 프로젝트 스터디원 모집",
  "content": "안녕하세요! React와 TypeScript를 사용한...",
  "totalMembers": 10,
  "tags": ["React", "TypeScript", "프론트엔드"]
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "프론트엔드 실전 프로젝트 스터디원 모집",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 1.4 [PUT] /api/community/:id
**설명**: 커뮤니티 게시글 수정  
**인증 필요**: ✅ (본인 게시글만)

**Request Body**: 1.3과 동일

---

### 1.5 [DELETE] /api/community/:id
**설명**: 커뮤니티 게시글 삭제  
**인증 필요**: ✅ (본인 게시글만)

**Response (204)**: No Content

---

### 1.6 [POST] /api/community/:id/join
**설명**: 커뮤니티 참여 신청  
**연관 화면**: `/community/:id`  
**인증 필요**: ✅

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "memberId": 1,
    "postId": 1,
    "status": "pending",
    "joinedAt": "2024-01-15T00:00:00Z"
  }
}
```

**상태 코드**:
- `201`: 신청 성공
- `400`: 이미 참여 중이거나 모집 완료
- `401`: 인증 필요

---

### 1.7 [POST] /api/community/:postId/members/:memberId/approve
**설명**: 참여 신청 승인 (모집자만)  
**인증 필요**: ✅ (모집자만)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "memberId": 1,
    "status": "approved"
  }
}
```

---

### 1.8 [POST] /api/community/:postId/members/:memberId/reject
**설명**: 참여 신청 거절 (모집자만)  
**인증 필요**: ✅ (모집자만)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "memberId": 1,
    "status": "rejected"
  }
}
```

---

## 2. 채팅

### 2.1 [GET] /api/chats
**설명**: 내 채팅방 목록 조회  
**연관 화면**: `/chat/:id` (사이드바)  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "총괄 매니저",
      "avatar": "https://example.com/avatar.jpg",
      "lastMessage": "네, 확인 후 바로 답변...",
      "lastMessageTime": "2024-01-15T14:45:00Z",
      "unreadCount": 1,
      "isOnline": true
    }
  ]
}
```

---

### 2.2 [GET] /api/chats/:id/messages
**설명**: 채팅 메시지 조회  
**연관 화면**: `/chat/:id`  
**인증 필요**: ✅

**Query Parameters**:
- `page`: 페이지 번호
- `size`: 페이지 크기 (기본값: 50)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "senderId": 1,
        "senderName": "김철수",
        "senderAvatar": "https://example.com/avatar.jpg",
        "content": "안녕하세요, 김민준님. 문의주신 내용 확인했습니다.",
        "type": "text",
        "createdAt": "2024-01-15T14:42:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

---

### 2.3 [POST] /api/chats/:id/messages
**설명**: 메시지 전송  
**연관 화면**: `/chat/:id`  
**인증 필요**: ✅

**Request Body**:
```json
{
  "content": "안녕하세요. React 심화 과정 3강의 소스코드 관련해서 질문이 있습니다."
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "안녕하세요. React 심화 과정 3강의 소스코드 관련해서 질문이 있습니다.",
    "createdAt": "2024-01-15T14:43:00Z"
  }
}
```

---

### 2.4 [POST] /api/chats
**설명**: 새 채팅방 생성  
**인증 필요**: ✅

**Request Body**:
```json
{
  "participantId": 2,
  "name": "1:1 문의"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "1:1 문의",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## 3. 장바구니

### 3.1 [GET] /api/cart
**설명**: 장바구니 조회  
**연관 화면**: `/cart`  
**인증 필요**: ✅

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "title": "초보자를 위한 완벽한 웹 개발 마스터클래스",
      "instructor": "김철수",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "price": 129000,
      "originalPrice": 258000,
      "discount": 50,
      "addedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### 3.2 [POST] /api/cart
**설명**: 장바구니에 강의 추가  
**연관 화면**: `/courses/:id`  
**인증 필요**: ✅

**Request Body**:
```json
{
  "courseId": 1
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "courseId": 1,
    "addedAt": "2024-01-15T00:00:00Z"
  }
}
```

**상태 코드**:
- `201`: 추가 성공
- `400`: 이미 장바구니에 있음 또는 이미 구매한 강의

---

### 3.3 [DELETE] /api/cart/:id
**설명**: 장바구니에서 제거  
**연관 화면**: `/cart`  
**인증 필요**: ✅

**Response (204)**: No Content

---

## 4. 검색

### 4.1 [GET] /api/search
**설명**: 통합 검색 (강의 + 커뮤니티)  
**연관 화면**: `/search`  
**인증 필요**: ❌

**Query Parameters**:
- `q`: 검색어 (필수)
- `type`: `courses` | `community` | `all` (기본값: `all`)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "React 완벽 가이드",
        "instructor": "김철수",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "price": 129000
      }
    ],
    "community": [
      {
        "id": 1,
        "category": "study",
        "title": "React 스터디원 모집",
        "author": "이영희",
        "currentMembers": 8,
        "totalMembers": 10
      }
    ]
  }
}
```

---

## 5. 결제 (프론트 코드 기반 추론)

### 5.1 [POST] /api/payments/checkout
**설명**: 결제 처리  
**연관 화면**: `/cart`  
**인증 필요**: ✅

**Request Body**:
```json
{
  "courseIds": [1, 2, 3],
  "totalAmount": 358000,
  "paymentMethod": "card"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "paymentId": 1,
    "orderId": "ORDER-20240115-001",
    "totalAmount": 358000,
    "status": "completed",
    "paidAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## 6. 파일 업로드 (프론트 코드 기반 추론)

### 6.1 [POST] /api/upload/image
**설명**: 이미지 업로드 (썸네일, 프로필 등)  
**인증 필요**: ✅

**Request**: `multipart/form-data`
- `file`: 이미지 파일

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/image123.jpg"
  }
}
```

**상태 코드**:
- `200`: 업로드 성공
- `400`: 잘못된 파일 형식 또는 크기 초과
- `401`: 인증 필요
