import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
//import Axios from 'axios';
//import Main from './views/Main.vue'

Vue.use(Router)

//권한 체크 함수(로그인 안되었으면 로그인 화면으로 이동)
const requireAuth = (menu_id, breadcrumbs) => async(from, to, next) => {
  
  //console.log('requireAuth');
  //console.log('menuId :' + menu_id);

  store.commit('SET_BREADCRUMBS', {breadcrumbs : breadcrumbs});

  //토큰이 없으면 로그인 페이지로
  if (store.getters.accessToken == null) 
  {    
    let TokenInfo = JSON.parse(localStorage.getItem('accessTokenInfo'));    //로컬 스토리지 값을 가져온다.
    //console.log('token');
    //console.log(Token);
    if(TokenInfo == null) return next('/login');      //로컬스토리지에도 토큰이 없다면 로그인창으로 이동    
    
    //await store.dispatch('SET_TOKEN', TokenInfo);  //VUEX에 토큰값을 셋팅한다.    
    await store.dispatch('SET_TOKEN_INFO', TokenInfo);  //VUEX에 토큰값을 셋팅한다.    

    await store.dispatch('GET_AUTH_MENU');     //권한정보를 셋팅한다.
  }

  //await store.dispatch('TOKEN_UPDATE');     //토큰 정보를 업데이트 한다.(시간 갱신)


  //권한이 없으면 로그인 페이지로  
  var auth = store.getters.AUTHMENU.filter((element)=>{return element.MENU_ID == menu_id});

  store.commit('SET_AUTH_INFO', menu_id, 0);  //일단 기본적으로 현재 메뉴에대하여 권한이 없도록 셋팅한다.

  if(menu_id == -1) return next();  //권한따윈 필요 없는 메뉴 ID  

  if(auth.length == 0) return next('/login'); //권한자체가 없는 경우

  if(auth[0].AUTH_LEVEL > 0) {
    store.commit('SET_AUTH_INFO', {"MENU_ID" : menu_id, "AUTH_LEVEL" : auth[0].AUTH_LEVEL }); 
    return next();   //권한이 0 (사용하지 않음) 일경우
  }

  return next('/login');  //ETC...
}

