<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="600"
  >
    <v-card>
      <v-toolbar
       flat        
        dense             
        :height=this.$vuetify.toolbar_height
        class="title_font_color"
      >        
        <v-toolbar-title
          v-if="mode=='I'"
          class="px-0"
        >
          그룹 추가
        </v-toolbar-title>        
        <v-toolbar-title
          v-else
          class="px-0"
        >
          그룹 수정
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
            <v-text-field
              v-model="dlgData.GROUP_ID"                            
              label="그룹ID"                                    
              disabled              
            />
          </v-col>
          <v-col>            
            <v-text-field
              v-model="dlgData.GROUP_NAME"                            
              label="그룹명"                                    
              :error-messages="GROUP_NAME_Errors"
              @input="$v.dlgData.GROUP_NAME.$touch()"
              @blur="$v.dlgData.GROUP_NAME.$touch()"     
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
import { required, maxLength } from 'vuelidate/lib/validators';


export default {
    mixins: [validationMixin],  //에러검증을 위함
    validations() {
        return {           
          dlgData : {            
            GROUP_NAME:{
              required,
              maxLength:maxLength(10)
            },            
            GROUP_ID:{

            }
          }
        };
    },
    data: () => ({
        dlgData: {
          GROUP_ID : '',
          GROUP_NAME : ''

        },
        IsShowDlg : false,          //다이얼로그 표시여부        
        mode:'I'                    //I:신규등록, E:수정모드              
    }),
    computed : {
        GROUP_NAME_Errors(){
            const errors = [];
            if (!this.$v.dlgData.GROUP_NAME.$dirty) return errors;    
            !this.$v.dlgData.GROUP_NAME.required && errors.push('그룹명은 필수 항목 입니다.');                    
            !this.$v.dlgData.GROUP_NAME.maxLength && errors.push('그룹명이 너무 깁니다.');
            return errors;
        },

    },
    methods: {
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
        ShowDlg(){  //다이얼로그를 출력한다.             
          this.mode = 'I';                                        
          this.dlgData.GROUP_ID = '';
          this.dlgData.GROUP_NAME = '';
          this.IsShowDlg = true;            
        },
        ShowModify(groupinfo){ //수정 다이얼로그를 출력한다;           

          this.mode = 'E';
          this.dlgData = {...groupinfo};   
          console.log(this.dlgData);
          this.IsShowDlg = true;
        },
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