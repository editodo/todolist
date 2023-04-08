<!-- eslint-disable -->
<template>  

  <div class="pt-1">
    <v-card        
      color="card_background"
      class="baseheight"
    >
    <div style="height:10px"></div>
     <div class="d-flex justify-space-between">
          <span class="px-2">
            <v-text-field                
              v-model="SearchText.searchData"
              label="제품 KeyWord,업체명,국가,등"                    
              prepend-inner-icon="search"
              dense
              clearable
              class="shrink"
              outlined
              v-on:keyup.enter="selectCompanyBuyList()"
            />
          </span>
          <span class="px-2">
            <v-text-field                
               v-model="SearchText.searchData1"
              label="결과내 재검색"                    
              prepend-inner-icon="search"
              dense
              clearable
              class="shrink1"
              outlined
              v-on:keyup.enter="selectCompanyBuyList()"
            />
          </span>            
           <span style="width:400px">
            
          </span> 
          
        </div>
     <v-toolbar
        flat
        dense
        :height=this.$vuetify.toolbar_height
        class="title_font_color"
        outlined       
      >
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">search</v-icon> <span class="toolbar_font_size">업체별 구매이력</span>          
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
      
      <v-card-text>
        
      <div class="d-flex justify-space-between">
        <span class="px-2" style="width:200px">
            <v-select      
            v-model="SearchText.CORPORATE_ID"
            class="pa-0"
            :items="coperList"      
            item-text="CORPORATE_NAME"      
            item-value="CORPORATE_ID"      
            label="주문법인"     
            prepend-icon="search" 
            dense      
            v-on:change="corporateChange"
            />
          </span>  
        <span
            class="px-2"
            style="width:170px"
          >
            <v-select
              v-model="SearchText.PRODUCT_GROUP"
              class="pa-0"                
              label="대분류"  
              prepend-icon="search"
              :items="product_group_List"
              item-text="PRODUCT_GROUP"      
            item-value="PRODUCT_GROUP"
            dense
            v-on:change="productclassChange"
            />              
          </span>
          <span
            class="px-2"
            style="width:170px"
          >
            <v-select
              v-model="SearchText.PRODUCT_CLASS"
              class="pa-0"                
              label="중분류"  
              prepend-icon="search"
              :items="product_class_List"
              item-text="PRODUCT_CLASS"      
            item-value="PRODUCT_CLASS"
            dense
            v-on:change="productgroupChange"
            />              
          </span>
           <span
            class="px-2"
            style="width:170px"
          >
            <v-select
              v-model="SearchText.PRODUCT_SUBCLASS"
              class="pa-0"                
              label="소분류"  
              prepend-icon="search"
              :items="product_subclass_List"
              item-text="PRODUCT_SUBCLASS"      
            item-value="PRODUCT_SUBCLASS"
            dense
            />              
          </span>
          <span
            class="px-2"
            style="width:250px"
          >
            
            <CMultiSelectBox 
                v-model="SearchText.IN_COUNTRY"
                class="pa-0"                
                label="국가"  
                dense
                prepend-icon="search"                               
                item-text="IN_COUNTRY"      
                item-value="IN_COUNTRY"      
                source-url="/companybuylist/countryList"    
              />

          </span>
            
          <span class="px-2" style="width:150px">
            <v-select
              v-model="SearchText.WORKPLACE_NAME"
              :items="workplaceList"
              class="pa-0"                
              label="주문사업장"  
              prepend-icon="search"
              item-text="WORKPLACE_NAME"      
              item-value="WORKPLACE_NAME" 
              dense
                
            />  
          </span>
          <span class="px-2">
            <v-text-field                
              v-model="SearchText.IN_COMPANY_NAME"
              class="pa-0"
              label="업체명"
              prepend-inner-icon="search"
              dense
              clearable
            />
          </span>             
          <span>          
            <v-btn
              class="primary"
              @click="selectCompanyBuyList"
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
        :items="CompanyBuyList"
        class="std_datatable"
        :loading="loading"
        loading-text="Loading... Please wait"
        dense      
        hide-default-footer
        :items-per-page="itemPerPage" 
        :page.sync="page"       
        @page-count="pageCount = $event"
        height="520"
        fixed-header                
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
              <td align="right"><div style="width: 80px;" class="myellipsisbox" :title="item.IN_QTY">{{ item.IN_QTY }}</div></td>
              <td align="center"><div style="width: 80px;" class="myellipsisbox" :title="item.IN_UNIT">{{ item.IN_UNIT }}</div></td>
              <td>
                <div style="width: 200px; cursor: pointer;" class="myellipsisbox1" :title="item.IN_COMPANY_NAME"  @click="goCompany(item)">{{ item.IN_COMPANY_NAME }}</div></td>
              <td 
                align="center" 
                valign="middel" 
                             
                >
                <!-- <img :src="require('@/assets/images/icon/web/search.png')" height="15px"> -->
                <v-icon 
                  color="orange darken-2"
                  style="cursor: pointer;"                
                  @click="goDtl2(item)"   
                >
                search
                </v-icon>
                </td>
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
            />          
        </div>
      </v-card-text>
    </v-card>
    <CompanyBuyListDetail
      ref="CompanyBuyListDetail" 
    />
    <CompanyInfoDetail
      ref="CompanyInfoDetail" 
    />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
