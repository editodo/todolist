
# deploy_fix.ps1
# 이 스크립트는 클라이언트 빌드 오류를 해결하고 서버에 배포합니다.

Write-Host "1. 기존 설치 파일 제거 중 (Clean-up)..."
Remove-Item -Path "client\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "2. 라이브러리 새로 설치 중 (Installing)..."
cd client
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "설치 중 오류가 발생했습니다." -ForegroundColor Red
    exit
}

Write-Host "3. 웹 버전 빌드 중 (Building)..."
npx expo export --platform web

if ($LASTEXITCODE -ne 0) {
    Write-Host "빌드 중 오류가 발생했습니다." -ForegroundColor Red
    exit
}

Write-Host "4. 서버로 업로드 중 (Uploading)..."
Write-Host "서버 비밀번호를 입력해주세요." -ForegroundColor Yellow
scp -r dist/* root@222.239.250.229:/var/www/editodo/web-build/

Write-Host "완료되었습니다! https://editodo.com 에서 확인해보세요." -ForegroundColor Green
