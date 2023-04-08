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
       
        <v-toolbar-title
          v-if="mode=='I'"
          class="px-0"
        >
          <span class="toolbar_font_size">메뉴등록</span>
        </v-toolbar-title>        
        <v-toolbar-title v-else>
          <span class="toolbar_font_size">메뉴수정</span>
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
            <v-select
              v-model="dlgData.UP_MENU_ID"
              :items="menuItems"
              item-text="MENU_NAME"
              item-value="MENU_ID"
              label="Upper Menu"
              :error-messages="UP_MENU_ID_Errors"
              @input="$v.dlgData.UP_MENU_ID.$touch()"
              @blur="$v.dlgData.UP_MENU_ID.$touch()"     
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="dlgData.MENU_ID"                            
              label="Menu ID"
              :readonly="(mode=='E')"
              type="number"         
              :error-messages="MENU_ID_Errors"
              @input="$v.dlgData.MENU_ID.$touch()"
              @blur="$v.dlgData.MENU_ID.$touch()"     
            />
          </v-col>
          <v-col>
            <v-text-field                            
              v-model="dlgData.MENU_NAME"                            
              label="Menu Name"
              :error-messages="MENU_NAME_Errors"
              @input="$v.dlgData.MENU_NAME.$touch()"
              @blur="$v.dlgData.MENU_NAME.$touch()"     
            />
          </v-col>
          <v-col>
            <v-text-field       
              v-model="dlgData.ORDER_NO"
              label="Order No"              
              type="number"
              :error-messages="ORDER_NO_Errors"
              @input="$v.dlgData.ORDER_NO.$touch()"
              @blur="$v.dlgData.ORDER_NO.$touch()"     
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field    
              v-model="dlgData.MENU_ICON"
              label="Icon"              
            />            
          </v-col>
          <v-col>
            <v-text-field
              v-model="dlgData.MENU_URL"                            
              label="Url"
              :error-messages="MENU_URL_Errors"
              @input="$v.dlgData.MENU_URL.$touch()"
              @blur="$v.dlgData.MENU_URL.$touch()"                   
            />            
          </v-col>     
          <v-col>
            <v-switch          
              v-model="dlgData.ACTV"
              false-value="N"
              true-value="Y"
              :label="`활성화(Y/N): ${dlgData.ACTV}`"
            />
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
          취소
        </v-btn>
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
          :disabled="$v.dlgData.$invalid"
          @click="modifySave"
        >
          저장
        </v-btn>        
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength, sameAs, not } from 'vuelidate/lib/validators';


//  const ID_unique = (value, vm) =>{
//    return vm.menuItems.find((item)=>{return item.MENU_ID == value}) == undefined;
//  }

//이미 등록된 ID인지 확인
function ID_unique (value) {
  return this.menuItems.find((item)=>{return item.MENU_ID == value}) == undefined;  
}  
//에러 체크

