# Editodo 배포 및 앱 출시 가이드

이 문서는 Editodo 프로젝트를 리눅스 서버에 배포하고, 모바일 앱(Android/iOS)을 스토어에 출시하는 방법을 안내합니다.

## 1. 서버 배포 가이드 (Server Deployment)

제공해주신 서버 정보를 바탕으로 생성된 설정 파일들을 사용하여 배포를 진행합니다.

### 1.1 필수 요구사항 확인
서버(`222.239.250.229`)에 다음 소프트웨어가 설치되어 있어야 합니다.
- **Node.js** (v18 이상 권장)
- **Nginx**
- **MariaDB**
- **PM2** (Node.js 프로세스 관리자: `npm install -g pm2`)

### 1.2 데이터베이스(MariaDB) 설정
1. 생성해드린 `db_setup.sql` 파일을 서버로 업로드합니다.
2. MariaDB에 접속하여 스크립트를 실행합니다. (Root 권한 필요)
   ```bash
   mysql -u root -p < db_setup.sql
   ```
   > **참고**: `dbEdit0d0!@` 비밀번호를 사용하는 `editodo` 유저와 데이터베이스가 생성됩니다.

### 1.3 백엔드(Server) 배포
1. 프로젝트의 `server` 폴더와 `ecosystem.config.js` 파일을 서버의 `/var/www/editodo` 경로로 업로드합니다.
2. 패키지 의존성을 설치합니다.
   ```bash
   cd /var/www/editodo/server
   npm install --production
   ```
3. PM2를 사용하여 서버를 실행합니다.
   ```bash
   cd ..
   pm2 start ecosystem.config.js --env production
   ```

### 1.4 프론트엔드(Web) 배포
1. 로컬 컴퓨터에서 웹용 정적 파일을 빌드합니다.
   ```bash
   cd client
   npm run build
   # 또는
   npx expo export:web
   ```
2. 생성된 `web-build` 폴더 전체를 서버의 `/var/www/editodo/web-build` 경로로 업로드합니다.

### 1.5 Nginx 설정 (도메인 연결)
1. 생성해드린 `nginx.conf` 파일의 내용을 `/etc/nginx/sites-available/editodo` 파일로 저장합니다.
2. 심볼릭 링크를 생성하여 활성화하고 Nginx를 재시작합니다.
   ```bash
   sudo ln -s /etc/nginx/sites-available/editodo /etc/nginx/sites-enabled/
   sudo nginx -t  # 설정 오류 검사
   sudo systemctl restart nginx
   ```
   > 이제 `http://editodo.com` 접속 시 웹이 뜨고, API 요청은 자동으로 백엔드로 전달됩니다.

---

## 2. 모바일 앱 출시 가이드 (App Store Publishing)

Editodo는 React Native(Expo)로 개발되었으므로 `EAS Build`를 사용하여 앱 스토어에 배포합니다.

### 2.1 공통 준비사항
1. **Expo 계정 로그인**:
   ```bash
   eas login
   ```
2. **프로젝트 설정 (`app.json`) 확인**:
   - `android.package`: 예) `com.editodo.app`
   - `ios.bundleIdentifier`: 예) `com.editodo.app`
   - 위 ID는 **유니크**해야 하며, 개발자 콘솔에 등록하는 ID와 일치해야 합니다.

### 2.2 안드로이드 (Google Play Store) 출시

#### 1단계: 구글 개발자 계정 등록
- [Google Play Console](https://play.google.com/console)에 가입하고 등록비($25, 1회)를 결제해야 합니다. (이미 되어 있다고 하심)

#### 2단계: 앱 빌드
명령어를 실행하여 `.aab` (Android App Bundle) 파일을 생성합니다.
```bash
eas build --platform android
```
- 처음 실행 시 Keystore(서명 키) 생성을 물어봅니다. **Yes**를 선택하여 Expo가 자동 관리하게 하는 것을 추천합니다.

#### 3단계: 스토어 업로드
1. 빌드가 완료되면 Expo 대시보드에서 `.aab` 파일을 다운로드합니다.
2. Google Play Console > 앱 만들기 > 프로덕션 (또는 내부 테스트) 트랙 > **새 버전 만들기**
3. 다운로드한 `.aab` 파일을 업로드하고, 앱 정보(스크린샷, 설명 등)를 입력한 후 검토 요청을 보냅니다.

### 2.3 iOS (Apple App Store) 출시

#### 1단계: Apple 개발자 계정 등록
- [Apple Developer Program](https://developer.apple.com/)에 가입해야 합니다. (연 $99)

#### 2단계: 앱 빌드
명령어를 실행하여 `.ipa` 파일을 생성합니다.
```bash
eas build --platform ios
```
- Apple ID 로그인을 요청합니다. 로그인하면 인증서(Certificates)와 프로비저닝 프로필을 **자동으로 생성 및 구성**해 줍니다.

#### 3단계: 스토어 업로드
1. Mac 사용자라면 'Transporter' 앱을 통해 `.ipa` 파일을 App Store Connect로 업로드합니다.
2. [App Store Connect](https://appstoreconnect.apple.com/) 사이트에 접속하여 '나의 앱'을 생성합니다.
3. 업로드된 빌드를 선택하고, 앱 정보(스크린샷, 개인정보취급방침 등)를 입력한 후 심사를 제출합니다.

> **Tip**: 처음 앱을 올릴 때는 심사 거절(Reject)이 될 수 있습니다. 사유를 확인하고 수정하여 재제출하면 됩니다.

---
**문의사항이 있으시면 언제든 말씀해 주세요!**
