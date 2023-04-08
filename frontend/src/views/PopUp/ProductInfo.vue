<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="1200"
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
          <span class="toolbar_font_size">제품분류기준</span>
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
              @click="selectProductInfoList"
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
          :items="ProductInfoList"
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
            <td dense>{{ item.CORPORATE_NAME }}</td>
            <td>{{ item.PRODUCT_CLASS }}</td>
            <td>{{ item.PRODUCT_GROUP }}</td>
            <td>{{ item.PRODUCT_SUBCLASS }}</td>           
            <!-- <td></td>       -->
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
//import PageDataTable from '@/components/DataTable/PageDataTable'
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'

export default {
  components: {
      //PageDataTable,
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
        ProductInfoList : [],  // 리스트
        
        headers: [
          // { text: 'ID', value: 'SYSTEM_FLAG_ID', sortable: false,align: 'center' },
          { text: '법인',value: 'CORPORATE_NAME',sortable: false, align: 'center',width: '200px'},
          { text: '대분류',value: 'PRODUCT_CLASS',sortable: false, align: 'center',width: '200px'},
          { text: '중분류', value: 'RPODUCT_GROUP', align: 'center', width: '200px'},
          { text: '소분류', value: 'PRODUCT_SUBCLASS' ,align: 'center',width: '300px'},          
          //{ text: '', value: '' ,align: 'center'},
        ],

    }),
    computed:{

    },
    
    methods: {

        selectProductInfoList() {
        //console.log(this.SearchCond);
          axios.post(`${CONST.HOST_ADDR}/ProductInfo/selectProductInfo`, this.SearchCond).then(
            (ret)=>{
                
                this.ProductInfoList = ret.data;
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
          this.selectProductInfoList();    
                 
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

