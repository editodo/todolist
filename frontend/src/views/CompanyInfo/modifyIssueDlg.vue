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
        :height=this.$vuetify.toolbar_height
        class="title_font_color"
      >
        <v-toolbar-title class="px-0">
          <span class="toolbar_font_size">이슈상세</span>
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
      <div style="height:20px"></div>
      <v-card-text>
        <v-row>
          <v-col>
                  <v-card height="200px">
                    <v-card-text>
                      <div class="d-flex justify-space-between">
                          
                            <v-textarea
                              outlined
                              name="content"
                              label=""
                              v-model="issueData.CONTENT" 
                            ></v-textarea>
                         
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
          수정
        </v-btn> 
        <v-btn
          text
          color="primary"  
          @click="deleteItem"          
        >
          삭제
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

//import CSelectBox from '@/components/SelectBox/CSelectBox.vue'



export default {
    components: {
      //CSelectBox, 
    },
    data: () => ({
       issueData:{
          CORPORATE_ID :'',    //사업자코드        
          COMPANY_CODE :'',    //업체코드
          CONTENT : '',   //내용
          COMPANY_ISSUE_ID : ''
        },
        IsShowDlg : false,        //다이얼로그 표시여부     
        e1 : 1,      
    }),
    created : async function(){    
      
      
    
    },
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(item){  //다이얼로그를 출력한다.        
          //초기화
          this.issueData = item;          
          this.IsShowDlg = true;            
        },    
        
        async Save(){
          if(this.issueData.CONTENT != ""){

            if (await this.$root.$confirm.open('Confirm', '수정하시겠습니까??', { color: 'primary' }) == false) return;

            this.dlgClose();  //다이얼로그를 닫는다.
            this.$emit('SaveOK', this.issueData);
          }
          else
          {
            this.$v.CoperData.$touch();
          }
        },
        async deleteItem(){ //삭제 확정
          if (await this.$root.$confirm.open('Confirm', '삭제 하시겠습니까??', { color: 'primary' }) == false) return;

          this.dlgClose();  //창을 닫는다.
          this.$emit('DeleteOK', this.issueData);
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