//import PageDataTable from '@/components/DataTable/PageDataTable_2'
import CompanyBuyListDetail from './CompanyBuyListDetail.vue';
import CompanyInfoDetail from '../CompanyInfo/CompanyInfoDetail.vue';
import CMultiSelectBox from '@/components/SelectBox/CMultiSelectBox.vue'


export default {
  components: {
      CompanyBuyListDetail    
      ,CMultiSelectBox
      ,CompanyInfoDetail
    },
  data: () => ({
    CompanyBuyList : [],     //게시물 리스트
    coperList : [],
    workplaceList : [],
    countryList : [],
    product_group_List : [],
    product_class_List : [],
    product_subclass_List : [],
    SearchText: {
          searchData: '',     //검색어
          searchData1: '',     //결과내 검색
          IN_COMPANY_NAME: '',  //업체명
          CORPORATE_NAME: '전체',  //주문법인
          CORPORATE_ID: '전체',  //주문법인
          PRODUCT_CLASS: '전체',  //대분류
          PRODUCT_GROUP: '전체',  //중분류
          PRODUCT_NAME: '',  //제품명
          IN_COUNTRY: [],  //국가
          WORKPLACE_NAME : '',
          PRODUCT_SUBCLASS : '전체',
          IN_COMPANY_CODE : '',

        },          //넘어온 검색어??
    CompanyInfoText: {
          COMPANY_CODE: '',  //업체명
          COMPANY_NAME: '',  //주문법인
        },          //넘어온 검색어??
    page : 1,    
    pageCount: 0,
      itemPerPage: 15,
      totalVisible: 10,
     headers: [
          { text: '대분류', value: 'PRODUCT_CLASS', align: 'center',width:'100px'},
          { text: '중분류',value: 'PRODUCT_GROUP', align: 'center' ,width:'100px'},
          { text: '소분류',value: 'PRODUCT_SUBCLASS', align: 'center' ,width:'100px'},
          { text: '제품명',value: 'PRODUCT_NAME', align: 'center' ,width:'250px'},
          { text: '주문법인', value: 'CORPORATE_NAME', align: 'center' ,width:'100px'},
          { text: '주문사업장', value: 'WORKPLACE_NAME', align: 'center',width:'100px'},
          { text: '국가', value: 'IN_COUNTRY', align: 'center' ,width:'100px'},
          { text: '입고량', value: 'IN_QTY', align: 'center',width:'80px'},
          { text: '단위', value: 'IN_UNIT', align: 'center',width:'80px'},
          { text: '업체명', value: 'IN_COMPANY_NAME', align: 'center',width:'200px'},
          { text: '구매이력', value: '', align: 'center',width:'120px'},
        ],
    loading : true,
    open : false,

  }),
  computed:{
  conutryAll () {
      return this.countryList.length === this.SearchText.IN_COUNTRY.length
  },
  conutrySome () {
    return this.countryList.length > 0 && !this.conutryAll
  },

  },
      
  created : async function(){    
      console.log("test  :");

      console.log(this.$route.params.searchText);

      await this.selectcoperList(); //주문법인 리스트를 가져온다.

      if( !this.$route.params.searchText )
      {
        //비어있다.
        this.SearchText.searchData = '';
      }
      else
      {
        this.SearchText.searchData = this.$route.params.searchText;
        await this.selectCompanyBuyList(); //게시물 리스트를 가져온다.
      }
            
      //await this.selectworkplaceList(); //주문사업장 리스트를 가져온다.
      //wait this.selectcountryList(); //주문사업장 리스트를 가져온다.
      //await this.selectproduct_group_list(); //대분류 리스트
      //await this.selectproduct_class_list(); //중분류 리스트

      this.page = Number(this.$route.params.page);

      
    
  },
  methods: {
      selectCompanyBuyList : function(){   //전체 게시물 리스트를 가져온다.        

        if (this.SearchText.CORPORATE_ID == "전체"
          && this.SearchText.CORPORATE_NAME =="전체"
          && this.SearchText.IN_COMPANY_CODE == "" 
          && this.SearchText.IN_COMPANY_NAME == ""
          && this.SearchText.IN_COUNTRY.length == 0
          && this.SearchText.PRODUCT_CLASS == "전체"
          && this.SearchText.PRODUCT_GROUP == "전체"
          && this.SearchText.PRODUCT_SUBCLASS == "전체"
          && this.SearchText.PRODUCT_NAME == ""
          && this.SearchText.WORKPLACE_NAME == ""
          && this.SearchText.searchData == ""
          && this.SearchText.searchData1 == ""
          )
        {
          this.$root.$toastmsg.ShowError('검색어나 조회조건을 입력해 주세요.');
            return;
        }

        return axios.post(`${CONST.HOST_ADDR}/companybuylist/selectCompanyBuyListNew`, this.SearchText).then(
          (ret)=>{                         
            this.CompanyBuyList = ret.data;
            this.page = Number(this.$route.params.page);
            this.loading = false;  
          }
          
        );
             
      }, 
      selectcoperList : function(){   //전체 주문법인 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/coperList`,"").then(
          (ret)=>{                         
            this.coperList = ret.data;
          }
          
        );
             
      }, 
      selectworkplaceList : function(){   //전체 주문법인 리스트를 가져온다.  
        this.product_group_List = [];
        this.product_class_List = [];
        this.product_subclass_List = []    ;

        return axios.post(`${CONST.HOST_ADDR}/companybuylist/workplaceList`,this.SearchText.CORPORATE_ID).then(
          (ret)=>{                     
            
            this.workplaceList = ret.data;
            this.selectproduct_group_list();
          }
          
        );
             
      },   
      selectcountryList : function(){   //전체 국가 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/countryList`,"").then(
          (ret)=>{                         
            this.countryList = ret.data;
          }
          
        );
             
      },  
      selectproduct_group_list : function(){   //전체 대분류 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/product_group_list`,this.SearchText).then(
          (ret)=>{                         
            this.product_group_List = ret.data;
            
          }
          
        );
             
      }, 
      selectproduct_subclass_list : function(){   //전체 소분류 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/product_subclass_list`,this.SearchText).then(
          (ret)=>{                         
            this.product_subclass_List = ret.data;
            
          }
          
        );
             
      }, 
      selectproduct_class_list : function(){   //전체 중분류 리스트를 가져온다.   
        return axios.post(`${CONST.HOST_ADDR}/companybuylist/product_class_list`,this.SearchText).then(
          (ret)=>{                         
            this.product_class_List = ret.data;
          }
          
        );
             
      },        
      goDtl2 : function(item) //상세화면으로 이동한다.
      {
        this.$refs.CompanyBuyListDetail.ShowDlg(item);
      },
      goCompany : function(item) //상세화면으로 이동한다.
      {
        console.log("test:"+item);
        this.$refs.CompanyInfoDetail.ShowDlg(item);

        //this.CompanyInfoText.COMPANY_CODE = item.IN_COMPANY_CODE;
        //var url = "/companyInfo/" + this.CompanyInfoText.COMPANY_CODE ;
        //this.$router.push(url);       //화면이동
        
      },
      productclassChange : function(){
        this.selectproduct_class_list();
      },
      productgroupChange : function(){
        this.selectproduct_subclass_list();
      },
      
      corporateChange : function() //상세화면으로 이동한다.
      {
        this.selectworkplaceList();
        
        
      },
      checkAll() {
        this.$nextTick(() =>{
          console.log("ㅇㅁㄹㅇㅁㄴㄹ");
          if (this.conutryAll) {
            this.SearchText.IN_COUNTRY = []
          } else {
            this.SearchText.IN_COUNTRY = this.countryList.slice()
          }
        })
      },

      ExcelDownload: async function()
      {            
        this.$GET_EXCEL_FILE(this.headers, this.CompanyBuyList);  //엑셀 파일을 다운로드 받는다.                        
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
  
</style>
<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    ::v-deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>
