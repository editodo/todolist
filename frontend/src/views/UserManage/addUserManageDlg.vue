<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="800"
  >
    <v-card>
      <v-toolbar        
        flat        
        dense             
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
      >
        <v-toolbar-title class="px-0">
          <span class="toolbar_font_size">사용자 추가</span>
        </v-toolbar-title>        
        <v-spacer />
        <v-btn
          icon
          class="title_font_color"
          @click="dlgClose"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-stepper
              v-model="e1"
            >
              <v-stepper-header>
                <v-stepper-step
                  :complete="e1 > 1"
                  editable
                  step="1"
                >
                  사용자 기본정보
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                  :complete="e1 > 2"
                  editable
                  step="2"
                >
                  패스워드 설정
                </v-stepper-step>                
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card height="490px">
                    <v-card-text>
                      <div>
                        <v-flex class="d-flex">
                          <span class="flex-grow-1 px-2">
                            <v-text-field                
                              v-model="UserData.EMP_NO" 
                              :error-messages="EMP_NO_Errors" 
                              label="사번"
                              @input="$v.UserData.EMP_NO.$touch()" 
                              @blur="$v.UserData.EMP_NO.$touch()"                   
                            />
                          </span>
                          <span class="flex-grow-1 pt-3">
                          
                            <!-- <v-select
                              v-model="UserData.CORPORATE_ID"
                              class="pa-0"                
                              label="법인"                              
                              item-text="CORPORATE_NAME"      
                              item-value="CORPORATE_ID"      
                              :items="coperList"
                            />    -->
                            <CSelectBox 
                              v-model="UserData.CORPORATE_ID"
                              class="pa-0"                
                              label="법인"  
                              prepend-icon=""                               
                              item-text="CORPORATE_NAME"      
                              item-value="CORPORATE_ID"      
                              source-url="/Common/CoperList"
                              active-all-item
                              active-all-item-text="기타"
                              active-all-item-down
                            />
                          </span>
                        </v-flex>

                      </div>
                      
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">
                          <v-text-field                
                            v-model="UserData.EMP_USER_ID"   
                            :error-messages="EMP_USER_ID_Errors" 
                            label="Login ID"
                            class="pt-2"
                            @input="UserIdInput"
                            @blur="$v.UserData.EMP_USER_ID.$touch()"                                                                   
                          >
                            <template
                              v-slot:append
                            >
                              <v-btn
                                dense     
                                text    
                                outlined      
                                @click="checkUserID"                 
                              >
                                <v-icon>done</v-icon>
                                중복확인
                              </v-btn>
                            </template>
                          </v-text-field>
                        </span>
                        <span class="flex-grow-1 px-2">
                          <v-text-field                
                            v-model="UserData.EMP_NAME" 
                            :error-messages="EMP_NAME_Errors" 
                            label="사용자명"
                            @input="$v.UserData.EMP_NAME.$touch()" 
                            @blur="$v.UserData.EMP_NAME.$touch()"                   
                          />
                        </span>
                      </v-flex>                                    
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">
                          <v-text-field   
                            v-model="UserData.EMAIL"
                            :error-messages="EMAIL_Errors"                
                            label="E-Mail"     
                            @input="$v.UserData.EMAIL.$touch()"
                            @blur="$v.UserData.EMAIL.$touch()"              
                          />
                        </span>
                      </v-flex>
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">
                          <v-text-field    
                            v-model="UserData.MOBILE"
                            :error-messages="MOBILE_Errors"
                            label="Mobile"                   
                            @input="$v.UserData.MOBILE.$touch()"
                            @blur="$v.UserData.MOBILE.$touch()"
                          />
                        </span>
                        <span class="flex-grow-1 px-2">
                          <v-text-field    
                            v-model="UserData.DEPT_NAME"
                            :error-messages="DEPT_NAME_Errors"
                            label="부서명"                   
                            @input="$v.UserData.DEPT_NAME.$touch()"
                            @blur="$v.UserData.DEPT_NAME.$touch()"
                          />
                        </span>
                      </v-flex>
                      <v-flex 
                        class="d-flex"
                      >
                        <span class="flex-grow-1 px-2">
                          <v-text-field   
                            v-model="UserData.TASK"
                            :error-messages="TASK_Errors"                
                            label="담당업무"     
                            @input="$v.UserData.TASK.$touch()"
                            @blur="$v.UserData.TASK.$touch()"              
                          />
                        </span>
                      </v-flex>
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">                          
                          <v-select
                              v-model="UserData.GROUP_DISP_YN"
                              style="width:200px;"
                              danse
                              class="pa-0"                
                              label="조직현황 여부"      
                              :error-messages="GROUP_DISP_YN_Errors"
                              @input="$v.UserData.GROUP_DISP_YN.$touch()"
                              @blur="$v.UserData.GROUP_DISP_YN.$touch()"              
                              :items="[{text:'Y(사용)',value:'Y'},{text:'N(사용안함)',value:'N'} ]"
                            />                                    
                        </span>
                        <span class="flex-grow-1 px-2">
                          &nbsp;
                        </span>
                      </v-flex>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />            
                      <v-btn
                        color="primary"
                        @click="goNext"
                      >
                        Next
                        <v-icon>
                          arrow_right
                        </v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-card height="300px">
                    <v-card-text>
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">
                          <v-text-field
                            v-model="UserData.PASSWORD"
                            :error-messages="PASSWORD_Errors" 
                            type="password"                
                            label="Password"
                            @input="$v.UserData.PASSWORD.$touch()"
                            @blur="$v.UserData.PASSWORD.$touch()"                   
                          />
                        </span>
                      </v-flex>
                      <v-flex class="d-flex">
                        <span class="flex-grow-1 px-2">
                          <v-text-field       
                            v-model="UserData.CONFIRM_PASSWORD"  
                            :error-messages="CONFIRM_PASSWORD_Errors"        
                            type="password"                
                            label="Confirm Password"
                            @input="$v.UserData.CONFIRM_PASSWORD.$touch()"
                            @blur="$v.UserData.CONFIRM_PASSWORD.$touch()"                   
                          />
                        </span>
                      </v-flex>                      
                      <div style="height:70px;">                      
                      
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />  
                      <v-btn
                        color="primary"
                        @click="Save"
                      >
                        <v-icon>
                          save
                        </v-icon>
                        등록
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>                
      </v-card-text>
      <v-card-actions>
        <v-spacer /> 
        <v-btn
          text
          color="primary"  
          @click="dlgClose"          
        >
          닫기
        </v-btn>        
      </v-card-actions>
    </v-card>        
  </v-dialog>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength, email, sameAs} from 'vuelidate/lib/validators';
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'



