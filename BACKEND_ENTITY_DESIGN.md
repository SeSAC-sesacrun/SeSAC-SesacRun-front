# Entity 설계 (프론트엔드 코드 기반)

> 프론트엔드에서 사용하는 데이터 필드를 기준으로 Entity 정의

---

## 1. User (사용자)

### 1.1 필드

| 필드명    | 타입          | Nullable | 설명                 |
| --------- | ------------- | -------- | -------------------- |
| id        | Long          | N        | PK                   |
| email     | String        | N        | 이메일 (unique)      |
| password  | String        | N        | 비밀번호 (암호화)    |
| name      | String        | N        | 이름                 |
| role      | Enum          | N        | USER, INSTRUCTOR     |
| createdAt | LocalDateTime | N        | 가입일               |
| updatedAt | LocalDateTime | N        | 수정일               |
| deletedAt | LocalDateTime | Y        | 삭제일 (소프트 삭제) |

### 1.2 Enum

```java
public enum UserRole {
    USER,       // 일반 사용자
    INSTRUCTOR  // 강사
}
```

### 1.3 연관관계

- Course (1:N) - 강사가 생성한 강의
- Order  (1:N) - 구매 내역
- CommunityPost (1:N) - 작성한 커뮤니티 글
- ChatMessage (1:N) - 채팅 메시지

---

## 2. Course (강의)

### 2.1 필드

| 필드명              | 타입          | Nullable | 설명                     |
| ------------------- | ------------- | -------- | ------------------------ |
| id                  | Long          | N        | PK                       |
| instructorId        | Long          | N        | FK (User)                |
| title               | String        | N        | 강의 제목                |
| description         | String        | N        | 간단한 설명              |
| detailedDescription | String          | Y        | 상세 설명                |
| thumbnail           | String        | N        | 썸네일 URL               |
| category            | String        | N        | 카테고리                 |
| price               | Integer       | N        | 판매가                   |
| originalPrice       | Integer       | Y        | 정가                     |
| level               | String        | N        | 난이도 (초급/중급/고급)  |
| language            | String        | N        | 언어                     |
| duration            | String        | N        | 총 시간 (예: "24.5시간") |
<!-- | reviewCount         | Integer       | N        | 리뷰 수 (기본값 0)       | -->
| studentCount        | Integer       | N        | 수강생 수 (기본값 0)     |
| lastUpdated         | LocalDate     | N        | 최근 업데이트            |
| createdAt           | LocalDateTime | N        | 생성일                   |
| updatedAt           | LocalDateTime | N        | 수정일                   |
| deletedAt           | LocalDateTime | Y        | 삭제일                   |

### 2.2 연관관계

- User (N:1) - 강사
- Section (1:N) - 섹션 목록
<!-- - Review (1:N) - 수강평 -->
- Purchase (1:N) - 구매 내역

---

## 3. Section (섹션)

### 3.1 필드

| 필드명     | 타입          | Nullable | 설명        |
| ---------- | ------------- | -------- | ----------- |
| id         | Long          | N        | PK          |
| courseId   | Long          | N        | FK (Course) |
| title      | String        | N        | 섹션 제목   |
| orderIndex | Integer       | N        | 정렬 순서   |
| createdAt  | LocalDateTime | N        | 생성일      |

### 3.2 연관관계

- Course (N:1)
- Lecture (1:N) - 강의 목록


---

## 4. Lecture (강의 영상)

### 4.1 필드

| 필드명     | 타입          | Nullable | 설명                     |
| ---------- | ------------- | -------- | ------------------------ |
| id         | Long          | N        | PK                       |
| sectionId  | Long          | N        | FK (Section)             |
| title      | String        | N        | 강의 제목                |
| youtubeUrl | String        | Y        | 유튜브 링크              |
| duration   | String        | N        | 재생 시간 (예: "12:30")  |
| isFree     | Boolean       | N        | 무료 여부 (기본값 false) |
| orderIndex | Integer       | N        | 정렬 순서                |
| createdAt  | LocalDateTime | N        | 생성일                   |

### 4.2 연관관계

- Section (N:1)
<!-- - WatchHistory (1:N) - 시청 기록 -->

---


<!-- ## 6. WatchHistory (시청 기록)

### 6.1 필드

| 필드명        | 타입          | Nullable | 설명             |
| ------------- | ------------- | -------- | ---------------- |
| id            | Long          | N        | PK               |
| userId        | Long          | N        | FK (User)        |
| lectureId     | Long          | N        | FK (Lecture)     |
| progress      | Integer       | N        | 진행률 (0-100)   |
| lastWatchedAt | LocalDateTime | N        | 마지막 시청 시간 |

