프로젝트 개요 :
스프링부트 2.1.6  + Vue.js + MSSQL + Mybatis 연동
node 10.16.0 사용
프론트엔드 : vuetifyjs 사용

최초 svn에서 당겨 왔을때 :
네트워크 확인(vpn사용)
maven인스톨 
npm install

프로젝트 생성 : 
https://start.spring.io/ 에서 프로젝트 생성

설정파일은 위치 :
src/main/resources/application.properties
vue 빌드 output위치는 vue.config.js 파일 수정

-실행커맨드(frountend에서 해야함)
npm run serve <= 개발모드 실행
npm run build <= 스프링 부트로 빌드
npm run build시에는 const.js파일에서 HOST_ADDR : '' 으로 변경 필요

-세션에 대하여....
세션은 기본적으로 사용하지 않는다.
세션대신 JWT토큰 사용
현재 JWT토큰의 타임아웃은 1분...운용시에는 15분으로 할 계획
JWT토큰 타임아웃의 만료는 메뉴를 클릭할때마다 연장된다.
추가적으로 연장이 필요할 시에는 store.js의 UPDATE_TOKEN()호출 하면 수동으로 연장가능


todo:
일단 현 PMS를 구현
Log기능 구현중.
신규파일 인식을 못할 경우
vscode에서 f1키 >java 하면 만사 형통


프로젝트에 존재하는 모든 패키지의 버전 업데이트 정보를 확인할 수 있다.
$ npm outdated
Current : 현재 패키지 버전
Wanted : package.json 에 명시한 버전, 혹은 며시한 버전의 조건 중 사용가능 한 최신버전
Latest : 해당 패키지의 배포되는 최신 버전


$ npm update # 업데이트가 필요한 모든 패키지를 업데이트함
$ npm update 패키지명 # 해당 패키지만 업데이트함
