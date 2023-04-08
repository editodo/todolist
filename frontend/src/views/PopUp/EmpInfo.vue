<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="1600"
  >
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
        <v-toolbar-title class="px-0">
          <span class="toolbar_font_size">구매조직현황</span>
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
      <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline"
        />      
      <div style="height:600px">
      <v-card-text>        
        <div class="d-flex justify-space-between">                                     
          <span class="px-2">            
            <CSelectBox                 
              v-model="SearchCond.CORPORATE_ID"                        
              label="법인"  
              dense
              prepend-icon="search"                               
              item-text="CORPORATE_NAME"      
              item-value="CORPORATE_ID"      
              source-url="/Common/CoperList"
              active-all-item            
            />
          </span>            

          <span>          
            <v-btn
              class="primary"
              @click="selectEmpInfoList"
            >
              <v-icon left>
                search
              </v-icon>
              조회
            </v-btn>
          </span>
        </div>
        <v-data-table 
          :headers="headers"
          :header-props="{ sortIcon: null }"
          :items="EmpInfoList"
          class="std_datatable cursor_p"          
          dense      
          hide-default-footer
          :items-per-page="itemPerPage" 
          :page.sync="page"       
          @page-count="pageCount = $event"
          itemprop=""
        > 
        <template v-slot:item="{ item }">
          <tr>
            <td><div style="width: 150px;" class="myellipsisbox" :title="item.CORPORATE_NAME">{{ item.CORPORATE_NAME }}</div></td>
            <td><div style="width: 300px;" class="myellipsisbox" :title="item.DEPT_NAME">{{ item.DEPT_NAME }}</div></td>
            <td><div style="width: 120px;" class="myellipsisbox" :title="item.EMP_NAME">{{ item.EMP_NAME }}</div></td>
            <td><div style="width: 150px;" class="myellipsisbox" :title="item.TEL_NO">{{ item.TEL_NO }}</div></td>           
            <td><div style="width: 250px;" class="myellipsisbox" :title="item.EMAIL">{{ item.EMAIL }}</div></td>           
            <td><div style="width: 500px;" class="myellipsisbox" :title="item.TASK">{{ item.TASK }}</div></td>           
          </tr>
        </template>
      
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="totalVisible"
            next-icon="mdi-menu-right"
            prev-icon="mdi-menu-left"
            ></v-pagination>
        </div>
      </v-card-text>
      </div>
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
import CONST from '@/const'
import axios from 'axios'

import CSelectBox from '@/components/SelectBox/CSelectBox.vue'

export default {
  components: {      
      CSelectBox, 
    },
    data: () => ({

       IsShowDlg : false,          //다이얼로그 표시여부         
        defaultData:'',        
        page : 1,    
        pageCount: 0,
        itemPerPage: 15,
        totalVisible: 15,                    
        SearchCond: {      //검색조건
          CORPORATE_ID:'',       //법인코드
        },
        
        EmpInfoList : [],  // 리스트
        
        headers: [          
          { text: '법인명',value: 'CORPORATE_NAME',sortable: false,width: '150px', align: 'center'},
          { text: '부서명', value: 'DEPT_NAME', width: '300px' , align: 'center'},
          { text: '성명', value: 'EMP_NAME' , width: '120px', align: 'center'},          
          { text: '전화번호', value: 'TEL_NO', width: '150px', align: 'center'},          
          { text: 'E-Mail', value: 'EMAIL' , width: '250px', align: 'center'},
          { text: '담당업무', value: 'TASK', width: '500px', align: 'center'},
        ],

    }),
    computed:{

    },
    
    methods: {
        selectEmpInfoList() {
        //console.log(this.SearchCond);
          axios.post(`${CONST.HOST_ADDR}/EmpInfo/selectEmpInfo`, this.SearchCond).then(
            (ret)=>{
                
                this.EmpInfoList = ret.data;
            }
          );    
        },

        dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },

        ShowDlg(){  //다이얼로그를 출력한다.                       
          this.IsShowDlg = true; 
          // 초기 조회
          this.SearchCond.CORPORATE_ID='';
          this.selectEmpInfoList();    
                 
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