export default {
    components: {
      CSelectBox, 
    },
    mixins: [validationMixin],  //에러검증을 위함
    validations: {
      UserData:{
        EMP_NO : {                    //사번 관련
          required,                   //필수값
          maxLength: maxLength(32),   //32자리까지 입력
          minLength: minLength(4)     //최소4자리
        },
        EMP_USER_ID:{
          required,                   //필수값
          maxLength: maxLength(32),   //32자리까지 입력
          minLength: minLength(4)     //최소4자리
        },
        EMP_NAME: {
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(2)     //최소 2자리
        },
        CORPORATE_ID:{
                  //required,                   //필수값
        },
        EMAIL : {
               required,
               email               
        },
        MOBILE : {
               required,                   //필수값
                maxLength: maxLength(32),   //32자리까지 입력
                minLength: minLength(4)     //최소 4자리
        },
        DEPT_NAME : {
          required,                       //필수값
          maxLength: maxLength(50),       //50자리까지 입력
        },
        GROUP_DISP_YN : {
          required,                       //필수값
        },
        TASK : {
          maxLength: maxLength(256),       //256자리까지 입력
        },
        PASSWORD : {
              required,                   //필수값
              maxLength: maxLength(32),   //32자리까지 입력
              minLength: minLength(4)     //최소 4자리
        },
        CONFIRM_PASSWORD : {
              required,                   //필수값
              sameAsPassword: sameAs('PASSWORD')
        },
      }
    },

    data: () => ({
        UserData:{
          EMP_NO :'',    //사번          
          EMP_USER_ID :'',    //로그인ID
          EMP_NAME    :'',    //성명
          CORPORATE_ID : '',  //법인ID
          EMAIL       :'',    //E-Mail
          MOBILE      :'',    //Mobile          
          DEPT_NAME    : '',     //부서명
          GROUP_DISP_YN : '',     //조직현황 여부
          TASK : '',              //담당업무
          PASSWORD : '',          //패스워드
          CONFIRM_PASSWORD : ''   //패스워드 확인
        },
        checkID : false,          //중복체크 여부        
        IsShowDlg : false,        //다이얼로그 표시여부     
        e1 : 1,       
    }),
    computed:{
        EMP_NO_Errors() {             //사번 관련 오류 메시지
          const errors = [];
          //TODO..
          return errors;
        },
        EMP_USER_ID_Errors() {       //로그인 ID관련 오류 메시지
            const errors = [];
            if (!this.$v.UserData.EMP_USER_ID.$dirty) return errors;        
            !this.$v.UserData.EMP_USER_ID.required && errors.push('로그인ID는 필수 항목 입니다.');                
            !this.$v.UserData.EMP_USER_ID.maxLength && errors.push('로그인ID가 너무 깁니다.');        
            !this.$v.UserData.EMP_USER_ID.minLength && errors.push('로그인ID가 너무 짧습니다.');                    
            !this.checkID && errors.push('중복확인 버튼을 눌러주십시요.'); 
            return errors;
        },
        EMP_NAME_Errors() {       //사용자명 관련 오류 메시지
            const errors = [];
            if (!this.$v.UserData.EMP_NAME.$dirty) return errors;        
            !this.$v.UserData.EMP_NAME.required && errors.push('사용자명은 필수 항목 입니다.');                
            !this.$v.UserData.EMP_NAME.maxLength && errors.push('사용자명이 너무 깁니다.');        
            !this.$v.UserData.EMP_NAME.minLength && errors.push('사용자명이 너무 짧습니다.');                    
            return errors;
        },
        CORPORATE_ID_Errors() {
            const errors = [];
            if (!this.$v.UserData.CORPORATE_ID.$dirty) return errors;        

            return errors;
        },
        EMAIL_Errors() {
            const errors = [];
            if (!this.$v.UserData.EMAIL.$dirty) return errors;        
            !this.$v.UserData.EMAIL.required && errors.push('E-Mail은 필수 항목 입니다.');                
            !this.$v.UserData.EMAIL.email && errors.push('E-Mail 형식에 맞지 않습니다.');                    
            return errors;
        },
        MOBILE_Errors() {
            const errors = [];
            if (!this.$v.UserData.MOBILE.$dirty) return errors;        
            !this.$v.UserData.MOBILE.required && errors.push('MOBILE은 필수 항목 입니다.');                
            !this.$v.UserData.MOBILE.maxLength && errors.push('MOBILE이 너무 깁니다.');        
            !this.$v.UserData.MOBILE.minLength && errors.push('MOBILE이 너무 짧습니다.');                    
            return errors;
        },
        DEPT_NAME_Errors() {
            const errors = [];
            if (!this.$v.UserData.DEPT_NAME.$dirty) return errors;        
            !this.$v.UserData.DEPT_NAME.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.DEPT_NAME.maxLength && errors.push('너무 깁니다.');                    
            return errors;
        },

        GROUP_DISP_YN_Errors() {
            const errors = [];
            if (!this.$v.UserData.GROUP_DISP_YN.$dirty) return errors;        
            !this.$v.UserData.GROUP_DISP_YN.required && errors.push('필수 항목 입니다.');                
            return errors;
        },
        TASK_Errors() {
            const errors = [];
           
           //TODO : 담당업무 입력에는 제약 사항 있는지 확인

           return errors;
        },
        PASSWORD_Errors(){
          const errors = [];
            if (!this.$v.UserData.PASSWORD.$dirty) return errors;        
            !this.$v.UserData.PASSWORD.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.PASSWORD.maxLength && errors.push('너무 깁니다.');        
            !this.$v.UserData.PASSWORD.minLength && errors.push('너무 짧습니다.');                    
            return errors;
        },
        CONFIRM_PASSWORD_Errors(){
          const errors = [];
            if (!this.$v.UserData.CONFIRM_PASSWORD.$dirty) return errors;        
            !this.$v.UserData.CONFIRM_PASSWORD.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.CONFIRM_PASSWORD.sameAsPassword && errors.push('패스워드가 일치하지 않습니다.');                    
            return errors;
        },

    },
    created : async function(){    
      
      
    
    },
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(){  //다이얼로그를 출력한다.
        
          //초기화
          this.UserData.EMP_NO = '';
          this.UserData.EMP_USER_ID = '';
          this.UserData.EMP_NAME = '';
          this.UserData.CORPORATE_ID = '';          
          this.UserData.EMAIL = '';
          this.UserData.MOBILE = '';
          this.UserData.DEPT_NAME = '';
          this.UserData.GROUP_DISP_YN = '';   //조직현황 여부
          this.UserData.TASK = '';            //담당업무
          this.UserData.PASSWORD = '';
          this.UserData.CONFIRM_PASSWORD = '';

          this.checkID = false;
          this.e1 = 1;
          this.$v.$reset();                                        

          this.IsShowDlg = true;            
        },
        UserIdInput(){
          this.$v.UserData.EMP_USER_ID.$touch();  
          this.checkID=false;
        },        
        checkUserID(){  //사용자 ID중복 체크를 진행한다.
          axios.post(`${CONST.HOST_ADDR}/usermanage/checkUserID`, this.UserData).then(
            (ret)=>{
                if(ret.data.ret){
                  this.checkID = true;
                }
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                                          
            }
          ); 
        },
        goNext(){

          if(
            this.$v.UserData.EMP_USER_ID.$invalid == false &&
            this.$v.UserData.EMP_NAME.$invalid == false &&
            this.$v.UserData.EMAIL.$invalid == false &&
            this.$v.UserData.MOBILE.$invalid == false &&
            this.$v.UserData.DEPT_NAME.$invalid == false &&
            this.$v.UserData.TASK.$invalid == false &&
            this.$v.UserData.GROUP_DISP_YN.$invalid == false &&
            this.checkID == true)
          {
            this.e1=2;
          }
          else{
              this.$v.UserData.EMAIL.$touch();
              this.$v.UserData.EMP_USER_ID.$touch();
              this.$v.UserData.EMP_NAME.$touch();
              this.$v.UserData.MOBILE.$touch();
              this.$v.UserData.DEPT_NAME.$touch();
              this.$v.UserData.TASK.$touch();
              this.$v.UserData.GROUP_DISP_YN.$touch();
          }          
        },
        async Save(){
          if(this.$v.UserData.$invalid == false)
          {
            if (await this.$root.$confirm.open('Confirm', '등록하시겠습니까??', { color: 'primary' }) == false) return;

            this.dlgClose();  //다이얼로그를 닫는다.
            this.$emit('SaveOK', this.UserData);
          }
          else
          {
            this.$v.UserData.$touch();
          }
        }
    }
}
</script>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>