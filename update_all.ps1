
# update_all.ps1
# 서버와 클라이언트의 변경사항을 모두 배포하는 스크립트입니다.

Write-Host "1. 백엔드(Server) 업데이트 중..."
Write-Host "서버 비밀번호를 입력해주세요..." -ForegroundColor Yellow
# scp command to upload server files
scp server/index.js root@222.239.250.229:/var/www/editodo/server/
scp -r server/routes root@222.239.250.229:/var/www/editodo/server/

Write-Host "2. 백엔드 재시작..."
ssh root@222.239.250.229 "pm2 restart editodo-server"

Write-Host "3. 프론트엔드(Client) 빌드 중..."
cd client
npm install
npx expo export --platform web

Write-Host "4. 프론트엔드 업로드 중..."
Write-Host "서버 비밀번호를 입력해주세요..." -ForegroundColor Yellow
# Go back to root for scp
cd ..
scp -r client/dist/* root@222.239.250.229:/var/www/editodo/web-build/

Write-Host "5. 권한 재수정 (안전을 위해)..."
ssh root@222.239.250.229 "chown -R nginx:nginx /var/www/editodo; chmod -R 755 /var/www/editodo"

Write-Host "모든 업데이트가 완료되었습니다!" -ForegroundColor Green
