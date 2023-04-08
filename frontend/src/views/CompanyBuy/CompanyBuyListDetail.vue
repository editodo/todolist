<template>
 <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="1680"
  >
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
        outlined
      >
        <v-toolbar-title dense>
          업체정보 및 구매이력
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
      <div style="height:150px">
      
      <v-card-text>
        <v-toolbar
        flat
        dense
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
        outlined
        >
          <v-toolbar-title dense>
            <v-icon class="title_font_color toolbar_icon_size">info</v-icon> <span class="toolbar_font_size">업체정보</span>
          </v-toolbar-title>
        </v-toolbar>
      <div style="height:5px"></div>
      <v-data-table 
          :headers="headersCompany"
          :header-props="{ sortIcon: null }"
          :items="CompanyInfo"
          class="std_datatable"
          :loading="loading"
          loading-text="Loading... Please wait"
          dense      
          hide-default-footer
        > 
       <template v-slot:item="{ item }">
       
        <tr>
          <td @click="goDtl2(item)"><div style="width: 200px;" class="myellipsisbox" :title="item.COMPANY_NAME">{{ item.COMPANY_NAME }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.REPRESENTATIVE">{{ item.REPRESENTATIVE }}</div></td>
          <td><div style="width: 130px;" class="myellipsisbox" :title="item.COMPANY_REGIST_NO">{{ item.COMPANY_REGIST_NO }}</div></td>
          <td><div style="width: 150px;" class="myellipsisbox" :title="item.INDUSTRY_CONDTION">{{ item.INDUSTRY_CONDTION }}</div></td>
          <td><div style="width: 150px;" class="myellipsisbox" :title="item.INDUSTRY_TYPE">{{ item.INDUSTRY_TYPE }}</div></td>
          <td><div style="width: 300px;" class="myellipsisbox" :title="item.ADDRESS">{{ item.ADDRESS }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.COUNTRY">{{ item.COUNTRY }}</div></td>
          <td><div style="width: 150px;" class="myellipsisbox" :title="item.BUY_SCALE">{{ item.BUY_SCALE }}</div></td>          
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.TEL_NO">{{ item.TEL_NO }}</div></td>
          <td @click="goDtl2(item)"><div style="width: 100px;" class="myellipsisbox" :title="item.PRODUCT_CLASS">{{ item.CREDIT_GRADE }}</div></td>
         <!-- <td>{{ item.SCORE }}</td> -->
         <!-- <td>{{ item.MANAGER }}</td> -->
          <!-- <td>{{ item.MANAGER_TEL }}</td> -->
        </tr>
      </template>
      
        </v-data-table>

        </v-card-text>
      </div>
      
        <v-card-text>
          <v-toolbar
        flat
        dense
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
        outlined
        >
          <v-toolbar-title dense>
            <v-icon class="title_font_color toolbar_icon_size">view_list</v-icon> <span class="toolbar_font_size">구매이력</span>
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
      <div style="height:5px"></div>
        <v-data-table 
          :headers="headersHistory"          
          :items="CompanyBuyList"
          class="std_datatable"
          :loading="loading"
          loading-text="Loading... Please wait"
          dense      
          hide-default-footer
          :items-per-page="itemPerPage" 
          :page.sync="page"       
          @page-count="pageCount = $event"
        > 
         <template v-slot:item="{ item }">
        <tr>        
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.PRODUCT_CLASS">{{ item.PRODUCT_CLASS }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.PRODUCT_GROUP">{{ item.PRODUCT_GROUP }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.PRODUCT_SUBCLASS">{{ item.PRODUCT_SUBCLASS }}</div></td>
          <td><div style="width: 250px;" class="myellipsisbox" :title="item.PRODUCT_NAME">{{ item.PRODUCT_NAME }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.CORPORATE_NAME">{{ item.CORPORATE_NAME }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.WORKPLACE_NAME">{{ item.WORKPLACE_NAME }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.IN_COUNTRY">{{ item.IN_COUNTRY }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.IN_DAY">{{ item.IN_DAY }}</div></td>
          <td align="right"><div style="width: 80px;" class="myellipsisbox" :title="item.IN_QTY">{{ item.IN_QTY }}</div></td>
          <td align="center"><div style="width: 80px;" class="myellipsisbox" :title="item.IN_UNIT">{{ item.IN_UNIT }}</div></td>
          <td><div style="width: 250px;" class="myellipsisbox" :title="item.IN_COMPANY_NAME">{{ item.IN_COMPANY_NAME }}</div></td>
          <td><div style="width: 80px;" class="myellipsisbox" :title="item.MANAGER">{{ item.MANAGER }}</div></td>
          <td><div style="width: 100px;" class="myellipsisbox" :title="item.MANAGER_TEL">{{ item.MANAGER_TEL }}</div></td>
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
    
  </div>
  </v-dialog>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
//import PageDataTable from '@/components/DataTable/PageDataTable_2'

export default {
  data: () => ({
    CompanyInfo : [],     //게시물 리스트
    CompanyBuyList : [],     //게시물 리스트
    IsShowDlg : false,        //다이얼로그 표시여부 
    page : 1,    
    pageCount: 0,
    itemPerPage: 10,
    totalVisible: 10,
    SearchText: {      //검색조건
          COMPANY_CODE:'',       //업체코드
          COMPANY_ID:'',  //업체 ID
        },
    headersCompany: [
        { text: '업체명', value: 'COMPANY_NAME',width:'200px',align: 'center' },
        { text: '대표자명',value: 'REPRESENTATIVE', width:'100px',align: 'center'},
        { text: '사업자록번호',value: 'COMPANY_REGIST_NO', width:'130PX', align: 'center'},
        { text: '업태', value: 'INDUSTRY_CONDTION', align: 'center'},
        { text: '업종', value: 'INDUSTRY_TYPE', align: 'center'},
        { text: '업체주소', value: 'ADDRESS', align: 'center'},
        { text: '국가', value: 'COUNTRY', align: 'center'},
        { text: '구매규모', value: 'BUY_SCALE', align: 'center'},        
        { text: '전화번호', value: 'TEL_NO', align: 'center'},
        { text: '신용등급', value: 'CREDIT_GRADE', align: 'center'},
        //{ text: '평가점수', value: 'SCORE', align: 'center'},
        //{ text: '담당자', value: 'MANAGER', align: 'center'},
        //{ text: '담당자전화번호', value: 'MANAGER_TEL', align: 'center'},
      ],
    headersHistory: [
        { text: '대분류', value: 'PRODUCT_CLASS',width:'100px', align: 'center'},
        { text: '중분류',value: 'PRODUCT_GROUP',width:'100px', align: 'center'},
        { text: '소분류',value: 'PRODUCT_SUBCLASS',width:'100px', align: 'center'},
        { text: '제품명',value: 'PRODUCT_NAME',width:'250px', align: 'center'},
        { text: '주문법인', value: 'CORPORATE_NAME', width:'100px', align: 'center'},
        { text: '주문사업장', value: 'WORKPLACE_NAME',width:'100px', align: 'center'},
        { text: '국가', value: 'IN_COUNTRY', width:'100px', align: 'center'},
        { text: '입고일자', value: 'IN_DAY',width:'100px', align: 'center'},
        { text: '입고량', value: 'IN_QTY',width:'80px', align: 'center'},
        { text: '단위', value: 'IN_UNIT', width:'80px',align: 'center'},
        { text: '업체명', value: 'IN_COMPANY_NAME',width:'250px', align: 'center'},
        { text: '담당자', value: 'MANAGER', width:'80px', align: 'center'},
        { text: '전화번호', value: 'MANAGER_TEL', width:'100px', align: 'center'},
        
      ],
    loading : true,
    

  }),
  computed:{},
      
  /*created : async function(){    
      

      await this.selectCompanyBuyList(); //게시물 리스트를 가져온다.
      await this.selectCompanyInfoList(); //업체정보 리스트를 가져온다.
     
      this.page = Number(this.$route.params.page);

      
    
  },*/
  methods: {
      selectCompanyBuyList : function(){   //전체 게시물 리스트를 가져온다.        



        return axios.post(`${CONST.HOST_ADDR}/companybuylist/selectCompanyBuyCompanyList`, this.SearchText).then(
          (ret)=>{                         
            this.CompanyBuyList = ret.data;
            //this.page = Number(this.$route.params.page);
            this.loading = false;  
          }
          
        );
             
      }, 
      selectCompanyInfoList : function(){   //전체 주문법인 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/selectCompanyInfoList`,this.SearchText).then(
          (ret)=>{                         
            this.CompanyInfo = ret.data;
            this.loading = false;  
          }
          
        );
             
      }, 
      dlgClose(){ //다이얼로그를 닫는다.
            this.IsShowDlg = false;
        },
      ShowDlg(item){  //다이얼로그를 출력한다.        
        //초기화
        //this.UserData = item;          
        
        this.SearchText = item;
        this.selectCompanyInfoList(); //업체정보 리스트를 가져온다.                                  
        this.selectCompanyBuyList(); //업체정보 리스트를 가져온다.
        this.IsShowDlg = true;            
      },
      ExcelDownload: async function()
      {            
        this.$GET_EXCEL_FILE(this.headersHistory, this.CompanyBuyList);  //엑셀 파일을 다운로드 받는다.                        
      },   
      
  }    
}
</script>

<style scoped>
  .bg_gray {
    background : whitesmoke
  }
  .shrink{
    width: 600px;
  }
  .shrink1{
    width: 400px;
  } 

  .cursor_p tbody tr {
    cursor: auto !important;    
    border: 1px solid #c2edf8;        
  }
</style>
<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    ::v-deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>