# EdiTodo 아이폰 출시 따라하기 (개인 개발자 계정)

Apple Developer Program에 **개인**으로 가입한 상태에서, 첫 빌드부터 심사 제출까지 순서대로 정리한 문서입니다.
입력할 문구·답변은 [README.md](README.md)에 있고, 이 문서는 "어느 화면에서 무엇을 누르는지"를 다룹니다.

전체 흐름:

1. 애플 로그인 탈퇴용 키 만들기 → GitHub Secrets에 넣기 (서버 설정)
2. 아이폰용 빌드 (`eas build`) — 인증서는 EAS가 자동 생성
3. App Store Connect에 업로드 (`eas submit`) — 앱 등록도 자동
4. TestFlight로 내 아이폰에서 확인
5. App Store 페이지 채우기
6. 심사 제출

---

## 0. 개인 계정이라서 알아둘 점

- **판매자 이름**: App Store에 판매자로 **가입한 본인 실명**(영문)이 표시됩니다. codemodo로 보이게 하려면 나중에 사업자 등록 후 조직 계정으로 전환해야 합니다. 앱과 기록은 그대로 옮겨집니다.
- **저작권 칸**에는 자유롭게 `2026 codemodo`처럼 적을 수 있습니다.
- **유럽연합(EU) 판매 시**: "거래자(Trader) 여부"를 신고해야 하고, 거래자로 신고하면 주소·전화번호가 공개됩니다. 처음에는 **판매 국가를 한국으로만** 하는 것을 추천합니다(5-3단계).
- 무료 앱이라 **유료 앱 계약·세금·은행 정보는 필요 없습니다.**

---

## 1. 애플 로그인 탈퇴용 키 (서버 설정)

애플로 가입한 사용자가 탈퇴하면 애플 쪽 연결도 끊어야 한다는 심사 규정(5.1.1(v))이 있습니다. 이 기능은 이미 만들어져 있고, 키만 넣으면 됩니다.

### 1-1. 키 만들기
1. https://developer.apple.com/account → **Certificates, IDs & Profiles** → 왼쪽 **Keys** → **+** 버튼
2. **Key Name**: `EdiTodo Sign in with Apple`
3. **Sign in with Apple** 체크 → 오른쪽 **Configure** → Primary App ID에서 `com.editodo.app` 선택 → **Save**
   - 목록에 `com.editodo.app`이 없으면 2단계(`eas build`)를 먼저 하고 돌아오세요. 빌드할 때 EAS가 등록합니다.
4. **Continue** → **Register** → **Download**
   - `AuthKey_XXXXXXXXXX.p8` 파일은 **한 번만** 받을 수 있습니다. 안전한 곳에 보관하세요.
5. 화면에 나온 **Key ID**(10자리)를 적어 둡니다.
6. 오른쪽 위 계정 → **Membership details**에서 **Team ID**(10자리)를 적어 둡니다.

### 1-2. GitHub Secrets에 넣기
https://github.com/editodo/todolist/settings/secrets/actions → **New repository secret**을 세 번 눌러 추가합니다.

| 이름 | 값 |
|---|---|
| `APPLE_TEAM_ID` | Team ID |
| `APPLE_KEY_ID` | Key ID |
| `APPLE_PRIVATE_KEY` | .p8 파일 내용을 **한 줄로** 바꾼 것 (아래) |

.p8 파일을 한 줄로 바꿔 복사하기 (PowerShell, 파일이 있는 폴더에서):
```powershell
(Get-Content .\AuthKey_XXXXXXXXXX.p8) -join '\n' | Set-Clipboard
```
→ 그대로 `APPLE_PRIVATE_KEY` 값 칸에 붙여넣기 (`-----BEGIN PRIVATE KEY-----\nMIGT...\n-----END PRIVATE KEY-----` 모양)

다음 main 배포 때 서버 `.env`에 자동으로 들어갑니다. 채팅이나 저장소 파일에는 붙여넣지 마세요.

---

## 2. 아이폰용 빌드

```bash
cd client
eas build -p ios --profile production
```

처음 실행하면 아래를 물어봅니다. 맥이 없어도 됩니다.

| 질문 | 답 |
|---|---|
| Do you want to log in to your Apple account? | **Y** → Apple ID, 비밀번호, 아이폰으로 온 2단계 인증 코드 입력 |
| Select a Team | 본인 이름(Individual) 선택 |
| Bundle identifier `com.editodo.app` 등록 | **Y** (자동 등록) |
| Generate a new Apple Distribution Certificate? | **Y** |
| Generate a new Apple Provisioning Profile? | **Y** |
| Push Notifications key 설정? | **N** (앱은 기기 안에서 울리는 알림만 써서 필요 없음) |

- 애플 로그인(Sign in with Apple) 권한은 `app.json` 설정을 보고 EAS가 자동으로 켭니다.
- 빌드는 클라우드에서 15~30분 걸립니다. 끝나면 expo.dev에 `.ipa`가 생깁니다.
- 실패하면 빌드 페이지 링크를 보내주세요.

---

## 3. App Store Connect에 업로드

```bash
eas submit -p ios --latest
```

| 질문 | 답 |
|---|---|
| Apple 계정 로그인 | 2단계와 같은 계정 |
| App Store Connect에 앱이 없음 → 만들까요? | **Y** → 이름 `EdiTodo`, 언어 Korean, SKU 자동 |

- 이름이 이미 다른 앱에 쓰이고 있다고 나오면, App Store Connect에서 `EdiTodo - 취향저격 투두리스트`로 직접 만들고 다시 실행하세요(5-1단계).
- 업로드 뒤 애플이 빌드를 처리하는 데 **10~30분** 걸립니다. 처리가 끝나면 메일이 옵니다.
- 암호화 질문은 `app.json` 설정(`ITSAppUsesNonExemptEncryption: false`) 덕분에 자동으로 넘어갑니다.

