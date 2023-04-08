
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
          <v-icon class="title_font_color toolbar_icon_size">bar_chart</v-icon> <span class="toolbar_font_size">법인별 구매집계</span>
        </v-toolbar-title>
        <v-spacer />            
        <!--필요시 여기에 버튼을 넣는다. -->
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
            >

            
              <span 
              class="pt-1" 
              style="max-width:250px;"
              >

                <CSelectBox                 
                  v-model="SearchCond.CORPORATE_ID"                        
                  label="법인"  
                  dense
                  prepend-icon="search"                               
                  item-text="CORPORATE_NAME"      
                  item-value="CORPORATE_ID"      
                  source-url="/Common/CoperList"
                />
              </span>


              <seldate
                v-model="SearchCond.fromDate"
                label="From Date"                                
                v-if="(SearchCond.Type == 'DAY')"
              />

              <seldate
                v-model="SearchCond.toDate"
                label="To Date"                
                today
                v-if="(SearchCond.Type == 'DAY')"
              />

              <span 
                v-if="(SearchCond.Type == 'MONTH')"
                >
                <seldate
                  v-model="SearchCond.fromMonth"
                  label="From Month"
                  type="month"
                />
              </span>
              <span 
                v-if="(SearchCond.Type == 'MONTH')"
                >
                <seldate
                  v-model="SearchCond.toMonth"
                  label="To Month"
                  type="month"
                />
              </span>

              <div>                
                <v-radio-group 
                    v-model="SearchCond.Type"
                    mandatory
                    row                    
                    >
                    <v-radio                                    
                      label="일별"
                      value="DAY"
                    ></v-radio>
    
                    <v-radio                                    
                      label="월별"
                      value="MONTH"
                    ></v-radio>
                  </v-radio-group>
              </div>
                         
            </div>                              
            <v-btn
              color="primary"
              @click="searchProc"
            >
              <v-icon>
                search
              </v-icon>
              조회
            </v-btn>
          </div>        
          <v-row>
            <v-col>

              <v-card          
                color="card_background"    
              >
                <v-toolbar       
                  flat        
                  dense             
                  class="title_font_color"
                  :height="this.$vuetify.toolbar_height"
                >
                  <v-toolbar-title dense>
                    <v-icon class="title_font_color toolbar_icon_size">toc</v-icon> 
                    <span class="toolbar_font_size">구매집계 List</span>
                  </v-toolbar-title>
                  <v-spacer /> 
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
                  <v-simple-table
                    dense
                    fixed-header
                    height="calc(50vh - 220px)" 
                    class="std_datatable"                   
                  >
                    <thead>
                      <tr>
                        <th 
                          class="text-center"
                          width="200px" 
                          >
                          법인
                        </th>
                        <th 
                          class="text-center"
                          width="150px"
                        >
                          입고월(일)
                        </th>
                        <th 
                          class="text-center"
                          width="200px"
                          >
                          금액
                        </th>
                        <th 
                          class="text-center"
                          width="150px"
                          >
                          거래건수
                        </th>
                        <th>

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="(item, index) in TableList"
                        :key="index"  
                        :class="{bg_gray :((index % 2) == 0 )}"                    
                      >
                        <td>
                          {{ item.CORPORATE_NAME }}
                        </td>
                        <td class="text-center">
                          {{ item.IN_DAY }}
                        </td>
                        <td class="text-right">
                          {{ item.IN_AMOUNT | makeComma | deleteDecPoint }}
                        </td>
                        <td class="text-right">
                          {{ item.BUY_COUNT | makeComma | deleteDecPoint}}
                        </td>
                        <td>

                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>                            
            </v-col>
          </v-row>

          <v-row>
            <v-col>

              <v-card
                 color="card_background"    
              >
                <v-toolbar       
                    flat        
                    dense             
                    class="title_font_color"
                    :height="this.$vuetify.toolbar_height"
                  >
                    <v-toolbar-title dense>
                      <v-icon class="title_font_color toolbar_icon_size">bar_chart</v-icon> 
                      <span class="toolbar_font_size">구매집계 그래프</span>
                    </v-toolbar-title>
                    <v-spacer />                              
                </v-toolbar>
                <v-card-text>

                  <BarChart
                    :chart-data="ChartDataList"
                    :height="255" 
                    @OnClick="ChartClick"                   
                  />
                </v-card-text>
              </v-card>
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
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'
import BarChart from '@/components/Barchart.vue';

