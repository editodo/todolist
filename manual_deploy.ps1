
# manual_deploy.ps1
# 이 스크립트는 번거로운 빌드 과정을 정리하고 확실하게 배포합니다.

Write-Host "1. 클라이언트(Web) 설정 수정..."
# Metro Bundler를 강제하기 위해 webpack 설정 제거 및 패키지 정리
cd client
npm uninstall @expo/webpack-config

Write-Host "2. 확실한 빌드 (Metro)..."
# 최신 Expo(v50)는 Metro가 기본입니다. npx expo export -p web
$env:EXPO_USE_METRO_WORKSPACE_ROOT="1"
npx expo export --platform web

if ($LASTEXITCODE -ne 0) {
    Write-Host "빌드 실패! 로그를 확인하세요." -ForegroundColor Red
    exit
}

Write-Host "3. 서버로 업로드..."
Write-Host "서버 비밀번호를 입력해주세요..." -ForegroundColor Yellow
cd ..
scp -r client/dist/* root@222.239.250.229:/var/www/editodo/web-build/

Write-Host "4. 백엔드 및 DB 최종 업데이트..."
# 이미 준비된 파일들 업로드
scp server/index.js root@222.239.250.229:/var/www/editodo/server/
scp -r server/routes root@222.239.250.229:/var/www/editodo/server/

# DB Schema는 이미 로컬 명령어로 어느정도 해결되었으나 안전하게 한번 더
scp update_schema.sql root@222.239.250.229:/var/www/editodo/
ssh root@222.239.250.229 "mysql -u root -pdbDami79!@ editodo < /var/www/editodo/update_schema.sql"

# 서버 재시작
ssh root@222.239.250.229 "pm2 restart editodo-server"

Write-Host "완료되었습니다! https://editodo.com 에서 확인하세요." -ForegroundColor Green
