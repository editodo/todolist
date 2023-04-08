<template>
  <div class="pt-1">
    <div class="flex-container">
        <div class="flex-item">
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
                <v-icon class="title_font_color toolbar_icon_size">search</v-icon> <span class="toolbar_font_size">업체리스트</span>                          
              </v-toolbar-title>
            </v-toolbar>
            
            <v-card-text>
              
            <div class="d-flex justify-space-between">
                
                <span class="px-2">
                  <v-text-field                
                    v-model="SearchText.COMPANY_NAME"
                    label="업체명"
                    prepend-inner-icon="search"
                    dense
                    clearable
                    @keyup.enter="selectCompanyInfoList()" 
                    />
                </span>
                <span class="px-2">
                  <v-select      
                  v-model="SearchText.CORPORATE_ID"      
                  :items="coperList"      
                  item-text="CORPORATE_NAME"      
                  item-value="CORPORATE_ID"      
                  label="주문법인"     
                  prepend-icon="search" 
                  dense      
                  />
                </span>               
                <span>          
                  <v-btn
                    class="primary"
                    @click="selectCompanyInfoList"
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
                :items="CompanyInfoList"
                class="std_datatable cursor_p"
                :loading="loading"
                loading-text="Loading... Please wait"
                dense      
                hide-default-footer
                :items-per-page="itemPerPage" 
                :page.sync="page"       
                @page-count="pageCount = $event"
                height="600"
                fixed-header
              > 
        
            <template v-slot:item="{ item }">
              <tr 
                @click="goDtl2(item)"
                :class="{active_row:(item.COMPANY_CODE == SelectedCompanyCode)}"                    
                >
                <td><div style="width: 120px;" class="myellipsisbox" :title="item.CORPORATE_NAME">{{ item.CORPORATE_NAME }}</div></td>
                <td><div style="width: 120px;" class="myellipsisbox" :title="item.COMPANY_CODE">{{ item.COMPANY_CODE }}</div></td>
                <td><div style="width: 250px;" class="myellipsisbox" :title="item.COMPANY_NAME">{{ item.COMPANY_NAME }}</div></td>
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
          </v-card>

        </div>
        <div class="flex-item1"></div>
        <div class="flex-item3">
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
            </v-toolbar>
            
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
                <!-- <div class="flex-item4">
                  <v-subheader>담당자</v-subheader>
                </div>
                <div class="flex-item5">
                   <v-text-field
                   v-model="CompanyInfoData.MANAGER"
                   readonly
                      hide-details="auto"
                      dense
                        ></v-text-field>
                </div> -->
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
              <!-- <div class="flex-container">                
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
                </div>                
                <div class="flex-item5">
                </div>                                
              </div> -->
              <div style="height:10px"></div>
              <div class="flex-container">
                <div style="width:60%">
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
                        :height="300"
                        @OnClick="OnClick"
                        cursor
                      />
                  </div>
                  <div class="flex-item1"></div>
                  <div style="width:40%;">
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
                      height="300"
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
                  
                  <!-- <v-data-table 
                      :headers="headersNew"
                      :items="EstimationList"
                      class="std_datatable cursor_p"
                      :loading="loading"
                      loading-text="Loading... Please wait"
                      dense      
                      hide-default-footer
                      height="150"
                      fixed-header
                    > 
              
                  <template v-slot:item="{ item }">
                    <tr>
                      <td width="80">{{ item.DISTRIBUTE }}</td>
                      <td width="80">{{ item.RATING_ITEM }}</td>
                      <td width="200">{{ item.SCORE }}</td>
                      <td width="120">{{ item.YEAR }}</td>
                    </tr>
                  </template>
                  
                    </v-data-table> -->
            </v-card-text>
          </v-card>
        </div>
    </div>
    
<!-- 
    <CompanyBuyListDetail
      ref="CompanyBuyListDetail" 
    /> -->
    <addIssueDlg
      ref="addIssueDlg" 
      @SaveOK="addIssueProc"
    />
    <modifyIssueDlg
      ref="modifyIssueDlg" 
      @SaveOK="modifyIssueProc"
      @DeleteOK="deleteSystemFlag"
    />

  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
