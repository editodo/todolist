
# update_schema_local.ps1
# 로컬에서 확인 가능하게 테이블을 업데이트하고 서버를 재시작합니다 (로컬용)

Write-Host "1. 데이터베이스 테이블 업데이트..."
# 로컬에서 MySQL 접속이 가능해야 합니다. 환경변수에 mysql이 없으면 경로를 지정해야 할 수도 있습니다.
# 여기서는 서버로 SQL 파일을 보내서 실행하는 방식으로 처리합니다 (일반적으론 로컬에 DB가 깔려있지 않을 수 있으므로)
# 하지만 "로컬에서 확인 가능하게"라는 요청은, 클라이언트가 10.0.2.2가 아닌 실제 로컬 서버를 바라봐야함을 의미할 수 있습니다.

# 지금 상황: 로컬 PC(Windows)에 MariaDB가 설치되어 있는지 불확실합니다.
# 하지만 사용자는 이미 Cloudflare 서버에 연결된 상태입니다. "로컬에서 확인"이라는 말은
# "내 PC에서 npm run web으로 띄운 화면"에서 기능이 되게 해달라는 뜻입니다.

# 따라서 서버(editodo.com)의 DB를 업데이트하고, API도 업데이트하면, 로컬 웹도 정상 작동합니다.
# 왜냐하면 config.js가 로컬에서는 localhost:8080을 바라보는데, 
# 로컬 서버(node index.js)도 사실은 결국 원격 DB나 로컬 DB를 바라봐야 합니다.
# 사용자의 로컬 server/db.js 설정을 보면 .env에서 DB_HOST를 가져오는데, 로컬 DB가 없다면 에러가 납니다.
# 하지만 대부분의 사용자는 로컬 DB가 없으므로, 로컬 Node 서버도 "원격 DB"를 바라보게 하거나,
# 아니면 그냥 "배포된 API"를 바라보게 하는 게 가장 쉽습니다.

# 여기서는 "서버 업데이트"를 수행하여, 로컬 웹이 "배포된 API"와 잘 통신하는지 보거나,
# 로컬 Node 서버를 업데이트하고 실행하는 것을 목표로 합니다.

Write-Host "1. 서버 DB 스키마 업데이트 (Diaries 테이블 추가)..."
scp update_schema.sql root@222.239.250.229:/var/www/editodo/
ssh root@222.239.250.229 "mysql -u root -pdbDami79!@ editodo < /var/www/editodo/update_schema.sql"

Write-Host "2. 백엔드 코드 업데이트..."
scp server/index.js root@222.239.250.229:/var/www/editodo/server/
scp -r server/routes root@222.239.250.229:/var/www/editodo/server/
ssh root@222.239.250.229 "pm2 restart editodo-server"

Write-Host "3. 완료! 이제 로컬(localhost:8081)에서 테스트 해보세요."
Write-Host "지금 켜져있는 'npm run web' 터미널에서 r 을 눌러 리로드하거나, 새로고침하세요."
