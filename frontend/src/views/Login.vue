<template>
  <v-app id="inspire">
    <v-app-bar
      app
      dark
      color="primary"
    >    
      <v-img        
        contain        
        max-height="25"
        max-width="60"
        src="@/assets/LsLogo_white.png"
      />
      <v-spacer />
      <v-toolbar-title>
        LS-GPIS
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md3
          >            
            <v-card class="elevation-12">              
              <!--v-toolbar
                color="secondary"
                dark                
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer />                
              </v-toolbar-->
              <div style="height:150px; width:100%; align-items: center; justify-content: center;display: flex;">
                <v-img        
                  contain
                  max-height="50"
                  max-width="100"
                  src="@/assets/LsLogo.png"
                />
              </div>
              <v-card-text>
                <v-form>
                  <v-col
                    xs12
                    sm8
                    md11
                  >
                    <v-text-field
                      v-model="LoginData.userID"
                      :error-messages="userIDErrors"
                      label="아이디"
                      name="login"
                      prepend-icon="person"
                      type="text"
                      @input="$v.LoginData.userID.$touch()"
                      @blur="$v.LoginData.userID.$touch()"
                    />
                  <v-text-field
                    id="password"
                    v-model="LoginData.Password"
                    :error-messages="passErrors"
                    label="비밀번호"
                    name="password"
                    prepend-icon="lock"
                    type="password"                         
                    @keyup.enter="loginProc"
                    @input="$v.LoginData.Password.$touch()"
                    @blur="$v.LoginData.Password.$touch()"
                  />
                  <v-checkbox
                    v-model="SaveIDInfo.SaveIDCheck"
                    label="아이디 저장"
                  />
                  </v-col>
                </v-form>

                <v-snackbar
                  v-model="ErrorMsg.snackbar"      
                  :timeout="3000"      
                  top
                  color="info"
                >
                  {{ ErrorMsg.Msg }}
                  <!-- <v-btn                    
                    text                    
                    @click="ErrorMsg.snackbar = false"
                  >
                    Close
                  </v-btn> -->
                  <template v-slot:action="{ attrs }">
                    <v-btn
                      dark
                      text
                      v-bind="attrs"
                      @click="ErrorMsg.snackbar = false"
                      >
                        Close
                      </v-btn>
                    </template>
                </v-snackbar>
              </v-card-text>
              
              <v-card-actions>
                <v-col
                  xs12
                  sm8
                  md12
                >   
                  <v-btn
                    color="primary"
                    width="100%"
                    @click="loginProc"
                  >
                    Login
                  </v-btn>                  
                  <!--v-btn block
                    width="100%"
                    @click="loginProc"
                  >
                    비밀번호초기화
                  </v-btn-->
                </v-col>     
              </v-card-actions>
              <div style="height:30px; width:100%; align-items: center; justify-content: center;display: flex;" />              
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>

    <v-footer
      app
      color="secondary"      
    >
      <!--span class="white--text">&blank;</span-->
      <span>&blank;</span>
    </v-footer>
  </v-app>
</template>

<script>

//<!--span class="white--text">&copy; Designed By Woo 2019</span-->
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength} from 'vuelidate/lib/validators';
import {mapState, mapActions, mapMutations} from 'vuex';

export default {    
    components: {
  
    },    
    mixins: [validationMixin],  //에러검증을 위함
    validations: {
      //로그인데이터 에러검증
      LoginData : {
          userID: { 
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(4)     //최소패스워드 4자리
                  },
          Password: {
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(4)     //최소패스워드 4자리
            },
      },
      
    },
  
    data : ()=>(
      {
        LoginData : {
          userID: '',     //사용자ID
          Password : ''   //패스워드
        },
        ErrorMsg : {
          snackbar : false,
          Msg : ''
        },
        SaveIDInfo : {
          SaveIDCheck : false,
          SaveUserID : ''
        }

      }
    ),
    computed :{          
      ...mapState(['accessToken']),
      userIDErrors() {        
        const errors = [];
        if (!this.$v.LoginData.userID.$dirty) return errors;        
        !this.$v.LoginData.userID.maxLength && errors.push('ID가 너무 깁니다.');        
        !this.$v.LoginData.userID.minLength && errors.push('ID가 너무 짧습니다.');        
        !this.$v.LoginData.userID.required && errors.push('ID는 필수 항목 입니다.');                
        return errors;
      },
      passErrors() {  //패스워드 에러
        const errors = [];
        if (!this.$v.LoginData.Password.$dirty) return errors;
        !this.$v.LoginData.Password.maxLength && errors.push('패스워드가 너무 깁니다.');
        !this.$v.LoginData.Password.minLength && errors.push('패스워드가 너무 짧습니다.');
        !this.$v.LoginData.Password.required && errors.push('패스워드는 필수 항목 입니다.');
        return errors;
      },
      loginDataError(){   //로그인 데이터에 에러 메시지를 반환한다.        
        if(this.userIDErrors.length != 0) return this.userIDErrors[0];
        if(this.passErrors.length != 0) return this.passErrors[0];

        return '';  //에러없씸!!!
      }
    },
      created : function(){
      
      //로컬세션의 아이디 저장 정보를 가져온다.
      let IDInfo = JSON.parse(localStorage.getItem('SaveIDInfo'));
      if(IDInfo != null)
      {
        //아이디 저장 정보를 바인딩 한다.
        this.SaveIDInfo = IDInfo;        
      }

      //체크 되어 있다면 아이디를 화면에 입력한다.
      if(this.SaveIDInfo.SaveIDCheck)
      {
        this.LoginData.userID = this.SaveIDInfo.SaveUserID;
      }

    },
    methods: {        
        ...mapActions(['LOGIN', 'GET_AUTH_MENU', 'GET_USER_INFO']), 
        ...mapMutations(['Clear_ErrorMsgs']),                
        async loginProc()    /*로그인 처리를 한다.*/
        {                     
          if(this.$v.LoginData.$invalid == true)
          {
            //에러일경우 에러 메시지를 출격한다.
            this.ErrorMsg.Msg = this.loginDataError;                
            this.ErrorMsg.snackbar = true;            
            return;
          }

          try{
            await this.LOGIN(this.LoginData);   //로그인 처리(토큰을 가져온다)                        
            await this.GET_AUTH_MENU();         //메뉴권한정보를 가져온다.            
            await this.GET_USER_INFO();         //사용자 정보를 가져온다.
            this.Clear_ErrorMsgs();             //에러메시지를 삭제한다.

            //아이디 저장 관련 데이터를 저장한다.
            if(this.SaveIDInfo.SaveIDCheck == true)
            {
              this.SaveIDInfo.SaveUserID = this.LoginData.userID;  //사용자 정보 저장              
            }
            else
            {
              this.SaveIDInfo.SaveUserID = '';
            }
            localStorage.setItem('SaveIDInfo', JSON.stringify(this.SaveIDInfo));  //로컬세션에 저장한다.

            this.$router.push('/home');         //메인(홈)으로 이동
          }
          catch(ex)
          {
           this.ErrorMsg.Msg = ex;
           this.ErrorMsg.snackbar = true;            
          }
        },        
    }

  }

</script>