//import PageDataTable from '@/components/DataTable/PageDataTable_2'
// import CompanyBuyListDetail from './CompanyBuyListDetail.vue';
import BarChart from '@/components/Barchart.vue';
import addIssueDlg from './addIssueDlg'
import modifyIssueDlg from './modifyIssueDlg'

export default {
  components: {
      BarChart,
      addIssueDlg,
      modifyIssueDlg,
      // CompanyBuyListDetail    
    },
  data: () => ({
    chartOptions : {},
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
      
  created : async function(){    
      console.log(this.$route.params.searchText);
      if( !this.$route.params.searchText )
      {
        //비어있다.
        this.SearchText.COMPANY_CODE = '';
      }
      else
      {
        this.SearchText.COMPANY_CODE = this.$route.params.searchText;
      }

      await this.selectCompanyInfoList(); //게시물 리스트를 가져온다.
      await this.selectcoperList(); //게시물 리스트를 가져온다.
      await this.selectIssueList(); //이슈 리스트를 가져온다.

      this.page = Number(this.$route.params.page);

      
    
  },
  methods: {
      selectIssueList : function(){   //전체 게시물 리스트를 가져온다.        

        return axios.post(`${CONST.HOST_ADDR}/companyInfolist/selectIssueList`, this.CompanyInfoData).then(
          (ret)=>{                         
            this.IssueList = ret.data;
            this.loading = false;  
          }
          
        );
             
      }, 
      detail(item){ //상세정보를 표시한다.
          console.log(item);
          var cloneItem = {};
          Object.assign(cloneItem, item); //복사해서 넣는다.
          
          this.$refs.modifyIssueDlg.ShowDlg(cloneItem);
          
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
              this.goDtl2(ret.data[0]);
              this.SearchText.COMPANY_CODE = '';
            }
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
      goDtl2 : function(item) //상세화면으로 이동한다.
      {
        
        this.SelectedCompanyCode  = item.COMPANY_CODE;

        this.EstimationList = [];
        this.labelList = [];
        this.valueList = [];
        var valueListNew = [];
        this.DataList = {labels:this.labelList,datasets: [ { label: '평가정보',backgroundColor:'rgba(0,172,213,0.6)'
                ,borderColor:"#0081C4",borderWidth:2,data: this.valueList } ]};
        
        this.CompanyInfoData = item;
        this.CompanyInfoData.SYEAR = "";
        //this.SearchText.COMPANY_NAME = item.COMPANY_NAME;
        console.log("item.CORPORATE_ID:"+item.CORPORATE_ID);
       this.selectCompanyInfoListScore(); 
        
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
        
        //this.$refs.CompanyBuyListDetail.ShowDlg(item);
      },
      issueAdd : function() //상세화면으로 이동한다.
      {
        console.log(this.CompanyInfoData);
        this.$refs.addIssueDlg.ShowDlg(this.CompanyInfoData); 
        //this.$refs.CompanyBuyListDetail.ShowDlg(item);
      },
      
      addIssueProc(IssueInfo){  //이슈 추가 처리
          axios.post(`${CONST.HOST_ADDR}/companyInfolist/updateIssue`, IssueInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectIssueList();  //화면 갱신
                }
            }
          );               
      },
      modifyIssueProc(IssueInfo){ //이슈 수정 처리
          //console.log('modifyCoperProc');
          //console.log(UserInfo);
          axios.post(`${CONST.HOST_ADDR}/companyInfolist/updateIssue`, IssueInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectIssueList();  //화면 갱신
                }
            }
          );               
      },
      deleteSystemFlag(IssueInfo)
        {
          axios.post(`${CONST.HOST_ADDR}/companyInfolist/deleteIssue`, IssueInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectIssueList();  //화면 갱신
                }
            }
          );               

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
      height: 100%;
      
  }

  .flex-item1{
      width: 1%;
      height: 50%;
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

  .theme--light.v-subheader {
    font-weight: 700 !important;
}
</style>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    ::v-deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  
</style>
