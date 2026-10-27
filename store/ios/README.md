# EdiTodo — App Store 제출 자료

App Store Connect(https://appstoreconnect.apple.com)에 그대로 옮겨 쓸 수 있게 정리한 자료입니다.

**처음부터 단계별로 따라 하려면 [REGISTER.md](REGISTER.md)를 보세요.** 이 문서는 칸에 넣을 문구·답변 모음입니다.

## 1. 앱 정보 (처음 앱을 만들 때)

| 항목 | 값 |
|---|---|
| 플랫폼 | iOS |
| 이름 | EdiTodo - 취향저격 투두리스트 |
| 기본 언어 | 한국어 |
| 번들 ID | `com.editodo.app` |
| SKU | `editodo-ios` (아무 값이나 고유하면 됨) |
| 카테고리 | 기본: **생산성**, 보조: 라이프스타일 |
| 연령 등급 | 4+ (아래 설문 답변 참고) |

## 2. 스크린샷 (이 폴더)

| App Store Connect 칸 | 파일 | 규격 |
|---|---|---|
| iPhone 6.9" 디스플레이 | `screenshots/01_todo.png` ~ `06_picker.png` | 1320×2868, 6장 |

- 6.9" 스크린샷만 올리면 작은 아이폰 크기는 자동으로 줄여서 씁니다.
- iPad는 지원하지 않으므로(`supportsTablet: false`) iPad 스크린샷은 필요 없습니다.
- 앱 아이콘은 빌드에 들어 있는 아이콘이 자동으로 쓰입니다.

## 3. 버전 정보 (1.0)

**부제** (30자 이내)
```
할 일 체크와 하루 기록을 한 곳에서
```

**홍보 문구** (170자 이내, 심사 없이 언제든 수정 가능)
```
가입 없이 바로 시작하는 나만의 투두리스트. 할 일은 가볍게 체크하고, 하루는 스티커와 한 줄 일기로 남겨 보세요.
```

**설명** (4000자 이내)
```
취향대로 꾸미는 나만의 투두리스트, EdiTodo

할 일을 적고, 체크하고, 하루를 기록하세요.
테마와 색상, 글꼴까지 내 마음대로 고를 수 있어요.

■ 가볍게 쓰는 할 일 목록
• 체크하면 줄이 그어지고, 글자를 누르면 바로 수정
• ✕를 누르면 삭제, 실수했다면 '되돌리기'로 복구
• 매일 / 평일 / 매주 반복되는 할 일
• 지난 날 못 한 일은 버튼 하나로 오늘로 가져오기

■ 스티커로 보는 나의 한 달
• 하루를 기록하면 캘린더에 그날의 기분 스티커가 붙어요
• 날짜를 누르면 그날 할 일을 바로 확인하고 체크
• 연도·월 선택으로 지난 기록도 빠르게 찾아보기

■ 하루 기록 (한 줄 일기)
• 오늘 완료한 할 일을 버튼 하나로 불러와 일기에 넣기
• 목록·시간 넣기 등 간단한 편집 기능
• 16가지 기분 스티커로 하루 요약

■ 취향대로 꾸미기
• 라이트 / 다크 / 시스템 모드
• 심플·라운드·스케치·키치 4가지 스타일
• 심플·민초·레몬·그린·핑키 5가지 색상
• 글꼴 변경, 한국어 / English

■ 편리한 기능
• 가입 없이 바로 시작하고, 로그인하면 지금까지의 기록이 그대로 백업·동기화
• 인터넷이 없어도 할 일 보기·체크 (연결되면 자동 저장)
• 할 일 알림: 정해진 시간에 오늘 할 일을 알려드려요
• 카카오 / Google / Apple 계정으로 간편 로그인
• 휴대폰과 웹(editodo.com)에서 같은 기록 사용

문의: hello@codemodo.kr
```

**키워드** (100자 이내, 쉼표로 구분, 띄어쓰기 없이)
```
투두,할일,투두리스트,체크리스트,플래너,일기,다이어리,캘린더,습관,루틴,메모,일정,스티커,todo
```

**지원 URL**: https://www.codemodo.kr
**마케팅 URL** (선택): https://editodo.com
**저작권**: 2026 codemodo
**새로운 기능** (첫 버전은 비워 두어도 됨)

## 4. 앱 개인정보 보호 (App Privacy)

**"이 앱에서 데이터를 수집합니까?" → 예**

| 데이터 유형 | 용도 | 사용자와 연결 | 추적 |
|---|---|---|---|
| 연락처 정보 → 이메일 주소 | 앱 기능 | 예 | 아니요 |
| 연락처 정보 → 이름 (닉네임, SNS 이름) | 앱 기능 | 예 | 아니요 |
| 식별자 → 사용자 ID (아이디, SNS 식별자) | 앱 기능 | 예 | 아니요 |
| 사용자 콘텐츠 → 기타 사용자 콘텐츠 (할 일, 하루 기록) | 앱 기능 | 예 | 아니요 |
| 진단 → 충돌 데이터 (Sentry) | 앱 기능 | 아니요 | 아니요 |

- 광고, 추적(다른 회사 앱·웹사이트와 데이터를 엮는 것) 없음 → **추적: 모두 아니요**
- 개인정보 처리방침 URL: https://editodo.com/privacy

## 5. 연령 등급 설문

폭력, 성적 콘텐츠, 욕설, 약물, 도박, 공포 등 **모든 항목 "없음"**, 사용자 제작 콘텐츠의 공개 공유 없음, 웹 브라우징 없음 → **4+**

## 6. 앱 심사 정보 (Review Notes)

**로그인 정보**: "로그인 필요" 체크 해제 (로그인 없이 모든 기능 사용 가능)

**메모** (심사 담당자에게 전달)
```
EdiTodo can be used without an account: tap "취향저격 투두리스트 시작하기" on the first screen.

- Sign in with Apple, Google and Kakao are on the login screen (My Page > 로그인/회원가입).
- Logging in moves the records made without an account into that account.
- Account deletion: My Page (마이페이지) > 회원 탈퇴 at the bottom. It deletes the account and all data immediately
  and revokes Sign in with Apple. Web page: https://editodo.com/delete-account
- No ads, no in-app purchases, no tracking.
```

**연락처**: 이름·전화번호·이메일(hello@codemodo.kr)은 직접 입력

## 7. 수출 규정 (암호화)

`app.json`에 `ITSAppUsesNonExemptEncryption: false`가 들어 있어 빌드를 올릴 때 따로 묻지 않습니다. 표준 HTTPS만 사용합니다.

## 8. 빌드와 제출

```bash
cd client
eas build -p ios --profile production   # 처음에 Apple 계정 로그인, 인증서·프로비저닝은 EAS가 생성
eas submit -p ios                       # App Store Connect로 업로드 → TestFlight에 표시
```

1. TestFlight에서 본인 아이폰에 설치해 확인: 로그인(카카오·Google·Apple), 키보드, 화면 위아래 여백(노치), 알림, 다크 모드
2. App Store Connect → 앱 → 1.0 버전에 빌드를 고르고 **심사에 제출**
3. 심사는 보통 1~2일. 반려되면 사유를 보고 고친 뒤 다시 제출

## 9. 제출 전 남은 일

- [ ] Apple Developer Program 가입 ($99/년)
- [ ] App Store Connect에 앱 만들기 (위 1번)
- [ ] 애플 로그인 탈퇴용 키를 GitHub Secrets에 넣기: `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`
  (만드는 법은 REGISTER.md 1단계. 다음 배포 때 서버 `.env`에 자동으로 들어감)
- [ ] `eas build -p ios` → `eas submit -p ios` → TestFlight로 실기기 확인
- [ ] 위 2~7번 입력 후 심사 제출
