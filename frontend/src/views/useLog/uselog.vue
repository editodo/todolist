
<template>
  <div class="pt-1">
    <v-card          
      color="card_background"
      class="baseheight"
    >
      <v-toolbar       
        flat        
        dense             
        class="title_font_color"
        :height="this.$vuetify.toolbar_height"
      >
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">history</v-icon> <span class="toolbar_font_size">접속로그</span>
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
                    <th class="text-left ">
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
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(item, index) in LogList"
                    :key="index"  
                    :class="{bg_gray :((index % 2) == 0 )}"                    
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
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
    </v-card-text>
    </v-card>
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import seldate from '@/components/Date/seldate.vue'

export default {
    components: {
      seldate
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
            axios.post(`${CONST.HOST_ADDR}/uselog/selectUseLog`, this.SearchCond).then(
            (ret)=>{
                console.log(ret);
                this.LogList = ret.data;
            }
       );       

        },
        ExcelDownload: async function()
        {            
            
            //헤더를 생성한다.
          var headers = [
                { text: 'Login ID', value: 'LOGIN_ID', sortable: false },
                { text: 'IP',value: 'USER_IP',sortable: false, align: 'center',},
                { text: 'Req URL', value: 'REQ_URL', align: 'center', },
                { text: 'Date Time', value: 'REQ_DT' ,align: 'left',},          
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