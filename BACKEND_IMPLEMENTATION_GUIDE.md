# 백엔드 구현 가이드

> 프론트엔드 코드 기반 백엔드 개발 가이드

---

## 1. 기술 스택 권장사항

### 1.1 백엔드 프레임워크
- **Spring Boot 3.x** (Java 17+)
- **Spring Data JPA** (Hibernate)
- **Spring Security** (JWT 인증)
- **Spring Web** (REST API)

### 1.2 데이터베이스
- **PostgreSQL** 또는 **MySQL**
- **Redis** (세션, 캐시)

### 1.3 기타
- **WebSocket** (실시간 채팅)
- **AWS S3** (파일 업로드)
- **Swagger/OpenAPI** (API 문서화)

---

## 2. 프로젝트 구조

```
src/main/java/com/sesac/
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── service/
│   │   │   └── UserService.java
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   └── dto/
│   │       ├── UserRequest.java
│   │       └── UserResponse.java
│   ├── course/
│   ├── community/
│   └── chat/
├── global/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JpaConfig.java
│   │   └── WebSocketConfig.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── CustomException.java
│   └── common/
│       ├── ApiResponse.java
│       └── PageResponse.java
└── SesacApplication.java
```

---

## 3. Entity 구현 예시

### 3.1 User Entity
```java
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    private String avatar;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @OneToMany(mappedBy = "instructor")
    private List<Course> courses = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    private List<Purchase> purchases = new ArrayList<>();
    
    @Builder
    public User(String email, String password, String name, String avatar, UserRole role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.avatar = avatar;
        this.role = role;
    }
    
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}
```

### 3.2 BaseTimeEntity
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseTimeEntity {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

---

## 4. DTO 구현 예시

### 4.1 Request DTO
```java
@Getter
@NoArgsConstructor
public class SignupRequest {
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String password;
    
    @NotBlank(message = "이름은 필수입니다")
    private String name;
}
```

### 4.2 Response DTO
```java
@Getter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String avatar;
    private UserRole role;
    private LocalDateTime createdAt;
    
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
```

---

## 5. Service 구현 예시

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserResponse signup(SignupRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("이미 존재하는 이메일입니다");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // User 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .role(UserRole.USER)
                .build();
        
        User savedUser = userRepository.save(user);
        
        return UserResponse.from(savedUser);
    }
    
    public UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다"));
        
        return UserResponse.from(user);
    }
}
```

---

## 6. Controller 구현 예시

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = userService.getMe(userDetails.getUserId());
        return ApiResponse.success(response);
    }
}
```

---

## 7. 공통 응답 형식

### 7.1 ApiResponse
```java
@Getter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private ErrorResponse error;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }
    
    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(ErrorResponse.of(code, message))
                .build();
    }
}
```

### 7.2 PageResponse
```java
@Getter
@Builder
public class PageResponse<T> {
    private List<T> items;
    private Pagination pagination;
    
    @Getter
    @Builder
    public static class Pagination {
        private int page;
        private int size;
        private long total;
        private int totalPages;
    }
    
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
                .items(page.getContent())
                .pagination(Pagination.builder()
                        .page(page.getNumber() + 1)
                        .size(page.getSize())
                        .total(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .build())
                .build();
    }
}
```

---

## 8. 예외 처리

### 8.1 GlobalExceptionHandler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(e.getStatus())
                .body(ApiResponse.error(e.getCode(), e.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("VALIDATION_ERROR", message));
    }
}
```

---

## 9. JWT 인증 구현

### 9.1 JwtTokenProvider
```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.expiration}")
    private long expirationTime;
    
    public String generateToken(Long userId, String email, UserRole role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);
        
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("email", email)
                .claim("role", role.name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        
        return Long.parseLong(claims.getSubject());
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

---

## 10. WebSocket 구현 (채팅)

### 10.1 WebSocketConfig
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### 10.2 ChatController
```java
@Controller
@RequiredArgsConstructor
public class ChatController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    
    @MessageMapping("/chat/{chatId}")
    public void sendMessage(@DestinationVariable Long chatId, 
                           @Payload ChatMessageRequest request,
                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatMessageResponse response = chatService.sendMessage(chatId, userDetails.getUserId(), request);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);
    }
}
```

---

## 11. 구현 우선순위

### Phase 1: 핵심 기능
1. ✅ User 인증/인가 (회원가입, 로그인, JWT)
2. ✅ Course CRUD (강의 생성, 조회, 수정, 삭제)
3. ✅ Purchase (강의 구매)
4. ✅ Cart (장바구니)

### Phase 2: 학습 기능
5. ✅ Section & Lecture (커리큘럼)
6. ✅ WatchHistory (시청 기록)
7. ✅ Review (수강평)
8. ✅ CourseQnA (Q&A)

### Phase 3: 커뮤니티
9. ✅ CommunityPost (게시글)
10. ✅ CommunityMember (참여자 관리)

### Phase 4: 실시간 기능
11. ✅ Chat (채팅)
12. ✅ WebSocket 구현

### Phase 5: 부가 기능
13. ✅ Search (통합 검색)
14. ✅ File Upload (이미지 업로드)
15. ✅ Payment (결제 연동)

---

## 12. 테스트 전략

### 12.1 Unit Test
- Service 계층 로직 테스트
- JUnit 5 + Mockito 사용

### 12.2 Integration Test
- Repository 테스트
- @DataJpaTest 사용

### 12.3 API Test
- Controller 테스트
- @WebMvcTest 또는 @SpringBootTest 사용

---

## 13. 배포 고려사항

### 13.1 환경 분리
- `application-dev.yml`: 개발 환경
- `application-prod.yml`: 운영 환경

### 13.2 보안
- HTTPS 적용
- CORS 설정
- Rate Limiting
- SQL Injection 방어

### 13.3 성능
- 데이터베이스 인덱스 설정
- N+1 쿼리 방지 (Fetch Join)
- Redis 캐싱
- CDN 활용 (정적 파일)

---

## 14. API 문서화

### 14.1 Swagger 설정
```java
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SeSAC API")
                        .description("온라인 강의 플랫폼 API")
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
```

---

**참고 문서**:
- `BACKEND_API_SPEC.md` - API 명세서 메인
- `BACKEND_ENTITY_DESIGN.md` - Entity 설계
- `BACKEND_API_AUTH_USER.md` - 인증/사용자 API
- `BACKEND_API_COURSES.md` - 강의 API
- `BACKEND_API_COMMUNITY_CHAT.md` - 커뮤니티/채팅 API