export default {
    components: {
      BarChart,
      seldate,
      CSelectBox
    },
    data: () => ({
        TableList:[],     
        ChartDataList : {},      //차트 데이터
        fromMenu: false,
       
        SearchCond : {
            CORPORATE_ID : '',    //법인코드
            fromDate : '',        //시작일(일자)
            toDate:'',            //종료일(일자)
            fromMonth : '',       //시작월
            toMonth:'',           //종료월
            Type: 'DAY',             //일별(DAY) or 월별(MONTH)
        }
    }),
    computed:{

    },
    created : function(){        
      this.SearchCond.fromDate = this.$moment().add(-6, 'months').format('YYYY-MM-DD');

      this.SearchCond.fromMonth = this.$moment().add(-6, 'months').format('YYYY-MM');
      this.SearchCond.toMonth = this.$moment().format('YYYY-MM');
      
    },
    methods : {
        //여기에 함수들
        makeChartData(){

           //차트 데이터를 생성한다.

            var labelList = [];
            var valueList = [];
            //var countList = [];

             for(var i =0; i < this.TableList.length; i++)
             {
                  labelList.push(this.TableList[i].IN_DAY);

                  valueList.push(this.TableList[i].IN_AMOUNT);
                  //countList.push(this.TableList[i].BUY_COUNT);
              }
              
              this.ChartDataList = {
                labels: labelList,
                datasets: [ { label: '구매금액 (단위 : 원)'
                              ,backgroundColor:'rgba(0,172,213,0.6)'
                              ,borderColor:"#0081C4"
                              ,borderWidth:2
                              ,data: valueList },

                              // { label: '구매건수 (단위 : 건)'
                              // ,backgroundColor:'rgba(0,55,213,0.6)'
                              // ,borderColor:"#0081C4"
                              // ,borderWidth:2
                              // ,data: countList }
                              
                              ], 
               
                              
              };

        },
        searchProc(){

            if(this.SearchCond.CORPORATE_ID == '')
            {
                this.$root.$toastmsg.ShowError('법인을 선택 바랍니다.');  //결과를 화면에 뿌린다.                                                            
                return;
            }            

            if(this.SearchCond.Type == 'DAY')
            {
              //일자별조회
              axios.post(`${CONST.HOST_ADDR}/BuyStatistics/selectBuyList_Day`, this.SearchCond).then(
                (ret)=>{
              
                    this.TableList = ret.data;
                    this.makeChartData();
                }
              );                     
            }
            else
            {
              //월별 조회
              axios.post(`${CONST.HOST_ADDR}/BuyStatistics/selectBuyList_Month`, this.SearchCond).then(
                (ret)=>{              
                    this.TableList = ret.data;

                    this.makeChartData();

                }
              );                     
            }
        },
        ExcelDownload: async function()
          {            

             var headers = [
                { text: '법인', value: 'CORPORATE_NAME'},
                { text: '입고월(일)',value: 'IN_DAY'},
                { text: '금액', value: 'IN_AMOUNT', type:'Double'},
                { text: '거래건수', value: 'BUY_COUNT' ,type:'Double'},          
             ];

            this.$GET_EXCEL_FILE(headers, this.TableList);  //엑셀 파일을 다운로드 받는다.

          },
          ChartClick: function(event, point)
          {

            console.log('차트가 클릭됨');
            console.log(event);
            console.log(point);

          }

    }

}
</script>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  

    .v-input--selection-controls 
    {
      margin-top: 4px;
    }
</style>