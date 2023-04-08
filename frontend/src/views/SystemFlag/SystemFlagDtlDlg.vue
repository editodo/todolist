<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="800"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
        flat
        dense
      >
       
        <v-toolbar-title
          v-if="mode=='I'"
          class="px-0"
        >
          시스템 코드 등록
        </v-toolbar-title>        
        <v-toolbar-title v-else>
          시스템 코드 수정
        </v-toolbar-title>             
        <v-spacer></v-spacer>
         <v-btn
          icon
          dark
          @click="dlgClose"
        >
          <v-icon>close</v-icon>
        </v-btn>

      </v-toolbar>
      <v-card-text>
        <br/>
        <v-row>
          <v-col>
            <v-text-field
              v-model="dlgData.FLAG_NAME"                            
              label="FLAG 명"                            
              :error-messages="FLAG_NAME_Errors"
              @input="$v.dlgData.FLAG_NAME.$touch()"
              @blur="$v.dlgData.FLAG_NAME.$touch()"     
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="dlgData.FLAG_CODE"                            
              label="FLAG 코드"
              :error-messages="FLAG_CODE_Errors"
              @input="$v.dlgData.FLAG_CODE.$touch()"
              @blur="$v.dlgData.FLAG_CODE.$touch()"     
            />
          </v-col>
          <v-col>
            <v-text-field                            
              v-model="dlgData.FLAG_DATA"                            
              label="FLAG DATA"
              :error-messages="FLAG_DATA_Errors"
              @input="$v.dlgData.FLAG_DATA.$touch()"
              @blur="$v.dlgData.FLAG_DATA.$touch()"     
            />
          </v-col>
          <v-col>
            <v-text-field       
              v-model="dlgData.OUTPUT_ORDER"
              label="순서"              
              type="number"
              :error-messages="OUTPUT_ORDER_Errors"
              @input="$v.dlgData.OUTPUT_ORDER.$touch()"
              @blur="$v.dlgData.OUTPUT_ORDER.$touch()"     
            />
          </v-col>
        </v-row>        
      </v-card-text>
      <v-card-actions>
        <v-spacer /> 
      
        <v-btn
          v-if="mode=='I'"
          text
          color="primary"
          :disabled="$v.dlgData.$invalid"
          @click="dlgSave"
        >
          등록
        </v-btn>
        <v-btn
          v-if="mode=='E'"
          text
          color="primary"          
          @click="deleteItem"
        >
         삭제
        </v-btn> 
        <v-btn
          v-if="mode=='E'"
          text
          color="primary"
          :disabled="$v.dlgData.$invalid"
          @click="modifySave"
        >
          저장
        </v-btn>        
        <v-btn
          text
          color="primary"  
          @click="dlgClose"          
        >
          취소
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength} from 'vuelidate/lib/validators';



export default {    
    mixins: [validationMixin],  //에러검증을 위함
    validations() {
       if (this.mode=="I") {
         //입력모드
         return {           
          dlgData : {
            FLAG_NAME:{
              required,
              maxLength:maxLength(30)
            },
            FLAG_CODE:{
             required,
              maxLength:maxLength(200)
            },
            FLAG_DATA:{
              required,
              maxLength:maxLength(100)
            },
            OUTPUT_ORDER:{
              required
            }
          }
         };
       }else{
         //수정모드
         return {          
          dlgData : {
            FLAG_NAME:{
              required,
              maxLength:maxLength(30)
            },
            FLAG_CODE:{
             required,
              maxLength:maxLength(200)
            },
            FLAG_DATA:{
              required,
              maxLength:maxLength(100)
            },
            OUTPUT_ORDER:{
              required
            }
          }
         };
       }
    },
    // validations: {
      
    // },    
    data: () => ({
        dlgData: {
          SYSTEM_FLAG_ID: -1,
          FLAG_NAME:'',
          FLAG_CODE:'',
          FLAG_DATA:'',
          OUTPUT_ORDER:0,          
        },
        IsShowDlg : false,            //다이얼로그 표시여부
        mode:'I'      //I:신규등록, E:수정모드              
    }),
    computed : {
      FLAG_NAME_Errors() {    //FLAG_NAME관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.FLAG_NAME.$dirty) return errors;    
        !this.$v.dlgData.FLAG_NAME.required && errors.push('FLAG 명은 필수 항목 입니다.');                            
        return errors;
      },
      FLAG_CODE_Errors() {  //FLAG_CODE 관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.FLAG_CODE.$dirty) return errors;
        !this.$v.dlgData.FLAG_CODE.required && errors.push('FLAG 코드는 필수 항목 입니다.');
        !this.$v.dlgData.FLAG_CODE.maxLength && errors.push('FLAG 코드가 너무 깁니다.');
        return errors;
      },
      FLAG_DATA_Errors(){    //FLAG_DATAL관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.FLAG_DATA.$dirty) return errors;
        !this.$v.dlgData.FLAG_DATA.required && errors.push('FLAG_DATA는 필수 항목 입니다.');
        !this.$v.dlgData.FLAG_DATA.maxLength && errors.push('FLAG_DATA가 너무 깁니다.');
        return errors;
      },
      OUTPUT_ORDER_Errors(){  //순번 관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.OUTPUT_ORDER.$dirty) return errors;
        !this.$v.dlgData.OUTPUT_ORDER.required && errors.push('순번은 필수 항목 입니다.');                    
        return errors;
      },      
    },
    methods: {
        resetDlgData(){   //다이얼로그 데이터를 초기화 한다.
          this.dlgData.SYSTEM_FLAG_ID = -1;
          this.dlgData.FLAG_NAME = '';
          this.dlgData.FLAG_CODE = '';
          this.dlgData.FLAG_DATA = '';
          this.dlgData.OUTPUT_ORDER = 0;          
        },
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        async dlgSave(){  //저장버튼을 클릭했다.   
        
            if (await this.$root.$confirm.open('Confirm', '저장 하시겠습니까??', { color: 'primary' }) == false) return;
        
            if(this.$v.dlgData.$invalid == false)
            {
              this.IsShowDlg = false;
              this.$emit('AddOK', this.dlgData);
            }            
        },
        async modifySave(){ //수정확정

          if (await this.$root.$confirm.open('Confirm', '저장 하시겠습니까??', { color: 'primary' }) == false) return;

          if(this.$v.dlgData.$invalid == false)
          {
            this.dlgClose();  //창을 닫는다.
            this.$emit('ModifyOK', this.dlgData);
          }        
        }, 
        async deleteItem(){ //삭제 확정
          if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;

          this.dlgClose();  //창을 닫는다.
          this.$emit('DeleteOK', this.dlgData);
        },       
        ShowDlg(){  //다이얼로그를 출력한다.     
        
          this.mode = 'I';          
          this.resetDlgData();          
          this.$v.$reset();          
          this.IsShowDlg = true;            
        },
        ShowModify(item){ //수정 다이얼로그를 출력한다;           

          this.mode = 'E';
          this.dlgData = {...item};                  
          this.$v.$reset();                  
          this.IsShowDlg = true;
        },
    },

}
</script>

<style>

</style>