#!/bin/bash

echo "🚀 EdiTodo MVP 서비스 시작하기"
echo "================================"

# Java 버전 확인
echo "📋 Java 버전 확인 중..."
java -version
if [ $? -ne 0 ]; then
    echo "❌ Java가 설치되어 있지 않습니다. Java 17 이상을 설치해주세요."
    exit 1
fi

# Node.js 버전 확인
echo "📋 Node.js 버전 확인 중..."
node --version
if [ $? -ne 0 ]; then
    echo "❌ Node.js가 설치되어 있지 않습니다. Node.js를 설치해주세요."
    exit 1
fi

# Maven 확인
echo "📋 Maven 확인 중..."
mvn --version
if [ $? -ne 0 ]; then
    echo "❌ Maven이 설치되어 있지 않습니다. Maven을 설치해주세요."
    exit 1
fi

echo ""
echo "✅ 필수 도구들이 모두 설치되어 있습니다."
echo ""

# Backend 실행
echo "🔧 Spring Boot Backend 시작 중..."
echo "📝 포트: 8080"
echo "📝 API 경로: http://localhost:8080/api"
echo ""

# 새 터미널에서 Backend 실행
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start cmd /k "mvn spring-boot:run"
else
    # Linux/Mac
    gnome-terminal -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
    xterm -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
    konsole --new-tab -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
    echo "⚠️  새 터미널을 열어서 다음 명령어를 실행하세요: mvn spring-boot:run"
fi

# 잠시 대기
sleep 3

# Frontend 실행
echo "🎨 Vue.js Frontend 시작 중..."
echo "📝 포트: 8081"
echo "📝 접속 URL: http://localhost:8081"
echo ""

cd frontend

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 Frontend 의존성 설치 중..."
    npm install
fi

# Frontend 실행
echo "🚀 Frontend 서버 시작..."
npm run serve

echo ""
echo "🎉 EdiTodo MVP 서비스가 성공적으로 시작되었습니다!"
echo "📱 Frontend: http://localhost:8081"
echo "🔧 Backend API: http://localhost:8080/api"
echo ""
echo "💡 체험판 로그인으로 바로 서비스를 체험해보세요!"
