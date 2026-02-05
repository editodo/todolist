
# server_check.ps1
# 서버 상태를 확인하고 권한 문제를 해결하는 스크립트입니다.

Write-Host "1. 서버 파일 및 로그 확인 (Check)..."
Write-Host "비밀번호를 입력해주세요." -ForegroundColor Yellow
ssh root@222.239.250.229 "ls -la /var/www/editodo/web-build; echo '--- ERROR LOG ---'; tail -n 20 /var/log/nginx/error.log"

Write-Host "2. 권한 강제 수정 (Fix Permissions)..."
Write-Host "비밀번호를 다시 한번 입력해주세요." -ForegroundColor Yellow
# Nginx 사용자(www-data)에게 소유권을 넘기고, 권한을 755로 설정
ssh root@222.239.250.229 "chown -R www-data:www-data /var/www/editodo; chmod -R 755 /var/www/editodo; systemctl restart nginx"

Write-Host "완료되었습니다. 브라우저에서 확인해보세요." -ForegroundColor Green
