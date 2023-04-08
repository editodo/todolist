
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'           
import vuetify from './plugins/vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import moment from "moment";
import VueMomentJS from "vue-momentjs"
import common from './common'
import './theme/default.sass'

import './assets/css/common/common.css'
import './assets/css/common/component.css'


Vue.config.productionTip = false;

Vue.prototype.$http = axios;    //vue에서 axios를 전역으로 사용하기 위해 등록

const options = { name: 'lodash1' , lodash: lodash } // customize the way you want to call it
Vue.use(VueLodash, options) // options is optional
Vue.use(VueMomentJS, moment);
Vue.use(common);

//컴마 필터 전역 등록
Vue.filter("makeComma", val =>{
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

//소수점 제거 전역필터
Vue.filter("deleteDecPoint", val =>{
  var str = String(val);
  var pos1 = str.indexOf('.');
  if(pos1 == -1) return str;
  return str.substr(0, pos1);
});


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


//결과에 대한 인터셉터
axios.interceptors.response.use(
  //정상적인 결과
  function (response) {  
    
    store.commit('POP_SHOW_LOADING_CNT');         //로딩바 카운트를 줄인다.


    
    return response;
  }, 
  //에러인 경우
  function (error) {      

    store.commit('POP_SHOW_LOADING_CNT');         //로딩바 카운트를 줄인다.

    if (error.response) {
      console.log('error.response!!!!!!!!!!');
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      //권한 오류라면 로그인 화면으로 이동한다.
      if(error.response.status === 401 && 
        store.getters.accessToken !== null)   { 
          
          store.commit('PUSH_ErrorMsgs', {ErrorMsg : '권한이 없습니다.', color : 'info'});         

          store.commit('TOKEN_CLEAR');  //토큰을 클리어 시킨다.      
      }      
    } else if (error.request) {
      console.log('error.request!!!!!!!!!!');
      console.log('서버에서 응답이 없습니다.');

      store.commit('PUSH_ErrorMsgs', {ErrorMsg : '서버의 응답이 없습니다.', color : 'info'});         
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);    
      
    } else {
      store.commit('PUSH_ErrorMsgs', {ErrorMsg : '시스템 오류!!!', color : 'info'});         

      console.log('error.else !!!!!!!!!!');
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);      
    }

  console.log(error.config);
  
  return Promise.reject(error);
});

//request interceptor
axios.interceptors.request.use(function (config) {  
  
  store.commit('PUSH_SHOW_LOADING_CNT');         //로딩바 카운트를 +1


  config.headers.common['X-Auth-Token'] = store.getters.accessToken;  //토큰해더 추가

  return config;
}, function (error) {
  // Do something with request error
  console.log('리퀘스트 에러!!!!');

  store.commit('POP_SHOW_LOADING_CNT');         //로딩바 카운트를 줄인다.

  return Promise.reject(error);
});


//Axios.defaults.headers.common['X-Auth-Token'] = 'test';
//axios설정 끝
