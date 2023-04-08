<template>
  <v-dialog
    v-model="IsShowDlg"
    persistent
    max-width="1000"
    max-height="500"
  >
  <!-- <div class="pt-1"> -->
              <!-- 테이블 정보 -->
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
              <v-toolbar-title dense>
                <v-icon class="title_font_color toolbar_icon_size">info</v-icon> <span class="toolbar_font_size">업체정보</span>                         
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
            <div style="height:600px">
            
            
            <v-card-text>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>업체명</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                      v-model="CompanyInfoData.COMPANY_NAME" 
                      readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>관리법인</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoData.CORPORATE_NAME" 
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>사업자등록번호</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.COMPANY_REGIST_NO" 
                      readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>대표자명</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoData.REPRESENTATIVE"
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item6">
                  <v-subheader>주소</v-subheader>
                </div>
                <div class="flex-item85">
                  <v-text-field
                  v-model="CompanyInfoData.ADDRESS"
                  readonly
                  hide-details="auto"
                  dense
                  ></v-text-field>
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>국가</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.COUNTRY"
                   readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>전화번호</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoData.TEL_NO"
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>업태</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.INDUSTRY_TYPE"
                   readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>업종</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoData.INDUSTRY_CONDTION"
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>구매규모</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.BUY_SCALE"
                   readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>거래이력 건수</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoDataNew.BUYCOUNT"
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>
              </div>
              <div class="flex-container">
                <div class="flex-item4">
                  <v-subheader>신용평가 업체</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.CREDIT_NAME"
                   readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div>
                <div class="flex-item4">
                  <v-subheader>신용평가등급</v-subheader>
                </div>
                <div class="flex-item5">
                  
                      <v-text-field
                      v-model="CompanyInfoData.CREDIT_GRADE"
                      readonly
                      hide-details="auto"
                      dense
                      ></v-text-field>
                     
                </div>                
              </div>
              <div style="height:10px"></div>
              <div class="flex-container">
                  <div style="width:60%;height:250">
                      <v-toolbar
                      flat
                      dense
                      :height="this.$vuetify.toolbar_height"
                      class="title_font_color"                      
                      >
                        <v-toolbar-title dense>
                          <v-icon class="title_font_color toolbar_icon_size">info</v-icon> <span class="toolbar_font_size">평가정보</span>                               
                        </v-toolbar-title>
                      </v-toolbar>
                      
                      <BarChart 
                        :chart-data="DataList"
                        :height="250"
                        @OnClick="OnClick"
                        cursor
                      />
                  </div>
                  <div class="flex-item1"></div>
                  <div style="width:40%;height:300px">
                  <v-toolbar
                      flat
                      dense
                      :height="this.$vuetify.toolbar_height"
                      class="title_font_color"                      
                      >
                      <v-toolbar-title dense>
                        <v-icon class="title_font_color toolbar_icon_size">report_problem</v-icon> <span class="toolbar_font_size">평가정보상세</span>                          
                      </v-toolbar-title>
                      <v-spacer />            
                    </v-toolbar>
                      <div style="height:10px"></div>
                      <v-data-table 
                      :headers="headersNew"
                      :items="EstimationList"
                      class="std_datatable"
                      :loading="loading"
                      loading-text="Loading... Please wait"
                      dense      
                      hide-default-footer
                      height="250"
                      fixed-header
                      :header-props="{ sortIcon: null }"
                    > 
              
                    <template v-slot:item="{ item }">
                      <tr>
                        <td 
                          width="180" 
                          align="center"
                          ><div style="width: 180px;" class="myellipsisbox" :title="item.RATING_ITEM">{{ item.RATING_ITEM }}</div></td>
                        <td 
                          width="80" 
                          align="right"
                          ><div style="width: 80px;" class="myellipsisbox" :title="item.SCORE">{{ item.SCORE }}</div></td>
                        <td 
                          width="80" 
                          align="center"
                          ><div style="width: 80px;" class="myellipsisbox" :title="item.ITEM">{{ item.ITEM }}</div></td>
                      </tr>
                    </template>
                  
                    </v-data-table>
                  </div>
                  
              </div>  
              <div style="text-align:right;"> 
                
                <v-btn
                  text
                  color="primary"  
                  @click="dlgClose"                    
                >
                  닫기
                </v-btn>
              </div> 
            </v-card-text>            
          </div>        
          </v-card>
        
    <!-- </div> -->
  
