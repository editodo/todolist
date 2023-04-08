<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    persistent
  >
    <v-card class="elevation-12">
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>사용자 정보 변경</v-toolbar-title>
        <v-spacer />                
      </v-toolbar>
      <v-card-text>
        <v-form>
          <div> 
            &nbsp;           
          </div>
          <v-text-field
                    id="password"
                    v-model="UserData.OrgPassword"
                    :error-messages="OrgPasswordErrors"
                    label="현재 패스워드"
                    name="OrgPassword"
                    prepend-icon="lock"
                    type="password"                                             
                    @input="$v.UserData.OrgPassword.$touch()"
                    @blur="$v.UserData.OrgPassword.$touch()"
                  />
           <v-text-field
                    id="password2"
                    v-model="UserData.ChgPassword1"
                    :error-messages="ChgPassword1Errors"
                    label="변경 패스워드"
                    name="password2"
                    prepend-icon="lock"
                    type="password"                         
                    @input="$v.UserData.ChgPassword1.$touch()"
                    @blur="$v.UserData.ChgPassword1.$touch()"
                  />
          <v-text-field
                    id="password3"
                    v-model="UserData.ChgPassword2"
                    :error-messages="ChgPassword2Errors"
                    label="변경 패스워드 확인"
                    name="password3"
                    prepend-icon="lock"
                    type="password"                         
                    @input="$v.UserData.ChgPassword2.$touch()"
                    @blur="$v.UserData.ChgPassword2.$touch()"
                  />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"  
          @click="SaveProc"                
        >
          <v-icon>
            save
          </v-icon>
          저장
        </v-btn>

        <v-btn
          color="primary"  
          @click="CloseProc"                
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
import {mapGetters} from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength} from 'vuelidate/lib/validators';
import axios from 'axios'
import CONST from '@/const'

export default {    
    mixins: [validationMixin],  //에러검증을 위함
    validations: {
      //로그인데이터 에러검증
      UserData : {
          OrgPassword: { 
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(4)     //최소패스워드 4자리
                  },
          ChgPassword1: {
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(4)     //최소패스워드 4자리
          },
          ChgPassword2: {
                  required,                   //필수값
                  maxLength: maxLength(32),   //32자리까지 입력
                  minLength: minLength(4)     //최소패스워드 4자리
          },
      },
      
    },
    data : ()=>(
        {
          dialog: false,     
          UserData: {
            OrgPassword : '',   //현재 패스워드
            ChgPassword1: '',   //변경할 패스워드1
            ChgPassword2: '',   //변경할 패스워드2
          }     
        }
    ),
    computed : {
      ...mapGetters(['USER_DATA',
                    'accessToken']),
      OrgPasswordErrors() {        
        const errors = [];
        if (!this.$v.UserData.OrgPassword.$dirty) return errors;        
        !this.$v.UserData.OrgPassword.maxLength && errors.push('패스워드가 너무 깁니다.');        
        !this.$v.UserData.OrgPassword.minLength && errors.push('패스워드가 너무 짧습니다.');        
        !this.$v.UserData.OrgPassword.required && errors.push('패스워드는 필수 항목 입니다.');                
        return errors;
      },
      ChgPassword1Errors() {        
        const errors = [];
        if (!this.$v.UserData.ChgPassword1.$dirty) return errors;        
        !this.$v.UserData.ChgPassword1.maxLength && errors.push('변경 패스워드가 너무 깁니다.');        
        !this.$v.UserData.ChgPassword1.minLength && errors.push('변경 패스워드가 너무 짧습니다.');        
        !this.$v.UserData.ChgPassword1.required && errors.push('변경 패스워드은 필수 항목 입니다.');                
        return errors;
      },
      ChgPassword2Errors() {        
        const errors = [];
        if (!this.$v.UserData.ChgPassword2.$dirty) return errors;        
        !this.$v.UserData.ChgPassword2.maxLength && errors.push('변경 패스워드 확인이 너무 깁니다.');        
        !this.$v.UserData.ChgPassword2.minLength && errors.push('변경 패스워드 확인이 너무 짧습니다.');        
        !this.$v.UserData.ChgPassword2.required && errors.push('변경 패스워드 확인은 필수 항목 입니다.');                
        return errors;
      },
      
    },  
    created : function() {
        
    },
     methods: {     
        open() {   
          this.dialog = true;
        
        },
        SaveProc : async function()    /*사용자 정보 변경내용을 저장한다.*/
        {                                
          
          console.log(this.$v.UserData);
          if(this.$v.UserData.$invalid == true)
          {
            
              this.$root.$toastmsg.ShowError('입력값을 확인 바랍니다.!');  //결과를 화면에 뿌린다.                                                            
              return;
          }            

          if (await this.$root.$confirm.open('Confirm', '저장 하시겠습니까??', { color: 'primary' }) == false) return;  
      
          axios.post(`${CONST.HOST_ADDR}/Login/PasswordChangeUser`, this.UserData).then(
          (ret)=>{
            if(ret.data.ret == true)
            {
                //패스워드 변경에 성공 했다.
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                                            
                this.dialog = false;
            }
            else
            {
                //패스워드 변경에 실패 했다.

                //오류 내용을 출력 한다.
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                                            
            }
                         
          }
        ).catch((ret)=>{console.log(ret)});      




            //
        },
        CloseProc : function()
        {
            this.dialog = false;  
        }

     }
}
</script>

<style>

</style>