export default {    
    mixins: [validationMixin],  //에러검증을 위함
    validations() {
       if (this.mode=="I") {
         //입력모드
         return {           
          dlgData : {
            MENU_ID:{
              required,
              ID_unique          
            },
            MENU_NAME:{
            required,
              maxLength:maxLength(10)
            },
            MENU_URL:{
              maxLength:maxLength(256)
            },
            ORDER_NO:{
              required
            },
             UP_MENU_ID:{
              required,              
            }
          }
         };
       }else{
         //수정모드
         return {          
          dlgData : {
            MENU_ID:{
              required,                   
            },
            MENU_NAME:{
            required,
              maxLength:maxLength(10)
            },
            MENU_URL:{
              maxLength:maxLength(256)
            },
            ORDER_NO:{
              required
            },
            UP_MENU_ID:{
              required,
              notSame : not(sameAs('MENU_ID'))  //상위메뉴와 자신의메뉴ID가 동일할수 없음
            }
          }
         };
       }
    },
    // validations: {
      
    // },    
    data: () => ({
        dlgData: {
          ACTV:'Y',
          MENU_ICON:'',
          MENU_ID:'',
          MENU_NAME:'',
          MENU_URL:'',
          ORDER_NO:0,
          UP_MENU_ID:'0',            
        },
        IsShowDlg : false,            //다이얼로그 표시여부
        menuItems:[], 
        mode:'I'      //I:신규등록, E:수정모드              
    }),
    computed : {
      MENU_ID_Errors() {    //메뉴ID관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.MENU_ID.$dirty) return errors;    
        !this.$v.dlgData.MENU_ID.required && errors.push('메뉴ID는 필수 항목 입니다.');                    
        (this.mode=='I') && !this.$v.dlgData.MENU_ID.ID_unique && errors.push('이미 등록된 메뉴ID입니다.');                    
        return errors;
      },
      MENU_NAME_Errors() {  //메뉴명 관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.MENU_NAME.$dirty) return errors;
        !this.$v.dlgData.MENU_NAME.required && errors.push('메뉴명은 필수 항목 입니다.');
        !this.$v.dlgData.MENU_NAME.maxLength && errors.push('메뉴명이 너무 깁니다.');
        return errors;
      },
      MENU_URL_Errors(){    //메뉴URL관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.MENU_URL.$dirty) return errors;
        !this.$v.dlgData.MENU_URL.maxLength && errors.push('URL이 너무 깁니다.');
        return errors;
      },
      ORDER_NO_Errors(){  //순번 관련 에러메시지
        const errors = [];
        if (!this.$v.dlgData.ORDER_NO.$dirty) return errors;
        !this.$v.dlgData.ORDER_NO.required && errors.push('순번은 필수 항목 입니다.');                    
        return errors;
      },
      UP_MENU_ID_Errors(){  //상위메뉴 관련 에러 메시지
        const errors = [];
        if (!this.$v.dlgData.UP_MENU_ID.$dirty) return errors;
        !this.$v.dlgData.UP_MENU_ID.required && errors.push('상위메뉴는 필수 항목 입니다.');        
        (this.mode=='E')&&!this.$v.dlgData.UP_MENU_ID.notSame && errors.push('자신을 상위메뉴로 지정 할 수 없습니다.');
        return errors;
      }
    },
    methods: {
        resetDlgData(){   //다이얼로그 데이터를 초기화 한다.
          this.dlgData.ACTV = 'Y';
          this.dlgData.MENU_ICON = '';
          this.dlgData.MENU_ID = 0;
          this.dlgData.MENU_NAME = '';
          this.dlgData.MENU_URL = '';
          this.dlgData.ORDER_NO = 0;
          this.dlgData.UP_MENU_ID = '0';
        },
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        async dlgSave(){  //저장버튼을 클릭했다.   
        
            if (await this.$root.$confirm.open('Confirm', '저장하시겠습니까??', { color: 'primary' }) == false) return;
        
            if(this.$v.dlgData.$invalid == false)
            {
              this.IsShowDlg = false;
              this.$emit('SaveOK', this.dlgData);
            }            
        },
        async modifySave(){ //수정확정

          if (await this.$root.$confirm.open('Confirm', '저장하시겠습니까??', { color: 'primary' }) == false) return;

          if(this.$v.dlgData.$invalid == false)
          {
            this.dlgClose();  //창을 닫는다.
            this.$emit('ModifyOK', this.dlgData);
          }        
        },        
        ShowDlg(menu_item, UP_MENU_ID = '0'){  //다이얼로그를 출력한다.     
        
          this.mode = 'I';
          this.menuItems = menu_item;
          this.resetDlgData();
          this.dlgData.UP_MENU_ID = UP_MENU_ID;
          this.$v.$reset();          
          this.IsShowDlg = true;            
        },
        ShowModify(item, menu_item){ //수정 다이얼로그를 출력한다;           

          this.mode = 'E';
          this.dlgData = {...item};          
          this.menuItems = menu_item;
          this.$v.$reset();                  
          this.IsShowDlg = true;
        },

    },



}
</script>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>