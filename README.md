# EdiTodo MVP 서비스

취향 기반 개인화 투두리스트 서비스입니다. 사용자의 테마, 색상, 글꼴 선호도를 반영한 맞춤형 투두리스트를 제공합니다.

## 🚀 주요 기능

### 사용자 기능
- **로그인/회원가입**: 일반 회원가입 및 SNS 로그인 (Google, Kakao, Naver)
- **체험판 로그인**: 회원가입 없이 서비스 체험 가능
- **투두리스트 관리**: 할 일 생성, 수정, 삭제, 완료 체크
- **일기 작성**: 날짜별 일기 작성 및 감정 이모지
- **캘린더 뷰**: 월간 캘린더로 투두리스트 확인
- **개인화 설정**: 테마, 색상, 글꼴, 다크모드 설정
- **폰트 커스터마이징**: Google Fonts API 연동, 실시간 폰트 미리보기
- **문의사항 시스템**: 문의 등록, 관리자 답변, 이메일 알림
- **이메일 인증**: 이메일 변경, 비밀번호 찾기, 인증 코드 발송
- **회원탈퇴**: 탈퇴 사유 선택, 데이터 삭제

### 관리자 기능
- **사용자 관리**: 전체 사용자 조회 및 관리
- **공지사항 관리**: 공지사항 작성 및 관리
- **문의사항 관리**: 사용자 문의사항 답변
- **통계 대시보드**: 서비스 사용 통계 확인

## 🛠 기술 스택

### Backend
- **Spring Boot 3.2.0**: Java 17 기반 웹 프레임워크
- **Spring Security**: 인증 및 권한 관리
- **Spring Data JPA**: 데이터베이스 ORM
- **Oracle Cloud ATP**: 클라우드 데이터베이스
- **JWT**: 토큰 기반 인증
- **OAuth2**: SNS 로그인 연동

### Frontend
- **Vue.js 3**: 반응형 프론트엔드 프레임워크
- **Vuex**: 상태 관리
- **Vue Router**: 라우팅
- **Element Plus**: UI 컴포넌트 라이브러리
- **Axios**: HTTP 클라이언트
- **Day.js**: 날짜 처리

## 📁 프로젝트 구조

```
editodo/
├── src/main/java/com/editodo/
│   ├── config/           # 설정 클래스
│   ├── controller/       # REST API 컨트롤러
│   ├── dto/             # 데이터 전송 객체
│   ├── entity/          # JPA 엔티티
│   ├── repository/      # 데이터 접근 계층
│   ├── security/        # 보안 관련 클래스
│   ├── service/         # 비즈니스 로직
│   └── EditodoApplication.java
├── src/main/resources/
│   └── application.yml  # 애플리케이션 설정
├── frontend/            # Vue.js 프론트엔드
│   ├── src/
│   │   ├── api/         # API 통신
│   │   ├── components/  # Vue 컴포넌트
│   │   ├── router/      # 라우팅 설정
│   │   ├── store/       # Vuex 스토어
│   │   └── views/       # 페이지 컴포넌트
│   └── package.json
├── database_schema.sql  # 데이터베이스 스키마
└── README.md
```

## 🗄 데이터베이스 설계

### 주요 테이블
- **users**: 사용자 정보 및 개인화 설정
- **todos**: 투두리스트 데이터
- **diaries**: 일기 데이터
- **user_sns**: SNS 로그인 연동 정보
- **notices**: 공지사항
- **inquiries**: 문의사항

## 🚀 실행 방법

### Windows PowerShell 사용자
```powershell
# PowerShell에서 실행
.\run.ps1
```

### Linux/Mac 사용자
```bash
# 터미널에서 실행
chmod +x run.sh
./run.sh
```

### 수동 실행

#### 1. 데이터베이스 설정
```sql
-- Oracle Cloud ATP에 연결하여 스키마 실행
@database_schema.sql
```

#### 2. Backend 실행
```bash
# 프로젝트 루트 디렉토리에서
mvn spring-boot:run
```

#### 3. Frontend 실행
```bash
# frontend 디렉토리에서
cd frontend
npm install
npm run serve
```

#### 4. 환경 변수 설정
```bash
# application.yml에서 다음 값들을 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
JWT_SECRET=your-jwt-secret-key
```

## 📱 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/demo-login` - 체험판 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 투두리스트
- `GET /api/todos` - 투두리스트 조회
- `POST /api/todos` - 투두 생성
- `PUT /api/todos/{id}` - 투두 수정
- `DELETE /api/todos/{id}` - 투두 삭제
- `PATCH /api/todos/{id}/complete` - 완료 상태 변경

### 사용자 설정
- `PUT /api/users/profile` - 프로필 수정
- `PUT /api/users/password` - 비밀번호 변경

## 🎨 개인화 기능

### 테마 옵션
- **Simple**: 깔끔한 미니멀 디자인
- **Kitsch**: 화려하고 개성 있는 디자인
- **Skitch**: 모던하고 세련된 디자인

### 색상 팔레트
- **Simple**: 기본 색상
- **Warm**: 따뜻한 색상
- **Cool**: 차가운 색상
- **Vibrant**: 생동감 있는 색상

### 모드
- **Light Mode**: 밝은 테마
- **Dark Mode**: 어두운 테마
- **System**: 시스템 설정 따름

## 🔒 보안

- JWT 토큰 기반 인증
- BCrypt 비밀번호 암호화
- CORS 설정
- 입력값 검증
- SQL 인젝션 방지

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 모든 디바이스에서 최적화된 사용자 경험을 제공합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔧 문제 해결

### npm 설치 오류
```bash
# vue3-calendar 패키지 오류 발생 시
npm ERR! notarget No matching version found for vue3-calendar@^1.0.0

# 해결 방법: package.json에서 해당 패키지 제거
# Element Plus의 DatePicker를 사용하도록 변경됨
```

### PowerShell 실행 정책 오류
```powershell
# 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 포트 충돌
```bash
# 8080 포트가 사용 중인 경우
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# 8081 포트가 사용 중인 경우
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### 데이터베이스 연결 오류
```bash
# Oracle Cloud ATP 연결 확인
# application.yml의 datasource 설정 확인
# 방화벽 및 네트워크 설정 확인
```

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