### 6.2 연관관계

- User (N:1)
- Lecture (N:1) -->

---

<!-- ## 7. Review (수강평)

### 7.1 필드

| 필드명    | 타입          | Nullable | 설명        |
| --------- | ------------- | -------- | ----------- |
| id        | Long          | N        | PK          |
| userId    | Long          | N        | FK (User)   |
| courseId  | Long          | N        | FK (Course) |
| rating    | Integer       | N        | 평점 (1-5)  |
| comment   | Text          | N        | 리뷰 내용   |
| createdAt | LocalDateTime | N        | 작성일      |
| updatedAt | LocalDateTime | N        | 수정일      |

### 7.2 연관관계

- User (N:1)
- Course (N:1) -->

---

<!-- ## 8. CourseQnA (강의 Q&A)

### 8.1 필드

| 필드명     | 타입          | Nullable | 설명               |
| ---------- | ------------- | -------- | ------------------ |
| id         | Long          | N        | PK                 |
| userId     | Long          | N        | FK (User) - 질문자 |
| courseId   | Long          | N        | FK (Course)        |
| question   | Text          | N        | 질문 내용          |
| answer     | Text          | Y        | 답변 내용          |
| answeredAt | LocalDateTime | Y        | 답변 시간          |
| createdAt  | LocalDateTime | N        | 질문 시간          |

### 8.2 연관관계

- User (N:1)
- Course (N:1) -->

---

## 9. CommunityPost (커뮤니티 게시글)

### 9.1 필드

| 필드명         | 타입          | Nullable | 설명                              |
| -------------- | ------------- | -------- | --------------------------------- |
| id             | Long          | N        | PK                                |
| authorId       | Long          | N        | FK (User)                         |
| category       | Enum          | N        | STUDY, PROJECT                    |
| status         | Enum          | N        | RECRUITING, COMPLETED             |
| title          | String        | N        | 제목                              |
| content        | Text          | N        | 내용                              |
| currentMembers | Integer       | N        | 현재 인원                         |
| totalMembers   | Integer       | N        | 모집 인원                         |
| views          | Integer       | N        | 조회수 (기본값 0)                 |
| createdAt      | LocalDateTime | N        | 작성일                            |
| updatedAt      | LocalDateTime | N        | 수정일                            |
| deletedAt      | LocalDateTime | Y        | 삭제일                            |

### 9.2 Enum

```java
public enum CommunityCategory {
    STUDY,    // 스터디
    PROJECT   // 팀 프로젝트
}

public enum RecruitmentStatus {
    RECRUITING,  // 모집중
    COMPLETED    // 모집완료
}
```

### 9.3 연관관계

- User (N:1) - 작성자
- CommunityMember (1:N) - 참여자

---

## 10. CommunityMember (커뮤니티 참여자)

### 10.1 필드

| 필드명   | 타입          | Nullable | 설명                        |
| -------- | ------------- | -------- | --------------------------- |
| id       | Long          | N        | PK                          |
| postId   | Long          | N        | FK (CommunityPost)          |
| userId   | Long          | N        | FK (User)                   |
| role     | Enum          | N        | ORGANIZER, PARTICIPANT      |
| status   | Enum          | N        | PENDING, APPROVED, REJECTED |
| joinedAt | LocalDateTime | N        | 참여 신청일                 |

### 10.2 Enum

```java
public enum MemberRole {
    ORGANIZER,   // 모집자
    PARTICIPANT  // 참여자
}

public enum MemberStatus {
    PENDING,   // 대기중
    APPROVED,  // 승인됨
    REJECTED   // 거절됨
}
```

---

## 11. Chat (채팅방)

### 11.1 필드

| 필드명    | 타입          | Nullable | 설명        |
| --------- | ------------- | -------- | ----------- |
| id        | Long          | N        | PK          |
| name      | String        | N        | 채팅방 이름 |
| createdAt | LocalDateTime | N        | 생성일      |

### 11.2 연관관계

<!-- - ChatParticipant (1:N) - 참여자 -->
- ChatMessage (1:N) - 메시지@

---


## 13. ChatMessage (채팅 메시지)

### 13.1 필드

| 필드명    | 타입          | Nullable | 설명         |
| --------- | ------------- | -------- | ------------ |
| id        | Long          | N        | PK           |
| chatId    | Long          | N        | FK (Chat)    |
| senderId  | Long          | N        | FK (User)    |
| content   | Text          | N        | 메시지 내용  |
| type      | Enum          | N        | TEXT, SYSTEM |
| createdAt | LocalDateTime | N        | 전송 시간    |

