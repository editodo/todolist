# EdiTodo MVP 서비스 시작 스크립트 (Windows PowerShell)
Write-Host "🚀 EdiTodo MVP 서비스 시작하기" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Java 버전 확인
Write-Host "📋 Java 버전 확인 중..." -ForegroundColor Yellow
try {
    java -version
    Write-Host "✅ Java가 설치되어 있습니다." -ForegroundColor Green
} catch {
    Write-Host "❌ Java가 설치되어 있지 않습니다. Java 17 이상을 설치해주세요." -ForegroundColor Red
    exit 1
}

# Node.js 버전 확인
Write-Host "📋 Node.js 버전 확인 중..." -ForegroundColor Yellow
try {
    node --version
    Write-Host "✅ Node.js가 설치되어 있습니다." -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js가 설치되어 있지 않습니다. Node.js를 설치해주세요." -ForegroundColor Red
    exit 1
}

# Maven 확인
Write-Host "📋 Maven 확인 중..." -ForegroundColor Yellow
try {
    mvn --version
    Write-Host "✅ Maven이 설치되어 있습니다." -ForegroundColor Green
} catch {
    Write-Host "❌ Maven이 설치되어 있지 않습니다. Maven을 설치해주세요." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ 필수 도구들이 모두 설치되어 있습니다." -ForegroundColor Green
Write-Host ""

# Backend 실행
Write-Host "🔧 Spring Boot Backend 시작 중..." -ForegroundColor Cyan
Write-Host "📝 포트: 8080" -ForegroundColor White
Write-Host "📝 API 경로: http://localhost:8080/api" -ForegroundColor White
Write-Host ""

# 새 PowerShell 창에서 Backend 실행
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# 잠시 대기
Start-Sleep -Seconds 3

# Frontend 실행
Write-Host "🎨 Vue.js Frontend 시작 중..." -ForegroundColor Cyan
Write-Host "📝 포트: 8081" -ForegroundColor White
Write-Host "📝 접속 URL: http://localhost:8081" -ForegroundColor White
Write-Host ""

# Frontend 디렉토리로 이동
Set-Location frontend

# 의존성 설치 확인
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Frontend 의존성 설치 중..." -ForegroundColor Yellow
    npm install
}

# Frontend 실행
Write-Host "🚀 Frontend 서버 시작..." -ForegroundColor Cyan
npm run serve

Write-Host ""
Write-Host "🎉 EdiTodo MVP 서비스가 성공적으로 시작되었습니다!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:8081" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host ""
Write-Host "💡 체험판 로그인으로 바로 서비스를 체험해보세요!" -ForegroundColor Yellow
