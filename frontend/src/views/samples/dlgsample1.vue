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
        <v-btn
          icon
          dark
          @click="dlgClose"
        >
          <v-icon>close</v-icon>
        </v-btn>        
        <v-toolbar-title class="px-0">
          상세보기
        </v-toolbar-title>        
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            여기에 내용을 넣는다.
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

        },
        IsShowDlg : false,          //다이얼로그 표시여부            
    }),
    methods: {
        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
        ShowDlg(){  //다이얼로그를 출력한다.                       
          this.IsShowDlg = true;            
        },
    }

}
</script>

<style>

</style>