---

## 4. TestFlight로 내 아이폰에서 확인

1. App Store Connect → **나의 앱** → EdiTodo → **TestFlight** 탭
2. 빌드가 "테스트 준비 완료"가 되면 → **내부 테스트** → **+** 그룹 만들기 → 본인 Apple ID 추가
3. 아이폰에서 **TestFlight 앱**(App Store에서 설치) → EdiTodo **설치**

확인할 것:
- [ ] 첫 화면 → 시작하기 → 할 일 추가·체크·삭제
- [ ] 화면 위(노치/다이내믹 아일랜드)와 아래(홈 바)에 글씨가 가려지지 않는지
- [ ] 할 일 입력할 때 키보드가 입력칸을 가리지 않는지
- [ ] 로그인: **Apple**, **Google**, **카카오** 각각
- [ ] 로그인 전 쓴 할 일이 로그인 후에도 남는지
- [ ] 캘린더 스티커, 하루 기록, 다크 모드, 글꼴 변경
- [ ] 알림 허용 → 알림 설정 시간에 울리는지
- [ ] 마이페이지 → 회원 탈퇴 (테스트 계정으로)

이상한 화면은 캡처해서 보내주세요. 화면·로직 수정은 OTA로 바로 보낼 수 있어서(`eas update --channel production`) 다시 빌드할 필요가 없는 경우가 많습니다.

---

## 5. App Store 페이지 채우기

App Store Connect → 나의 앱 → EdiTodo

### 5-1. 앱 정보 (왼쪽 "일반 → 앱 정보")
- 이름, 부제, 카테고리(생산성 / 라이프스타일) — [README.md](README.md) 1·3번
- **연령 등급** → 편집 → 모든 항목 "없음" → 4+ (README 5번)
- **콘텐츠 권한**: "제3자 콘텐츠를 포함하거나 표시합니까?" → **아니요**

### 5-2. 앱 개인정보 보호 (왼쪽 "앱 개인정보 보호")
- 개인정보 처리방침 URL: `https://editodo.com/privacy`
- **시작하기** → 데이터 수집: **예** → README 4번 표대로 체크
  - 각 데이터마다 "용도: 앱 기능", "사용자와 연결: 예(충돌 데이터는 아니요)", "추적: 아니요"
- **게시** 버튼까지 눌러야 반영됩니다

### 5-3. 가격 및 사용 가능 여부 (왼쪽 "가격 및 사용 가능 여부")
- 가격: **무료 (0원)**
- 사용 가능 국가: 처음엔 **대한민국만** 추천 (EU 거래자 신고를 피하고, 스토어 문구가 한국어라서)

### 5-4. 버전 1.0 (왼쪽 "iOS 앱 → 1.0 제출 준비 중")
1. **스크린샷**: iPhone 6.9" 칸에 `screenshots/01_todo.png` ~ `06_picker.png` 끌어다 놓기 (순서대로)
2. **홍보 문구, 설명, 키워드, 지원 URL, 마케팅 URL** — README 3번 복사
3. **빌드**: "빌드 추가" → 3단계에서 올린 빌드 선택
4. **저작권**: `2026 codemodo`
5. **앱 심사 정보**
   - "로그인 필요" **체크 해제**
   - 연락처: 이름, 전화번호, 이메일 `hello@codemodo.kr`
   - 메모: README 6번 영어 메모 복사
6. **버전 출시**: "이 버전을 수동으로 출시" 추천 (심사 통과 후 원하는 때 직접 출시)

---

## 6. 심사 제출

5-4 화면 오른쪽 위 **심사에 추가** → **심사에 제출**

- 보통 **1~2일**, 첫 앱은 조금 더 걸릴 수 있습니다.
- 진행 상황: 심사 대기 → 심사 중 → **출시 대기**(통과) 또는 **거부됨**
- 통과 후 "수동 출시"를 골랐다면 **이 버전 출시** 버튼을 눌러야 App Store에 나옵니다(검색에 뜨기까지 몇 시간).

### 자주 나오는 거부 사유와 대응
| 규정 | 내용 | EdiTodo 상태 |
|---|---|---|
| 4.8 | 구글·카카오 로그인이 있으면 애플 로그인도 있어야 함 | 있음 |
| 5.1.1(v) | 앱 안에서 회원 탈퇴 가능해야 함 + 애플 연결 해제 | 있음 (1단계 키 필요) |
| 5.1.1 | 꼭 필요하지 않으면 가입을 강요하면 안 됨 | 로그인 없이 사용 가능 |
| 2.1 | 심사 중 앱이 멈추거나 안 열림 | TestFlight 확인으로 예방 |
| 2.3 | 스크린샷·설명이 실제 앱과 다름 | 실제 화면으로 만듦 |
| 4.2 | 기능이 너무 단순함 | 할 일·캘린더·일기·테마로 충분할 것으로 판단 |

거부되면 App Store Connect의 **App Review 메시지**를 그대로 보내주세요. 고칠 것과 답장 문구를 정리해 드리겠습니다.

---

## 7. 출시 후

- **화면·문구·로직 수정**: `eas update --channel production --message "내용"` (심사 없이 반영)
- **새 기능에 네이티브 변경이 있을 때**: `app.json`의 `version`을 올리고(예: 1.0.1) 2~6단계 반복 (스크린샷·설명은 그대로 두면 됨)
- **아이폰 홈 화면 위젯**: 지금은 안드로이드만 있습니다. 아이폰 위젯은 별도 작업입니다.
