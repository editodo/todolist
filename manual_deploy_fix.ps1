
# manual_deploy_fix.ps1
# 최종 수정 사항 배포 (DB 설정 fix 포함)

Write-Host "1. .env 설정 업로드 (중요)..."
scp env_production root@222.239.250.229:/var/www/editodo/server/.env

Write-Host "2. 클라이언트(Web) 재빌드..."
cd client
$env:EXPO_USE_METRO_WORKSPACE_ROOT="1"
npx expo export --platform web

Write-Host "3. 클라이언트 업로드..."
cd ..
scp -r client/dist/* root@222.239.250.229:/var/www/editodo/web-build/

Write-Host "4. 백엔드 코드 업로드..."
scp server/index.js root@222.239.250.229:/var/www/editodo/server/
scp -r server/routes root@222.239.250.229:/var/www/editodo/server/
scp server/db.js root@222.239.250.229:/var/www/editodo/server/

Write-Host "5. 서버 재시작..."
ssh root@222.239.250.229 "pm2 restart editodo-server"

Write-Host "배포 완료. 이제 회원가입 및 저장이 되어야 합니다."