### 13.2 Enum

```java
public enum MessageType {
    TEXT,    // 일반 메시지
    SYSTEM   // 시스템 메시지
}
```

---

## 14. CartItem (장바구니 항목)

### 14.1 필드

| 필드명    | 타입          | Nullable | 설명            |
| --------- | ------------- | -------- | --------------- |
| id        | Long          | N        | PK              |
| userId    | Long          | N        | 사용자 ID       |
| courseId  | Long          | N        | 강의 ID         |
| createdAt | LocalDateTime | N        | 장바구니 추가일 |
| updatedAt | LocalDateTime | N        | 수정일          |

- (user_id, course_id) 유니크 제약 조건

### 14.2 연관관계

- User (N:1)
- Course (N:1)

---

## 15. Order (주문)

### 15.1 필드

| 필드명      | 타입          | Nullable | 설명               |
| ----------- | ------------- | -------- | ------------------ |
| id          | Long          | N        | PK                 |
| orderNumber | String        | N        | 주문 번호 (유니크) |
| userId      | Long          | N        | 주문자 ID          |
| totalAmount | int           | N        | 총 금액            |
| status      | OrderStatus   | N        | 주문 상태          |
| createdAt   | LocalDateTime | N        | 주문 생성일        |
| updatedAt   | LocalDateTime | N        | 수정일             |

### 15.2 연관관계

- User (N:1)
- OrderItem (1:N)
- Payment (1:1)

---

## 16. OrderItem (주문 상세 항목)

### 16.1 필드

| 필드명     | 타입          | Nullable | 설명            |
| ---------- | ------------- | -------- | --------------- |
| id         | Long          | N        | PK              |
| orderId    | Long          | N        | 주문 ID         |
| courseId   | Long          | N        | 강의 ID         |
| courseName | String        | N        | 강의명 (스냅샷) |
| price      | int           | N        | 원가            |
| createdAt  | LocalDateTime | N        | 생성일          |
| updatedAt  | LocalDateTime | N        | 수정일          |

### 16.2 연관관계

- Order (N:1)
- Course (N:1)

---

## 17. Payment (결제)

### 17.1 필드

| 필드명      | 타입          | Nullable | 설명                |
| ----------- | ------------- | -------- | ------------------- |
| id          | Long          | N        | PK                  |
| paymentId   | Long          | N        | 결제 식별자 (PG)    |
| orderId     | Long          | N        | 주문 ID             |
| amount      | int           | N        | 결제 금액           |
| status      | PaymentStatus | N        | 결제 상태           |
| portoneData | JSON          | Y        | PortOne 응답 데이터 |
| createdAt   | LocalDateTime | N        | 결제 생성일         |
| updatedAt   | LocalDateTime | N        | 수정일              |

### 17.2 연관관계

- Order (1:1)
- Refund (1:N)

---

## 18. Refund (환불)

### 18.1 필드

| 필드명       | 타입          | Nullable | 설명        |
| ------------ | ------------- | -------- | ----------- |
| id           | Long          | N        | PK          |
| refundId     | String        | N        | 환불 식별자 |
| paymentId    | Long          | N        | 결제 ID     |
| refundAmount | int           | N        | 환불 금액   |
| reason       | String        | Y        | 환불 사유   |
| status       | RefundStatus  | N        | 환불 상태   |
| createdAt    | LocalDateTime | N        | 환불 생성일 |
| updatedAt    | LocalDateTime | N        | 수정일      |

### 18.2 연관관계

- Payment (N:1)

---

## 15. ERD 관계 요약

```
User (1) ─── (N) Course [강사가 생성한 강의]
User (1) ─── (N) Purchase [구매 내역]
User (1) ─── (N) CommunityPost [작성한 게시글]
User (1) ─── (N) Review [작성한 리뷰]
User (1) ─── (N) WatchHistory [시청 기록]
User (1) ─── (N) Cart [장바구니]

Course (1) ─── (N) Section [섹션]
Section (1) ─── (N) Lecture [강의 영상]
Course (1) ─── (N) Review [수강평]
Course (1) ─── (N) CourseQnA [Q&A]

CommunityPost (1) ─── (N) CommunityMember [참여자]

Chat (1) ─── (N) ChatParticipant [참여자]
Chat (1) ─── (N) ChatMessage [메시지]
```
