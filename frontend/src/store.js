import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import CONST from './const'

Vue.use(Vuex)

export default new Vuex.Store({
  //state : data의 역할을 한다.
  state: {        
    accessTokenInfo : {       //엑서스토큰 기초정보
      
      accessToken : null,       //jwt토큰(이거 없으면 권한있는 항목들 사용 불가)    
      TIMEOUT_SEC : 0,    //타임아웃 시간(현재 서버에서 받아움)
      TOKEN_FROM_DATETIME : {}, //토큰받은 시간
      TOKEN_END_DATETIME : {},  //토큰만료 시간

    },
    UserData : {
                EMP_NAME:'',  //사용자명
                EMP_USER_ID :'',    //사용자ID
                CORPORATE_ID : '',  //법인코드
                DEPT_NAME : ''      //부서명

              },        
    //메뉴 관련
    MenuList : [],          //전체 메뉴 리스트(권한과는 별도로 사용)
    AuthMenu : [],          //접근가능한 메뉴 리스트[{"AUTH_LEVEL": 4,"MENU_ID": 10}] 접근가능한 메뉴 권한 정보    

    CurAuthInfo : {   //현재 화면에 대한 권한 정보
            MENU_ID  : -1,      //현재 화면의 메뉴ID
            AUTH_LEVEL : 0,     //현재 화면의 권한레벨
    },
    
    breadcrumbs : [],         
    showLoginDlg : true,     //로그인 다이얼로그 관련

    ErrorMsgs : [],   //에러메시지들..

    showloadingCnt : 0,       //로딩바 카운터

    ChcheListItem : {},       //캐쉬 리스트 {'URL':[]}

    UserListInfo : {},        //등록된 사용자 정보 ->ID로 사용자 명칭표현, 또는 업체명 표혐, 부서명 표현 등에 사용한다.

  },

  //state를 변경하기위해서 사용(동기적 동작만 사용 가능): Mutations 이란 Vuex 의 데이터, 즉 state 값을 변경하는 로직
  //인자를 받아 Vuex 에 넘겨줄 수 있고
  //computed 가 아닌 methods 에 등록
  //Mutations 는 동기적 로직을 정의
  mutations: {     
    //토큰정보를 셋팅한다.
    SET_TOKEN_INFO (state, TokenInfo)
    {
      state.accessTokenInfo = TokenInfo;    
    },
    LOGIN (state, TokenInfo) {      

      state.accessTokenInfo.accessToken = TokenInfo.JWTToken;
      state.accessTokenInfo.TIMEOUT_SEC = TokenInfo.JWTTimeoutSec;  //토큰 타임아웃 시간을 지정한다.      
      
      var fromDate = new Date();
      var toDate =  new Date();
      toDate.setSeconds(toDate.getSeconds() + state.accessTokenInfo.TIMEOUT_SEC );
      state.accessTokenInfo.TOKEN_FROM_DATETIME  = fromDate;  //타임아웃 시작시간
      state.accessTokenInfo.TOKEN_END_DATETIME = toDate;      //토큰 만료 시간을 지정한다.      
        
      //localStorage.setItem('accessToken',state.accessToken);  //로컬스토리지에 등록한다.
      localStorage.setItem('accessTokenInfo', JSON.stringify(state.accessTokenInfo));  //로컬스토리지에 등록한다. 토큰정보를 등록한다.
    },
    LOGOUT (state) {
      state.accessTokenInfo.accessToken = null;   //엑세스 토큰을 NULL로
      state.AuthMenu = [];        //메뉴권한 정보를 초기화 한다.      
      //localStorage.clear();       //로컬스토리지를 초기화 한다.
      localStorage.removeItem('accessTokenInfo');
      localStorage.removeItem('accessToken');
    },
    AUTHMENU (state, AuthList) {      
      state.AuthMenu = AuthList;    //권한정보를 넣는다.
    },
    SETMENULIST(state, MenuList){   //메뉴정보를 입력한다.
      state.MenuList = MenuList;    //메뉴정보를 넣는다.      
    },
    SETUSERDATA(state, UserData){   //사용자 정보를 저장한다.
      state.UserData = UserData;
    },
    SETUSERLIST(state, UserListData){   //사용자 리스트 정보를 관리한다.
      state.UserListInfo = UserListData;
    },
    SET_AUTH_INFO(state, payload)  //권한 정보를 저장한다.
    {      
      state.CurAuthInfo.MENU_ID = payload.MENU_ID;    //현재 메뉴ID를 입력
      state.CurAuthInfo.AUTH_LEVEL = payload.AUTH_LEVEL;     //현재 권한 정보를 입력한다.
    },
    TOKEN_CLEAR(state){           //엑서스 토큰을 클리어 한다.
      state.accessTokenInfo.accessToken = null;
      localStorage.setItem('accessToken', null);  //로컬스토리지에 등록한다.

    },
    SET_BREADCRUMBS(state, payload)   //브레드 클램프 설정
    {
      var rtnitem = [];
      for(var i=0;i<payload.breadcrumbs.length;i++)
      {
        rtnitem.push({text:payload.breadcrumbs[i]});
      }
      
      state.breadcrumbs = rtnitem;      
    },
    PUSH_ErrorMsgs(state, payload)  //에러메시지를 등록한다.
    {
      //payload.ErrorMsg
      //payload.color
      state.ErrorMsgs.push(payload);     //맨뒤에 항목 추가 
    },
    SHIFT_ErrorMsgs(state)
    {
      state.ErrorMsgs.shift();  //첫번째 항목 삭제
    },
    Clear_ErrorMsgs(state)        //에러메시지를 클리어 한다.
    {
      state.ErrorMsgs.length = 0;      
    },
    PUSH_SHOW_LOADING_CNT(state)
    {
      state.showloadingCnt = state.showloadingCnt + 1;
    },
    POP_SHOW_LOADING_CNT(state)
    {
      state.showloadingCnt = state.showloadingCnt - 1;
    },
    SET_CHCHE_LIST(state, payload)  //캐쉬 리스트를 등록한다.
    {
      state.ChcheListItem[payload.url] = payload.list;
    }

  },
  //getters : computed역할...사용하기위한 값을 함수의 인자로 안려줘야함...
  getters : { 
    
    accessToken: function(state){ //일반 함수 샘플
      return state.accessTokenInfo.accessToken;
    },
    AUTHMENU : state =>{
      return state.AuthMenu;    //메뉴 권한정보를 바인딩 한다.
    },
    MENULIST : state =>{
      return state.MenuList;    //메뉴정보를 반환한다.
    },
    USER_DATA :state =>{
      return state.UserData;    //사용자 정보를 반환한다.
    },
    CurAuthInfo : state => {    //현재 화면에 대한 권한 정보를 반환한다.
      return state.CurAuthInfo;
    },
    IsWrite : state => {        //현재 메뉴에 쓰기 권한이 있는지 결과를 반환
      if(state.CurAuthInfo.AUTH_LEVEL >= 2) return true;      
      return false;
    },
    IsDelete : state => {     //현재 메뉴에 삭제 권한이 있는지 결과를 반환
      if(state.CurAuthInfo.AUTH_LEVEL >= 3) return true;
      return false;
    },
    Isapproval : state => {     //현재 메뉴에 승인 권한이 있는지 결과를 반환
      if(state.CurAuthInfo.AUTH_LEVEL >= 4) return true;
      return false;
    },
    showLoginDlg : state => {       //로그인 다이얼로그를 보일껀가 말껀가..
      return state.showLoginDlg;
    },
    BREADCRUMBS : state =>{      
      return state.breadcrumbs;
    },
    GET_ErrorMsgs : state =>{      //등록된 에러메시지를 반환한다.
      return state.ErrorMsgs;
    },
    GET_TimeoutInfo : state =>{
              
      // if(state.accessTokenInfo != null )
      // {      
      //   var toDate = new Date(state.accessTokenInfo.TOKEN_END_DATETIME);      
      //   var curDate = new Date();
      //   var currentTime = toDate.getTime() - curDate.getTime();
        
      //   var mm = Math.floor(currentTime/(1000*60));
      //   var ss = Math.floor((currentTime%(1000*60)) / 1000);
      //   var time = mm +":" + ss;
      //   return  time;
      // }
      return state.accessTokenInfo.TOKEN_END_DATETIME;
    },
    GET_SHOW_LOADING_CNT : state =>{
      return state.showloadingCnt;
    },
    GET_CHCHE_LIST : state =>{
      return state.ChcheListItem;
    },
    GET_USER_LIST_INFO : state =>{    //사용자 정보를 가져온다.
      return state.UserListInfo;
    },
    // GET_USER_NAME (state, UserID) {    //사용자 명을 가져온다.
    //   return state.UserListInfo[UserID].EMP_NAME;
    // }
    
  },
  //mutations에서 값을 변경 하지만
  //비동기로 사용할때에는 actions에서 사용한다.
  //비지니스 로직은 actions에서 사용  
  actions: {    
    
    TOKEN_UPDATE({commit}){ //토큰 만료 시간을 업데이트(최신의 토큰을 새로 받아온다)
      
      axios.post(`${CONST.HOST_ADDR}/Frame/TokenUpdate`, {})
      .then((ret)=>{                  
        commit('LOGIN', ret.data);   
        //console.log(ret.data);
      })
      .catch((ex) => {                    
        console.log(ex);
      });
    },
    async GET_AUTH_MENU({commit}){        //메뉴 권한 정보를 받아온다.

      try{
        console.log('GET_AUTH_MENU START');
        let ret = await axios.post(`${CONST.HOST_ADDR}/Frame/GetAuthMenu`, {});
        commit('AUTHMENU', ret.data);    //메뉴 권한정보를 부여한다.
        console.log('GET_AUTH_MENU END');        
      }
      catch(ex)
      {
        console.log(ex);
      }     
    },
    LOGIN ({commit}, loginObj) {      //로그인 액션 {} <=의 의미는 객체형태라는 뜻..      
      
      return new Promise(
              (resolve, reject) => {
                                    axios.post(`${CONST.HOST_ADDR}/Login/SignIn`, loginObj)
                                         .then((ret) => {          
                                            //console.log(ret);
                                            if(ret.data.ret == true)
                                            {                            
                                              //ID와 패스워드가 일치성공 
                                              //commit('LOGIN', ret.data.data.JWTToken);    //토큰정보를 입력한다.
                                              commit('LOGIN', ret.data.data);    //토큰정보를 입력한다.
                                              resolve();
                                            }
                                            else
                                            {
                                              //IC패스워드 불일치                            
                                              reject(ret.data.msg);                                                        
                                            }          
                                          })
                                          .catch((ex) => {                    
                                            reject(ex); //그외 기타 네트워크 에러
                                          });
                                    });

    },
    LOGOUT ({commit}) {
      //console.log('로그아웃 호출');
      commit('LOGOUT');
    },
    async SET_TOKEN({commit}, strToken){  //토큰을 셋팅한다.

      try{              
        let accessTokenInfo = JSON.parse(localStorage.getItem('accessTokenInfo'));    //로컬 스토리지 값을 가져온다.
        //console.log('SET TOKEN');
        //console.log(accessTokenInfo);

        var TokenInfo = {
          JWTToken : strToken,
          JWTTimeoutSec : accessTokenInfo.TIMEOUT_SEC     
          
        }

        await commit('LOGIN', TokenInfo);    //토큰정보를 입력한다.  
        await axios.post(`${CONST.HOST_ADDR}/Frame/CheckToken`, {}); //토큰값이 맞는지 서버에 물어본다.              
      }catch(ex){        
        commit('LOGOUT');    //토큰정보를 삭제한다.
        console.log(ex);
      }      
      //return new Promise((resolve) => {resolve()});
    },
    async SET_TOKEN_INFO({commit}, TokenInfo){
      //console.log('SET_TOKEN_INFO');
      //console.log(TokenInfo);

      await commit('SET_TOKEN_INFO', TokenInfo);    //토큰정보를 저장한다.
    },
    async GET_MENULIST_PROC({commit}){    //메뉴리스트를 가져온다.
      //서버에서 메뉴리스트를 불러온다.
      axios.post(`${CONST.HOST_ADDR}/Frame/GetMenuList`, {})
          .then((ret) => {             
            
            var zeroUndef = function(list){ //자식 리스트가 없다면 leaf노드로 인정
              list.forEach(element => {                  
                  if(element.children.length == 0) {
                      element.children = undefined;
                      return;
                  }
                  zeroUndef(element.children);
              });
            }
            zeroUndef(ret.data);
            commit('SETMENULIST', ret.data);            
        })
        .catch(ex=>{console.log(ex)});    
    },
    async GET_USER_INFO({commit}){    

      //사용자 정보를 가져온다.
      axios.post(`${CONST.HOST_ADDR}/Frame/GET_USER_INFO`, {})
        .then((ret) => {             
          //console.log(ret.data);
          commit('SETUSERDATA', ret.data);            
        })
        .catch(ex=>{console.log(ex)});    
    },
    async UPDATE_USER_LIST_INFO({commit})   //사용자 리스트 정보를 DB에서 가져와서 업데이트 한다.
    {
      axios.post(`${CONST.HOST_ADDR}/Frame/selectUserBaseInfoList`, {})
        .then((ret) => {             
          
          var tempUserList = [];

          for(let i=0; i<ret.data.length; i++ )
          {
            tempUserList[ret.data[i].EMP_USER_ID] = ret.data[i];
          }

          commit('SETUSERLIST', tempUserList);            
        })
        .catch(ex=>{console.log(ex)});    

    }
  }
})
