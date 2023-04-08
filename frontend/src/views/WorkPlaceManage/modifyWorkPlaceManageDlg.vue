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
          <span class="toolbar_font_size">사업장 정보 수정</span>
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
                  <v-card height="250px">
                    <v-card-text>
                      <div>
                        <v-flex class="d-flex">
                          <span class="flex-grow-1 px-2">
                            
                            <CSelectBox                 
                              v-model="WorkPlaceData.CORPORATE_ID"                        
                              label="법인"  
                              dense                              
                              item-text="CORPORATE_NAME"      
                              item-value="CORPORATE_ID"      
                              source-url="/Common/CoperList"
                              active-all-item="false"
                              :error-messages="CORPORATE_ID_Errors"
                              readonly
                            />
                          </span>
                        </v-flex>
                        </div>
                        <div class="d-flex justify-space-between">
                        
                          <span class="flex-grow-1 px-2">
                            <v-text-field                
                              v-model="WorkPlaceData.WORKPLACE_ID" 
                              :error-messages="WORKPLACE_ID_Errors" 
                              label="사업장코드"
                              readonly
                            >
                            </v-text-field>
                          </span>
                         <span class="flex-grow-1 px-2">
                          <v-text-field                
                            v-model="WorkPlaceData.WORKPLACE_NAME"   
                            :error-messages="WORKPLACE_NAME_Errors" 
                            label="사업장명"
                            @input="$v.WorkPlaceData.WORKPLACE_NAME.$touch()" 
                            @blur="$v.WorkPlaceData.WORKPLACE_NAME.$touch()"                                                                   
                          />
                            
                          </span>
                        
                        </div>
                        <div style="height:10px"></div>
                        <div>
                        <v-flex class="d-flex">
                          <span 
                            class="flex-grow-10 px-2"
                            >
                            <!-- <v-switch 
                              v-model="WorkPlaceData.ACTV"
                              label="사용중"
                            /> -->
                            <v-select
                              v-model="WorkPlaceData.ACTV"
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
                    
                  </v-card>
               
            
          </v-col>
        </v-row>                
      </v-card-text>
      <v-card-actions>
        <v-spacer /> 
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
import { required} from 'vuelidate/lib/validators';
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'



export default {
    components: {
      CSelectBox, 
    },
    mixins: [validationMixin],  //에러검증을 위함
    validations: {
      WorkPlaceData:{
        CORPORATE_ID : {                    //WORKPLACE_ID
          required
        },
        WORKPLACE_ID : {                    //WORKPLACE_ID
          required
        },
        WORKPLACE_NAME:{
          required
        }, 
      }
    },

    data: () => ({
        WorkPlaceData:{
          CORPORATE_ID :'',    //아이디          
          WORKPLACE_ID :'',    //아이디          
          WORKPLACE_NAME :'',    //법인명
          ACTV : ''   //활성 확인
        },
        checkID : false,          //중복체크 여부        
        IsShowDlg : false,        //다이얼로그 표시여부     
        e1 : 1,       
    }),
    computed:{
        CORPORATE_ID_Errors() {       //법인 ID관련 오류 메시지
            const errors = [];
            if (!this.$v.WorkPlaceData.CORPORATE_ID.$dirty) return errors;        
            !this.$v.WorkPlaceData.WORKPLACE_ID.required && errors.push('법인ID는 필수 항목 입니다.');                
            return errors;
        },
        WORKPLACE_ID_Errors() {       //법인 ID관련 오류 메시지
            const errors = [];
            if (!this.$v.WorkPlaceData.WORKPLACE_ID.$dirty) return errors;        
            !this.$v.WorkPlaceData.WORKPLACE_ID.required && errors.push('사업장코드는 필수 항목 입니다.');                
            //!this.$v.WorkPlaceData.WORKPLACE_ID.maxLength && errors.push('사업장코드가 너무 깁니다.');        
            //!this.$v.WorkPlaceData.WORKPLACE_ID.minLength && errors.push('사업장코드가 너무 짧습니다.');                    
            //!this.checkID && errors.push('중복확인 버튼을 눌러주십시요.'); 
            return errors;
        },
        WORKPLACE_NAME_Errors() {       //법인 관련 오류 메시지
            const errors = [];
            if (!this.$v.WorkPlaceData.WORKPLACE_NAME.$dirty) return errors;        
            //!this.$v.WorkPlaceData.WORKPLACE_NAME.required && errors.push('사업장명은 필수 항목 입니다.');                
            //!this.$v.WorkPlaceData.WORKPLACE_NAME.maxLength && errors.push('사업장명이 너무 깁니다.');        
            return errors;
        },

    },
    created : async function(){    
      
      
    
    },
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(item){  //다이얼로그를 출력한다.        
          //초기화
          this.WorkPlaceData = item;          
          this.$v.$reset();                                        
          this.IsShowDlg = true;            
        },    
        CoperNameInput(){
          this.$v.WorkPlaceData.WORKPLACE_ID.$touch();  
          this.checkID=false;
        },        
        checkWorkPlaceID(){  //법인 ID중복 체크를 진행한다.
          console.log("test");
          axios.post(`${CONST.HOST_ADDR}/workplacemanage/checkWorkPlaceID`, this.WorkPlaceData).then(
            (ret)=>{
                if(ret.data.ret){
                  this.checkID = true;
                }
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                                          
            }
          ); 
        },
        async Save(){
          if(this.$v.WorkPlaceData.$invalid == false)
          {
            if (await this.$root.$confirm.open('Confirm', '수정하시겠습니까??', { color: 'primary' }) == false) return;

            this.dlgClose();  //다이얼로그를 닫는다.
            this.$emit('SaveOK', this.WorkPlaceData);
          }
          else
          {
            this.$v.WorkPlaceData.$touch();
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