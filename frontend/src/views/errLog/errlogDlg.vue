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
          <span class="toolbar_font_size">상세보기</span>
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
            <br/>
            <v-textarea 
              label="Exception Message"
              outlined
              readonly
              :value="dlgData.item.CAUSE_EXCEPTION_MSG"
              rows="20"
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
          닫기
        </v-btn>        
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data: () => ({
        dlgData: {
            item:{},
        },
        IsShowDlg : false,          //다이얼로그 표시여부            
    }),
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(item){  //다이얼로그를 출력한다.                       
            this.dlgData.item = item;
            this.IsShowDlg = true;            
        },
    }

}
</script>

<style>

</style>