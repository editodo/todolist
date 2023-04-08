
<template>
  <div class="pt-1">
    <v-card          
      color="card_background"
      class="baseheight"
    >
      <v-toolbar
        flat        
        dense             
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
      >
        <!-- <v-toolbar-title dense class="bold">
          <v-icon class="bold">history</v-icon> 에러로그
        </v-toolbar-title> -->
        <v-toolbar-title 
          dense
        >
          <v-icon 
            class="title_font_color toolbar_icon_size"
          >history</v-icon> <span class="toolbar_font_size">에러로그</span>
        </v-toolbar-title>
        <v-spacer />            
        <!--필요시 여기에 버튼을 넣는다. -->
        <v-btn
          text
          class="title_font_color"
          @click="ExcelDownload"
        >
          <v-icon>download</v-icon>
          Excel
        </v-btn>
      </v-toolbar>
      <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline"
      />          
      <v-card-text>
        <v-card
          class="pa-0"
          flat
          color="card_background"
        >
          <div 
            class="d-flex justify-space-between"
          >
            <div 
              class="d-flex justify-space-between"          
              style="width:570px"
              >
              <seldate
                  v-model="SearchCond.fromDate"
                  label="From Date"
                  today
                />
                <seldate
                  v-model="SearchCond.toDate"
                  label="To"
                  today
                />
                <v-text-field         
                  class="pt-1"       
                  v-model="SearchCond.loginID"          
                  label="Login ID"                    
                  prepend-icon="search"
                  dense
                />
            </div>
              <v-btn
                  color="primary"
                  @click="selectUseLog"
                >
                <v-icon>
                  search
                </v-icon>
                  조회
              </v-btn>
          </div>
          <v-row>
            <v-col>
              <v-simple-table
                dense
                fixed-header
                height="calc(100vh - 370px)"      
                class="std_datatable cursor_p"                             
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      Login ID
                    </th>
                    <th class="text-left">
                      IP
                    </th>
                    <th class="text-left">
                      Req URL
                    </th>
                    <th class="text-left">
                      Date Time
                    </th>
                    <th class="text-left">
                      Class Nm
                    </th>
                    <th class="text-left">
                      Exception Nm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(item, index) in LogList"
                    :key="index"  
                    :class="{bg_gray :((index % 2) == 0 )}" 
                    :style="{ cursor: 'pointer'}"                   
                    @click="showDtl(item)"
                  >
                    <td>
                      {{ item.LOGIN_ID }}
                    </td>
                    <td>
                      {{ item.USER_IP }}
                    </td>
                    <td>
                      {{ item.REQ_URL }}
                    </td>
                    <td>
                      {{ item.REQ_DT }}
                    </td>
                    <td>
                      {{ item.CAUSE_CLASS_NM }}
                    </td>
                    <td>
                      {{ item.CAUSE_EXCEPTION_NM }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
    
    <errlog-dlg ref="mydlg" />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import seldate from '@/components/Date/seldate.vue' //날짜 선택 다이얼로그
import errlogDlg from './errlogDlg.vue'

export default {
    components: {
      seldate,
      errlogDlg
    },
    data: () => ({
        LogList:[],     
        fromMenu: false,
        
        SearchCond : {
            fromDate : '',
            toDate:'',
            loginID : '',
            
        }
    }),
    computed:{

    },
    created : function(){        
      
    },
    methods : {
        //여기에 함수들
        selectUseLog(){
            axios.post(`${CONST.HOST_ADDR}/errlog/selectErrLogList`, this.SearchCond).then(
            (ret)=>{                
                this.LogList = ret.data;
            }
          );       
        },
        showDtl(item){  //상세정보를 확인한다.
          this.$refs.mydlg.ShowDlg(item);
        },
        ExcelDownload: async function()
          {            

             var headers = [
                { text: 'Login ID', value: 'LOGIN_ID', sortable: false },
                { text: 'IP',value: 'USER_IP',sortable: false, align: 'center',},
                { text: 'Req URL', value: 'REQ_URL', align: 'center', },
                { text: 'Date Time', value: 'REQ_DT' ,align: 'left',},          
                { text: 'Class Nm', value: 'CAUSE_CLASS_NM' ,align: 'left',},          
                { text: 'Exception Nm', value: 'CAUSE_EXCEPTION_NM' ,align: 'left',},          
             ];

            this.$GET_EXCEL_FILE(headers, this.LogList);  //엑셀 파일을 다운로드 받는다.               
            
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