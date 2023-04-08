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
          <span class="toolbar_font_size">사용자 수정</span>
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
        <div>
          &nbsp;
        </div>
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
              <CSelectBox 
                v-model="UserData.CORPORATE_ID"
                class="pa-0"                
                label="법인"  
                prepend-icon=""                               
                item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"     
                active-all-item
                active-all-item-text="기타" 
                active-all-item-down
                source-url="/Common/CoperList"
              />
            </span>
          </v-flex>

          <v-flex class="d-flex">
            <span class="flex-grow-1 px-2">
              <v-text-field                
                v-model="UserData.EMP_USER_ID"   
                readonly
                label="Login ID"                
              >                          
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
                v-model="UserData.TEL_NO"
                :error-messages="TEL_NO_Errors"
                label="Mobile"                   
                @input="$v.UserData.TEL_NO.$touch()"
                @blur="$v.UserData.TEL_NO.$touch()"
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
          <v-flex 
            class="d-flex"
            >
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
                <v-select
                  v-model="UserData.ACTV"
                  style="width:200px;"
                  danse
                  class="pa-0"                
                  label="사용여부"                    
                  :items="[{text:'Y(활성)',value:'Y'},{text:'N(비활성)',value:'N'} ]"
                />       

              
            </span>
          </v-flex>

           
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer /> 
        <v-btn
          text
          color="primary"  
          @click="PasswordReset"          
        >
          <v-icon>
            lock_reset
          </v-icon>
          비밀번호초기화
        </v-btn>        

        <v-btn
          text
          color="primary"  
          @click="Save"          
        >
          <v-icon>
            save
          </v-icon>
          저장
        </v-btn>        
        <v-btn
          text
          color="primary"  
          @click="dlgClose"          
        >
          <v-icon>
            close
          </v-icon>
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
import { required, maxLength, minLength, email} from 'vuelidate/lib/validators';
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
        EMP_NAME: {
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(2)     //최소 2자리
        },
        CORPORATE_ID:{
                  
        },
        EMAIL : {
               required,
               email               
        },
        TEL_NO : {
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
      }
    },

    data: () => ({
        UserData:{
          EMP_NO :'',    //사번          
          EMP_USER_ID :'',    //로그인ID
          EMP_NAME    :'',    //성명
          CORPORATE_ID : '',  //법인ID
          EMAIL       :'',    //E-Mail
          TEL_NO      :'',    //Mobile          
          DEPT_NAME    : '',     //부서명
          GROUP_DISP_YN : '',     //조직현황 여부
          TASK : '',              //담당업무
          ACTV: 'Y'       
        },        
        IsShowDlg : false,        //다이얼로그 표시여부     
        e1 : 1,       
    }),
    computed:{      
        EMP_NO_Errors() {             //사번 관련 오류 메시지
          const errors = [];
          //TODO..
          return errors;
        },
        EMP_NAME_Errors() {       //사용자명 관련 오류 메시지
            const errors = [];
            if (!this.$v.UserData.EMP_NAME.$dirty) return errors;        
            !this.$v.UserData.EMP_NAME.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.EMP_NAME.maxLength && errors.push('너무 깁니다.');        
            !this.$v.UserData.EMP_NAME.minLength && errors.push('너무 짧습니다.');                    
            return errors;
        },
        EMAIL_Errors() {
            const errors = [];
            if (!this.$v.UserData.EMAIL.$dirty) return errors;        
            !this.$v.UserData.EMAIL.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.EMAIL.email && errors.push('E-Mail 형식에 맞지 않습니다.');                    
            return errors;
        },
        TEL_NO_Errors() {
            const errors = [];
            if (!this.$v.UserData.TEL_NO.$dirty) return errors;        
            !this.$v.UserData.TEL_NO.required && errors.push('필수 항목 입니다.');                
            !this.$v.UserData.TEL_NO.maxLength && errors.push('너무 깁니다.');        
            !this.$v.UserData.TEL_NO.minLength && errors.push('너무 짧습니다.');                    
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

    },
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(item){  //다이얼로그를 출력한다.        
          //초기화
          this.UserData = item;          
          this.$v.$reset();                                        
          this.IsShowDlg = true;            
        },                        
        async Save(){         
          if(this.$v.UserData.$invalid == false)
          {
            if (await this.$root.$confirm.open('Confirm', '수정 하시겠습니까??', { color: 'primary' }) == false) return;
            this.dlgClose();  //다이얼로그를 닫는다.
            this.$emit('SaveOK', this.UserData);
          }
          else
          {
            this.$v.UserData.$touch();
          }
        },
        async PasswordReset(){
          if (await this.$root.$confirm.open('Confirm', '비밀번호를 [lsgpis!!11]로 초기화 하시겠습니까??', { color: 'primary' }) == false) return;

          var cloneItem = {};
          Object.assign(cloneItem, this.UserData); //복사해서 넣는다.

          cloneItem.PASSWORD = 'lsgpis!!11';
 
          axios.post(`${CONST.HOST_ADDR}/usermanage/UpdatePassword`, cloneItem).then(
            (ret)=>{
              if(ret.data.ret == true)
              {
                //성공했다
                ret.data.msg = '비밀번호를 [lsgpis!!11]로 초기화 하였습니다.';
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                
              
              }
              else
              {
                //에러일경우
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                
              }

            }
          );               


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