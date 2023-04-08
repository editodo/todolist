<template>
  <v-app 
    id="inspire" 
    >
    <!-- mini-variant -->
    <!-- <v-navigation-drawer
      v-model="drawerRight"            
      app
      clipped
      color="#414141"
      right
      width="140"
    >
      <MiniDashboard /> 
    </v-navigation-drawer> -->

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="#414141"      
      dark
    >    
      <!-- <v-card
        flat
        color="#414141"
      >
        <v-list>
          <v-list-item>
            <v-list-item-avatar>              
              <img
                src="@/assets/avatar.png"
                alt="avatar"
              >
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ USER_DATA.EMP_USER_ID }}</v-list-item-title>
              <v-list-item-subtitle>{{ USER_DATA.EMP_NAME }}님 환영합니다.</v-list-item-subtitle>                            
            </v-list-item-content>
          </v-list-item>
        </v-list>        
        <v-card-actions>
          <div class="d-flex justify-space-between">
            <v-btn            
            text
            outlined            
            @click="AccountChangeProc()"
            >
              <v-icon>settings</v-icon>
              계정정보
            </v-btn>
            &nbsp;
            <v-btn                        
              text
              outlined
              @click="LogoutProc()"
            >
              <v-icon>power</v-icon>
              LOGOUT
            </v-btn>
          </div>
          
        </v-card-actions>
      </v-card>
      <v-divider />                 -->
      <SideMenu /><!--사이드 메뉴-->
      <v-divider />   
      <template v-slot:append>
        <div class="pa-2">
          <tokeninfo />
        </div>
      </template>
    </v-navigation-drawer>    
    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
      clipped-right
    >      
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />  
      <v-img        
        contain        
        max-height="30"
        max-width="70"
        src="@/assets/LsLogo_white.png"
        class="p_cursor"   
        style="cursor: pointer;"     
        @click="goHome"           
      />      
      <!--
      <v-img        
        contain        
        max-height="25"
        max-width="200"
        src="@/assets/LsNikkoLogo.png"
      />
      -->
      <v-spacer />
      <v-toolbar-title>
        LS-GPIS
      </v-toolbar-title>      
      <v-spacer />
      <UserInfoMenu />
      <!-- <span
        @click="AccountChangeProc()"
        class="btn"
      >
        <v-icon>
          account_circle
        </v-icon>
        {{ USER_DATA.EMP_USER_ID }}
      </span> -->
      

      &nbsp;&nbsp;&nbsp;
      <v-divider        
        vertical
        inset
      />
      &nbsp;&nbsp;&nbsp;

      <span
        class="btn"
        style="color: #B2C4D8;" 
        @click="LogoutProc()"        
      >
        <v-icon 
          style="color: #B2C4D8;"
         >
          logout
        </v-icon>
        logout
      </span>      
      &nbsp;&nbsp;&nbsp;
      <!-- <v-badge          
        class="align-self-center"
        overlap
        color="red"
      >
        <template v-slot:badge>
          <span>!</span>
        </template>
        <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />      
      </v-badge> -->
      <!-- <v-menu        
        :nudge-width="200"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>apps</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>              
                <img
                  src="@/assets/avatar.png"
                  alt="avatar"
                >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ USER_DATA.EMP_USER_ID }}</v-list-item-title>
                <v-list-item-subtitle>{{ USER_DATA.EMP_NAME }}님 환영합니다.1</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>            
          </v-list>
          <v-card-actions>
            <v-btn            
              block
              text
              outlined
              @click="LogoutProc()"
            >
              <v-icon>power</v-icon>
              LOGOUT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu> -->
    </v-app-bar>

    
    

    <v-main class="mybackground">      
      <v-container
        fluid          
        class="pb-0 mb-0 pt-2"            
      >
        <v-system-bar
          color="rgba(255, 255, 255, 0)"
        >
          <mybreadcrumbs />
        </v-system-bar>
        
        <!-- <router-view
          class="view"
        />                   -->

        <!-- <keep-alive>          
          
        </keep-alive> -->
        <router-view
          class="view"
        />                  
        
        <LoginDlg />
        <!--TODO:권한오류 관련Dlg -->
        <ErrMsg />
        <LoadingDlg />
      </v-container>
    </v-main>    
    <v-footer
      app
      color="#28394B" 
      inset     
    >
      <span class="white--text">&copy; FrameLS 2022</span>
    </v-footer>

    <confirm ref="common_confirm" />  
    <commretmsg ref="commretmsg" />   
    <toastmsg ref="toastmsg" />   

  </v-app>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import SideMenu from '@/components/SideMenu/SideMenu.vue'
import mybreadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.vue'
import tokeninfo from '@/components/tokeninfo/tokeninfo.vue' 
import LoginDlg from '@/components/Dialog/LoginDlg.vue'
import LoadingDlg from '@/components/Dialog/LoadingDlg.vue'
import UserInfoMenu from '@/components/UserInfoMenu/UserInfoMenu.vue'
import ErrMsg from '@/components/ErrMsg/ErrMsg.vue'
//import MiniDashboard from '@/components/MiniDashboard/MiniDashboard.vue'
import confirm from '@/components/Dialog/Confirm.vue'                   //컨펌 다이얼로그
import commretmsg from '@/components/CommResultMsg/CommResultMsg.vue'   //전송 결과 표시 스넥바
import toastmsg from '@/components/CommResultMsg/ToastResultMsg.vue'   //전송 결과 표시 스넥바

  

  export default {
    components: {
      SideMenu,     //권한있는 메뉴를 작성하기 위함  
      mybreadcrumbs,
      LoginDlg,
      LoadingDlg,
      UserInfoMenu,
      ErrMsg,
      tokeninfo,
      //MiniDashboard
      confirm,
      commretmsg,
      toastmsg
    },
    data : ()=>(
      {
        drawer:null,   
        drawerRight:false,     
           
      }
    ),
    computed : {
      ...mapGetters({        
        USER_DATA : 'USER_DATA',    //사용자 정보를 Vuex에서 가져온다.
        CurAuthInfo : 'CurAuthInfo',  
        GET_TimeoutInfo : 'GET_TimeoutInfo' 
      }),

    },    
    mounted(){
      //공통컴포넌트 등록
      
      console.log('Main.mounted');
      //console.log(this.$refs.common_confirm);
      this.$root.$confirm = this.$refs.common_confirm;    //컨펌 다이얼로그를 Root에 등록 한다.
      this.$root.$commretmsg = this.$refs.commretmsg;     //전송 결과 표시 스넥바      
      this.$root.$toastmsg = this.$refs.toastmsg;         //토스트 메시지
    
    },
    
    
    created : function() {   
      console.log('Main.created');

      if(this.USER_DATA.EMP_USER_ID == '')
      {
        this.GET_USER_INFO();       
        this.UPDATE_USER_LIST_INFO(); //사용자 리스트 정보를 가져온다.
      }      

      console.log(this.GET_TimeoutInfo);
    },
    methods : {
      ...mapActions(['LOGOUT', 'GET_USER_INFO', 'UPDATE_USER_LIST_INFO']), 

      //로그아웃 처리 
      LogoutProc : async function () {      
        
        //console.log('LogoutProc');
        //console.log(this.$root.$confirm);

        if (await this.$root.$confirm.open('Confirm', '로그아웃 하시겠습니까??', {color: 'primary'}) == false) return;  

        this.LOGOUT();
        //window.location.href ="/login";
        
        //setTimeout(() => {this.$router.push('/login');}, 5000);
        //this.$router.go();  //reload
        this.$router.push('/login');    //로그인 화면으로 이동한다.
      },
      //계정정보 변경 처리를 한다.
      AccountChangeProc : function() {        
      },
      goHome(){ //홈으로 이동

        
        if(this.$route.path!=='/home') this.$router.push('/home');//화면이동
          
        },
    },
    
  }
</script>

<style>
.Vector1 {
  width: 38.8px;
  height: 19.6px;
  flex-grow: 0;
  margin: 2.4px 10.2px 0 0;
  background-color: #fff;
}

.Vector2 {
  width: 16.3px;
  height: 4.3px;
  flex-grow: 0;
  margin: 0 0 17.7px 32.7px;
  background-color: #e6003e;
}

.logo {
  width: 49px;
  height: 22px;
  flex-grow: 0;
  margin: 0 1552px 0 20px;
}

.mybackground
{
  background-color: #f7f8f9;


}
</style>