</v-dialog>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
//import PageDataTable from '@/components/DataTable/PageDataTable_2'
// import CompanyBuyListDetail from './CompanyBuyListDetail.vue';
import BarChart from '@/components/Barchart.vue';

export default {
  components: {
      BarChart,
    },
  data: () => ({
    chartOptions : {},
    IsShowDlg : false,        //다이얼로그 표시여부 
    DataList : {}, 
    labelList : [],
    valueList : [],
    CompanyInfoList : [],     //게시물 리스트
    coperList : [],
    EstimationList : [], //평가정보
    IssueList : [], //이슈리스트
    SearchText: {
          IN_COMPANY_NAME: '',  //업체명
          CORPORATE_ID : '', //법인명
        },          //넘어온 검색어??
    CompanyInfoData:{
      COMPANY_ID : '',
      CORPORATE_ID : '',
      WORKPLACE_ID : '',
      COMPANY_CODE : '',
      COMPANY_NAME : '',
      REPRESENTATIVE : '',
      COMPANY_REGIST_NO : '',
      INDUSTRY_CONDTION : '',
      INDUSTRY_TYPE : '',
      ADDRESS : '',
      TEL_NO : '',
      COUNTRY : '',
      CORPORATE_NAME : '',
      MANAGER : '',
      MANAGER_TEL : '',
      CREDIT_NAME : '',
      CREDIT_GRADE : '',
      BUYCOUNT : '',
      BUY_SCALE : '',
      SYEAR : '',
    },
    CompanyInfoDataNew:{
      BUYCOUNT : '',
      BUY_SCALE : '',
    },
    page : 1,    
    pageCount: 0,
      itemPerPage: 20,
      totalVisible: 10,
     headers: [
          { text: '법인명', value: 'CORPORATE_NAME', align: 'center',width:'120px'},
          { text: '업체코드', value: 'WORKPLACE_NAME', align: 'center',width:'120px'},
          { text: '업체명', value: 'COMPANY_NAME', align: 'center',width:'250px'},
        ],
    headersNew: [
          { text: '항목', value: 'RATING_ITEM', align: 'center',width:'180px'},
          { text: '점수', value: 'SCORE', align: 'center',width:'80px'},
          { text: '평가년도', value: 'ITEM', align: 'center',width:'80px'},
        ],
    headersissue: [
          { text: '이슈', value: 'CONTENT', align: 'center'},
        ],
    loading : true,
    open : false,

    SelectedCompanyCode : '',   //현재 선택된 업체코드

  }),
  computed:{},
      
  
  methods: {
      selectIssueList : function(){   //전체 게시물 리스트를 가져온다.        

        return axios.post(`${CONST.HOST_ADDR}/companyInfolist/selectIssueList`, this.CompanyInfoData).then(
          (ret)=>{                         
            this.IssueList = ret.data;
            this.loading = false;  
          }
          
        );
             
      }, 
      selectCompanyInfoList : function(){   //전체 게시물 리스트를 가져온다.        
        if(this.SearchText.IN_COMPANY_NAME == null || this.SearchText.IN_COMPANY_NAME == ''){
          this.SearchText.IN_COMPANY_NAME = "";
          //this.SearchText.COMPANY_CODE = '';
        }

        return axios.post(`${CONST.HOST_ADDR}/companyInfolist/selectCompanyInfoList`, this.SearchText).then(
          (ret)=>{                         
            this.CompanyInfoList = ret.data;
            this.page = Number(this.$route.params.page);
            this.loading = false;  
            
            if(ret.data.length == 1){
              this.CompanyInfoData = ret.data[0];
              this.selectCompanyInfoListScore(); 
              console.log("ret.data.length1:"+ret.data.length);
              //this.goDtl2(ret.data[0]);
              this.SearchText.COMPANY_CODE = '';
            }
          }
          
        );
             
      }, 
      OnClick(event){ //상세정보를 표시한다.
          console.log("event:"+this.labelList[event]);
          this.CompanyInfoData.SYEAR = this.labelList[event];

          return axios.post(`${CONST.HOST_ADDR}/companyInfolist/estimationList`, this.CompanyInfoData).then(
          (ret)=>{                         
            this.EstimationList = ret.data;
            this.loading = false;  
          }
          
        );
        
        }, 
      selectcoperList : function(){   //전체 게시물 리스트를 가져온다.        

        return axios.post(`${CONST.HOST_ADDR}/companyInfolist/coperList`, this.SearchText).then(
          (ret)=>{                         
            this.coperList = ret.data;
          }
          
        );
             
      }, 
      selectCompanyInfoListScore : function(){
        console.log("this.CompanyInfoData:"+this.CompanyInfoData.CORPORATE_ID)  
      return axios.post(`${CONST.HOST_ADDR}/companyInfolist/selectCompanyInfoListScore`, this.CompanyInfoData).then(
          (ret)=>{
               this.CompanyInfoData.SCORE = ret.data[0].SCORE;
               this.CompanyInfoDataNew.BUYCOUNT = ret.data[0].BUYCOUNT;
               console.log("ghkdfkdslaf");
            }
          
        );
      },
      selectestimationGraph: function(){
        
        this.EstimationList = [];
        this.labelList = [];
        this.valueList = [];
        var valueListNew = [];
        this.DataList = {labels:this.labelList,datasets: [ { label: '평가정보',backgroundColor:'rgba(0,172,213,0.6)'
                ,borderColor:"#0081C4",borderWidth:2,data: this.valueList } ]};
        return axios.post(`${CONST.HOST_ADDR}/companyInfolist/estimationGraph`, this.CompanyInfoData).then(
          (ret)=>{
               for(var i =0; i < ret.data.length; i++){
                  this.labelList.push(ret.data[i].ITEM);
                  this.valueList.push(ret.data[i].VALUE);
               }
               Object.assign(valueListNew, this.valueList);
              console.log()
              //valueListNew = this.valueList;

              this.DataList = {
                labels: this.labelList,
                datasets: [ { label: '평가정보',backgroundColor:'rgba(0,172,213,0.6)'
                ,borderColor:"#0081C4",borderWidth:2,barPercentage : 0.4,data: this.valueList } ]
              };
               
            }
            
        );   
      },
      
      dlgClose(){ //다이얼로그를 닫는다.
          this.IsShowDlg = false;
      },
      ShowDlg(item){  //다이얼로그를 출력한다.  
        this.CompanyInfoData = [];      
        this.SelectedCompanyCode  = item.IN_COMPANY_CODE;
        this.SearchText.COMPANY_CODE = item.IN_COMPANY_CODE;
        this.SearchText.CORPORATE_ID = item.CORPORATE_ID;

        this.selectCompanyInfoList();

        
        console.log(item.CORPORATE_ID);
        this.CompanyInfoData = item;
        this.CompanyInfoData.CORPORATE_ID = item.CORPORATE_ID;
        this.CompanyInfoData.COMPANY_CODE = item.IN_COMPANY_CODE;
        this.CompanyInfoData.SYEAR = "";
        //this.SearchText.COMPANY_NAME = item.COMPANY_NAME;
        console.log("item.CORPORATE_ID:"+item.CORPORATE_ID);
       this.selectCompanyInfoListScore(); 
       this.selectestimationGraph();
        
       this.IsShowDlg = true;
                
      }
       
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

  .flex-container{
      display: flex;
  }
  .flex-item{
      width: 35%;
      
      
  }

  .flex-item1{
      width: 1%;
      height: 20%;
      margin: 5px;
  }
   .flex-item3{
      width: 63%;
      
  }

   .flex-item4{
      width: 30%;      
  }
 .flex-item5{
      width: 70%;
  }
  .flex-item6{
      width: 15%;      
  }

   .flex-item85{
      width: 85%;
  }

 
</style>

<style scoped lang="scss">
  @import "@/assets/scss/config.scss";          
   ::v-deep(.v-toolbar--dense .v-toolbar__content)
   {
     background-color: $sub-title-backgroundcolor !important;
   }  
</style>