export default new Router({
  mode: 'history',  //히스토리 모드
  routes: [        
    //404에러 페이지
    { 
      path: '*', 
      component: () => import(/* webpackChunkName: "about" */ './views/404.vue')   
    },  
    //로그인 페이지
    {
      path: '/login',
      name : 'Login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
    },
    //메인 페이지
    {
      path: '/',
      name: 'Main',
      //component: Main,
      component: () => import(/* webpackChunkName: "Main" */ './views/Main.vue'),
      //beforeEnter : requireAuth(-1, ['']),    
      redirect: '/home',
      children : [        
        //Home
        {
          path: '/home',
          name: 'Home',          
          component: () => import(/* webpackChunkName: "Home" */ './views/Home.vue'),
          beforeEnter : requireAuth(1, ['Home'])    //로그인 했을때만 진입가능
        },

        //결제관리
        {
          path: '/appr',
          name: 'Appr',          
          component: () => import(/* webpackChunkName: "Appr" */ './views/Appr/Appr.vue'),
          beforeEnter : requireAuth(4, ['Appr'])    //로그인 했을때만 진입가능
        },
        
        //업체별구매리스트
        {
          path: '/companybuylist',
          name: 'CompanyBuyList',          
          component: () => import(/* webpackChunkName: "Appr" */ './views/CompanyBuy/CompanyBuyList.vue'),
          beforeEnter : requireAuth(301, ['구매이력','업체별 구매이력'])    //로그인 했을때만 진입가능
        },
        {
          path: '/companybuylist/:searchText',
          name: 'CompanyBuyList2',          
          component: () => import(/* webpackChunkName: "Appr" */ './views/CompanyBuy/CompanyBuyList.vue'),
          beforeEnter : requireAuth(301, ['구매이력','업체별 구매이력']),
          children : [
            {
              //업체별 구매 상세 조회
              path: '/companybuylist/detail/:cid',
              name: 'CompanyBuyListDetail',
              component: () => import(/* webpackChunkName: "Appr" */ './views/CompanyBuy/CompanyBuyListDetail.vue'),
              beforeEnter : requireAuth(7, ['구매이력', '업체정보 및 구매이력'])  
            }
          ]
        },
        //업체정보
        {
          path: '/companyInfo',
          name: 'CompanyInfo',          
          component: () => import(/* webpackChunkName: "Appr" */ './views/CompanyInfo/CompanyInfo.vue'),
          beforeEnter : requireAuth(301, ['업체정보','업체정보'])    //로그인 했을때만 진입가능
        },
        //업체정보
        {
          path: '/companyInfo/:searchText',
          name: 'CompanyInfo2',          
          component: () => import(/* webpackChunkName: "Appr" */ './views/CompanyInfo/CompanyInfo.vue'),
          beforeEnter : requireAuth(301, ['업체정보','업체정보'])    //로그인 했을때만 진입가능
        },
        //공지사항
        {
          path: '/notice',
          name: 'Notice',          
          component: () => import(/* webpackChunkName: "Notice" */ './views/Notice/Notice.vue'),
          beforeEnter : requireAuth(7, ['게시판', '공지사항']),    //로그인 했을때만 진입가능
          redirect: '/notice/list',
          children : [
            {
              path: '/notice/list/',
              redirect: '/notice/list/1'
            },
            {
              path: '/notice/list/:page',
              name: 'NoticeList',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Notice/List.vue'),
              beforeEnter : requireAuth(7, ['게시판', '공지사항'])    //로그인 했을때만 진입가능              
              
            },
            {
              path: '/notice/write',
              name: 'Noticewrite',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Notice/Write.vue'),
              beforeEnter : requireAuth(7, ['게시판', '공지사항'])    //로그인 했을때만 진입가능              
            },
            {
              //게사물 상세 조회
              path: '/notice/detail/:cid',
              name: 'Noticedetail',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Notice/Detail.vue'),
              beforeEnter : requireAuth(7, ['게시판', '공지사항'])    //로그인 했을때만 진입가능              
            }            
          ]
        },

        //자료실
        {
          path: '/reference',
          name: 'Reference',                  
          component: () => import(/* webpackChunkName: "Notice" */ './views/Refrence/Refrence.vue'),  
          redirect: '/reference/list/1',
          children : [                  
            {
              path: '/reference/list/:page',
              name: 'ReferenceList',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Refrence/List.vue'),
              beforeEnter : requireAuth(8, ['게시판', '자료실'])    //로그인 했을때만 진입가능              
              
            },
            {
              path: '/reference/write',
              name: 'Referencewrite',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Refrence/Write.vue'),
              beforeEnter : requireAuth(8, ['게시판', '자료실'])    //로그인 했을때만 진입가능              
            },
            {
              //게사물 상세 조회
              path: '/reference/detail/:cid',
              name: 'Referencedetail',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Refrence/Detail.vue'),
              beforeEnter : requireAuth(8, ['게시판', '자료실'])    //로그인 했을때만 진입가능              
            }                        
          ]
        },
        //Help
        {
          path: '/help',
          name: 'Help',          
          component: () => import(/* webpackChunkName: "Help" */ './views/Help/Help.vue'),
          beforeEnter : requireAuth(9, ['게시판', 'Help'])    //로그인 했을때만 진입가능
        },

        //Q&A
        {
          path: '/qna',
          name: 'qna',      
          component: () => import(/* webpackChunkName: "Notice" */ './views/Qna/Qna.vue'),
          beforeEnter : requireAuth(10, ['게시판', 'Q&A']),    //로그인 했을때만 진입가능              
          redirect: '/qna/list',
          children : [
            {
              path: '/qna/list/',
              redirect: '/qna/list/1'
            },
            {
              path: '/qna/list/:page',
              name: 'qnaList',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Qna/List.vue'),
              beforeEnter : requireAuth(10, ['게시판', 'Q&A'])    //로그인 했을때만 진입가능              
              
            },
            {
              path: '/qna/write',
              name: 'qnawrite',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Qna/Write.vue'),
              beforeEnter : requireAuth(10, ['게시판', 'Q&A'])    //로그인 했을때만 진입가능              
            },
            {
              //게사물 상세 조회
              path: '/qna/detail/:cid',
              name: 'qnadetail',
              component: () => import(/* webpackChunkName: "Notice" */ './views/Qna/Detail.vue'),
              beforeEnter : requireAuth(10, ['게시판', 'Q&A'])    //로그인 했을때만 진입가능              
            }            
          ]
        },

        //법인별 구매집계
        {
          path: '/BuyStatistics',
          name: 'BuyStatistics',          
          component: () => import(/* webpackChunkName: "Template" */ './views/BuyStatistics/BuyStatistics.vue'),
          beforeEnter : requireAuth(401, ['통계', '법인별 구매집계'])    //로그인 했을때만 진입가능
        },
        //년간 구매집계
        {
          path: '/BuyStatisticsYear',
          name: 'BuyStatisticsYear',          
          component: () => import(/* webpackChunkName: "Template" */ './views/BuyStatisticsYear/BuyStatisticsYear.vue'),
          beforeEnter : requireAuth(402, ['통계', '연간 구매집계'])    //로그인 했을때만 진입가능
        },
        //지역별 구매집계
        {
          path: '/BuyStatisticsCountry',
          name: 'BuyStatisticsCountry',          
          component: () => import(/* webpackChunkName: "Template" */ './views/BuyStatisticsCountry/BuyStatisticsCountry.vue'),
          beforeEnter : requireAuth(403, ['통계', '지역별 구매집계'])    //로그인 했을때만 진입가능
        },
        //분류별 구매집계
        {
          path: '/BuyStatisticsClass',
          name: 'BuyStatisticsClass',          
          component: () => import(/* webpackChunkName: "Template" */ './views/BuyStatisticsClass/BuyStatisticsClass.vue'),
          beforeEnter : requireAuth(404, ['통계', '분류별 구매집계'])    //로그인 했을때만 진입가능
        },
        //Template
        {
          path: '/template',
          name: 'Template',          
          component: () => import(/* webpackChunkName: "Template" */ './views/Template/Template.vue'),
          beforeEnter : requireAuth(22, ['게시판', 'Template'])    //로그인 했을때만 진입가능
        },

        //접속로그
        {
          path: '/uselog',
          name: 'uselog',          
          component: () => import(/* webpackChunkName: "Help" */ './views/useLog/uselog.vue'),
          beforeEnter : requireAuth(15, ['기준정보', 'Log', '접속로그'])    //로그인 했을때만 진입가능

        },
        //에러로그
        {
          path: '/errlog',
          name: 'errlog',          
          component: () => import(/* webpackChunkName: "Help" */ './views/errLog/errlog.vue'),
          beforeEnter : requireAuth(17, ['기준정보', 'Log', '에러로그'])    //로그인 했을때만 진입가능
        },            
        //인터페이스 로그
        {
          path: '/Interface_log',
          name: 'Interface_log',          
          component: () => import(/* webpackChunkName: "Help" */ './views/InterfaceLog/InterfaceLog.vue'),
          beforeEnter : requireAuth(102, ['기준정보', 'Log', '인터페이스 로그'])    //로그인 했을때만 진입가능
        },            
        //사용자 관리
        {
          path: '/usermanage',
          name: 'usermanage',          
          component: () => import(/* webpackChunkName: "Help" */ './views/UserManage/UserManage.vue'),
          beforeEnter : requireAuth(18, ['기준정보', '사용자 관리'])    //로그인 했을때만 진입가능
        },
        //법인 관리
        {
          path: '/Copermanage',
          name: 'Copermanage',          
          component: () => import(/* webpackChunkName: "Help" */ './views/CoperManage/CoperManage.vue'),
          beforeEnter : requireAuth(100, ['기준정보', '법인 관리'])    //로그인 했을때만 진입가능
        },
        //사업장 관리
        {
          path: '/WorkPlacemanage',
          name: 'WorkPlacemanage',          
          component: () => import(/* webpackChunkName: "Help" */ './views/WorkPlaceManage/WorkPlaceManage.vue'),
          beforeEnter : requireAuth(101, ['기준정보', '사업장 관리'])    //로그인 했을때만 진입가능
        },
        //사용자 관리
        {
          path: '/SystemFlag',
          name: 'SystemFlag',          
          component: () => import(/* webpackChunkName: "Help" */ './views/SystemFlag/SystemFlag.vue'),
          beforeEnter : requireAuth(19, ['기준정보', '시스템 코드 관리'])    //로그인 했을때만 진입가능
        },
        //사용자 권한설정
        {
          path: '/adminauth',
          name: 'Adminauth',          
          component: () => import(/* webpackChunkName: "Help" */ './views/Adminauth.vue'),
          beforeEnter : requireAuth(12, ['기준정보', '사용자 권한설정'])    
        },

        //사용자 권한설정(Group)
        {
          path: '/authgroup',
          name: 'Authgroup',          
          component: () => import(/* webpackChunkName: "Help" */ './views/AuthGroup/AuthGroup.vue'),
          beforeEnter : requireAuth(13, ['기준정보', '사용자 권한설정(Grpup)'])    //로그인 했을때만 진입가능
        },
        //메뉴관리
        {
          path: '/menu',
          name: 'menu',    
          component: () => import('./views/menu/Menu.vue'),
          beforeEnter : requireAuth(14, ['기준정보', '메뉴관리'])    //로그인 했을때만 진입가능        
        },
        

      ]
    }
    
  ]
})
